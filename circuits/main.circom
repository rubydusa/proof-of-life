pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

// specific solution to game of life
template Solution() {
	signal input in[4][4];

	in[0][0] === 0;
	in[0][1] === 1;
	in[0][2] === 0;
	in[0][3] === 0;
	in[1][0] === 1;
	in[1][1] === 0;
	in[1][2] === 1;
	in[1][3] === 1;
	in[2][0] === 0;
	in[2][1] === 1;
	in[2][2] === 0;
	in[2][3] === 0;
	in[3][0] === 0;
	in[3][1] === 1;
	in[3][2] === 0;
	in[3][3] === 0;
}

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

// can handle board sizes up to 254 cells
template Main(n, W, H) {
	signal input address; // public
	signal input data; // private
	
	signal output solutionHash;

	component solutionHasher = Poseidon(1);
	solutionHasher.inputs[0] <== data;

	solutionHash <== solutionHasher.out;

	// constraint hash
	component lrHasher = Poseidon(2);
	lrHasher.inputs[0] <== address;
	lrHasher.inputs[1] <== data;

	// convert data to bit matrix
	component dataMatrix = Num2BitMatrix(W, H);
	dataMatrix.in <== data;

	component goln = GoLN(n, W, H);
	component sol = Solution();
	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			goln.in[x][y] <== dataMatrix.out[x][y];
		}
	}

	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			sol.in[x][y] <== goln.out[x][y];
		}
	}
}

component main {public [address]} = Main(2, 4, 4);
