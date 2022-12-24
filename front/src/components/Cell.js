import React from 'react'

export default function Cell({x, y, state, onClickHandler}) {
  return (
    <div
    onClick={() => onClickHandler({x, y, state})}
    style={{
      backgroundColor: state ? 'var(--black)' : 'var(--extra-white)',
      border: '2px solid var(--black)',
    }}>
    </div>
  )
}
