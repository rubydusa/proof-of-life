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
            style={{
              display: 'flex',
            }}
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'fixed',
                  width: '100%',
                  height: '100%',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '1000',
                }}>
                <div
                  style={{
                    display: 'flex',
                    padding: '100px'
                  }}>
                  <SVG src={src} />
                </div>
              </div> 
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, .7)',
              }}>
              </div>
            </>
          : <div></div>
      }
      </>,
      document.getElementById('portal')
    )
  }
}
