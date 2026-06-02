import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerId } from '../types';
import { 
  Users, 
  QrCode, 
  Sparkles, 
  Laptop, 
  CheckCircle, 
  Zap, 
  Plus, 
  Link as LinkIcon, 
  Play, 
  UserPlus, 
  ShieldAlert, 
  RefreshCw, 
  Camera, 
  BookOpen, 
  ArrowRight,
  LogOut
} from 'lucide-react';

// Crisp dynamically-generated scannable QR Code using a real standard format
const QRCodeSVG: React.FC<{ value: string }> = ({ value }) => {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(value)}`;
  const fallbackQrImageUrl = `https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=300`;

  return (
    <div className="flex flex-col items-center justify-center p-3.5 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative group select-none">
      <img
        src={qrImageUrl}
        alt="Real QR Code de Acceso Aula"
        className="w-44 h-44 object-contain bg-white transition-opacity duration-300"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackQrImageUrl;
        }}
        referrerPolicy="no-referrer"
      />
      {/* Decorative corners */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-500" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-500" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-orange-500" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-500" />
    </div>
  );
};

// Joined student format
export interface AlumnoLobbyState {
  id: PlayerId;
  name: string;
  joined: boolean;
  subgroupCode: string | null;
  isCreator: boolean;
  role?: 'emprendedor' | 'empleado' | 'estudiante' | null;
}

interface RoomAccessModuleProps {
  gameScreenState: 'setup' | 'lobby' | 'playing';
  roomCode: string;
  pairingMode: 'aleatorio' | 'manual';
  joinedAlumnos: Record<PlayerId, AlumnoLobbyState>;
  onInitRoom: (code: string, mode: 'aleatorio' | 'manual') => void;
  onSetPairingMode: (mode: 'aleatorio' | 'manual') => void;
  onStudentJoin: (id: PlayerId, name: string) => void;
  onStudentCreateGroup: (id: PlayerId, subgroupCode: string, role?: 'emprendedor' | 'empleado' | 'estudiante') => void;
  onStudentJoinGroup: (id: PlayerId, subgroupCode: string, role?: 'emprendedor' | 'empleado' | 'estudiante') => void;
  onStudentLeave: (id: PlayerId) => void;
  onLargarPartida: () => void;
  onResetAll: () => void;
}

export const RoomAccessModule: React.FC<RoomAccessModuleProps> = ({
  gameScreenState,
  roomCode,
  pairingMode,
  joinedAlumnos,
  onInitRoom,
  onSetPairingMode,
  onStudentJoin,
  onStudentCreateGroup,
  onStudentJoinGroup,
  onStudentLeave,
  onLargarPartida,
  onResetAll,
}) => {
  const [initCodeInput, setInitCodeInput] = useState('SALA-4TO');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const getDynamicQRUrl = () => {
    if (typeof window === 'undefined') return roomCode;
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?room=${encodeURIComponent(roomCode)}&rol=alumno`;
  };

  const qrUrl = getDynamicQRUrl();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };
  
  const allJoined = joinedAlumnos && 
                    !!joinedAlumnos.player_1?.joined && 
                    !!joinedAlumnos.player_2?.joined && 
                    !!joinedAlumnos.player_3?.joined;
  const activeStudentsList = (Object.values(joinedAlumnos) as AlumnoLobbyState[]).filter((a) => a.joined);

  // Group formatting for Mode B (Manual)
  const getSubgroupsMap = () => {
    const groups: Record<string, { creator: string; members: string[] }> = {};
    (Object.values(joinedAlumnos) as AlumnoLobbyState[]).forEach((a) => {
      if (a.subgroupCode) {
        if (!groups[a.subgroupCode]) {
          groups[a.subgroupCode] = { creator: '', members: [] };
        }
        if (a.isCreator) {
          groups[a.subgroupCode].creator = a.name;
        } else if (a.name) {
          groups[a.subgroupCode].members.push(a.name);
        }
      }
    });
    return groups;
  };
  
  const subgroups = getSubgroupsMap();

  // Helper to trigger fast complete join for testing
  const handleAutoTestJoin = () => {
    onStudentJoin('player_1', 'Matias G.');
    onStudentJoin('player_2', 'Sofia C.');
    onStudentJoin('player_3', 'Leo M.');
    
    if (pairingMode === 'manual') {
      setTimeout(() => {
        onStudentCreateGroup('player_1', 'XF74');
        onStudentJoinGroup('player_2', 'XF74');
        onStudentJoinGroup('player_3', 'XF74');
      }, 300);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border-4 border-[#222] p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(34,34,34,1)] rounded-none relative overflow-hidden">
      
      {/* Absolute background accent line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-650 via-orange-500 to-amber-500" />

      {/* Screen 1: SETUP (Creating the mother room) */}
      {gameScreenState === 'setup' && (
        <div className="py-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-purple-500/10 border-2 border-purple-500/30 text-purple-400 rounded-none flex items-center justify-center font-black animate-pulse">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-purple-400 font-mono font-bold uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5">
              PANEL DEL DOCENTE / PROYECTOR
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-100">
              INICIALIZACIÓN DE LA PARTIDA GLOBAL
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans max-w-sm mx-auto leading-relaxed">
              Inicie su sala de clase para habilitar la sincronización en tiempo real. Los alumnos se incorporarán escaneando el código QR.
            </p>
          </div>

          <div className="bg-[#111111] border-2 border-zinc-800 p-4 w-full rounded-none space-y-4">
            <div className="space-y-1.5 text-left">
              <label htmlFor="init-classroom-id" className="text-[10px] text-zinc-500 font-mono font-black uppercase tracking-wider">
                ID DE SALA PERSONALIZADO (CÓDIGO DEL AULA):
              </label>
              <div className="flex gap-2">
                <input
                  id="init-classroom-id"
                  type="text"
                  value={initCodeInput}
                  onChange={(e) => setInitCodeInput(e.target.value.toUpperCase().slice(0, 15))}
                  placeholder="ej: SALA-4TO"
                  className="flex-1 bg-black text-white hover:border-purple-500/40 border-2 border-zinc-800 rounded-none font-bold font-mono px-3 py-2 text-sm uppercase outline-none focus:border-purple-500 placeholder-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setInitCodeInput(`SALA-${Math.floor(100 + Math.random() * 900)}`)}
                  className="bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-400 px-3 text-[10px] uppercase font-black tracking-wider transition-all font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> azar
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-left border-t border-zinc-900/80 pt-3">
              <span className="text-[10px] text-zinc-500 font-mono font-black uppercase tracking-wider block">
                MODALIDAD POR DEFECTO PARA EL ARMADO DE GRUPOS:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSetPairingMode('aleatorio')}
                  className={`py-2 px-3 border-2 text-[11px] font-black uppercase tracking-wider text-center rounded-none transition-all ${
                    pairingMode === 'aleatorio'
                      ? 'bg-purple-650 border-purple-400 text-white shadow-[0_0_8px_rgba(124,58,237,0.2)]'
                      : 'bg-zinc-950 border-zinc-850 hover:border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Modo A: Aleatorio
                </button>
                <button
                  type="button"
                  onClick={() => onSetPairingMode('manual')}
                  className={`py-2 px-3 border-2 text-[11px] font-black uppercase tracking-wider text-center rounded-none transition-all ${
                    pairingMode === 'manual'
                      ? 'bg-purple-650 border-purple-400 text-white shadow-[0_0_8px_rgba(124,58,237,0.2)]'
                      : 'bg-zinc-950 border-zinc-850 hover:border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Modo B: Manual
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            id="btn-teacher-create-room"
            onClick={() => onInitRoom(initCodeInput || 'SALA-GENERAL', pairingMode)}
            className="w-full max-w-sm bg-purple-650 hover:bg-purple-600 active:scale-95 text-white py-4 px-6 rounded-none font-black text-sm uppercase tracking-widest border-2 border-purple-400 shadow-[4px_4px_0px_0px_rgba(124,58,237,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current mr-1 text-white" />
            CREAR NUEVA SALA DE CLASES
          </button>
        </div>
      )}

      {/* Screen 2: LOBBY (Active, students connecting via QR) */}
      {gameScreenState === 'lobby' && (
        <div id="teacher-lobby-panel" className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-[#222] pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-none flex items-center justify-center text-black font-black text-lg border-2 border-black">
                🏫
              </div>
              <div>
                <span className="text-[9px] text-purple-400 font-mono font-bold uppercase tracking-widest block leading-none">
                  ASSEMBLY LOBBY DE INTEGRANTES
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-zinc-150 leading-normal">
                  SALA PRINCIPAL: <span className="text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 font-mono">{roomCode}</span>
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-black text-zinc-440 uppercase tracking-wide font-sans">
                Grupo:
              </span>
              <div className="flex bg-zinc-900 border-2 border-zinc-800 p-0.5 rounded-none font-mono">
                <button
                  type="button"
                  onClick={() => onSetPairingMode('aleatorio')}
                  className={`px-3 py-1 text-[10px] font-black uppercase rounded-none transition-all ${
                    pairingMode === 'aleatorio'
                      ? 'bg-purple-650 text-white font-black border border-purple-450/40'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Aleatorio (Modo A)
                </button>
                <button
                  type="button"
                  onClick={() => onSetPairingMode('manual')}
                  className={`px-3 py-1 text-[10px] font-black uppercase rounded-none transition-all ${
                    pairingMode === 'manual'
                      ? 'bg-purple-650 text-white font-black border border-purple-450/40'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Manual (Modo B)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: QR Representation for Beamer projector */}
            <div className="bg-[#0D0D0D] border-2 border-zinc-850 p-6 rounded-none flex flex-col items-center justify-center text-center space-y-4">
              <QRCodeSVG value={qrUrl} />
              
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest block">
                  PROYECTAR EN PIZARRÓN
                </span>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xs mx-auto">
                  Pedile a los alumnos que <strong>escaneen este código QR</strong> con sus celulares para ingresar a esta sala de forma directa.
                </p>
              </div>

              <div className="w-full space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="w-full bg-[#111]/70 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[9px] font-bold px-2 py-1.5 flex items-center justify-between transition-all rounded-xs hover:border-purple-500/40"
                  title="Copiar enlace de acceso"
                >
                  <span className="truncate pr-1 text-left text-zinc-400">
                    {qrUrl.length > 30 ? qrUrl.substring(0, 27) + '...' : qrUrl}
                  </span>
                  <span className="text-purple-400 shrink-0 font-sans uppercase text-[8px] font-black tracking-wider bg-purple-500/10 px-1.5 py-0.5 border border-purple-500/10">
                    {copiedUrl ? '¡Copiado! ✅' : 'Copiar Enlace 📋'}
                  </span>
                </button>
                <div className="text-[9px] text-zinc-500 font-mono leading-none flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Servidor detectado: {typeof window !== 'undefined' ? window.location.host : 'servidor'}
                </div>
              </div>

              <div className="bg-zinc-950 p-2.5 border border-zinc-900 w-full font-mono text-[11px] text-purple-400 font-black uppercase tracking-wider">
                Código alternativo: <span className="text-zinc-100 underline decoration-purple-500 decoration-2">{roomCode}</span>
              </div>
            </div>

            {/* Middle and Right Column: Sincronización feedback */}
            <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
              
              {/* Dynamic Status Title */}
              <div className="bg-[#0D0D0D] border-2 border-zinc-850 p-4 rounded-none space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-400 tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
                    <Users className="w-4 h-4 text-purple-400" /> ALUMNOS CONECTADOS EN TIEMPO REAL: {activeStudentsList.length} / 3
                  </span>
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 ${allJoined ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                    {allJoined ? 'SALA LISTA' : 'COMPLETANDO MESA'}
                  </span>
                </div>
                
                <p className="text-[11px] font-sans text-zinc-450 leading-relaxed">
                  {pairingMode === 'aleatorio'
                    ? 'Cada alumno ingresará a un fondo colectivo unificado. Al dar inicio, el motor mezclará a todos los estudiantes listos en grupos aleatorios de 3, asignándoles de forma equitativa el perfil impositivo correspondiente.'
                    : 'Modo Cooperativo Físico de Afinidad. Los chicos se organizan en el aula de a tres miembros y configuran un subgrupo privado para poder resolver la partida vinculados.'}
                </p>
              </div>

              {/* Waiting grid layout details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 my-2">
                {/* Panel 1: Lista Padrón */}
                <div className="bg-[#0D0D0D] border-2 border-zinc-850 p-4 rounded-none flex flex-col">
                  <h4 className="text-[10.5px] font-mono font-black text-zinc-300 uppercase tracking-wider pb-2 border-b border-zinc-900 mb-2">
                    👨‍🎓 PADRÓN TOTAL DE ALUMNOS ({activeStudentsList.length})
                  </h4>
                  {activeStudentsList.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-650 min-h-[140px] border border-dashed border-zinc-900">
                      <UserPlus className="w-8 h-8 mb-2 opacity-30" />
                      <span className="text-[10px] font-mono font-black uppercase">Esperando ingresos...</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      {activeStudentsList.map((a) => (
                        <div key={a.id} className="bg-zinc-950 p-2.5 border border-zinc-900 flex items-center justify-between text-xs font-mono font-bold uppercase">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            <span className="text-zinc-200">{a.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onStudentLeave(a.id)}
                            className="text-[9px] text-rose-500 hover:text-rose-400 uppercase font-black tracking-wider hover:underline"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Panel 2: Grupo de afinidad structures or Mode A pool */}
                <div className="bg-[#0D0D0D] border-2 border-zinc-850 p-4 rounded-none flex flex-col">
                  {pairingMode === 'aleatorio' ? (
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <h4 className="text-[10.5px] font-mono font-black text-zinc-300 uppercase tracking-wider pb-2 border-b border-zinc-900">
                        🌀 MESA AUTOMÁTICA EN ESPERA
                      </h4>
                      <div className="bg-[#121212] p-4 border border-zinc-900 text-center text-zinc-500 flex-1 flex flex-col justify-center space-y-1">
                        <span className="text-xl">🔀</span>
                        <span className="text-[10px] font-mono font-black uppercase text-zinc-400">Mezcla Balanceada</span>
                        <p className="text-[10px] text-zinc-550 italic font-sans px-2">
                          Se necesita un total de 3 alumnos listos en la sala para poder consolidar el arranque.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 flex flex-col h-full">
                      <h4 className="text-[10.5px] font-mono font-black text-zinc-305 uppercase tracking-wider pb-2 border-b border-zinc-900">
                        👥 MESA MANUAL COOPERATIVA
                      </h4>
                      
                      {Object.keys(subgroups).length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-zinc-650 font-mono border border-dashed border-zinc-900 min-h-[140px]">
                          <Zap className="w-7 h-7 mb-1.5 opacity-30 text-purple-400" />
                          <span className="text-[9px] font-black uppercase leading-normal">Cargá un subgrupo en los teléfonos</span>
                        </div>
                      ) : (
                        <div className="space-y-2 overflow-y-auto max-h-[150px] pr-1 flex-1">
                          {Object.entries(subgroups).map(([code, g]) => {
                            const isComplete = g.members.length >= 2;
                            return (
                              <div key={code} className={`p-2.5 border text-[11px] font-mono ${isComplete ? 'bg-green-950/10 border-green-500/30' : 'bg-[#151515] border-zinc-850'}`}>
                                <div className="flex justify-between items-center border-b border-zinc-900 pb-1 mb-1.5">
                                  <span className="font-extrabold text-purple-400 uppercase">SUBGRUPO: #{code}</span>
                                  <span className={`text-[9px] font-black uppercase ${isComplete ? 'text-green-400 animate-pulse' : 'text-amber-500 animate-pulse'}`}>
                                    {isComplete ? 'Completo ✅' : `Uniendo: ${g.members.length + 1}/3`}
                                  </span>
                                </div>
                                <div className="space-y-0.5 text-zinc-350 italic pl-1 leading-normal">
                                  <div>👤 {g.creator} <span className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 font-bold">LÍDER</span></div>
                                  {g.members.map((m, idx) => (
                                    <div key={idx}>👥 {m}</div>
                                  ))}
                                  {g.members.length < 2 && (
                                    <div className="text-[9.5px] text-zinc-600 font-bold uppercase font-mono animate-pulse">💡 ¡Ingresá #{code} en los otros celulares!</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button at footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-zinc-950 p-4 border-2 border-zinc-900 mt-2 gap-3">
                <div className="flex gap-2 items-center">
                  <ShieldAlert className={`w-5 h-5 shrink-0 ${allJoined ? 'text-emerald-400' : 'text-amber-500 animate-pulse'}`} />
                  <div className="text-left font-sans text-[10.5px] text-zinc-450 leading-relaxed">
                    <span className="font-black text-zinc-300 uppercase block leading-none mb-0.5">ESTADO DEL ARRANQUE:</span>
                    {allJoined 
                      ? 'Todos los 3 integrantes están cargados en la base local. ¡Haga click en Largar Partida!' 
                      : 'La sala requiere que existan 3 alumnos validados para poder dar arranque al simulador pedagógico.'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onResetAll}
                    className="p-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 border-2 border-[#222] font-black uppercase text-xs tracking-wider transition-all cursor-pointer"
                    title="Reiniciar Sala y resetear teléfonos"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    id="btn-teacher-start-game"
                    onClick={onLargarPartida}
                    disabled={!allJoined}
                    className={`px-6 py-3.5 font-black uppercase text-xs tracking-widest border-2 border-black transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                      allJoined
                        ? 'bg-orange-500 hover:bg-orange-400 text-black font-black animate-bounce'
                        : 'bg-zinc-850 text-zinc-600 border-zinc-900 cursor-not-allowed'
                    }`}
                  >
                    💡 ¡LARGAR PARTIDA COOPERATIVA! 🎮
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Alumno Phone QR Onboarding visual simulator
interface AlumnoOnboardingProps {
  playerId: PlayerId;
  defaultSuggestName: string;
  roomCode: string; // The active creator classroom code (e.g. SALA-4TO)
  pairingMode: 'aleatorio' | 'manual';
  joinedAlumnos: Record<PlayerId, AlumnoLobbyState>;
  onStudentJoin: (id: PlayerId, name: string) => void;
  onStudentCreateGroup: (id: PlayerId, subgroupCode: string, role?: 'emprendedor' | 'empleado' | 'estudiante') => void;
  onStudentJoinGroup: (id: PlayerId, subgroupCode: string, role?: 'emprendedor' | 'empleado' | 'estudiante') => void;
  onStudentLeave: (id: PlayerId) => void;
}

export const AlumnoOnboarding: React.FC<AlumnoOnboardingProps> = ({
  playerId,
  defaultSuggestName,
  roomCode,
  pairingMode,
  joinedAlumnos,
  onStudentJoin,
  onStudentCreateGroup,
  onStudentJoinGroup,
  onStudentLeave,
}) => {
  const currentAlumno = joinedAlumnos[playerId];
  
  const [activeStep, setActiveStep] = useState<'welcome' | 'scan' | 'manualInput' | 'nameInput' | 'lobby'>(
    currentAlumno.joined ? 'lobby' : 'welcome'
  );
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [typedName, setTypedName] = useState(defaultSuggestName);
  const [typedSubgroupInput, setTypedSubgroupInput] = useState('');
  const [scanMessage, setScanMessage] = useState('Buscando QR de la Profesora...');
  const [scanning, setScanning] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Sync state if player join state changes or deletes
  useEffect(() => {
    if (currentAlumno.joined) {
      setActiveStep('lobby');
    } else if (activeStep !== 'welcome' && activeStep !== 'scan' && activeStep !== 'manualInput') {
      setActiveStep('welcome');
    }
  }, [currentAlumno.joined]);

  const handleStartScan = () => {
    setActiveStep('scan');
    setScanning(true);
    setScanMessage('Encendiendo cámara frontal...');
    
    setTimeout(() => {
      setScanMessage('Buscando QR en el pizarrón... 🔎');
    }, 800);

    setTimeout(() => {
      // Decode QR successfully
      setScanMessage('✅ ¡CÓDIGO DE SALA DETECTADO: ' + roomCode + '!');
      // Simple beep sound simulation visually
    }, 1800);

    setTimeout(() => {
      setScanning(false);
      setInputRoomCode(roomCode);
      setActiveStep('nameInput');
    }, 2800);
  };

  const handleManualCodeSubmit = () => {
    if (inputRoomCode.toUpperCase().trim() === roomCode.trim()) {
      setErrorText(null);
      setActiveStep('nameInput');
    } else {
      setErrorText('⚠️ El código ingresado no existe o no corresponde a una sala activa en el aula.');
      setTimeout(() => setErrorText(null), 3000);
    }
  };

  const handleNameSubmit = () => {
    if (!typedName.trim()) {
      setErrorText('⚠️ Por favor escribe tu Nombre y Apellido.');
      setTimeout(() => setErrorText(null), 2500);
      return;
    }
    setErrorText(null);
    onStudentJoin(playerId, typedName);
    setActiveStep('lobby');
  };

  const handleCreateSubgroup = () => {
    // Generate a beautiful alfanumeric code (e.g. FX-32)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const firstChar = chars[Math.floor(Math.random() * chars.length)];
    const secondChar = chars[Math.floor(Math.random() * chars.length)];
    const num = Math.floor(10 + Math.random() * 90);
    const randomCode = `${firstChar}${secondChar}-${num}`;

    // Select random role from all possible roles
    const roles: Array<'emprendedor' | 'empleado' | 'estudiante'> = ['emprendedor', 'empleado', 'estudiante'];
    const assignedRole = roles[Math.floor(Math.random() * roles.length)];

    onStudentCreateGroup(playerId, randomCode, assignedRole);
  };

  const handleJoinSubgroup = () => {
    const code = typedSubgroupInput.toUpperCase().trim();
    if (!code) {
      setErrorText('⚠️ Ingresá el código de subgrupo.');
      setTimeout(() => setErrorText(null), 2500);
      return;
    }
    
    // Find if subgroup exists and has a creator
    const targetGroupMembers = (Object.values(joinedAlumnos) as AlumnoLobbyState[]).filter((a) => a.subgroupCode?.toUpperCase() === code && a.joined);
    if (targetGroupMembers.length === 0) {
      setErrorText('⚠️ Código de grupo no encontrado. Pedile a un compañero de tu mesa que cree el grupo primero.');
      setTimeout(() => setErrorText(null), 3000);
      return;
    }

    if (targetGroupMembers.length >= 3) {
      setErrorText('⚠️ Subgrupo completo. Este subgrupo ya cuenta con 3 alumnos conectados.');
      setTimeout(() => setErrorText(null), 3000);
      return;
    }

    // Determine remaining roles
    const occupiedRoles = targetGroupMembers.map((m) => m.role).filter(Boolean);
    const allRoles: Array<'emprendedor' | 'empleado' | 'estudiante'> = ['emprendedor', 'empleado', 'estudiante'];
    const availableRoles = allRoles.filter((r) => !occupiedRoles.includes(r));

    // Select role equitably
    if (availableRoles.length === 0) {
      setErrorText('⚠️ Este grupo ya tiene todos los roles ocupados.');
      setTimeout(() => setErrorText(null), 3000);
      return;
    }

    const assignedRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];

    setErrorText(null);
    onStudentJoinGroup(playerId, code, assignedRole);
  };

  // Helper getters
  const currentSubgroupOwner = (Object.values(joinedAlumnos) as AlumnoLobbyState[]).find((a) => a.subgroupCode === currentAlumno.subgroupCode && a.isCreator);
  const currentSubgroupMembers = (Object.values(joinedAlumnos) as AlumnoLobbyState[]).filter((a) => a.subgroupCode === currentAlumno.subgroupCode && !a.isCreator && a.joined);
  
  // Total members in student's manual group
  const manualGroupTotalCount = 1 + currentSubgroupMembers.length;

  return (
    <div className="w-full max-w-[340px] bg-[#0A0A0A] border-4 border-[#222] rounded-[32px] overflow-hidden shadow-[6px_6px_0px_0px_rgba(34,34,34,1)] relative mx-auto flex flex-col h-[560px]">
      {/* Phone Notch */}
      <div className="w-full bg-[#0F0F0F] h-6 relative shrink-0 flex items-center justify-between px-6 border-b border-[#222]">
        <span className="text-[10px] text-zinc-500 font-mono font-bold">12:30 PM</span>
        <div className="w-24 h-4 bg-zinc-950 rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0 border-b border-zinc-850" />
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <div className="w-3.5 h-2 bg-zinc-700 rounded-xs" />
        </div>
      </div>

      {/* Internal Phone Navigator Header */}
      <div className="bg-[#121212] border-b border-[#222] py-2.5 px-4 flex items-center justify-between shrink-0">
        <span className="text-xs font-black text-zinc-100 tracking-wider flex items-center gap-1 ml-1 uppercase font-mono">
          📲 Capital Coop Alumno
        </span>
        <span className="text-[8px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 uppercase tracking-wide">
          {pairingMode === 'manual' && currentAlumno.role 
            ? `ROL: ${currentAlumno.role.toUpperCase()}`
            : 'CONECTADO'}
        </span>
      </div>

      {/* Internal screen body scroll window */}
      <div className="p-4 flex-1 overflow-y-auto bg-[#0A0A0A] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: WELCOME SCREEN */}
          {activeStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col justify-between py-2 space-y-4"
            >
              <div className="text-center space-y-3 pt-6">
                <div className="w-14 h-14 bg-orange-500 rounded-none border-2 border-black flex items-center justify-center font-black text-black text-2xl shadow-[3px_3px_0px_0px_rgba(245,158,11,0.2)] mx-auto animate-bounce">
                  CC
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest font-mono">FINANZAS COOPERATIVAS</h3>
                  <p className="text-[10px] text-zinc-550 uppercase font-bold tracking-wider">Unite a la Sala del Curso</p>
                </div>
                <div className="border border-zinc-900 bg-zinc-950 p-2.5 text-[10.5px] text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  💡 Escaneá el QR proyectado en el pizarrón de tu aula o escribí el código provisto por la profesora.
                </div>
              </div>

              <div className="space-y-2 mt-auto">
                <button
                  type="button"
                  onClick={handleStartScan}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-black py-3 font-black text-xs uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-2 border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(245,158,11,0.25)]"
                >
                  <Camera className="w-4 h-4 text-black shrink-0" />
                  Escanear Código QR 📸
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStep('manualInput')}
                  className="w-full bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 py-2.5 font-bold uppercase text-[10px] tracking-wide border-2 border-zinc-850 rounded-none cursor-pointer"
                >
                  Ingresar Código Manual ⌨️
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SCAN CAMERA VIEWPORT */}
          {activeStep === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-between py-1 h-full select-none"
            >
              {/* Outer grid camera frame */}
              <div className="relative w-full aspect-square max-w-[240px] bg-zinc-950 border-4 border-zinc-800 rounded-none mx-auto overflow-hidden mt-6 flex flex-col items-center justify-center">
                
                {/* Visual Viewfinder Corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500" />

                {/* Pulsing Target Grid */}
                <div className="w-24 h-24 border-2 border-zinc-700/40 border-dashed animate-pulse flex items-center justify-center text-zinc-700 text-lg">
                  <QrCode className="w-10 h-10 stroke-1 text-zinc-800" />
                </div>

                {/* Laser scan line effect */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] animate-bounce" style={{ top: '35%' }} />
              </div>

              <div className="text-center space-y-2 mt-4">
                <span className="text-[9px] text-zinc-550 font-mono font-bold uppercase tracking-wider block">VIEWFINDER ACTIVO</span>
                <p className="text-xs font-mono font-black text-orange-400 uppercase tracking-wide animate-pulse">
                  {scanMessage}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep('welcome')}
                className="mt-auto w-full bg-zinc-900 border border-zinc-805 text-zinc-400 py-1.5 font-bold uppercase text-[10px] tracking-widest hover:text-zinc-200 cursor-pointer"
              >
                cancelar
              </button>
            </motion.div>
          )}

          {/* STEP 3: MANUAL INPUT FORM */}
          {activeStep === 'manualInput' && (
            <motion.div
              key="manualInput"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-between py-2 space-y-4"
            >
              <div className="space-y-4 text-center pt-4">
                <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 uppercase tracking-widest font-mono font-black">
                  CÓDIGO DE ACCESO
                </span>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase text-zinc-200 tracking-wide">Escribí el Código de la Sala Proyectada:</h4>
                  <p className="text-[10px] text-zinc-500 italic">Ejem: SALA-4TO o el código generado en la pantalla de la profe</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={inputRoomCode}
                    onChange={(e) => setInputRoomCode(e.target.value)}
                    placeholder="SALA-XXXXXXXX"
                    className="w-full bg-[#111] hover:border-zinc-700 border-2 border-zinc-800 p-2.5 text-center font-mono text-sm uppercase text-white rounded-none outline-none focus:border-orange-500 placeholder-zinc-800"
                  />
                  {errorText && (
                    <div className="text-[10px] text-rose-500 font-bold bg-rose-500/5 p-2 border border-rose-500/10 uppercase tracking-tight">
                      {errorText}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-auto">
                <button
                  type="button"
                  onClick={handleManualCodeSubmit}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-black py-3 font-black text-xs uppercase tracking-wider rounded-none transition-all cursor-pointer border-2 border-black"
                >
                  Verificar y Conectar Sala 🔗
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('welcome')}
                  className="w-full text-zinc-500 font-bold text-[10px] uppercase tracking-wide py-1.5 hover:text-zinc-350 cursor-pointer"
                >
                  volver atrás
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: STUDENT NAME REGISTRATION */}
          {activeStep === 'nameInput' && (
            <motion.div
              key="nameInput"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between py-2 space-y-4"
            >
              <div className="space-y-4 text-center pt-4">
                <span className="text-[9px] bg-[#121212] border border-orange-500/20 text-orange-400 px-2 py-0.5 uppercase tracking-widest font-mono font-bold">
                  SALA COMPARTIDA ENCONTRADA 🎯
                </span>
                
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase text-zinc-150 tracking-wider">¿Cuál es tu Nombre y Apellido?</h4>
                  <p className="text-[9.5px] text-zinc-500 leading-normal">
                    Este nombre será visible para la profesora en la grilla del pizarrón y para tus socios de mesa.
                  </p>
                </div>

                <div className="space-y-2 text-left">
                  <input
                    type="text"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value.slice(0, 20))}
                    placeholder="Ejem: Sofia Cabrera"
                    className="w-full bg-[#111] hover:border-zinc-700 border-2 border-zinc-800 p-3 font-semibold text-xs text-zinc-100 rounded-none outline-none focus:border-orange-500"
                  />
                  
                  <div className="flex justify-between items-center bg-black border border-zinc-850 p-2 text-[10px] text-zinc-450 font-mono">
                    <span className="uppercase text-zinc-550 leading-none">Mesa Virtual:</span>
                    <span className="text-zinc-200">#{roomCode}</span>
                  </div>

                  {errorText && (
                    <div className="text-[10px] text-rose-500 font-bold bg-rose-500/5 p-2 border border-rose-500/10 uppercase tracking-tight">
                      {errorText}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNameSubmit}
                className="w-full bg-orange-500 hover:bg-orange-400 text-black py-3 font-black text-xs uppercase tracking-wider rounded-none transition-all mt-auto cursor-pointer border-2 border-black"
              >
                UNIRME A LA CLASE DE LA PROFE 🎓
              </button>
            </motion.div>
          )}

          {/* STEP 5: STUDENT WAIT LOBBY (Branches by Mode A vs B) */}
          {activeStep === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col justify-between py-1 h-full"
            >
              <div className="space-y-4">
                
                {/* Header Lobby status display */}
                <div className="bg-zinc-950 p-3 border-2 border-zinc-900 rounded-none space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-black text-purple-400 uppercase tracking-widest font-mono">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    CONECTADO AL DOCENTE
                  </div>
                  <span className="text-[9.5px] text-zinc-450 leading-none block font-mono">SALA MADRE: {roomCode}</span>
                </div>

                {/* Profile card of student */}
                <div className="bg-[#151515] p-3 border border-zinc-850 rounded-none text-left flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[8.5px] text-zinc-550 block font-mono uppercase font-black tracking-widest leading-none mb-1">Tu Identificación:</span>
                    <span className="font-extrabold uppercase text-zinc-200">{currentAlumno.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onStudentLeave(playerId);
                      setActiveStep('welcome');
                    }}
                    className="p-1 px-2 border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold text-[9px] uppercase tracking-wide shrink-0 transition-all cursor-pointer"
                  >
                    Salir
                  </button>
                </div>

                {/* BRANCH MODO A: ALEATORIO */}
                {pairingMode === 'aleatorio' && (
                  <div className="space-y-3 pt-2">
                    <div className="bg-[#0D0D0D] border-2 border-zinc-850 p-4 rounded-none text-center space-y-3">
                      <div className="text-2xl animate-spin self-center" style={{ animationDuration: '4s' }}>🌀</div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-wider block">SALA DE ESPERA COLECTIVA ACTIVADA</span>
                        <p className="text-[10px] text-zinc-450 font-sans leading-normal px-2">
                          La profesora está esperando a que <strong>toda la clase</strong> se conecte para largar.
                        </p>
                      </div>
                    </div>

                    {/* Simple live connections preview */}
                    <div className="bg-black p-3 border border-zinc-900 rounded-none space-y-2">
                      <span className="text-[8.5px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">MIS COMPAÑEROS DE SALA DISPONIBLES:</span>
                      <div className="space-y-1 max-h-[110px] overflow-y-auto">
                        {(Object.values(joinedAlumnos) as AlumnoLobbyState[]).filter((a) => a.joined).map((a) => (
                          <div key={a.id} className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                            <span>👤 {a.name} {a.id === playerId ? '(Yo)' : ''}</span>
                            <span className="text-[8px] text-emerald-400 font-bold">● LISTO</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* BRANCH MODO B: MANUAL/POR AFINIDAD */}
                {pairingMode === 'manual' && (
                  <div className="space-y-3 pt-1">
                    
                    {/* Subgroup Not Assigned yet */}
                    {!currentAlumno.subgroupCode ? (
                      <div className="bg-[#0D0D0D] border-2 border-zinc-850 p-4 rounded-none space-y-4">
                        <div className="text-center space-y-1">
                          <span className="text-[10px] text-zinc-400 font-mono font-black uppercase tracking-widest block">ASIGNACIÓN DE SUB-MESA:</span>
                          <p className="text-[9.5px] text-zinc-500 leading-normal font-sans">
                            Reunite en el aula con tus 3 compañeros de equipo. Uno de ustedes creará la mesa y los otros se unirán con el código de 4 dígitos.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={handleCreateSubgroup}
                            className="w-full bg-purple-650 hover:bg-purple-600 border border-purple-400 text-white font-black text-[10.5px] uppercase tracking-wider py-2 rounded-none transition-all cursor-pointer text-center"
                          >
                            ➕ Crear Grupo de 3
                          </button>
                          
                          <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-zinc-900"></div>
                            <span className="flex-shrink mx-2 text-[8.5px] text-zinc-650 font-mono font-bold uppercase tracking-widest">ó</span>
                            <div className="flex-grow border-t border-zinc-900"></div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={typedSubgroupInput}
                                onChange={(e) => setTypedSubgroupInput(e.target.value.toUpperCase().slice(0, 6))}
                                placeholder="Escribe Sub-Código (ej: XF74)"
                                className="flex-1 bg-black text-white hover:border-zinc-800 border border-zinc-850 text-center font-mono text-xs uppercase rounded-none py-1.5 outline-none focus:border-purple-400"
                              />
                              <button
                                type="button"
                                onClick={handleJoinSubgroup}
                                className="bg-zinc-850 hover:bg-zinc-750 text-zinc-300 hover:text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-center border border-zinc-750 font-mono transition-colors"
                              >
                                unirme
                              </button>
                            </div>
                            
                            {errorText && (
                              <div className="text-[9px] text-rose-500 font-bold bg-rose-500/5 p-1 border border-rose-500/10 uppercase tracking-tight text-center">
                                {errorText}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sub-Group Assigned Screen */
                      <div className="bg-[#0D0D0D] border-2 border-zinc-850 p-4 rounded-none space-y-3 text-left">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5 mb-1.5">
                          <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest">
                            TU SUBGRUPO: #{currentAlumno.subgroupCode}
                          </span>
                          <span className={`text-[8px] font-black uppercase ${manualGroupTotalCount >= 3 ? 'text-green-400' : 'text-amber-500 animate-pulse'}`}>
                            {manualGroupTotalCount >= 3 ? 'GRUPO LLENO ✅' : `UNIDOS: ${manualGroupTotalCount}/3`}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          {/* List of members currently in subgroup */}
                          <div className="bg-zinc-950 p-2.5 border border-zinc-900 w-full space-y-2 font-mono text-[10.5px]">
                            
                            <div className="bg-purple-950/20 p-2 border border-purple-500/10 mb-2 rounded">
                              <div className="text-[8px] text-purple-400 font-bold uppercase tracking-wider leading-none mb-1">Tu Rol Comercial Asignado:</div>
                              <div className="text-xs font-black text-purple-200 uppercase tracking-wider flex items-center gap-1">
                                💼 {currentAlumno.role === 'emprendedor' ? 'El Emprendedor (Pyme)' : currentAlumno.role === 'empleado' ? 'El Empleado' : 'El Estudiante'}
                              </div>
                            </div>

                            <div className="text-[9px] text-zinc-550 uppercase tracking-widest pb-1 font-bold border-b border-zinc-900 leading-none">Miembros en el Banco:</div>

                            <div className="flex justify-between items-center py-0.5">
                              <span className="text-zinc-200 font-extrabold text-xs">
                                👤 {currentSubgroupOwner?.name || currentAlumno.name}
                                {currentSubgroupOwner?.role && (
                                  <span className="text-[9px] text-zinc-500 font-bold lowercase ml-1">
                                    ({currentSubgroupOwner.role === 'emprendedor' ? 'emprendedor' : currentSubgroupOwner.role === 'empleado' ? 'empleado' : 'estudiante'})
                                  </span>
                                )}
                              </span>
                              <span className="text-[7.5px] bg-purple-500/15 text-purple-400 border border-purple-500/25 px-1 py-0.5 font-bold uppercase">CREADOR</span>
                            </div>

                            {currentSubgroupMembers.map((m, idx) => (
                              <div key={idx} className="flex justify-between items-center border-t border-zinc-900 pt-2 text-zinc-400 py-0.5">
                                <span className="font-semibold text-xs text-zinc-300">
                                  👥 {m.name}
                                  {m.role && (
                                    <span className="text-[9px] text-zinc-500 font-bold lowercase ml-1">
                                      ({m.role === 'emprendedor' ? 'emprendedor' : m.role === 'empleado' ? 'empleado' : 'estudiante'})
                                    </span>
                                  )}
                                </span>
                                <span className="text-[7.5px] text-emerald-400 bg-emerald-950/25 border border-emerald-500/15 px-1 py-0.5 font-bold uppercase">UNIDO</span>
                              </div>
                            ))}

                            {manualGroupTotalCount < 3 && (
                              <div className="border-t border-zinc-900 border-dashed pt-2.5 space-y-1">
                                <span className="text-[8.5px] text-zinc-500 block uppercase font-bold text-center leading-normal">
                                  COMPARTÍ ESTE CÓDIGO CON TUS COMPAÑEROS DE MIGRACIÓN:
                                </span>
                                <div className="text-center bg-zinc-900 border border-zinc-850 text-purple-400 font-black text-sm tracking-widest py-1 animate-pulse font-mono uppercase rounded">
                                  {currentAlumno.subgroupCode}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Ready notification banner */}
                          {manualGroupTotalCount >= 3 && (
                            <div className="bg-emerald-950/20 border border-emerald-500/25 p-2 text-emerald-400 font-mono text-[9.5px] uppercase font-bold text-center animate-pulse">
                              🚀 GRUPO COMPLETO CON ÉXITO — ¡Esperando inicio de la Profesora!
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Waiting status indicator block footer */}
              <div className="mt-auto pt-4 text-center border-t border-zinc-900 space-y-1 bg-[#101010]/30 -mx-4 -mb-4 p-3.5">
                <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-widest block">ESTADO DE CONEXIÓN GLOBAL</span>
                <p className="text-[10px] text-zinc-350 font-bold flex items-center justify-center gap-1.5 uppercase tracking-wide">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping inline-block" />
                  Sincronizado — Esperando Profe...
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Frame Bottom indicator */}
      <div className="w-full bg-[#121212] h-6 shrink-0 flex items-center justify-center border-t border-[#222]">
        <div className="w-28 h-1 bg-zinc-700 rounded-full animate-pulse" />
      </div>
    </div>
  );
};
