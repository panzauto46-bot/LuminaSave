import { createYoClient, VAULTS, isSupportedChain, type SupportedChainId } from '@yo-protocol/core';
import { useMemo } from 'react';
import type { Address } from 'viem';
import { useChainId, usePublicClient } from 'wagmi';
import type { SupportedVault, Transaction } from '../types';
import { CHAIN_NAME_BY_ID, getPreferredChainForVault, getSupportedChainsForVault, isChainSupportedByVault } from '../utils/vaults';

const DEFAULT_VAULT_ID: SupportedVault = 'yoUSD';

export interface YoRuntime {
  chainId: number;
  supportedChainId: SupportedChainId | null;
  network: Transaction['network'] | null;
  preferredChainId: SupportedChainId;
  supportedVaultChains: SupportedChainId[];
  isSelectedVaultSupportedOnChain: boolean;
  client: ReturnType<typeof createYoClient> | null;
  vault: (typeof VAULTS)[SupportedVault] | null;
  tokenAddress: Address | null;
  tokenSymbol: string;
  tokenDecimals: number;
}

export function useYoRuntime(vaultId: SupportedVault = DEFAULT_VAULT_ID): YoRuntime {
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const supportedChainId = isSupportedChain(chainId) ? chainId : null;

  const client = useMemo(() => {
    if (!supportedChainId || !publicClient) return null;
    return createYoClient({
      chainId: supportedChainId,
      partnerId: 9999,
      publicClients: {
        [supportedChainId]: publicClient as any,
      },
    });
  }, [supportedChainId, publicClient]);

  const vault = VAULTS[vaultId] ?? null;

  const tokenAddress = useMemo((): Address | null => {
    if (!vault || !supportedChainId) return null;
    const addr = vault.underlying.address[supportedChainId];
    return addr ?? null;
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
    tokenAddress,
    tokenSymbol: vault?.underlying.symbol ?? 'USDC',
    tokenDecimals: vault?.underlying.decimals ?? 6,
  };
}
