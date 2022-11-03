import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi';

import React from 'react'
import { useState } from 'react';

import { gridToNum } from '../game';

import { GOLNFTContractConfig } from '../data/contractConfigs';
import { CIRCUIT_PATH } from '../data/global';

const snarkjs = window.snarkjs;

export default function GridProofToolset({
  grid, 
  prizenum, 
  proofErrorMessage,
  setProofErrorMessage,
}) {
  const [proofCalldata, setProofCalldata] = useState(() => [0, 0, [0, 0], [[0, 0], [0, 0]], [0, 0]]);

  const { address, isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    ...GOLNFTContractConfig,
    functionName: 'mint',
    args: proofCalldata,
  });
  
  const { data, isLoading, isSuccess, write: mint } = useContractWrite(config);

  return (
    <>
      {isConnected && 
      <div>
        <button onClick={
          async () => {
            const calldata = await generateProofCalldata({
              address,
              grid,
              prizenum,
            });
            
            setProofErrorMessage(
              calldata === null ? 'Invalid proof' : ''
            );

            calldata && setProofCalldata(calldata);
            mint();
          }
        }>
          Generate QuickProof
        </button> 
        <div>{proofErrorMessage}</div>
      </div>}
    </>
  )
}

const generateProofCalldata = async ({address, grid, prizenum}) => {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      address,
      data: [gridToNum(grid).toString()],
    },
    `${CIRCUIT_PATH}.wasm`,
    `${CIRCUIT_PATH}.zkey`,
  );
  
  const resultGridNum = publicSignals[2];
  const abc = [
    proof.pi_a.slice(0, -1),
    proof.pi_b.slice(0, -1),
    proof.pi_c.slice(0, -1),
  ]
  return prizenum.eq(resultGridNum) ? [ publicSignals[0], publicSignals[1], ...abc] : null; 
} 