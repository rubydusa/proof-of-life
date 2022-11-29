import { useAccount, useContractRead } from 'wagmi'
import React from 'react'

import { GOLNFTContractConfig } from '../data/contractConfigs';
import NFTView from './NFTView';

// this is a hacky way to make sure the pagination starts with a valid address and totalSupply
// I should have used services instead of this shitty react library... :(
export default function NFTViewWrapper() {
  const { address, isConnected } = useAccount();
  const { data: totalSupply, isSuccess: isTotalSupplySuccess } = useContractRead({
    ...GOLNFTContractConfig,
    functionName: 'totalSupply',
  });

  const { data: addressBalance, isSuccess: isAddressBalanceSucess } = useContractRead({
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
  else if (!isTotalSupplySuccess || !isAddressBalanceSucess) {
    return (
      <div>
        <p>
          Please be patient
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
