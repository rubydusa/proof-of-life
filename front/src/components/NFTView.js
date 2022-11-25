import React, { useState, useContext } from 'react'
import useNFTView from '../hooks/useNFTView';
import NFTViewElement from './NFTViewElement';
import { ViewOrder, ViewOwner } from '../enums';

import GlobalContext from '../data/global';

import '../styles/NFTView.css';

export default function NFTView() {
  const { PAGESIZE } = useContext(GlobalContext);
  const [viewOrder, setViewOrder] = useState(ViewOrder.LAST);
  const [viewOwner, setViewOwner] = useState(ViewOwner.ALL);
  const [pageIndex, setPageIndex] = useState(0);
  
  const { pages, fetchNextPage, isFetching, hasNextPage } = useNFTView({ 
    viewOrder, 
    ViewOwner, 
    pageSize: PAGESIZE 
  });
  
  console.log(pages);

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
