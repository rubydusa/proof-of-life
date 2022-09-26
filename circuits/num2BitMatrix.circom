template Num2BitMatrix(W, H) {
	signal input in;
	signal output out[W][H];

	signal arr[W * H];
	component num2Bits = Num2Bits(W * H);
	num2Bits.in <== in;
	
	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			out[x][y] <== num2Bits.out[x + y * W];
		}
	}
}

