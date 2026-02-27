import { createYoClient, isSupportedChain, type SupportedChainId, type VaultConfig } from '@yo-protocol/core';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useChainId, usePublicClient, useWalletClient } from 'wagmi';
import type { SupportedVault, Transaction } from '../types';
import { CHAIN_NAME_BY_ID, getPreferredChainForVault, getSupportedChainsForVault, isChainSupportedByVault } from '../utils/vaults';

const DEFAULT_VAULT_ID: SupportedVault = 'yoUSD';
type YoClientConfig = Parameters<typeof createYoClient>[0];

export interface YoRuntime {
  chainId: number;
  supportedChainId: SupportedChainId | null;
  network: Transaction['network'] | null;
  preferredChainId: SupportedChainId;
  supportedVaultChains: SupportedChainId[];
  isSelectedVaultSupportedOnChain: boolean;
  client: ReturnType<typeof createYoClient> | null;
  vault: VaultConfig | null;
  tokenAddress: Address | null;
  tokenSymbol: string;
  tokenDecimals: number;
}

export function useYoRuntime(vaultId: SupportedVault = DEFAULT_VAULT_ID): YoRuntime {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const supportedChainId = isSupportedChain(chainId) ? chainId : null;

  const client = useMemo(() => {
    if (!supportedChainId || !publicClient) return null;
    return createYoClient({
      chainId: supportedChainId,
      // The YO SDK pins viem 2.44.2 internally; cast bridges equivalent runtime clients.
      publicClient: publicClient as unknown as YoClientConfig['publicClient'],
      walletClient: walletClient as unknown as YoClientConfig['walletClient'],
    });
  }, [supportedChainId, publicClient, walletClient]);

  const vault = useMemo(() => {
    if (!client) return null;
    return client.getVaults().find((item) => item.symbol === vaultId) ?? null;
  }, [client, vaultId]);

  const tokenAddress = useMemo(() => {
    if (!vault || !supportedChainId) return null;
    return vault.underlying.address[supportedChainId];
  }, [vault, supportedChainId]);

  return {
    chainId,
    supportedChainId,
    network: supportedChainId ? CHAIN_NAME_BY_ID[supportedChainId] : null,
    preferredChainId: getPreferredChainForVault(vaultId),
    supportedVaultChains: getSupportedChainsForVault(vaultId),
    isSelectedVaultSupportedOnChain: isChainSupportedByVault(vaultId, chainId),
    client,
    vault,
    tokenAddress: tokenAddress ?? null,
    tokenSymbol: vault?.underlying.symbol ?? 'USDC',
    tokenDecimals: vault?.underlying.decimals ?? 6,
  };
}
