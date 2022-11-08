import { useContractRead } from 'wagmi';

import React, { useState, useContext, useRef } from 'react'
import { BigNumber } from 'ethers';
import Grid from './Grid';
import GridInputToolset from './GridInputToolset';
import GridProofToolset from './GridProofToolset';

import { emptyGrid, flipCell, gridToNum, numToGrid } from '../game';

import GlobalContext from '../data/global';
import { GOLNFTContractConfig } from '../data/contractConfigs';

import '../styles/GridDisplay.css';

export default function GridDisplay() {
  const { ROW_COUNT, COL_COUNT, GRID_SETTINGS } = useContext(GlobalContext);
  const { data: prizenum, error, isError, isLoading } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'prizenum',
  });

  const [grid, setGrid] = useState(() => emptyGrid(GRID_SETTINGS));
  const [gridInput, setGridInput] = useState('0');
  const proofToolsetRef = useRef();
  
  const flush = (value) => {
    proofToolsetRef.current.flush(value);
    setGrid(value);
  }
  
  return (
    <div className='grid-display'>
      <GridInputToolset 
        grid={grid}
        gridInput={gridInput}
        setGrid={(v) => setGrid(v)}
        setGridInput={(v) => setGridInput(v)}
        flush={flush}/>
      <GridProofToolset
        grid={grid}
        prizenum={prizenum}
        ref={proofToolsetRef}/>
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
          grid={prizenum ? numToGrid(prizenum, GRID_SETTINGS) : BigNumber.from("0")}
          rowCount={ROW_COUNT}
          colCount={COL_COUNT}
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
