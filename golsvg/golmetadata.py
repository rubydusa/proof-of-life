import json
from dataclasses import dataclass

@dataclass(frozen=True)
class Config:
    NAME_PREFIX: str
    DESCRIPTION: str
    
    @staticmethod
    def DEFAULT():
        return Config(
            "GOLNFT Number #",
            "Could you find a proof to life?"
        )

def frags(config: Config) -> tuple[str, str, str]:
    a = {
        "name": config.NAME_PREFIX
    }
    a = json.dumps(a)[:-2]
    b = {
        "description": config.DESCRIPTION,
        "external_url": ""
    }
    b = f"\", {json.dumps(b)[1:-2]}"
    c = {
        "image_data": ""
    }
    c = f"\", {json.dumps(c)[1:-2]}"

    return a, b, c
    
    # get rid of closing bracket and last quote

def get_contract_code(config: Config) -> str:
    a, b, c = frags(config)
    
    return f'''pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GOLMetadata is Ownable {{
    using Strings for uint256;
    
    string public externalUrl;

    constructor(string memory _externalUrl) {{
        externalUrl = _externalUrl;
    }}
    
    function setExternalUrl(string calldata _externalUrl) external onlyOwner {{
        externalUrl = _externalUrl;
    }}
    
    string constant METADATA_A = \'{a}\';
    string constant METADATA_B = \'{b}\';
    string constant METADATA_C = \'{c}\';

    function metadata(uint256 n, string calldata imageData) external view returns (bytes memory) {{
        return abi.encodePacked(
            METADATA_A,
            n.toString(),
            METADATA_B,
            externalUrl,
            METADATA_C,
            imageData,
            '"}}' 
        );
    }}
}}
'''

def main():
    config = Config.DEFAULT()
    with open("GOLMetadata.sol", "w") as f:
        f.write(get_contract_code(config))

if __name__ == "__main__":
    main()