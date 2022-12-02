import React from 'react';
import SVG from 'react-inlinesvg';

export default function NFTViewElement({src, onClick}) {
  return (
    <>
    { 
    src !== null 
      ? <div
          className='regular-element-container'
          onClick={() => onClick(src)}>
          <SVG src={src} />
        </div>
      : <div></div>
    }
    </>
  )
}
