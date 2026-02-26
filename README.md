# LuminaSave

LuminaSave is a consumer-first DeFi savings app built for the YO SDK Hackathon.

## Hackathon Fit

This project is designed to match the judging rubric:

- UX Simplicity: goal-based savings flow, demo-ready empty states, one-click "Try on Base"
- Creativity and Growth: savings pockets + proof panel + shareable progress card
- YO SDK Integration: live `approve/deposit/redeem` transaction paths
- Risk and Trust: vault-specific risk page, fee breakdown, drawdown notes, explorer proof links

## YO SDK Integration (Core Requirement)

LuminaSave uses `@yo-protocol/core` directly in runtime:

- `createYoClient(...)` for chain-specific read/write clients
- `depositWithApproval(...)` for approve + deposit flow
- `redeem(...)` and `waitForRedeemReceipt(...)` for withdraw/redeem flow
- `getPendingRedemptions(...)` polling for queued redeem settlement

Main files:

- `src/hooks/useYoRuntime.ts`
- `src/components/DepositModal.tsx`
- `src/components/RedeemModal.tsx`
- `src/App.tsx` (`PendingRedeemSync`)

## Supported Vaults and Chains

- `yoUSD`: Base, Arbitrum, Ethereum
- `yoETH`: Base, Ethereum
- `yoBTC`: Base, Ethereum

Vault selector is available in header and auto-switches chain when vault-chain mismatch is detected.

## Live Onchain Flows

1. Connect wallet
2. Choose vault (`yoUSD`, `yoETH`, `yoBTC`)
3. Create savings goal
4. Deposit with YO SDK (`depositWithApproval`)
5. Redeem with YO SDK (`redeem`)
6. If redeem is queued, app polls status until settlement

## Proof and Transparency

- Dashboard includes "On-chain Proof Panel"
- History page lists tx hash + explorer links + status (`Confirmed`, `Queued`, `Failed`)
- CSV export available for history
- Risk page is vault-specific:
  - strategy notes
  - fee breakdown
  - worst drawdown snapshot
  - contract/audit/reference links

## Demo-Ready Features

- "Try on Base" button in hero section
- Empty states tailored for new wallets/accounts
- Share Progress Card (downloadable PNG for social/demo slides)

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Submission Notes (DoraHacks)

For final submission include:

- GitHub repo link
- Vercel live link
- 3-minute demo video
- At least one real deposit tx hash
- At least one real redeem tx hash
- Brief explanation of YO SDK usage (see sections above)

## Example Proof Format

Use this format in submission text:

- Deposit tx (Base): `https://basescan.org/tx/<hash>`
- Redeem tx (Base/Ethereum/Arbitrum): `https://.../tx/<hash>`
- Optional queued redeem request id: `Request #<id>`
