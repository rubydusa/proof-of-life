pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IGOLMetadata.sol";

contract GOLMetadata is IGOLMetadata, Ownable {
    using Strings for uint256;
    
    string public externalUrl;

    constructor(string memory _externalUrl) {
        externalUrl = _externalUrl;
    }
    
    function setExternalUrl(string calldata _externalUrl) external onlyOwner {
        externalUrl = _externalUrl;
    }
    
    string constant METADATA_A = '{"name": "GOLNFT Number #';
    string constant METADATA_B = '", "description": "Could you find a proof to life?", "external_url": "';
    string constant METADATA_C = '", "image_data": "';

    function metadata(uint256 n, string calldata imageData) external view returns (bytes memory) {
        return abi.encodePacked(
            METADATA_A,
            n.toString(),
            METADATA_B,
            externalUrl,
            METADATA_C,
            imageData,
            '"}' 
        );
    }
}
