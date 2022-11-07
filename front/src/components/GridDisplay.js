import { useContractRead } from 'wagmi';

import React from 'react'
import { useState } from 'react';
import { BigNumber } from 'ethers';
import Grid from './Grid';
import GridInputToolset from './GridInputToolset';
import GridProofToolset from './GridProofToolset';

import { emptyGrid, flipCell, gridToNum, numToGrid } from '../game';

import { GOLNFTContractConfig } from '../data/contractConfigs';

import '../styles/GridDisplay.css';

export default function GridDisplay({global}) {
  const { data: prizenum, error, isError, isLoading } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'prizenum',
  });

  const [grid, setGrid] = useState(() => emptyGrid(global.GRID_SETTINGS));
  const [gridInput, setGridInput] = useState('0');
  const [proofErrorMessage, setProofErrorMessage] = useState('');
  
  return (
    <div className='grid-display'>
      <GridInputToolset 
        global={global}
        grid={grid}
        gridInput={gridInput}
        setGrid={(v) => setGrid(v)}
        setGridInput={(v) => setGridInput(v)}/>
      <GridProofToolset
        global={global}
        grid={grid}
        prizenum={prizenum}
        proofErrorMessage={proofErrorMessage}
        setProofErrorMessage={(v) => setProofErrorMessage(v)}/>
      <div className='user-grid'>
        <Grid 
          grid={grid} 
          rowCount={global.ROW_COUNT} 
          colCount={global.COL_COUNT}
          onClickHandler={({x, y}) => {
            setGrid(() => flipCell(grid, x, y))
          }}/>
      </div>
      <div>
        Grid Number: {gridToNum(grid).toString()}
      </div>
      <div className='prizenum-grid'>
        <Grid
          grid={prizenum ? numToGrid(prizenum, global.GRID_SETTINGS) : BigNumber.from("0")}
          rowCount={global.ROW_COUNT}
          colCount={global.COL_COUNT}
          onClickHandler={() => {}}/>
      </div>
      {
        prizenum ? <div>
          Grid Number: {prizenum.toString()}
        </div>
        : isLoading ? <div>
          Please wait, loading
        </div>
        : isError ? <div>
          An error occured: {error}
        </div>
        : <div>
          Something went terribly wrong
        </div>
      }
    </div>
  )
}
