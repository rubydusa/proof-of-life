pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

interface IRandom {
    function random(uint256 salt) external view returns (uint256);
}

interface IGroth16Verifier {
    function verifyProof(
		uint256[2] memory a,
		uint256[2][2] memory b,
		uint256[2] memory c,
		uint256[4] memory input
    ) external view returns (bool r);
}

contract GOLNFT is ERC721Enumerable {
    uint256 immutable public W;
    uint256 immutable public H;
    uint256 immutable public EXPR;

    uint256 public prizenum;
    uint256 public lastPrizenumUpdate;

    IGroth16Verifier public verifier;
    IRandom public random;

    mapping(uint256 => bool) public proofs;
    mapping(uint256 => uint256) public tokenId2prizenum;

    constructor(address _verifier, address _random, uint256 _W, uint256 _H, uint256 _EXPR) ERC721("Game Of Life ZKNFT", "GOLZK") {
		verifier = IGroth16Verifier(_verifier);
        random = IRandom(_random);

        W = _W;
        H = _H;
        EXPR = _EXPR;

        _updatePrizenum();
    }

    modifier updatePrizenum() {
        _;
        if (block.timestamp - lastPrizenumUpdate >= EXPR) {
            _updatePrizenum();
        }
    }

	function mint(
		uint256 solutionHash,
		uint256 hash,
		uint256[2] memory a,
		uint256[2][2] memory b,
		uint256[2] memory c
	) external updatePrizenum() {
		require(!proofs[solutionHash], "GOLNFT: Solution already exists!");

		require(verifier.verifyProof(a, b, c, [
            solutionHash,
            hash,
            prizenum,
            uint256(uint160((msg.sender)))
        ]), "GOLNFT: Invalid proof");

        _golMint(msg.sender, solutionHash);
	}

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
