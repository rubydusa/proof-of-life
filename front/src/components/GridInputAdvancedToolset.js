import React, { useContext } from 'react'

import { numToGrid, gridToNum } from '../game'

import GlobalContext from '../data/global'

export default function GridInputAdvancedToolset({grid, gridInput, setGridInput, flush}) {
  const { GRID_SETTINGS } = useContext(GlobalContext);
  return (
    <div>
      <button 
        className='btn'
        onClick={() => flush(numToGrid(gridInput, GRID_SETTINGS))}>
        Load
      </button>
      <button 
        className='btn'
        onClick={() => setGridInput(gridToNum(grid))}>
        Save
      </button>
      <input
        type="text"
        value={gridInput}
        onChange={(e) => setGridInput(e.target.value)}/>
    </div>
  )
}
