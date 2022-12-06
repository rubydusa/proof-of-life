import React from 'react';
import ReactDOM from 'react-dom';
import SVG from 'react-inlinesvg';

export default function NFTViewElementModal({src, close}) {
  return ReactDOM.createPortal(
    <>
    { 
      src !== null 
        ? <>
            <div className='portal-root'>
              <div className='portal-layout'>
                <div className='portal-flex-overflow' style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-start',
                  flex: 1,
                }}>
                  <button onClick={close}>
                    Close
                  </button>
                </div>
                <div className='portal-element-container portal-flex-overflow' style={{
                  flex: 12,
                }}>
                  <SVG src={src} />
                </div>
                <p className='portal-flex-overflow' style={{
                  flex: 6,
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
