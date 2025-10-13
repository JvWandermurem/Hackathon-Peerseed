---
sidebar_position: 5
title: Security
---
import Admonition from '@theme/Admonition';


## Introdução

&emsp; Security is the fundamental pillar that sustains the **trust** of farmers and investors in the Reevo platform. Our approach is **proactive, not reactive**, and follows the principles of **Secure by Design** and **Defense in Depth**. This means that security is not an external layer, but an integrated responsibility in every component of our architecture: from infrastructure and networking to application code and DevOps processes.

---
## The CIA Triad
&emsp; Our security strategy is built upon the **CIA Triad**, a model that represents the three most important objectives of information security.

### Confidentiality (Confidentiality)

- Ensuring that data is accessible only by authorized individuals.
- The protection of the **personal and financial data** of Sérgio and Marina is our highest priority.

Controles Implemented:

**Encryption in Transit:** All communication between the user and the platform, as well as between internal microservices, is mandatorily encrypted using **TLS 1.3**. This prevents data interception `(RNF-S-01)`.

**Encryption at Rest:** All data stored in our databases (PostgreSQL) and file systems (Object Storage) is encrypted at the disk level using the **AES-256** standard, leveraging the capabilities of managed cloud services `(RNF-S-01)`.

**Secrets Management:** Credentials of access to databases, API keys, and other secrets are managed by a **secret vault service** (such as AWS Secrets Manager or Google Secret Manager). They are never exposed in code or insecure environment variables.

**Strict Access Control:** Access to data is governed by the principle of **least privilege**. In the application, **JWT token validation** ensures that a user can only access their own data.

**Data Masking (LGPD):** As defined in our logging plan and in compliance with **LGPD** (`RNF-S-04`), sensitive data (such as CPF/Tax ID) is automatically **masked** before being written to any log, preventing accidental exposure.

### Integrity (Integrity)

- Ensuring that data is accurate, consistent, and protected against unauthorized modification.
- Financial transactions and contracts must be **immutable and accurate**.

Controles Implemented:

**Atomic Transactions (ACID):** The choice of PostgreSQL as the main database ensures that all financial operations adhere to **ACID** properties. An investment, for example, is either entirely completed successfully (debit from the investor's wallet, credit to the CPR's fundraising) or entirely rolled back, never leaving data in an inconsistent state `(RNF-S-02)`.

**Ledger with Hash Chaining:** The `ledger_eventos` table creates an auditable record with evidence against tampering. Every critical event is **cryptographically chained** to the previous one, making it impossible to alter a past record without invalidating the entire chain. This guarantees the integrity of the most important operations `(RNF-S-02)`.

**Input Data Validation:** The use of **Pydantic** in FastAPI ensures that all data received by the API is validated against a predefined schema, preventing the input of malformed or malicious data that could corrupt the system state.

**Digital Signatures:** The integrity of user sessions is ensured by the digital signature of JWT tokens. The legal integrity of contracts is guaranteed by **qualified digital signatures (ICP-Brasil standard)** on the CPR (`RF-AGR-003`, `RNF-S-03`).

### Availability (Availability)
- Ensuring that the platform is operational and accessible when our users need it.
- Access to credit and investments is **time-sensitive**. The platform needs to be reliable.

Controles Implemented:

**High-Availability Infrastructure:** As per the infrastructure document, we use managed services (Kubernetes, Databases) configured across multiple **Availability Zones (Multi-AZ)**. If an entire data center fails, the platform continues to operate from another, ensuring our goal of **99.9% uptime** `(RNF-CF-01)`.

**Automatic Scalability:** **Kubernetes** is configured to scale horizontally, adding more service instances as demand increases. This prevents traffic spikes from causing slowdowns or unavailability `(RNF-ED-04)`.

**Backups and Disaster Recovery:** Our managed databases perform continuous and **automatic backups**, allowing system recovery to a specific **Point-in-Time Recovery** in the event of a catastrophic failure `(RNF-CF-03)`.

**Protection against Denial of Service (DDoS) Attacks:** We utilize the native **DDoS protection services** of the cloud provider, implemented at the edge layer (API Gateway, Load Balancer), to mitigate attacks aimed at taking the platform offline.

---
## Risk Mitigation: OWASP Top 10

Our architecture and development processes are designed to proactively mitigate the most common security risks identified by the **OWASP** (Open Web Application Security Project).

<details>
<summary> A01 - Broken Access Control </summary>

&emsp; In addition to JWT authentication, every API endpoint implements explicit authorization checks to ensure a user can only view or modify the resources that belong to them.
Ex: "Is the user attempting to view CPR X actually the farmer who created it?".
</details>

<details>
<summary> A02 - Cryptographic Failures</summary>
&emsp; We follow the rule of never "inventing" cryptography. We use **robust and audited industry standards (TLS 1.3, AES-256)** and delegate the complexity of key management to managed cloud services.
</details>

<details>
<summary>A03 - Injection</summary>
&emsp; The use of **SQLAlchemy ORM** with prepared statements virtually eliminates the risk of **SQL Injection**. Rigorous input data validation by **Pydantic** serves as an additional defense against other types of injection attacks.
</details>

<details>
<summary>A05 - Security Misconfiguration</summary>
&emsp; The use of **Infrastructure as Code (Terraform)** ensures that our infrastructure is provisioned **consistently and securely**, from audited templates. We avoid manual, error-prone configurations.
</details>

<details>
<summary>A08 - Software and Data Integrity Failures</summary>
&emsp; Our **CI/CD pipeline** includes vulnerability analysis of dependencies and Docker images, ensuring that we are not deploying software with known security flaws. Data integrity, as already mentioned, is guaranteed by our ledger with hash chaining.
</details>

---

## Análise de Trade-offs Arquiteturais

&emsp; Every robust software architecture is the result of a series of decisions and, consequently, trade-offs. There is no "perfect" solution, but rather an optimal solution for a specific context. At Reevo, we made conscious choices to prioritize the most critical aspects for a credit fintech platform: trust, security, and integrity.

### Security vs. Usability: The Priority of Trust
**The Trade-off:** Stricter security measures often introduce additional steps in user workflows, creating friction that can impact the simplicity of the experience.

**Our Decision:** At all times, we **prioritize security over marginal convenience**, as **trust is the most valuable asset** of our platform.
<details>
<summary>Examples</summary>
Example 1: **Two-Factor Authentication (2FA):** Requirement **RF-CAD-003** (mandatory or strongly encouraged 2FA) adds a step to the login process. For investor Marina, this slight friction is a small price to pay for the assurance that her account is protected against unauthorized access.

Example 2: **Identity Verification (KYC):** The onboarding process, which requires submitting documents and a selfie (**RF-CAD-001**), is the biggest point of friction in the user's initial journey. We consciously chose this initial barrier to ensure a secure and legal ecosystem for all participants, protecting Marina's investments and the legitimacy of Sérgio's loans.
</details>

### Strong Consistency vs. Performance/Availability

**The Trade-off:** In distributed systems, there is a classic trade-off (described by the CAP Theorem) between ensuring that all data is always 100% consistent and having the lowest possible latency or highest availability.

**Our Decision:** For all financial and business operations, we opted for **strong consistency**.

**Justification:** The choice of **PostgreSQL** as our main database and the use of its **ACID guarantees** (`RNF-S-02`) is a deliberate decision. When Marina invests in a CPR, it is absolutely unacceptable for her balance to be debited without the investment being recorded, or vice-versa. We prefer to bear a few extra milliseconds of latency in a transaction to have the **mathematical assurance that the financial data is always correct and consistent**. For a fintech, **data integrity prevails over raw performance**.