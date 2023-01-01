import React from 'react';

export default function NFTViewElement({data, onClick, forceNonce}) {
  const { content } = data;

  return (
    <>
    { 
    content !== null 
      ? <div
          className='nft-view-regular-element-container'>
          <div 
            className='nft-view-invisible-cover'
            onClick={() => onClick(data)}>
          </div>
          <iframe 
            key={forceNonce}
            src={content}
            title="none"/>
        </div>
      : <div></div>
    }
    </>
  )
}
