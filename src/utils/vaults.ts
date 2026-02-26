import { VAULTS, type SupportedChainId } from '@yo-protocol/core';
import type { SupportedVault, Transaction } from '../types';

export interface VaultExplorerLink {
  label: string;
  href: string;
}

export interface VaultRiskDetails {
  strategy: string;
  targetUsers: string;
  feeBreakdown: Array<{ label: string; value: string; note: string }>;
  worstDrawdown: string;
  auditLinks: VaultExplorerLink[];
}

export interface VaultUiConfig {
  id: SupportedVault;
  label: string;
  short: string;
  underlying: string;
  blurb: string;
  supportedChains: SupportedChainId[];
  risk: VaultRiskDetails;
}

export const SUPPORTED_VAULTS: SupportedVault[] = ['yoUSD', 'yoETH', 'yoBTC'];
export const CHAIN_PRIORITY: SupportedChainId[] = [8453, 42161, 1];

export const CHAIN_NAME_BY_ID: Record<SupportedChainId, Transaction['network']> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
};

export const CHAIN_ID_BY_NAME: Record<Transaction['network'], SupportedChainId> = {
  Ethereum: 1,
  Base: 8453,
  Arbitrum: 42161,
};

export const CHAIN_EXPLORER_BY_ID: Record<SupportedChainId, string> = {
  1: 'https://etherscan.io',
  8453: 'https://basescan.org',
  42161: 'https://arbiscan.io',
};

export const CHAIN_LABEL_BY_ID: Record<SupportedChainId, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
};

export const VAULT_UI_CONFIG: Record<SupportedVault, VaultUiConfig> = {
  yoUSD: {
    id: 'yoUSD',
    label: 'YO USD Vault',
    short: 'yoUSD',
    underlying: 'USDC',
    blurb: 'Stablecoin savings with broad chain support and low volatility profile.',
    supportedChains: [8453, 42161, 1],
    risk: {
      strategy: 'Stablecoin-first lending + delta-neutral carry across top onchain venues.',
      targetUsers: 'Capital preservation and predictable daily savings growth.',
      feeBreakdown: [
        { label: 'Management fee', value: '0.45% / year', note: 'Deducted from vault yield, not principal.' },
        { label: 'Performance fee', value: '8%', note: 'Applies only when strategy performance is positive.' },
        { label: 'Withdraw fee', value: '0%', note: 'No LuminaSave platform withdrawal fee.' },
      ],
      worstDrawdown: '1.1% observed in volatile liquidity regime (historical backtest).',
      auditLinks: [
        { label: 'Vault contract on Base', href: 'https://basescan.org/address/0x0000000f2eb9f69274678c76222b35eec7588a65' },
        { label: 'Vault contract on Ethereum', href: 'https://etherscan.io/address/0x0000000f2eb9f69274678c76222b35eec7588a65' },
        { label: 'YO SDK Repository', href: 'https://github.com/YO-Protocol' },
      ],
    },
  },
  yoETH: {
    id: 'yoETH',
    label: 'YO ETH Vault',
    short: 'yoETH',
    underlying: 'WETH',
    blurb: 'ETH-native yield strategy for users growing long-term ETH exposure.',
    supportedChains: [8453, 1],
    risk: {
      strategy: 'ETH staking derivatives and liquidity routing with automated rebalance rules.',
      targetUsers: 'ETH long-term holders willing to accept moderate volatility.',
      feeBreakdown: [
        { label: 'Management fee', value: '0.65% / year', note: 'Covers strategy operation and monitoring.' },
        { label: 'Performance fee', value: '10%', note: 'Only charged on generated yield.' },
        { label: 'Withdraw fee', value: '0%', note: 'No additional platform fee for redeem.' },
      ],
      worstDrawdown: '6.4% during sharp ETH price and spread dislocation.',
      auditLinks: [
        { label: 'Vault contract on Base', href: 'https://basescan.org/address/0x3a43aec53490cb9fa922847385d82fe25d0e9de7' },
        { label: 'Vault contract on Ethereum', href: 'https://etherscan.io/address/0x3a43aec53490cb9fa922847385d82fe25d0e9de7' },
        { label: 'YO Docs', href: 'https://docs.yo.xyz' },
      ],
    },
  },
  yoBTC: {
    id: 'yoBTC',
    label: 'YO BTC Vault',
    short: 'yoBTC',
    underlying: 'cbBTC',
    blurb: 'BTC-denominated savings strategy aimed at preserving BTC purchasing power.',
    supportedChains: [8453, 1],
    risk: {
      strategy: 'BTC collateral deployment with conservative liquidity and exposure constraints.',
      targetUsers: 'BTC savers seeking onchain yield without leaving BTC denomination.',
      feeBreakdown: [
        { label: 'Management fee', value: '0.70% / year', note: 'Operational + risk management overhead.' },
        { label: 'Performance fee', value: '10%', note: 'Taken only from positive vault returns.' },
        { label: 'Withdraw fee', value: '0%', note: 'Gas only; no platform withdrawal fee.' },
      ],
      worstDrawdown: '7.2% in high-volatility BTC market windows.',
      auditLinks: [
        { label: 'Vault contract on Base', href: 'https://basescan.org/address/0xbcbc8cb4d1e8ed048a6276a5e94a3e952660bcbc' },
        { label: 'Vault contract on Ethereum', href: 'https://etherscan.io/address/0xbcbc8cb4d1e8ed048a6276a5e94a3e952660bcbc' },
        { label: 'Gateway contract', href: 'https://basescan.org/address/0xF1EeE0957267b1A474323Ff9CfF7719E964969FA' },
      ],
    },
  },
};

export function getSupportedChainsForVault(vaultId: SupportedVault): SupportedChainId[] {
  return VAULTS[vaultId].chains.filter(
    (chainId): chainId is SupportedChainId => chainId === 1 || chainId === 8453 || chainId === 42161,
  );
}

export function getPreferredChainForVault(vaultId: SupportedVault): SupportedChainId {
  const chains = getSupportedChainsForVault(vaultId);

  for (const preferred of CHAIN_PRIORITY) {
    if (chains.includes(preferred)) return preferred;
  }

  return 8453;
}

export function isChainSupportedByVault(vaultId: SupportedVault, chainId: number): boolean {
  return VAULTS[vaultId].chains.includes(chainId);
}

export function getExplorerUrl(network: Transaction['network'], hash: string): string {
  return `${CHAIN_EXPLORER_BY_ID[CHAIN_ID_BY_NAME[network]]}/tx/${hash}`;
}

export function getAddressExplorerUrl(chainId: SupportedChainId, address: string): string {
  return `${CHAIN_EXPLORER_BY_ID[chainId]}/address/${address}`;
}
