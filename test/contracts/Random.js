const hre = require("hardhat");
const chai = require("chai");

const { ethers } = hre;

describe("Random", () => {
    let random;

    beforeEach(async () => {
        const Random = await ethers.getContractFactory("Random");
        random = await Random.deploy();
    });

    it("Initializes Value at 0", async () => {
        chai.expect(await random.val(), "0");
    });

    it("Updates Correctly After Set", async () => {
        await random.setVal("123");
        chai.expect(await random.val(), "123");
    });
});
