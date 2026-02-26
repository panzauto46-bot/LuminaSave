import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { arbitrum, base, mainnet } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [base, arbitrum, mainnet],
  connectors: [injected()],
  transports: {
    [base.id]: http(),
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
  },
});
