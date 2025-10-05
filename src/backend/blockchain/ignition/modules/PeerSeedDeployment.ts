import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PeerSeedDeployment", (m) => {
  const usdcAddress = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582";
  const deployerAddress = m.getAccount(0);
  
  const peerseedCPR = m.contract("contracts/PeerSeedCPR.sol:PeerSeedCPR", [
    usdcAddress,
    deployerAddress,
    deployerAddress
  ]);

  return { peerseedCPR };
});
