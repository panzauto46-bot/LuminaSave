# LuminaSave - YO SDK Hackathon Submission

## Project Links
- Live demo: https://lumina-save.vercel.app/
- GitHub repository: https://github.com/panzauto46-bot/LuminaSave
- Demo video (3 minutes): https://youtu.be/yfVQTDZpyow

## Problem Statement
DeFi yield products are powerful but still hard for mainstream savers to trust and use daily.

Main pain points:
- Users do not save by life goals; they only see technical vault screens.
- Transaction progress is unclear, especially for queued redeem flows.
- Risk and fee information is often fragmented and not user-friendly.

Target users:
- Retail users who want a simple "savings app" UX with onchain transparency.
- First-time DeFi users who need clear proof, clear risk information, and low-friction actions.

## Solution
LuminaSave is a consumer-first DeFi savings app powered by YO vaults.

Core experience:
- Users create goal-based savings pockets (emergency fund, travel, education, etc.).
- Users select YO vaults (`yoUSD`, `yoETH`, `yoBTC`) and run live deposit/redeem flows.
- Users track onchain proof in a dedicated proof panel and full transaction history.
- Users can review strategy, fees, drawdown context, and contract links in a risk transparency page.

## YO SDK Integration (Required by Hackathon)
LuminaSave uses `@yo-protocol/core` and `@yo-protocol/react` for real onchain flows.

Implemented SDK usage:
- `createYoClient(...)`
- `depositWithApproval(...)`
- `redeem(...)`
- `waitForRedeemReceipt(...)`
- `getPendingRedemptions(...)`

Where integration happens:
- `src/hooks/useYoRuntime.ts`
- `src/components/DepositModal.tsx`
- `src/components/RedeemModal.tsx`
- `src/App.tsx` (`PendingRedeemSync`)

Supported live chains:
- Base (8453)
- Ethereum (1)
- Arbitrum (42161)

## Onchain Transaction Proof
Replace placeholder hashes below with your latest successful transactions before final submission.

- Base deposit tx: https://basescan.org/tx/<BASE_DEPOSIT_HASH>
- Base redeem tx: https://basescan.org/tx/<BASE_REDEEM_HASH>
- Ethereum tx (optional): https://etherscan.io/tx/<ETH_TX_HASH>
- Arbitrum tx (optional): https://arbiscan.io/tx/<ARB_TX_HASH>

If a redeem is queued:
- Include redeem tx hash.
- Include request id shown in app history/proof panel.
- Confirm it settles in the polling flow.

## Unique Value
What makes LuminaSave distinct:
- Goal-based pockets + YO vaults, not just a generic vault dashboard.
- Built-in proof panel focused on transaction verifiability.
- Queued redeem monitoring with status sync and notifications.
- Trust-first UX: risk notes, fee breakdown, worst drawdown context, explorer links.

## Judging Criteria Mapping
UX Simplicity (30%):
- Simple onboarding, one-click "Try on Base", goal-based flow, clear modals.

Creativity and Growth Potential (30%):
- Consumer savings mental model for DeFi, shareable progress card, practical use case.

Quality of Integration (20%):
- Live deposit and redeem via YO SDK, real onchain execution, multi-chain support.

Risk and Trust (20%):
- Transparent proof links, transaction history export, risk and fee communication.

## Local Run
```bash
npm install
npm run dev
```

Default local URL: `http://localhost:5173`
