
import { useContractRead, useContractInfiniteReads, paginatedIndexesConfig } from "wagmi";

import { BigNumber } from 'ethers';
import { ViewOrder, ViewOwner } from "../enums";

import { GOLNFTContractConfig } from "../data/contractConfigs";

export default function useNFTView({viewOrder, viewOwner, pageSize}) {
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
        perPage: pageSize,
        direction: 'increment',
      }
    ),
    getNextPageParam: nftViewGetNextPageParam(pageSize)
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
        perPage: pageSize,
        direction: 'decrement',
      }
    ),
    getNextPageParam: nftViewGetNextPageParam(pageSize)
  });
  
  const { data, fetchNextPage, isFetching, hasNextPage } = 
    viewOrder === ViewOrder.FIRST
      ? pagesDataIncrement 
      : pagesDataDecrement; 
  
  const pages = data !== undefined ? data.pages : undefined;
  
  return { pages, fetchNextPage, isFetching, hasNextPage };
}

const nftViewGetNextPageParam = (pageSize) => (lastPage, allPages) => {
  return lastPage.every(el => el !== null) && lastPage.length === pageSize ? allPages.length : undefined;
}