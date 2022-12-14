require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("./tasks.js");

require("dotenv").config();

module.exports = {
	networks: {
		hardhat: {
		},
		goerli: {
			url: "https://rpc.ankr.com/eth_goerli",
			accounts: [process.env.DEPLOYER_KEY]
		}
	},
	solidity: {
		compilers: [
			{
				version: "0.8.17",
			},
			{
				version: "0.6.11",
			},
		],
	},
	circom: {
		outDir: "artifacts/circom",  // relative to root path
		verifierOutDir: "verifiers",  // relative to sources path

		phase1: "circuits/powersOfTau28_hez_final_13.ptau",  // relative to root path
		options: "--r1cs --wasm",
		circuits: {
			"CreateBitMatrix4x4": {
				protocol: "plonk",
				version: "2.0.8",
				path: "circuits/bitMatrix.circom",
				componentName: "CreateBitMatrix",
				publicSignals: [],
				args: [4, 4],
			},
			"DeconstructBitMatrix4x4": {
				protocol: "plonk",
				version: "2.0.8",
				path: "circuits/bitMatrix.circom",
				componentName: "DeconstructBitMatrix",
				publicSignals: [],
				args: [4, 4],
			},
			"CreateBitMatrix6x4": {
				protocol: "plonk",
				version: "2.0.8",
				path: "circuits/bitMatrix.circom",
				componentName: "CreateBitMatrix",
				publicSignals: [],
				args: [6, 4],
			},
			"DeconstructBitMatrix6x4": {
				protocol: "plonk",
				version: "2.0.8",
				path: "circuits/bitMatrix.circom",
				componentName: "DeconstructBitMatrix",
				publicSignals: [],
				args: [6, 4],
			},
			"Gol4x4": {
				protocol: "groth16",
				beacon: "0000000000000000000000000000000000000000000000000000000000000000",
				version: "2.0.8",
				path: "circuits/gol.circom",
				componentName: "GoL",
				publicSignals: [],
				args: [4, 4],
			},
			"Gol3N4x4": {
				protocol: "groth16",
				beacon: "0000000000000000000000000000000000000000000000000000000000000000",
				version: "2.0.8",
				path: "circuits/goln.circom",
				componentName: "GoLN",
				publicSignals: [],
				args: [3, 4, 4],
			},
			"Main4x4": {
				protocol: "groth16",
				beacon: "0000000000000000000000000000000000000000000000000000000000000000",
				version: "2.0.8",
				path: "circuits/main.circom",
				componentName: "Main",
				publicSignals: ["address"],
				args: [1, 4, 4],
			},
			"Main16x16": {
				protocol: "groth16",
				beacon: "0000000000000000000000000000000000000000000000000000000000000000",
				version: "2.0.8",
				path: "circuits/main.circom",
				componentName: "Main",
				publicSignals: ["address"],
				args: [1, 16, 16],
			},
			"Main3N8x8": {
				protocol: "groth16",
				beacon: "0000000000000000000000000000000000000000000000000000000000000000",
				version: "2.0.8",
				path: "circuits/main.circom",
				componentName: "Main",
				publicSignals: ["address"],
				args: [3, 8, 8],
			},
		}
	}
};
