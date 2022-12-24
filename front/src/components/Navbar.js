import React from 'react'
import ConnectWallet from './ConnectWallet';
import ToggleTheme from './ToggleTheme';

import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <div className='navbar'>
      <ConnectWallet />
      <ToggleTheme />
    </div>
  )
}
