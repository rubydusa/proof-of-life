
import { useContractInfiniteReads, paginatedIndexesConfig, useContractReads } from 'wagmi';

import { BigNumber } from 'ethers';
import { ViewOrder, ViewOwner } from '../enums';

import { GOLNFTContractConfig } from '../data/contractConfigs';

export default function useNFTView ({ viewOrder, viewOwner, pageSize, totalSupply, addressBalance, viewOwnerAddress }) {
  const pagesDataIncrement = useContractInfiniteReads({
    cacheKey: 'nftViewsIncrement',
    ...paginatedIndexesConfig(
      pagesDataTemplate,
      {
        start: 0,
        perPage: pageSize,
        direction: 'increment'
      }
    ),
    getNextPageParam: nftViewGetNextPageParam(pageSize)
  });

  const pagesDataDecrement = useContractInfiniteReads({
    cacheKey: 'nftViewsDecrement',
    ...paginatedIndexesConfig(
      pagesDataTemplate,
      {
        start: totalSupply.sub(1),
        perPage: pageSize,
        direction: 'decrement'
      }
    ),
    getNextPageParam: nftViewGetNextPageParam(pageSize)
  });

  const addressTokenIDs = useContractInfiniteReads({
    cacheKey: 'nftViewsTokenIDsDecrement',
    ...paginatedIndexesConfig(
      addressTokenIDsTemplate(viewOwnerAddress),
      {
        start: addressBalance.sub(1),
        perPage: pageSize,
        direction: 'decrement'
      }
    ),
    getNextPageParam: nftViewAddressTokenIdsGetNextPageParam(pageSize, addressBalance),
    enabled: viewOwner === ViewOwner.USER
  });

  // pages are flattened
  const userPagesData = useContractReads({
    contracts: addressTokenIDs.data
      ? addressTokenIDs.data.pages
        .map(pagesUserTemplate)
        .flat()
      : []
  });

  if (viewOwner === ViewOwner.ALL) {
    const { data, fetchNextPage, isLoading, isError, error, isFetching, hasNextPage } =
      viewOrder === ViewOrder.FIRST
        ? pagesDataIncrement
        : pagesDataDecrement;

    const pages = data !== undefined ? formatPages(data.pages) : undefined;

    return { pages, fetchNextPage, isLoading, isError, error, isFetching, hasNextPage };
  } else {
    // view order doesn't matter when ViewOwner === USER
    // ERC721Enumerable doesn't perserve order
    // I choose decrement enumeration because more likely to show recent relavent mints
    const { fetchNextPage, isLoading, isError, error, isFetching, hasNextPage } = addressTokenIDs;
    const { data } = userPagesData;

    // chunkify
    // no queries to tokenID owner so need to inject it manually
    // formatPages is technically not neccessarry but done to ensure consistent API
    const pages = data !== undefined
      ? formatPages(
        chunkify(data, pageSize) // construct pages
          .map(page => { // capsule each dataURI with an address
            return page.map(dataURI => [dataURI, viewOwnerAddress]);
          })
          .map(page => page.flat()) // deconstruct capsule: [[1, 2], [3, 4]] => [1, 2, 3, 4]
      )
      : undefined;

    return { pages, fetchNextPage, isLoading, isError, error, isFetching, hasNextPage };
  }
}

const nftViewGetNextPageParam = (pageSize) => (lastPage, allPages) => {
  // god fucking dammit wagmi why can't you bundle queries together
  return lastPage.every(el => el !== null) && lastPage.length / 2 === pageSize ? allPages.length : undefined;
};

const nftViewAddressTokenIdsGetNextPageParam = (pageSize, addressBalance) => (lastPage, allPages) => {
  // UGHHHHHHH stupid fucking bug - page sizes are inconsistent across user modes
  // full page size of USER mode: 2, full page size of ALL mode: 4
  // const expectedNextPageParam = nftViewGetNextPageParam(pageSize)(lastPage, allPages);
  const expectedNextPageParam = lastPage.every(el => el !== null) && lastPage.length === pageSize ? allPages.length : undefined;

  if (expectedNextPageParam !== undefined) {
    return allPages.length * pageSize < addressBalance.toNumber()
      ? expectedNextPageParam
      : undefined;
  }

  return undefined;
};

const pagesDataTemplate = (index) => {
  return [
    {
      ...GOLNFTContractConfig,
      functionName: 'tokenURI',
      args: [BigNumber.from(index)]
    },
    {
      ...GOLNFTContractConfig,
      functionName: 'ownerOf',
      args: [BigNumber.from(index)]
    }
  ];
};

const addressTokenIDsTemplate = (viewOwnerAddress) => (index) => {
  return [
    {
      ...GOLNFTContractConfig,
      functionName: 'tokenOfOwnerByIndex',
      args: [viewOwnerAddress, BigNumber.from(index)]
    }
  ];
};

const pagesUserTemplate = (page) => {
  return page.map(tokenId => {
    return {
      ...GOLNFTContractConfig,
      functionName: 'tokenURI',
      args: [tokenId]
    };
  });
};

/*
pages pre-formatted:
[dataURI, address, dataURI, address, dataURI, address, ...]
pages post-format:
[{content: dataURI, address}, ...]

this is because of the useContractInfiniteReads API, which doesn't capsule
multiple contact calls by default
*/
const formatPages = (pages) => {
  return pages.map(page => {
    return chunkify(page, 2)
      .map(([dataURI, address]) => {
        return {
          content: dataURI,
          address
        };
      });
  });
};

const chunkify = (data, pageSize) => {
  return data.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / pageSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
};
