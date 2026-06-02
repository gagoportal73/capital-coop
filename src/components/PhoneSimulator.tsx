import React, { useState } from 'react';
import { PlayerState, RoomState, GameCard, PlayerId } from '../types';
import { Wallet, Heart, GraduationCap, ShieldCheck, Crown, AlertTriangle } from 'lucide-react';

interface PhoneSimulatorProps {
  player: PlayerState;
  room: RoomState;
  activeCard: GameCard;
  onCastVote: (playerId: PlayerId, option: 'A' | 'B' | 'C') => void;
  onP2PTransfer: (senderId: PlayerId, recipientId: PlayerId, amount: number) => void;
  onFundContribution: (contributorId: PlayerId, amount: number) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  player,
  room,
  activeCard,
  onCastVote,
  onP2PTransfer,
  onFundContribution,
}) => {
  const currentVote = room.votes[player.id];
  const isAdministrator = room.current_administrator === player.id;

  const [transferTarget, setTransferTarget] = useState<PlayerId>(player.id === 'player_1' ? 'player_2' : 'player_1');
  const [transferAmount, setTransferAmount] = useState<number>(5000);

  // Visual palettes based on character role
  const getThemePalette = () => {
    switch (player.role) {
      case 'emprendedor':
        return {
          primary: 'border-orange-500/30',
          accent: 'bg-orange-500',
          text: 'text-orange-400',
          badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          avatarBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        };
      case 'empleado':
        return {
          primary: 'border-blue-500/30',
          accent: 'bg-blue-500',
          text: 'text-blue-400',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          avatarBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        };
      case 'estudiante':
        return {
          primary: 'border-fuchsia-500/30',
          accent: 'bg-fuchsia-500',
          text: 'text-fuchsia-400',
          badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
          avatarBg: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
        };
    }
  };

  const colors = getThemePalette();

  // Custom option descriptors based on the role to make votes highly immersive
  const getRoleCommentary = (optionId: 'A' | 'B' | 'C') => {
    if (activeCard.target !== 'group' && activeCard.target !== player.role) {
      return "Es un dilema de otro sector, pero tu voto cuenta igual en el fondo grupal.";
    }

    if (player.role === 'emprendedor') {
      if (optionId === 'A') return "Invertir al toque para no frenar la facturación física.";
      if (optionId === 'B') return "Comenzar a recortar; resignar rentabilidad de mediano plazo.";
      return "Acordar una estrategia mixta con aporte comunitario solidario.";
    } else if (player.role === 'empleado') {
      if (optionId === 'A') return "Firmar rápido para sostener gastos familiares estables.";
      if (optionId === 'B') return "Generar riesgo o asamblea por una mayor compensación.";
      return "Aportar ganancias al Fondo a cambio de blindaje cooperativo.";
    } else {
      if (optionId === 'A') return "Gastar de contado; priorizar herramientas u orgullo.";
      if (optionId === 'B') return "Ahorrar momentáneamente sacrificando eficiencia.";
      return "Pedir apoyo colectivo al pozo común para salir adelante.";
    }
  };

  return (
    <div
      id={`phone-frame-${player.id}`}
      className="w-full max-w-[340px] bg-[#0A0A0A] border-4 border-[#222] rounded-[32px] overflow-hidden shadow-[6px_6px_0px_0px_rgba(34,34,34,1)] relative mx-auto flex flex-col h-[560px]"
    >
      {/* Phone Notch/Header */}
      <div className="w-full bg-[#0F0F0F] h-6 relative shrink-0 flex items-center justify-between px-6 border-b border-[#222]">
        <span className="text-[10px] text-zinc-500 font-mono font-bold">12:30 PM</span>
        <div id={`notch-${player.id}`} className="w-24 h-4 bg-zinc-950 rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0 border-b border-zinc-800" />
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-zinc-700 rounded-full" />
          <div className="w-3.5 h-2 bg-zinc-700 rounded-xs" />
        </div>
      </div>

      {/* Internal Cell App Navbar */}
      <div className="bg-[#121212] border-b border-[#222] py-3 px-4 flex items-center justify-between shrink-0">
        <span className="text-xs font-black text-zinc-100 tracking-wider flex items-center gap-1.5 font-mono uppercase">
          <Wallet className="w-3.5 h-3.5 text-orange-500" /> Capital Pay
        </span>
        <div className="flex items-center gap-1.5">
          {isAdministrator && (
            <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-none font-bold uppercase animate-pulse">
              👑 Rey del Mes
            </span>
          )}
          <span className="text-[9px] bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 uppercase tracking-wide">
            {player.roleName}
          </span>
        </div>
      </div>

      {/* Phone Body Scrollable Content */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-[#0A0A0A]">
        {/* User Stats Card */}
        <div className={`bg-[#151515] border-2 border-zinc-850 p-3.5 rounded-none space-y-3 border-l-4 ${
          player.role === 'emprendedor' ? 'border-l-orange-500' : player.role === 'empleado' ? 'border-l-blue-500' : 'border-l-fuchsia-500'
        }`}>
          {/* Avatar and Info */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-none border-2 flex items-center justify-center font-black text-base ${colors.avatarBg}`}>
              {player.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-black text-zinc-100 uppercase tracking-tight">{player.name}</div>
              <div className="text-[11px] text-green-400 font-mono font-extrabold leading-tight">
                SALDO DISPO: ${player.balance.toLocaleString()} ARS
              </div>
            </div>
          </div>

          {/* Quick Base Finance Pills */}
          <div className="grid grid-cols-2 gap-2 bg-black border border-zinc-855 p-1.5 rounded-none text-[9.5px] font-mono whitespace-nowrap">
            <div className="text-green-400 font-bold">➕ INGRESO: ${player.baseIncome.toLocaleString()}</div>
            <div className="text-rose-400 font-bold">➖ GASTOS: ${player.baseExpense.toLocaleString()}</div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3.5 border-t border-zinc-900/60 pt-2.5 text-xs">
            {/* Wellness Bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Bienestar
                </span>
                <span className={`font-mono font-bold ${player.wellbeing < 30 ? 'text-rose-500 font-black animate-pulse' : 'text-rose-400'}`}>
                  {player.wellbeing}%
                </span>
              </div>
              <div className="w-full bg-zinc-900 border border-zinc-850 h-2.5 rounded-none overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${player.wellbeing < 30 ? 'bg-rose-600 animate-pulse' : 'bg-rose-500'}`}
                  style={{ width: `${player.wellbeing}%` }}
                />
              </div>
              {player.wellbeing < 30 && (
                <div className="text-[9px] text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 p-1.5 rounded-none mt-1 flex items-center gap-1 uppercase tracking-wider">
                  <AlertTriangle className="w-2.5 h-2.5 shrink-0" /> ¡Enfermo! Menos 40% ingresos laborales.
                </div>
              )}
            </div>

            {/* Capacitacion Rating */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" /> Capacitación
                </span>
                <span className="text-zinc-300 font-mono font-black">
                  {player.capacitacion} <span className="text-zinc-500 text-[10px]">/ 10</span>
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded-none border border-zinc-950 transition-colors ${
                      idx < player.capacitacion ? 'bg-fuchsia-500' : 'bg-zinc-900'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Status Badges */}
          {(player.hasCeluSeguro || player.hasBeca || player.loanDebt > 0) && (
            <div className="flex flex-wrap gap-1.5 border-t border-zinc-900/60 pt-2.5 text-[9px]">
              {player.hasCeluSeguro && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                  Celu Seguro
                </span>
              )}
              {player.hasBeca && (
                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                  Beca Activa
                </span>
              )}
              {player.loanDebt > 0 && (
                <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                  Deuda: ${player.loanDebt.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Interactive Voting Module */}
        {room.voting_status === 'open' ? (
          <div className="space-y-3">
            <div className="text-center bg-[#0F0F0F] py-1.5 rounded-none border-2 border-[#222]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">
                ¿QUÉ OPCIÓN VOTÁS PARA LA MESA?
              </span>
            </div>

            {/* Voting Option Buttons */}
            <div className="space-y-2.5">
              {['A', 'B', 'C'].map((id) => {
                const opt = id as 'A' | 'B' | 'C';
                const isSelected = currentVote === opt;
                const optionData = activeCard.options.find(o => o.id === opt);

                return (
                  <button
                    key={opt}
                    id={`btn-vote-${player.id}-${opt}`}
                    onClick={() => onCastVote(player.id, opt)}
                    className={`w-full text-left p-3 rounded-none border-2 text-xs transition-all flex flex-col gap-1.5 cursor-pointer select-none ${
                      isSelected
                        ? 'bg-orange-800/10 border-orange-500 text-orange-200 ring-2 ring-orange-500/10'
                        : 'bg-[#151515] hover:bg-[#1C1C1C] border-[#222] text-zinc-350'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-none font-black text-[11px] flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-orange-500 border-black text-black'
                            : 'bg-zinc-805 border-zinc-750 text-zinc-455'
                        }`}
                      >
                        {opt}
                      </span>
                      <span className="font-extrabold uppercase text-zinc-100">{optionData?.text || `Opción ${opt}`}</span>
                    </div>
                    <p className={`text-[10px] pl-7 italic leading-snug ${isSelected ? 'text-orange-400' : 'text-zinc-500'}`}>
                      {getRoleCommentary(opt)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#151515] border-2 border-[#222] p-6 rounded-none flex flex-col items-center justify-center text-center py-10 space-y-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-none bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-lg animate-pulse">
                🗳️
              </div>
            </div>
            <div>
              <div className="text-xs font-black text-zinc-200 uppercase tracking-widest">Votos Cerrados</div>
              <div className="text-[10px] text-zinc-550 mt-1 uppercase tracking-wider font-mono">Esperando resolución...</div>
            </div>
          </div>
        )}

        {/* Acciones Financieras Libres */}
        <div className="bg-[#0F0F0F] border-2 border-zinc-800 p-3 space-y-2.5 rounded-none border-t-4 border-t-yellow-500 mt-2">
          <div className="text-[10px] text-zinc-300 uppercase font-black tracking-widest text-center border-b border-zinc-900 pb-1.5 flex items-center justify-center gap-1">
            💸 MANDO FINANCIERO COOP
          </div>
          
          <div className="space-y-1 text-[10px]">
            <label className="text-zinc-500 font-bold uppercase block text-[8.5px] tracking-wide">Destinatario P2P:</label>
            <select
              value={transferTarget}
              onChange={(e) => setTransferTarget(e.target.value as PlayerId)}
              className="w-full bg-[#151515] hover:bg-[#1A1A1A] border-2 border-zinc-800 text-zinc-200 outline-none p-1 text-xs rounded-none font-bold"
            >
              <option value="player_1" disabled={player.id === 'player_1'}>Socio: Mati (Emprendedor)</option>
              <option value="player_2" disabled={player.id === 'player_2'}>Socia: Sofi (Empleado)</option>
              <option value="player_3" disabled={player.id === 'player_3'}>Socio: Leo (Estudiante)</option>
            </select>
          </div>

          <div className="space-y-1 text-[10px]">
            <label className="text-zinc-500 font-bold uppercase block text-[8.5px] tracking-wide">Monto a Transferir/Aportar:</label>
            <div className="grid grid-cols-3 gap-1">
              {[5000, 10000, 25000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTransferAmount(amt)}
                  className={`py-1 text-[10.5px] border-2 font-mono transition-all font-black cursor-pointer ${
                    transferAmount === amt
                      ? 'bg-amber-500 border-black text-black'
                      : 'bg-[#151515] hover:bg-[#1C1C1C] text-zinc-400 border-zinc-800'
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onP2PTransfer(player.id, transferTarget, transferAmount)}
              className="bg-orange-500 hover:bg-orange-400 text-black py-1.5 px-2 font-black text-[9px] uppercase tracking-wider transition-all border-2 border-black cursor-pointer text-center"
            >
              Transferir P2P
            </button>
            <button
              type="button"
              onClick={() => onFundContribution(player.id, transferAmount)}
              className="bg-green-600 hover:bg-green-500 text-black py-1.5 px-2 font-black text-[9px] uppercase tracking-wider transition-all border-2 border-black cursor-pointer text-center"
            >
              Aportar Fondo
            </button>
          </div>
        </div>
      </div>

      {/* Frame Bottom bar */}
      <div className="w-full bg-[#121212] h-6 shrink-0 flex items-center justify-center border-t border-[#222]">
        <div id={`phone-home-indicator-${player.id}`} className="w-28 h-1 bg-zinc-700 rounded-full" />
      </div>
    </div>
  );
};
