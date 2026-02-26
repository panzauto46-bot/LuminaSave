export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  yieldEarned: number;
  riskProfile: 'low' | 'medium';
  monthlyDeposit: number;
  createdAt: string;
  color: string;
}

export interface Transaction {
  id: string;
  goalId: string;
  goalName: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  yieldAmount?: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
  txHash: string;
  network: 'Base' | 'Arbitrum' | 'Ethereum';
}

export type Page = 'landing' | 'dashboard' | 'create-goal' | 'history' | 'risk';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'pending' | 'success' | 'failed';
}

export interface AppState {
  page: Page;
  darkMode: boolean;
  connected: boolean;
  walletAddress: string;
  goals: SavingsGoal[];
  transactions: Transaction[];
  notifications: AppNotification[];
  depositModal: { open: boolean; goalId: string | null };
  redeemModal: { open: boolean; goalId: string | null };
}
