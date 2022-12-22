import { useContractRead } from 'wagmi';

import React, { useState, useContext, useRef } from 'react'
import Grid from './Grid';
import GridInputToolset from './GridInputToolset';
import GridProofToolset from './GridProofToolset';

import { emptyGrid, flipCell, numToGrid } from '../game';

import GlobalContext from '../data/global';
import { GOLNFTContractConfig } from '../data/contractConfigs';

import '../styles/GridDisplay.css';
import GridInputAdvancedToolset from './GridInputAdvancedToolset';

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
      <div className='user-advanced-section' style={{
        flex: 1,
      }}>
        <GridInputAdvancedToolset />
      </div>
      <div className='user-grid-section' style={{
        flex: 2,
      }}>
        <GridInputToolset 
          grid={grid}
          gridInput={gridInput}
          setGrid={(v) => setGrid(v)}
          setGridInput={(v) => setGridInput(v)}
          flush={flush}/>
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
        <GridProofToolset
          grid={grid}
          prizenum={prizenum}
          ref={proofToolsetRef}/>
      </div>
      <div className='prizenum-grid-section' style={{
        flex: 2,
      }}>
        <div className='prizenum-grid-section-grid-container'>
          <div className='square-perserve'>
            <Grid
              grid={prizenum ? numToGrid(prizenum, GRID_SETTINGS) : emptyGrid(GRID_SETTINGS)}
              rowCount={ROW_COUNT}
              colCount={COL_COUNT}
              onClickHandler={() => {}}/>
          </div>
        </div>
      </div>
    </div>
  )
}
