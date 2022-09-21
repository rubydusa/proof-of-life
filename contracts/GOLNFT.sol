pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
}

contract GOLNFT is ERC721Enumerable {
    IPlonkVerifier public verifier;
    mapping(uint256 => bool) public proofs;

    constructor(address _verifier) ERC721("Game Of Life ZKNFT", "GOLZK") {
        verifier = IPlonkVerifier(_verifier);
    }

    function mint(bytes calldata proof, uint256 solutionHash) external {
        require(!proofs[solutionHash], "GOLZK: Proof already submitted");

        uint256[] memory pubSignals = new uint256[](2);
        pubSignals[0] = solutionHash;
        pubSignals[1] = uint256(uint160(msg.sender));
        require(verifier.verifyProof(proof, pubSignals), "GOLZK: Invalid proof (Did you try to steal someone else's proof?)");

        _safeMint(msg.sender, totalSupply());

        proofs[solutionHash] = true;
    }
}
