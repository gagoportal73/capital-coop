import { useState, useEffect, useRef } from 'react';
import { PlayerState, RoomState, GameLogEntry, GameCard, PlayerId } from './types';
import { CARDS_POOL, resolveGroupVoting, executeCardResolution } from './cardsData';
import { RoomDashboard } from './components/RoomDashboard';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CierreMensualModal } from './components/CierreMensualModal';
import { GrandFinale } from './components/GrandFinale';
import { InstructionGuide } from './components/InstructionGuide';
import { RoomAccessModule, AlumnoOnboarding, AlumnoLobbyState } from './components/RoomAccessModule';
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
  const [gameScreenState, setGameScreenState] = useState<'setup' | 'lobby' | 'playing'>('setup');
  const [roomCode, setRoomCode] = useState<string>('');
  const [pairingMode, setPairingMode] = useState<'aleatorio' | 'manual'>('aleatorio');
  const [joinedAlumnos, setJoinedAlumnos] = useState<Record<PlayerId, AlumnoLobbyState>>({
    player_1: { id: 'player_1', name: '', joined: false, subgroupCode: null, isCreator: false },
    player_2: { id: 'player_2', name: '', joined: false, subgroupCode: null, isCreator: false },
    player_3: { id: 'player_3', name: '', joined: false, subgroupCode: null, isCreator: false },
  });

  const handleInitRoom = (code: string, mode: 'aleatorio' | 'manual') => {
    setRoomCode(code);
    setPairingMode(mode);
    setGameScreenState('lobby');
  };

  const handleSetPairingMode = (mode: 'aleatorio' | 'manual') => {
    setPairingMode(mode);
  };

  const handleStudentJoin = (id: PlayerId, name: string) => {
    setJoinedAlumnos((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        name,
        joined: true,
      },
    }));
  };

  const handleStudentCreateGroup = (id: PlayerId, subgroupCode: string) => {
    setJoinedAlumnos((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        subgroupCode,
        isCreator: true,
      },
    }));
  };

  const handleStudentJoinGroup = (id: PlayerId, subgroupCode: string) => {
    setJoinedAlumnos((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        subgroupCode,
        isCreator: false,
      },
    }));
  };

  const handleStudentLeave = (id: PlayerId) => {
    setJoinedAlumnos((prev) => ({
      ...prev,
      [id]: {
        id,
        name: '',
        joined: false,
        subgroupCode: null,
        isCreator: false,
      },
    }));
  };

  const handleResetAll = () => {
    setGameScreenState('setup');
    setRoomCode('');
    setPairingMode('aleatorio');
    setJoinedAlumnos({
      player_1: { id: 'player_1', name: '', joined: false, subgroupCode: null, isCreator: false },
      player_2: { id: 'player_2', name: '', joined: false, subgroupCode: null, isCreator: false },
      player_3: { id: 'player_3', name: '', joined: false, subgroupCode: null, isCreator: false },
    });
    setPlayers(INITIAL_PLAYERS);
    setRoom(INITIAL_ROOM);
    setLogs([]);
    setIsGameOver(false);
  };

  const handleLargarPartida = () => {
    const roles: Array<'emprendedor' | 'empleado' | 'estudiante'> = ['emprendedor', 'empleado', 'estudiante'];
    const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

    const nextPlayers = { ...INITIAL_PLAYERS };
    
    Object.keys(joinedAlumnos).forEach((pId, idx) => {
      const playerId = pId as PlayerId;
      const studentName = joinedAlumnos[playerId].name || `Alumno ${idx + 1}`;
      const role = shuffledRoles[idx];
      
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

    setRoom({
      ...INITIAL_ROOM,
      room_id: roomCode,
      group_id: `MESA_${roomCode.replace('SALA-', '')}`,
      voting_status: 'open',
      votes: {
        player_1: null,
        player_2: null,
        player_3: null,
      },
      current_month: 1,
      time_remaining: 120,
    });

    setGameScreenState('playing');
  };

  // Simulation settings
  const [playMode, setPlayMode] = useState<'manual' | 'ai'>('manual'); // Manual mode of cellphones as default
  const [focusedPlayer, setFocusedPlayer] = useState<PlayerId>('player_1'); // For small screen mobile toggling

  // Role views: 'both' shows chalkboard & cellphones, 'projector' shows only whiteboard, and 'player_1'/'player_2'/'player_3' shows only that individual student screen!
  const [viewRole, setViewRole] = useState<'both' | 'projector' | 'player_1' | 'player_2' | 'player_3'>('both');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || window.location.search;
      if (hash.includes('rol=proyector')) {
        setViewRole('projector');
      } else if (hash.includes('rol=player_1')) {
        setViewRole('player_1');
      } else if (hash.includes('rol=player_2')) {
        setViewRole('player_2');
      } else if (hash.includes('rol=player_3')) {
        setViewRole('player_3');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
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
  const handleCastVote = (playerId: PlayerId, option: 'A' | 'B' | 'C') => {
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

      // Select next card
      // We can grab sequentially or pick another from our pool of 13 cards!
      const currentCardIndex = CARDS_POOL.findIndex((c) => c.id === prev.active_card_id);
      let nextCard = CARDS_POOL[0];
      if (currentCardIndex !== -1 && currentCardIndex + 1 < CARDS_POOL.length) {
        nextCard = CARDS_POOL[currentCardIndex + 1];
      } else {
        // fallback or loop
        nextCard = CARDS_POOL[Math.floor(Math.random() * CARDS_POOL.length)];
      }

      return {
        ...prev,
        current_month: nextMonth,
        voting_status: 'open',
        active_card_id: nextCard.id,
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

  const handleRestartGame = () => {
    setRoom(INITIAL_ROOM);
    setPlayers(INITIAL_PLAYERS);
    setLogs([]);
    setIsGameOver(false);
    setShowCierreReport(false);
    setLogEntryForReport(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6 selection:bg-orange-500 selection:text-black">
      {/* Top Brand Hub Nav */}
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
          </div>

          <span className="text-[10px] text-emerald-400 font-mono font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            VOTACIÓN ESTABLE
          </span>
        </div>
      </header>

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
            {/* 1. Main Shared Projector Lobby View */}
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

            {/* 2. Custom student simulated connection cards (Only if viewRole === 'both') */}
            {viewRole === 'both' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping" />
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-300 font-mono">
                      DISPOSITIVOS MÓVILES DE LOS ALUMNOS — INGRESO AL AULA (SIMULADOR)
                    </span>
                  </div>
                  {/* Mobile viewport selector toggler buttons */}
                  <div className="flex lg:hidden bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-[10px]">
                    {Object.keys(joinedAlumnos).map((pId) => (
                      <button
                        key={pId}
                        type="button"
                        onClick={() => setFocusedPlayer(pId as PlayerId)}
                        className={`px-2 py-1 rounded-md font-semibold ${
                          focusedPlayer === pId ? 'bg-zinc-850 text-zinc-100' : 'text-zinc-550'
                        }`}
                      >
                        {joinedAlumnos[pId as PlayerId].name || `Lobby ${pId.endsWith('1') ? 'A' : pId.endsWith('2') ? 'B' : 'C'}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of cellphones in onboarding phase */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  <div className={`${focusedPlayer === 'player_1' ? 'block' : 'hidden'} lg:block`}>
                    <AlumnoOnboarding
                      playerId="player_1"
                      defaultSuggestName="Matias"
                      roomCode={roomCode}
                      pairingMode={pairingMode}
                      joinedAlumnos={joinedAlumnos}
                      onStudentJoin={handleStudentJoin}
                      onStudentCreateGroup={handleStudentCreateGroup}
                      onStudentJoinGroup={handleStudentJoinGroup}
                      onStudentLeave={handleStudentLeave}
                    />
                  </div>

                  <div className={`${focusedPlayer === 'player_2' ? 'block' : 'hidden'} lg:block`}>
                    <AlumnoOnboarding
                      playerId="player_2"
                      defaultSuggestName="Sofia"
                      roomCode={roomCode}
                      pairingMode={pairingMode}
                      joinedAlumnos={joinedAlumnos}
                      onStudentJoin={handleStudentJoin}
                      onStudentCreateGroup={handleStudentCreateGroup}
                      onStudentJoinGroup={handleStudentJoinGroup}
                      onStudentLeave={handleStudentLeave}
                    />
                  </div>

                  <div className={`${focusedPlayer === 'player_3' ? 'block' : 'hidden'} lg:block`}>
                    <AlumnoOnboarding
                      playerId="player_3"
                      defaultSuggestName="Leonardo"
                      roomCode={roomCode}
                      pairingMode={pairingMode}
                      joinedAlumnos={joinedAlumnos}
                      onStudentJoin={handleStudentJoin}
                      onStudentCreateGroup={handleStudentCreateGroup}
                      onStudentJoinGroup={handleStudentJoinGroup}
                      onStudentLeave={handleStudentLeave}
                    />
                  </div>
                </div>
              </div>
            )}
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

            {/* 2. Client mobile phones mock simulation container (Only if viewRole === 'both') */}
            {viewRole === 'both' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-300 font-mono">
                      ACCESO INDIVIDUAL DE ALUMNOS (INTERFACES DE MESA EN PROYECTOR)
                    </span>
                  </div>
                  {/* Mobile viewport selector toggler buttons */}
                  <div className="flex lg:hidden bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-[10px]">
                    {Object.keys(players).map((pId) => (
                      <button
                        key={pId}
                        type="button"
                        onClick={() => setFocusedPlayer(pId as PlayerId)}
                        className={`px-2 py-1 rounded-md font-semibold ${
                          focusedPlayer === pId ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-550'
                        }`}
                      >
                        {players[pId].name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of cellphones */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  {/* Emprendedor Phone */}
                  <div className={`${focusedPlayer === 'player_1' ? 'block' : 'hidden'} lg:block`}>
                    <PhoneSimulator
                      player={players.player_1}
                      room={room}
                      activeCard={currentCard}
                      onCastVote={handleCastVote}
                      onP2PTransfer={handleP2PTransfer}
                      onFundContribution={handleFundContribution}
                    />
                  </div>

                  {/* Empleado Phone */}
                  <div className={`${focusedPlayer === 'player_2' ? 'block' : 'hidden'} lg:block`}>
                    <PhoneSimulator
                      player={players.player_2}
                      room={room}
                      activeCard={currentCard}
                      onCastVote={handleCastVote}
                      onP2PTransfer={handleP2PTransfer}
                      onFundContribution={handleFundContribution}
                    />
                  </div>

                  {/* Estudiante Phone */}
                  <div className={`${focusedPlayer === 'player_3' ? 'block' : 'hidden'} lg:block`}>
                    <PhoneSimulator
                      player={players.player_3}
                      room={room}
                      activeCard={currentCard}
                      onCastVote={handleCastVote}
                      onP2PTransfer={handleP2PTransfer}
                      onFundContribution={handleFundContribution}
                    />
                  </div>
                </div>
              </div>
            )}
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
