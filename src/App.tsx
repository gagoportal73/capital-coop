import { useState, useEffect, useRef } from 'react';
import { PlayerState, RoomState, GameLogEntry, GameCard, PlayerId } from './types';
import { CARDS_POOL, resolveGroupVoting, executeCardResolution } from './cardsData';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

const getApiUrl = (endpoint: string): string => {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const base = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }
  return endpoint;
};
import { RoomDashboard } from './components/RoomDashboard';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CierreMensualModal } from './components/CierreMensualModal';
import { GrandFinale } from './components/GrandFinale';
import { InstructionGuide } from './components/InstructionGuide';
import { RoomAccessModule, AlumnoOnboarding, AlumnoLobbyState } from './components/RoomAccessModule';
import { AlumnoDirectSelect } from './components/AlumnoDirectSelect';
import { Users, Award, Play, ShieldAlert, Cpu, Sparkles, AlertCircle } from 'lucide-react';

const INITIAL_PLAYERS: Record<PlayerId, PlayerState> = {
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

const INITIAL_ROOM: RoomState = {
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

export default function App() {
  const [room, setRoom] = useState<RoomState>(INITIAL_ROOM);
  const [players, setPlayers] = useState<Record<string, PlayerState>>(INITIAL_PLAYERS);
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  // Classroom Onboarding States
  const [hasLoadedFromServer, setHasLoadedFromServer] = useState(false);
  const [useCloudSync, setUseCloudSync] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      // If we are in the .run.app preview container or localhost, use the robust local Express server proxy.
      // This completely avoids any browser client-side "Failed to fetch" block to firestore.googleapis.com
      if (origin.includes('.run.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return false;
      }
    }
    return true; // Fallback to client-side Firestore for static hostings (like GitHub Pages, Netlify)
  });

  const [isStrictStudentMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const fullQuery = window.location.search + window.location.hash;
      return fullQuery.includes('rol=alumno') || 
             fullQuery.includes('role=alumno') || 
             fullQuery.includes('rol=player_') ||
             fullQuery.includes('role=player_') ||
             !!fullQuery.match(/[?&#](sala|room)=/i);
    }
    return false;
  });

  const lastInitTime = useRef<number>(0);

  const [gameScreenState, setGameScreenState] = useState<'setup' | 'lobby' | 'playing'>(() => {
    if (typeof window !== 'undefined') {
      const fullQuery = window.location.search + window.location.hash;
      const salaMatch = fullQuery.match(/[?&#](sala|room)=([^&/?#]+)/i);
      if (salaMatch && salaMatch[2]) {
        return 'lobby';
      }
    }
    return 'setup';
  });
  const [roomCode, setRoomCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const fullQuery = window.location.search + window.location.hash;
      const salaMatch = fullQuery.match(/[?&#](sala|room)=([^&/?#]+)/i);
      if (salaMatch && salaMatch[2]) {
        return decodeURIComponent(salaMatch[2]).toUpperCase().trim();
      }
    }
    return 'SALA-4TO';
  });
  const [pairingMode, setPairingMode] = useState<'aleatorio' | 'manual'>('aleatorio');
  const [joinedAlumnos, setJoinedAlumnos] = useState<Record<PlayerId, AlumnoLobbyState>>({
    player_1: { id: 'player_1', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
    player_2: { id: 'player_2', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
    player_3: { id: 'player_3', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
  });

  const pushStateToCloud = async (overrideState?: any) => {
    if (!roomCode) return;
    const stateToSave = overrideState || {
      room,
      players,
      logs,
      gameScreenState,
      roomCode,
      pairingMode,
      joinedAlumnos,
      isGameOver,
      alertMsg,
      timerActive,
      showCierreReport,
      playersBefore,
      logEntryForReport,
    };
    try {
      const docRef = doc(db, 'rooms', roomCode);
      await setDoc(docRef, stateToSave);
    } catch (err) {
      console.error("Cloud push failed:", err);
      handleFirestoreError(err, OperationType.WRITE, `rooms/${roomCode}`);
    }
  };

  const pullStateFromCloud = async () => {
    if (!roomCode) return null;
    try {
      const docRef = doc(db, 'rooms', roomCode);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
      return null;
    } catch (err) {
      console.error("Cloud pull failed:", err);
      handleFirestoreError(err, OperationType.GET, `rooms/${roomCode}`);
      return null;
    }
  };

  const handleInitRoom = async (code: string, mode: 'aleatorio' | 'manual') => {
    lastInitTime.current = Date.now();
    const cleanCode = (code || 'SALA-4TO').toUpperCase().trim();
    setRoomCode(cleanCode);
    setPairingMode(mode);
    setGameScreenState('lobby');
    
    // Total reset of room state to ensure no leftover values from previous matches
    const resetAlumnos = {
      player_1: { id: 'player_1', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
      player_2: { id: 'player_2', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
      player_3: { id: 'player_3', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
    };
    setJoinedAlumnos(resetAlumnos);
    setPlayers(INITIAL_PLAYERS);
    
    const freshRoom: RoomState = {
      ...INITIAL_ROOM,
      room_id: cleanCode,
    };
    setRoom(freshRoom);
    setLogs([]);
    setIsGameOver(false);
    setShowCierreReport(false);
    setLogEntryForReport(null);

    // Push fresh start state to cloud or Express server so students see a clean lobby
    if (useCloudSync) {
      try {
        const docRef = doc(db, 'rooms', cleanCode);
        await setDoc(docRef, {
          room: freshRoom,
          players: INITIAL_PLAYERS,
          logs: [],
          gameScreenState: 'lobby',
          roomCode: cleanCode,
          pairingMode: mode,
          joinedAlumnos: resetAlumnos,
          isGameOver: false,
          alertMsg: null,
          timerActive: true,
          showCierreReport: false,
          playersBefore: null,
          logEntryForReport: null,
        });
      } catch (err) {
        console.error("Error setting initial room state in cloud:", err);
      }
    } else {
      try {
        await fetch(getApiUrl('/api/reset'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode: cleanCode, gameScreenState: 'lobby', pairingMode: mode }),
        });
      } catch (e) {
        console.error("Error setting initial room state in backend:", e);
      }
    }
  };

  const handleSetPairingMode = (mode: 'aleatorio' | 'manual') => {
    setPairingMode(mode);
  };

  const handleStudentJoin = async (id: PlayerId, name: string) => {
    const updatedAlumnos = { ...joinedAlumnos };
    updatedAlumnos[id] = {
      ...updatedAlumnos[id],
      name,
      joined: true,
    };
    setJoinedAlumnos(updatedAlumnos);

    if (useCloudSync) {
      try {
        const latest = await pullStateFromCloud();
        if (latest) {
          latest.joinedAlumnos[id].name = name;
          latest.joinedAlumnos[id].joined = true;
          await pushStateToCloud(latest);
        } else {
          await pushStateToCloud({
            room,
            players,
            logs,
            gameScreenState,
            roomCode,
            pairingMode,
            joinedAlumnos: updatedAlumnos,
            isGameOver,
            alertMsg,
            timerActive,
            showCierreReport,
            playersBefore,
            logEntryForReport,
          });
        }
      } catch (err) {
        console.error("Cloud join error:", err);
      }
    } else {
      try {
        await fetch(getApiUrl('/api/join'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, name, roomCode }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleStudentCreateGroup = async (id: PlayerId, subgroupCode: string, role?: 'emprendedor' | 'empleado' | 'estudiante') => {
    const updatedAlumnos = { ...joinedAlumnos };
    updatedAlumnos[id] = {
      ...updatedAlumnos[id],
      subgroupCode,
      isCreator: true,
      role: role || null,
    };
    setJoinedAlumnos(updatedAlumnos);

    if (useCloudSync) {
      try {
        const latest = await pullStateFromCloud();
        if (latest) {
          latest.joinedAlumnos[id].subgroupCode = subgroupCode;
          latest.joinedAlumnos[id].isCreator = true;
          if (role !== undefined) latest.joinedAlumnos[id].role = role;
          await pushStateToCloud(latest);
        }
      } catch (err) {
        console.error("Cloud subgroup create error:", err);
      }
    } else {
      try {
        await fetch(getApiUrl('/api/create-subgroup'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, code: subgroupCode, role, roomCode }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleStudentJoinGroup = async (id: PlayerId, subgroupCode: string, role?: 'emprendedor' | 'empleado' | 'estudiante') => {
    const updatedAlumnos = { ...joinedAlumnos };
    updatedAlumnos[id] = {
      ...updatedAlumnos[id],
      subgroupCode,
      isCreator: false,
      role: role || null,
    };
    setJoinedAlumnos(updatedAlumnos);

    if (useCloudSync) {
      try {
        const latest = await pullStateFromCloud();
        if (latest) {
          latest.joinedAlumnos[id].subgroupCode = subgroupCode;
          latest.joinedAlumnos[id].isCreator = false;
          if (role !== undefined) latest.joinedAlumnos[id].role = role;
          await pushStateToCloud(latest);
        }
      } catch (err) {
        console.error("Cloud subgroup join error:", err);
      }
    } else {
      try {
        await fetch(getApiUrl('/api/join-subgroup'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, code: subgroupCode, role, roomCode }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleStudentLeave = async (id: PlayerId) => {
    const updatedAlumnos = { ...joinedAlumnos };
    updatedAlumnos[id] = {
      id,
      name: '',
      joined: false,
      subgroupCode: null,
      isCreator: false,
      role: null,
    };
    setJoinedAlumnos(updatedAlumnos);

    if (useCloudSync) {
      try {
        const latest = await pullStateFromCloud();
        if (latest) {
          latest.joinedAlumnos[id] = {
            id,
            name: '',
            joined: false,
            subgroupCode: null,
            isCreator: false,
            role: null,
          };
          await pushStateToCloud(latest);
        }
      } catch (err) {
        console.error("Cloud leave error:", err);
      }
    } else {
      try {
        await fetch(getApiUrl('/api/leave'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, roomCode }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleResetAll = async () => {
    setGameScreenState('setup');
    setRoomCode('');
    setPairingMode('aleatorio');
    const resetAlumnos = {
      player_1: { id: 'player_1', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
      player_2: { id: 'player_2', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
      player_3: { id: 'player_3', name: '', joined: false, subgroupCode: null, isCreator: false, role: null },
    };
    setJoinedAlumnos(resetAlumnos);
    setPlayers(INITIAL_PLAYERS);
    setRoom(INITIAL_ROOM);
    setLogs([]);
    setIsGameOver(false);
    setShowCierreReport(false);
    setLogEntryForReport(null);

    if (useCloudSync) {
      const freshState = {
        room: INITIAL_ROOM,
        players: INITIAL_PLAYERS,
        logs: [],
        gameScreenState: 'setup',
        roomCode: '',
        pairingMode: 'aleatorio',
        joinedAlumnos: resetAlumnos,
        isGameOver: false,
        alertMsg: null,
        timerActive: true,
        showCierreReport: false,
        playersBefore: null,
        logEntryForReport: null,
      };
      await pushStateToCloud(freshState);
    } else {
      try {
        await fetch(getApiUrl('/api/reset'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLargarPartida = () => {
    // Rigid verification that all 3 students are connected
    const isReady = joinedAlumnos && joinedAlumnos.player_1?.joined && joinedAlumnos.player_2?.joined && joinedAlumnos.player_3?.joined;
    if (!isReady) {
      setAlertMsg("⚠️ No es posible iniciar: faltan alumnos por conectarse en los 3 teléfonos.");
      setTimeout(() => setAlertMsg(null), 3500);
      return;
    }

    const roles: Array<'emprendedor' | 'empleado' | 'estudiante'> = ['emprendedor', 'empleado', 'estudiante'];
    const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

    const nextPlayers = { ...INITIAL_PLAYERS };
    
    Object.keys(joinedAlumnos).forEach((pId, idx) => {
      const playerId = pId as PlayerId;
      const studentName = joinedAlumnos[playerId].name || `Alumno ${idx + 1}`;
      
      // Automatic balanced balance role assignment override
      const role = (pairingMode === 'manual' && joinedAlumnos[playerId].role)
        ? joinedAlumnos[playerId].role!
        : shuffledRoles[idx];
      
      let balance = 15000;
      let baseIncome = 30000;
      let baseExpense = 15000;
      let roleName = 'El Estudiante';

      if (role === 'emprendedor') {
        balance = 50000;
        baseIncome = 80000;
        baseExpense = 30000;
        roleName = 'El Emprendedor';
      } else if (role === 'empleado') {
        balance = 70000;
        baseIncome = 90000;
        baseExpense = 45000;
        roleName = 'El Empleado';
      }

      nextPlayers[playerId] = {
        ...INITIAL_PLAYERS[playerId],
        id: playerId,
        name: studentName,
        role,
        roleName,
        balance,
        baseIncome,
        baseExpense,
        wellbeing: 90,
        capacitacion: role === 'estudiante' ? 3 : role === 'empleado' ? 2 : 1,
      };
    });

    setPlayers(nextPlayers);

    // Mezclar el mazo entero de cartas para que aparezcan de forma completamente aleatoria y sin duplicados por partida
    const shuffledCardIds = CARDS_POOL.map((c) => c.id).sort(() => Math.random() - 0.5);

    setRoom({
      ...INITIAL_ROOM,
      room_id: roomCode,
      group_id: `MESA_${roomCode.replace('SALA-', '')}`,
      active_card_id: shuffledCardIds[0] || 'CARD_001',
      voting_status: 'open',
      votes: {
        player_1: null,
        player_2: null,
        player_3: null,
      },
      current_month: 1,
      time_remaining: 120,
      card_deck: shuffledCardIds,
    });

    setGameScreenState('playing');
  };

  // Simulation settings
  const [playMode, setPlayMode] = useState<'manual' | 'ai'>('manual'); // Manual mode of cellphones as default
  const [focusedPlayer, setFocusedPlayer] = useState<PlayerId>('player_1'); // For small screen mobile toggling
  const [hideSandboxControls, setHideSandboxControls] = useState<boolean>(false); // Allows hiding the teacher's sandbox switcher for clean gameplay

  // Role views: 'both' shows chalkboard & cellphones, 'projector' shows only whiteboard, and 'player_1'/'player_2'/'player_3' shows only that individual student screen!
  const [viewRole, setViewRole] = useState<'both' | 'projector' | 'player_1' | 'player_2' | 'player_3' | 'alumno'>(() => {
    if (typeof window !== 'undefined') {
      const fullQuery = window.location.search + window.location.hash;
      if (fullQuery.includes('rol=proyector') || fullQuery.includes('role=proyector')) return 'projector';
      if (fullQuery.includes('rol=player_1') || fullQuery.includes('role=player_1')) return 'player_1';
      if (fullQuery.includes('rol=player_2') || fullQuery.includes('role=player_2')) return 'player_2';
      if (fullQuery.includes('rol=player_3') || fullQuery.includes('role=player_3')) return 'player_3';
      if (fullQuery.includes('rol=alumno') || fullQuery.includes('role=alumno')) return 'alumno';
      
      // If a classroom room/sala code is present in the URL, block access to the split teacher controls and force 'alumno'!
      if (fullQuery.match(/[?&#](sala|room)=/i)) {
        return 'alumno';
      }
    }
    return 'both';
  });

  useEffect(() => {
    const handleHashAndParams = () => {
      const fullQuery = window.location.search + window.location.hash;
      
      // Parse Role
      if (fullQuery.includes('rol=proyector') || fullQuery.includes('role=proyector')) {
        setViewRole('projector');
      } else if (fullQuery.includes('rol=player_1') || fullQuery.includes('role=player_1')) {
        setViewRole('player_1');
      } else if (fullQuery.includes('rol=player_2') || fullQuery.includes('role=player_2')) {
        setViewRole('player_2');
      } else if (fullQuery.includes('rol=player_3') || fullQuery.includes('role=player_3')) {
        setViewRole('player_3');
      } else if (fullQuery.includes('rol=alumno') || fullQuery.includes('role=alumno') || fullQuery.match(/[?&#](sala|room)=/i)) {
        setViewRole('alumno');
      }

      // Parse Sala Code
      const salaMatch = fullQuery.match(/[?&#](sala|room)=([^&/?#]+)/i);
      if (salaMatch && salaMatch[2]) {
        const decodedSala = decodeURIComponent(salaMatch[2]).toUpperCase().trim();
        if (decodedSala) {
          setRoomCode(decodedSala);
        }
      }
    };
    handleHashAndParams();
    window.addEventListener('hashchange', handleHashAndParams);
    window.addEventListener('popstate', handleHashAndParams);
    return () => {
      window.removeEventListener('hashchange', handleHashAndParams);
      window.removeEventListener('popstate', handleHashAndParams);
    };
  }, []);

  // Timer controls
  const [timerActive, setTimerActive] = useState(true);

  // Transition report modal states
  const [showCierreReport, setShowCierreReport] = useState(false);
  const [playersBefore, setPlayersBefore] = useState<Record<string, PlayerState>>(INITIAL_PLAYERS);
  const [logEntryForReport, setLogEntryForReport] = useState<GameLogEntry | null>(null);

  // Active Card reference
  const currentCard = CARDS_POOL.find((c) => c.id === room.active_card_id) || CARDS_POOL[0];

  // Global game alert message
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Listen to Firestore database or poll server state in real-time to support real external devices / QR scans!
  useEffect(() => {
    if (gameScreenState === 'setup') {
      // Si el profesor está en el panel de configuración (setup), no descargamos ningún estado
      // anterior para evitar que se cargue una partida vieja y se inicie sola al recargar la app.
      setHasLoadedFromServer(true);
      return;
    }

    if (useCloudSync) {
      if (!roomCode) return;
      const docRef = doc(db, 'rooms', roomCode);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (!docSnap.exists()) {
          // If the room doesn't exist in Firestore, mark server-load as completed
          // so the authoritative teacher client can initialize it or push state to it
          setHasLoadedFromServer(true);
          return;
        }
        const data = docSnap.data();

        // Apply server/cloud updates to local states
        const isController = viewRole === 'both';
        const skipControlOverrides = isController && hasLoadedFromServer;

        if (data.room) setRoom(data.room);
        if (data.players) setPlayers(data.players);
        if (data.logs) setLogs(data.logs);
        
        if (data.gameScreenState && !skipControlOverrides) {
          const isRecentlyReset = Date.now() - lastInitTime.current < 4000;
          const isStalePlayingState = data.gameScreenState === 'playing' && isRecentlyReset && (viewRole === 'both' || viewRole === 'projector');
          if (!isStalePlayingState) {
            setGameScreenState(data.gameScreenState);
          }
        }
        
        if (data.roomCode && !skipControlOverrides) setRoomCode(data.roomCode);
        if (data.pairingMode && !skipControlOverrides) setPairingMode(data.pairingMode);
        if (data.joinedAlumnos) setJoinedAlumnos(data.joinedAlumnos);
        if (data.isGameOver !== undefined) setIsGameOver(data.isGameOver);
        if (data.alertMsg !== undefined) setAlertMsg(data.alertMsg);
        if (data.timerActive !== undefined) setTimerActive(data.timerActive);
        if (data.showCierreReport !== undefined) setShowCierreReport(data.showCierreReport);
        if (data.playersBefore) setPlayersBefore(data.playersBefore);
        if (data.logEntryForReport !== undefined) setLogEntryForReport(data.logEntryForReport);

        setHasLoadedFromServer(true);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `rooms/${roomCode}`);
      });

      return () => unsubscribe();
    } else {
      let active = true;
      const fetchState = async () => {
        try {
          const response = await fetch(getApiUrl(`/api/game-state?roomCode=${encodeURIComponent(roomCode)}`));
          if (response.ok) {
            const data = await response.json();
            if (!active) return;
            const isController = viewRole === 'both';
            const skipControlOverrides = isController && hasLoadedFromServer;

            setRoom(data.room);
            setPlayers(data.players);
            setLogs(data.logs);
            
            if (data.gameScreenState && !skipControlOverrides) {
              const isRecentlyReset = Date.now() - lastInitTime.current < 4000;
              const isStalePlayingState = data.gameScreenState === 'playing' && isRecentlyReset && (viewRole === 'both' || viewRole === 'projector');
              if (!isStalePlayingState) {
                setGameScreenState(data.gameScreenState);
              }
            }
            
            if (data.roomCode && !skipControlOverrides) setRoomCode(data.roomCode);
            if (data.pairingMode && !skipControlOverrides) setPairingMode(data.pairingMode);
            setJoinedAlumnos(data.joinedAlumnos);
            setIsGameOver(data.isGameOver);
            setAlertMsg(data.alertMsg);
            setTimerActive(data.timerActive);
            setShowCierreReport(data.showCierreReport);
            if (data.playersBefore) setPlayersBefore(data.playersBefore);
            if (data.logEntryForReport) setLogEntryForReport(data.logEntryForReport);

            setHasLoadedFromServer(true);
          } else if (response.status === 404) {
            setUseCloudSync(true);
          }
        } catch (err) {
          console.error("Poll error:", err);
          if (typeof window !== 'undefined') {
            setUseCloudSync(true);
          }
        }
      };

      fetchState();
      const interval = setInterval(fetchState, 1200);
      return () => {
        active = false;
        clearInterval(interval);
      };
    }
  }, [useCloudSync, roomCode, gameScreenState]);

  // Update teacher state to the server in-memory cache or cloud storage
  useEffect(() => {
    // Only the teacher (viewRole === 'both' or 'projector') acts as the authoritative state sender to the server!
    if (viewRole !== 'both' && viewRole !== 'projector') return;

    // Prevent wiping active game details on teacher page load/refresh before receiving initial state
    if (!hasLoadedFromServer) return;

    const pushStateToServer = async () => {
      const payload = {
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
      };

      if (useCloudSync) {
        await pushStateToCloud();
      } else {
        try {
          await fetch(getApiUrl('/api/sync-teacher'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (err) {
          console.error("Failed to push state:", err);
        }
      }
    };

    const timer = setTimeout(pushStateToServer, 100);
    return () => clearTimeout(timer);
  }, [
    viewRole,
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
    hasLoadedFromServer,
    useCloudSync,
  ]);

  // countdown timer thread
  useEffect(() => {
    let interval: any = null;
    if (timerActive && room.voting_status === 'open' && !showCierreReport && !isGameOver) {
      interval = setInterval(() => {
        setRoom((prev) => {
          if (prev.time_remaining <= 1) {
            clearInterval(interval);
            // Auto force resolution!
            setTimeout(() => {
              handleForceResolutionOfTurn();
            }, 0);
            return { ...prev, time_remaining: 0 };
          }
          return { ...prev, time_remaining: prev.time_remaining - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, room.voting_status, showCierreReport, isGameOver]);

  // AI bots voting behavior logic thread
  useEffect(() => {
    if (playMode === 'ai' && room.voting_status === 'open') {
      const timeout = setTimeout(() => {
        // AI chooses dynamic option for bots
        // We assume we are player_1 (Emprendedor). Sofi (Empleado) and Leo (Estudiante) vote automatically!
        setRoom((prev) => {
          const nextVotes = { ...prev.votes };
          
          if (nextVotes.player_2 === null) {
            const options: Array<'A' | 'B' | 'C'> = ['B', 'A', 'C'];
            nextVotes.player_2 = options[Math.floor(Math.random() * options.length)];
          }
          if (nextVotes.player_3 === null) {
            const options: Array<'A' | 'B' | 'C'> = ['C', 'B', 'A'];
            nextVotes.player_3 = options[Math.floor(Math.random() * options.length)];
          }

          return { ...prev, votes: nextVotes };
        });
      }, 1800);

      return () => clearTimeout(timeout);
    }
  }, [playMode, room.voting_status, room.active_card_id]);

  // Cast a manual player vote
  const handleCastVote = async (playerId: PlayerId, option: 'A' | 'B' | 'C') => {
    setRoom((prev) => {
      const updatedVotes = { ...prev.votes, [playerId]: option };

      // If all players voted, resolve automatically within 1.5 seconds for a smooth UX
      const allVoted = Object.values(updatedVotes).every((v) => v !== null);
      if (allVoted) {
        setTimeout(() => {
          handleForceResolutionOfTurn();
        }, 1200);
      }

      return {
        ...prev,
        votes: updatedVotes,
      };
    });

    if (useCloudSync) {
      try {
        const latest = await pullStateFromCloud();
        if (latest) {
          latest.room.votes[playerId] = option;
          await pushStateToCloud(latest);
        }
      } catch (err) {
        console.error("Cloud vote error:", err);
      }
    } else {
      try {
        await fetch(getApiUrl('/api/cast-vote'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, option, roomCode }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleForceResolutionOfTurn = () => {
    // Save state before resolution
    setPlayers((currentPlayers) => {
      setRoom((currentRoom) => {
        if (currentRoom.voting_status === 'resolved') return currentRoom;

        // 1. Resolve winning option
        const winningOption = resolveGroupVoting(currentRoom.votes, currentRoom.current_administrator);

        // 2. Fetch option description
        const activeCardObj = CARDS_POOL.find((c) => c.id === currentRoom.active_card_id) || CARDS_POOL[0];
        const optionDetails = activeCardObj.options.find((o) => o.id === winningOption);
        const optionTextVal = optionDetails ? optionDetails.text : "Opción por defecto";

        // 3. Execute impacts
        const { updatedPlayers: playersAfterImpact, updatedRoom: roomAfterImpact, feedback } =
          executeCardResolution(activeCardObj, winningOption, currentPlayers, currentRoom);

        // 4. Record turn log entry
        const isFondoComunChanged = roomAfterImpact.collective_fund - currentRoom.collective_fund;
        const isPointsChanged = roomAfterImpact.points_score - currentRoom.points_score;

        const logEntry: GameLogEntry = {
          month: currentRoom.current_month,
          cardTitle: activeCardObj.title,
          winningOption,
          optionText: optionTextVal,
          feedbackText: feedback,
          fundChange: isFondoComunChanged,
          pointsChange: isPointsChanged,
        };

        setLogs((prevLogs) => [...prevLogs, logEntry]);
        setLogEntryForReport(logEntry);
        setPlayersBefore(JSON.parse(JSON.stringify(currentPlayers)));

        // Stage transitions
        setShowCierreReport(true);

        return {
          ...roomAfterImpact,
          voting_status: 'resolved',
        };
      });

      return currentPlayers;
    });
  };

  const handleAdvanceToNextMonth = () => {
    setShowCierreReport(false);

    // Apply monthly deposits & deductions to actual player balances:
    setPlayers((prev) => {
      const nextPlayers = JSON.parse(JSON.stringify(prev)) as Record<string, PlayerState>;
      
      Object.keys(nextPlayers).forEach((pId) => {
        const p = nextPlayers[pId];

        // 1. Calculate Monthly Income
        let currentIncome = p.baseIncome;
        
        // If the student bought card 16 education certificate and is in month >= 6, 50% increase!
        if (p.role === 'estudiante' && p.capacitacion >= 4 && room.current_month >= 6) {
          currentIncome = Math.floor(currentIncome * 1.5);
        }

        // Beca active gives +15000 index
        if (p.hasBeca) {
          currentIncome += 15000;
        }

        // Sick penalty: -40% of income
        if (p.isSick) {
          currentIncome = Math.floor(currentIncome * 0.6);
        }

        // 2. Add income
        p.balance += currentIncome;

        // 3. Deduct normal Monthly expenses
        let currentExpense = p.baseExpense;
        p.balance -= currentExpense;

        // Custom cuotas from Card 27
        if (p.pendingCard27Cuotas > 0) {
          p.balance -= 25000;
          p.pendingCard27Cuotas -= 1;
        }

        // Passive investment interest (Cuenta Remunerada 4%!)
        if (room.active_card_id === 'CARD_033' || p.balance > 40000) {
          const yieldEarned = Math.floor(p.balance * 0.04);
          p.balance += yieldEarned;
        }
      });

      return nextPlayers;
    });

    // Advance turn or complete simulation
    setRoom((prev) => {
      const nextMonth = prev.current_month + 1;

      if (nextMonth > 12) {
        setIsGameOver(true);
        return prev;
      }

      // Rotate administrator role
      const administrators: PlayerId[] = ['player_1', 'player_2', 'player_3'];
      const nextAdminIndex = nextMonth % 3;
      const nextAdminId = administrators[nextAdminIndex];

      // Select next card from the shuffled mazo deck
      const deck = prev.card_deck && prev.card_deck.length > 0 
        ? prev.card_deck 
        : CARDS_POOL.map((c) => c.id);

      // Usar el mazo de cartas mezclado asignando la siguiente carta única en base al avance de mes
      const nextCardId = deck[nextMonth - 1] || deck[0] || 'CARD_001';

      return {
        ...prev,
        current_month: nextMonth,
        voting_status: 'open',
        active_card_id: nextCardId,
        current_administrator: nextAdminId,
        time_remaining: 90,
        votes: {
          player_1: null,
          player_2: null,
          player_3: null,
        },
      };
    });
  };

  const handleP2PTransfer = (senderId: PlayerId, recipientId: PlayerId, amount: number) => {
    if (players[senderId].balance < amount) {
      setAlertMsg(`⚠️ Saldo insuficiente: ${players[senderId].name} no puede transferir $${amount.toLocaleString()} ARS.`);
      setTimeout(() => setAlertMsg(null), 3000);
      return;
    }

    setPlayers((prev) => ({
      ...prev,
      [senderId]: {
        ...prev[senderId],
        balance: prev[senderId].balance - amount,
      },
      [recipientId]: {
        ...prev[recipientId],
        balance: prev[recipientId].balance + amount,
      },
    }));

    setLogs((prev) => [
      `💸 [Capital Pay P2P] ${players[senderId].name} envió $${amount.toLocaleString()} ARS a ${players[recipientId].name}.`,
      ...prev,
    ]);
  };

  const handleFundContribution = (contributorId: PlayerId, amount: number) => {
    if (players[contributorId].balance < amount) {
      setAlertMsg(`⚠️ Saldo insuficiente: ${players[contributorId].name} no puede aportar $${amount.toLocaleString()} ARS.`);
      setTimeout(() => setAlertMsg(null), 3000);
      return;
    }

    setPlayers((prev) => ({
      ...prev,
      [contributorId]: {
        ...prev[contributorId],
        balance: prev[contributorId].balance - amount,
      },
    }));

    setRoom((prev) => ({
      ...prev,
      collective_fund: prev.collective_fund + amount,
    }));

    setLogs((prev) => [
      `🤝 [Fondo Común] ${players[contributorId].name} donó $${amount.toLocaleString()} ARS al pozo de la comunidad.`,
      ...prev,
    ]);
  };

  const handleAddChangaLiquidity = (playerId: string, amount: number) => {
    setPlayers((prev) => {
      const pId = playerId as PlayerId;
      if (!prev[pId]) return prev;
      return {
        ...prev,
        [pId]: {
          ...prev[pId],
          balance: prev[pId].balance + amount,
        },
      };
    });
  };

  const handleForcedCardSelection = (cardId: string) => {
    const cardSelected = CARDS_POOL.find((c) => c.id === cardId);
    if (!cardSelected) return;

    setRoom((prev) => ({
      ...prev,
      active_card_id: cardId,
      voting_status: 'open',
      votes: {
        player_1: null,
        player_2: null,
        player_3: null,
      },
      time_remaining: 90,
    }));

    setAlertMsg(`Se cargó forzadamente la carta: "${cardSelected.title}". ¡Votos reiniciados!`);
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleRestartGame = async () => {
    await handleResetAll();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6 selection:bg-orange-500 selection:text-black">
      {/* Top Brand Hub Nav - Only visible on Teacher/Both/Projector dashboards */}
      {!['alumno', 'player_1', 'player_2', 'player_3'].includes(viewRole) && (
        <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between bg-[#0A0A0A] p-5 rounded-none border-2 border-[#222] shadow-[4px_4px_0px_0px_rgba(34,34,34,1)] gap-4">
          <div id="brand-logo" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-none flex items-center justify-center font-black text-black text-lg border-2 border-black">
              CC
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-zinc-100">
                Capital Coop <span className="font-extrabold text-orange-500">| Finanzas en Comunidad</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest leading-none">PEDAGOGÍA DE FINANZAS COOPERATIVAS</p>
            </div>
          </div>

          {/* Global actions - Role Switcher that allows clean projection vs student view */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {!hideSandboxControls ? (
              <div className="flex flex-wrap items-center gap-2 bg-[#0A0A0A] border-2 border-zinc-800 p-1 rounded-none text-xs">
                <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider pl-1.5 pr-1 hidden sm:inline">PANTALLA:</span>
                
                <button
                  id="role-switch-both"
                  type="button"
                  onClick={() => setViewRole('both')}
                  className={`px-3 py-1 font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer rounded-none ${
                    viewRole === 'both' 
                      ? 'bg-orange-500 text-black font-black' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  👥 Mesa Completa
                </button>
                <button
                  id="role-switch-proj"
                  type="button"
                  onClick={() => setViewRole('projector')}
                  className={`px-3 py-1 font-bold uppercase text-[9px] tracking-wider transition-all cursor-pointer rounded-none ${
                    viewRole === 'projector' 
                      ? 'bg-orange-500 text-black font-black' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  🖥️ Sólo Pizarra (Proyector)
                </button>
                
                <select
                  id="role-switch-select"
                  onChange={(e) => setViewRole(e.target.value as any)}
                  value={['player_1', 'player_2', 'player_3'].includes(viewRole) ? viewRole : 'student_select'}
                  className="bg-[#111] text-zinc-300 border border-zinc-800 text-[9px] font-bold uppercase tracking-wider py-1 px-1.5 outline-none cursor-pointer rounded-none hover:border-orange-500/40"
                >
                  <option value="student_select" disabled>📱 Vista Celular...</option>
                  <option value="player_1">👤 {joinedAlumnos.player_1.name || 'Alumno 1'}</option>
                  <option value="player_2">👤 {joinedAlumnos.player_2.name || 'Alumno 2'}</option>
                  <option value="player_3">👤 {joinedAlumnos.player_3.name || 'Alumno 3'}</option>
                </select>

                <button
                  type="button"
                  onClick={() => setHideSandboxControls(true)}
                  title="Ocultar paneles de simulación asistiva"
                  className="px-2.5 py-1 text-zinc-500 hover:text-orange-500 font-bold uppercase text-[9px] tracking-wider cursor-pointer border-l border-zinc-800 hover:bg-zinc-900 transition-colors"
                >
                  👁️ Ocultar Panel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setHideSandboxControls(false)}
                className="px-3 py-1.5 bg-[#111] hover:bg-zinc-900 border-2 border-zinc-800 text-zinc-400 hover:text-orange-500 font-bold uppercase text-[9px] tracking-wider cursor-pointer transition-all rounded-none"
              >
                🛠️ Mostrar Selectores de Prueba
              </button>
            )}

            <span className="text-[10px] text-emerald-400 font-mono font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              VOTACIÓN ESTABLE
            </span>
          </div>
        </header>
      )}

      {/* Subtle Switcher bar for direct mobile layout testing/viewing */}
      {['alumno', 'player_1', 'player_2', 'player_3'].includes(viewRole) && !isStrictStudentMode && (
        <div className="max-w-[340px] mx-auto flex justify-between items-center px-4 py-1.5 text-[9px] text-zinc-500 font-mono tracking-wider border border-zinc-900 bg-zinc-950/80 rounded-lg">
          <span>📲 VISTA DE INTEGRANTE</span>
          <button 
            type="button" 
            onClick={() => setViewRole('both')}
            className="text-orange-500 hover:text-orange-400 underline transition-all cursor-pointer font-bold uppercase shrink-0"
          >
            VOLVER A MESA PROFE 👥
          </button>
        </div>
      )}

      {/* Global alert banner if active */}
      {alertMsg && (
        <div className="max-w-7xl mx-auto bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-pulse">
          <AlertCircle className="w-4 h-4" />
          {alertMsg}
        </div>
      )}

      {/* Display Screens Router */}
      <main className="max-w-7xl mx-auto space-y-6">
        {isGameOver ? (
          <GrandFinale
            room={room}
            players={players}
            logs={logs}
            onRestartGame={handleRestartGame}
          />
        ) : viewRole === 'alumno' ? (
          /* DIRECT INTEGRATED STUDENT SELECTS THEIR ROLE VIA SMART LINK */
          <div className="flex flex-col items-center justify-center py-4">
            <AlumnoDirectSelect
              roomCode={roomCode || 'SALA-4TO'}
              pairingMode={pairingMode}
              joinedAlumnos={joinedAlumnos}
              onStudentJoin={handleStudentJoin}
              onSelectRole={(selectedId) => setViewRole(selectedId)}
              onStudentCreateGroup={handleStudentCreateGroup}
              onStudentJoinGroup={handleStudentJoinGroup}
            />
          </div>
        ) : ['player_1', 'player_2', 'player_3'].includes(viewRole) ? (
          /* SINGLE USER MOBILE VIEW ROLE */
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="w-full max-w-[340px]">
              {gameScreenState !== 'playing' ? (
                <AlumnoOnboarding
                  playerId={viewRole as PlayerId}
                  defaultSuggestName={viewRole === 'player_1' ? 'Matias' : viewRole === 'player_2' ? 'Sofia' : 'Leonardo'}
                  roomCode={roomCode}
                  pairingMode={pairingMode}
                  joinedAlumnos={joinedAlumnos}
                  onStudentJoin={handleStudentJoin}
                  onStudentCreateGroup={handleStudentCreateGroup}
                  onStudentJoinGroup={handleStudentJoinGroup}
                  onStudentLeave={handleStudentLeave}
                />
              ) : (
                <PhoneSimulator
                  player={players[viewRole as PlayerId]}
                  room={room}
                  activeCard={currentCard}
                  onCastVote={handleCastVote}
                  onP2PTransfer={handleP2PTransfer}
                  onFundContribution={handleFundContribution}
                />
              )}
            </div>
          </div>
        ) : gameScreenState !== 'playing' ? (
          /* LOBBY / SETUP SCREEN */
          <div className="space-y-6">
            {/* Main Shared Projector Lobby View - No simulated cellphones underneath to avoid confusion with real device scans */}
            <RoomAccessModule
              gameScreenState={gameScreenState}
              roomCode={roomCode}
              pairingMode={pairingMode}
              joinedAlumnos={joinedAlumnos}
              onInitRoom={handleInitRoom}
              onSetPairingMode={handleSetPairingMode}
              onStudentJoin={handleStudentJoin}
              onStudentCreateGroup={handleStudentCreateGroup}
              onStudentJoinGroup={handleStudentJoinGroup}
              onStudentLeave={handleStudentLeave}
              onLargarPartida={handleLargarPartida}
              onResetAll={handleResetAll}
            />
          </div>
        ) : (
          /* ACTIVE PLAYING SCREEN */
          <div className="space-y-6">
            {/* 1. Main Shared Projector View */}
            <RoomDashboard
              room={room}
              activeCard={currentCard}
              players={players}
              onForceResolution={handleForceResolutionOfTurn}
              timerActive={timerActive}
              setTimerActive={setTimerActive}
              onResetTimer={() => setRoom((prev) => ({ ...prev, time_remaining: 90 }))}
            />

          </div>
        )}

        {/* Collapsible rulebook manual */}
        <InstructionGuide />
      </main>

      {/* Cierre Mensual Report Modal overlay popup */}
      {showCierreReport && (
        <CierreMensualModal
          currentMonth={room.current_month}
          playersBefore={playersBefore}
          playersAfter={players}
          logEntry={logEntryForReport}
          onClose={handleAdvanceToNextMonth}
          onAddChangaLiquidity={handleAddChangaLiquidity}
          adminId={room.current_administrator}
          adminName={players[room.current_administrator].name}
        />
      )}

      {/* Footer credits */}
      <footer className="max-w-7xl mx-auto text-center border-t border-zinc-900 pt-6 pb-8 text-[11px] text-zinc-600 font-mono">
        <p>CAPITAL COOP: FINANZAS EN COMUNIDAD es un simulador pedagógico libre y cooperativo.</p>
        <p className="mt-1">Pariado tipográfico Inter & JetBrains Mono — Hecho en sociedad solidaria de software.</p>
      </footer>
    </div>
  );
}
