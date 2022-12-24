import React from 'react';
import SVG from 'react-inlinesvg';

import '../styles/About.css';

export default function About() {
  return (
    <div className='about'>
        <div>
            <h1>
                Proof of Life: Zero-Knowledge-Proof Implementation of <br/>
                Conway's Game of Life
            </h1>
            <h2>
                How it works
            </h2>
            <p className='about-text-section-paragraph'>
                Your goal is to find a board configuration that preceeds the <b>Target Board</b> by 3 generations.<br/>
                Once found, generate a Zero-Knowledge proof of your <b>Solution</b>, and get a corresponding NFT!<br/><br/>
                The puzzle has an expiration period of 10 minutes, after which any solution will reset it and the target board
            </p>
            <h2>
                Why Zero-Knowledge
            </h2>
            <p className='about-text-section-paragraph'>                
                With Zero-Knowledge, You can prevent frontrunning by making the proofs depend on the sender address. <br/>
                Also, it eliminates the need for on-chain validation that can cost a lot of gas. <br/><br/>
                Your solutions remain private the entire time
            </p>
            <h2>
                Caveats
            </h2>
            <p className='about-text-section-paragraph'>
                Not all Target Boards have Solutions, and sometimes all possible solutions have already been found. <br/>
                I've added a function to the Smart Contract that allows anyone to reset the challenge after the expiration period ends. <br/><br/>
                <a href='https://goerli.etherscan.io/address/0xcf69f8f5b1c3d0828e16733fd804ff34e60f62f2'>
                    NFT Contract on block explorer
                </a>
            </p>
        </div>
        <SVG src='gol.svg'/>
    </div>
  )
}
