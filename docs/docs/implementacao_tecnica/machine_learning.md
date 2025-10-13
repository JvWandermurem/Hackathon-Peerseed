---
sidebar_position: 6
title: AgroScore
---

## Overview and Objective

The **AgroScore** is Reevo's engine for **automated credit analysis** and a core competitive differentiator. Its objective is to provide a **fast, fair, and data-driven credit risk assessment**, directly addressing requirement **RF-AGR-002**.

For the farmer Sérgio, AgroScore means moving away from the subjectivity and slowness of traditional banks and receiving a response in **hours, not weeks**. For the investor Marina, AgroScore translates the complexity of an agricultural profile into a clear and standardized risk metric (**A to E**), allowing her to make informed and confident investment decisions.

---

## Focus on Interpretability and Performance

The choice of model type for the MVP is guided by two critical factors in credit systems: **interpretability** (to justify the decision) and **speed**.

| Model Type | Advantages for Reevo | Disadvantages |
| :--- | :--- | :--- |
| **Classical Models (Logistic Regression, Gradient Boosting)** | - **High Interpretability:** Allow analysis of the importance of each variable. Essential for **compliance and user feedback**. - **High Performance:** Fast to train and make predictions, ideal for APIs (**RNF-ED-01**). | May not capture extremely complex non-linear relationships in the data. |
| **Deep Learning (Neural Networks)** | - **Capacity:** Learns very complex and non-linear patterns. | - **Low Interpretability ("Black Box")**, making decision explanation difficult (**regulatory and business risk**). Slower: Requires more data and computational power to train and predict. |

---

## Data Sources (Features)

AgroScore is powered by a diverse set of data to create a **360º risk profile** of the farmer.

| Feature Category | Data Examples | Source |
| :--- | :--- | :--- |
| **Registration Data** | Age, region, marital status. | `usuarios` table (PostgreSQL). |
| **Property Data** | Hectares, main crop, land tenure (owned/leased). | Application Form (**RF-AGR-001**). |
| **Historical Production Data** | Revenue from the last cycle (based on Invoices/NFs). | Document Upload (**RF-AGR-001**). |
| **External Credit Data** | Credit score (Serasa/SPC), debt history. | Credit Bureau APIs (**RNF-C-01**). |
| **Platform Behavior Data** | Payment history of previous loans on Reevo. | `cprs` and `parcelas` tables (PostgreSQL). |

---

## Model Lifecycle (MLOps) in the MVP

For the MVP, we will adopt a **semi-manual lifecycle**, focused on simplicity and quick validation, with a clear path to future automation.

**A. Data Collection and Preparation**

Data from the sources above is collected in a batch process. A script extracts data from PostgreSQL and combines it with bureau data, generating a consolidated training dataset.

**B. Model Training and Evaluation**

Training is performed in a development environment, typically a Python file. A developer executes the Python file that performs data cleaning, feature engineering, ML model training, and rigorous evaluation with statistical metrics (e.g., AUC, Precision, Recall). The result is a single trained model file (e.g., `agro_score_model_v1.pkl`).

**C. Artifact Versioning and Storage**

The model file (`.pkl`) and the Python file that generated it are versioned with **Git**. The model artifact itself is stored in an **Object Storage service (S3 compatible)**, following a clear versioning nomenclature (e.g., `s3://Reevo-models/agro_score_model_v1.pkl`).

**D. Model Deployment (Serving):**

The **Credit Analysis Microservice** is configured (via environment variable) with the path to the active model file in Object Storage. Upon startup, the **FastAPI service downloads the model file and loads it into memory**. When a credit analysis request arrives at the API, the service simply calls the `model.predict()` function with the request data.

**Rationale:** This is the deployment pattern with the **lowest latency** and least complexity for the MVP, ensuring that credit analyses are processed in seconds, as per **RF-AGR-002**.

---

## Monitoring and Retraining

An ML model can degrade over time (**model drift**). Our monitoring strategy in the MVP will be periodic and semi-manual.

* **Performance Monitoring:** Every cycle (e.g., quarterly), we will analyze the real performance of the loans granted. We will compare the **default rate predicted by the model with the actual rate**. If the model's accuracy drops below a predefined threshold, the retraining process is triggered.
* **Retraining:** The retraining process follows the same cycle, using an updated dataset with the most recent loan performance data. A new model artifact (`agro_score_model_v2.pkl`) is generated and, after validation, the production service configuration is updated to use the new version.

## Future Evolution (Post-MVP)

With business validation, the **MLOps cycle** will evolve into a more automated pipeline:

* **Feature Store:** Centralization of feature data to ensure consistency between training and prediction.
* **Automated Training Pipeline:** Use of tools like **MLflow or Kubeflow** to automate training, versioning, and performance logging of the models.
* **Canary Deploy / A/B Testing:** Deployment of new model versions to a small percentage of traffic, comparing their performance with the old version before releasing it to all users.