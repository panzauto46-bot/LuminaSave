import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { AppNotification, AppState, Page, SavingsGoal, Transaction } from '../types';

const initialGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Japan Vacation Fund',
    icon: 'travel',
    targetAmount: 5000,
    currentAmount: 2350,
    yieldEarned: 127.5,
    riskProfile: 'low',
    monthlyDeposit: 200,
    createdAt: '2024-01-15',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: '2',
    name: 'New Laptop Fund',
    icon: 'laptop',
    targetAmount: 2000,
    currentAmount: 1450,
    yieldEarned: 68.3,
    riskProfile: 'low',
    monthlyDeposit: 150,
    createdAt: '2024-02-01',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: '3',
    name: 'Emergency Fund',
    icon: 'safety',
    targetAmount: 10000,
    currentAmount: 4200,
    yieldEarned: 315.0,
    riskProfile: 'low',
    monthlyDeposit: 500,
    createdAt: '2023-11-01',
    color: 'from-emerald-500 to-teal-500',
  },
];

const initialTransactions: Transaction[] = [
  { id: 't1', goalId: '1', goalName: 'Japan Vacation Fund', type: 'deposit', amount: 200, status: 'success', date: '2024-12-01', txHash: '0xabc123def456789...', network: 'Base' },
  { id: 't2', goalId: '2', goalName: 'New Laptop Fund', type: 'deposit', amount: 150, status: 'success', date: '2024-11-28', txHash: '0xdef789abc012345...', network: 'Arbitrum' },
  { id: 't3', goalId: '3', goalName: 'Emergency Fund', type: 'deposit', amount: 500, status: 'success', date: '2024-11-25', txHash: '0x123abc456def789...', network: 'Base' },
  { id: 't4', goalId: '1', goalName: 'Japan Vacation Fund', type: 'withdraw', amount: 100, yieldAmount: 12.5, status: 'success', date: '2024-11-20', txHash: '0x456def789abc012...', network: 'Ethereum' },
  { id: 't5', goalId: '2', goalName: 'New Laptop Fund', type: 'deposit', amount: 300, status: 'pending', date: '2024-12-02', txHash: '0x789abc012def345...', network: 'Arbitrum' },
  { id: 't6', goalId: '3', goalName: 'Emergency Fund', type: 'deposit', amount: 500, status: 'success', date: '2024-10-25', txHash: '0xaaa111bbb222ccc...', network: 'Base' },
];

const STORAGE_KEY = 'luminasave:state:v1';

type PersistedState = Pick<AppState, 'darkMode' | 'goals' | 'transactions'>;

const baseInitialState: AppState = {
  page: 'landing',
  darkMode: true,
  connected: false,
  walletAddress: '',
  goals: initialGoals,
  transactions: initialTransactions,
  notifications: [],
  depositModal: { open: false, goalId: null },
  redeemModal: { open: false, goalId: null },
};

function isValidPersistedState(value: unknown): value is PersistedState {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.darkMode === 'boolean' &&
    Array.isArray(candidate.goals) &&
    Array.isArray(candidate.transactions)
  );
}

function loadInitialState(): AppState {
  if (typeof window === 'undefined') {
    return baseInitialState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseInitialState;
    const parsed = JSON.parse(raw) as unknown;

    if (!isValidPersistedState(parsed)) {
      return baseInitialState;
    }

    return {
      ...baseInitialState,
      darkMode: true,
      goals: parsed.goals,
      transactions: parsed.transactions,
    };
  } catch {
    return baseInitialState;
  }
}

type Action =
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_WALLET_STATE'; payload: { connected: boolean; walletAddress: string } }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; patch: Partial<Pick<AppNotification, 'title' | 'message' | 'type'>> } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'ADD_GOAL'; payload: SavingsGoal }
  | { type: 'DEPOSIT'; payload: { goalId: string; amount: number; txHash: string; network: Transaction['network'] } }
  | { type: 'REDEEM'; payload: { goalId: string; percentage: number; txHash: string; network: Transaction['network']; status?: Transaction['status'] } }
  | { type: 'OPEN_DEPOSIT'; payload: string }
  | { type: 'CLOSE_DEPOSIT' }
  | { type: 'OPEN_REDEEM'; payload: string }
  | { type: 'CLOSE_REDEEM' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 6),
      };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map((note) =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.patch }
            : note
        ),
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((note) => note.id !== action.payload),
      };
    case 'SET_WALLET_STATE': {
      if (action.payload.connected) {
        return {
          ...state,
          connected: true,
          walletAddress: action.payload.walletAddress,
          page: state.page === 'landing' ? 'dashboard' : state.page,
        };
      }
      return {
        ...state,
        connected: false,
        walletAddress: '',
        page: 'landing',
        notifications: state.notifications,
        depositModal: { open: false, goalId: null },
        redeemModal: { open: false, goalId: null },
      };
    }
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload], page: 'dashboard' };
    case 'DEPOSIT': {
      const { goalId, amount, txHash, network } = action.payload;
      const updatedGoals = state.goals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      );
      const goal = state.goals.find((g) => g.id === goalId);
      const newTx: Transaction = {
        id: `t${Date.now()}`,
        goalId,
        goalName: goal?.name || '',
        type: 'deposit',
        amount,
        status: 'success',
        date: new Date().toISOString().split('T')[0],
        txHash,
        network,
      };
      return { ...state, goals: updatedGoals, transactions: [newTx, ...state.transactions], depositModal: { open: false, goalId: null } };
    }
    case 'REDEEM': {
      const { goalId, percentage, txHash, network, status = 'success' } = action.payload;
      const goal = state.goals.find((g) => g.id === goalId);
      if (!goal) return state;
      const withdrawAmount = (goal.currentAmount * percentage) / 100;
      const yieldWithdraw = (goal.yieldEarned * percentage) / 100;
      const updatedGoals = status === 'success'
        ? state.goals.map((g) =>
            g.id === goalId
              ? { ...g, currentAmount: g.currentAmount - withdrawAmount, yieldEarned: g.yieldEarned - yieldWithdraw }
              : g
          )
        : state.goals;
      const newTx: Transaction = {
        id: `t${Date.now()}`,
        goalId,
        goalName: goal.name,
        type: 'withdraw',
        amount: withdrawAmount,
        yieldAmount: yieldWithdraw,
        status,
        date: new Date().toISOString().split('T')[0],
        txHash,
        network,
      };
      return { ...state, goals: updatedGoals, transactions: [newTx, ...state.transactions], redeemModal: { open: false, goalId: null } };
    }
    case 'OPEN_DEPOSIT':
      return { ...state, depositModal: { open: true, goalId: action.payload } };
    case 'CLOSE_DEPOSIT':
      return { ...state, depositModal: { open: false, goalId: null } };
    case 'OPEN_REDEEM':
      return { ...state, redeemModal: { open: true, goalId: action.payload } };
    case 'CLOSE_REDEEM':
      return { ...state, redeemModal: { open: false, goalId: null } };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload: PersistedState = {
      darkMode: state.darkMode,
      goals: state.goals,
      transactions: state.transactions,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write failures to keep UI functional.
    }
  }, [state.darkMode, state.goals, state.transactions]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
