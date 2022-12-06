import React, { useState, useContext } from 'react'
import useNFTView from '../hooks/useNFTView';
import NFTViewElement from './NFTViewElement';
import { ViewOrder, ViewOwner } from '../enums';

import GlobalContext from '../data/global';

import '../styles/NFTView.css';
import NFTViewElementModal from './NFTViewElementModal';

export default function NFTView({ address, totalSupply, addressBalance }) {
  const { PAGESIZE } = useContext(GlobalContext);
  const [viewOrder, setViewOrder] = useState(ViewOrder.LAST);
  const [viewOwner, setViewOwner] = useState(ViewOwner.USER);
  const [pageIndex, setPageIndex] = useState(0);
  const [modal, setModal] = useState(null);
  
  const { pages, fetchNextPage, isLoading, isError, error, isFetching, hasNextPage } = useNFTView({ 
    viewOrder, 
    viewOwner, 
    pageSize: PAGESIZE,
    viewOwnerAddress: address,
    totalSupply,
    addressBalance,
  });
  
  if (isError) {
    return (
      <div>
        An Error occured: {error}
      </div>
    )
  }
  else if (isLoading) {
    return (
      <div>
        Loading
      </div>
    )
  }
  
  // for some reason sometimes isFetching is true and isLoading and isError are false
  // but pages are still undefined, huh?
  if (!pages) {
    return (
      <div>
        Pages unavailable
      </div>
    )
  }
  
  if (hasNextPage && !isFetching && pageIndex === pages.length - 1) {
    fetchNextPage();
  }
  
  const onNFTViewElementClick = (src) => {
    console.log(modal);    
    setModal(src);
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
        }}
        disabled={viewOwner === ViewOwner.USER}>
        <option value={ViewOrder.FIRST}>First</option>
        <option value={ViewOrder.LAST}>Last</option>
      </select>
      <select 
        value={viewOwner} 
        onChange={(e) => {
          setViewOwner(parseInt(e.target.value));
          setPageIndex(0);
        }}>
        <option value={ViewOwner.ALL}>All</option>
        <option value={ViewOwner.USER}>Mine</option>
      </select>
      <div className='display-area'>
        {
          pages[pageIndex] && pages[pageIndex].map(
            (data, i) => <NFTViewElement key={i} src={data} onClick={onNFTViewElementClick}/>
          )
        }
      </div>
      {
        modal !== null && <NFTViewElementModal src={modal} close={() => setModal(null)}/>
      }
    </div>
  )
}
