---
sidebar_position: 4
title: Data Flow
---

## Introduction

&emsp;The data flow describes how information and values circulate among the different actors (farmers, investors, and administrators), the platform's internal services, and integrated external systems (e.g., payment gateways, CPR registrars, credit bureaus).

&emsp;These flows were designed considering the personas **Sérgio (Farmer)** and **Marina (Investor)** to ensure the system operates consistently, securely, and transparently, avoiding communication failures and ensuring the traceability of each operation.

&emsp;To represent these interactions, six main flows were elaborated: Credit Request and Approval, Investment Execution, Installment Payment and Distribution (Asynchronous), Secondary Market Sale, Fund Withdrawal (Off-Ramp), and Default Management, each detailing the critical data and integration steps that support the platform's operation.

## Credit Request and Approval Flow

&emsp;This flow describes the journey of the farmer Sérgio from registration until his proposal is listed on the marketplace. It demonstrates the interaction between the user, the automated system, and the "human in the loop" (Credit Analyst).


<p style={{textAlign: 'center'}}> Credit Request and Approval Flow</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/fluxo_solicitacao_credito_reevo.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

> Note: For better visualization:

> https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30 

<details>
  <summary>Credit Request and Approval Flow</summary>

```murmaid
sequenceDiagram
    participant Sérgio as Farmer (Browser)
    participant FE as Frontend
    participant GW as API Gateway
    participant Contas as Accounts Service
    participant Analise as Credit Analysis Service
    participant Backoffice as Analyst Interface
    participant Analista as Credit Analyst

    Sérgio->>FE: 1. Fills out registration and application
    FE->>GW: 2. Sends data and documents
    GW->>Contas: 3. Creates/Authenticates user
    GW->>Analise: 4. Starts credit analysis
    
    activate Analise
    Analise-->>GW: 5. Responds that analysis has started
    GW-->>FE: 6. Displays "Analysis in progress"
    FE-->>Sérgio: Displays "Analysis in progress"
    
    Analise->>Bureaus Externos: 7. Consults market score (API)
    Bureaus Externos-->>Analise: 8. Returns score
    Analise->>Analise: 9. Combines data and generates Reevo Score (ML)
    Analise->>Backoffice: 10. Creates validation task for Analyst
    deactivate Analise

    Note right of Analista: -- Manual Parallel Process (hours) --
    Analista->>Backoffice: 11. Accesses task queue
    Analista->>Backoffice: 12. Validates documents and data
    Analista->>Backoffice: 13. Clicks "Approve Credit"

    Backoffice->>GW: 14. Notifies system about approval
    GW->>Analise: 15. Finalizes analysis status
    
    activate Analise
    Analise->>Contas: 16. Sends "Credit Approved" notification to user
    deactivate Analise
    
    Note over Sérgio, FE: -- Signature and Listing --
    FE->>Sérgio: 17. Displays proposal and requests CPR signature
    Sérgio->>FE: 18. Signs CPR with e-CPF
    FE->>GW: 19. Sends signed CPR
    GW->>Serviço de Contratos: 20. Validates and sends to registrar (API)
    Serviço de Contratos-->>GW: 21. Confirms registration
    GW->>Serviço de Marketplace: 22. Lists the investment opportunity
```
</details>

Investment Execution Flow

 This flow shows the journey of the investor Marina, from fund deposit (via Pix) to allocation in a credit opportunity.

