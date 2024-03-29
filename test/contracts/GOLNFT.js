const hre = require("hardhat");
const chai = require("chai");
const isSvg = require("is-svg");
chai.use(require("chai-string"));

const helpers = require("@nomicfoundation/hardhat-network-helpers");

const { ethers } = hre;

const ERROR_MSG = {
    INVALID_PROOF: "GOLNFT: Invalid proof",
    HASH_EXISTS: "GOLNFT: Solution already exists!",
    INVALID_TOKENID: "GOLNFT: TokenID does not exist!"
};

describe("GOLNFT", () => {
    const W = "8";
    const H = "8";
    const EXPR = "86400";
    const DUMMY_EXTERNAL_URL = "abc.com";

    const CIRCUIT_NAME = "Main3N8x8";
    const PRIZENUM = "14520449625737667765";
    const USER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const ATTACKER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    const VALID_DATA = ["7203617452961438741"]; // solution to prizenum
    const VALID_ADDRESS = "1390849295786071768276380950238675083608645509734";

    const PRIZENUM2 = "2887490257366876950";
    const VALID_DATA2 = "18142979013735226945";

    let random;
    let verifier;
    let golSVG;
    let golMetadata;
    let golNFT;

    let attacker;

    const mint = async ({ data, address }, from) => {
        const [a, b, c, [solutionHash, hash]] = await hre.circom.generateCalldata(CIRCUIT_NAME, { data, address });
        const golNFTWithSender = from ? golNFT.connect(from) : golNFT;
        await golNFTWithSender.mint(solutionHash, hash, a, b, c);
    };

    beforeEach(async () => {
        const user = await ethers.getSigner(USER_ADDRESS);
        attacker = await ethers.getSigner(ATTACKER_ADDRESS);

        const Random = (await ethers.getContractFactory("Random")).connect(user);
        random = await Random.deploy();
        await random.setVal(PRIZENUM);

        const Verifier = (await hre.circom.getVerifierFactory(CIRCUIT_NAME)).connect(user);
        verifier = await Verifier.deploy();

        const GOLSVG = (await ethers.getContractFactory("GOLSVG")).connect(user);
        golSVG = await GOLSVG.deploy();

        const GOLMetadata = (await ethers.getContractFactory("GOLMetadata")).connect(user);
        golMetadata = await GOLMetadata.deploy(DUMMY_EXTERNAL_URL);

        const GOLNFT = (await ethers.getContractFactory("GOLNFT")).connect(user);
        golNFT = await GOLNFT.deploy(verifier.address, random.address, golSVG.address, golMetadata.address, W, H, EXPR);
    });

    describe("Base Tests", () => {
        it("Valid All", async () => {
            const input = {
                data: VALID_DATA,
                address: VALID_ADDRESS
            };

            await mint(input);

            chai.expect(await golNFT.ownerOf("0")).to.be.eq(USER_ADDRESS);
        });

        it("Invalid Grid Data", async () => {
            const input = {
                data: ["12345"],
                address: VALID_ADDRESS
            };

            await chai.expect(mint(input)).to.be.revertedWith(ERROR_MSG.INVALID_PROOF);
        });

        it("Invalid Address", async () => {
            const input = {
                data: VALID_DATA,
                address: "12345"
            };

            await chai.expect(mint(input)).to.be.revertedWith(ERROR_MSG.INVALID_PROOF);
        });

        // can't frontrun transactions
        it("Invalid Sender", async () => {
            const input = {
                data: VALID_DATA,
                address: VALID_ADDRESS
            };

            await chai.expect(mint(input, attacker)).to.be.revertedWith(ERROR_MSG.INVALID_PROOF);
        });

        // can't mint twice with the same hash
        it("Solution Hash Exists", async () => {
            const input = {
                data: VALID_DATA,
                address: VALID_ADDRESS
            };

            await mint(input);
            await chai.expect(mint(input)).to.be.revertedWith(ERROR_MSG.HASH_EXISTS);
        });
    });

    describe("Prizenum", () => {
        beforeEach(async () => {
            await random.setVal(PRIZENUM2);
        });

        it("Prizenum Updates Even if not Expired", async () => {
            /* eslint-disable-next-line no-unused-expressions */
            chai.expect(await golNFT.isExpired()).to.be.false;

            const input = {
                data: VALID_DATA,
                address: VALID_ADDRESS
            };

            await mint(input);

            chai.expect(await golNFT.tokenId2prizenum("0")).to.be.eq(PRIZENUM);
            chai.expect(await golNFT.prizenum()).to.be.eq(PRIZENUM2);
        });

        it("Prizenum Updates After Expiration", async () => {
            await helpers.time.increase(ethers.BigNumber.from(EXPR));

            const input = {
                data: VALID_DATA,
                address: VALID_ADDRESS
            };

            await mint(input);

            chai.expect(await golNFT.tokenId2prizenum("0")).to.be.eq(PRIZENUM);
            chai.expect(await golNFT.prizenum()).to.be.eq(PRIZENUM2);
        });

        it("Minting Works After Prizenum Changes", async () => {
            await helpers.time.increase(ethers.BigNumber.from(EXPR));

            const input = {
                data: VALID_DATA,
                address: VALID_ADDRESS
            };

            await mint(input);

            const input2 = {
                data: VALID_DATA2,
                address: VALID_ADDRESS
            };

            await mint(input2);

            chai.expect(await golNFT.tokenId2prizenum("0")).to.be.eq(PRIZENUM);
            chai.expect(await golNFT.tokenId2prizenum("1")).to.be.eq(PRIZENUM2);
            chai.expect(await golNFT.ownerOf("1")).to.be.eq(USER_ADDRESS);
        });
    });

    const parseImageData = (s) => {
        const JSON_DATA_URI = "data:application/json;base64,";
        const SVG_DATA_URI = "data:image/svg+xml;base64,";

        const jsonString = Buffer.from(s.slice(JSON_DATA_URI.length), "base64").toString();
        const json = JSON.parse(jsonString);
        json.image_data = Buffer.from(json.image_data.slice(SVG_DATA_URI.length), "base64").toString();
        return json;
    };

    describe("Metadata", () => {
        it("Works for a valid tokenId", async () => {
            const input = {
                data: VALID_DATA,
                address: VALID_ADDRESS
            };

            await mint(input);

            const resultString = await golNFT.tokenURI("0");
            const metadata = parseImageData(resultString);

            /* eslint-disable-next-line no-unused-expressions */
            chai.expect(isSvg(metadata.image_data)).to.be.true;
            chai.expect(metadata.external_url).to.be.eq(DUMMY_EXTERNAL_URL);
        });

        it("Doesn't work for a non valid tokenId", async () => {
            await chai.expect(golNFT.tokenURI("0")).to.be.revertedWith(ERROR_MSG.INVALID_TOKENID);
        });
    });
});
