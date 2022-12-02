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
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '30vw',
                height: '80vh',
                marginTop: '6vh',
                padding: '2vw',
                backgroundColor: 'white',
                borderRadius: '10px',
              }}>
                <div className='portal-element-container' style={{
                  flex: 2,
                  display: 'flex',
                  overflow: 'auto',
                }}>
                  <SVG src={src} />
                </div>
                <p style={{
                  flex: 1,
                  display: 'flex',
                  overflow: 'auto',
                }}>
                  Occaecat cupidatat cupidatat nostrud pariatur id culpa ad dolore sit non magna. Qui consectetur est irure dolor aute aliqua. Consequat exercitation duis in veniam exercitation. Amet ipsum esse dolore excepteur labore amet exercitation pariatur sunt sint. Non cupidatat voluptate minim in reprehenderit est voluptate. Pariatur veniam pariatur et do est. 
                </p>
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
