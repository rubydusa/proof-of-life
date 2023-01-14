import {
  createClient,
  configureChains,
  chain
} from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';

import { InjectedConnector } from 'wagmi/connectors/injected';

const { chains, provider, webSocketProvider } = configureChains([chain.goerli], [
  publicProvider()
]);

export const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true
      }
    })
  ],
  provider,
  webSocketProvider
});
