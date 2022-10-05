const hre = require("hardhat");
const chai = require("chai");
chai.use(require('chai-as-promised'));
const BN = require("bn.js");

describe("BitMatrix", () => {
	describe("CreateBitMatrix4x4", () => {
		const testData = [
			[
				"0",
				[
					"0", "0", "0", "0",
					"0", "0", "0", "0",
					"0", "0", "0", "0",
					"0", "0", "0", "0",
				],
			],
			[
				"65535",  // 2**16 - 1
				[
					"1", "1", "1", "1",
					"1", "1", "1", "1",
					"1", "1", "1", "1",
					"1", "1", "1", "1",
				],
			],
			[
				"54433",
				[
					"1", "0", "0", "1",
					"0", "1", "0", "0",
					"0", "0", "1", "1",
					"0", "1", "0", "1",
				],
			],
			[
				"65536",  // 2**16
				null,
			],
		];

		Object.entries(testData).forEach(([index, [num, matrix]]) => {
			it(`Proof Test #${index}`, async () => {
				if (matrix === null) {
					await chai.expect(
						hre.circom.generateProof(
							"CreateBitMatrix4x4", 
							{ "in": [num] }
						)
					).to.be.rejectedWith("Error in template");
					return;
				}

				const { publicSignals } = await hre.circom.generateProof(
					"CreateBitMatrix4x4",
					{ "in": [num] }
				);

				chai.expect(publicSignals).to.be.eql(matrix);
			});

			it(`num2circomBitMatrix Test #${index}`, async () => {
				if (matrix !== null) {
					chai.expect(matrix).to.be.eql(num2circomBitMatrix(num, 4, 4));
				}
			});
		});
	});

	describe("DeconstructBitMatrix4x4", () => {
		const testData = [
			[
				[
					["0", "0", "0", "0"],
					["0", "0", "0", "0"],
					["0", "0", "0", "0"],
					["0", "0", "0", "0"],
				],
				"0",
			],
			[
				[
					["1", "1", "1", "1"],
					["1", "1", "1", "1"],
					["1", "1", "1", "1"],
					["1", "1", "1", "1"],
				],
				"65535",  // 2**16 - 1
			],
			[
				[
					["1", "0", "0", "1"],
					["0", "1", "0", "0"],
					["0", "0", "1", "1"],
					["0", "1", "0", "1"],
				],
				"54433",
			],
		];

		Object.entries(testData).forEach(([index, [matrix, num]]) => {
			it(`Proof Test #${index}`, async () => {
				const { publicSignals } = await hre.circom.generateProof(
					"DeconstructBitMatrix4x4",
					{ "in": matrix }
				);

				chai.expect(publicSignals).to.be.eql([num]);
			});
		});
	});
});

const num2circomBitMatrix = (n, w, h) => {
	const num = new BN(n);
	const one = new BN(1);

	const arr = [...Array(w * h).keys()].map(i => num.shrn(i).and(one).toString());
	return transposeArr(arr, w, h);
}

const transposeArr = (arr, w, h) => {
	const transposed = [...Array(w * h)];
	for (const x of [...Array(w).keys()]) {
		for (const y of [...Array(h).keys()]) {
			const index = x + y * w;
			const transposedIndex = y + x * h;

			transposed[transposedIndex] = arr[index];
		}
	}
	return transposed;
}
