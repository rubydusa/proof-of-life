// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IGOLSVG {
    function svg(uint256 n, uint256 data) external pure returns (bytes memory);
}