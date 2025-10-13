---
sidebar_position: 2
title: Non-Functional Requirements
---

## Contextualization
&emsp; Non-Functional Requirements (NFRs) define how a system must operate, rather than what it does, covering quality attributes such as performance, security, and usability. The **ISO/IEC 25010** is a standard that provides a model for categorizing and evaluating these quality attributes, dividing them into product and usage characteristics to ensure the software meets the expectations of users and stakeholders.

&emsp; ISO 25010 provides a vocabulary and framework for non-functional requirements and uses a model with various characteristics and sub-characteristics to classify and organize the different quality attributes (NFRs), such as performance efficiency, security, usability, reliability, and compatibility. By using ISO 25010, organizations can ensure they are addressing all important aspects of software quality, both from the product's perspective and its usage.

---

### 1. Functional Suitability
This characteristic measures the degree to which the product satisfies stated and implied needs.

#### RNF-AF-01 (Functional Completeness)
The system must implement all functionalities described in the Functional Requirements modules (RF-CAD, RF-AGR, RF-INV, etc.).  
The absence of any listed functional requirement will be considered a defect.

---

### 2. Performance Efficiency

#### RNF-ED-01 (Time Behavior)
- **Page Loading:** 95% of the platform's interactive pages must load completely in less than 2.5 seconds on a standard broadband connection (≥ 10 Mbps).  
- **API Response Time:** 99% of all API calls must have a time to first byte of less than 400ms.  
- **Critical Processing:** Credit analysis (RF-AGR-002) must meet its processing time (< 60s) even under a load of 50 concurrent analyses.

#### RNF-ED-02 (Resource Utilization)
The application, under nominal load (defined in RNF-ED-03), must not utilize more than 70% of the servers' CPU or memory resources, ensuring a 30% margin for usage peaks.

#### RNF-ED-03 (Capacity)
The system must support a nominal load of 1000 simultaneous users at launch in the first version of the project, with the potential to reach up to 100x this value 1 year after the project launch. The system must also process a minimum of 10 investment transactions per second in the first version and 100x this value 1 year after the project launch.

#### RNF-ED-04 (Scalability)
The system architecture must be designed to scale horizontally.  
The system must support growth to up to 10,000 simultaneous users and 100 transactions per second with the addition of computational resources (e.g., more server instances), without the need for a fundamental re-architecture.

---

### 3. Compatibility

#### RNF-C-01 (Interoperability)
The system must integrate securely and efficiently with the following third-party services via API:  
- Payment Gateway (Pix, On/Off-Ramp BRL/USDC)  
- Digital Signature Provider (ICP-Brasil)  
- CPR Registrar  
- SMS/Push Notification Service  
- Data sources for credit analysis (Receita Federal, Serasa, SCR)

---

### 4. Usability

#### RNF-U-01 (Accessibility)
The platform's web interface must follow the WCAG 2.1 guidelines, level AA.

#### RNF-U-02 (Operability)
The system must be fully functional and rendered correctly in the last two versions of the main browsers (Google Chrome, Mozilla Firefox, Apple Safari).

#### RNF-U-03 (Error Protection)
Error messages must be clear, human-readable, and indicate how the user can correct the problem.

#### RNF-U-04 (Responsiveness)
The application must be fully responsive and usable on mobile devices (smartphones and tablets), adapting to screen widths of at least 360 pixels.

---

### 5. Reliability

#### RNF-CF-01 (Availability)
- The platform must have an availability of **99.9%** ("three nines"), measured monthly. This translates to a maximum downtime of approximately 43 minutes per month.  
- Maintenance windows must be communicated 48 hours in advance and performed during low-traffic hours.

#### RNF-CF-02 (Fault Tolerance)
The system must handle failures of external services (e.g., third-party API unavailable) in a controlled manner, logging the error and informing the user, without causing general instability in the platform.

#### RNF-CF-03 (Recoverability)
- **RPO (Recovery Point Objective):** The maximum acceptable data loss for transaction data is **zero**. For non-transactional data, the RPO is 15 minutes.  
- **RTO (Recovery Time Objective):** The maximum time to restore the system to an operational state after a total regional failure is 2 hours. Recovery from an AZ failure must be automatic and occur in less than 5 minutes.

---

### 6. Security

#### RNF-S-01 (Confidentiality)
All communication must be encrypted via **TLS 1.3**. Sensitive data at rest must be encrypted with **AES-256**. Sensitive data must not be exposed in testing environments (data masking).

#### RNF-S-02 (Integrity)
All financial transactions must adhere to **ACID** properties. The audit log (RF-SEC-002) must be protected against tampering.

#### RNF-S-03 (Non-Repudiation and Accountability)
The combination of the digital signature (RF-AGR-003) and the audit log (RF-SEC-002) must guarantee the **irrefutability of critical actions**.

#### RNF-S-04 (Regulatory Compliance)
The system and its operational processes must be designed to be in **full compliance** with the General Data Protection Law (LGPD) and with the Bank Central (Bacen) regulations applicable to Peer-to-Peer Lending Societies (SEP).

#### RNF-S-05 (Proactive Security Testing)
- The system must undergo external intrusion tests (**Pentest**) performed by a specialized company at least once every six months, or before each major release.  
- Static (SAST) and dynamic (DAST) security analyses of code must be integrated into the CI/CD pipeline to identify vulnerabilities continuously.

---

### 7. Maintainability

#### RNF-M-01 (Modularity)
The software architecture must be **modular**, allowing teams to work independently on different parts of the system.

#### RNF-M-02 (Testability)
The source code must have a **unit test coverage of at least 85%** for critical business logic.

#### RNF-M-03 (Observability)
- The system must expose technical health metrics (API latency, CPU/memory usage, 5xx error rate) and business metrics (registrations/hour, investments/hour, payments processed) in a standard format (e.g., Prometheus).  
- Dashboards (e.g., Grafana) and automatic alerts (e.g., via Alertmanager, PagerDuty) must be configured to notify the operations team when critical metrics exceed predefined thresholds.

---

### 8. Portability

#### RNF-P-01 (Adaptability)
The application must be fully **containerized (Docker)**, **orchestrated (Kubernetes)**, and **cloud-agnostic**, avoiding excessive dependence on proprietary services.

#### RNF-P-02 (Installability)
The deployment process must be fully **automated** via a CI/CD pipeline, allowing production deploys with **zero downtime** (blue-green or canary deployment).