import { useCallback } from 'react';
import { useConnect, useDisconnect } from 'wagmi';

export function useWalletActions() {
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnectAsync, isPending: isDisconnecting } = useDisconnect();

  const connectWallet = useCallback(async () => {
    const injectedConnector = connectors.find((connector) => connector.id === 'injected');
    const connector = injectedConnector ?? connectors[0];
    if (!connector) {
      throw new Error('No wallet connector is available.');
    }
    await connectAsync({ connector });
  }, [connectAsync, connectors]);

  const disconnectWallet = useCallback(async () => {
    await disconnectAsync();
  }, [disconnectAsync]);

  return { connectWallet, disconnectWallet, isConnecting, isDisconnecting };
}
