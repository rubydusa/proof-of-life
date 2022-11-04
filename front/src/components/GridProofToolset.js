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
  
  const { write: mint } = useContractWrite(config);

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
  
  /**
   * For some reason the encoding of a, b, and c in proof is really messed up
   * so you need to convert it to solidity calldata format and then extract a, b, and c
   */
  const resultGridNum = publicSignals[2];
  const solidityCalldata = JSON.parse(`[${await snarkjs.groth16.exportSolidityCallData(proof, publicSignals)}]`);
  const solidityCalldataArgs = [
    publicSignals[0],  
    publicSignals[1], 
    ...solidityCalldata.slice(0,3),
  ]

  return prizenum.eq(resultGridNum) ? solidityCalldataArgs : null; 
} 
