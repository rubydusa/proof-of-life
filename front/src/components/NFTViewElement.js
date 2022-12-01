import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import SVG from 'react-inlinesvg';

export default function NFTViewElement({src}) {
  const [clicked, setClicked] = useState(false);

  if (!clicked) {
    return (
      <>
      { 
      src !== null 
        ? <div
            className='regular-element-container'
            onClick={() => setClicked(true)}>
            <SVG src={src} />
          </div>
        : <div></div>
      }
      </>
    )
  }
  else {
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
}
