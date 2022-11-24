import React from 'react'
import SVG from 'react-inlinesvg';

export default function NFTViewElement({src}) {
  return (
    <>
    { src !== null ? <SVG src={src} /> : <div></div>}
    </>
  )
}
