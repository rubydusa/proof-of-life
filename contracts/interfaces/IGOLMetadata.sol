// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IGOLMetadata {
    function metadata(uint256 n, string calldata imageData) external view returns (bytes memory);
}