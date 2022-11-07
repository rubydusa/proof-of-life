import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi';

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'usehooks-ts';

import { gridToNum } from '../game';

import { GOLNFTContractConfig } from '../data/contractConfigs';

const snarkjs = window.snarkjs;

export default function GridProofToolset({
  global,
  grid, 
  prizenum, 
  proofErrorMessage,
  setProofErrorMessage,
}) {
  const { address, isConnected } = useAccount();
  const [proofCalldata, setProofCalldata] = useState(null);

  const { config } = usePrepareContractWrite({
    ...GOLNFTContractConfig,
    functionName: 'mint',
    args: proofCalldata,
    enabled: proofCalldata !== null,
  });
  
  const { write: mint } = useContractWrite(config);
  
  /**
   * Compute calldata with a debounce of a second. 
   * Doesn't change state if invalid proof (aside from error message)
   * 
   * It's possible the useEffect has been called twice and two generateProofCalldata are running at the same time 
   */
  const debouncedGrid = useDebounce(grid, 1000);
  useEffect(() => {
    (async () => {
      const calldata = await generateProofCalldata({
        address,
        grid: debouncedGrid,
        prizenum,
        circutPath: global.CIRCUIT_PATH
      });
     
      calldata && setProofCalldata(calldata);
      setProofErrorMessage(calldata ? '' : 'Invalid proof');
    })();
  }, [address, debouncedGrid, prizenum, global.CIRCUIT_PATH, setProofErrorMessage]);

  return (
    <>
      {isConnected && 
      <div>
        <button 
          disabled={proofCalldata === null}
          onClick={mint}>
          Generate QuickProof
        </button> 
        <div>{proofErrorMessage}</div>
      </div>}
    </>
  )
}

const generateProofCalldata = async ({address, grid, prizenum, circutPath}) => {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      address,
      data: [gridToNum(grid).toString()],
    },
    `${circutPath}.wasm`,
    `${circutPath}.zkey`,
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
