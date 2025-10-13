---
sidebar_position: 6
title: DevOps
---
import Admonition from '@theme/Admonition';

## Introduction
&emsp;DevOps at Reevo is the bridge that connects software development to infrastructure operations. Our goal is to create automated and integrated processes that allow us to deliver value to our users, Sérgio and Marina, quickly, frequently, and reliably.

&emsp;Our main objectives are:

* **Velocity:** Reducing the time between an idea and its deployment into production.
* **Reliability:** Ensuring that new deployments do not degrade system stability, in compliance with RNF-CF-01.
* **Scalability:** Having processes that work for one as well as for dozens of microservices.
* **Security:** Integrating security at every step of the software development lifecycle (**Shift-Left Security**).

---

## Core Tools and Technologies

| Area | Tool / Standard | Rationale |
| :--- | :--- | :--- |
| Code Repository | **Git / GitHub** | Global standard for version control, with excellent collaboration and integration tools. |
| CI/CD Pipeline | **GitHub Actions** | Free and natively integrated solution to GitHub, powerful, and highly configurable. |
| Infrastructure as Code (IaC) | **Terraform** | Industry standard for provisioning infrastructure in a cloud-agnostic and declarative manner. |
| Containerization | **Docker** | Industry standard for packaging applications and dependencies, ensuring consistency (RNF-P-01). |
| Orchestration | **Kubernetes** | Industry standard for operating containerized applications in a resilient and scalable way. |
| Observability | **Prometheus, Grafana, OpenTelemetry** | Leading open-source stack for metrics, dashboards, and distributed tracing. |

---

## Detailed DevOps Processes

### Version Control and Branching Strategy (GitHub Flow)

&emsp;Discipline in version control is the foundation of the entire process. We will adopt the **GitHub Flow**, a simple and effective strategy for continuous development.

* The `main` branch always reflects what is in production. It is protected and does not allow direct pushes.
* All development, whether a new feature or a bug fix, is done in descriptive branches created from `main`.
    * *ex: feat/secondary-market or fix/interest-calculation.*
* When the work is complete, a **Pull Request (PR)** is opened to merge the branch back into `main`.

### Infrastructure as Code (IaC)

&emsp;All of our cloud infrastructure—the **Kubernetes cluster, databases, networks (VPCs), and firewall rules** - is defined as code using **Terraform**.

* **Repeatability:** Ensures that staging and production environments are identical, eliminating the classic "it worked in staging" problem.
* **Versioning and Auditability:** Infrastructure changes go through the same Pull Request and Code Review process as application code, making the process secure and auditable.
* **Disaster Recovery:** In case of a catastrophic failure, we can recreate our entire infrastructure from scratch, quickly and automatically, from the Terraform code (RNF-CF-03).

### Observability

&emsp;Observability is how we give our production system "eyes and ears," in full compliance with **RNF-M-03**.

* **Logs:** All services emit **structured logs (JSON)** to `stdout`. In our Kubernetes environment, an agent (such as Fluentd) collects these logs and centralizes them in a logging service (e.g., AWS CloudWatch or an ELK stack), where they can be searched and analyzed.
* **Metrics:** Each microservice exposes health and business metrics in **Prometheus** format. A central Prometheus server collects these metrics.
* **Dashboards and Alerts:** **Grafana** is connected to Prometheus to create dashboards and configure alerts. Alerts notify the team automatically when a critical metric deviates from the standard.
    * *ex: "The error rate for the Payments Service exceeded 5%."*
* **Tracing:** We plan to adopt **OpenTelemetry** to debug complex issues, allowing us to follow a single request (e.g., an investment by Marina) on its journey through multiple services.