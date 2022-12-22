import React, { useContext } from 'react'

import { numToGrid, gridToNum } from '../game'

import GlobalContext from '../data/global'

export default function GridInputAdvancedToolset({grid, gridInput, setGridInput, flush, prizenum}) {
  const { GRID_SETTINGS } = useContext(GlobalContext);
  return (
    <div className='grid-input-advanced-toolset'>
      <h2>
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
        margin: '0px',
      }}>
        {grid ? gridToNum(grid).toString() : 'Grid Not Available'}
      </h4>
      <div className='advanced-input-label'>
        Target Number:
      </div>
      <h4 style={{
        margin: '0px',
      }}>
        {prizenum ? prizenum.toString() : 'Target Not Available'}
      </h4>
    </div>
  )
}
