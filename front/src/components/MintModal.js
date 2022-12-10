import React from 'react';
import ReactDOM from 'react-dom';
import SVG from 'react-inlinesvg';

import { useContractRead } from 'wagmi';

import { BigNumber } from 'ethers';
import { GOLNFTContractConfig } from '../data/contractConfigs';

/*
 * Note: isError and error are not related to if the transaction reverted, but rather if the process of
 * waiting for the transaction itself had any failures
 */
export default function MintModal({ isSuccess, isError, receipt, error, close }) {
  const txSuccess = isSuccess && receipt.status === 1;

  const { data: src, isError: isURIError, isSuccess: isURISuccess } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'tokenURI',
    args: [txSuccess ? getTokenIdFromTransactionReceipt(receipt) : null],
    enabled: txSuccess,
  });

  console.log(getTokenIdFromTransactionReceipt(receipt));
  console.log(isURIError);
  console.log(isURISuccess);
  console.log(src);

  return ReactDOM.createPortal(
    <>
      <div className='portal-root'>
        <div className='portal-layout' style={{
          width: '60vw',
          height: '40vh',
          marginTop: '25vh',
        }}>
          <div className='portal-flex-overflow portal-button-menu' style={{
            flex: 1,
          }}>
            <button onClick={close}>
              Close
            </button>
          </div>
          <div className='portal-element-container portal-flex-overflow' style={{
            flex: 6, 
          }}>
            {
              !isSuccess && !isError &&
              <div>loading...</div>
            }
            {
              txSuccess 
                ? <SVG src={src} /> 
                : 'Transaction reverted!'
            }
            {
              isError &&
              <div>Error! {error}</div>
            }
          </div>
          </div>
        </div>
        <div className='portal-background'>
      </div>
    </>,
    document.getElementById('portal')
  );
}

const getTokenIdFromTransactionReceipt = (receipt) => {
  return BigNumber.from(receipt.logs[0].topics[3]);
}