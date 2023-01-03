// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

library WeightedBitsPRNG {
	struct MemoryUint256 {
		uint256 state;
	}

	uint256 private constant MAX_INT = 2**256 - 1; 
	
	/*
	 * return a uint256 where the probabilty of a bit being 1 is p / 2 ** d
	 * 
	 * prng must be seeded first
	 * assumes p / 2 ** d is an irreducible fraction
	 * d = 0 and d = 1 act the same
	 */
	function weightedBits(MemoryUint256 memory prng, uint256 p, uint256 d) internal pure returns (uint256 result) {
		assembly {
			result := MAX_INT

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