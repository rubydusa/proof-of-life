import { useContractRead, useContractInfiniteReads, paginatedIndexesConfig } from 'wagmi';

import React, { useContext } from 'react'
import NFTViewElement from './NFTViewElement';
import { useState } from 'react';
import { BigNumber } from 'ethers';
import { GOLNFTContractConfig } from '../data/contractConfigs';

import GlobalContext from '../data/global';

import '../styles/NFTView.css';

const ViewOrder = {
  FIRST: 0,  // first to last
  LAST: 1,  // last to first
}

const ViewOwner = {
  ALL: 0, 
  USER: 1,
}

export default function NFTView() {
  const { PAGESIZE } = useContext(GlobalContext);
  const [viewOrder, setViewOrder] = useState(ViewOrder.FIRST);
  const [viewOwner, setViewOwner] = useState(ViewOwner.ALL);
  const [pageIndex, setPageIndex] = useState(0);
  
  const { data: totalSupply } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'totalSupply',
  });
  
  const /* { data: pagesData, fetchNextPage } */ allData = useContractInfiniteReads({
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
        start: viewOrder === ViewOrder.FIRST ? 0 : totalSupply.sub(1),
        perPage: PAGESIZE,
        direction: viewOrder === ViewOrder.FIRST ? 'increment' : 'decremenet',
      }
    )
  });
  const { data: pagesData, fetchNextPage, isFetching } = allData;
  
  const { pages } = pagesData;
  console.log(pages[pageIndex]);
  console.log(pages);
  if (pageIndex === pages.length - 1 && !isFetching) {
    fetchNextPage();
  }

  return (
    <div className="nft-view">
      <button 
        disabled={pages[pageIndex + 1] ? !validPage(pages[pageIndex + 1]) : true}
        onClick={() => {
          setPageIndex(currentIndex => currentIndex + 1);
        }}>
        Next Page
      </button>
      <button
        disabled={pageIndex === 0}
        onClick={() => {
          setPageIndex(currentIndex => currentIndex === 0 ? 0 : currentIndex - 1);
        }}>
        Previous Page
      </button>
      <div className="display-area">
        {
          pages[pageIndex] && pages[pageIndex].map(
            (data, i) => <NFTViewElement key={i} src={data}/>
          )
        }
      </div>
    </div>
  )
}

const validPage = (page) => {
  return page.some(el => el !== null);
}