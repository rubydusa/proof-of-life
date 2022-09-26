const { expect } = require("chai");
const snarkjs = require("snarkjs");
const hre = require("hardhat");

describe("Verifier", () => {
	let verifier;

	beforeEach(async () => {
		const Verifier = await hre.ethers.getContractFactory("Verifier");
		verifier = await Verifier.deploy();
	});

	it("Valid Input 1", async () => {
		
	});

	it("Valid Input 2", async () => {});
	it("Valid Input 3", async () => {});

	it("Invalid Input 1", async () => {});
	it("Invalid Input 2", async () => {});
	it("Invalid Input 3", async () => {});
})
