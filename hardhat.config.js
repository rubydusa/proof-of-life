require("./tasks.js");

module.exports = {
	solidity: "0.8.17",
	circom: {
		outDir: "artifacts/circom",  // relative to root path
		verifierOutDir: "verifiers",  // relative to sources path
		plonk: "circuits/powersOfTau28_hez_final_13.ptau",  // relative to root path
		options: "--r1cs --wasm",
		circuits: {
			"Gol4x4": {
				path: "circuits/gol.circom",  // relative to root path
				componentName: "GoL",
				publicSignals: [],
				args: [4, 4],
			}
		}
	}
};
