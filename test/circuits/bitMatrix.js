const hre = require("hardhat");
const chai = require("chai");
chai.use(require('chai-as-promised'));
const BN = require("bn.js");

const testCreateBitMatrix = (testData, name, w, h) => {
	return Object.entries(testData).forEach(([index, [num, matrix]]) => {
		it(`Proof Test #${index}`, async () => {
			if (matrix === null) {
				await chai.expect(
					hre.circom.generateProof(
						name,
						{ "in": [num] }
					)
				).to.be.rejectedWith("Error in template");
				return;
			}

			const { publicSignals } = await hre.circom.generateProof(
				name,
				{ "in": [num] }
			);

			chai.expect(publicSignals).to.be.eql(matrix);
		});

		it(`num2circomBitMatrix Test #${index}`, async () => {
			if (matrix !== null) {
				chai.expect(matrix).to.be.eql(num2circomBitMatrix(num, w, h));
			}
		});
	});
}

const testDeconstructBitMatrix = (testData, name, w, h) => {
	Object.entries(testData).forEach(([index, [matrix, num]]) => {
		it(`Proof Test #${index}`, async () => {
			const { publicSignals } = await hre.circom.generateProof(
				name,
				{ "in": matrix }
			);

			chai.expect(publicSignals).to.be.eql([num]);
		});
	});
}

describe("BitMatrix", () => {
	const CREATE_BIT_MATRIX4x4 = "CreateBitMatrix4x4";
	const DECONSTRUCT_BIT_MATRIX4x4 = "DeconstructBitMatrix4x4";
	const CREATE_BIT_MATRIX6x4 = "CreateBitMatrix6x4";
	const DECONSTRUCT_BIT_MATRIX6x4 = "DeconstructBitMatrix6x4";

	describe(CREATE_BIT_MATRIX4x4, () => {
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

		testCreateBitMatrix(testData, CREATE_BIT_MATRIX4x4, 4, 4);
	});

	describe(DECONSTRUCT_BIT_MATRIX4x4, () => {
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

		testDeconstructBitMatrix(testData, DECONSTRUCT_BIT_MATRIX4x4, 4, 4);
	});

	describe(CREATE_BIT_MATRIX6x4, () => {
		const testData = [
			[
				"16777215",
				[
					'1', '1', '1', '1', '1', '1', 
					'1', '1', '1', '1', '1', '1', 
					'1', '1', '1', '1', '1', '1', 
					'1', '1', '1', '1', '1', '1'
				],
			],
			[
				"0",
				[
					'0', '0', '0', '0', '0', '0', 
					'0', '0', '0', '0', '0', '0', 
					'0', '0', '0', '0', '0', '0', 
					'0', '0', '0', '0', '0', '0'
				],
			],
			[
				"13754799",
				[
					'1', '0', '0', '0', '1', '1', 
					'1', '0', '1', '1', '1', '1', 
					'1', '0', '1', '0', '0', '0', 
					'1', '1', '1', '0', '0', '1'
				],
			],
			[
				"16777216",
				null,
			],
		];

		testCreateBitMatrix(testData, CREATE_BIT_MATRIX6x4, 6, 4);
	});

	describe(DECONSTRUCT_BIT_MATRIX6x4, () => {
		const testData = [
			[
				[
					'1', '1', '1', '1', '1', '1', 
					'1', '1', '1', '1', '1', '1', 
					'1', '1', '1', '1', '1', '1', 
					'1', '1', '1', '1', '1', '1'
				],
				"16777215",
			],
			[
				[
					'0', '0', '0', '0', '0', '0', 
					'0', '0', '0', '0', '0', '0', 
					'0', '0', '0', '0', '0', '0', 
					'0', '0', '0', '0', '0', '0'
				],
				"0",
			],
			[
				[
					'1', '0', '0', '0', '1', '1', 
					'1', '0', '1', '1', '1', '1', 
					'1', '0', '1', '0', '0', '0', 
					'1', '1', '1', '0', '0', '1'
				],
				"13754799",
			],
		];

		testDeconstructBitMatrix(testData, DECONSTRUCT_BIT_MATRIX6x4, 6, 4);
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
