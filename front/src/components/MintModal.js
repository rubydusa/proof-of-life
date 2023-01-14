import React from 'react';
import ReactDOM from 'react-dom';
import SVG from 'react-inlinesvg';

import { useContractRead } from 'wagmi';

import { BigNumber } from 'ethers';
import { GOLNFTContractConfig } from '../data/contractConfigs';

import XSVGIcon from './ButtonIcons/XSVGIcon';
import LoadingSVGIcon from './AnimatedIcons/LoadingSVGIcon';

import dataURIParse from '../dataURIParse';

/*
 * Note: isError and error are not related to if the transaction reverted, but rather if the process of
 * waiting for the transaction itself had any failures
 */
export default function MintModal({ isSuccess, isError, receipt, error, close }) {
  const txSuccess = isSuccess && receipt.status === 1;
  const isLoading = !isSuccess && !isError;

  const { data: src } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'tokenURI',
    args: [txSuccess ? getTokenIdFromTransactionReceipt(receipt) : null],
    enabled: txSuccess
  });

  return ReactDOM.createPortal(
    <>
      <div className='portal-root'>
        <div className='portal-layout' style={{
          width: '60vw',
          height: '40vh',
          marginTop: '25vh'
        }}>
          <div className='portal-flex-overflow portal-button-menu' style={{
            flex: 1
          }}>
            <button className='btn' onClick={close}>
              <XSVGIcon/>
            </button>
          </div>
          {txSuccess && <div className='portal-flex-overflow' style={{
            flex: 1,
            fontWeight: 'bold'
          }}>
            Congratulations!
          </div>}
          <div className='portal-element-container portal-flex-overflow' style={{
            flex: 6
          }}>
            {
              isError
                ? <div>Error! {error}</div>
                : isLoading
                  ? <div><LoadingSVGIcon/></div>
                  : txSuccess && !!src
                    ? <SVG src={dataURIParse(src).image_data} />
                    : 'Transaction reverted!'
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
};
