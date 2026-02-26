import { createYoClient, isSupportedChain, type SupportedChainId, type VaultConfig, type VaultId } from '@yo-protocol/core';
import { useMemo } from 'react';
import type { Address, PublicClient, WalletClient } from 'viem';
import { useChainId, usePublicClient, useWalletClient } from 'wagmi';
import type { Transaction } from '../types';

const DEFAULT_VAULT_ID: VaultId = 'yoUSD';

const NETWORK_BY_CHAIN_ID: Record<SupportedChainId, Transaction['network']> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
};

export interface YoRuntime {
  chainId: number;
  supportedChainId: SupportedChainId | null;
  network: Transaction['network'] | null;
  client: ReturnType<typeof createYoClient> | null;
  vault: VaultConfig | null;
  tokenAddress: Address | null;
  tokenDecimals: number;
}

export function useYoRuntime(vaultId: VaultId = DEFAULT_VAULT_ID): YoRuntime {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const supportedChainId = isSupportedChain(chainId) ? chainId : null;

  const client = useMemo(() => {
    if (!supportedChainId || !publicClient) return null;
    return createYoClient({
      chainId: supportedChainId,
      publicClient: publicClient as PublicClient,
      walletClient: walletClient as WalletClient | undefined,
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
    network: supportedChainId ? NETWORK_BY_CHAIN_ID[supportedChainId] : null,
    client,
    vault,
    tokenAddress: tokenAddress ?? null,
    tokenDecimals: vault?.underlying.decimals ?? 6,
  };
}
