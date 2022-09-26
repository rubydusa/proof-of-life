include "../node_modules/circomlib/circuits/comparators.circom";
// constrains in to be a binary input
template GoL(W, H) {
	signal input in[W][H];
	signal wrap[W + 2][H + 2];
	signal output out[W][H];

	// "copy" content
	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			// constraint in to be binary
			in[x][y]*(in[x][y] - 1) === 0;
			wrap[x + 1][y + 1] <== in[x][y];
		}
	}

	// wrap sides
	for (var x = 0; x < W; x++) {
		wrap[x + 1][0] <== in[x][H - 1];
		wrap[x + 1][H + 1] <== in[x][0];
	}
	
	// wrap top and bottom
	for (var y = 0; y < H; y++) {
		wrap[0][y + 1] <== in[W - 1][y];
		wrap[W + 1][y + 1] <== in[0][y];
	}

	// wrap corners
	wrap[0][0] <== in[W - 1][H - 1];
	wrap[W + 1][0] <== in[0][H - 1];
	wrap[0][H + 1] <== in[W - 1][0];
	wrap[W + 1][H + 1] <== in[0][0];

	component is3s[W][H];
	component is4s[W][H];

	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			var sum = 0;
			// add neighbours
			sum += wrap[x][y];
			sum += wrap[x + 1][y];
			sum += wrap[x + 2][y];
			sum += wrap[x + 2][y + 1];
			sum += wrap[x + 2][y + 2];
			sum += wrap[x + 1][y + 2];
			sum += wrap[x][y + 2];
			sum += wrap[x][y + 1];

			// add self
			sum += wrap[x + 1][y + 1];

			is3s[x][y] = IsZero();
			is3s[x][y].in <== sum - 3;

			is4s[x][y] = IsZero();
			is4s[x][y].in <== sum - 4;

			out[x][y] <== is3s[x][y].out + in[x][y] * is4s[x][y].out;
		}
	}
}
