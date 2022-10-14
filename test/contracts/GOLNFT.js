const hre = require("hardhat");
const chai = require("chai");

const ERROR_MSG = {
	INVALID_PROOF: "GOLNFT: Invalid proof",
	HASH_EXISTS: "GOLNFT: Solution already exists!",
}

describe("GOLNFT", () => {
	const CIRCUIT_NAME = "Main4x4";
	const PRIZENUM = "10088";
	const USER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
	const ATTACKER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

	const VALID_DATA = ["41261"];  // solution to 10088
	const VALID_ADDRESS = "1390849295786071768276380950238675083608645509734";

	let verifier;
	let golNFT;

	let attacker;

	beforeEach(async () => {
		const user = await hre.ethers.getSigner(USER_ADDRESS);
		attacker = await hre.ethers.getSigner(ATTACKER_ADDRESS);

		const Verifier = (await hre.circom.getVerifierFactory(CIRCUIT_NAME)).connect(user);
		verifier = await Verifier.deploy();

		const GOLNFT = (await hre.ethers.getContractFactory("GOLNFT")).connect(user);
		golNFT = await GOLNFT.deploy(PRIZENUM, verifier.address);
	});

	it("Valid All", async () => {
		const input = {
			data: VALID_DATA,  
			address: VALID_ADDRESS,
		};

		const [a, b, c, [solutionHash, hash]] = await hre.circom.generateCalldata(CIRCUIT_NAME, input);
		await golNFT.mint(solutionHash, hash, a, b, c);
		
		chai.expect(await golNFT.ownerOf("0")).to.be.eq(USER_ADDRESS);
	});

	it("Invalid Grid Data", async () => {
		const input = {
			data: ["12345"], 
			address: VALID_ADDRESS,
		};

		const [a, b, c, [solutionHash, hash]] = await hre.circom.generateCalldata(CIRCUIT_NAME, input);
		await chai.expect(golNFT.mint(solutionHash, hash, a, b, c)).to.be.revertedWith(ERROR_MSG.INVALID_PROOF);
	});

	it("Invalid Address", async () => {
		const input = {
			data: VALID_DATA, 
			address: "12345",
		};

		const [a, b, c, [solutionHash, hash]] = await hre.circom.generateCalldata(CIRCUIT_NAME, input);
		await chai.expect(golNFT.mint(solutionHash, hash, a, b, c)).to.be.revertedWith(ERROR_MSG.INVALID_PROOF);
	});

	// can't frontrun transactions
	it("Invalid Sender", async () => {
		const input = {
			data: VALID_DATA,
			address: VALID_ADDRESS,
		};

		const [a, b, c, [solutionHash, hash]] = await hre.circom.generateCalldata(CIRCUIT_NAME, input);
		const golNFTAttacker = golNFT.connect(attacker);
		await chai.expect(golNFTAttacker.mint(solutionHash, hash, a, b, c)).to.be.revertedWith(ERROR_MSG.INVALID_PROOF);
	});

	// can't mint twice with the same hash
	it("Solution Hash Exists", async () => {
		const input = {
			data: VALID_DATA,
			address: VALID_ADDRESS,
		};

		const [a, b, c, [solutionHash, hash]] = await hre.circom.generateCalldata(CIRCUIT_NAME, input);
		await golNFT.mint(solutionHash, hash, a, b, c);
		await chai.expect(golNFT.mint(solutionHash, hash, a, b, c)).to.be.revertedWith(ERROR_MSG.HASH_EXISTS);
	});

	it("Second Solution", async () => {
		const firstInput = {
			data: VALID_DATA,
			address: VALID_ADDRESS,
		};

		const [a0, b0, c0, [solutionHash0, hash0]] = await hre.circom.generateCalldata(CIRCUIT_NAME, firstInput);
		await golNFT.mint(solutionHash0, hash0, a0, b0, c0);
		
		chai.expect(await golNFT.ownerOf("0")).to.be.eq(USER_ADDRESS);

		const secondInput = {
			data: ["42377"],
			address: VALID_ADDRESS,
		};

		const [a1, b1, c1, [solutionHash1, hash1]] = await hre.circom.generateCalldata(CIRCUIT_NAME, secondInput);
		await golNFT.mint(solutionHash1, hash1, a1, b1, c1);
		
		chai.expect(await golNFT.ownerOf("1")).to.be.eq(USER_ADDRESS);
	});
});
