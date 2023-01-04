const hre = require("hardhat");
const chai = require("chai");

const helpers = require("@nomicfoundation/hardhat-network-helpers");

const { ethers } = hre;

const _callWeightedBits = (selector) => async (weightedBitLib, seed, p, d) => {
    return await ethers.provider.call({
        to: weightedBitLib.address,
        data: ethers.utils.hexConcat([
            selector,
            ethers.utils.defaultAbiCoder.encode(["tuple(uint256)", "uint256", "uint256"], [[seed], p, d])            
        ]),
    });
}

const computeFunctionSignature = (func) => {
    return ethers.utils.hexDataSlice(
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes(func)),
        0,
        4
    )
}

describe("WeightedBits", () => {
    // library has different function selector encoding than a regular contract
    const WEIGHTED_BITS_SELECTOR = computeFunctionSignature("weightedBits(WeightedBits.MemoryUint256,uint256,uint256)");
    const callWeightedBits = _callWeightedBits(WEIGHTED_BITS_SELECTOR);

    let weightedBitsLib;

    beforeEach(async () => {
        ethers.getContractFactoryFromArtifact()
        const WeightedBitsLib = await ethers.getContractFactory("WeightedBits");
        weightedBitsLib = await WeightedBitsLib.deploy();
    });

    it("Deterministic", async () => {
        const seed = "123";

        const a1 = await callWeightedBits(weightedBitsLib, seed, 1, 2);
        await helpers.mine();
        const a2 = await callWeightedBits(weightedBitsLib, seed, 1, 2);
        
        chai.expect(a1).to.be.eq(a2);
    });
    
    it("Different for different seeds", async () => {
        const seed1 = "123";
        const seed2 = "124";
        
        const a1 = await callWeightedBits(weightedBitsLib, seed1, 1, 2);
        const a2 = await callWeightedBits(weightedBitsLib, seed2, 1, 2);
        
        chai.expect(a1).to.not.be.eq(a2);
    });
    
    it("d == 0 acts like d == 1", async () => {
        const seed = "123";

        const a1 = await callWeightedBits(weightedBitsLib, seed, 2, 0);
        const a2 = await callWeightedBits(weightedBitsLib, seed, 2, 1);
        
        chai.expect(a1).to.be.eq(a2);
    });

    it("p == 0 acts like p == 1", async () => {
        const seed = "123";

        const a1 = await callWeightedBits(weightedBitsLib, seed, 0, 2);
        const a2 = await callWeightedBits(weightedBitsLib, seed, 1, 2);
        
        chai.expect(a1).to.be.eq(a2);
    });
});
