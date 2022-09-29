pragma circom 2.0.8;

include "../node_modules/circomlib/circuits/bitify.circom";

// supports multiple inputs
template CreateBitMatrix(W, H) {
	// amount of signals needed to represent the board
	var k = ((W * H) \ 254) + 1;
	// remainder
	var s = (W * H) % 254;

	signal input in[k];
	signal output out[W][H];

	component nums2Bits[k];
	for (var i = 0; i < k; i++) {
		var size = i == k - 1 || k == 1 ? s : 254;
		nums2Bits[i] = Num2Bits(size);
		nums2Bits[i].in <== in[i];
	}

	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			var rawIndex = x + y * W;
			var i = rawIndex % 254;
			var bitsIndex = rawIndex \ 254;

			out[x][y] <== nums2Bits[bitsIndex].out[i];
		}
	}
}

template DeconstructBitMatrix(W, H) {
	// amount of signals needed to represent the board
	var k = ((W * H) \ 254) + 1;
	// remainder
	var s = (W * H) % 254;

	signal input in[W][H];
	signal output out[k];

	component bits2Nums[k];
	for (var i = 0; i < k; i++) {
		var size = i == k - 1 ? s : 254;
		bits2Nums[i] <== Bits2Num(size);
	}

	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			var rawIndex = x + y * W;
			var i = rawIndex % 254;
			var bitsIndex = rawIndex \ 254;
			
			bits2Nums[bitsIndex].in[i] <== in[x][y];
		}
	}

	for (var i = 0; i < k; i++) {
		out[i] <== bits2Nums[i].out;
	}
}
