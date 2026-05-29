import React from 'react';
import { PlayerState, RoomState, GameLogEntry } from '../types';
import { Award, RefreshCcw, Landmark, Heart, GraduationCap, Trophy, BookmarkCheck, BookOpen } from 'lucide-react';

interface GrandFinaleProps {
  room: RoomState;
  players: Record<string, PlayerState>;
  logs: GameLogEntry[];
  onRestartGame: () => void;
}

export const GrandFinale: React.FC<GrandFinaleProps> = ({
  room,
  players,
  logs,
  onRestartGame,
}) => {
  // Calculations
  const emp = players.player_1;
  const emp_l = players.player_2;
  const est = players.player_3;

  const totalIndividualCash = emp.balance + emp_l.balance + est.balance;
  const totalAssets = totalIndividualCash + room.collective_fund;

  const avgWellness = Math.round((emp.wellbeing + emp_l.wellbeing + est.wellbeing) / 3);
  const totalCapacitacion = emp.capacitacion + emp_l.capacitacion + est.capacitacion;

  // Evaluation algorithm
  // Needs balance of cash, wellness and education
  let rating = "B";
  let title = "Cooperativa Estable pero Austera";
  let evaluationDescription = "";

  if (room.collective_fund < 0 || totalIndividualCash < 0) {
    rating = "D";
    title = "Quiebra Financiera comunitaria";
    evaluationDescription = "Se quedaron con cuentas o el Fondo Común en negativo. El individualismo o la falta de previsión drenó las finanzas comunes, dejándolos vulnerables a embargos.";
  } else if (avgWellness < 40) {
    rating = "C";
    title = "Cooperativa Desequilibrada (Desgaste Social)";
    evaluationDescription = "Se enfocaron en ahorrar y descuidaron por completo la salud y el bienestar. El cansancio y las enfermedades de los integrantes impiden construir un futuro sostenible.";
  } else if (totalCapacitacion < 6) {
    rating = "C+";
    title = "Comunidad vulnerable a Ciberestafas";
    evaluationDescription = "Tienen liquidez pero descuidaron totalmente la educación / capacitación. Su escasez formativa los deja débiles ante multas impositivas recurrentes y estafas virtuales.";
  } else if (totalAssets > 280000 && avgWellness >= 75 && totalCapacitacion >= 12) {
    rating = "A+";
    title = "Resiliencia Cooperativa Legendaria 🏆";
    evaluationDescription = "¡Increíble gestión ejemplar! Lograron acumular un excelente remanente individual y colectivo, mantuvieron la moral al máximo y educaron con honores a su comunidad. ¡Son el orgullo de la economía circular!";
  } else if (totalAssets > 200000 && avgWellness >= 60 && totalCapacitacion >= 8) {
    rating = "A";
    title = "Sociedad Solidaria y Próspera";
    evaluationDescription = "¡Gran trabajo en equipo! Encontraron un equilibrio excepcional entre el Fondo Común, la capacitación profesional permanente y el cuidado físico. Se salvaron en conjunto de forma óptima.";
  } else {
    rating = "B";
    title = "Cooperativa Estable pero Elemental";
    evaluationDescription = "Lograron terminar el año en verde, pero podrían haber cooperado más profundamente. Invertir en educación grupal o amortiguar compras mayoristas les habría reportado mayores márgenes de ganancia.";
  }

  // Generate simulated rankings of other student groups in the classroom
  const getSimulatedRankings = () => {
    // Score based on cash, wellness, cards solved
    const ourScore = Math.round(totalAssets * 0.5 + room.points_score * 3 + avgWellness * 10 + totalCapacitacion * 50);

    const baseList = [
      { id: "GRP_02", name: "Mesa 3 - Los Leones Solidarios", score: 215000 },
      { id: "GRP_03", name: "Mesa 1 - Los Magnates Financieros", score: 180000 },
      { id: "GRP_04", name: "Mesa 4 - Los Halcones del Libre Mercado", score: 145000 },
      { id: "GRP_05", name: "Mesa 5 - Ahorradores Extremos (Burnout)", score: 120000 },
    ];

    // Add ours
    const fullList = [...baseList, { id: room.group_id, name: "Ustedes - Capital Coop GRP_01", score: ourScore }];
    // Sort
    fullList.sort((a, b) => b.score - a.score);

    return { rankList: fullList, ourRank: fullList.findIndex(x => x.id === room.group_id) + 1 };
  };

  const { rankList, ourRank } = getSimulatedRankings();

  return (
    <div id="grand-finale-screen" className="bg-[#0A0A0A] border-4 border-[#222] rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(34,34,34,1)] space-y-8 max-w-4xl mx-auto">
      {/* Upper header */}
      <div className="text-center space-y-2 border-b-2 border-[#222] pb-6">
        <div className="inline-flex p-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-none mb-2 animate-bounce">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500 uppercase leading-none">
          CAPITAL COOP: EVALUACIÓN ANUAL COMUNITARIA
        </h1>
        <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold font-mono max-w-xl mx-auto">
          La simulación de 12 meses finalizó con éxito. Análisis integral de la gestión de tesorería de la asamblea.
        </p>
      </div>

      {/* Main stats block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Collective Cash & Assets */}
        <div className="bg-[#0F0F0F] border-2 border-[#222] p-4 rounded-none space-y-1.5 text-center">
          <Landmark className="w-5 h-5 mx-auto text-orange-500" />
          <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest">Activos totales</div>
          <div className="text-xl font-black text-orange-500">${totalAssets.toLocaleString()}</div>
          <p className="text-[10px] text-zinc-400 font-mono leading-normal pt-1.5 border-t border-zinc-900">
            Fondo: ${room.collective_fund.toLocaleString()} <br /> Individual: ${totalIndividualCash.toLocaleString()}
          </p>
        </div>

        {/* average wellness */}
        <div className="bg-[#0F0F0F] border-2 border-[#222] p-4 rounded-none space-y-1.5 text-center">
          <Heart className="w-5 h-5 mx-auto text-rose-500" />
          <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest">Bienestar promedio</div>
          <div className="text-xl font-black text-rose-500">{avgWellness}%</div>
          <p className="text-[10px] text-zinc-400 font-mono leading-normal pt-1.5 border-t border-zinc-900">
            Índice de bienestar humano colectivo.
          </p>
        </div>

        {/* Education pts */}
        <div className="bg-[#0F0F0F] border-2 border-[#222] p-4 rounded-none space-y-1.5 text-center">
          <GraduationCap className="w-5 h-5 mx-auto text-fuchsia-500" />
          <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest">Capacitación Grupal</div>
          <div className="text-xl font-black text-fuchsia-400">{totalCapacitacion} pts</div>
          <p className="text-[10px] text-zinc-400 font-mono leading-normal pt-1.5 border-t border-zinc-900">
            Resiliencia contra ataques cibernéticos y estafas.
          </p>
        </div>

        {/* Points score */}
        <div className="bg-[#0F0F0F] border-2 border-[#222] p-4 rounded-none space-y-1.5 text-center">
          <Award className="w-5 h-5 mx-auto text-amber-500" />
          <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest">Ptos de Estrategia</div>
          <div className="text-xl font-black text-amber-550">{room.points_score}</div>
          <p className="text-[10px] text-zinc-400 font-mono leading-normal pt-1.5 border-t border-zinc-900">
            Gestión cooperativa y sinergia.
          </p>
        </div>
      </div>

      {/* Evaluation and placement rank */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Score Card Diploma */}
        <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border-2 border-[#222] p-5 rounded-none relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-10 h-10 bg-orange-500/10 text-orange-500 border-2 border-orange-500/30 font-black text-xl flex items-center justify-center rounded-none">
                {rating}
              </span>
              <div>
                <h3 className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Dictamen de la Cátedra</h3>
                <h2 className="text-lg font-black uppercase text-zinc-100 italic tracking-tight">{title}</h2>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              {evaluationDescription}
            </p>
          </div>
          <div className="bg-zinc-950 border border-[#222] p-3 rounded-none text-[11px] text-zinc-400 leading-relaxed font-mono">
            💡 <strong>Reflexión Crítica:</strong> En Capital Coop, el individualismo extremo conduce inexorablemente al colapso. Blindar el bienestar humano de la mesa y aprovisionar excedentes cooperativos es el único camino al desarrollo asambleario sustentable.
          </div>
        </div>

        {/* Right: Simulated Classroom Ranking */}
        <div className="bg-[#0D0D0D] border-2 border-[#222] p-5 rounded-none flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-zinc-300 uppercase tracking-widest block mb-4">
              🏆 RANKING DE LA ASAMBLEA GENERAL (AULAS CORRESPONDIENTES)
            </span>
            <div className="space-y-2">
              {rankList.map((team, idx) => {
                const isUs = team.id === room.group_id;
                return (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between p-3 rounded-none text-xs transition-colors ${
                      isUs
                        ? 'bg-orange-500/10 border-2 border-orange-500 text-orange-400 font-bold'
                        : 'bg-zinc-950 border border-[#222] text-zinc-450'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-black w-4 ${isUs ? 'text-orange-400' : 'text-zinc-600'}`}>
                        #{idx + 1}
                      </span>
                      <span className="uppercase tracking-wide font-extrabold">{team.name}</span>
                    </div>
                    <span className="font-mono">{team.score.toLocaleString()} PTS</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center text-[10px] text-zinc-500 pt-3 uppercase tracking-wider font-mono font-bold">
            ¡Ustedes ocuparon la posición #{ourRank} de 5 en la simulación escolar!
          </div>
        </div>
      </div>

      {/* History log block */}
      <div className="bg-[#0B0B0B] border-2 border-[#222] p-5 rounded-none space-y-3">
        <h3 className="text-xs font-black text-zinc-350 tracking-widest uppercase flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-orange-500 animate-pulse" /> REPASO DE DECISIONES DE LA COOPERATIVA (LEDGER HISTÓRICO)
        </h3>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs scrollbar-custom">
          {logs.map((log) => (
            <div
              key={log.month}
              className="p-3 bg-[#121212] border border-[#222] rounded-none space-y-1.5 hover:border-orange-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 uppercase tracking-tight flex items-center gap-1.5">
                  📅 Mes {log.month}: {log.cardTitle}
                </span>
                <span className="font-mono text-orange-400 font-black text-[10px] tracking-wider bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-none">Voto Ganador: {log.winningOption}</span>
              </div>
              <p className="text-zinc-300 italic font-mono text-[11px] bg-[#0A0A0A] p-2 leading-relaxed border-l border-zinc-800">&ldquo;{log.optionText}&rdquo;</p>
              <p className="text-zinc-400 text-[11px] leading-relaxed pt-1">{log.feedbackText}</p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-zinc-600 text-[11px] italic uppercase font-bold tracking-wider">No se cargaron transacciones este período.</p>
          )}
        </div>
      </div>

      {/* Reset button */}
      <button
        id="btn-restart-simulation"
        onClick={onRestartGame}
        className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-black py-4 px-5 rounded-none font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,88,12,0.2)]"
      >
        <RefreshCcw className="w-4 h-4" />
        REINICIAR LA COOPERATIVA / NUEVA SIMULACIÓN de COOP
      </button>
    </div>
  );
};
