import React, { useEffect, useRef } from 'react'

import { runSimulationStep } from '../game'

export default function GridInputToolset({grid, setGrid, flush}) {
  const history = useRef([]);
  const forwardHistory = useRef([]);
  
  useEffect(() => {
    if (history.current[history.current.length - 1] !== grid) {
      history.current.push(grid);
    }
  }, [grid]);

  return (
    <div className='grid-input-toolset'>
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
    </div>
  )
}
