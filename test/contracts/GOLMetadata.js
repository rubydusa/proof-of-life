const hre = require("hardhat");
const chai = require("chai");
chai.use(require("chai-string"));

const { ethers } = hre;

describe("GOLMetadata", () => {
    const OWNER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const ATTACKER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    const NAME_PREFIX = "GOLNFT Number #";
    const DESCRIPTION = "Could you find a proof to life?";

    const DUMMY_EXTERNAL_URL = "abc.com";
    const DUMMY_IMAGE_DATA = "abc.svg";
    const N = 123;

    let golMetadata;
    let owner;
    let attacker;

    beforeEach(async () => {
        owner = await ethers.getSigner(OWNER_ADDRESS);
        attacker = await ethers.getSigner(ATTACKER_ADDRESS);

        const GOLMetadata = await (await ethers.getContractFactory("GOLMetadata")).connect(owner);
        golMetadata = await GOLMetadata.deploy(DUMMY_EXTERNAL_URL);
    });

    it("Valid Metadata", async () => {
        const imageMetadataBytes = await golMetadata.metadata(N, DUMMY_IMAGE_DATA);
        /* eslint-disable-next-line no-unused-expressions */
        chai.expect(ethers.utils.isHexString(imageMetadataBytes)).to.be.true;

        const imageMetadata = JSON.parse(ethers.utils.toUtf8String(imageMetadataBytes));
        chai.expect(imageMetadata.name).to.startWith(NAME_PREFIX);
        chai.expect(imageMetadata.description).to.be.eq(DESCRIPTION);
        chai.expect(imageMetadata.external_url).to.be.eq(DUMMY_EXTERNAL_URL);
        chai.expect(imageMetadata.image_data).to.be.eq(DUMMY_IMAGE_DATA);
    });

    it("Owner Can Change External URL", async () => {
        await golMetadata.setExternalUrl("new.com");

        chai.expect(await golMetadata.externalUrl()).to.be.eq("new.com");
    });

    it("Attacker Can't Change External URL", async () => {
        const attackerGOLMetadata = await golMetadata.connect(attacker);
        await chai.expect(attackerGOLMetadata.setExternalUrl("new.com")).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
