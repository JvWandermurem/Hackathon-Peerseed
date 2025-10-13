---
sidebar_position: 4
title: Infrastructure Planning
---

## Introduction

Reevo's infrastructure is designed to be the solid foundation that supports the bridge between farmers and investors. Architectural decisions are guided by four essential principles, always focused on generating value and trust for our target audience and based on our Functional and Non-functional Requirements:

* **High Availability and Resilience:** The platform must be accessible at all times, ensuring **99.9% availability** (RNF-CF-01).
* **Elastic Scalability:** The infrastructure must automatically scale resources to meet demand peaks, ensuring **quick response times** (RNF-ED-01).
* **Security by Design:** The infrastructure is designed with multiple layers of protection, from the network to the application, in compliance with the **LGPD** (RNF-S-04).
* **Cloud Agnosticism and Portability:** The architecture uses market standards (containers and Kubernetes) to ensure portability (RNF-P-01).

## Cloud Provider

Although the architecture is agnostic, the MVP deployment will occur on one of the three main global cloud providers: Amazon Web Services (AWS), Google Cloud Platform (GCP), or Microsoft Azure. Choosing a large-scale provider guarantees a global, low-latency network infrastructure, optimizing the experience for both the farmer Sérgio and the investor Marina.

## Compute Architecture

The core of our compute infrastructure is container orchestration with **Kubernetes (K8s)**.

* **Importance and Impact:**
    * **For Sérgio (Farmer):** Kubernetes' **self-healing mechanisms** ensure the platform is always online for credit application or payments (RNF-CF-01).
    * **For Marina (Investor):** Kubernetes scales horizontally to handle high-demand traffic, ensuring the platform remains **fast and responsive** (RNF-ED-01).

| Implementation Option | Description | Advantages for Reevo | Disadvantages |
| :--- | :--- | :--- | :--- |
| **Managed Kubernetes (EKS, GKE, AKS)** | The cloud provider manages the *control plane*. We manage applications. | **Product Focus:** Reduces operational load. **Reliability:** High availability guaranteed by the provider. | - Initial learning curve for the tool. |
| **Serverless Containers (AWS Fargate, Cloud Run)** | Abstracts the notion of servers; we just send the container. | **Maximum Simplicity:** Ideal for small teams. **Optimized Cost:** Payment only for actual compute time. | - Less flexibility in complex networks. - Possible vendor lock-in. |

**Architectural Decision:** Start with **Managed Kubernetes** as the primary foundation, as it offers the best balance between control, portability, and industry standard.

## Data Architecture

The strategy is to utilize **managed services** for all our data storage, focusing on data security and integrity.

* **Managed PostgreSQL Database (AWS RDS, Google Cloud SQL):**
    * **Integrity:** Guarantees **ACID properties**. Supports **Automated Backups** and **Point-in-Time Recovery** (RNF-CF-03).
    * **Availability:** **Multi-AZ Replication** ensures high availability (RNF-CF-01).
    * **Security:** **Encryption at Rest** (AES-256) is applied by default (RNF-S-01, RNF-S-04).
* **Managed Redis Cache (AWS ElastiCache, Google Memorystore):** Ensures frequent reads (e.g., Marketplace data for Marina) are **near-instant**, meeting the API Response Time requirement (RNF-ED-01).

## Network Architecture and Security

We will use the **Virtual Private Cloud (VPC)** standard with rigorous subnetwork segmentation. This design implements the **Security by Design** principle.

* **Private Subnets:** Our microservices and databases reside here, with **no direct access to the internet**.
* **Public Subnets:** Only components that communicate externally (Load Balancers, API Gateway) reside here, assuring Sérgio and Marina that their most sensitive data is isolated from external threats.

## API Gateway

All traffic passes through a **Managed API Gateway**, which acts as the main security team for our platform.

* **Security Centralization:** Responsible for validating the **authentication of every request (RF-CAD-002)**.
* **Protection:** Offers native defense against attacks, such as **DDoS and code injection**.
* **Trust:** This layer ensures the platform is resilient, secure, and professional, strengthening user trust.

