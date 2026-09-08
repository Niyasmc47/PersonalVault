# PERSONALVAULT — DEVELOPMENT LOG

## 1. Project Overview

PersonalVault is a multi-user personal productivity and digital data management web application. The application is designed to solve the problem of fragmented personal information by providing a unified, secure platform to store passwords, identity documents, financial information, portfolio projects, professional certificates, and daily expenses. 

## 2. Project Setup & Architecture

PersonalVault uses a modern, modular client-server architecture:
- **Backend:** Built with Java and Spring Boot 3, providing RESTful APIs.
- **Frontend:** Built with React (using Vite), TypeScript, and Tailwind CSS.
- **Database:** PostgreSQL is used for relational data persistence.
- **Environment Configuration:** Sensitive secrets (database credentials, JWT keys, Google OAuth keys) are handled securely via `.env` environment variables.
- **Git/GitHub Workflow:** The team utilizes a Git-based version control workflow, managing branches (like `develop`) for feature-based integration.

**Contributor:** Niyas S handled the core architecture, foundational setup, and continuous integration of the environments.

## 3. Authentication & Authorization

The application secures user data through a robust authentication system:
- **Registration & Login:** Users can register an account and log in securely.
- **Password Hashing:** Passwords are mathematically hashed using BCrypt before storing in PostgreSQL.
- **JWT Authentication:** Short-lived JSON Web Tokens (JWT) are used for stateless authentication. 
- **Protected Routes:** API endpoints and React routes are strictly protected, requiring a valid JWT for access.
- **Authorization:** Each request is validated to ensure users can only access their own data.

**Contributor:** Niyas S

## 4. Google OAuth

In addition to standard login, PersonalVault supports Single Sign-On (SSO):
- **Google Login:** Users can sign in seamlessly using their Google accounts.
- **OAuth2 Integration:** Implemented using Spring Security OAuth2 Client.
- **Integration:** The OAuth flow securely links the user's Google account to their PersonalVault identity.

**Contributor:** Niyas S

## 5. User Profile

PersonalVault includes a profile management module:
- **Profile Viewing:** Users can view their registered account details.
- **Profile Updating:** Account information can be updated.
- **Account Management:** General user-specific settings and state management.


## 6. Dashboard / Home

The main application hub provides an overview of the user's data:
- **Navigation:** A centralized sidebar and header to navigate between features.
- **Overview:** Summarizes active data, including recent vault activity, projects, and expenses.
- **Modular Integration:** Acts as the host layout bringing all individual modules (Projects, Vault, Expenses, Certificates) into a single cohesive UI.

**Contributor:** Niyas S

## 7. Expense & Income Tracker

The application includes a financial tracking module:
- **Expense & Income Logging:** Users can log their daily transactions.
- **Categorization:** Transactions can be organized by category.
- **CRUD Operations:** Full create, read, update, and delete support for financial records.
- **Database Integration:** Records are securely persisted in PostgreSQL, tied strictly to the authenticated user.

*(Developed as a shared team module.)*

## 8. Projects — Midhul

The Projects module serves as a digital portfolio manager:
- **Project Creation & Viewing:** Users can log their personal and professional software projects.
- **Metadata Management:** Stores project details, tech stacks, statuses, and live/GitHub repository links.
- **CRUD Functionality:** Users can edit and delete project entries.
- **Ownership:** Projects are strictly isolated per user via backend authorization checks.


## 9. Certificates — Mehnaz

The Certificates module allows users to track their professional certifications:
- **Certificate Management:** Users can log certificate details (issuer, date, expiration).
- **File Uploads & Previews:** Actual certificate files (PDF/Images) can be uploaded and previewed inside the application.
- **Storage:** Instead of polluting the database, the physical files are uploaded to the user's Google Drive.
- **CRUD:** Full edit and deletion support.


## 10. Google Drive Integration

