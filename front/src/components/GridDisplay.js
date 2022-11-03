import { useContractRead } from 'wagmi';

import React from 'react'
import { useState } from 'react';
import Grid from './Grid';
import GridInputToolset from './GridInputToolset';
import GridProofToolset from './GridProofToolset';

import { emptyGrid, flipCell, gridToNum, numToGrid } from '../game';

import { GOLNFTContractConfig } from '../data/contractConfigs';
import { ROW_COUNT, COL_COUNT, GRID_SETTINGS } from '../data/global';

import '../styles/GridDisplay.css';

export default function GridDisplay() {
  const { data: prizenum } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'prizenum',
  });

  const [grid, setGrid] = useState(() => emptyGrid(GRID_SETTINGS));
  const [gridInput, setGridInput] = useState('0');
  const [proofErrorMessage, setProofErrorMessage] = useState('');

  return (
    <div className='grid-display'>
      <GridInputToolset 
        grid={grid}
        gridInput={gridInput}
        setGrid={(v) => setGrid(v)}
        setGridInput={(v) => setGridInput(v)}/>
      <GridProofToolset
        grid={grid}
        prizenum={prizenum}
        proofErrorMessage={proofErrorMessage}
        setProofErrorMessage={(v) => setProofErrorMessage(v)}/>
      <div className='user-grid'>
        <Grid 
          grid={grid} 
          rowCount={ROW_COUNT} 
          colCount={COL_COUNT}
          onClickHandler={({x, y}) => {
            setGrid(() => flipCell(grid, x, y))
          }}/>
      </div>
      <div>
        Grid Number: {gridToNum(grid).toString()}
      </div>
      <div className='prizenum-grid'>
        <Grid
          grid={numToGrid(prizenum, GRID_SETTINGS)}
          rowCount={ROW_COUNT}
          colCount={COL_COUNT}
          onClickHandler={() => {}}/>
      </div>
      <div>
        Grid Number: {prizenum.toString()}
      </div>
    </div>
  )
}
