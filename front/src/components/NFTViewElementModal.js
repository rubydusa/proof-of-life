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
                <div className='portal-button-menu' style={{
                  flex: 1,
                }}>
                  <button class='btn' onClick={close}>
                    Close
                  </button>
                </div>
                <div className='portal-element-container portal-flex-overflow' style={{
                  flex: 12,
                }}>
                  <SVG src={content} />
                </div>
                <div className='portal-flex-overflow' style={{
                  flex: 6,
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  marginTop: '24px',
                }}>
                  Owner Address: <b>{address}</b>
                </div>
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
