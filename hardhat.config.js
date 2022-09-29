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
				path: "circuits/bitMatrix.circom",
				componentName: "CreateBitMatrix",
				publicSignals: [],
				args: [4, 4],
			},
			"Gol4x4": {
				path: "circuits/gol.circom",
				componentName: "GoL",
				publicSignals: [],
				args: [4, 4],
			},
			"GolN4x4": {
				path: "circuits/goln.circom",
				componentName: "GoLN",
				publicSignals: [],
				args: [2, 4, 4],
			},
			"Main4x4": {
				path: "circuits/main.circom",
				componentName: "Main",
				publicSignals: [],
				args: [2, 4, 4],
			},
		}
	}
};
