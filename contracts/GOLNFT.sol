pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

interface IGroth16Verifier {
    function verifyProof(
		uint256[2] memory a,
		uint256[2][2] memory b,
		uint256[2] memory c,
		uint256[4] memory input
    ) external view returns (bool r);
}

contract GOLNFT is ERC721Enumerable {
    uint256 public prizenum; // 10088
    mapping(uint256 => bool) public proofs;

    IGroth16Verifier public verifier;

    constructor(uint256 _prizenum, address _verifier) ERC721("Game Of Life ZKNFT", "GOLZK") {
        prizenum = _prizenum;
		verifier = IGroth16Verifier(_verifier);
    }

	function mint(
		uint256 solutionHash,
		uint256 hash,
		uint256[2] memory a,
		uint256[2][2] memory b,
		uint256[2] memory c
	) external {
		require(!proofs[solutionHash], "GOLNFT: Solution already exists!");

		require(verifier.verifyProof(a, b, c, [
            solutionHash,
            hash,
            prizenum,
            address2uint256(msg.sender)
        ]), "GOLNFT: Invalid proof");

		_safeMint(msg.sender, totalSupply());
		proofs[solutionHash] = true;
	}

    function address2uint256(address addr) public pure returns (uint256) {
        return uint256(uint160(addr));
    }
}

