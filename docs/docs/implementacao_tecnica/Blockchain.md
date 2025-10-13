---
sidebar_position: 3
title: Blockchain
---  

&emsp;The Reevo will be developed on the Polkadot/Substrate ecosystem foundation to meet the rigorous demands of the credit market. This technological foundation ensures the institutional security and interoperability required for compliance and efficient communication.
To maximize Polkadot's potential, Reevo utilizes **Moonbeam**, which is the leading parachain and primary EVM implementation in the ecosystem, offering high liquidity and a robust ecosystem. This guarantees a secure deployment of the **Waterfall Smart Contracts**, but also facilitates immediate integration with the stablecoins already present in the Polkadot hub.

### Business Potential

| Strategic Value for PeerSeed      | Detail                                                                                                                                                                                                                                          |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shared Institutional Security** | The Maximum Security inherited from Polkadot’s Relay Chain is the quality seal that attracts **Institutional Investors**.                                                                                                                       |
| **Native Interoperability (XCM)** | **XCM (Cross-Consensus Messaging)** transforms the PeerSeed Credit Token into a **global asset**. It allows funding to come from any other Parachain (e.g., stablecoin or yield Parachains) securely and natively, maximizing the capital base. |
| **Sovereign Scalability**         | Using a Parachain means gas autonomy and optimization for the high throughput of the **Waterfall**.                                                                                                                                             |

&emsp;To attract the Web3 community (which seeks passive _yield_), PeerSeed will utilize a **Hybrid Pool Mechanism** that guarantees initial funding without the risks of centralized custody. This revolutionary P2P/DeFi Hybrid Model is specifically designed to solve the primary pain point of traditional peer-to-peer lending: slowness, by introducing a Dynamic Liquidity Pool that ensures instant financing while preserving the low-risk nature of our Escrow per Opportunity model. This approach fundamentally transforms capital trading in agribusiness, shifting loan funding from dependence on a single bank or anchor investor to a passive yield asset for any stablecoin holder on the Polkadot network.

&emsp;The Pool is considered **Revolutionary** due to its key benefits and innovative differentiators:

- **Democratization of Yield and Market Access:** It allows Web3 investors (seeking yield on USDC) to participate in the Pool, receiving a base return while gaining exposure to the Brazilian agricultural credit market—a completely new asset class for them.
    
- **Decentralized Risk Model:** It eliminates the risks of centralized custody. The Pool is a Smart Contract with an Escrow per Opportunity model that isolates risk per Credit Right Certificate (CPR) and guarantees fund return in case of failure.
    
- **Yield Aggregation as an Incentive:** The Dynamic Liquidity Pool captures **Aggregated Yield** from other secure Polkadot Parachains (e.g., Acala/Karura) by staking or allocating idle USDC. This collected yield is then used to subsidize origination fees for the Farmer (João), effectively turning the cost of maintaining the Pool into a financial incentive.
    
- **Unlimited Funding via XCM:** The use of **XCM (Cross-Consensus Messaging)** is a major draw for the Web3 community, allowing PeerSeed to attract capital (USDC/Stablecoins) from **any Polkadot Parachain**. This transforms the agricultural credit market into a truly global, interoperable asset for the entire Web3 ecosystem.

### Technical Flow

&emsp;The operation is divided into three critical moments, with the Pool acting as a liquidity Buffer.

#### 1. Asset Origination and Escrow (Creating the Debt)

| Technical Term              | Explained Action                                                                                                                                    | Web3 Potential (What the Engineer Sees)                                                                                                 |
| :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Escrow per Opportunity**  | The individualized Escrow Smart Contract **locks the USDC** from Marina until the fundraising is complete (100%).                                   | **Isolated Risk:** The Smart Contract security protects the Investor from a centralized Pool risk.                                      |
| **Acceleration Pool (NEW)** | The Dynamic Liquidity Pool (a separate Smart Contract) is activated. It is the source of **immediate funding**.                                     | **Passive Yield:** Attracts DeFi users seeking yield on their stablecoins (USDC) before they are allocated to individual loans.         |
| **Conditional Trigger**     | The PeerSeed backend can opt to withdraw funding from the Escrow or the Pool (if the Escrow takes too long), **guaranteeing the promise of speed**. | **Leverage:** The platform leverages DeFi yield capital to ensure the promise of release in a shorter time than the traditional market. |

#### 2. Liquidity and Atomic Swap

| Technical Term             | Explained Action                                                                   | Web3 Potential (What the Engineer Sees)                                                                                                   |
| :------------------------- | :--------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Atomic Swap (ERC-1155)** | The Smart Contract executes the **Token ↔ USDC exchange in a single transaction**. | **Non-Repudiation:** Essential for confidence in the Secondary Market (RF-INV-003).                                                       |
| **XCM Interoperability**   | Allows assets (USDC, GLMR) to be securely transferred between Parachains.          | **Unlimited Market:** Funding is not restricted to Moonbeam; it can come from any stablecoin on the Polkadot network, maximizing capital. |

### Smart Contract: Governance and Risk

&emsp;The platform uses the **AccessControl** standard to segregate functions and mitigate fraud risk.

| Role               | Permitted Smart Contract Action                                                                      | Business Value                                                                                                                                       |
| :----------------- | :--------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ADMIN\_ROLE**    | Create new loans (`createCPR`).                                                                      | Controls the **origination** and *compliance* of new assets on the platform.                                                                         |
| **OPERATOR\_ROLE** | Orchestrates deposits (`depositAndBuyToken`) and executes the **Atomic Swap** (`executeAtomicSwap`). | Ensures that only the validated *backend* can initiate liquidation and asset ownership registration (**Credit Token**).                              |
| **TREASURY\_ROLE** | Triggers the **Waterfall** (`executeWaterfall`) and **Fund Release** (`releaseFunds`).               | **Capital Protection:** The Smart Contract isolates the function of moving money (disbursement/distribution) into a single, high-security key (HSM). |
