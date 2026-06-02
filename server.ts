import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import fs from 'fs';

// Initialize Firebase Firestore from local applet config
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let db: any = null;
if (fs.existsSync(configPath)) {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log('[Server] Firestore database initialized successfully: ', firebaseConfig.firestoreDatabaseId);
  } catch (err) {
    console.error('[Server] Failed to initialize Firestore SDK:', err);
  }
} else {
  console.warn('[Server] firebase-applet-config.json not found, running with in-memory persistence only.');
}

// Server-side in-memory shared state with default layouts
interface AlumnoState {
  id: string;
  name: string;
  joined: boolean;
  subgroupCode: string | null;
  isCreator: boolean;
  role?: 'emprendedor' | 'empleado' | 'estudiante' | null;
}

const INITIAL_JOINED_ALUMNOS: Record<string, AlumnoState> = {
  player_1: { id: 'player_1', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
  player_2: { id: 'player_2', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
  player_3: { id: 'player_3', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
};

const INITIAL_PLAYERS = {
  player_1: {
    id: 'player_1',
    name: 'Mati',
    role: 'emprendedor',
    roleName: 'El Emprendedor',
    balance: 50000,
    wellbeing: 80,
    capacitacion: 1,
    baseIncome: 80000,
    baseExpense: 30000,
    isSick: false,
    hasCeluSeguro: false,
    hasComercioSeguro: false,
    hasBeca: false,
    hasCoworkingUnification: false,
    hasMonotributoTech: false,
    monotributoScaleEscaped: false,
    hasVerazGoodBehavior: true,
    loanDebt: 0,
    pendingCard27Cuotas: 0,
    savingEmergencyFund: 0,
  },
  player_2: {
    id: 'player_2',
    name: 'Sofi',
    role: 'empleado',
    roleName: 'El Empleado',
    balance: 70000,
    wellbeing: 85,
    capacitacion: 2,
    baseIncome: 90000,
    baseExpense: 45000,
    isSick: false,
    hasCeluSeguro: false,
    hasComercioSeguro: false,
    hasBeca: false,
    hasCoworkingUnification: false,
    hasMonotributoTech: false,
    monotributoScaleEscaped: false,
    hasVerazGoodBehavior: true,
    loanDebt: 0,
    pendingCard27Cuotas: 0,
    savingEmergencyFund: 0,
  },
  player_3: {
    id: 'player_3',
    name: 'Leo',
    role: 'estudiante',
    roleName: 'El Estudiante',
    balance: 15000,
    wellbeing: 90,
    capacitacion: 3,
    baseIncome: 30000,
    baseExpense: 15000,
    isSick: false,
    hasCeluSeguro: false,
    hasComercioSeguro: false,
    hasBeca: false,
    hasCoworkingUnification: false,
    hasMonotributoTech: false,
    monotributoScaleEscaped: false,
    hasVerazGoodBehavior: true,
    loanDebt: 0,
    pendingCard27Cuotas: 0,
    savingEmergencyFund: 0,
  },
};

const INITIAL_ROOM = {
  room_id: 'ROOM_882',
  group_id: 'GRP_01',
  collective_fund: 120000,
  points_score: 450,
  active_card_id: 'CARD_001',
  current_administrator: 'player_1',
  voting_status: 'open',
  votes: {
    player_1: null,
    player_2: null,
    player_3: null,
  },
  current_month: 1,
  time_remaining: 90,
};

// In-memory cache for room game states to provide extreme performance & offline-resilience
const roomStatesCache: Record<string, any> = {};

async function getRoomState(roomCode: string): Promise<any> {
  const cleanCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
  
  if (db) {
    try {
      const docRef = doc(db, 'rooms', cleanCode);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        roomStatesCache[cleanCode] = snap.data();
        return roomStatesCache[cleanCode];
      }
    } catch (err) {
      console.error(`[Server] Firestore read failed for room ${cleanCode}:`, err);
    }
  }

  // Fallback to cache
  if (roomStatesCache[cleanCode]) {
    return roomStatesCache[cleanCode];
  }

  // Initialize new default state for this roomCode
  const initialState = {
    room: {
      ...INITIAL_ROOM,
      room_id: `ROOM_${Math.floor(100 + Math.random() * 900)}`,
    },
    players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
    logs: [] as any[],
    gameScreenState: 'setup',
    roomCode: cleanCode,
    pairingMode: 'aleatorio',
    joinedAlumnos: JSON.parse(JSON.stringify(INITIAL_JOINED_ALUMNOS)),
    isGameOver: false,
    alertMsg: null,
    timerActive: true,
    showCierreReport: false,
    playersBefore: null,
    logEntryForReport: null,
  };

  roomStatesCache[cleanCode] = initialState;

  if (db) {
    try {
      const docRef = doc(db, 'rooms', cleanCode);
      await setDoc(docRef, initialState);
    } catch (err) {
      console.error(`[Server] Firestore write initial state failed for room ${cleanCode}:`, err);
    }
  }

  return initialState;
}

async function saveRoomState(roomCode: string, state: any) {
  const cleanCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
  roomStatesCache[cleanCode] = state;
  
  if (db) {
    try {
      const docRef = doc(db, 'rooms', cleanCode);
      await setDoc(docRef, state);
    } catch (err) {
      console.error(`[Server] Firestore write failed for room ${cleanCode}:`, err);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. API ROUTES FIRST
  app.get('/api/game-state', async (req, res) => {
    const roomCode = (req.query.roomCode || 'SALA-4TO').toString().toUpperCase().trim();
    const state = await getRoomState(roomCode);
    res.json(state);
  });

  app.post('/api/join', async (req, res) => {
    const { id, name, role, roomCode } = req.body;
    const targetCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
    const state = await getRoomState(targetCode);
    
    if (state.joinedAlumnos[id]) {
      state.joinedAlumnos[id].name = name;
      state.joinedAlumnos[id].joined = true;
      if (role !== undefined) {
        state.joinedAlumnos[id].role = role;
      }
    }
    
    await saveRoomState(targetCode, state);
    res.json(state);
  });

  app.post('/api/leave', async (req, res) => {
    const { id, roomCode } = req.body;
    const targetCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
    const state = await getRoomState(targetCode);
    
    if (state.joinedAlumnos[id]) {
      state.joinedAlumnos[id] = {
        id,
        name: '',
        joined: false,
         subgroupCode: null,
        isCreator: false,
        role: null,
      };
    }
    
    await saveRoomState(targetCode, state);
    res.json(state);
  });

  app.post('/api/create-subgroup', async (req, res) => {
    const { id, code, role, roomCode } = req.body;
    const targetCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
    const state = await getRoomState(targetCode);
    
    if (state.joinedAlumnos[id]) {
      state.joinedAlumnos[id].subgroupCode = code;
      state.joinedAlumnos[id].isCreator = true;
      if (role !== undefined) {
        state.joinedAlumnos[id].role = role;
      }
    }
    
    await saveRoomState(targetCode, state);
    res.json(state);
  });

  app.post('/api/join-subgroup', async (req, res) => {
    const { id, code, role, roomCode } = req.body;
    const targetCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
    const state = await getRoomState(targetCode);
    
    if (state.joinedAlumnos[id]) {
      state.joinedAlumnos[id].subgroupCode = code;
      state.joinedAlumnos[id].isCreator = false;
      if (role !== undefined) {
        state.joinedAlumnos[id].role = role;
      }
    }
    
    await saveRoomState(targetCode, state);
    res.json(state);
  });

  app.post('/api/cast-vote', async (req, res) => {
    const { playerId, option, roomCode } = req.body;
    const targetCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
    const state = await getRoomState(targetCode);
    
    if (state.room && state.room.votes) {
      state.room.votes[playerId] = option;
    }
    
    await saveRoomState(targetCode, state);
    res.json(state);
  });

  app.post('/api/sync-teacher', async (req, res) => {
    const {
      room,
      players,
      logs,
      gameScreenState,
      roomCode,
      pairingMode,
      isGameOver,
      alertMsg,
      timerActive,
      showCierreReport,
      playersBefore,
      logEntryForReport,
    } = req.body;

    const targetCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
    const state = await getRoomState(targetCode);

    if (room !== undefined) state.room = room;
    if (players !== undefined) state.players = players;
    if (logs !== undefined) state.logs = logs;
    if (gameScreenState !== undefined) state.gameScreenState = gameScreenState;
    if (roomCode !== undefined) state.roomCode = roomCode;
    if (pairingMode !== undefined) state.pairingMode = pairingMode;
    if (isGameOver !== undefined) state.isGameOver = isGameOver;
    if (alertMsg !== undefined) state.alertMsg = alertMsg;
    if (timerActive !== undefined) state.timerActive = timerActive;
    if (showCierreReport !== undefined) state.showCierreReport = showCierreReport;
    if (playersBefore !== undefined) state.playersBefore = playersBefore;
    if (logEntryForReport !== undefined) state.logEntryForReport = logEntryForReport;

    await saveRoomState(targetCode, state);
    res.json(state);
  });

  app.post('/api/reset', async (req, res) => {
    const { roomCode, gameScreenState, pairingMode } = req.body;
    const targetCode = (roomCode || 'SALA-4TO').toString().toUpperCase().trim();
    
    const freshState = {
      room: JSON.parse(JSON.stringify(INITIAL_ROOM)),
      players: JSON.parse(JSON.stringify(INITIAL_PLAYERS)),
      logs: [] as any[],
      gameScreenState: gameScreenState || 'setup',
      roomCode: targetCode,
      pairingMode: pairingMode || 'aleatorio',
      joinedAlumnos: JSON.parse(JSON.stringify(INITIAL_JOINED_ALUMNOS)),
      isGameOver: false,
      alertMsg: null,
      timerActive: true,
      showCierreReport: false,
      playersBefore: null,
      logEntryForReport: null,
    };

    await saveRoomState(targetCode, freshState);
    res.json(freshState);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
