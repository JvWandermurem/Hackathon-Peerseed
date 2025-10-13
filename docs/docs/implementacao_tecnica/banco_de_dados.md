---
sidebar_position: 0
title: Data Architecture
---

## Storage Layer

&emsp; Reevo's data architecture was designed under the principle of **Polyglot Persistence**, utilizing the most appropriate technology for each data type. The architecture ensures **transactional integrity** for financial operations, high performance for frequent queries, and complete system observability. The structure supports the complete P2P credit lifecycle, from user registration to investment settlement.

## Relational Database (PostgreSQL)

&emsp; The heart of data persistence is a PostgreSQL database, which serves as the **single source of truth** for all structured and transactional data.

```sql
-- Enumerated Types (Enums)
-- Used to ensure consistency and data integrity in fields with predefined values.
CREATE TYPE perfil_enum AS ENUM ('AGRICULTOR', 'INVESTIDOR', 'ADMIN');
CREATE TYPE status_kyc_enum AS ENUM ('PENDENTE', 'VERIFICADO', 'REPROVADO', 'ANALISE_MANUAL');
CREATE TYPE tipo_transacao_enum AS ENUM ('DEPOSITO_PIX', 'DEPOSITO_CRYPTO', 'SAQUE_PIX', 'SAQUE_CRYPTO', 'INVESTIMENTO_PRIMARIO', 'INVESTIMENTO_SECUNDARIO', 'RECEBIMENTO_PARCELA', 'VENDA_SECUNDARIO', 'TAXA_PLATAFORMA');
CREATE TYPE status_transacao_enum AS ENUM ('PENDENTE', 'CONCLUIDA', 'FALHOU', 'CANCELADA');
CREATE TYPE status_cpr_enum AS ENUM ('ANALISE', 'CAPTAÇÃO', 'FINANCIADO', 'EM_PAGAMENTO', 'QUITADO', 'INADIMPLENTE');
CREATE TYPE risco_enum AS ENUM ('A', 'B', 'C', 'D', 'E');
CREATE TYPE status_parcela_enum AS ENUM ('PENDENTE', 'PAGA', 'ATRASADA');
CREATE TYPE status_investimento_enum AS ENUM ('ATIVO', 'VENDIDO', 'FINALIZADO');
CREATE TYPE status_oferta_enum AS ENUM ('ABERTA', 'VENDIDA', 'CANCELADA');
CREATE TYPE tipo_conta_enum AS ENUM ('CORRENTE', 'POUPANCA');
CREATE TYPE status_verificacao_enum AS ENUM ('PENDENTE', 'VERIFICADA', 'INVALIDA');

-- Users
-- Stores login and profile information for all platform participants.
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    celular VARCHAR(15) NOT NULL,
    perfil perfil_enum NOT NULL,
    status_kyc status_kyc_enum NOT NULL DEFAULT 'PENDENTE',
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(),
    data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Digital Wallets
-- Represents the digital wallet of each user, where stablecoin balances (USDC) are held.
CREATE TABLE carteiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    saldo_usdc DECIMAL(18, 8) NOT NULL DEFAULT 0.0,
    saldo_bloqueado_usdc DECIMAL(18, 8) NOT NULL DEFAULT 0.0,
    data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CPRs (Certificates of Rural Product)
-- Models the investment opportunity, containing the terms of the loan requested by the farmer.
CREATE TABLE cprs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agricultor_id UUID NOT NULL REFERENCES usuarios(id),
    valor_solicitado DECIMAL(18, 2) NOT NULL,
    taxa_juros_anual DECIMAL(5, 2) NOT NULL,
    prazo_meses INT NOT NULL,
    status status_cpr_enum NOT NULL DEFAULT 'ANALISE',
    score_risco risco_enum NOT NULL,
    total_cotas INT NOT NULL,
    valor_por_cota_usdc DECIMAL(18, 8) NOT NULL,
    data_emissao DATE,
    data_vencimento_final DATE,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Installments
-- Details the payment schedule for each CPR.
CREATE TABLE parcelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpr_id UUID NOT NULL REFERENCES cprs(id) ON DELETE CASCADE,
    numero_parcela INT NOT NULL,
    valor_principal DECIMAL(18, 2) NOT NULL,
    valor_juros DECIMAL(18, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    status status_parcela_enum NOT NULL DEFAULT 'PENDENTE',
    valor_multa_paga DECIMAL(18, 2) DEFAULT 0.0,
    valor_juros_mora_pago DECIMAL(18, 2) DEFAULT 0.0,
    data_pagamento TIMESTAMPTZ,
    UNIQUE(cpr_id, numero_parcela)
);

-- Investments
-- Linking table that represents an investor's participation in a CPR.
CREATE TABLE investimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investidor_id UUID NOT NULL REFERENCES usuarios(id),
    cpr_id UUID NOT NULL REFERENCES cprs(id),
    quantidade_cotas INT NOT NULL,
    valor_cota_compra DECIMAL(18, 8) NOT NULL,
    status status_investimento_enum NOT NULL DEFAULT 'ATIVO',
    data_investimento TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions
-- Functions as the ledger, recording any and all movements in the wallets.
CREATE TABLE transacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carteira_id UUID NOT NULL REFERENCES carteiras(id),
    valor DECIMAL(18, 8) NOT NULL,
    tipo tipo_transacao_enum NOT NULL,
    status status_transacao_enum NOT NULL DEFAULT 'PENDENTE',
    referencia_externa_id VARCHAR(255),
    descricao TEXT,
    data_transacao TIMESTAMPTZ NOT NULL DEFAULT now(),
    referencia_id UUID,
    referencia_tipo VARCHAR(50)
);

-- Secondary Market
-- Models the offers for selling investment shares in the secondary market.
CREATE TABLE ofertas_secundario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investimento_id UUID NOT NULL REFERENCES investimentos(id),
    quantidade_cotas_a_venda INT NOT NULL,
    preco_por_cota_usdc DECIMAL(18, 8) NOT NULL,
    status status_oferta_enum NOT NULL DEFAULT 'ABERTA',
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bank Accounts
-- Stores users' bank details for withdrawal operations (off-ramp) via Pix.
CREATE TABLE contas_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    banco VARCHAR(100) NOT NULL,
    agencia VARCHAR(10) NOT NULL,
    conta VARCHAR(20) NOT NULL,
    tipo_conta tipo_conta_enum NOT NULL,
    status status_verificacao_enum NOT NULL DEFAULT 'PENDENTE',
    is_principal BOOLEAN NOT NULL DEFAULT false
);

-- Event Ledger
-- Ensures the immutability and auditing of critical operations through a chain of cryptographic hashes.
CREATE TABLE ledger_eventos (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    tipo_evento VARCHAR(100) NOT NULL,
    ator_id UUID REFERENCES usuarios(id),
    ator_tipo VARCHAR(50),
    dados_evento JSONB NOT NULL,
    hash_anterior VARCHAR(64),
    hash_atual VARCHAR(64) UNIQUE NOT NULL
); 
```

