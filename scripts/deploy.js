const fs = require("fs");
const hre = require("hardhat");
const { ethers } = hre;

const W = "8";
const H = "8";
const EXPIRY = "84600";

const P = "1";
const BITS_OUT_OF = "2";

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    const [deployerAccount] = await ethers.getSigners();

    const GOLNFT = await ethers.getContractFactory("GOLNFT", deployerAccount);
    const GOLVerifier = await hre.circom.getVerifierFactory("Main3N8x8");
    const GOLSVG = await ethers.getContractFactory("GOLSVG", deployerAccount);
    const GOLRandom = await ethers.getContractFactory("GOLRandom", deployerAccount);
    
    const preBalance = await deployerAccount.getBalance();

    const golRandom = await GOLRandom.deploy(W, H, P, BITS_OUT_OF);
    await sleep(2000);
    const golSVG = await GOLSVG.deploy();
    await sleep(2000);
    const golVerifier = await GOLVerifier.deploy();
    await sleep(2000);
    const golNFT = await GOLNFT.deploy(golVerifier.address, golRandom.address, golSVG.address, W, H, EXPIRY); 
    
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