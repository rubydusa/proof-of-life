pragma solidity ^0.8.0;

// FOR TESTING PURPOSES ONLY
contract Random {
	uint256 public val;

	function random(uint256 salt) external view returns (uint256) {
		return val;
	}

	function setVal(uint256 _val) external {
		val = _val;
	}
}
