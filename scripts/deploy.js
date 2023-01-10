const fs = require("fs");
const hre = require("hardhat");
const { ethers } = hre;

const W = "8";
const H = "8";
const EXPIRY = "900";

// on average, P / 2 ** BITS_OUT_OF alive cells in a random board generation 
const P = "3";
const BITS_OUT_OF = "6";

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    const [deployerAccount] = await ethers.getSigners();

    const GOLNFT = await ethers.getContractFactory("GOLNFT", deployerAccount);
    const GOLVerifier = await hre.circom.getVerifierFactory("Main3N8x8", deployerAccount);
    const GOLSVG = await ethers.getContractFactory("GOLSVG", deployerAccount);
    const GOLMetadata = await ethers.getContractFactory("GOLMetadata", deployerAccount);
    const GOLRandom = await ethers.getContractFactory("GOLRandom", deployerAccount);
    
    const preBalance = await deployerAccount.getBalance();

    const golRandom = await GOLRandom.deploy(P, BITS_OUT_OF);
    await golRandom.deployTransaction.wait();
    const golSVG = await GOLSVG.deploy();
    await golSVG.deployTransaction.wait();
    const golMetadata = await GOLMetadata.deploy("https://medium.com/coinmonks/proof-of-life-zero-knowledge-proof-implementation-of-conways-game-of-life-with-circom-and-6438521fb2b1");
    await golMetadata.deployTransaction.wait();
    const golVerifier = await GOLVerifier.deploy();
    await golVerifier.deployTransaction.wait();
    const golNFT = await GOLNFT.deploy(golVerifier.address, golRandom.address, golSVG.address, golMetadata.address, W, H, EXPIRY);
    await golNFT.deployTransaction.wait();
    
    const postBalance = await deployerAccount.getBalance();
    
    const deploymentData = {
        deployerAddress: deployerAccount.address,
        deploymentGasCost: preBalance.sub(postBalance).toString(),
        contracts: {
            golRandom: {
                address: golRandom.address
            },
            golSVG: {
                address: golSVG.address
            },
            golMetadata: {
                address: golMetadata.address
            },
            golVerifier: {
                address: golVerifier.address
            },
            golNFT: {
                address: golNFT.address
            },
        }
    }
    
    fs.writeFileSync(`${__dirname}/deployment_data.json`, JSON.stringify(deploymentData, null, 4))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});