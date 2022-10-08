require("hardhat/config");

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const snarkjs = require("snarkjs");

const { TASK_COMPILE } = require("hardhat/builtin-tasks/task-names");
const {HardhatError} = require("hardhat/internal/core/errors");
const TASK_CIRCOM_COMPILE = "circom-compile";

/*
 * Globals
 */

const PLONK = "plonk";
const GROTH16 = "groth16";

const CircuitArtifact = Object.freeze({
	DIR: 0,
	VERIFIER_DIR: 1,
	PHASE1: 2,
	CIRCOM: 3,
	R1CS: 4,
	ZKEY: 5,
	WASM: 6,
	VERIFIER_CONTRACT: 7,
	PLONK_VERIFIER_FULLY_QUALIFIED_NAME: 8,
	GROTH16_VERIFIER_FULLY_QUALIFIED_NAME: 9,
});

/*
 * Tasks
 */

task(TASK_CIRCOM_COMPILE, "Compiles all circuits in circuits directory")
	.setAction(async (_args, hre, _runSuper) => {
		const { options, circuits, protocol } = hre.userConfig.circom;
		for (const [circuitName, circuitObject] of Object.entries(circuits)) {
			// setup circom circuit file
			const circuitOutDirectory = getCircuitArtifactPath(CircuitArtifact.DIR, circuitName, hre);
			fs.mkdirSync(circuitOutDirectory, { recursive: true });

			const circuitCompilePath = getCircuitArtifactPath(CircuitArtifact.CIRCOM, circuitName, hre); 
			const content = circuitObjectCode(circuitObject, hre);
			fs.writeFileSync(circuitCompilePath, content);

			// compile
			execSync(`circom ${options} -o ${circuitOutDirectory} ${circuitCompilePath}`);

			// generate zkey
			if (protocol === PLONK) {
				await snarkjs.plonk.setup(
					getCircuitArtifactPath(CircuitArtifact.R1CS, circuitName, hre),
					getCircuitArtifactPath(CircuitArtifact.PHASE1, circuitName, hre),
					getCircuitArtifactPath(CircuitArtifact.ZKEY, circuitName, hre)
				);
			} 
			else if (protocol === GROTH16) {
				const preZKey = { type: "mem" };
				await snarkjs.zKey.newZKey(
					getCircuitArtifactPath(CircuitArtifact.R1CS, circuitName, hre),
					getCircuitArtifactPath(CircuitArtifact.PHASE1, circuitName, hre),
					preZKey,
				);

				await snarkjs.zKey.beacon(
					preZKey,
					getCircuitArtifactPath(CircuitArtifact.ZKEY, circuitName, hre),
					undefined,
					"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
					10,
				)
			}
			else {
				throw new HardhatError(`Invalid protocol name: ${protocol}`);
			}

			// create solidity verifierContract
			const solidityVerifier = await snarkjs.zKey.exportSolidityVerifier(
				getCircuitArtifactPath(CircuitArtifact.ZKEY, circuitName, hre),
				solidityTemplates
			);

			// export solidity verifier to sources
			const verifierOutDirectory = getCircuitArtifactPath(CircuitArtifact.VERIFIER_DIR, circuitName, hre);
			fs.mkdirSync(verifierOutDirectory, { recursive: true });

			const solidityVerifierPath = getCircuitArtifactPath(CircuitArtifact.VERIFIER_CONTRACT, circuitName, hre);
			fs.writeFileSync(solidityVerifierPath, solidityVerifier);
		}
	});

task(TASK_COMPILE, "hook compile task to include circuit compilation")
	.setAction(async (_args, hre, runSuper) => {
		await hre.run(TASK_CIRCOM_COMPILE);
		await runSuper();
	});

/*
 * HRE Extension
 */

