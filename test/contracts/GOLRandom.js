const hre = require("hardhat");
const chai = require("chai");

const { ethers } = hre; 

describe("GOLRandom", () => {
    describe("Weighted Bits", () => {
        let golRandom;
        
        before(async () => {
            const GOLRandom = await ethers.getContractFactory("GOLRandom");
            golRandom = await GOLRandom.deploy("0", "0", "0", "0");
        });
        
        const testCases = [
            {
                comment: "random test case #1 p = 0/4",
                len: "8",
                p: "0",
                bitsOutOf: "2",
                input: "116",
                expected: "0",
            },
            {
                comment: "random test case #1 p = 1/4",
                len: "8",
                p: "1",
                bitsOutOf: "2",
                input: "116",
                expected: "129",
            },
            {
                comment: "random test case #1 p = 2/4",
                len: "8",
                p: "2",
                bitsOutOf: "2",
                input: "116",
                expected: "197",
            },
            {
                comment: "random test case #1 p = 3/4",
                len: "8",
                p: "3",
                bitsOutOf: "2",
                input: "116",
                expected: "207",
            },
            {
                comment: "random test case #1 p = 4/4",
                len: "8",
                p: "4",
                bitsOutOf: "2",
                input: "116",
                expected: "255",
            },
        ];
        
        testCases.map(({comment, len, p, bitsOutOf, input, expected}) => {
            it(comment, async () => {
                chai.expect(await golRandom.weightedBits(len, input, p, bitsOutOf)).to.be.eq(expected);
            });
        });
    });
});
