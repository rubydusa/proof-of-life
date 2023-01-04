
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IRandom {
    function random(uint256 salt) external view returns (uint256);
}