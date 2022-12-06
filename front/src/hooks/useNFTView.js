
import { useContractInfiniteReads, paginatedIndexesConfig, useContractReads } from "wagmi";

import { BigNumber } from 'ethers';
import { ViewOrder, ViewOwner } from "../enums";

import { GOLNFTContractConfig } from "../data/contractConfigs";

export default function useNFTView({viewOrder, viewOwner, pageSize, totalSupply, addressBalance, viewOwnerAddress}) {
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

  const addressTokenIDs = useContractInfiniteReads({
    cacheKey: 'nftViewsTokenIDsDecrement',
    ...paginatedIndexesConfig(
      (index) => {
        return [
          {
            ...GOLNFTContractConfig,
            functionName: 'tokenOfOwnerByIndex',
            args: [viewOwnerAddress, BigNumber.from(index)], 
          }
        ]
      },
      { 
        start: addressBalance.sub(1),
        perPage: pageSize,
        direction: 'decrement',
      }
    ),
    getNextPageParam: nftViewAddressTokenIdsGetNextPageParam(pageSize),
    enabled: viewOwner === ViewOwner.USER
  });

  // pages are flattened 
  const userPagesData = useContractReads({
    contracts: addressTokenIDs.data
    ? addressTokenIDs.data.pages
      .map(page => {
        return page.map(tokenId => {
          return {
            ...GOLNFTContractConfig,
            functionName: 'tokenURI',
            args: [tokenId]
          }
        })
      })
      .flat()
    : []
  });

  if (viewOwner === ViewOwner.ALL) {
    const { data, fetchNextPage, isLoading, isError, error, isFetching, hasNextPage } = 
      viewOrder === ViewOrder.FIRST
        ? pagesDataIncrement 
        : pagesDataDecrement; 
    
    const pages = data !== undefined ? data.pages : undefined;
    
    return { pages, fetchNextPage, isLoading, isError, error, isFetching, hasNextPage };
  } 
  else {
    // view order doesn't matter when ViewOwner === USER
    // ERC721Enumerable doesn't perserve order
    // I choose decrement enumeration because more likely to show recent relavent mints
    const { fetchNextPage, isLoading, isError, error, isFetching, hasNextPage} = addressTokenIDs;
    const { data } = userPagesData;
    
    // chunkify 
    const pages = data !== undefined 
      ? data.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / pageSize)

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] // start a new chunk
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
      }, []) 
      : undefined;
    
    return { pages, fetchNextPage, isLoading, isError, error, isFetching, hasNextPage };
  }
}

const nftViewGetNextPageParam = (pageSize) => (lastPage, allPages) => {
  return lastPage.every(el => el !== null) && lastPage.length === pageSize ? allPages.length : undefined;
}

const nftViewAddressTokenIdsGetNextPageParam = (pageSize, addressBalance) => (lastPage, allPages) => {
  const expectedNextPageParam = nftViewGetNextPageParam(pageSize)(lastPage, allPages);

  if (expectedNextPageParam !== undefined) {
    return allPages.length * pageSize < addressBalance 
      ? expectedNextPageParam
      : undefined;
  }
  
  return undefined;
}