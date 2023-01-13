import React from 'react';
import dataURIParse from '../dataURIParse';

export default function NFTViewElement({data, onClick, forceNonce}) {
  const { content } = data;

  return (
    <>
    { 
    content !== null 
      ? <div
          className='nft-view-regular-element-container'>
          <div 
            className='invisible-cover'
            onClick={() => onClick(data)}>
          </div>
          <iframe 
            key={forceNonce}
            src={dataURIParse(content)["image_data"]}
            title="none"/>
        </div>
      : <div></div>
    }
    </>
  )
}
