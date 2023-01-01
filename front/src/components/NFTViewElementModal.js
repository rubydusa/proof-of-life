import React from 'react';
import ReactDOM from 'react-dom';
import { useForceUpdate } from '../hooks';

export default function NFTViewElementModal({data, close}) {
  const {content, address} = data;
  const [forceNonce, forceUpdate] = useForceUpdate();

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
                  <button class='btn' onClick={forceUpdate}>
                    Refresh
                  </button>
                </div>
                <div className='portal-element-container portal-flex-overflow' style={{
                  flex: 12,
                }}>
                  <iframe 
                    key={forceNonce}
                    src={content}
                    title="none"
                    width="100%"
                    height="100%"/>
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
