import Navbar from './Navbar';
import About from './About';
import GridDisplay from './GridDisplay';
import NFTViewWrapper from './NFTViewWrapper';

import { WagmiConfig } from 'wagmi';
import { client } from '../wagmiClient';

import '../styles/Portal.css';
import '../styles/App.css';

export default function App() {
  return (
    <WagmiConfig client={client}>
      <Navbar/>
      <About />
      <div style={{
        minHeight: '100vh',
      }}>
      <GridDisplay/>
      <NFTViewWrapper />
      </div>
    </WagmiConfig>
  );
}
