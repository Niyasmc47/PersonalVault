# PersonalVault

PersonalVault is a secure, all-in-one personal digital management platform built with React, Spring Boot, and PostgreSQL. It allows you to safely store, track, and manage your most important personal information, documents, and professional achievements in a single unified dashboard.

## 🚀 Current Features

### 🔒 Secure Vault
A deeply integrated, high-security digital vault for your most sensitive information.
- **AES-256-GCM Encryption**: All sensitive data is encrypted before saving. 
- **Zero-Knowledge Architecture**: Requires a standalone Vault Master Password to unlock. The token lives only in memory and auto-locks after inactivity.
- **Credential Manager**: Store passwords, usernames, and URLs for various websites and apps.
- **Identity Documents**: Keep details and scans of your Aadhaar, PAN, Passport, Voter ID, and Driver's License.
- **Financial Information**: Securely track your bank accounts, IFSC codes, branches, and UPI IDs (masked by default).
- **Educational & Professional Documents**: Securely store degree certificates, offer letters, and marksheets.
- **Auto-Lock Security**: Protects against unauthorized access when you step away.

### ☁️ Google Drive Integration
Instead of storing your physical files directly in the database, PersonalVault seamlessly connects to your personal Google Drive to store images and PDFs.
- Ensures your actual documents remain fully under your control.
- Keeps the database fast, light, and secure.

### 🏆 Professional Portfolio Manager
Keep track of your professional growth and easily build your resume.
- **Certificates**: Track the professional certifications you have acquired.
- **Projects**: Log your personal and professional software projects.
- **Skills**: Manage your technical and soft skills.
- **Achievements**: Keep a record of your milestones.
- **Resume Generator**: Consolidate your data into a structured resume.

### 💰 Expense Tracker
Take control of your personal finances.
- Track daily and monthly expenses.
- Categorize your spending.
- Get a clear view of your financial habits.

### 🔑 Authentication & Security
- **Google OAuth2**: Seamless sign-in with your Google account.
- **JWT Authentication**: Secure API endpoints with short-lived session tokens.
- **Strict Data Isolation**: Every piece of data is rigorously checked against the authenticated user to prevent unauthorized access.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, React Router
- **Backend**: Java, Spring Boot 3, Spring Security, Hibernate / JPA
- **Database**: PostgreSQL
- **Storage**: Google Drive API

## 🏃 Getting Started
1. **Database**: Ensure PostgreSQL is running and you have created the `personalvault` database and user (as defined in your `.env`).
2. **Backend**: Navigate to `backend/` and run `mvn spring-boot:run`.
3. **Frontend**: Navigate to `frontend/`, run `npm install`, then `npm run dev`.
