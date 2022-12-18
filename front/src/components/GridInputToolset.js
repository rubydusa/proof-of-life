import React, { useContext, useEffect, useRef } from 'react'

import { runSimulationStep, numToGrid, gridToNum } from '../game'

import GlobalContext from '../data/global'

export default function GridInputToolset({grid, gridInput, setGrid, setGridInput, flush}) {
  const { GRID_SETTINGS } = useContext(GlobalContext);
  const history = useRef([]);
  const forwardHistory = useRef([]);
  
  useEffect(() => {
    if (history.current[history.current.length - 1] !== grid) {
      history.current.push(grid);
    }
  }, [grid]);

  return (
    <div>
      <button
        className='btn'
        onClick={() => flush(runSimulationStep(grid))}>
        Next State
      </button>
      <button
        className='btn'
        onClick={() => {
          if (history.current.length >= 2) {
            const curr = history.current.pop();
            const prev = history.current.pop();
            forwardHistory.current.push(curr);
            setGrid(prev);
          } 
        }}>
        Back
      </button>
      <button
        className='btn'
        onClick={() => {
          if (forwardHistory.current.length >= 1) {
            setGrid(forwardHistory.current.pop());
          }
        }}>
        Forward
      </button>
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
