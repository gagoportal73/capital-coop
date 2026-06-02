import React, { useState, useEffect } from 'react';
import { PlayerState, GameLogEntry } from '../types';
import { Award, Wallet, ArrowRight, ShieldAlert, Heart, Calendar } from 'lucide-react';

interface CierreMensualModalProps {
  currentMonth: number;
  playersBefore: Record<string, PlayerState>;
  playersAfter: Record<string, PlayerState>;
  logEntry: GameLogEntry | null;
  onClose: () => void;
  onAddChangaLiquidity: (playerId: string, amount: number) => void;
  adminId: string;
  adminName: string;
}

export const CierreMensualModal: React.FC<CierreMensualModalProps> = ({
  currentMonth,
  playersBefore,
  playersAfter,
  logEntry,
  onClose,
  onAddChangaLiquidity,
  adminId,
  adminName,
}) => {
  const getAvatarLetter = (role: string) => role.charAt(0).toUpperCase();

  const getSicknessStatus = (player: PlayerState) => {
    return player.isSick ? "Enfermo (Paga 40% más gastos)" : "Saludable";
  };

  // Multiple Changa Minigame Options
  const [changaGameType, setChangaGameType] = useState<'tapping' | 'frogs' | 'target'>('tapping');
  const [changaGameState, setChangaGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [changaTimeLeft, setChangaTimeLeft] = useState<number>(15);
  const [changaClicks, setChangaClicks] = useState<number>(0);
  const [changaEarned, setChangaEarned] = useState<number>(0);

  // Frogs minigame states
  const [frogPosition, setFrogPosition] = useState<number>(4); // index 0-8 in a 3x3 grid
  const [frogSplashed, setFrogSplashed] = useState<boolean>(false);

  // Moving target minigame states
  const [targetPos, setTargetPos] = useState<number>(0); // 0 to 100 horizontal percent position
  const [targetDir, setTargetDir] = useState<number>(1); // 1 = right, -1 = left
  const [targetFeedback, setTargetFeedback] = useState<string>('');

  // Main game timer
  useEffect(() => {
    let timer: any = null;
    if (changaGameState === 'playing' && changaTimeLeft > 0) {
      timer = setTimeout(() => {
        setChangaTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (changaGameState === 'playing' && changaTimeLeft === 0) {
      setChangaGameState('finished');
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [changaGameState, changaTimeLeft]);

  // Frogs Position Randomizer Loop
  useEffect(() => {
    let interval: any = null;
    if (changaGameState === 'playing' && changaGameType === 'frogs') {
      interval = setInterval(() => {
        setFrogPosition((prev) => {
          const next = Math.floor(Math.random() * 9);
          return next === prev ? (next + 1) % 9 : next;
        });
        setFrogSplashed(false);
      }, 800); // changes every 800ms
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [changaGameState, changaGameType]);

  // Moving Target Oscillation Loop
  useEffect(() => {
    let interval: any = null;
    if (changaGameState === 'playing' && changaGameType === 'target') {
      interval = setInterval(() => {
        setTargetPos((prev) => {
          const speed = 4;
          let next = prev + targetDir * speed;
          if (next >= 100) {
            next = 100;
            setTargetDir(-1);
          } else if (next <= 0) {
            next = 0;
            setTargetDir(1);
          }
          return next;
        });
      }, 25); // fast updates for smooth slider movement
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [changaGameState, changaGameType, targetDir]);

  const handleStartChanga = () => {
    setChangaTimeLeft(15);
    setChangaClicks(0);
    setChangaEarned(0);
    setFrogPosition(4);
    setFrogSplashed(false);
    setTargetPos(0);
    setTargetDir(1);
    setTargetFeedback('');
    setChangaGameState('playing');
  };

  const handleTapChanga = () => {
    if (changaGameState !== 'playing' || changaEarned >= 15000) return;
    const increment = 1000;
    setChangaClicks((prev) => prev + 1);
    setChangaEarned((prev) => {
      const nextEarned = Math.min(15000, prev + increment);
      const actualAdded = nextEarned - prev;
      if (actualAdded > 0) {
        onAddChangaLiquidity(adminId, actualAdded);
      }
      return nextEarned;
    });
  };

  const handleCatchFrog = (index: number) => {
    if (changaGameState !== 'playing' || changaEarned >= 15000 || index !== frogPosition || frogSplashed) return;

    setFrogSplashed(true);
    const increment = 1500; // frogs are specialized catches!
    setChangaClicks((prev) => prev + 1);
    
    setChangaEarned((prev) => {
      const nextEarned = Math.min(15000, prev + increment);
      const actualAdded = nextEarned - prev;
      if (actualAdded > 0) {
        onAddChangaLiquidity(adminId, actualAdded);
      }
      return nextEarned;
    });

    // instantly trigger new position with flash delay
    setTimeout(() => {
      setFrogPosition((prev) => {
        const next = Math.floor(Math.random() * 9);
        return next === prev ? (next + 1) % 9 : next;
      });
      setFrogSplashed(false);
    }, 150);
  };

  const handleShootTarget = () => {
    if (changaGameState !== 'playing' || changaEarned >= 15000) return;

    // Center is 50. Zone [43, 57] is Bullseye. Zone [28, 42] and [58, 72] is hit.
    const isBullseye = targetPos >= 42 && targetPos <= 58;
    const isNearHit = (targetPos >= 25 && targetPos < 42) || (targetPos > 58 && targetPos <= 75);

    let increment = 0;
    if (isBullseye) {
      increment = 3000; // Perfect snipe!
      setTargetFeedback('🎯 ¡BULLSEYE PERFECTO! (+$3.000 ARS)');
    } else if (isNearHit) {
      increment = 1000; // Partial target hit
      setTargetFeedback('💥 ¡IMPACTO BUENO! (+$1.000 ARS)');
    } else {
      setTargetFeedback('❌ ¡LE ERRASTE! Intentá otra vez');
    }

    setChangaClicks((prev) => prev + 1);

    if (increment > 0) {
      setChangaEarned((prev) => {
        const nextEarned = Math.min(15000, prev + increment);
        const actualAdded = nextEarned - prev;
        if (actualAdded > 0) {
          onAddChangaLiquidity(adminId, actualAdded);
        }
        return nextEarned;
      });
    }

    setTimeout(() => {
      setTargetFeedback((current) => (current.startsWith('❌') || current.includes(increment.toString()) ? '' : current));
    }, 900);
  };

  return (
    <div
      id="cierre-mensual-modal"
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto p-2 sm:p-4 flex justify-center items-start md:py-8"
    >
      <div className="bg-[#0A0A0A] border-4 border-[#222] rounded-none max-w-2xl w-full p-3 sm:p-6 shadow-[10px_10px_0px_0px_rgba(34,34,34,1)] space-y-4 sm:space-y-6 my-2 sm:my-8 text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#222] pb-3 sm:pb-4 gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-orange-600/10 text-orange-500 border border-orange-500/30 rounded-none">
              <Calendar className="w-5 h-5 sm:w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black text-zinc-100 uppercase tracking-tighter">RESUMEN MENSUAL</h1>
              <p className="text-[9px] sm:text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">CIERRE - MES {currentMonth} / 12</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] sm:text-[10px] bg-zinc-800 text-zinc-200 px-2 sm:px-3 py-1 font-black uppercase tracking-wider">
              CONCILIADO ✅
            </span>
          </div>
        </div>

        {/* Voting Outcome Card */}
        {logEntry && (
          <div className="bg-[#0D0D0D] border-2 border-[#222] p-2.5 sm:p-4 rounded-none space-y-1.5 sm:space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-[9px] sm:text-[10px] bg-orange-600 text-black px-1.5 sm:px-2 py-0.5 font-bold uppercase tracking-wide self-start">
                EFECTO DEL EVENTO
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-400 font-extrabold font-mono uppercase tracking-tight">
                VOTO: <strong className="text-orange-500 text-xs sm:text-sm font-black">{logEntry.winningOption}</strong>
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-zinc-200 uppercase tracking-tight leading-tight">{logEntry.cardTitle}</h3>
            <p className="text-[11px] sm:text-xs text-zinc-300 italic leading-snug bg-[#151515] p-2 border-l-2 border-orange-500">
              &ldquo;{logEntry.optionText}&rdquo;
            </p>
            <div className="text-[11px] sm:text-xs text-zinc-400 font-medium pt-1.5 border-t border-zinc-900/60 pb-0.5 flex items-start gap-1.5">
              <span className="text-orange-500 font-black shrink-0">➡</span>
              <p className="leading-normal sm:leading-relaxed font-sans">{logEntry.feedbackText}</p>
            </div>
            {/* Quick impacts ledger indicators */}
            <div className="flex gap-3 sm:gap-4 pt-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase">
              {logEntry.fundChange !== 0 && (
                <span className={logEntry.fundChange > 0 ? 'text-green-400' : 'text-rose-500'}>
                  Fondo Común: {logEntry.fundChange > 0 ? '+' : ''}${logEntry.fundChange.toLocaleString()}
                </span>
              )}
              {logEntry.pointsChange !== 0 && (
                <span className={logEntry.pointsChange > 0 ? 'text-amber-400' : 'text-rose-400'}>
                  Puntaje: {logEntry.pointsChange > 0 ? '+' : ''}{logEntry.pointsChange} pts
                </span>
              )}
            </div>
          </div>
        )}

        {/* Player Wallets Ledger */}
        <div className="space-y-2 sm:space-y-4">
          <h2 className="text-[10px] sm:text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-orange-500" /> LIQUIDACIÓN DE INGRESOS Y GASTOS DE LA COMUNIDAD
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
            {Object.keys(playersAfter).map((playerId) => {
              const pBefore = playersBefore[playerId];
              const pAfter = playersAfter[playerId];
              const diff = pAfter.balance - pBefore.balance;
              const isPositive = diff >= 0;

              return (
                <div
                  key={playerId}
                  id={`ledger-report-${playerId}`}
                  className="bg-[#0D0D0D] border-2 border-zinc-800 p-2 sm:p-3 rounded-none flex flex-col justify-between space-y-2 sm:space-y-3"
                >
                  {/* Player header */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-none border bg-zinc-950 font-black text-zinc-100 flex items-center justify-center text-[10px] sm:text-xs">
                      {getAvatarLetter(pAfter.role)}
                    </div>
                    <div>
                      <div className="text-[11px] sm:text-xs font-black text-zinc-150 uppercase tracking-tight leading-none">{pAfter.name}</div>
                      <span className="text-[8px] sm:text-[9px] text-zinc-550 uppercase tracking-wider font-semibold">{pAfter.roleName}</span>
                    </div>
                  </div>

                  {/* Finances list */}
                  <div className="space-y-1 text-[9px] sm:text-[10px] font-mono border-t border-zinc-900/60 pt-1.5 sm:pt-2.5">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase font-bold">Ingreso Base:</span>
                      <span className="text-green-400 font-extrabold">+${pAfter.baseIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase font-bold">Gasto Fijo:</span>
                      <span className="text-rose-500 font-extrabold">-${pAfter.baseExpense.toLocaleString()}</span>
                    </div>
                    {pAfter.isSick && (
                      <div className="flex justify-between text-rose-400 font-black text-[8px] sm:text-[9px] bg-rose-500/10 p-0.5 rounded-none leading-tight uppercase">
                        <span>Enfermedad:</span>
                        <span>-40% ingr</span>
                      </div>
                    )}
                    {pAfter.loanDebt > 0 && (
                      <div className="flex justify-between text-yellow-500 font-bold uppercase text-[8px] sm:text-[9px]">
                        <span>Amortización:</span>
                        <span>-$15.000</span>
                      </div>
                    )}
                  </div>

                  {/* Net Wallet Delta */}
                  <div className="border-t border-zinc-850 pt-1.5 sm:pt-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] sm:text-[9px] text-zinc-500 uppercase tracking-widest block font-bold leading-none">Ganancia</span>
                      <span className={`text-[11px] sm:text-xs font-mono font-black ${isPositive ? 'text-green-400' : 'text-rose-500'}`}>
                        {isPositive ? '+' : ''}${diff.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] sm:text-[9px] text-zinc-500 block uppercase tracking-widest font-bold leading-none">Saldo</span>
                      <span className="text-[11px] sm:text-xs font-black text-zinc-100 font-mono">
                        ${pAfter.balance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minijuego de Changas Rápidas (QTE/Tapping) */}
        <div className="bg-zinc-900/60 border-2 border-[#222] p-3 sm:p-4 rounded-none border-t-4 border-t-amber-500 space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 animate-pulse">
              ⚡ MINI-CHANGAS DEL INTEGRANTE
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] font-extrabold bg-amber-500/10 text-amber-400 px-1.5 py-0.5 border border-amber-500/20 self-start sm:self-auto uppercase">
              TIEMPO: {changaTimeLeft}s
            </span>
          </div>
          
          <p className="text-[11px] sm:text-xs text-zinc-350 leading-normal sm:leading-relaxed">
            Como Administrador activo de este mes, <strong className="text-zinc-100 uppercase">{adminName}</strong> dispone de una oportunidad de changas rápidas para sumar liquidez personal (hasta un máximo de <strong>+$15.000 ARS</strong>).
          </p>

          {/* Minigame Type Selector (Only active when IDLE) */}
          {changaGameState === 'idle' && (
            <div className="bg-[#0D0D0D] p-2 border border-zinc-800 space-y-1.5">
              <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-widest block">SELECCIONÁ EL TRABAJO / CHANGA:</span>
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setChangaGameType('tapping')}
                  className={`px-1 py-1.5 font-black text-[9px] sm:text-[10.5px] uppercase tracking-wide border transition-all text-center ${
                    changaGameType === 'tapping'
                      ? 'bg-amber-500 text-black border-amber-500 font-extrabold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  ⚡ TAPPING
                </button>
                <button
                  type="button"
                  onClick={() => setChangaGameType('frogs')}
                  className={`px-1 py-1.5 font-black text-[9px] sm:text-[10.5px] uppercase tracking-wide border transition-all text-center ${
                    changaGameType === 'frogs'
                      ? 'bg-amber-500 text-black border-amber-500 font-extrabold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  🐸 RANITAS
                </button>
                <button
                  type="button"
                  onClick={() => setChangaGameType('target')}
                  className={`px-1 py-1.5 font-black text-[9px] sm:text-[10.5px] uppercase tracking-wide border transition-all text-center ${
                    changaGameType === 'target'
                      ? 'bg-amber-500 text-black border-amber-500 font-extrabold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  🎯 BLANCO
                </button>
              </div>
            </div>
          )}

          {/* GAME STATE: IDLE */}
          {changaGameState === 'idle' && (
            <div className="bg-[#0A0A0A] p-3 sm:p-4 border border-zinc-800 text-center space-y-2 sm:space-y-3 flex flex-col items-center">
              {changaGameType === 'tapping' && (
                <>
                  <span className="text-2xl sm:text-3xl animate-bounce">⚡</span>
                  <div className="space-y-1">
                    <h4 className="text-[11px] sm:text-xs font-black text-amber-500 uppercase tracking-wider font-mono">Modo: Tapping Clásico</h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 max-w-sm font-sans leading-tight sm:leading-relaxed mx-auto text-center">
                      Hacé click o tap repetidamente. Cada toque te otorga <strong className="text-green-400">+$1.000 ARS</strong>.
                    </p>
                  </div>
                </>
              )}
              {changaGameType === 'frogs' && (
                <>
                  <span className="text-2xl sm:text-3xl animate-bounce">🐸</span>
                  <div className="space-y-1">
                    <h4 className="text-[11px] sm:text-xs font-black text-amber-500 uppercase tracking-wider font-mono">Modo: Atrapar Ranitas</h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 max-w-sm font-sans leading-tight sm:leading-relaxed mx-auto text-center">
                      Las ranitas aparecen en grilla 3x3. ¡Clickealas rápido para ganar <strong className="text-green-400">+$1.500 ARS</strong> por captura!
                    </p>
                  </div>
                </>
              )}
              {changaGameType === 'target' && (
                <>
                  <span className="text-2xl sm:text-3xl animate-bounce">🎯</span>
                  <div className="space-y-1">
                    <h4 className="text-[11px] sm:text-xs font-black text-amber-500 uppercase tracking-wider font-mono">Modo: Blanco Móvil</h4>
                    <p className="text-[10px] sm:text-[11px] text-zinc-400 max-w-sm font-sans leading-tight sm:leading-relaxed mx-auto text-center">
                      Dispará al centro a alta velocidad para dar en el blanco y ganar <strong className="text-green-400">+$3.000 ARS</strong>.
                    </p>
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={handleStartChanga}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-black uppercase text-[10px] sm:text-xs tracking-wider transition-all rounded-none border-2 border-black cursor-pointer shadow-[3px_3px_0px_0px_rgba(245,158,11,0.2)]"
              >
                ▶️ ¡INICIAR MINI-CHANGA!
              </button>
            </div>
          )}

          {/* GAME STATE: PLAYING */}
          {changaGameState === 'playing' && (
            <div className="bg-[#0A0A0A] p-2.5 sm:p-4 border border-zinc-805 space-y-3 sm:space-y-4">
              {/* Common Stats Panel */}
              <div className="flex justify-between items-center bg-[#0D0D0D] p-2 sm:p-2.5 border border-zinc-900 text-[11px] sm:text-xs font-mono">
                <div>
                  <span className="text-zinc-500 uppercase font-bold block text-[8px] sm:text-[9px] leading-none mb-0.5">Ingresos del Turno</span>
                  <span className="text-sm sm:text-base font-black text-emerald-400 animate-pulse">
                    +${changaEarned.toLocaleString()} ARS
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 uppercase font-bold block text-[8px] sm:text-[9px] leading-none mb-0.5">Interacciones</span>
                  <span className="text-xs sm:text-sm font-black text-zinc-200">
                    {changaClicks} {changaGameType === 'tapping' ? 'Taps' : changaGameType === 'frogs' ? 'Ranitas' : 'Tiros'}
                  </span>
                </div>
              </div>

              {/* RENDER CURRENT MINIGAME STYLE */}
              
              {/* 1. TAPPING GAME */}
              {changaGameType === 'tapping' && (
                <div className="flex flex-col items-center py-2 sm:py-4 space-y-2 sm:space-y-3">
                  <button
                    id="changa-tapping-button"
                    type="button"
                    disabled={changaEarned >= 15000}
                    onClick={handleTapChanga}
                    className={`w-full max-w-xs py-4 sm:py-5 px-4 sm:px-6 font-black uppercase text-xs sm:text-sm tracking-wider transition-all rounded-none border-2 border-black select-none ${
                       changaEarned < 15000
                        ? 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-black cursor-pointer shadow-[3px_3px_0px_0px_rgba(245,158,11,0.4)]'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-zinc-900'
                    }`}
                  >
                    {changaEarned >= 15000 ? '⭐ ¡MÁXIMO ALCANZADO! ⭐' : '⚡ ¡TAPEÁ ACÁ RÁPIDO! ⚡'}
                  </button>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 font-mono uppercase">¡TAPEÁ SIN PARAR PARA SUMAR!</p>
                </div>
              )}

              {/* 2. FROGS GRID GAME */}
              {changaGameType === 'frogs' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1.5 max-w-[180px] sm:max-w-xs mx-auto">
                    {Array.from({ length: 9 }).map((_, index) => {
                      const hasFrog = frogPosition === index;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleCatchFrog(index)}
                          className={`aspect-square border flex items-center justify-center text-xl sm:text-2xl transition-all select-none rounded-none cursor-pointer ${
                            hasFrog
                              ? frogSplashed
                                ? 'bg-green-600/30 border-green-500 scale-90 text-lg'
                                : 'bg-green-500 border-green-400 scale-105 shadow-[0_0_8px_rgba(34,197,94,0.4)] font-black text-2xl sm:text-3xl'
                              : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-900'
                          }`}
                        >
                          {hasFrog ? (frogSplashed ? '💥' : '🐸') : ''}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 font-mono uppercase text-center">¡Hacé click en la Ranita (🐸)!</p>
                </div>
              )}

              {/* 3. TARGET SHOOTER GAME */}
              {changaGameType === 'target' && (
                <div className="space-y-2 sm:space-y-4 py-1">
                  {/* Feedback messaging popup */}
                  <div className="h-5 flex items-center justify-center text-[10px] sm:text-xs font-mono font-black text-center">
                    <span className={targetFeedback.includes('BULLSEYE') ? 'text-green-400 scale-110' : targetFeedback.includes('IMPACTO') ? 'text-yellow-400' : 'text-zinc-500'}>
                      {targetFeedback || '🎯 ¡PREPARÁ EL DISPARO!'}
                    </span>
                  </div>

                  {/* Slider runway */}
                  <div className="w-full h-6 sm:h-8 bg-zinc-950 border-2 border-[#222] relative flex items-center overflow-hidden">
                    {/* Zones indicators backdrop */}
                    <div className="absolute inset-y-0 bg-yellow-500/10 border-x border-yellow-500/10 animate-pulse" style={{ left: '25%', right: '25%' }} />
                    <div className="absolute inset-y-0 bg-green-500/30 border-x-2 border-green-500/40" style={{ left: '42%', right: '42%' }} />
                    
                    {/* Perfect Bullseye pin text */}
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[8px] sm:text-[9px] font-black text-green-400 tracking-widest uppercase bg-zinc-950/85 px-1 border border-green-500/30 font-mono">
                      BULLSEYE
                    </span>

                    {/* Indicator Slider Needle */}
                    <div
                      className="absolute top-0 bottom-0 w-1.5 sm:w-2 bg-red-500 border-x border-white shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10"
                      style={{ left: `${targetPos}%` }}
                    />
                  </div>

                  {/* Shoot trigger button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleShootTarget}
                      disabled={changaEarned >= 15000}
                      className="w-full max-w-xs py-3 bg-orange-600 hover:bg-orange-500 active:scale-95 text-black font-black uppercase text-[10px] sm:text-xs tracking-wider transition-all rounded-none border-2 border-black cursor-pointer shadow-[3px_3px_0px_0px_rgba(234,88,12,0.2)]"
                    >
                      💥 ¡FUEGO! (DISPARAR) 💥
                    </button>
                    <p className="text-[9px] sm:text-[10px] text-zinc-550 font-mono uppercase mt-1.5 text-center">
                      Dispará cuando pase por el cuadrante verde central.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GAME STATE: FINISHED */}
          {changaGameState === 'finished' && (
            <div className="bg-[#0A0A0A] p-3 sm:p-4 border border-zinc-800 text-center space-y-2 sm:space-y-3 flex flex-col items-center">
              <span className="text-2xl sm:text-3xl animate-pulse">🎉</span>
              <div className="space-y-0.5">
                <h4 className="text-[11px] sm:text-xs font-black text-green-400 uppercase tracking-wider font-mono">¡TIEMPO EXPIRADO!</h4>
                <p className="text-xs sm:text-sm text-zinc-100 font-bold font-mono">
                  ¡Sumaste <span className="text-emerald-400 font-extrabold">+${changaEarned.toLocaleString()} ARS</span> a tu billetera!
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleStartChanga}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-black uppercase text-[9px] sm:text-[10px] tracking-wider transition-all rounded-none border border-zinc-650 cursor-pointer"
                >
                  🔄 JUGAR OTRA VEZ
                </button>
              </div>
            </div>
          )}

          {/* Progress bar (Active during play) */}
          {changaGameState === 'playing' && changaEarned < 15000 && (
            <div className="w-full bg-zinc-950 h-1 overflow-hidden rounded-none border border-zinc-805 animate-pulse">
              <div
                className="bg-amber-500 h-full transition-all duration-105"
                style={{ width: `${(changaTimeLeft / 15) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Pedagogical Lesson Summary footer */}
        <div className="bg-orange-650/5 border-2 border-orange-500/20 p-2.5 sm:p-3.5 rounded-none flex items-start gap-2.5 sm:gap-3">
          <ShieldAlert className="w-4 h-4 sm:w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-[10.5px] sm:text-xs text-zinc-400 leading-normal sm:leading-relaxed font-sans">
            <span className="text-orange-500 font-black block mb-0.5 sm:mb-1 uppercase tracking-wider">💡 LECCIÓN FINANCIERA:</span>
            El presupuesto equilibrado requiere resiliencia cooperativa. ¡Continúen debatiendo!
          </div>
        </div>

        {/* Next turn Button */}
        <button
          id="btn-close-cierre-report"
          onClick={onClose}
          className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-black py-3 sm:py-3.5 px-4 sm:px-5 rounded-none font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,88,12,0.2)]"
        >
          AVANZAR AL MES SIGUIENTE
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
