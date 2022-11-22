import Navbar from './Navbar';
import GridDisplay from './GridDisplay';
import NFTView from './NFTView';

import { WagmiConfig } from 'wagmi';
import { client } from '../wagmiClient';

export default function App() {
  return (
    <WagmiConfig client={client}>
      <Navbar/>
      <GridDisplay/>
      <NFTView />
    </WagmiConfig>
  );
}
