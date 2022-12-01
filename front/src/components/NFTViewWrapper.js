import { useAccount, useContractRead } from 'wagmi'
import React from 'react'

import { GOLNFTContractConfig } from '../data/contractConfigs';
import NFTView from './NFTView';
import { Status } from '../enums';

// this is a hacky way to make sure the pagination starts with a valid address and totalSupply
// I should have used services instead of this shitty react library... :(
export default function NFTViewWrapper() {
  const { address, isConnected } = useAccount();
  const { data: totalSupply, status: totalSupplyStatus } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'totalSupply',
  });

  const { data: addressBalance, status: addressBalanceStatus } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'balanceOf',
    args: [address],
    enabled: isConnected
  });

  if (!isConnected) {
    return (
      <div>
        <p>
          Please connect your wallet
        </p>
      </div>
    )
  }
  else if (totalSupplyStatus === Status.ERROR || addressBalanceStatus === Status.ERROR) {
    return (
      <div>
        An error occured
      </div>
    )
  }
  else if (totalSupplyStatus === Status.LOADING || addressBalanceStatus === Status.LOADING) {
    return (
      <div>
        <p>
          Loading...
        </p>
      </div>
    )
  }
  return (
    <div>
      <NFTView address={address} totalSupply={totalSupply} addressBalance={addressBalance}></NFTView>
    </div>
  )
}
