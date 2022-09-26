include "./gol.circom";

// n is amount of iterations
template GoLN(n, W, H) {
	signal input in[W][H];
	signal output out[W][H];
	
	component states[n];
	for (var i = 0; i < n; i++) {
		states[i] = GoL(W, H);

		if (i == 0) {
			for (var x = 0; x < W; x++) {
				for (var y = 0; y < H; y++) {
					states[i].in[x][y] <== in[x][y];
				}
			}
		}
		else {
			for (var x = 0; x < W; x++) {
				for (var y = 0; y < H; y++) {
					states[i].in[x][y] <== states[i - 1].out[x][y];
				}
			}
		}

		if (i == n - 1) {
			for (var x = 0; x < W; x++) {
				for (var y = 0; y < H; y++) {
					out[x][y] <== states[i].out[x][y];
				}
			}
		}
	}
}