<p style={{textAlign: 'center'}}> Investment Execution Flow</p>
<div style={{margin: 15}}>
<div style={{textAlign: 'center'}}>
<img src={require("../../static/img/fluxo_realizacao_investimento_reevo.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />


</div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

    Note: For better visualization:

    https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30

<details>
<summary>Murmaid Investment Execution Flow</summary>

sequenceDiagram
    participant Marina as Investor (Browser)
    participant FE as Frontend
    participant GW as API Gateway
    participant Marketplace as Marketplace Service
    participant Carteira as Digital Wallet Service
    participant Pagamentos as Payment Gateway

    Marina->>FE: 1. Accesses marketplace and chooses opportunity
    FE->>GW: 2. Requests opportunity details
    GW->>Marketplace: 3. Searches data
    Marketplace-->>GW: 4. Returns data
    GW-->>FE: 5. Displays details for Marina

    Marina->>FE: 6. Clicks "Invest" and defines value
    FE->>GW: 7. Attempts to allocate investment
    GW->>Carteira: 8. Checks USDC balance
    
    alt Insufficient Balance
        Carteira-->>GW: 9a. Insufficient balance
        GW-->>FE: 10a. Informs insufficient balance
        FE->>Marina: 11a. Suggests deposit
        
        Marina->>FE: 12a. Requests deposit via Pix
        FE->>GW: 13a. Generates Pix charge
        GW->>Pagamentos: 14a. Creates Pix QR Code
        Pagamentos-->>GW: 15a. Returns QR Code
        GW-->>FE: 16a. Displays QR Code
        FE->>Marina: 17a. Marina pays the Pix
        
        Pagamentos-->>GW: 18a. Webhook: Payment Confirmed!
        GW->>Carteira: 19a. Credits USDC to Marina's wallet
    end

    Note over Marina, FE: Marina now tries to invest again with balance
    FE->>GW: 9b. Attempts to allocate investment
    GW->>Carteira: 10b. Checks balance (now sufficient)
    Carteira-->>GW: 11b. Balance OK. Blocks value.
    GW->>Marketplace: 12b. Confirms investment in opportunity
    Marketplace-->>GW: 13b. Investment registered
    GW-->>FE: 14b. Success!
    FE-->>Marina: 15b. Displays investment confirmation

</details>
Installment Payment and Distribution Flow (Asynchronous)

 This is the most critical flow from a financial perspective. It shows how the payment of an installment by the farmer triggers an asynchronous process to calculate fees/taxes and distribute the net value to investors securely and scalably.

<p style={{textAlign: 'center'}}> Installment Payment and Distribution Flow</p>
<div style={{margin: 15}}>
<div style={{textAlign: 'center'}}>
<img src={require("../../static/img/fluxo_recebimento_investimento_reevo.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />


</div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

    Note: For better visualization:

    https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30

<details>
<summary>Murmaid Installment Payment and Distribution Flow (Asynchronous)</summary>

sequenceDiagram
  participant Sérgio as Farmer (Browser)
  participant FE as Frontend
  participant GW as API Gateway
  participant Pagamentos as Payment Gateway
  participant Broker as Message Broker (Queue)
  participant Distribuidor as Distribution Service
  participant Carteira as Digital Wallet Service

  Sérgio->>FE: 1. Accesses panel and clicks "Pay Installment"
  FE->>GW: 2. Requests payment data
  GW->>Serviço de Contratos: 3. Generates charge (Pix/Boleto)
  Serviço de Contratos-->>GW: 4. Returns data
  GW-->>FE: 5. Displays QR Code / Typeable line
  
  Note right of Sérgio: Sérgio makes the payment at his bank...
  
  Pagamentos-->>GW: 6. Webhook: Payment Confirmed!
  
  activate GW
  GW->>Broker: 7. Publishes event "PaymentMade" with transaction data
  GW-->>Pagamentos: 8. Confirms webhook receipt (HTTP 200 OK)
  deactivate GW
  
  Note over Broker, Distribuidor: -- Background Processing --
  
  Broker-->>Distribuidor: 9. Delivers event "PaymentMade"
  
  activate Distribuidor
  Distribuidor->>Serviço de Contratos: 10. Fetches contract and investor details
  Serviço de Contratos-->>Distribuidor: 11. Returns list of investors and % participation
  
  Distribuidor->>Distribuidor: 12. Calculates platform fees and taxes (IR)
  
  loop For each Investor
      Distribuidor->>Distribuidor: 13. Calculates net amount to be credited
      Distribuidor->>Carteira: 14. Credits USDC to Investor's wallet
  end
  
  Distribuidor->>Serviço de Notificações: 15. Sends notifications to investors
  deactivate Distribuidor

  </details>

  Secondary Market Sale Flow

 This flow details how an investor (Marina, the seller) can sell her investment share (Credit Token) to another investor (Carlos, the buyer) before the contract maturity. It is an exchange process within the platform that ensures the secure and atomic transfer of both the share and the USDC value.

<p style={{textAlign: 'center'}}> Secondary Market Sale Flow</p>
<div style={{margin: 15}}>
<div style={{textAlign: 'center'}}>
<img src={require("../../static/img/fluxo_venda_token_mercado_secundario.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />


</div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

    Note: For better visualization:

    https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30

<details>
<summary>Murmaid Secondary Market Sale Flow</summary>

sequenceDiagram
  participant Marina as Seller (Browser)
  participant Carlos as Buyer (Browser)
  participant FE as Frontend
  participant GW as API Gateway
  participant Marketplace as Marketplace Service
  participant Carteira as Digital Wallet Service

  Note over Marina, FE: -- Sale Stage --
  Marina->>FE: 1. Accesses portfolio and selects token to sell
  FE->>GW: 2. Requests suggestion for fair price
  GW->>Marketplace: 3. Calculates fair price (based on risk/time)
  Marketplace-->>GW: 4. Returns suggestion
  GW-->>FE: 5. Displays suggestion for Marina

  Marina->>FE: 6. Defines sale price and clicks "Offer"
  FE->>GW: 7. Sends sale order
  GW->>Marketplace: 8. Lists the token on the secondary market
  GW->>Carteira: 9. Flags Marina's token as "Offered" (blocked for other actions)

  Note over Carlos, FE: -- Purchase Stage --
  Carlos->>FE: 10. Browses secondary market and sees Marina's offer
  Carlos->>FE: 11. Clicks "Buy"
  FE->>GW: 12. Sends purchase order

  GW->>Carteira: 13. Checks if Carlos has sufficient USDC balance
  alt Sufficient Balance
      Carteira-->>GW: 14. Balance OK. Initiates atomic transaction.
      
      activate Carteira
      Carteira->>Carteira: 15. Debits USDC from Carlos's wallet
      Carteira->>Carteira: 16. Credits USDC to Marina's wallet
      Carteira->>Carteira: 17. Transfers Credit Token ownership from Marina to Carlos
      deactivate Carteira

      Carteira-->>GW: 18. Confirms that the exchange was completed
      GW->>Marketplace: 19. Removes the offer from the market
      GW-->>FE: 20. Confirms purchase to Carlos
      FE-->>Carlos: 21. Displays "Purchase successful!"
      
      Note right of GW: Notifications are sent to Marina and Carlos in background
  else Insufficient Balance
      Carteira-->>GW: 14b. Insufficient balance
      GW-->>FE: 15b. Informs error
      FE-->>Carlos: 16b. Displays "Insufficient balance to complete purchase."
  end

  </details>

Fund Withdrawal Flow (Off-Ramp)

<p style={{textAlign: 'center'}}> Fund Withdrawal Flow</p>
<div style={{margin: 15}}>
<div style={{textAlign: 'center'}}>
<img src={require("../../static/img/fluxo_saque_fundos.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />


</div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

 This flow shows the two paths an investor can take to withdraw their USDC balance from the platform: converting to Brazilian Reais (BRL) and receiving via Pix, or transferring directly to an external cryptocurrency wallet.

    Note: For better visualization:

    https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30

<details>
<summary>Murmaid Secondary Market Sale Flow</summary>
sequenceDiagram
  participant Investidor as Investor (Browser)
  participant FE as Frontend
  participant GW as API Gateway
  participant Contas as Accounts Service
  participant Carteira as Digital Wallet Service
  participant Pagamentos as Payment Gateway

  Investidor->>FE: 1. Requests withdrawal and chooses method

  alt Method: Withdrawal to Bank Account (Pix)
      Investidor->>FE: 2a. Informs withdrawal amount in USDC
      FE->>GW: 3a. Initiates withdrawal for BRL
      
      GW->>Contas: 4a. Searches for bank account details (same ownership)
      Contas-->>GW: 5a. Returns bank details
      
      GW->>Carteira: 6a. Requests locking of USDC balance
      Carteira-->>GW: 7a. Balance verified and locked
      
      GW->>Pagamentos: 8a. Requests USDC -> BRL conversion and Pix dispatch
      Pagamentos-->>GW: 9a. Confirms receipt of withdrawal order
      
      Note right of Pagamentos: Conversion and Pix process takes a few minutes...
      
      Pagamentos-->>GW: 10a. Webhook: Pix Transfer Complete!
      GW->>Carteira: 11a. Debits the locked USDC balance
      GW->>Serviço de Notificações: 12a. Sends success notification
  end

  alt Method: Withdrawal to Crypto Wallet
      Investidor->>FE: 2b. Informs withdrawal amount and external wallet address
      FE->>GW: 3b. Initiates crypto withdrawal
      
      GW->>Carteira: 4b. Requests crypto withdrawal transaction to external address
      
      activate Carteira
      Carteira->>Carteira: 5b. Checks balance and locks value
      Carteira->>Carteira: 6b. Constructs and signs transaction (with secure keys)
      Carteira->>Blockchain: 7b. Transmits transaction to the network (e.g., Polygon)
      deactivate Carteira
      
      Note right of Blockchain: Transaction being confirmed on the network...
      
      Blockchain-->>Carteira: 8b. Event: Transaction confirmed!
      Carteira->>Carteira: 9b. Debits the locked balance
      Carteira->>Serviço de Notificações: 10b. Sends success notification
  end

  </details>

Default Management Flow

 This is a system flow, not initiated directly by a user. It describes the automated process the platform executes daily to identify overdue installments, apply the due penalties, and notify all involved parties, ensuring portfolio risk management.

<p style={{textAlign: 'center'}}> Default Management Flow</p>
<div style={{margin: 15}}>
<div style={{textAlign: 'center'}}>
<img src={require("../../static/img/fluxo_inadimplencia.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />


</div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

    Note: For better visualization:

    https://www.canva.com/design/DAG0UzRCy5Q/w-yq85d-KYoxx_jXFQzDFA/edit?ui=e30

<details>
<summary>Murmaid Default Management Flow</summary>
Snippet de código


sequenceDiagram
  participant Scheduler as Scheduler (Cron Job)
  participant Contratos as Contracts Service
  participant Notificacoes as Notifications Service
  participant Backoffice as Admin Interface

  Scheduler->>Contratos: 1. Daily Trigger: "Check overdue installments"
  
  activate Contratos
  Contratos->>Contratos: 2. Searches DB for installments with date_due < today AND status != "Paid"
  
  loop For each Overdue Installment found
      Contratos->>Contratos: 3. Updates installment status to "Overdue"
      Contratos->>Contratos: 4. Calculates fine (2%) and late interest (1%/month)
      Contratos->>Contratos: 5. Saves the new updated installment value
      
      Contratos->>Notificacoes: 6. Sends overdue notification to the Farmer
      Contratos->>Notificacoes: 7. Sends default notification to the Investors of that CPR
      
      Contratos->>Backoffice: 8. Creates a risk alert on the administrator's dashboard
  end
  deactivate Contratos

</details>
