import React from 'react';
import ReactDOM from 'react-dom';
import SVG from 'react-inlinesvg';

export default function NFTViewElementModal({src}) {
  return ReactDOM.createPortal(
    <>
    { 
      src !== null 
        ? <>
            <div className='portal-root'>
              <div className='portal-element-container'>
                <SVG src={src} />
              </div>
            </div> 
            <div className='portal-background'>
            </div>
          </>
        : <div></div>
    }
    </>,
    document.getElementById('portal')
  )
}
