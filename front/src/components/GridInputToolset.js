import React from 'react'

import { runSimulationStep, numToGrid, gridToNum } from '../game'

export default function GridInputToolset({global, grid, gridInput, setGrid, setGridInput}) {
  return (
    <div>
      <button
        onClick={() => setGrid(() => runSimulationStep(grid))}>
        NextState
      </button>
      <button onClick={() => setGrid(numToGrid(gridInput, global.GRID_SETTINGS))}>
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
