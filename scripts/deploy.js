const { ethers } = require("hardhat");

async function main() {
  const EverGreen = await ethers.getContractFactory("EverGreen");
  //get account from hardhat
  const accounts = await ethers.getSigners();
  console.log("Deploying EverGreen with the account:", accounts[0].address);

  const EverGreenContract = await EverGreen.deploy(accounts[0].address);
  await EverGreenContract.deployed();
  
  console.log("EverGreen deployed to:", EverGreenContract.address);


  console.log("Waiting for 10 seconds before verifying contract");

  await new Promise(r => setTimeout(r, 10000));

  const chainId = await ethers.provider.getNetwork();
  if (chainId.chainId == 31337) {
    console.log("Select a network other than Hardhat Network to deploy and verify contracts");
  } else {
    try {
      await run(`verify:verify`, {
        address: EverGreenContract.address,
        constructorArguments: [accounts[0].address],
      });
    } catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log("Already verified!");
      } else {
        console.log(e);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
