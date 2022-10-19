const hre = require("hardhat");
const chai = require("chai");

describe("GOLSVG", () => {
	let golSVG;

	beforeEach(async () => {
		const GOLSVG = await hre.ethers.getContractFactory("GOLSVG");
		golSVG = await GOLSVG.deploy();
	});

	it("blob", async () => {
		console.log(await golSVG.svgGen("0", "4543320024158208", "8", "8"));
	});
});