## In-Memory Cache (Redis)

&emsp; Redis, a high-performance in-memory data store, will be used as a distributed cache layer to store volatile and frequently accessed data, aiming to speed up application response and reduce the load on PostgreSQL.

### Detailed Use Cases
**Session Management:** Storing logged-in user session tokens `(RF-SEC-001)`, allowing for extremely low-latency session validation by the API Gateway and microservices.

**Read Caching (Cache-Aside):** Store temporary copies of frequently read data, such as the marketplace offers list (for non-logged-in users), details of public CPRs, and user profile data that does not constantly change.

**Rate Limiting:** Protecting sensitive endpoints (like login or OTP sending) against brute-force attacks by controlling the number of requests per IP or per user within a time window.

**Low-Latency Queues:** For simple asynchronous tasks that do not require the robustness of a full message broker (e.g., "send welcome notification after registration").

### Implementation Strategies

**Cache Pattern (Cache-Aside / Lazy Loading):**

The application will follow the Cache-Aside pattern.

<details>
<summary> Flow</summary>

1 - The application attempts to read the data from Redis.

2 - If the data exists **(cache hit)**, it is returned immediately.

3 - If the data does not exist **(cache miss)**, the application retrieves the information from PostgreSQL, saves it in Redis with a Time-To-Live (TTL), and then returns it.

</details>

**Cache Invalidation Strategy:**

To ensure data consistency, two strategies will be used:

**TTL (Time-To-Live):** All cached data will have a defined lifespan (e.g., 5 minutes for the marketplace offers list), ensuring the information is periodically refreshed.

**Active Invalidation (Event-Driven):** For critical data, when a record is changed in PostgreSQL (e.g., a CPR status changes to "FINANCIADO"), the application will emit an event to explicitly delete the corresponding key in Redis, forcing a new database read on the next request.

### Operational Considerations

**Key Structure:** A key naming convention will be adopted to prevent collisions and facilitate debugging. Ex: `session:{userId}`, `cpr:{cprId}:details`, `marketplace:offers:page:{pageNumber}`.

**Eviction Policy:** When Redis memory is full, the configured eviction policy will be `allkeys-lru` (Least Recently Used), which removes the least recently used keys.

**High Availability:** In production, Redis will not be a single instance. It will be configured in high availability mode using Redis Sentinel or a cloud managed service (such as AWS ElastiCache or Google Memorystore) with replication and automatic failover, in compliance with the availability RNF **(RNF-CF-01)**.

## Structured Logs and Observability
Reevo's observability strategy is based on emitting structured logs in **JSON format** to the standard output (`stdout`) of each microservice. This approach decouples services from the logging infrastructure, a recommended practice to ensure maintainability (`RNF-M-03`).

### Log Structure Pattern (JSON Schema)
To ensure that logs are easily searchable and analyzable, every log generated by the application must adhere to a common schema:

