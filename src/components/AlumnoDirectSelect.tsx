import React, { useState } from 'react';
import { PlayerId } from '../types';
import { AlumnoLobbyState } from './RoomAccessModule';
import { ArrowRight, ShieldAlert, Shuffle, Layers, Users, PlusCircle, Link } from 'lucide-react';

interface AlumnoDirectSelectProps {
  roomCode: string;
  pairingMode: 'aleatorio' | 'manual';
  joinedAlumnos: Record<PlayerId, AlumnoLobbyState>;
  onStudentJoin: (id: PlayerId, name: string) => void;
  onSelectRole: (role: PlayerId) => void;
  onStudentCreateGroup: (id: PlayerId, subgroupCode: string, role?: 'emprendedor' | 'empleado' | 'estudiante') => void;
  onStudentJoinGroup: (id: PlayerId, subgroupCode: string, role?: 'emprendedor' | 'empleado' | 'estudiante') => void;
}

export const AlumnoDirectSelect: React.FC<AlumnoDirectSelectProps> = ({
  roomCode,
  pairingMode,
  joinedAlumnos,
  onStudentJoin,
  onSelectRole,
  onStudentCreateGroup,
  onStudentJoinGroup,
}) => {
  const [name, setName] = useState('');
  const [subgroupInput, setSubgroupInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // General Slot helper
  const getNextFreeSlot = (): PlayerId | null => {
    return (Object.keys(joinedAlumnos) as PlayerId[]).find(
      (slotId) => !joinedAlumnos[slotId]?.joined
    ) || null;
  };

  // MODO ALEATORIO (Modo A)
  const handleConnectAleatorio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('⚠️ Escribí tu Nombre y Apellido para registrarte.');
      return;
    }

    const nextSlot = getNextFreeSlot();
    if (!nextSlot) {
      setErrorMsg('⚠️ Mesa Completa: Esta mesa virtual ya cuenta con sus 3 alumnos activos en el proyector.');
      return;
    }

    setErrorMsg(null);
    onStudentJoin(nextSlot, name.trim());
    onSelectRole(nextSlot);
  };

  // MODO MANUAL (Modo B) - Crear Grupo
  const handleCrearGrupoManual = () => {
    if (!name.trim()) {
      setErrorMsg('⚠️ Por favor ingresá tu Nombre y Apellido para poder crear un grupo.');
      return;
    }

    const nextSlot = getNextFreeSlot();
    if (!nextSlot) {
      setErrorMsg('⚠️ No hay lugares disponibles en esta mesa del proyector.');
      return;
    }

    // Generate random code (e.g., FX-32)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const firstChar = chars[Math.floor(Math.random() * chars.length)];
    const secondChar = chars[Math.floor(Math.random() * chars.length)];
    const num = Math.floor(10 + Math.random() * 90);
    const randomCode = `${firstChar}${secondChar}-${num}`;

    // Select random role from all possible roles
    const roles: Array<'emprendedor' | 'empleado' | 'estudiante'> = ['emprendedor', 'empleado', 'estudiante'];
    const assignedRole = roles[Math.floor(Math.random() * roles.length)];

    setErrorMsg(null);
    // Join student and update subgroup details
    onStudentJoin(nextSlot, name.trim());
    onStudentCreateGroup(nextSlot, randomCode, assignedRole);
    onSelectRole(nextSlot);
  };

  // MODO MANUAL (Modo B) - Unirse a Grupo
  const handleUnirseGrupoManual = () => {
    if (!name.trim()) {
      setErrorMsg('⚠️ Por favor ingresá tu Nombre y Apellido antes de unirte.');
      return;
    }

    const enteredCode = subgroupInput.toUpperCase().trim();
    if (!enteredCode) {
      setErrorMsg('⚠️ Introducí el Código de Mesa que te pasó tu compañero.');
      return;
    }

    // Find active slots in this subgroup
    const activeSubgroupAlumnos = (Object.values(joinedAlumnos) as AlumnoLobbyState[]).filter(
      (a) => a.subgroupCode?.toUpperCase() === enteredCode && a.joined
    );

    if (activeSubgroupAlumnos.length === 0) {
      setErrorMsg(`⚠️ Código "${enteredCode}" incorrecto. Pedile a tu compañero que toque "Crear Grupo" en su celular primero.`);
      return;
    }

    if (activeSubgroupAlumnos.length >= 3) {
      setErrorMsg('⚠️ Este grupo de mesa ya se encuentra lleno con 3 alumnos connected.');
      return;
    }

    const nextSlot = getNextFreeSlot();
    if (!nextSlot) {
      setErrorMsg('⚠️ No hay lugares libres en esta mesa.');
      return;
    }

    // Extract already taken roles
    const occupiedRoles = activeSubgroupAlumnos.map((a) => a.role).filter(Boolean);
    const allRoles: Array<'emprendedor' | 'empleado' | 'estudiante'> = ['emprendedor', 'empleado', 'estudiante'];
    const availableRoles = allRoles.filter((r) => !occupiedRoles.includes(r));

    if (availableRoles.length === 0) {
      setErrorMsg('⚠️ Todos los roles comerciales se encuentran ocupados.');
      return;
    }

    // Assign remaining roles automatically and equitably
    const assignedRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];

    setErrorMsg(null);
    onStudentJoin(nextSlot, name.trim());
    onStudentJoinGroup(nextSlot, enteredCode, assignedRole);
    onSelectRole(nextSlot);
  };

  // Count joined players in lobby
  const activeCount = (Object.values(joinedAlumnos) as AlumnoLobbyState[]).filter((a) => a.joined).length;

  return (
    <div className="w-full max-w-[340px] bg-[#0A0A0A] border-4 border-[#222] rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(242,120,34,0.15)] relative mx-auto flex flex-col h-[580px]">
      {/* Phone Notch */}
      <div className="w-full bg-[#0F0F0F] h-6 relative shrink-0 flex items-center justify-between px-6 border-b border-[#222]">
        <span className="text-[10px] text-zinc-500 font-mono font-bold">12:30 PM</span>
        <div className="w-24 h-4 bg-zinc-950 rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0 border-b border-zinc-850" />
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <div className="w-3.5 h-2 bg-zinc-700 rounded-xs" />
        </div>
      </div>

      {/* Internal Header */}
      <div className="bg-[#121212] border-b border-[#222] py-3.5 px-5 flex items-center justify-between shrink-0">
        <div>
          <span className="text-xs font-black text-zinc-100 tracking-wider flex items-center gap-1.5 uppercase font-mono">
            📲 CLASE CONECTADA
          </span>
          <p className="text-[9px] text-zinc-550 font-mono tracking-wider font-extrabold uppercase">SALA DE JUEGO: {roomCode}</p>
        </div>
        <span className="text-[8px] font-black font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 uppercase tracking-wide animate-pulse">
          ONLINE
        </span>
      </div>

      {/* Main Container */}
      <div className="p-5 flex-1 overflow-y-auto bg-[#0A0A0A] flex flex-col justify-between">
        <div className="space-y-4">
          
          {/* Logo visual header */}
          <div className="text-center space-y-1 pb-1">
            <div className="w-10 h-10 bg-orange-500 rounded-none border-2 border-black flex items-center justify-center font-black text-black text-lg mx-auto shadow-[2px_2px_0px_0px_rgba(245,158,11,0.2)]">
              CC
            </div>
            <h3 className="text-xs font-black text-zinc-150 uppercase tracking-widest font-mono">CAPITAL COOP</h3>
            <p className="text-[9px] text-zinc-500 font-medium">Finanzas en Comunidad • Vista de Alumno</p>
          </div>

          {/* Core Info Alert Mode badge */}
          {pairingMode === 'aleatorio' ? (
            <div className="p-2.5 border border-purple-500/25 bg-purple-500/5 text-[9.5px] text-purple-400 rounded-xl flex gap-2 items-start leading-normal">
              <Shuffle className="w-4 h-4 shrink-0 stroke-[2.5px] mt-0.5 text-purple-450" />
              <div>
                <span className="font-bold uppercase block tracking-wider text-[10px]">Sorteo Integrado (Modo A)</span>
                Introduce tu nombre y conéctate. Al iniciar, el sistema sorteará los roles automáticamente en tu pantalla.
              </div>
            </div>
          ) : (
            <div className="p-2.5 border border-amber-500/25 bg-amber-500/5 text-[9.5px] text-amber-400 rounded-xl flex gap-2 items-start leading-normal">
              <Layers className="w-4 h-4 shrink-0 stroke-[2.5px] mt-0.5 text-amber-550" />
              <div>
                <span className="font-bold uppercase block tracking-wider text-[10px]">Grupo en el Banco (Modo B)</span>
                Armá tu equipo con tus compañeros de clase. Uno crea la mesa y los otros se acoplan con el código secreto.
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-2 border border-red-500/25 bg-red-500/10 text-red-200 text-[10px] font-bold text-center flex items-center justify-center gap-1.5 animate-pulse rounded-lg font-mono">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-400" />
              {errorMsg}
            </div>
          )}

          {/* Universal Name Input (Required for both) */}
          <div className="space-y-1.5">
            <label className="text-[9px] text-zinc-400 font-mono font-black uppercase tracking-wider block">
              👤 Tu Nombre y Apellido:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value.substring(0, 20));
                setErrorMsg(null);
              }}
              placeholder="Ej: Manuel Belgrano"
              className="w-full bg-[#111] border border-zinc-800 focus:border-orange-500 hover:border-zinc-700 text-zinc-100 placeholder-zinc-700 py-2.5 px-3 uppercase font-bold text-xs outline-none transition-all rounded-lg"
              maxLength={20}
              required
            />
          </div>

          {/* Action panels depending on pairingMode */}
          {pairingMode === 'aleatorio' ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConnectAleatorio}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-[10.5px] tracking-widest py-3 px-4 flex items-center justify-center gap-1.5 transition-all shadow-[0px_4px_12px_rgba(245,158,11,0.25)] hover:shadow-[0px_6px_16px_rgba(245,158,11,0.35)] cursor-pointer rounded-xl border-b-4 border-orange-700 active:translate-y-[2px]"
              >
                CONECTARSE SEGURO
                <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
              </button>
            </div>
          ) : (
            /* Modo manual split control panels */
            <div className="space-y-3 pt-2">
              <div className="p-3 border border-zinc-900 bg-zinc-950 rounded-xl space-y-2">
                <div className="text-[8.5px] font-mono font-black tracking-widest text-zinc-550 uppercase">OPCIÓN A: SI SOS EL PRIMERO DEL BANCO</div>
                <button
                  type="button"
                  onClick={handleCrearGrupoManual}
                  className="w-full bg-purple-650 hover:bg-purple-600 border-b-4 border-purple-850 text-white font-black text-[10px] uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 shrink-0 stroke-[2.5px]" />
                  CREAR GRUPO DE MESA
                </button>
              </div>

              <div className="p-3 border border-zinc-900 bg-zinc-950 rounded-xl space-y-2">
                <div className="text-[8.5px] font-mono font-black tracking-widest text-zinc-550 uppercase">OPCIÓN B: UNIRTE AL GRUPO CREADO</div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subgroupInput}
                    onChange={(e) => {
                      setSubgroupInput(e.target.value.toUpperCase().slice(0, 6));
                      setErrorMsg(null);
                    }}
                    placeholder="Ej: FX-32"
                    className="w-24 bg-black border border-zinc-850 text-zinc-100 placeholder-zinc-800 text-center font-mono py-1.5 px-2 font-bold text-xs rounded uppercase focus:border-purple-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleUnirseGrupoManual}
                    className="flex-1 bg-zinc-850 hover:bg-zinc-750 text-zinc-300 font-bold border border-zinc-750 text-[10px] uppercase py-1.5 tracking-wider rounded flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Link className="w-3 h-3 shrink-0 stroke-[2.5px]" />
                    UNIRME
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Info footer board indicator */}
        <div className="pt-4 mt-auto">
          <div className="bg-zinc-950 p-2 border border-zinc-900 rounded-lg flex items-center justify-between text-[9px] font-mono">
            <span className="text-zinc-650 uppercase">Alumnos en Mesa:</span>
            <span className="text-zinc-400 font-bold">
              {activeCount} / 3 Lobbistas
            </span>
          </div>
          
          <p className="text-[8px] text-zinc-700 text-center font-mono mt-3 uppercase leading-none">
            © CAPITAL COOP - FINANZAS COOPERATIVAS
          </p>
        </div>
      </div>
    </div>
  );
};
