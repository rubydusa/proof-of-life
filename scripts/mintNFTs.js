const hre = require("hardhat");
const { ethers } = hre;

const deploymentData = require("./deployment_data.json");

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const data = [
    {
        input: "16525311612982264447",
        output: "12829440",
    },
    {
        input: "837893472879078924",
        output: "5199248551497962076",
    },
    {
        input: "2103295572183075095",
        output: "3193278657754857480",
    },
    {
        input: "5692235341487311289",
        output: "1884307456",
    },
]

async function main() {
    const [deployerAccount] = await ethers.getSigners();
    const GOLNFT = await ethers.getContractFactory("GOLNFT", deployerAccount);
    const golNFT = GOLNFT.attach(deploymentData.contracts.golNFT.address);
    
    for ({input, output} of data) {
		const [a, b, c, [solutionHash, hash]] = await hre.circom.generateCalldata("Main3N8x8", {
            data: [input], 
            address: deployerAccount.address,
        });

        await golNFT.setPrizenum(output);
        await sleep(5000);
		await golNFT.mint(solutionHash, hash, a, b, c);
        await sleep(5000);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});