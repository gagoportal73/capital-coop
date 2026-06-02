export type PlayerId = 'player_1' | 'player_2' | 'player_3';

export type RoleType = 'emprendedor' | 'empleado' | 'estudiante';

export interface PlayerState {
  id: PlayerId;
  name: string;
  role: RoleType;
  roleName: string;
  balance: number;
  wellbeing: number; // 0 to 100
  capacitacion: number; // 0 to 10
  baseIncome: number;
  baseExpense: number;
  isSick: boolean;
  hasCeluSeguro: boolean;
  hasComercioSeguro: boolean;
  hasBeca: boolean;
  hasCoworkingUnification: boolean;
  hasMonotributoTech: boolean;
  monotributoScaleEscaped: boolean; // Multa impositiva scale
  hasVerazGoodBehavior: boolean;
  loanDebt: number; // For credit simulation
  pendingCard27Cuotas: number; // Number of months of Cuotas remaining
  savingEmergencyFund: number; // Special emergency fund
}

export interface RoomState {
  room_id: string;
  group_id: string;
  collective_fund: number;
  points_score: number;
  active_card_id: string;
  current_administrator: PlayerId;
  voting_status: 'open' | 'resolved';
  votes: Record<PlayerId, 'A' | 'B' | 'C' | null>;
  current_month: number; // Turn from 1 to 12
  time_remaining: number; // Countdown from 90s
  card_deck?: string[]; // Deck of shuffled cards for the current game
}

export interface GameLogEntry {
  month: number;
  cardTitle: string;
  winningOption: 'A' | 'B' | 'C';
  optionText: string;
  feedbackText: string;
  fundChange: number;
  pointsChange: number;
}

export interface CardOption {
  id: 'A' | 'B' | 'C';
  text: string;
  effectDescription: string;
}

export interface GameCard {
  id: string;
  title: string;
  text: string;
  category: string;
  categoryId: number;
  target: 'group' | 'emprendedor' | 'empleado' | 'estudiante';
  options: [CardOption, CardOption, CardOption];
}
