require("./tasks.js");

module.exports = {
	solidity: "0.8.17",
	circom: {
		outDir: "artifacts/circom",  // relative to root path
		verifierOutDir: "verifiers",  // relative to sources path
		plonk: "circuits/powersOfTau28_hez_final_13.ptau",  // relative to root path
		options: "--r1cs --wasm",
		circuits: {
			"CreateBitMatrix4x4": {
				version: "2.0.8",
				path: "circuits/bitMatrix.circom",
				componentName: "CreateBitMatrix",
				publicSignals: [],
				args: [4, 4],
			},
			"DeconstructBitMatrix4x4": {
				version: "2.0.8",
				path: "circuits/bitMatrix.circom",
				componentName: "DeconstructBitMatrix",
				publicSignals: [],
				args: [4, 4],
			},
		}
	}
};
