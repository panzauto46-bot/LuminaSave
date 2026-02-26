import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { normalizeGoalIcon } from '../utils/goalIcons';
import { AppNotification, AppState, Page, SavingsGoal, SupportedVault, Transaction } from '../types';

const DEFAULT_VAULT: SupportedVault = 'yoUSD';
const STORAGE_KEY = 'luminasave:state:v2';

const initialGoals: SavingsGoal[] = [];
const initialTransactions: Transaction[] = [];

type PersistedState = Pick<AppState, 'darkMode' | 'selectedVault' | 'goals' | 'transactions'>;

const baseInitialState: AppState = {
  page: 'landing',
  darkMode: true,
  selectedVault: DEFAULT_VAULT,
  connected: false,
  walletAddress: '',
  goals: initialGoals,
  transactions: initialTransactions,
  notifications: [],
  depositModal: { open: false, goalId: null },
  redeemModal: { open: false, goalId: null },
};

type StoredGoal = Omit<SavingsGoal, 'icon'> & { icon?: string };
type StoredTx = Omit<Transaction, 'vaultId' | 'network'> & {
  vaultId?: SupportedVault;
  network?: Transaction['network'];
};

function isSupportedVault(value: unknown): value is SupportedVault {
  return value === 'yoUSD' || value === 'yoETH' || value === 'yoBTC';
}

function normalizeGoal(goal: StoredGoal): SavingsGoal {
  return {
    ...goal,
    icon: normalizeGoalIcon(goal.icon ?? 'target'),
  };
}

function normalizeTransaction(tx: StoredTx): Transaction {
  return {
    ...tx,
    vaultId: isSupportedVault(tx.vaultId) ? tx.vaultId : DEFAULT_VAULT,
    network: tx.network ?? 'Base',
  };
}

function loadInitialState(): AppState {
  if (typeof window === 'undefined') {
    return baseInitialState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseInitialState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;

    if (!Array.isArray(parsed.goals) || !Array.isArray(parsed.transactions)) {
      return baseInitialState;
    }

    return {
      ...baseInitialState,
      darkMode: typeof parsed.darkMode === 'boolean' ? parsed.darkMode : true,
      selectedVault: isSupportedVault(parsed.selectedVault) ? parsed.selectedVault : DEFAULT_VAULT,
      goals: parsed.goals.map((goal) => normalizeGoal(goal as StoredGoal)),
      transactions: parsed.transactions.map((tx) => normalizeTransaction(tx as StoredTx)),
    };
  } catch {
    return baseInitialState;
  }
}

type Action =
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_SELECTED_VAULT'; payload: SupportedVault }
  | { type: 'SET_WALLET_STATE'; payload: { connected: boolean; walletAddress: string } }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; patch: Partial<Pick<AppNotification, 'title' | 'message' | 'type'>> } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'ADD_GOAL'; payload: SavingsGoal }
  | { type: 'DEPOSIT'; payload: { vaultId: SupportedVault; goalId: string; amount: number; txHash: string; network: Transaction['network'] } }
  | { type: 'REDEEM'; payload: { vaultId: SupportedVault; goalId: string; percentage: number; txHash: string; network: Transaction['network']; status?: Transaction['status']; requestId?: string } }
  | { type: 'UPDATE_TRANSACTION_STATUS'; payload: { id: string; status: Transaction['status'] } }
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
    case 'SET_SELECTED_VAULT':
      return { ...state, selectedVault: action.payload };
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
        depositModal: { open: false, goalId: null },
        redeemModal: { open: false, goalId: null },
      };
    }
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload], page: 'dashboard' };
    case 'DEPOSIT': {
      const { vaultId, goalId, amount, txHash, network } = action.payload;
      const updatedGoals = state.goals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      );
      const goal = state.goals.find((g) => g.id === goalId);
      const newTx: Transaction = {
        id: `t${Date.now()}`,
        vaultId,
        goalId,
        goalName: goal?.name || '',
        type: 'deposit',
        amount,
        status: 'success',
        date: new Date().toISOString().split('T')[0],
        txHash,
        network,
      };
      return {
        ...state,
        goals: updatedGoals,
        transactions: [newTx, ...state.transactions],
        depositModal: { open: false, goalId: null },
      };
    }
    case 'REDEEM': {
      const { vaultId, goalId, percentage, txHash, network, status = 'success', requestId } = action.payload;
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
        vaultId,
        goalId,
        goalName: goal.name,
        type: 'withdraw',
        amount: withdrawAmount,
        yieldAmount: yieldWithdraw,
        requestId,
        status,
        date: new Date().toISOString().split('T')[0],
        txHash,
        network,
      };
      return {
        ...state,
        goals: updatedGoals,
        transactions: [newTx, ...state.transactions],
        redeemModal: { open: false, goalId: null },
      };
    }
    case 'UPDATE_TRANSACTION_STATUS':
      return {
        ...state,
        transactions: state.transactions.map((tx) =>
          tx.id === action.payload.id
            ? { ...tx, status: action.payload.status }
            : tx
        ),
      };
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
      selectedVault: state.selectedVault,
      goals: state.goals,
      transactions: state.transactions,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write failures to keep UI functional.
    }
  }, [state.darkMode, state.selectedVault, state.goals, state.transactions]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
