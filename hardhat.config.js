const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const snarkjs = require("snarkjs");

const { TASK_COMPILE } = require("hardhat/builtin-tasks/task-names");
const TASK_CIRCOM = "circom-compile";

module.exports = {
	solidity: "0.8.17",
	circom: {
		outDir: "artifacts/circom",  // relative to root path
		verifierOutDir: "verifiers",  // relative to sources path
		plonk: "circuits/powersOfTau28_hez_final_13.ptau",  // relative to root path
		options: "--r1cs --wasm",
		circuits: {
			"Gol4x4": {
				path: "circuits/gol.circom",
				componentName: "GoL",
				publicSignals: [],
				args: [4, 4],
			}
		}
	}
};

/*
 * Tasks
 */

task(TASK_CIRCOM, "Compiles all circuits in circuits directory")
	.setAction(async (_args, hre, _runSuper) => {
		const circomConfig = hre.userConfig.circom;
		const { root, sources } = hre.config.paths;

		for (const [circuitName, circuitObject] of Object.entries(circomConfig.circuits)) {
			// setup circom circuit file
			const circuitOutPath = circuitOutDir(circuitName, circomConfig);
			fs.mkdirSync(circuitOutPath, { recursive: true });

			const circomDestPath = `${circuitOutPath}/${circuitName}.circom`; 
			const content = circuitString(circuitObject);
			fs.writeFileSync(circomDestPath, content);

			// compile
			execSync(`circom ${circomConfig.options} -o ${circuitOutPath} ${circomDestPath}`);

			// generate zkey
			await snarkjs.plonk.setup(
				`${circuitOutPath}/${circuitName}.r1cs`, 
				`${root}/${circomConfig.plonk}`, 
				`${circuitOutPath}/${circuitName}.zkey`
			);

			// create solidity verifierContract
			const solidityVerifier = await snarkjs.zKey.exportSolidityVerifier(
				`${circuitOutPath}/${circuitName}.zkey`, 
				solidityTemplates
			);

			const dirVerifierOutPath = `${sources}/${circomConfig.verifierOutDir}`;
			fs.mkdirSync(dirVerifierOutPath, { recursive: true });

			const solidityDestPath = `${dirVerifierOutPath}/${circuitVerifierContractName(circuitName)}.sol`;
			fs.writeFileSync(solidityDestPath, solidityVerifier);
		}
	});

task(TASK_COMPILE, "hook compile task to include circuit compilation")
	.setAction(async (_args, hre, runSuper) => {
		await hre.run(TASK_CIRCOM);
		await runSuper();
	});

/*
 * HRE Extension
 */

extendEnvironment((hre) => {
	if (hre.circom === undefined) {
		hre.circom = {};
	}
	hre.circom.getVerifierFactory = async (circuitName) => {
		const circomConfig = hre.userConfig.circom;
		return await hre.artifacts.readArtifact(verifierFullyQualifiedName(circuitName, circomConfig));
	};

	hre.circom.generateCalldata = async (circuitName, input) => {
		const circomConfig = hre.userConfig.circom;
		const circuitOutPath = circuitOutDir(circuitName, circomConfig);
		const wasmPath = `${circuitOutPath}/${circuitName}_js/${circuitName}.wasm`;
		const zkeyPath = `${circuitOutPath}/${circuitName}.zkey`;

		const { proof, publicSignals } = await snarkjs.plonk.fullProve(input, wasmPath, zkeyPath);
		return await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);
	};
});

/*
 * Helpers
 */

const verifierFullyQualifiedName = (circuitName, circomConfig) => 
	`${path.basename(hre.config.paths.sources)}/${circomConfig.verifierOutDir}/${circuitVerifierContractName(circuitName)}.sol:PlonkVerifier`;

const circuitOutDir = (circuitName, circomConfig) => `${hre.config.paths.root}/${circomConfig.outDir}/${circuitName}`;

const circuitString = (circuitObject) => 
	`${includeString(circuitObject)}\n${circuitMainString(circuitObject)}`;

const circuitMainString = ({ componentName, publicSignals, args }) => {
	const publicSignalsString = publicSignals.length > 0 ? `{public [${publicSignals.join()}]} ` : "";

	return `component main ${publicSignalsString}= ${componentName}(${args.join()});`
}

const includeString = ({ path }) => `include "${__dirname}/${path}";`;

const circuitVerifierContractName = (circuitName) => `${circuitName}Verifier`;

/*
 * Load
 */

// loads on running this script
const solidityTemplates = (() => {
	// copied from hardhat-circom: https://github.com/projectsophon/hardhat-circom/blob/de5fb45bbbb3254533ad15e4bb5e6bd423236ac8/src/index.ts#L729

	const snarkjsRoot = path.dirname(require.resolve("snarkjs"));
	const templateDir = fs.existsSync(path.join(snarkjsRoot, "templates")) ? "templates" : "../templates";

	const verifierGroth16TemplatePath = path.join(snarkjsRoot, templateDir, "verifier_groth16.sol.ejs");
	const verifierPlonkTemplatePath = path.join(snarkjsRoot, templateDir, "verifier_plonk.sol.ejs");

	const groth16Template = fs.readFileSync(verifierGroth16TemplatePath, "utf8");
	const plonkTemplate = fs.readFileSync(verifierPlonkTemplatePath, "utf8");

	return {
    	groth16: groth16Template,
		plonk: plonkTemplate,
    };
})();

