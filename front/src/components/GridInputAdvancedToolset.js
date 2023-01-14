import React, { useContext, useReducer } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { numToGrid, gridToNum } from '../game';

import GlobalContext from '../data/global';
import { GOLNFTContractConfig } from '../data/contractConfigs';

export default function GridInputAdvancedToolset({ grid, gridInput, setGridInput, flush, prizenum }) {
  const { GRID_SETTINGS } = useContext(GlobalContext);
  const { config: newChallengeConfig } = usePrepareContractWrite({
    ...GOLNFTContractConfig,
    functionName: 'updateExpiredPrizenum'
  });

  const { write: generateNewChallenge } = useContractWrite(newChallengeConfig);
  const [hasGeneratedNewChallenge, setHasGeneratedNewChallenge] = useReducer(() => true, false);

  return (
    <div className='grid-input-advanced-toolset'>
      <h2 style={{
        textAlign: 'center',
        padding: '0px 2px'
      }}>
        Advanced Toolset
      </h2>
      <button
        className='btn'
        style={{
          width: '80%'
        }}
        onClick={() => flush(numToGrid(gridInput, GRID_SETTINGS))}>
        Load
      </button>
      <button
        className='btn'
        style={{
          width: '80%'
        }}
        onClick={() => setGridInput(gridToNum(grid))}>
        Save
      </button>
      <div className='advanced-input-label'>
        Grid Number:
      </div>
      <input
        className='advanced-input-text-input'
        type="text"
        value={gridInput}
        placeholder={'Grid Number'}
        onChange={(e) => setGridInput(e.target.value)}/>
      <div className='advanced-input-label'>
        Current Number:
      </div>
      <h4 style={{
        margin: '0px'
      }}>
        {grid ? gridToNum(grid).toString() : 'Grid Not Available'}
      </h4>
      <div className='advanced-input-label'>
        Target Number:
      </div>
      <h4 style={{
        margin: '0px'
      }}>
        {prizenum ? prizenum.toString() : 'Target Not Available'}
      </h4>
      <button
        disabled={!generateNewChallenge || hasGeneratedNewChallenge}
        className='btn'
        onClick={() => {
          generateNewChallenge();
          setHasGeneratedNewChallenge();
        }}>
        New Challenge
      </button>
      <div className='advanced-input-label'>
        {hasGeneratedNewChallenge && 'After transacting please wait for confirmation from your wallet and restart the page'}
      </div>
    </div>
  );
}
