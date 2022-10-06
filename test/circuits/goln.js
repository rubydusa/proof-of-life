const hre = require("hardhat");
const chai = require("chai");

const GOL3N4x4 = "Gol3N4x4";

describe(GOL3N4x4, () => {
	const testData = [
		[
			[
				"1", "1", "1", "1",
				"0", "1", "0", "0",
				"0", "1", "0", "0",
				"0", "0", "1", "0"
			], 
			[
				"0", "0", "0", "0", 
				"0", "1", "0", "1",
				"0", "0", "0", "0", 
				"0", "0", "0", "0",
			],
		],
		[
			[
				"1", "1", "0", "0",
				"1", "0", "0", "1",
				"0", "0", "0", "0",
				"0", "0", "0", "0"
			], 
			[
				"0", "1", "0", "1", 
				"0", "1", "0", "1", 
				"1", "1", "0", "1", 
				"1", "1", "0", "1"
			],
		],
		[
			[
				"0", "1", "0", "1", 
				"0", "0", "1", "0", 
				"1", "1", "1", "0", 
				"0", "0", "1", "0"
			], 
			[
				"0", "0", "0", "0",
				"0", "0", "0", "0",
				"0", "0", "0", "0",
				"0", "0", "0", "0"
			],
		],
	];

	Object.entries(testData).forEach(([index, [matrixFrom, matrixTo]]) => {
		it(`Proof Test #${index}`, async () => {
			const { publicSignals } = await hre.circom.generateProof(
				GOL3N4x4,
				{ "in": matrixFrom }
			);

			chai.expect(publicSignals).to.be.eql(matrixTo);
		});
	});
});
