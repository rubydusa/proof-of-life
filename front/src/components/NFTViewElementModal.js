import React from 'react';
import ReactDOM from 'react-dom';
import SVG from 'react-inlinesvg';

export default function NFTViewElementModal({data, close}) {
  const {content, address} = data;
  return ReactDOM.createPortal(
    <>
    { 
      content !== null 
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
                  <SVG src={content} />
                </div>
                <p className='portal-flex-overflow' style={{
                  flex: 6,
                }}>
                  owner address: {address}
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
