// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IGroth16Verifier {
    function verifyProof(
		uint256[2] memory a,
		uint256[2][2] memory b,
		uint256[2] memory c,
		uint256[4] memory input
    ) external view returns (bool r);
}