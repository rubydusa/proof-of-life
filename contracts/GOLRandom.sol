// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./interfaces/IRandom.sol";
import "./WeightedBits.sol";

contract GOLRandom is IRandom {
    // probabilty is P / (2 ** D)
    // except for P = 0, where it's like P = 1
    // and except for D = 0, where it's 1 / 2
    // and also assumes P / (2 ** D) is an irreducible fraction
    uint256 immutable public P;
    uint256 immutable public D;

    constructor (uint256 _P, uint256 _D) {
        P = _P;
        D = _D;
    }

    function random(uint256 salt) external view returns (uint256) {
        WeightedBits.MemoryUint256 memory prng;
        prng.state = salt;

        return WeightedBits._weightedBits(prng, P, D);
    }
}