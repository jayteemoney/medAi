import { ethers } from "hardhat";

async function main(): Promise<void> {
  console.log("Deploying HealthRecordRegistry to Base Sepolia...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("Deploying contract...");
  const HealthRecordRegistry = await ethers.getContractFactory("HealthRecordRegistry");
  const healthRecordRegistry = await HealthRecordRegistry.deploy();

  await healthRecordRegistry.waitForDeployment();

  const contractAddress = await healthRecordRegistry.getAddress();

  console.log("HealthRecordRegistry deployed to:", contractAddress);
  console.log("\nDeployment Summary:");
  console.log("═══════════════════════════════════════════════════════");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Deployer:", deployer.address);
  console.log("═══════════════════════════════════════════════════════\n");

  // Verify contract on Basescan
  const network = await ethers.provider.getNetwork();
  if (network.chainId === 84532n) { // Base Sepolia chainId
    console.log("Waiting for block confirmations...");
    const deployTx = healthRecordRegistry.deploymentTransaction();
    if (deployTx) {
      await deployTx.wait(6);
    }

    console.log("\nVerifying contract on Basescan...");
    try {
      const hre = await import("hardhat");
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified successfully!");
    } catch (error: any) {
      console.log("Verification failed:", error.message);
    }
  }

  console.log("\nDeployment complete!");
  console.log("\nNext steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update frontend/.env with VITE_CONTRACT_ADDRESS");
  console.log("3. Update frontend/src/contracts/contractAddress.ts");
  console.log("4. Run: cd frontend && npm run dev\n");
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
