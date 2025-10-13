---
sidebar_position: 5
title: Data Modeling
---

## Introduction

&emsp; The database is the pillar of any robust application, especially in a project like Reevo, where data integrity, security, and consistency are paramount. For the transactional core of our system, we opted for a relational database.

&emsp;This choice is due to its compliance with **ACID (Atomicity, Consistency, Isolation, and Durability)** properties, which ensure that complex financial operations (such as an investment or a payment distribution) are either entirely completed successfully or entirely rolled back, never leaving the data in an inconsistent state.

The diagram below illustrates the main entities of our system and how they interconnect to model the Reevo business.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/diagrama_entidade_relacionamento_simples.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

## Detailing Entities and Relationships

&emsp; Below, we justify the existence and structure of each table, focusing on their keys and the relationships they establish.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/diagrama_entidade_relacionamento.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

### Tabela: `usuarios` (Users)

This is the central identity table. It stores the login and profile information of all platform participants, whether they are FARMERS or INVESTORS. The `perfil` (profile) column distinguishes their roles and the functionalities they can access.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_user_diagrama.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

**Keys and Relationships:**

- **Primary Key (PK):** `id` (UUID). It is the unique internal identifier for each user, used to relate them to all other tables.

- **Relationships:** This table is the starting point for most relationships. A user can request multiple `cprs`, make multiple `investimentos`, and register multiple `contas_bancarias`.

### Tabela: `carteiras` (Wallets)

Represents the digital wallet of each user on the platform, where their stablecoin balances (USDC) are maintained and managed. The separation between `saldo_usdc` (available balance) and `saldo_bloqueado_usdc` (locked balance) is crucial for managing funds that are committed to a transaction (like an in-progress investment) but have not yet been debited.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_carteiras_diagrama.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

**Keys and Relationships:**

 - **Primary Key (PK):** `id` (UUID).

- **Foreign Key (FK):** `usuario_id` references `usuarios(id)`. The `UNIQUE` constraint on this key ensures a one-to-one relationship, guaranteeing that each user has exactly one wallet.

### Tabela: `cprs` (Rural Product Bills)

Models the investment opportunity. Each row represents a credit request made by a farmer that has been approved and is ready for fundraising in the marketplace. It contains all the loan terms, such as value, interest rate, and term.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_cprs_diagrama.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

**Keys and Relationships:**

- **Primary Key (PK):** `id` (UUID).

- **Foreign Key (FK):** `agricultor_id` references `usuarios(id)`, creating a one-to-many relationship (one farmer can have several CPRs over time).

### Tabela: `parcelas` (Installments)
Details the payment schedule for a CPR. When a CPR is created, this table is populated with all future installments, their values, and due dates. This is fundamental for payment and default management.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_parcelas_diagrama.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

**Keys and Relationships:**

- **Primary Key (PK):** `id` (UUID).

- **Foreign Key (FK):** `cpr_id` references `cprs(id)`, creating a one-to-many relationship (one CPR is composed of multiple installments).

### Tabela: `investimentos` (Investments)

This is a crucial linking table that materializes the many-to-many relationship between `usuarios` (investors) and `cprs`. Each row means a specific investor allocated a certain value to a specific CPR.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_investimentos_diagrama.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

**Keys and Relationships:**

- **Primary Key (PK):** `id` (UUID).

- **Foreign Keys (FK):**

    - `investidor_id` references `usuarios(id)`.

    - `cpr_id` references `cprs(id)`.

### Tabela: `transacoes` (Transactions)
Functions as the **ledger** (book of record) for all financial movements on the platform. Whether it's a deposit, withdrawal, investment, or interest receipt, every operation generates an **immutable record** in this table, ensuring total traceability and auditability.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_transacoes_diagrama.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

**Keys and Relationships:**

- **Primary Key (PK):** `id` (UUID).

- **Foreign Key (FK):** `carteira_id` references `carteiras(id)`, linking each transaction to a specific wallet.

### Tabela: `ofertas_secundario` (Secondary Offers)
Models the sell offers in the **secondary market**. When an investor decides to sell their share (their investment), a row is created here with the selling price. This allows the platform to function as a P2P trading environment.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_ofertas_secun_diagrama.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

**Keys and Relationships:**

**Primary Key (PK):** `id` (UUID).

**Foreign Key (FK):** `investimento_id` references `investimentos(id)`. The `UNIQUE` constraint on this key ensures that the same investment cannot have more than one active sell offer at the same time.

### Tabela: `contas_bancarias` (Bank Accounts)
Stores users' bank details securely for withdrawal operations (**off-ramp**) via Pix. Keeping this in a separate table allows a user to have multiple registered accounts and choose a primary one.

<p style={{textAlign: 'center'}}> Simple Entity-Relationship Diagram (ERD)</p>
<div style={{margin: 15}}>
  <div style={{textAlign: 'center'}}>
        <img src={require("../../static/img/tabela_contas_banc_diagrama.png").default} style={{width: 1024}} alt="Credit Request and Approval Flow" />
        <br/>
    </div>
</div>
<p style={{textAlign: 'center'}}> Source: Produced by the authors (2025).</p>

**Keys and Relationships:**

- **Primary Key (PK):** `id` (UUID).

 - **Foreign Key (FK):** `usuario_id` references `usuarios(id)`, creating a one-to-many relationship.