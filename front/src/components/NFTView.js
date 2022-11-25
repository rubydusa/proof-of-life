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
  const [viewOrder, setViewOrder] = useState(ViewOrder.LAST);
  const [viewOwner, setViewOwner] = useState(ViewOwner.ALL);
  const [pageIndex, setPageIndex] = useState(0);
  
  const { data: totalSupply } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'totalSupply',
  });
  
  const pagesDataIncrement = useContractInfiniteReads({
    cacheKey: 'nftViewsIncrement',
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
    ),
    getNextPageParam: nftViewGetNextPageParam
  });

  const pagesDataDecrement = useContractInfiniteReads({
    cacheKey: 'nftViewsDecrement',
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
        start: totalSupply.sub(1),
        perPage: PAGESIZE,
        direction: 'decrement',
      }
    ),
    getNextPageParam: nftViewGetNextPageParam
  });

  const { pages, fetchNextPage, isFetching, hasNextPage } = getPages({
    pagesDataIncrement,
    pagesDataDecrement,
    viewOrder
  });

  if (hasNextPage && !isFetching && pageIndex === pages.length - 1) {
    fetchNextPage();
  }
  else if (isFetching) {
    return <div className='nft-view'>Pages unavailable right now</div>
  }
  
  return (
    <div className='nft-view'>
      <button 
        disabled={pageIndex === pages.length - 1}
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
      <select 
        value={viewOrder} 
        onChange={(e) => {
          setViewOrder(parseInt(e.target.value));
          setPageIndex(0);
        }}>
        <option value={ViewOrder.FIRST}>First</option>
        <option value={ViewOrder.LAST}>Last</option>
      </select>
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

const getPages = ({ pagesDataIncrement, pagesDataDecrement, viewOrder }) => {
  const { data, fetchNextPage, isFetching, hasNextPage } = 
    viewOrder === ViewOrder.FIRST
      ? pagesDataIncrement 
      : pagesDataDecrement; 
  
  const pages = data !== undefined ? data.pages : undefined;
  
  return { pages, fetchNextPage, isFetching, hasNextPage };
}

const nftViewGetNextPageParam = (lastPage, allPages) => {
  return lastPage.every(el => el !== null) ? allPages.length : undefined;
}