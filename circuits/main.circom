pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

include "./solution.circom";
include "./num2BitMatrix.circom";
include "./goln.circom";

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
component main {public []} = Main(2, 4, 4);
