import React from 'react'

export default function About() {
  return (
    <div style={{
        boxSizing: 'border-box',
        marginTop: '2em',
        minHeight: '100vh',
        padding: '0px 5vw',
    }}>
        <h1>
            Proof of Life: Zero-Knowledge-Proof Implementation of <br/>
            Conway's Game of Life
        </h1>
        <h2>
            How it works
        </h2>
        <p style={{
            fontSize: '24px',
        }}>
            Your goal is to find a board configuration that preceeds the <b>Target Board</b> by 3 generations.<br/>
            Once found, generate a Zero-Knowledge proof of your <b>Solution</b>, and get a corresponding NFT!<br/><br/>
            The puzzle has an expiration period of 10 minutes, after which any solution will reset it and the target board
        </p>
        <h2>
            Why Zero-Knowledge
        </h2>
        <p style={{
            fontSize: '24px',
        }}>
            With Zero-Knowledge, You can prevent frontrunning by making the proofs depend on the sender address. <br/>
            Also, it eliminates the need for on-chain validation that can cost a lot of gas. <br/><br/>
            Your solutions remain private the entire time
        </p>
        <h2>
            Caveats
        </h2>
        <p style={{
            fontSize: '24px',
        }}>
            Not all Target Boards have Solutions, and sometimes all possible solutions have already been found. <br/>
            I've added a function to the Smart Contract that allows anyone to reset the challenge after the expiration period ends
        </p>
    </div>
  )
}
