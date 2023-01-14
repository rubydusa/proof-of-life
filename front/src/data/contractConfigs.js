import deploymentData from './deployment_data.json';
import GOLNFTABI from './abi/GOLNFTABI.json';

const GOLNFTContractConfig = {
  address: deploymentData.contracts.golNFT.address,
  abi: GOLNFTABI
};

export { GOLNFTContractConfig };
