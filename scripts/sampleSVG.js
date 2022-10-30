const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    const GOLSVG = await ethers.getContractFactory("GOLSVG");
    const golSVG = await GOLSVG.deploy();
    
    console.log(await golSVG.svg("1234", "4543320024158208"));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});