extendEnvironment((hre) => {
	const getVerifierFactory = async (circuitName) => {
		const { protocol } = hre.userConfig.circom;

		let verifierName;
		if (protocol === PLONK) {
			verifierName = getCircuitArtifactPath(CircuitArtifact.PLONK_VERIFIER_FULLY_QUALIFIED_NAME, circuitName, hre);
		}
		else if (protocol === GROTH16) {
			verifierName = getCircuitArtifactPath(CircuitArtifact.GROTH16_VERIFIER_FULLY_QUALIFIED_NAME, circuitName, hre);
		}
		else {
			throw new HardhatError(`Invalid protocol name: ${protocol}`);
		}

		return await hre.artifacts.readArtifact(
			verifierName
		);
	}

	const generateProof = async (circuitName, input) => {
		const { protocol } = hre.userConfig.circom;

		const wasmPath = getCircuitArtifactPath(CircuitArtifact.WASM, circuitName, hre);
		const zkeyPath = getCircuitArtifactPath(CircuitArtifact.ZKEY, circuitName, hre);

		if (protocol === PLONK) {
			return await snarkjs.plonk.fullProve(input, wasmPath, zkeyPath);
		}
		else if (protocol === GROTH16) {
			return await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);
		}
		else {
			throw new HardhatError(`Invalid protocol name: ${protocol}`);
		}
	}

	const verifyProof = async (circuitName, { proof, publicSignals }) => {
		const { protocol } = hre.userConfig.circom;
		const zkeyPath = getCircuitArtifactPath(CircuitArtifact.ZKEY, circuitName, hre);

		if (protocol === PLONK) {
			const verificationKey = await snarkjs.plonk.zKey.exportVerificationKey(zkeyPath);
			return await snarkjs.plonk.verify(verificationKey, publicSignals, proof);
		}
		else if (protocol === GROTH16) {
			const verificationKey = await snarkjs.groth16.zKey.exportVerificationKey(zkeyPath);
			return await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
		}
		else {
			throw new HardhatError(`Invalid protocol name: ${protocol}`);
		}
	}

	const generateCalldata = async (circuitName, input) => {
		const { protocol } = hre.userConfig.circom;
		const { proof, publicSignals } = hre.circom.generateProof(circuitName, input)

		if (protocol === PLONK) {
			return await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);
		}
		else if (protocol === GROTH16) {
			return await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
		}
		else {
			throw new HardhatError(`Invalid protocol name: ${protocol}`);
		}
	};

	hre.circom = {
		...hre.circom, 
		getVerifierFactory,
		generateProof,
		verifyProof,
		generateCalldata,
	}
});

/*
 * Helpers
 */

const getCircuitArtifactPath = (artifactType, circuitName, hre) => {
	const config = hre.userConfig.circom;
	const { root, sources } = hre.config.paths;
	const dir = `${root}/${config.outDir}/${circuitName}`;
	const verifierDir = `${sources}/${config.verifierOutDir}`;
	const verifierContractName = `${circuitName}Verifier`;

	switch (artifactType) {
		case CircuitArtifact.DIR:
			return dir;
		case CircuitArtifact.VERIFIER_DIR:
			return verifierDir;
		case CircuitArtifact.PHASE1:
			return `${root}/${config.phase1}`;
		case CircuitArtifact.CIRCOM:
			return `${dir}/${circuitName}.circom`;
		case CircuitArtifact.R1CS:
			return `${dir}/${circuitName}.r1cs`;
		case CircuitArtifact.ZKEY:
			return `${dir}/${circuitName}.zkey`;
		case CircuitArtifact.WASM:
			return `${dir}/${circuitName}_js/${circuitName}.wasm`;
		case CircuitArtifact.VERIFIER_CONTRACT:
			return `${verifierDir}/${verifierContractName}.sol`;
		case CircuitArtifact.PLONK_VERIFIER_FULLY_QUALIFIED_NAME:
			return `${path.basename(sources)}/${verifierDir}/${verifierContractName}.sol:PlonkVerifier`;
		case CircuitArtifact.GROTH16_VERIFIER_FULLY_QUALIFIED_NAME:
			return `${path.basename(sources)}/${verifierDir}/${verifierContractName}.sol:Verifier`;
		default:
			throw new Error("Invalid artifactType");
	}
}

const circuitObjectCode = (circuitObject, hre) => { 
	const { path, componentName, publicSignals, args, version } = circuitObject;
	const { root } = hre.config.paths;

	const pragmaString = `pragma circom ${version};`;
	const includeString = `include "${root}/${path}";`
	const publicSignalsString = publicSignals.length > 0 ? `{public [${publicSignals.join()}]} ` : "";
	const mainComponenetString = `component main ${publicSignalsString}= ${componentName}(${args.join()});`

	return [
		pragmaString,
		includeString,
		mainComponenetString
	].join("\n");
}

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

