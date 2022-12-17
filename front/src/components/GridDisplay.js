import { useContractRead } from 'wagmi';

import React, { useState, useContext, useRef } from 'react'
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
      <div className='user-grid-section'>
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
        <div className='user-grid-section-grid-container'>
          <div className='square-perserve'>
            <Grid 
              grid={grid} 
              rowCount={ROW_COUNT} 
              colCount={COL_COUNT}
              onClickHandler={({x, y}) => {
                setGrid(() => flipCell(grid, x, y))
              }}/>
          </div>
        </div>
      </div>
      <div className='prizenum-grid-section'>
        <div className='square-perserve'>
          <Grid
            grid={prizenum ? numToGrid(prizenum, GRID_SETTINGS) : emptyGrid(GRID_SETTINGS)}
            rowCount={ROW_COUNT}
            colCount={COL_COUNT}
            onClickHandler={() => {}}/>
        </div>
      </div>
    </div>
  )
}
