---
sidebar_position: 3
title: Solution Architecture
---

## Introduction

&emsp; To effectively document and communicate the Reevo architecture, we adopted the **C4 Model**. This model is not a new way to design software, but rather a way to visualize and describe an existing or proposed architecture at different levels of abstraction.

&emsp; The main advantage of C4 is that it offers the "right amount of detail for the right audience." We can think of it as the Google Maps for our architecture:

**Level 1 (Context): The view of the world.**

**Level 2 (Containers): The view of the country or city.**

**Level 3 (Components): The view of a neighborhood or street.**

**Level 4 (Code): The view of a specific house (usually covered by UML class diagrams or the code itself).**

For our project, we detailed the first three levels, which provide a complete understanding of the Reevo's structure and functioning.

## Level 1: System Context (The Helicopter View)
&emsp; The first diagram establishes the general scenario, showing how our system fits into the world. It answers the question: "What is the Reevo system, who uses it, and what other systems does it interact with?".

<p style={{textAlign: 'center'}}> Architecture Level C1</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/arquitetura_c1.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

>For Better visualization [click here](https://www.canva.com/design/DAG0SgLAcT8/hKnnOkM1vyxHNdrywB5QxA/edit?utm_content=DAG0SgLAcT8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

**The Actors:** Three main actors interact with the system:

    - Farmer: The credit borrower seeking agile and fair financing.

    - Investor: The individual offering capital in pursuit of profitability and impact.

    - Admin: The platform operator, responsible for management, support, and manual process validation.


**The Reevo System:** At the heart of the diagram is the Central System, our P2P credit platform for agribusiness.


**External Systems:** Reevo does not operate in isolation. It relies on critical integrations with external systems to function, including:

 - **Certifying Authority (ICP-Brasil):** For digital signature and legal validation of the Rural Product Bill (CPR).

- **Payment Gateway:** To process the financial flow (on/off-ramp) between Brazilian Reais (BRL) and the stablecoin (USDC).

- **CPR Registrar:** To officially register credit contracts, granting them legal validity.

- **Government and Credit Bureaus:** To consult external data that feeds our risk analysis engine.

This diagram is fundamental for anyone, technical or non-technical, to understand the purpose and boundaries of our project.

## Level 2: Containers (The Solution Structure)

&emsp; Zooming into the "Reevo System," the container diagram exposes the high-level architecture of the application. It answers the question: "What are the main building blocks of the system and how do they communicate?".

>For Better visualization [click here](https://www.canva.com/design/DAG0SgLAcT8/hKnnOkM1vyxHNdrywB5QxA/edit?utm_content=DAG0SgLAcT8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

<p style={{textAlign: 'center'}}> Architecture Level C2</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/arquitetura_c2.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

> Note: "Container" here is a C4 term for an executable building block or a data store, not necessarily a Docker container.

The Reevo architecture is divided into four main layers:

**Web Application (Frontend):** The entry point for our users. It is a series of web/mobile pages that provides a fluid and responsive user experience for Farmers and Investors.

**Backend Services (Microservices):** The platform's brain. We adopted a microservices architecture to ensure scalability, modularity, and maintainability. Each service has a unique and well-defined responsibility, such as:

- **Accounts Service:** Manages identity and authentication.

- **Credit Analysis Service:** Orchestrates the AgroScore calculation.

- **Marketplace Service:** Manages investment opportunities.

- **Digital Wallet Service:** Controls balances and transactions.

- **Contracts Service:** Manages the CPR lifecycle.

- **Notifications Service:** Centralizes communication dispatch.

**Storage:** We use different storage technologies for different needs, an approach known as **"polyglot persistence"**:

  - **Database SQL:** For transactional and structured data requiring consistency.

  - **Database NoSQL:** For semi-structured data, such as user documents and audit logs.

  - **Cache:** For volatile and frequently accessed data, improving performance.

  - **Ledger Blockchain:** To ensure the immutability and transparency of investment transactions (tokens).

  - **Logs:** To centralize logs from all services, ensuring observability.

  This diagram shows the logical and technological decomposition of our solution, serving as the main map for the development team.

---
## Level 3: Components (The Microservices Interior)

&emsp; At the deepest level of detail, we zoom into our most critical containers (microservices) to expose their internal Components. These diagrams answer the question: "How is each service designed internally and how does it fulfill its responsibility?".

&emsp; This level is the map that guides the developer in organizing the code and implementing the functionalities of a specific service. Below, we detail the components of six of our most important services.

### Accounts Service

&emsp; This service is the foundation of user identity and security on the platform. It is the single source of truth for all registration and authentication data. Its internal components are divided by responsibility:

`Authentication Manager`: handles access security (login, passwords, 2FA).

`Profile Manager`: allows management of user registration data.

`Onboarding/KYC Manager`: orchestrates the identity verification process. For essential communications, such as sending welcome or password reset emails, it uses an `Integrator of Notifications.`

<p style={{textAlign: 'center'}}> Accounts Service</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_contas.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>


### Credit Analysis Service

&emsp; This service orchestrates the complex risk analysis process. Its internal components include:

`API Controller` as the entry port.

`Analysis Coordinator` to manage the flow.

`Integrators` to communicate with external systems (Bureaus and Backoffice).

`Score Engine (ML)` which contains the calculation logic.

`Repository` to persist the analysis data.

<p style={{textAlign: 'center'}}> Credit Analysis Service</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_analise_credito.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

### Contracts Service
&emsp; Focused on the platform's legal dimension, this service manages the most important legal asset: the Rural Product Bill (CPR).

`CPR Generator` creates the document from the credit analysis data.

`Digital Signature Coordinator` manages the integration with the ICP-Brasil provider for collecting the farmer's signature.

 Once signed, the `Asset Registration Coordinator` takes over, communicating with the official registrar `(B3/CERC)` to ensure the legal validity and compliance of the title.
<p style={{textAlign: 'center'}}> Contracts Service</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_contratos.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

### Digital Wallet Service

&emsp; This service is the platform's digital vault, acting as a complete and secure custody service. Its responsibility is to manage all user financial assets. Its components include:

`API Controller` as an interface.

`Wallet Manager` for business logic (balances, transfers).

`Ledger Repository` to record all transactions immutably.

For cryptocurrency operations, it relies on a `Blockchain Monitor` to detect deposits and a `Transaction Transmitter` to process withdrawals, which in turn interacts with the most critical and isolated component, the **Key Manager (HSM)**, the sole party responsible for signing transactions and ensuring fund security.

<p style={{textAlign: 'center'}}> Digital Wallet Service</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_carteira_digital.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

### Marketplace Service

&emsp; Acting as Reevo's showcase and trading environment, this service manages the complete lifecycle of investment opportunities. It consists of:

`API Controller` for frontend interaction and two main logical components
  - `Primary Offer Manager`: which handles the listing and fundraising of new CPRs.
  
  - `Secondary Offer Manager`: which enables P2P trading among investors.
  
  To ensure the financial integrity of operations, the `Transaction Coordinator` orchestrates communication with the **Digital Wallet Service**, ensuring that fund and asset transfers occur atomically and securely.

<p style={{textAlign: 'center'}}> Marketplace Service</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_marketplace.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

### Notifications Service

&emsp; Designed to be the platform's communication hub, this service functions decoupled and asynchronously. Its main entry point is a `Message Consumer`, which listens for events from other services (e.g., UserRegistered, PaymentReceived) published to a Message Broker.

 Upon receiving an event, the `Template Manager` populates the appropriate message, and the `Channel Orchestrator` decides how to send it _(Email, Push Notification, SMS)_ based on user preferences, utilizing specific Gateways for each communication channel. This architecture ensures that the notification system is resilient and does not delay the platform's main operations.

<p style={{textAlign: 'center'}}> Notifications Service</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/servico_notificacoes.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>