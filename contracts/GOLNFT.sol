// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "./interfaces/IGroth16Verifier.sol";
import "./interfaces/IRandom.sol";
import "./interfaces/IGOLSVG.sol";


contract GOLNFT is Ownable, ERC721Enumerable {
    uint256 immutable public W;
    uint256 immutable public H;
    uint256 immutable public EXPR;

    uint256 public prizenum;
    uint256 public lastPrizenumUpdate;

    IGroth16Verifier public verifier;
    IRandom public random;
    IGOLSVG public svg;

    mapping(uint256 => bool) public proofs;
    mapping(uint256 => uint256) public tokenId2prizenum;

    constructor(address _verifier, address _random, address _svg, uint256 _W, uint256 _H, uint256 _EXPR) ERC721("Game Of Life ZKNFT", "GOLZK") {
		verifier = IGroth16Verifier(_verifier);
        random = IRandom(_random);
        svg = IGOLSVG(_svg);

        W = _W;
        H = _H;
        EXPR = _EXPR;

        _updatePrizenum();
    }

	modifier tokenIdExists(uint256 tokenId) {
		require(_exists(tokenId), "GOLNFT: TokenID does not exist!");
		_;
	}
    
    modifier updatePrizenum() {
        _;
        _updatePrizenum();
    }

    function tokenURI(uint256 tokenId) public view override tokenIdExists(tokenId) returns (string memory) {
        return string.concat(
            "data:image/svg+xml;base64,",
            Base64.encode(
                bytes(svg.svg(tokenId, tokenId2prizenum[tokenId]))
            )
        );
    }
    
    function isExpired() public view returns (bool) {
        return block.timestamp - lastPrizenumUpdate >= EXPR;
    }

	function mint(
		uint256 solutionHash,
		uint256 hash,
		uint256[2] memory a,
		uint256[2][2] memory b,
		uint256[2] memory c
	) external updatePrizenum {
		require(!proofs[solutionHash], "GOLNFT: Solution already exists!");

		require(verifier.verifyProof(a, b, c, [
            solutionHash,
            hash,
            prizenum,
            uint256(uint160((msg.sender)))
        ]), "GOLNFT: Invalid proof");

        _golMint(msg.sender, solutionHash);
	}
    
    // available in case current prizenum doesn't have a solution
    function updateExpiredPrizenum() external updatePrizenum {
        require(isExpired(), "GOLNFT: Not Expired");
    }
    // for testing purposes only - renounce ownership after minting example nft
    function setPrizenum(uint256 _prizenum) external onlyOwner { prizenum = _prizenum; }

    function _golMint(address receiver, uint256 solutionHash) internal {
        uint256 tokenId = totalSupply();

        _safeMint(receiver, tokenId);
        proofs[solutionHash] = true;
        tokenId2prizenum[tokenId] = prizenum;
    }

    function _updatePrizenum() internal {
        prizenum = random.random(block.number) % (2 ** (W * H));
        lastPrizenumUpdate = block.timestamp;
    }
}
