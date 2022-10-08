/*
 * Tests work with plonk but not with groth16. seems to be a bug with snarkjs:
 * https://bytemeta.vip/repo/iden3/snarkjs/issues/116
 *
const chai = require("chai");
const BN = require("bn.js");
const { circuitTestsFromData } = require("../../testutils.js");

const CREATE_BIT_MATRIX4x4 = "CreateBitMatrix4x4";
const DECONSTRUCT_BIT_MATRIX4x4 = "DeconstructBitMatrix4x4";
const CREATE_BIT_MATRIX6x4 = "CreateBitMatrix6x4";
const DECONSTRUCT_BIT_MATRIX6x4 = "DeconstructBitMatrix6x4";

const createBitMatrixHooks = [
	{
		name: "num2circomBitMatrix",
		f: async ({metadata, input, output}) => {
			const { w, h } = metadata;
			chai.expect(output).to.be.eql(num2circomBitMatrix(input["in"], w, h));
		}
	}
]

const testData = [
	{
		name: CREATE_BIT_MATRIX4x4,
		metadata: {
			w: 4,
			h: 4,
		},
		cases: [
			{
				input: {
					"in": "0"
				},
				output: [
					"0", "0", "0", "0",
					"0", "0", "0", "0",
					"0", "0", "0", "0",
					"0", "0", "0", "0",
				],
				hooks: createBitMatrixHooks,
			},
			{
				input: {
					"in": "65535"
				},
				output: [
					"1", "1", "1", "1",
					"1", "1", "1", "1",
					"1", "1", "1", "1",
					"1", "1", "1", "1",
				],
				hooks: createBitMatrixHooks,
			},
			{
				input: {
					"in": "54433"
				},
				output: [
					"1", "0", "0", "1",
					"0", "1", "0", "0",
					"0", "0", "1", "1",
					"0", "1", "0", "1",
				],
				hooks: createBitMatrixHooks,
			},
			{
				input: {
					"in": "65536"
				},
				output: null,
			},
		]
	},
	{
		name: DECONSTRUCT_BIT_MATRIX4x4,
		metadata: {},
		cases: [
			{
				input: {
					"in": [
						["0", "0", "0", "0"],
						["0", "0", "0", "0"],
						["0", "0", "0", "0"],
						["0", "0", "0", "0"],
					]
				},
				output: ["0"],
			},
			{
				input: {
					"in": [
						["1", "1", "1", "1"],
						["1", "1", "1", "1"],
						["1", "1", "1", "1"],
						["1", "1", "1", "1"],
					]
				},
				output: ["65535"],
			},
			{
				input: {
					"in": [
						["1", "0", "0", "1"],
						["0", "1", "0", "0"],
						["0", "0", "1", "1"],
						["0", "1", "0", "1"],
					]
				},
				output: ["54433"],
			},
		]
	},
	{
		name: CREATE_BIT_MATRIX6x4,
		metadata: {
			w: 6,
			h: 4
		},
		cases: [
			{
				input: {
					"in": "0"
				},
				output: [
					"0", "0", "0", "0", "0", "0", 
					"0", "0", "0", "0", "0", "0", 
					"0", "0", "0", "0", "0", "0", 
					"0", "0", "0", "0", "0", "0"
				],
				hooks: createBitMatrixHooks,
			},
			{
				input: {
					"in": "16777215"
				},
				output: [
					"1", "1", "1", "1", "1", "1", 
					"1", "1", "1", "1", "1", "1", 
					"1", "1", "1", "1", "1", "1", 
					"1", "1", "1", "1", "1", "1"
				],
				hooks: createBitMatrixHooks,
			},
			{
				input: {
					"in": "13754799"
				},
				output: [
					"1", "0", "0", "0", "1", "1", 
					"1", "0", "1", "1", "1", "1", 
					"1", "0", "1", "0", "0", "0", 
					"1", "1", "1", "0", "0", "1"
				],
				hooks: createBitMatrixHooks,
			},
			{
				input: {
					"in": "16777216"
				},
				output: null,
			},
		]
	},
	{
		name: DECONSTRUCT_BIT_MATRIX6x4,
		metadata: {},
		cases: [
			{
				input: {
					"in": [
						"0", "0", "0", "0", "0", "0", 
						"0", "0", "0", "0", "0", "0", 
						"0", "0", "0", "0", "0", "0", 
						"0", "0", "0", "0", "0", "0"
					]
				},
				output: ["0"],
			},
			{
				input: {
					"in": [
						"1", "1", "1", "1", "1", "1", 
						"1", "1", "1", "1", "1", "1", 
						"1", "1", "1", "1", "1", "1", 
						"1", "1", "1", "1", "1", "1"
					]
				},
				output: ["16777215"],
			},
			{
				input: {
					"in": [
						"1", "0", "0", "0", "1", "1", 
						"1", "0", "1", "1", "1", "1", 
						"1", "0", "1", "0", "0", "0", 
						"1", "1", "1", "0", "0", "1"
					]
				},
				output: ["13754799"],
			},
		]
	}
]

describe("BitMatrix", () => {
	testData.forEach(unitData => circuitTestsFromData(unitData));
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
*/
