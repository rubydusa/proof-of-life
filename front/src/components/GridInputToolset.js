import React, { useContext } from 'react'

import { runSimulationStep, numToGrid, gridToNum } from '../game'

import GlobalContext from '../data/global'

export default function GridInputToolset({grid, gridInput, setGrid, setGridInput}) {
  const { GRID_SETTINGS } = useContext(GlobalContext);

  return (
    <div>
      <button
        onClick={() => setGrid(() => runSimulationStep(grid))}>
        NextState
      </button>
      <button onClick={() => setGrid(numToGrid(gridInput, GRID_SETTINGS))}>
        Load
      </button>
      <button onClick={() => setGridInput(gridToNum(grid))}>
        Save
      </button>
      <input
        type="text"
        value={gridInput}
        onChange={(e) => setGridInput(e.target.value)}/>
    </div>
  )
}
