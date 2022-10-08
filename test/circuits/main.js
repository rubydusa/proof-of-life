const { circuitTestsFromData } = require("../../testutils.js");

const MAIN4x4 = "Main4x4";

const testData = [
	{
		name: MAIN4x4,
		metadata: {},
		cases: [
			{
				input: {
					data: ["41261"],
					address: "1390849295786071768276380950238675083608645509734",
					// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
					// private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
				},
				output: [
					"16599741033962345657190234215417710430612899293324559185968451882468394715319",
					"10088",
					"1390849295786071768276380950238675083608645509734"
				]
			},
			{
				input: {
					data: ["32315"],
					address: "642829559307850963015472508762062935916233390536",
					// 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
					// private key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
				},
				output: [
					"7612057760220217853649499035538205975258841457656337695532956242873164576120",
					"0",
					"642829559307850963015472508762062935916233390536"
				]
			},
			{
				input: {
					data: ["21046"],
					address: "344073830386746567427978432078835137280280269756",
					// 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
					// private key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
				},
				output: [
					"12018611737131778872829784257813644301722255667899645008819020606230377879127",
					"56340",
					"344073830386746567427978432078835137280280269756"
				]
			},
		]
	}
];

describe("Main", () => {
	testData.forEach(unitData => circuitTestsFromData(unitData));
});

/*
 * code used to generate data
 *
describe("blob", () => {
	it("blab", async () => {
		const addresses = [
			"1390849295786071768276380950238675083608645509734", //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
			"642829559307850963015472508762062935916233390536", //0x70997970C51812dc3A010C7d01b50e0d17dc79C8
			"344073830386746567427978432078835137280280269756", //0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC 
		];

		for (const address of addresses) {
			const data = [Math.floor(Math.random() * 65536).toString()];
			const { publicSignals } = await hre.circom.generateProof(
				"Main4x4", { address, data }
			);

			console.log({
				data,
				publicSignals,
			});
		}
	});
});
*/
