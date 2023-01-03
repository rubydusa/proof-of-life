// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

library WeightedBitsPRNG {
	struct MemoryUint256 {
		uint256 state;
	}

	/*
	 * returns weighted probabilty bits with distribution p / 2 ** d
	 * d == 0 acts like d == 1, returning 1 / 2 distribution
	 * p == 0 acts like p == 1, returning 1 / 2 ** d
	 * 
	 * assumptions:
	 * - prng is seeded
	 * - p / 2 ** d is irreducable and less than one
	 */
	function weightedBits(MemoryUint256 memory prng, uint256 p, uint256 d) internal pure returns (uint256 result) {
		assembly {
			result := keccak256(prng, 0x20)
			mstore(prng, result)

			for { let i := 1 } lt(i, d) { i := add(i, 1) } {
				let rnd := keccak256(prng, 0x20)
				mstore(prng, rnd)

				let i_bit := and(shr(p, i), 1)

				let w_and := and(result, rnd)
				let w_or := or(result, rnd)
				// need to check if if statement is less gas
				result := add(mul(i_bit, w_or), mul(iszero(i_bit), w_and))
			}
		}
	} 
}