To keep the database fast and secure, PersonalVault leverages Google Drive for file storage:
- **Google Drive OAuth:** Users authorize the app to access a specific folder in their Drive.
- **Application Folders:** Creates structured folders (e.g., `PersonalVault/Certificates` and `PersonalVault/SecureVault`).
- **Metadata Storage:** Only the Google Drive file IDs and metadata are stored in the PostgreSQL database.
- **Privacy:** Files are kept private; no public links are generated. File bytes are streamed securely through the backend.

*(Integrated across Certificates and Secure Vault features).*

## 11. Secure Vault — Sandra

The Secure Vault is a high-security section for sensitive information:
- **Vault Master Password:** A standalone password is required to access the vault (hashed via BCrypt).
- **Vault Session:** Unlocking the vault generates a short-lived, in-memory Vault Session Token (`X-Vault-Token`).
- **Auto-Lock:** The vault automatically locks after a period of inactivity (e.g., 15 minutes).
- **Categories:** Securely stores Passwords, Identity Documents, Financial Accounts, and Educational/Other Documents.
- **Masking:** Sensitive values (like passwords and account numbers) are hidden by default and require an explicit "Reveal" action.
- **Encryption:** All sensitive fields are encrypted using AES-256-GCM before saving to the database.

## 12. Security Implementation

Security is fundamentally built into the application at multiple layers:
- **BCrypt:** Secures user passwords and the Vault Master Password.
- **JWT & Vault Tokens:** Dual-token architecture separates general app access from sensitive vault access.
- **AES-256-GCM:** Encrypts all highly sensitive Vault data at rest.
- **IDOR Prevention:** Strict ownership verification on every single backend controller ensures users cannot access other users' data.
- **CORS & Headers:** Properly configured CORS policies restrict cross-origin access.

## 13. Database

The PostgreSQL database acts as the single source of truth for structured data:
- **Entities & Relationships:** Organized with clear JPA/Hibernate entities for Users, Projects, Certificates, Vault Settings, and Vault Items.
- **User-Specific Isolation:** Every table relating to personal data contains a foreign key to the User entity.
- **Reference Storage:** Physical files are stored externally, while the database retains lightweight metadata and Drive File IDs.

## 14. Git & Team Development Workflow

The team successfully utilized a collaborative version control process:
- **GitHub Repository:** Acted as the central codebase.
- **Branching Strategy:** The `develop` branch was used for continuous integration, with individual features built on separate branches.
- **Collaboration:** Team members worked on their assigned modules, resolved merge conflicts, and combined their efforts into a unified application structure.

## 15. Team Contributions

### Niyas S
**Core Development:**
- Architected the initial project and directory structure.
- Developed the Authentication, Authorization, and Google OAuth mechanisms.
- Configured PostgreSQL, Hibernate, and environment variables.
- Built the main Dashboard/Home UI and application layout.
- Integrated the various modules created by the team into the core routing system.
- Managed the Git/GitHub development workflow and general backend/frontend bug fixing.

### Sandra
**Secure Vault:**
- Implemented the Secure Vault feature, including AES-256-GCM encryption architecture.
- Built the Vault UI (tabs, modals, and lock screen).
- Implemented the Master Password, Auto-Lock, and in-memory session token mechanics.

### Midhul
**Projects:**
- Implemented the Projects portfolio module.
- Built the backend endpoints and frontend components to track, edit, and categorize software projects.

### Mehnaz
**Certificates:**
- Implemented the Certificates module.
- Built the components to upload, preview, and manage professional certifications via Google Drive.

## 16. Current Project Status

### Completed
- Project Architecture & Database Integration
- JWT Authentication & Google OAuth2
- Dashboard & Core UI Navigation
- Expense Tracker Module
- Projects Module (Midhul)
- Certificates Module & Google Drive Uploads (Mehnaz)
- Secure Vault Module with Encryption & Auto-Lock (Sandra)

### Work in Progress
- **Skills, Achievements, and Resume Generation:** Basic frontend routing and placeholder files exist, but the full CRUD functionality is yet to be completed.
