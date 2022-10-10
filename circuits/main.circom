pragma circom 2.0.8;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

include "./bitMatrix.circom";
include "./goln.circom";

template Main(n, W, H) {
	// amount of signals needed to represent the board
	var k = ((W * H) \ 254) + 1;
	signal input address; // public
	signal input data[k]; // private
	
	signal output solutionHash;
	signal output hash;
	signal output out[k];

	// hash
	component solutionHasher = Poseidon(k);
	component hasher = Poseidon(2);
	for (var i = 0; i < k; i++) {
		solutionHasher.inputs[i] <== data[i];
	}
	hasher.inputs[0] <== solutionHasher.out;
	hasher.inputs[1] <== address;

	solutionHash <== solutionHasher.out;
	hash <== hasher.out;

	// convert data to bit matrix
	component dataMatrix = CreateBitMatrix(W, H);
	for (var i = 0; i < k; i++) {
		dataMatrix.in[i] <== data[i];
	}

	// run game of life
	component goln = GoLN(n, W, H);
	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			goln.in[x][y] <== dataMatrix.out[x][y];
		}
	}

	// deconstruct gol board to numbers
	component dataMatrixDeconstruction = DeconstructBitMatrix(W, H);
	for (var x = 0; x < W; x++) {
		for (var y = 0; y < H; y++) {
			dataMatrixDeconstruction.in[x][y] <== goln.out[x][y];
		}
	}

	for (var i = 0; i < k; i++) {
		out[i] <== dataMatrixDeconstruction.out[i];
	}
}