```json
{
  "timestamp": "2025-09-30T14:40:00.123Z",
  "level": "INFO", // DEBUG, INFO, WARN, ERROR, CRITICAL
  "service": "credit-analysis-service",
  "correlation_id": "b1a4a233-1b2c-4b5c-8d6e-f7a8b9c0d1e2", // Unique ID that tracks a request across multiple services
  "user_id": "f4a5b6c7-d8e9-f0a1-b2c3-d4e5f6a7b8c9", // Optional
  "message": "Credit analysis for request xyz successfully completed.",
  "payload": { // Object with context data
    "solicitacao_id": "xyz-123",
    "score_gerado": 750,
    "tempo_de_processamento_ms": 450
  }
}
```

## In-Memory Cache (Redis)

&emsp; Redis, a high-performance in-memory data store, will be used as a distributed cache layer to store volatile and frequently accessed data, aiming to speed up application response and reduce the load on PostgreSQL.

### Detailed Use Cases
**Session Management:** Storing logged-in user session tokens `(RF-SEC-001)`, allowing for extremely low-latency session validation by the API Gateway and microservices.

**Read Caching (Cache-Aside):** Store temporary copies of frequently read data, such as the marketplace offers list (for non-logged-in users), details of public CPRs, and user profile data that does not constantly change.

**Rate Limiting:** Protecting sensitive endpoints (like login or OTP sending) against brute-force attacks by controlling the number of requests per IP or per user within a time window.

**Low-Latency Queues:** For simple asynchronous tasks that do not require the robustness of a full message broker (e.g., "send welcome notification after registration").

### Collection and Storage Architecture

&emsp; The application itself is storage agnostic. For the local MVP, logs are displayed in the terminal and stored in a json file. In a production environment, a collector agent (such as Fluentd or Vector) captures stdout logs and forwards them to a centralized log management system (such as AWS CloudWatch, Google Cloud Logging, or an ELK stack), which will implement retention policies and allow the creation of dashboards and alerts.

**Collection:** In production, a log collector agent (such as Fluentd or Vector) will run on each node/container. It will be responsible for capturing stdout logs, adding metadata (e.g., container name, node), and sending them asynchronously to the storage layer.

**Storage:** According to our previous decision, the storage layer for logs will be the system itself, for an MVP, with the possibility of extension to an AWS service like Dynamo. This centralizes storage and allows the use of SQL for queries and analysis.

### Data Retention Strategy

Logs can consume a large volume of storage.

The following retention policy will be applied:

**30 days "Hot":** Logs from the last 30 days will be kept locally for quick queries and debugging.

**1 year "Cold":** After 30 days, logs will be automatically exported to a low-cost storage ( such as AWS S3 Glacier or Google Cloud Storage Archive) and kept for 1 year for auditing and compliance purposes, then permanently deleted.

### Security and Data Masking (LGPD)

To comply with the LGPD (RNF-S-04), the application **MUST NOT** log sensitive data in clear text.

**Action:** Application logging libraries must be configured with data masking filters to automatically redact information such as CPF, passwords, access tokens, and card/bank account data before the log is written.

&emsp; Example: *"cpf": "123.***.***-00".*

### Monitoring and Alerts

The structured logs in TimescaleDB will be the basis for monitoring and alerts (RNF-M-03).

**Action:** Tools like **Grafana** will be connected to the database to create dashboards and configure alerts based on SQL queries. For example:

**ALERT IF:** The number of logs with 'level' = 'ERROR' in the 'service' = 'payments-service' is > 10 in the last 5 minutes.

**CREATE CHART:** Average processing time for credit analysis (extracted from 'payload.tempo\_de\_processamento\_ms').

## Connection to Functional Requirements

This data storage structure was designed to directly meet the functional and non-functional requirements:

| Requirement | Addressed by | Observação |
| :--- | :--- | :--- |
| **RF-CAD-001 / RF-CAD-002** (User registration and authentication) | `usuarios` | Authentication fields + KYC status |
| **RF-USR-002** (User data management) | `usuarios`, `contas_bancarias` | Profile and bank data control |
| **RF-AGR-001 / RF-AGR-002** (Credit request and risk analysis) | `cprs` | Requested value, status, and score fields |
| **RF-AGR-005** (Installment payment) | `parcelas` | Payment schedule and status |
| **RF-AGR-006** (Default management) | `parcelas` + `ledger_eventos` | Immutable record of defaults |
| **RF-INV-001 / RF-INV-004** (On/Off-ramp) | `carteiras` + `transacoes` | Movement and separate balance |
| **RF-INV-002 / RF-INV-005** (Investment and distribution) | `investimentos` + `parcelas` | CPR ↔ Investor relationship |
| **RF-INV-003** (Secondary market) | `ofertas_secundario` | Early sale of shares |
| **RF-INV-006** (Statement) | `transacoes` | Financial ledger |
| **RNF-S-02 / RNF-S-03** (Security and transparency) | `ledger_eventos` | Hash chain for immutability |
| **RNF-ED-01** (Performance) | Redis | Caching of critical data |
| **RNF-M-03** (Observability) | Logs JSON stdout | Structured monitoring |