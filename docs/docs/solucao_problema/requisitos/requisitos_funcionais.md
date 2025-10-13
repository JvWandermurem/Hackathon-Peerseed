---
sidebar_position: 1
title: Functional Requirements
---

## Contextualization  

A **Functional Requirement (FR)** describes **what the system must do** to meet user needs and achieve project objectives. It defines specific functionalities, expected actions, and the context in which they should occur.  

Well-written and defined functional requirements:
- **Guide development** and aid in prioritization.
- **Facilitate validation** of the delivered product.
- **Reduce ambiguity** in objectives.

---

## Module 1: Accounts and Authentication (FR-CAD)

### FR-CAD-001: Unified Account Creation
The new user must be able to create a single account on the platform to access the ecosystem, considering that:
- The initial form will request Full Name, Email, Password creation (with strength rules [min. 8 characters, 1 uppercase, 1 number, 1 special character]), Date of Birth, and Cell Phone Number.
- The user must select their primary profile: "I am a Farmer" or "I am an Investor."
- Account validation will require email verification (via link) or cell phone verification (via OTP code).
- The process will include an identity verification step with a face photo upload (selfie).

### FR-CAD-002: User Authentication
The registered user must be able to authenticate on the platform to access their control panel, considering that:
- The main login method will be Email and Password.
- The platform will offer an optional social login method (Login with Google).

### FR-CAD-003: Security Management (2FA)
The logged-in user must be able to enable or disable Two-Factor Authentication (2FA) to increase their account security, considering that:
- The option will be available in the "Security" section of the user profile.
- When active, 2FA will request an OTP code (via SMS) after the correct insertion of email and password.

---

## Module 2: Credit Taker (Sérgio's Flow) (FR-AGR)

### FR-AGR-001: Guided Credit Application
The farmer (Sérgio) must be able to fill out a form and upload documents to request a new credit analysis, considering that:
- Mandatory documents are: Identity Document (CNH/RG), Proof of Residence, CAR (Rural Environmental Registry), and Sales Invoices from the last cycle (optional, but impact the score).
- File upload must support PDF, JPG, PNG formats, with a maximum size of 10MB per file.

### FR-AGR-002: Automated Credit Analysis
The system must be able to process the farmer's data to generate a Credit Score to assess the operation's risk quickly, considering that:
- The analysis must be concluded and the result presented within 60 seconds for 95% of cases.
- The Score will be displayed numerically (0–1000) and classified into initial ranges (default):
  - A = 800–1000
  - B = 700–799
  - C = 600–699
  - D = 500–599
  - E = < 500
- The Score will be updated automatically whenever a new relevant document is attached or updated by the farmer.

### FR-AGR-003: CPR Generation and Signature
The farmer (Sérgio) must be able to generate and digitally sign the Rural Product Bill (CPR) to formalize the loan guarantee, considering that:
- The system must automatically fill the CPR with the operation data sent by Sérgio.
- The signature will be performed through an integrated service that supports qualified Digital Signature (ICP-Brasil standard) and biometric (facial) validation.
- The CPR will only be sent for registration after signature.

### FR-AGR-004: Monitoring and Management of Fundraising
The farmer (Sérgio) must be able to track the status of their fundraising and make decisions to manage their application, considering that:
- The dashboard must show the financed percentage, updated in real-time (via websocket or polling every 30 seconds).
- If the fundraising deadline ends without reaching 100%, the farmer will have the options to: 
  - receive the partial amount; 
  - extend the deadline; 
  - cancel.
- An active application cannot be edited; the farmer must cancel it and create a new one if they wish to change values or deadlines. The interest rate follows proportionally.

### FR-AGR-005: Payment of Interest and Loan
- The farmer must be able to pay via Pix, Boleto, or automatic debit.
- The system must generate slips with a barcode + Pix QR Code.
- Payments must be automatically reconciled and passed on to investors (minus fees and taxes).
- Payment reconciliation must be processed within D+1 and registered on the farmer's dashboard.

### FR-AGR-006: Default