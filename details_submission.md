# LuminaSave

## Live Demo
https://lumina-save.vercel.app/

## Source Code
https://github.com/panzauto46-bot/LuminaSave

## Video Demo
Watch LuminaSave in action:

https://youtu.be/_25wNCrfgVU

## Problem and Vision
Traditional DeFi yield vaults are powerful but intimidating. Users face complex interfaces, unclear fee structures, opaque transaction status, and no clear way to organize savings around personal goals like vacations, education, or emergency funds.

LuminaSave bridges the UX gap between consumer banking and DeFi yield vaults. We bring the simplicity of Acorns or Qapital to the transparency and yield of onchain DeFi, powered by YO Protocol vaults.

## Key Features
### Goal-Based Savings Pockets
- Create personalized savings pockets (for example: Emergency Fund, Vacation).
- Each pocket has its own target amount, progress bar, and risk profile.

### Multi-Vault and Multi-Chain Support
- Supports `yoUSD` (Base, Arbitrum, Ethereum), `yoETH` (Base, Ethereum), and `yoBTC` (Base, Ethereum).
- Auto chain-switch detection prompts users to switch networks when a vault-chain mismatch occurs.

### YO SDK Integration
LuminaSave uses `@yo-protocol/core` and `@yo-protocol/react` for onchain transaction flows:
- `depositWithApproval()` for deposit execution.
- `redeem()` + `waitForRedeemReceipt()` for instant and queued withdrawals.
- `getPendingRedemptions()` polling every 25 seconds for queued redeem settlement.

### Onchain Proof and Transparency
- Proof panel showing transaction statuses (`Confirmed`, `Queued`, `Failed`).
- Full transaction history with CSV export and explorer links (BaseScan/Etherscan/Arbiscan).
- Vault-specific risk page with strategy notes, fee breakdown, and worst historical drawdown context.

## Tech Stack
- Frontend: React 19.2, TypeScript, Vite, TailwindCSS 4.1
- Web3: Wagmi 3.5, Viem, `@yo-protocol/core`
- Animations: Framer Motion
- Deployment: Vercel

## Project Links
- Live Demo: https://lumina-save.vercel.app/
- GitHub Repository: https://github.com/panzauto46-bot/LuminaSave
- Demo Video: https://youtu.be/_25wNCrfgVU
