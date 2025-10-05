const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PeerSeedDeployment", (m) => {
  // USDC na Polygon Amoy Testnet
  const usdcAddress = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
  
  // Usar a conta do deployer para treasury e operator
  const deployerAddress = m.getAccount(0);
  
  const peerseedCPR = m.contract("PeerSeedCPR", [
    usdcAddress,
    deployerAddress,
    deployerAddress
  ]);

  return { peerseedCPR };
});
