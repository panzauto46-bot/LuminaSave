<p align="center">
  <img src="https://img.shields.io/badge/⚡-LuminaSave-gold?style=for-the-badge&labelColor=0a0e1a" alt="LuminaSave" />
</p>

<h1 align="center">💰 LuminaSave</h1>

<p align="center">
  <strong>Smart DeFi Savings, Powered by YO Vaults.</strong>
</p>

<p align="center">
  A consumer-first DeFi savings application that transforms how users interact with onchain yield vaults — through intuitive goal-based "pockets", real-time proof tracking, and seamless multi-chain deposits.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.3-61dafb?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.2.4-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.17-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/YO_Protocol-SDK-fbbf24?style=flat-square" alt="YO SDK" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-yo-sdk-integration">YO SDK</a> •
  <a href="#%EF%B8%8F-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-supported-vaults">Vaults</a>
</p>

---

## 🌐 Live Demo

> 🔗 **[Try LuminaSave Live →](#)** *(Vercel deployment link)*

**Quick Start:** Click **"Try on Base"** on the landing page to instantly connect your wallet, switch to Base network, and start a live deposit flow — all in one click.

---

## 🎯 Problem & Vision

### The Problem
Traditional DeFi yield vaults are powerful — but intimidating. Users face complex interfaces, unclear fee structures, opaque transaction status, and no clear way to organize savings around personal goals like vacations, education, or emergency funds.

### Our Vision
**LuminaSave bridges the UX gap** between consumer banking and DeFi yield vaults. We bring the simplicity of Acorns or Qapital to the transparency and yield of onchain DeFi — powered by YO Protocol vaults.

> *"What if saving onchain felt as easy as a banking app, but with vault-grade transparency?"*

---

## ✨ Features

### 🏦 Goal-Based Savings Pockets
- Create **personalized savings pockets** (e.g., "Emergency Fund", "Vacation", "New Laptop")
- Each pocket has its own target amount, progress bar, monthly deposit schedule, and risk profile
- Choose custom icons and colors for each goal
- Automatic yield tracking per pocket

### 💎 Multi-Vault & Multi-Chain
| Vault | Underlying | Chains | APY Range |
|-------|-----------|--------|-----------|
| **yoUSD** | USDC | Base, Arbitrum, Ethereum | 8–12.5% |
| **yoETH** | WETH | Base, Ethereum | Variable |
| **yoBTC** | cbBTC | Base, Ethereum | Variable |

- Vault selector in the header — switch between `yoUSD`, `yoETH`, `yoBTC` with one click
- **Auto chain-switch**: When a vault-chain mismatch is detected, the app automatically prompts to switch networks

### 🔐 On-Chain Proof & Transparency
- **Proof Panel** on the dashboard showing live transaction statuses
- Every deposit and redeem comes with a clickable **explorer link** (BaseScan, Etherscan, Arbiscan)
- Transaction statuses: `Confirmed ✅` | `Queued ⏳` | `Failed ❌`
- Full transaction history with **CSV export** support

### ⚡ One-Click Demo Flow
- **"Try on Base"** button: connects wallet → switches to Base → selects yoUSD → ready to deposit
- Designed for **3-step live demo** during hackathon judging
- Empty states are carefully crafted for new wallets (not just blank pages)

### 🛡️ Vault-Specific Risk Page
- Strategy explanation per vault
- **Fee breakdown** (management, performance, withdrawal)
- Worst historical drawdown data
- Audit links and contract addresses on block explorers

### 📊 Share Progress Card
- Downloadable **PNG progress card** for social media or demo slides
- Shows savings goal, progress %, vault, and yield earned

### 🔔 Real-Time Notifications
- In-app notification center for transaction events
- Queued redeem settlement alerts with auto-polling (every 25 seconds)
- Success, pending, and failure states with clear messaging

### 🌙 Dark/Light Mode
- Premium dark mode (navy + gold aesthetic) as default
- Light mode with clean, modern palette
- Smooth animated toggle

---

## 🔗 YO SDK Integration

> **This is the core hackathon requirement.** LuminaSave uses `@yo-protocol/core` and `@yo-protocol/react` for **all** onchain interactions.

### SDK Functions Used

```typescript
// 1. Client Initialization
import { createYoClient, VAULTS } from '@yo-protocol/core';

const client = createYoClient({
  chainId: supportedChainId,
  publicClient,
  walletClient,
});

// 2. Deposit Flow (Approve + Deposit)
await client.depositWithApproval(vaultAddress, amount, userAddress);

// 3. Redeem/Withdraw Flow
await client.redeem(vaultAddress, shares, userAddress);
await client.waitForRedeemReceipt(txHash);

// 4. Pending Redemption Polling
const pending = await client.getPendingRedemptions(vaultAddress, userAddress);
```

### Integration Points

| File | SDK Usage |
|------|-----------|
| `src/hooks/useYoRuntime.ts` | Creates YO client with chain-aware config, resolves vault configs, underlying token addresses |
| `src/components/DepositModal.tsx` | Executes `depositWithApproval()` with real approve → deposit flow |
| `src/components/RedeemModal.tsx` | Executes `redeem()` + `waitForRedeemReceipt()`, handles queued redemptions |
| `src/App.tsx` (`PendingRedeemSync`) | Polls `getPendingRedemptions()` every 25s for queued redeem settlement |
| `src/utils/vaults.ts` | Maps `VAULTS` registry to UI-friendly config with risk, fees, and explorer links |

### Transaction Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  User picks  │────▶│  Approve ERC │────▶│  Deposit via│────▶│  Tx Confirmed│
│  Vault + Amt │     │  20 Token    │     │  YO SDK     │     │  + Proof Link│
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌───────────┐
│  User clicks │────▶│  Redeem via  │────▶│  Instant ✅ or   │────▶│  Explorer │
│  Withdraw    │     │  YO SDK      │     │  Queued ⏳ Poll  │     │  Proof    │
└─────────────┘     └──────────────┘     └─────────────────┘     └───────────┘
```

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                      LuminaSave App                      │
│                                                          │
│  ┌──────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │  Wagmi   │  │  AppContext    │  │  YO Protocol SDK │  │
│  │  Wallet  │◀─│  (useReducer) │─▶│  @yo-protocol/   │  │
│  │  Manager │  │  + localStorage│  │  core            │  │
│  └────┬─────┘  └───────┬───────┘  └────────┬─────────┘  │
│       │                │                    │            │
│  ┌────▼────────────────▼────────────────────▼─────────┐  │
│  │              React Components (Framer Motion)       │  │
│  │  Landing │ Dashboard │ Deposit │ Redeem │ History   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                  Multi-Chain Layer                  │  │
│  │     Base (8453)  │  Arbitrum (42161)  │  ETH (1)   │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
LuminaSave/
├── 📄 index.html                    # Entry HTML
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 vite.config.ts                # Vite build config
│
├── 📂 src/
│   ├── 📄 main.tsx                  # React DOM entry point
│   ├── 📄 App.tsx                   # Root component + page router + PendingRedeemSync
│   ├── 📄 types.ts                  # TypeScript types (SavingsGoal, Transaction, AppState)
│   ├── 📄 index.css                 # Global styles (16KB+ of custom design system)
│   │
│   ├── 📂 components/               # UI Components
│   │   ├── 📄 LandingPage.tsx       # Hero section, feature cards, "How It Works", CTA
│   │   ├── 📄 Dashboard.tsx         # Main savings dashboard, goal cards, proof panel
│   │   ├── 📄 Header.tsx            # Navigation, vault selector, wallet status, dark mode
│   │   ├── 📄 CreateGoal.tsx        # Goal creation form (name, target, icon, risk profile)
│   │   ├── 📄 DepositModal.tsx      # Deposit flow: approve → deposit via YO SDK
│   │   ├── 📄 RedeemModal.tsx       # Redeem flow: withdraw → wait/poll via YO SDK
│   │   ├── 📄 TransactionHistory.tsx # Full tx history table with filters + CSV export
│   │   ├── 📄 RiskTransparency.tsx  # Vault risk info, fee breakdown, drawdown data
│   │   └── 📄 NotificationCenter.tsx # Toast notification system
│   │
│   ├── 📂 hooks/                    # Custom React Hooks
│   │   ├── 📄 useYoRuntime.ts       # YO SDK client setup, vault resolution, chain detection
│   │   └── 📄 useWalletActions.ts   # Wallet connect/disconnect helpers
│   │
│   ├── 📂 context/                  # State Management
│   │   └── 📄 AppContext.tsx        # useReducer-based global state + localStorage persistence
│   │
│   ├── 📂 utils/                    # Utilities
│   │   ├── 📄 vaults.ts            # Vault configs, chain mappings, risk details, explorer URLs
│   │   ├── 📄 goalIcons.tsx         # SVG icon registry for savings goals
│   │   └── 📄 cn.ts                # className merge utility (clsx + tailwind-merge)
│   │
│   └── 📂 wallet/                   # Web3 Wallet Layer
│       ├── 📄 WalletProvider.tsx    # Wagmi provider wrapper
│       └── 📄 config.ts            # Wagmi chain + connector configuration
│
└── 📂 dist/                         # Production build output
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A Web3 wallet (MetaMask, Rabby, Coinbase Wallet, etc.)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/pandu-dargah/LuminaSave.git

# 2. Navigate to the project
cd LuminaSave

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview    # Preview the production build locally
```

---

## 🏛️ Supported Vaults

### yoUSD — Stablecoin Savings
| Property | Details |
|----------|---------|
| **Underlying** | USDC |
| **Chains** | Base, Arbitrum, Ethereum |
| **Strategy** | Stablecoin lending + delta-neutral carry across top onchain venues |
| **Management Fee** | 0.45% / year |
| **Performance Fee** | 8% (on positive yield only) |
| **Withdrawal Fee** | 0% |
| **Worst Drawdown** | 1.1% (historical backtest) |
| **Contract (Base)** | [`0x0000...8a65`](https://basescan.org/address/0x0000000f2eb9f69274678c76222b35eec7588a65) |

### yoETH — ETH-Native Yield
| Property | Details |
|----------|---------|
| **Underlying** | WETH |
| **Chains** | Base, Ethereum |
| **Strategy** | ETH staking derivatives + liquidity routing with auto-rebalance |
| **Management Fee** | 0.65% / year |
| **Performance Fee** | 10% (on yield only) |
| **Withdrawal Fee** | 0% |
| **Worst Drawdown** | 6.4% |
| **Contract (Base)** | [`0x3a43...9de7`](https://basescan.org/address/0x3a43aec53490cb9fa922847385d82fe25d0e9de7) |

### yoBTC — BTC Savings Strategy
| Property | Details |
|----------|---------|
| **Underlying** | cbBTC |
| **Chains** | Base, Ethereum |
| **Strategy** | BTC collateral deployment with conservative exposure constraints |
| **Management Fee** | 0.70% / year |
| **Performance Fee** | 10% (on yield only) |
| **Withdrawal Fee** | 0% |
| **Worst Drawdown** | 7.2% |
| **Contract (Base)** | [`0xbcbc...bcbc`](https://basescan.org/address/0xbcbc8cb4d1e8ed048a6276a5e94a3e952660bcbc) |

---

## 🎨 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19.2 | Component-based UI with latest concurrent features |
| **Language** | TypeScript 5.9 | End-to-end type safety |
| **Build Tool** | Vite 7.2 | Lightning-fast HMR and build |
| **Styling** | TailwindCSS 4.1 | Utility-first CSS with custom design tokens |
| **Animation** | Framer Motion 12.x | Page transitions, scroll animations, micro-interactions |
| **Web3 Wallet** | Wagmi 3.5 + Viem 2.46 | Wallet connection, chain switching, tx management |
| **YO Protocol** | @yo-protocol/core 0.0.3 | Vault deposits, redeems, pending redemption polling |
| **Icons** | Lucide React | Clean, consistent icon set |
| **State** | React useReducer + Context | Lightweight global state with localStorage persistence |

---

## 📋 Hackathon Judging Rubric Alignment

| Criteria | How LuminaSave Addresses It |
|----------|---------------------------|
| **UX Simplicity** | Goal-based pockets, demo-ready empty states, "Try on Base" one-click onboarding, intuitive vault selector |
| **Creativity & Growth** | Proof panel, shareable progress card (downloadable PNG), clear savings journey visualization |
| **YO SDK Integration** | Live `depositWithApproval`, `redeem`, `waitForRedeemReceipt`, `getPendingRedemptions` — all real onchain flows |
| **Risk & Trust** | Vault-specific risk page with fee breakdown, drawdown context, contract/audit links, explorer proof for every tx |

---

## 🔄 Onchain User Flow

```
1️⃣  CONNECT     →  Connect wallet or click "Try on Base" for instant setup
2️⃣  CREATE      →  Create a savings pocket with name, target, icon, risk level
3️⃣  SELECT      →  Choose vault (yoUSD / yoETH / yoBTC) — auto chain-switch if needed
4️⃣  DEPOSIT     →  Approve ERC-20 token → Deposit via YO SDK → Get tx hash + explorer link
5️⃣  TRACK       →  Dashboard shows real-time balance, yield earned, proof status
6️⃣  REDEEM      →  Withdraw via YO SDK → Instant or Queued (auto-polled until settled)
7️⃣  VERIFY      →  Every action has on-chain proof with clickable block explorer links
8️⃣  EXPORT      →  Download full transaction history as CSV or share progress card as PNG
```

---

## 🧪 On-Chain Proof Format

For submission verification, transaction proofs follow this format:

```
✅ Deposit tx (Base):     https://basescan.org/tx/<hash>
✅ Redeem tx (Base):      https://basescan.org/tx/<hash>
✅ Redeem tx (Ethereum):  https://etherscan.io/tx/<hash>
✅ Redeem tx (Arbitrum):  https://arbiscan.io/tx/<hash>
⏳ Queued Redeem:         Request #<id> (auto-polled until settlement)
```

---

## 🗂️ State Management

LuminaSave uses a **`useReducer`-based architecture** with `localStorage` persistence:

| Action | Description |
|--------|-------------|
| `SET_PAGE` | Navigate between Landing, Dashboard, Create Goal, History, Risk |
| `SET_WALLET_STATE` | Sync wallet connection + auto-navigate to Dashboard |
| `ADD_GOAL` | Create new savings pocket |
| `DEPOSIT` | Record deposit tx + update goal balance |
| `REDEEM` | Record redeem tx + handle instant/queued status |
| `UPDATE_TRANSACTION_STATUS` | Update tx status when queued redeems settle |
| `ADD_NOTIFICATION` | Push real-time notification |
| `SET_SELECTED_VAULT` | Switch active vault across the app |
| `TOGGLE_DARK_MODE` | Toggle between dark/light theme |

State is automatically persisted to `localStorage` under key `luminasave:state:v2` and restored on app load.

---

## 📱 Pages & Screens

| Page | Description | Key Elements |
|------|-------------|-------------|
| **Landing** | Hero with gradient animations, trust signals, feature cards, "How It Works" steps, CTA | Parallax robot mascot, running metrics strip, pointer-tracking glow |
| **Dashboard** | Savings overview, goal cards with progress, proof panel | Deposit/Redeem buttons per goal, yield tracking, on-chain proof links |
| **Create Goal** | Form to create new savings pocket | Name, target amount, icon picker, color picker, risk profile selector |
| **History** | Complete transaction log | Filter by type, status, vault; CSV export; explorer link per tx |
| **Risk** | Vault-specific transparency page | Strategy notes, fee table, worst drawdown, audit/contract links |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

<table>
  <tr>
    <td>
      <strong>Pandu Dargah</strong><br/>
      Builder & Designer<br/>
      <a href="https://github.com/pandu-dargah">GitHub</a>
    </td>
  </tr>
</table>

---

<p align="center">
  <strong>Built with 💛 for the YO SDK Hackathon</strong>
  <br/>
  <sub>LuminaSave — Making DeFi savings human-friendly.</sub>
</p>
