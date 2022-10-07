pragma circom 2.0.8;

include "../node_modules/circomlib/circuits/comparators.circom";

// indecise
function izs(x, n) {
	return x + 1 == 0 ? n - 1 : x % n;
}

template GoL(W, H) {
	signal input in[W][H];
	signal output out[W][H];

	component is2s[W][H];
	component is3s[W][H];

	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			var sum = 0;
			var x0 = izs(x - 1, W);
			var x1 = izs(x, W);
			var x2 = izs(x + 1, W);
			var y0 = izs(y - 1, H);
			var y1 = izs(y, H);
			var y2 = izs(y + 1, H);

			sum += in[x0][y0];
			sum += in[x0][y1];
			sum += in[x0][y2];

			sum += in[x1][y0];
			sum += in[x1][y2];

			sum += in[x2][y0];
			sum += in[x2][y1];
			sum += in[x2][y2];

			is2s[x][y] = IsZero();
			is2s[x][y].in <== sum - 2;

			is3s[x][y] = IsZero();
			is3s[x][y].in <== sum - 3;

			out[x][y] <== is3s[x][y].out + is2s[x][y].out * in[x][y];
		}
	}
}
