import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Star, Users, Award, Heart, ShieldAlert, GraduationCap } from 'lucide-react';

export const InstructionGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="instruction-guide" className="bg-[#0A0A0A] border-2 border-[#222] rounded-none overflow-hidden shadow-[4px_4px_0px_0px_rgba(34,34,34,1)]">
      <button
        id="btn-toggle-guide"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex items-center justify-between text-zinc-100 hover:text-orange-400 bg-zinc-900/40 font-black text-sm uppercase tracking-wider transition cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-500" />
          📖 GUÍA RÁPIDA DE JUEGO: REGLAS Y PERSONAJES (CLICK PARA VER)
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-5 border-t border-[#222] space-y-6 text-xs text-zinc-300 leading-relaxed bg-[#0C0C0C]">
          {/* 1. Introduction */}
          <div className="space-y-1">
            <h3 className="font-black uppercase tracking-wide text-zinc-100 flex items-center gap-1.5">
              👥 1. ¿Qué es Capital Coop: Finanzas en Comunidad?
            </h3>
            <p className="font-sans">
              Están por arrancar una simulación financiera real. Acá no juegan solos: se salvan en equipo o quiebran juntos. Su mesa representa a una comunidad y tienen 12 meses (12 turnos) para hacerla prosperar.
            </p>
          </div>

          {/* 2. Roles */}
          <div className="space-y-2">
            <h3 className="font-black uppercase tracking-wide text-zinc-100 flex items-center gap-1.5 text-[11px]">
              👑 2. Los Roles Asignados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans pt-1">
              <div className="p-3 bg-zinc-950 rounded-none border-2 border-[#222] border-l-4 border-l-orange-500">
                <span className="font-black text-orange-500 block mb-1 uppercase text-[10px] tracking-wider">El Emprendedor</span>
                <p className="text-[11px] text-zinc-400">Mucho riesgo, ingresos variables que dependen de su equipamiento. Es el motor comercial de la mesa.</p>
              </div>
              <div className="p-3 bg-zinc-950 rounded-none border-2 border-[#222] border-l-4 border-l-blue-400">
                <span className="font-black text-blue-400 block mb-1 uppercase text-[10px] tracking-wider">El Empleado</span>
                <p className="text-[11px] text-zinc-400">Sueldo fijo y sumamente estable. Es el colchón y soporte de liquidez inicial de todo el grupo.</p>
              </div>
              <div className="p-3 bg-zinc-950 rounded-none border-2 border-[#222] border-l-4 border-l-fuchsia-400">
                <span className="font-black text-fuchsia-400 block mb-1 uppercase text-[10px] tracking-wider">El Estudiante</span>
                <p className="text-[11px] text-zinc-400">Arranca con fondos moderados pero con potencial de crecimiento del 100% si se capacita y rinde materias.</p>
              </div>
            </div>
          </div>

          {/* 3. Voting Consensus */}
          <div className="space-y-2">
            <h3 className="font-black uppercase tracking-wide text-zinc-100 flex items-center gap-1.5">
              🗳️ 3. Regla de Oro de Votación y Consenso
            </h3>
            <p className="font-sans">
              Cada mes se publica un Dilema en la pantalla principal. Tienen 90 segundos para dialogar en el banco y presionar su voto (A, B o C) en el celular de Capital Pay:
            </p>
            <ul className="list-none space-y-2 font-mono text-[11px] text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-orange-500">■</span>
                <div>
                  <strong className="text-orange-400 uppercase tracking-tight">Mayoría Absoluta:</strong> Si dos o más jugadores seleccionan lo mismo, gana esa opción.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">■</span>
                <div>
                  <strong className="text-amber-400 uppercase tracking-tight">Desacuerdo total (Empate 1-1-1):</strong> Desempata automáticamente el voto del <strong>Administrador del Turno</strong> (miembro que va rotando mensualmente).
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">■</span>
                <div>
                  <strong className="text-rose-400 uppercase tracking-tight">Inactividad o Silencio:</strong> Si el administrador no votó o expira el tiempo, la app aplica la opción <strong>&ldquo;C&rdquo;</strong> (penalización severa por defecto).
                </div>
              </li>
            </ul>
          </div>

          {/* 4. statistics explanation */}
          <div className="space-y-2">
            <h3 className="font-black uppercase tracking-wide text-zinc-100 flex items-center gap-1.5">
              📈 4. Cuiden las barras de Salud y Educación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5 p-3 bg-zinc-950 rounded-none border-2 border-[#222]">
                <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="font-sans">
                  <strong className="text-zinc-100 block font-bold uppercase tracking-wide text-[11px] mb-1">Salud y Bienestar (%)</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">Si no gastan en descanso u ocio, la barra disminuye. Si cae por debajo del <strong>30%</strong>, el personaje se enferma, debiendo pagar más por su tratamiento y restando 40% de ingresos laborales el mes próximo.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 bg-zinc-950 rounded-none border-2 border-[#222]">
                <GraduationCap className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
                <div className="font-sans">
                  <strong className="text-zinc-100 block font-bold uppercase tracking-wide text-[11px] mb-1">Capacitación (Pts)</strong>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">Estudiar cuesta plata hoy, pero blinda al estudiante y al grupo contra estafas digitales (Phishing del banco), reduce multas impositivas del Monotributo y sube el sueldo permanentemente.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Gp Winner constraint */}
          <div className="space-y-2 p-3.5 bg-orange-500/5 border-2 border-orange-500/30 rounded-none">
            <h3 className="font-black text-orange-500 uppercase tracking-wider flex items-center gap-1.5">
              🏆 ¿Cómo se decide la Victoria final?
            </h3>
            <p className="text-zinc-300 font-sans">
              Al final del décimo segundo turno, se analiza la gestión del curso. No gana la mesa que más pesos guardó abajo del colchón de forma egoísta, sino el grupo de debate que consolidó un <strong className="text-orange-300 font-black">equilibrio perfecto</strong> entre:
            </p>
            <div className="flex justify-around pt-2 text-center text-xs font-mono font-bold text-zinc-200">
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-orange-400" /> Capital Común</span>
              <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-400" /> Salud</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4 text-amber-400" /> Estrategia</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
