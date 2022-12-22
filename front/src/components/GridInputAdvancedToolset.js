import React, { useContext } from 'react'

import { numToGrid, gridToNum } from '../game'

import GlobalContext from '../data/global'

export default function GridInputAdvancedToolset({grid, gridInput, setGridInput, flush}) {
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
      <div style={{
        width: '100%',
        fontSize: '16px',
        paddingLeft: '12px',
        boxSizing: 'border-box',
      }}>
        Grid Number:
      </div>
      <input
        type="text"
        style={{
          border: '2px solid var(--gray)',
          borderRadius: '0.5em',
          outline: 'none',
          padding: '8px',
          boxSizing: 'border-box',
        }}
        value={gridInput}
        placeholder={'Grid Number'}
        onChange={(e) => setGridInput(e.target.value)}/>
    </div>
  )
}
