import React from 'react';
import ReactDOM from 'react-dom';
import { useForceUpdate } from '../hooks';

import XSVGIcon from './ButtonIcons/XSVGIcon';
import PlaySVGIcon from './ButtonIcons/PlaySVGIcon';

import dataURIParse from '../dataURIParse';

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
                  <button className='btn' onClick={close}>
                    <XSVGIcon/> 
                  </button>
                  <button className='btn' onClick={forceUpdate}>
                    <PlaySVGIcon/>
                  </button>
                </div>
                <div className='portal-element-container portal-flex-overflow' style={{
                  flex: 12,
                }}>
                  <iframe 
                    key={forceNonce}
                    src={dataURIParse(content)["image_data"]}
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
