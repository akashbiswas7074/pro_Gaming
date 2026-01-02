const hre = require("hardhat");

async function main() {
    console.log("Deploying Pro Game Ecosystem...");

    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Contract addresses (update these for your deployment)
    const USDT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS || "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"; // BSC Testnet USDT
    const MASTER_WALLET = process.env.MASTER_WALLET_ADDRESS || deployer.address;
    const CREATOR_WALLET = process.env.CREATOR_WALLET_ADDRESS || deployer.address;

    // Deploy the contract
    const ProGameEcosystem = await hre.ethers.getContractFactory("ProGameEcosystem");
    const proGame = await ProGameEcosystem.deploy(
        USDT_ADDRESS,
        MASTER_WALLET,
        CREATOR_WALLET
    );

    await proGame.deployed();

    console.log("ProGameEcosystem deployed to:", proGame.address);
    console.log("");
    console.log("Configuration:");
    console.log("- USDT Token:", USDT_ADDRESS);
    console.log("- Master Wallet:", MASTER_WALLET);
    console.log("- Creator Wallet:", CREATOR_WALLET);
    console.log("");
    console.log("Next steps:");
    console.log("1. Verify the contract on BscScan:");
    console.log(`   npx hardhat verify --network bscTestnet ${proGame.address} ${USDT_ADDRESS} ${MASTER_WALLET} ${CREATOR_WALLET}`);
    console.log("");
    console.log("2. Set BD Wallets (20 addresses)");
    console.log("3. Set Promoter Wallets (4 addresses)");
    console.log("4. Update .env with PRO_GAME_CONTRACT_ADDRESS=" + proGame.address);

    // Save deployment info to file
    const fs = require("fs");
    const deploymentInfo = {
        network: hre.network.name,
        contractAddress: proGame.address,
        usdtAddress: USDT_ADDRESS,
        masterWallet: MASTER_WALLET,
        creatorWallet: CREATOR_WALLET,
        deployedAt: new Date().toISOString(),
        deployer: deployer.address
    };

    fs.writeFileSync(
        `./deployments/${hre.network.name}-deployment.json`,
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("");
    console.log("Deployment info saved to ./deployments/" + hre.network.name + "-deployment.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
