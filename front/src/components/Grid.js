import React from 'react'
import Cell from './Cell';

export default function Grid({grid, rowCount, colCount, onClickHandler}) {
  return (
    <div style={{
        display: 'grid',
        width: '100%',
        height: '100%',
        gridTemplateRows: `repeat(${rowCount}, 1fr)`,
        gridTemplateColumns: `repeat(${colCount}, 1fr)`,
      }}>
          {grid.map((row, y) => row.map((col, x) => {
            return <Cell key={`${x}-${y}`} x={x} y={y} state={grid[y][x]} onClickHandler={onClickHandler}/>
          }))}
    </div>
  )
}
