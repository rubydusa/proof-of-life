// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract GOLRandom {
	function random(uint256 salt) external view returns (uint256) {
		return uint256(keccak256(abi.encodePacked(block.timestamp)));
	}
}