import { useContractRead, useContractInfiniteReads, paginatedIndexesConfig } from 'wagmi';

import React from 'react'
import { useState } from 'react';

import '../styles/NFTView.css';

import deploymentData from '../data/deployment_data.json';
import GOLNFTABI from '../data/abi/GOLNFTABI.json';
import { BigNumber } from 'ethers';

const ViewOrder = {
  FIRST: 0,  // first to last
  LAST: 1,  // last to first
}

const ViewOwner = {
  ALL: 0, 
  USER: 1,
}

const PAGESIZE = 2;

const GOLNFTContractConfig = {
  address: deploymentData.contracts.golNFT.address,
  abi: GOLNFTABI,
};

export default function NFTView() {
  const [viewOrder, setViewOrder] = useState(ViewOrder.FIRST);
  const [viewOwner, setViewOwner] = useState(ViewOwner.ALL);
  
  const { data: totalSupply } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'totalSupply',
  })
  
  const nftViews = useContractInfiniteReads({
    cacheKey: 'nftViews',
    ...paginatedIndexesConfig(
      (index) => {
        return [
          {
            ...GOLNFTContractConfig,
            functionName: 'tokenURI',
            args: [BigNumber.from(index)], 
          }
        ]
      },
      { 
        start: viewOrder === ViewOrder.FIRST ? 0 : totalSupply.sub(1).toNumber(), 
        perPage: PAGESIZE,
        direction: viewOrder === ViewOrder.FIRST ? 'increment' : 'decrement',
      }
    )
  });

  return (
    <div className="nft-view">
    </div>
  )
}
