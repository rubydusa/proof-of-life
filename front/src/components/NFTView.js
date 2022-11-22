import { useContractRead, useContractInfiniteReads, paginatedIndexesConfig } from 'wagmi';

import React from 'react'
import SVG from 'react-inlinesvg';
import { useState } from 'react';
import { BigNumber } from 'ethers';
import { GOLNFTContractConfig } from '../data/contractConfigs';

import '../styles/NFTView.css';

const ViewOrder = {
  FIRST: 0,  // first to last
  LAST: 1,  // last to first
}

const ViewOwner = {
  ALL: 0, 
  USER: 1,
}

const PAGESIZE = 2;

export default function NFTView() {
  const [viewOrder, setViewOrder] = useState(ViewOrder.FIRST);
  const [viewOwner, setViewOwner] = useState(ViewOwner.ALL);
  const [pageIndex, setPageIndex] = useState(0);
  
  const { data: totalSupply } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'totalSupply',
  })
  
  const { data: pagesData } = useContractInfiniteReads({
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
        start: 0,
        perPage: PAGESIZE,
        direction: 'increment',
      }
    )
  });

  return (
    <div className="nft-view">
      {
        pagesData.pages[pageIndex].map(
          (data, i) => <SVG key={i} src={data} width={128} height="auto" />
        )
      }
    </div>
  )
}
