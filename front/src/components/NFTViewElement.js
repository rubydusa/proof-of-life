import React from 'react';
import SVG from 'react-inlinesvg';

export default function NFTViewElement({data, onClick}) {
  const { content } = data;
  return (
    <>
    { 
    content !== null 
      ? <div
          className='regular-element-container'
          onClick={() => onClick(data)}>
          <SVG src={content} />
        </div>
      : <div></div>
    }
    </>
  )
}
