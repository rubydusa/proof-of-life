const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const snarkjs = require("snarkjs");

module.exports = {
	solidity: "0.8.17",
	circom: {
		plonk: "circuits/powersOfTau28_hez_final_13.ptau",
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

task("compile-circom", "Compiles all circuits in circuits directory", async () => {
	const { circuits, options, plonk } = module.exports.circom;

	for (const [circuitName, circuitObject] of Object.entries(circuits)) {
		const dirOutPath = `${__dirname}/artifacts/circuits/${circuitName}`;
		fs.mkdirSync(dirOutPath, { recursive: true });

		const circomDestPath = `${dirOutPath}/${circuitName}.circom`; 
		const content = `${includeString(circuitObject)}\n${circuitMainString(circuitObject)}`;
		fs.writeFileSync(circomDestPath, content);

		execSync(`circom ${options} -o ${dirOutPath} ${circomDestPath}`);

		await snarkjs.plonk.setup(
			`${dirOutPath}/${circuitName}.r1cs`, 
			`${__dirname}/${plonk}`, 
			`${dirOutPath}/${circuitName}.zkey`
		);
		const solidityVerifier = await snarkjs.zKey.exportSolidityVerifier(
			`${dirOutPath}/${circuitName}.zkey`, 
			solidityTemplates
		);

		const solidityDestPath = `${dirOutPath}/Verifier.sol`;
		fs.writeFileSync(solidityDestPath, solidityVerifier);
	}
});

/*
 * Helpers
 */

const circuitMainString = ({ componentName, publicSignals, args }) => {
	const publicSignalsString = publicSignals.length > 0 ? `{public [${publicSignals.join()}]} ` : "";

	return `component main ${publicSignalsString}= ${componentName}(${args.join()});`
}

const includeString = ({ path }) => `include "${__dirname}/${path}";`;

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

