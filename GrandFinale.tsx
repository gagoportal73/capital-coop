import React, { useState } from 'react';
import { RoomState, GameCard, PlayerState, PlayerId } from '../types';
import { Users, Award, ShieldAlert, CheckCircle, Clock, Play, Pause, RotateCcw, AlertCircle, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

interface RoomDashboardProps {
  room: RoomState;
  activeCard: GameCard;
  players: Record<string, PlayerState>;
  onForceResolution: () => void;
  timerActive: boolean;
  setTimerActive: (active: boolean) => void;
  onResetTimer: () => void;
}

export const RoomDashboard: React.FC<RoomDashboardProps> = ({
  room,
  activeCard,
  players,
  onForceResolution,
  timerActive,
  setTimerActive,
  onResetTimer,
}) => {
  const [viewMode, setViewMode] = useState<'projector' | 'teacher'>('projector');
  const [pairingMode, setPairingMode] = useState<'aleatorio' | 'manual'>('aleatorio');
  const [manualCode, setManualCode] = useState<string>('XF-742');

  const getAvatarLetter = (role: string) => {
    return role.charAt(0).toUpperCase();
  };

  const getPlayerStateChip = (playerId: PlayerId) => {
    const hasVoted = room.votes[playerId] !== null;
    return (
      <div
        key={playerId}
        id={`group-member-${playerId}`}
        className={`flex items-center justify-between p-3 rounded-none border-2 transition-all ${
          hasVoted
            ? 'bg-[#151515] border-emerald-500/60 text-emerald-300 animate-pulse'
            : 'bg-[#151515] border-zinc-800 text-zinc-400'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-none flex items-center justify-center font-black text-sm border-2 ${
              hasVoted ? 'bg-orange-500 border-black text-black' : 'bg-zinc-900 border-[#222] text-zinc-400'
            }`}
          >
            {getAvatarLetter(players[playerId].role)}
          </div>
          <div>
            <div className="font-bold text-zinc-150 flex items-center gap-1.5 uppercase tracking-wide text-xs">
              {players[playerId].name}
              {room.current_administrator === playerId && (
                <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1 py-0.5 font-bold uppercase">
                  ADMIN
                </span>
              )}
            </div>
            <div className="text-[10px] text-zinc-550 uppercase tracking-widest font-semibold">{players[playerId].roleName}</div>
          </div>
        </div>
        <div>
          {hasVoted ? (
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-none font-bold uppercase flex items-center gap-0.5">
              VOTÓ ✅
            </span>
          ) : (
            <span className="text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-0.5 rounded-none font-bold uppercase flex items-center gap-1 animate-pulse">
              PENSANDO... 💬
            </span>
          )}
        </div>
      </div>
    );
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Generate 14 groups for the Teacher Dashboard / Websocket Grid Scoreboard
  const getMockWebsocketGrid = () => {
    const list = Array.from({ length: 14 }).map((_, idx) => {
      const gIdx = idx + 1;
      
      // Group 1 is our real active user group
      if (gIdx === 1) {
        const studentNames = (Object.values(players) as PlayerState[]).map(p => p.name).filter(Boolean).join(', ');
        const displayName = studentNames ? `Mesa 01 - Equipo ${studentNames} (Ustedes)` : "Mesa 01 - Equipo Mati/Sofi/Leo (Ustedes)";
        return {
          id: room.group_id,
          name: displayName,
          collective_fund: room.collective_fund,
          points_score: room.points_score,
          votes_count: Object.values(room.votes).filter(v => v !== null).length,
          hasNegative: (Object.values(players) as PlayerState[]).some((p) => p.balance < 0),
          isUserGroup: true,
        };
      }

      // Simulated other groups deterministically seeded
      const mockPoints = 370 + (gIdx * 12) + (room.current_month * 18);
      const mockFund = 110000 + (gIdx * 6500) + (room.current_month * 9500) - (gIdx % 4 === 0 ? room.current_month * 14000 : 0);
      
      // Let Group 4 and Group 10 show negative balances as simulation progresses to trigger alerts!
      const hasNegative = (gIdx === 4 && room.current_month >= 3) || (gIdx === 10 && room.current_month >= 7);

      let votes_count = 3;
      if (room.voting_status === 'open') {
        votes_count = (gIdx + room.current_month) % 4; // 0, 1, 2, or 3 players voted
      }

      return {
        id: `GRP_${String(gIdx).padStart(2, '0')}`,
        name: `Mesa ${String(gIdx).padStart(2, '0')} - ${gIdx % 3 === 0 ? 'Fénix Cooperativo' : gIdx % 3 === 1 ? 'Los Solidarios' : 'Sinergia Barrial'}`,
        collective_fund: mockFund,
        points_score: mockPoints,
        votes_count,
        hasNegative,
        isUserGroup: false,
      };
    });

    // Sort by points_score in descending order
    list.sort((a, b) => b.points_score - a.points_score);
    return list;
  };

  const gridGroups = getMockWebsocketGrid();

  return (
    <div id="room-dashboard" className="bg-[#0A0A0A] border-2 border-[#222] p-6 shadow-[8px_8px_0px_0px_rgba(34,34,34,1)] rounded-none">
      
      {/* View Switcher Tabs - Aesthetic Fintech UI */}
      <div className="flex bg-[#0D0D0D] border-2 border-[#222] p-1 rounded-none mb-6">
        <button
          onClick={() => setViewMode('projector')}
          className={`flex-1 py-2.5 font-black uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-none ${
            viewMode === 'projector' 
              ? 'bg-orange-500 text-black font-black' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🎬 PROYECTOR DE LA CLASE (Dilema del Grupo)
        </button>
        <button
          onClick={() => setViewMode('teacher')}
          className={`flex-1 py-2.5 font-black uppercase text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 rounded-none ${
            viewMode === 'teacher' 
              ? 'bg-purple-650 text-white font-black border border-purple-400/30' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🏫 MÓDULO DEL PROFESOR (14 Mesas en Red)
        </button>
      </div>

      {/* Header Info Banner shared across dashboards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Progress Month card */}
        <div className="bg-[#0F0F0F] border-2 border-[#222] p-4 rounded-none flex flex-col justify-between border-t-4 border-t-orange-500">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">PROGRESO MENSUAL</div>
          <div className="text-2xl font-mono leading-none font-extrabold text-zinc-100 mt-2">
            MES <span className="text-orange-500">{String(room.current_month).padStart(2, '0')}</span> <span className="text-sm font-normal text-zinc-550">/ 12</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 mt-4 rounded-none overflow-hidden border border-zinc-850">
            <div
              className="bg-orange-500 h-full transition-all duration-500"
              style={{ width: `${(room.current_month / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* Collective Fund */}
        <div className="bg-[#0F0F0F] border-2 border-[#222] p-4 rounded-none flex flex-col justify-between border-t-4 border-t-green-500">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> FONDO COMÚN MESA 1
          </div>
          <div className="text-2xl font-black text-green-500 mt-2 tracking-tight">
            ${room.collective_fund.toLocaleString()} <span className="text-[11px] font-mono text-zinc-500 font-bold">ARS</span>
          </div>
          <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider mt-2 border-t border-zinc-900/60 pt-2">
            TESORERÍA SOLIDARIA
          </div>
        </div>

        {/* Strategic Score */}
        <div className="bg-[#0F0F0F] border-2 border-[#222] p-4 rounded-none flex flex-col justify-between border-t-4 border-t-amber-500">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" /> PUNTAJE DE GRUPO
          </div>
          <div className="text-2xl font-black text-amber-500 mt-2">
            {room.points_score} <span className="text-xs text-zinc-550 font-black">PUNTOS</span>
          </div>
          <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider mt-2 border-t border-zinc-900/60 pt-2">
            SCORING COOPERATIVO
          </div>
        </div>

        {/* Debate Countdown Timer */}
        <div className="bg-[#0F0F0F] border-2 border-[#222] p-4 rounded-none flex flex-col justify-between border-t-4 border-t-rose-650">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> TIEMPO DE ASAMBLEA
          </div>
          <div className={`text-2.5xl font-mono font-bold mt-2 leading-none ${room.time_remaining <= 15 ? 'text-rose-500 animate-pulse font-black' : 'text-zinc-100'}`}>
            {formatTime(room.time_remaining)}
          </div>
          <div className="flex gap-2 mt-3.5">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="px-2 py-0.5 rounded-none bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[8.5px] font-black text-zinc-300 uppercase flex items-center gap-1 cursor-pointer"
            >
              {timerActive ? <Pause className="w-2 h-2" /> : <Play className="w-2 h-2" />}
              {timerActive ? 'PAUSAR' : 'REANUDAR'}
            </button>
            <button
              onClick={onResetTimer}
              className="p-1 rounded-none bg-zinc-950 border border-zinc-805 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 cursor-pointer"
              title="Reiniciar a 90s"
            >
              <RotateCcw className="w-2 h-2" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'projector' ? (
        /* ======================== MODE A: GROUP PROJECTOR ======================== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Active Dilemma Card */}
          <div className="lg:col-span-2 bg-[#0D0D0D] border-2 border-[#222] rounded-none p-6 relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="inline-block bg-red-650 text-white text-[10px] font-black tracking-widest px-2.5 py-1 uppercase">
                  🚨 EVENTO MENSUAL DE CONTEXTO
                </div>
                <div className="bg-zinc-800 text-zinc-400 font-mono font-bold text-[9px] uppercase tracking-wider px-2 py-1 border border-zinc-700">
                  {activeCard.category}
                </div>
              </div>
              
              <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase block mb-1">
                {activeCard.target === 'group' ? 'DILEMA DE ASAMBLEA COLECTIVA' : `DILEMA DE ASAMBLEA - AFECTA PROPUESTA A: ${activeCard.target.toUpperCase()}`}
              </span>
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mb-4 italic text-zinc-100">
                {activeCard.title}
              </h1>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 italic border-l-4 border-orange-500 pl-4 py-1.5">
                {activeCard.text}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-black text-zinc-405 tracking-widest uppercase mb-4 pt-4 border-t border-zinc-900/80">
                OPCIONES DE VOTACIÓN DISPONIBLES EN TU CELULAR
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeCard.options.map((option) => {
                  const votesCount = Object.values(room.votes).filter((v) => v === option.id).length;
                  return (
                    <div
                      key={option.id}
                      className="group relative bg-[#151515] border-2 border-zinc-800 p-4 rounded-none text-left hover:border-orange-500/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-base font-black tracking-tight text-orange-500 mb-2">
                          OPCIÓN {option.id}
                        </div>
                        <p className="text-xs text-zinc-300 mb-6 italic leading-snug">
                          {option.text}
                        </p>
                      </div>
                      <div className="mt-auto pt-3 border-t border-zinc-900/60 text-[9.5px] font-mono text-zinc-500 leading-tight">
                        {option.effectDescription}
                      </div>
                      
                      {/* Count Badge indicator */}
                      <div className="absolute -top-3 -right-2.5 w-7 h-7 bg-orange-500 border-2 border-black text-black flex items-center justify-center text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {votesCount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Assembly Status and Votes tracker */}
          <div className="bg-[#0D0D0D] border-2 border-[#222] p-6 rounded-none flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#222]">
                <span className="text-xs font-black text-zinc-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-500 animate-pulse" /> VOTOS DE TU GRUPO (MESA 1)
                </span>
                <span className="text-[9px] font-mono font-black text-zinc-550">GRP_01</span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-sans">
                La asamblea debe resolver este mes en conjunto. Una vez emitido el voto, se visualiza en verde de inmediato.
              </p>

              <div className="space-y-3 mb-6">
                {getPlayerStateChip('player_1')}
                {getPlayerStateChip('player_2')}
                {getPlayerStateChip('player_3')}
              </div>
            </div>

            <div>
              <div className="bg-[#151515] border-l-4 border-orange-500 p-3 rounded-none mb-4">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-wide block mb-1">
                  Mecánica de Desempate
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  En desacuerdo absoluto (1 voto para A, 1 para B, 1 para C), rige unilateralmente el voto de quien sea **Administrador del Turno** este mes.
                </p>
              </div>

              <button
                id="btn-force-resolution"
                onClick={onForceResolution}
                className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-black py-3.5 px-4 rounded-none font-black text-xs uppercase tracking-widest border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                FORZAR RESOLUCIÓN DE TURNO AHORA
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ======================== MODE B: TEACHER CONTROL PANEL ======================== */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Módulo Creación de Sala */}
            <div className="bg-[#0D0D0D] border-2 border-zinc-800 p-6 rounded-none space-y-4">
              <div className="border-b border-zinc-800 pb-2">
                <span className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  🛡️ PARAMETRIZACIÓN: CREACIÓN DE SALA
                </span>
              </div>
              
              <p className="text-xs text-zinc-404 leading-relaxed font-sans">
                Para coordinar el aula de clases, seleccione cómo los alumnos formarán sus equipos cooperativos de 3 miembros:
              </p>

              {/* Emparejamiento selection toggle */}
              <div className="space-y-2.5">
                <div className="flex bg-black p-1 border border-zinc-800 rounded-none">
                  <button
                    onClick={() => setPairingMode('aleatorio')}
                    className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-none ${
                      pairingMode === 'aleatorio' ? 'bg-purple-650 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Aleatorio🔀
                  </button>
                  <button
                    onClick={() => setPairingMode('manual')}
                    className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-none ${
                      pairingMode === 'manual' ? 'bg-purple-650 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Manual⌨️
                  </button>
                </div>
                
                {pairingMode === 'aleatorio' ? (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-none text-[11px] text-emerald-400 font-bold uppercase tracking-wide">
                    🌀 MODO AUTOMÁTICO: La plataforma mezcla el padrón total en grupos balanceados de 3 integrantes al dar inicio.
                  </div>
                ) : (
                  <div className="space-y-2 text-[11px] bg-purple-950/10 border border-purple-500/20 p-3 rounded-none text-purple-300">
                    <p className="uppercase font-bold">⌨️ MODO MANUAL: Los grupos ingresan el código de confirmación del profesor:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        className="bg-black border border-purple-500 text-white py-1 px-2 font-mono text-center w-28 uppercase outline-none focus:ring-1 focus:ring-purple-400"
                      />
                      <button
                        onClick={() => {
                          const code = "CC-" + Math.floor(100 + Math.random() * 900);
                          setManualCode(code);
                        }}
                        className="bg-purple-700 hover:bg-purple-600 text-white text-[9px] font-black px-2 py-1 uppercase"
                      >
                        REGENERAR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Game Loop Global controller */}
            <div className="bg-[#0D0D0D] border-2 border-zinc-800 p-6 rounded-none space-y-4">
              <div className="border-b border-zinc-800 pb-2">
                <span className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                  ⚡ CONFIGURACIÓN GLOBAL DE LA PARTIDA
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Mandos generales del docente para sincronizar la clase. Puede detener el reloj de debate o avanzar los dilemas.
              </p>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="bg-black hover:bg-zinc-900 border border-zinc-700 py-3 text-[10px] font-black text-zinc-200 uppercase tracking-widest flex items-center justify-center gap-1.5"
                  >
                    {timerActive ? <Pause className="w-3 h-3 text-amber-500 animate-pulse" /> : <Play className="w-3 h-3 text-green-500" />}
                    {timerActive ? 'PAUSAR TIEMPO' : 'REANUDAR TIEMPO'}
                  </button>
                  <button
                    onClick={onForceResolution}
                    className="bg-purple-700 hover:bg-purple-600 border border-purple-500 py-3 text-[10px] text-white font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    RESOLVER MES
                  </button>
                </div>
                <div className="bg-[#111] p-2 text-center text-[10px] font-mono text-zinc-550 border border-zinc-900">
                  ESTADO: {timerActive ? 'DEBATIENDO EN TIEMPO REAL' : 'SIMULACIÓN GLOBAL PAUSADA'}
                </div>
              </div>
            </div>

            {/* 3. Pedagogical Room Guide explanation */}
            <div className="bg-[#0D0D0D] border-2 border-zinc-800 p-6 rounded-none space-y-3">
              <span className="text-xs font-black text-purple-400 uppercase tracking-widest block border-b border-zinc-800 pb-2">
                🎓 MONITOREO DE ALFABETIZACIÓN
              </span>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Observe la grilla a la derecha. Le permite detectar al instante qué grupos están cooperando y cuáles están experimentando <strong className="text-rose-400">embargos individuales (saldos en Rojo)</strong> para abrir un espacio de reflexión pedagógica.
              </p>
              <div className="bg-purple-950/5 border border-purple-500/10 p-2.5 text-[10px] text-purple-400 font-semibold font-mono leading-relaxed">
                COOPERACIÓN ACTIVA: 14 Grupos en Red local sincronizados virtualmente mediante WebSocket emulado.
              </div>
            </div>
          </div>

          {/* 4. Websocket Scoreboard general room grid */}
          <div className="bg-[#0D0D0D] border-2 border-zinc-800 p-6 rounded-none space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-3 gap-2">
              <div>
                <span className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  📡 WEBSOCKET GRID: MONITOREO DE TODA LA SALA EN TIEMPO REAL (14 GRUPOS)
                </span>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ORDENADO JERÁRQUICAMENTE POR SCORING COOPERATIVO ACUMULADO</p>
              </div>
              <span className="text-[11px] font-mono font-bold bg-green-500/10 text-green-400 px-3 py-1 border border-green-500/25">
                CONEXIÓN: 100% ONLINE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {gridGroups.map((g, rankIdx) => (
                <div
                  key={g.id}
                  className={`relative p-4 rounded-none border-2 transition-all flex flex-col justify-between space-y-3 ${
                    g.isUserGroup 
                      ? 'bg-orange-950/5 border-orange-500 hover:border-orange-400' 
                      : g.hasNegative 
                        ? 'bg-rose-950/10 border-rose-500/60 hover:border-rose-500 animate-pulse' 
                        : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'
                  }`}
                >
                  {/* Rank Header Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-black uppercase text-zinc-550">
                      RANK #{rankIdx + 1}
                    </span>
                    {g.isUserGroup ? (
                      <span className="bg-orange-500 text-black text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider">
                        TU GRUPO ⭐
                      </span>
                    ) : (
                      <span className="text-[9px] bg-zinc-850 text-zinc-400 px-1.5 py-0.5 font-bold uppercase tracking-wide">
                        Votos: <strong className="text-zinc-200">{g.votes_count}/3</strong>
                      </span>
                    )}
                  </div>

                  {/* Group Info */}
                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-200 uppercase tracking-wide truncate">
                      {g.name}
                    </h4>
                    <span className="text-[9px] text-[#555] font-semibold font-mono block">ID: {g.id}</span>
                  </div>

                  {/* Ledger mini numbers */}
                  <div className="grid grid-cols-2 gap-1 border-t border-zinc-900/60 pt-2.5 font-mono text-[10.5px]">
                    <div>
                      <span className="text-[8.5px] text-zinc-550 block uppercase font-bold leading-none mb-1">Pozo Coop</span>
                      <span className="text-emerald-400 font-black">${g.collective_fund.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] text-zinc-550 block uppercase font-bold leading-none mb-1">Puntaje</span>
                      <span className="text-amber-400 font-extrabold">{g.points_score} <span className="text-[8px] font-normal">PTS</span></span>
                    </div>
                  </div>

                  {/* Critical Visual Red negative indicators */}
                  {g.hasNegative ? (
                    <div className="bg-rose-650/15 border border-rose-500/30 p-2 text-center text-rose-500 text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5" /> ALERTA: BANCO EN ROJO (DUE)
                    </div>
                  ) : g.isUserGroup && room.votes.player_1 && room.votes.player_2 && room.votes.player_3 ? (
                    <div className="bg-[#151515] p-2 text-center text-emerald-400 text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> ¡Votación Completa!
                    </div>
                  ) : (
                    <div className="bg-[#151515] p-2 text-center text-zinc-500 text-[9px] font-bold uppercase tracking-wider">
                      ✅ Estabilidad Fiscal
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
