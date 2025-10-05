const hre = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deploy do PeerSeed...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying com a conta:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Saldo da conta:", hre.ethers.formatEther(balance), "MATIC");
  
  console.log("\n⏳ Fazendo deploy do contrato...");
  const PeerSeed = await hre.ethers.getContractFactory("PeerSeed");
  const peerSeed = await PeerSeed.deploy();
  
  await peerSeed.waitForDeployment();
  const address = await peerSeed.getAddress();
  
  console.log("✅ Contrato PeerSeed deployed em:", address);
  console.log("🔗 Veja no explorer:", `https://amoy.polygonscan.com/address/${address}`);
  
  console.log("\n📋 Para verificar o contrato, execute:");
  console.log(`npx hardhat verify --network polygonAmoy ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro:", error);
    process.exit(1);
  });
