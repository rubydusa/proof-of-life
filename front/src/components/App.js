import Navbar from './Navbar';
import GridDisplay from './GridDisplay';
import NFTViewWrapper from './NFTViewWrapper';

import { WagmiConfig } from 'wagmi';
import { client } from '../wagmiClient';

import '../styles/Portal.css';

export default function App() {
  return (
    <WagmiConfig client={client}>
      <Navbar/>
      <GridDisplay/>
      <NFTViewWrapper />
    </WagmiConfig>
  );
}
