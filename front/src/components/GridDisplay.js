import { useContractRead } from 'wagmi';

import React from 'react'
import { useState } from 'react';

import Grid from './Grid';
import '../styles/GridDisplay.css';

import { emptyGrid, flipCell, gridToNum, numToGrid } from '../game';

import deploymentData from '../data/deployment_data.json';
import { ROW_COUNT, COL_COUNT, GRID_SETTINGS } from '../data/global';
import GOLNFTABI from '../data/abi/GOLNFTABI.json';

export default function GridDisplay() {
  const { data: prizenum } = useContractRead({
    address: deploymentData.contracts.golNFT.address,
    abi: GOLNFTABI,
    functionName: 'prizenum',
  });

  const [grid, setGrid] = useState(() => emptyGrid(GRID_SETTINGS));

  return (
    <div className='grid-display'>
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
