# LuminaSave

LuminaSave is a consumer-first DeFi savings app built for the YO SDK Hackathon.
It follows the product positioning used on the landing page:
**Smart DeFi Savings, Powered by YO Vaults.**

Built by **Pandu Dargah**.

## Hackathon Fit

This project is designed to match the judging rubric:

- UX Simplicity: goal-based pockets, demo-ready empty states, one-click Base onboarding
- Creativity and Growth: proof panel + shareable progress card + clear savings journey
- YO SDK Integration: live `approve/deposit/redeem` transaction paths
- Risk and Trust: vault-specific risk page, fee breakdown, drawdown context, explorer proof links

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

1. Connect wallet or use `Try on Base`
2. Choose vault (`yoUSD`, `yoETH`, `yoBTC`) and create a pocket
3. Approve and deposit with YO SDK (`depositWithApproval`)
4. Redeem with YO SDK (`redeem`)
5. Track proof status in-app (`Confirmed`, `Queued`, `Failed`)
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

- "Start on Base in One Click" hero flow (`Try on Base`)
- Empty states tailored for new wallets/accounts
- Copy and onboarding tuned for 3-step demo flow
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

## Author

- Pandu Dargah
