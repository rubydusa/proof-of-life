const { circuitTestsFromData } = require("../../testutils.js");

const GOL3N4x4 = "Gol3N4x4";

const testData = [
	{
		name: GOL3N4x4,
		metadata: {},
		cases: [
			{
				input: {
					"in": [
						["1", "1", "1", "1"],
						["0", "1", "0", "0"],
						["0", "1", "0", "0"],
						["0", "0", "1", "0"]
					]
				},
				output: [
					"0", "0", "0", "0", 
					"0", "1", "0", "1",
					"0", "0", "0", "0", 
					"0", "0", "0", "0",
				],
			},
			{
				input: {
					"in": [
						["1", "1", "0", "0"],
						["1", "0", "0", "1"],
						["0", "0", "0", "0"],
						["0", "0", "0", "0"]
					]
				},
				output: [
					"0", "1", "0", "1", 
					"0", "1", "0", "1", 
					"1", "1", "0", "1", 
					"1", "1", "0", "1"
				],
			},
			{
				input: {
					"in": [
						["0", "1", "0", "1"], 
						["0", "0", "1", "0"], 
						["1", "1", "1", "0"], 
						["0", "0", "1", "0"]
					]
				},
				output: [
					"0", "0", "0", "0",
					"0", "0", "0", "0",
					"0", "0", "0", "0",
					"0", "0", "0", "0"
				],
			},
		]
	}
];

describe("BitMatrix", () => {
	testData.forEach(unitData => circuitTestsFromData(unitData));
});
