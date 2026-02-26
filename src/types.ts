import type { VaultId } from '@yo-protocol/core';

export type SupportedVault = Extract<VaultId, 'yoUSD' | 'yoETH' | 'yoBTC'>;

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
  vaultId: SupportedVault;
  goalId: string;
  goalName: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  yieldAmount?: number;
  requestId?: string;
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
  selectedVault: SupportedVault;
  connected: boolean;
  walletAddress: string;
  goals: SavingsGoal[];
  transactions: Transaction[];
  notifications: AppNotification[];
  depositModal: { open: boolean; goalId: string | null };
  redeemModal: { open: boolean; goalId: string | null };
}
