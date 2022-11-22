import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi';

import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from 'react';
import { useDebounce } from '../hooks';

import { gridToNum } from '../game';

import { GOLNFTContractConfig } from '../data/contractConfigs';
import GlobalContext from '../data/global';

const snarkjs = window.snarkjs;

export default forwardRef(function GridProofToolset({
  grid, 
  prizenum, 
}, ref) {
  const { CIRCUIT_PATH, EXCEPTIONS } = useContext(GlobalContext);
  const { address, isConnected } = useAccount();
  const [proofCalldata, setProofCalldata] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { config } = usePrepareContractWrite({
    ...GOLNFTContractConfig,
    functionName: 'mint',
    args: proofCalldata,
    enabled: proofCalldata !== null,
    onError(error) {
      if (error.reason === EXCEPTIONS.SOLUTION_ALREADY_EXISTS) {
        setErrorMessage("Solution already exists");
      }
      else {
        setErrorMessage("Something went terribly wrong...");
      }
    }
  });
  
  const { write: mint } = useContractWrite(config);
  
  /**
   * Compute calldata with a debounce of a second. 
   * Doesn't change state if invalid proof (aside from error message)
   * 
   * It's possible the useEffect has been called twice and two generateProofCalldata are running at the same time 
   */
  const [debouncedGrid, flush] = useDebounce(grid, 500);
  useEffect(() => {
    (async () => {
      setIsGenerating(true);
      const calldata = await generateProofCalldata({
        address,
        grid: debouncedGrid,
        prizenum,
        circutPath: CIRCUIT_PATH
      });
      setIsGenerating(false);
     
      calldata && setProofCalldata(calldata);
    })();
  }, [address, debouncedGrid, prizenum, CIRCUIT_PATH]);
  
  /**
   * Disable clicking on submit proof button during debounce period
   */
  useEffect(() => {
    setProofCalldata(null);
    setErrorMessage("");
  }, [grid])
  
  /**
   * Enable parents to call flush
   */
  useImperativeHandle(ref, () => ({
    flush
  }));

  return (
    <>
      {isConnected && 
      <div>
        <button 
          disabled={!mint}
          onClick={mint}>
          Generate QuickProof
        </button> 
        <p style={{height: "48px"}}>
          {isGenerating && "Generating proof..."}
          {errorMessage}
        </p>
      </div>}
    </>
  )
})

const generateProofCalldata = async ({address, grid, prizenum, circutPath}) => {
  if (!address) {
    return null;
  }

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
