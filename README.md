# PersonalVault

> **"Drop it. We'll understand it. We'll organize it."**

PersonalVault is a modern, privacy-first personal productivity and digital data management web application built with **React (Vite + TypeScript)**, **Spring Boot 3 (Java)**, and **PostgreSQL**. It allows you to securely store, track, analyze, and organize credentials, identity documents, bank accounts, portfolio projects, professional certificates, daily expenses, and resumes in a single unified dashboard.

---

## 🚀 Key Features

### ✨ SmartDrop (Intelligent File Ingestion)
An intelligent drag-and-drop ingestion system on the dashboard that analyzes the **actual content** of uploaded files (not just filenames) and organizes them into the appropriate PersonalVault modules.
* **Multi-Format Support:** PDF, DOCX, PNG, JPG/JPEG, WEBP, TXT.
* **Deep Content Extraction:** Powered by Apache PDFBox and Apache POI for structural text, table, and metadata extraction.
* **Intelligent Classification Pipeline:** Accurately classifies files into Certificates, Achievements, Projects, Identity Documents, Financial Accounts, Educational Documents, Other Documents, or Resumes.
* **Confidence Scoring & Explanations:** Displays visual confidence meters (Very High, High, Medium, Low) with human-readable rationale.
* **Review-First Architecture:** No files are auto-saved without explicit user confirmation. Users can modify extracted fields and re-route destinations.
* **Duplicate Detection:** Employs Levenshtein and token-similarity checks against existing records before saving.
* **Pluggable AI:** Built with an extensible `AIProvider` abstraction (local heuristic NLP engine with optional OpenAI/LLM enhancement).

### 🔒 Secure Vault
A high-security, encrypted digital safe for confidential personal records.
* **AES-256-GCM Encryption:** Encrypts sensitive fields and documents at rest.
* **Zero-Knowledge Architecture:** Protected by a dedicated Vault Master Password (BCrypt-hashed) and short-lived in-memory session tokens (`X-Vault-Token`).
* **Auto-Lock Security:** Automatically locks the vault after 15 minutes of inactivity.
* **Identity Documents:** Store Aadhaar, PAN, Passport, Voter ID, and Driver's License scans with masked display by default.
* **Financial Information:** Track bank accounts, IFSC codes, branches, and UPI IDs securely.
* **Education & Other Documents:** Securely organize marksheets, degree certificates, contracts, and medical records.

### ☁️ Google Drive Integration
Physical files (certificates, encrypted vault documents) are stored directly in dedicated private Google Drive folders (`PersonalVault/Certificates` and `PersonalVault/SecureVault`), keeping database storage fast, light, and secure.

### 💼 Career & Portfolio Manager
* **Projects:** Portfolio manager tracking personal and academic software projects, tech stacks, and live/GitHub links.
* **Certificates:** Track verified certifications with issue dates, credential IDs, and inline document previews.
* **Skills:** Catalog technical and soft skills with proficiency levels and categories.
* **Achievements:** Record hackathon wins, awards, and milestones.
* **Social Links:** Consolidate GitHub, LinkedIn, Twitter/X, and portfolio URLs.
* **Resume Builder:** Interactive resume builder with customizable templates (Modern, Professional, Minimal, ATS-Friendly, Academic) and high-fidelity PDF export.

### 💰 Expense Tracker
* Track daily income and expense transactions.
* Categorize spending and visualize category breakdowns.
* Monitor monthly balance and financial summaries.

### 🛡️ Authentication & Authorization
* **Google OAuth2 & Email/Password:** Seamless Single Sign-On or standard registration.
* **Stateless JWT Security:** Dual-layer token model (JWT for general app access, `X-Vault-Token` for Secure Vault).
* **IDOR Protection:** Strict ownership verification on every database query and file operation.

---

## 🏗️ Architecture & Codebase Layout

### Frontend (`frontend/src/`)
Clean, layer-based architecture directly under `src/`:

```text
frontend/src/
├── assets/                 # Static images and icons
├── components/             # Reusable UI components grouped by domain
│   ├── achievements/
│   ├── certificates/
│   ├── common/
│   ├── expenses/
│   ├── projects/
│   ├── resume/
│   ├── skills/
│   ├── smartdrop/          # SmartDropZone, SmartDropModal
│   ├── social/
│   └── vault/
├── contexts/               # React Context providers (AuthContext, VaultLockContext)
├── hooks/                  # Custom React hooks
├── layouts/                # App layout wrappers (MainLayout)
├── pages/                  # ALL application route views
│   ├── AchievementsPage.tsx
│   ├── CertificatesPage.tsx
│   ├── ExpensesPage.tsx
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── OAuth2CallbackPage.tsx
│   ├── ProfilePage.tsx
│   ├── ProjectsPage.tsx
│   ├── RegisterPage.tsx
│   ├── ResumePage.tsx
│   ├── SkillsPage.tsx
│   ├── SocialPage.tsx
│   └── VaultPage.tsx
├── routes/                 # Routing configuration (AppRoutes, ProtectedRoute)
├── services/               # Centralized Axios API services
├── styles/                 # Slush design system tokens & CSS (app.css, variables.css)
└── types/                  # Shared TypeScript interfaces & types
```

### Backend (`backend/src/main/java/com/personalvault/`)
Clean, standard Spring Boot layered architecture:

```text
com.personalvault/
├── config/                 # Spring configurations (CORS, WebMvc, etc.)
├── controller/             # ALL REST Controllers directly in com.personalvault.controller
├── dto/                    # ALL Request / Response DTOs directly in com.personalvault.dto
├── entity/                 # ALL JPA Entities directly in com.personalvault.entity
├── repository/             # ALL Spring Data JPA Repositories directly in com.personalvault.repository
├── service/                # ALL Service Interfaces and Implementations in com.personalvault.service
├── mapper/                 # ALL Entity-DTO Mappers in com.personalvault.mapper
├── extractor/              # SmartDrop Extractors (PDFBox, POI OOXML, Text, Image)
├── classifier/             # Document Classifiers (LocalRule, AIProvider, Composite)
├── model/                  # Classification & temp storage models
├── exception/              # GlobalExceptionHandler and Custom Exceptions
├── security/               # SecurityConfig, JwtService, OAuth2 Handlers
└── util/                   # Encryption, Masking, and Multipart utilities
```

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, TanStack Query, React Hook Form, Recharts.
* **Backend:** Java 25, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, Apache PDFBox 3.0.4, Apache POI 5.4.0, JJWT 0.12.5.
* **Database:** PostgreSQL 16+
* **Storage & Cloud:** Google Drive REST API v3, Google OAuth2

---

## 🏃 Getting Started

### 1. Prerequisites
* **Java 21+** (or Java 25)
* **Node.js 18+** & npm
* **PostgreSQL** running locally on port `5432`

### 2. Backend Setup
1. Create a PostgreSQL database named `personalvault`.
2. Configure your environment variables in `backend/.env` (see `backend/.env.example`):
   ```env
   DB_USERNAME=personalvault_user
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key
   VAULT_ENCRYPTION_KEY=your_vault_aes_key
   ```
3. Run the Spring Boot backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will start at `http://localhost:8080`.

### 3. Frontend Setup
1. Install dependencies and start the Vite dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.

---

## 🔒 Security & Privacy Notice
* Sensitive numbers (Aadhaar, PAN, Bank Accounts) are **always masked** in logs and default API views.
* All SmartDrop temporary uploads are isolated per authenticated user and automatically purged after 30 minutes.
