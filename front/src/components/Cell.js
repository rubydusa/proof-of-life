import React from 'react'

export default function Cell({x, y, state, onClickHandler}) {
  return (
    <div
    onClick={() => onClickHandler({x, y, state})}
    style={{
        backgroundColor: state ? "black" : undefined,
        border: "1px solid black"
    }}>
    </div>
  )
}
