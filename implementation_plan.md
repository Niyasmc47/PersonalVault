# Implementation Plan — Secure Vault for PersonalVault

Implement a comprehensive, security-focused Secure Vault for PersonalVault, adhering to the project's existing Spring Boot backend, React/TypeScript frontend, Google Drive integration, and Slush design language (`design.md`).

## User Review Required

> [!IMPORTANT]
> **Encryption Key & Vault Master Password:**
> - Vault secrets (passwords, Aadhaar, PAN, bank account numbers, API keys, recovery codes, notes) will be encrypted using **AES-256-GCM** authenticated encryption before storing in PostgreSQL.
> - Uploaded sensitive documents will be encrypted with AES-256-GCM before uploading to private Google Drive storage.
> - A dedicated **Vault Master Password** (hashed with BCrypt) will be used to unlock the vault. This provides a uniform lock/unlock experience for both Local and Google OAuth users.
> - Vault unlock generates a short-lived in-memory Vault Session Token (15-minute validity with auto-lock on inactivity), enforced server-side via `X-Vault-Token` header.
> - Plaintext secrets are never returned in list endpoints; they are masked by default (e.g. `XXXX-XXXX-1234`) and can only be revealed when the vault is unlocked.

> [!TIP]
> **Google Drive Preservation:**
> Existing Google Drive functionality for Certificates (`PersonalVault/Certificates`) remains untouched. Secure Vault documents will be stored in a dedicated folder path: `PersonalVault/SecureVault/{Identity Documents, Financial Documents, Educational Documents, Other Documents}`.

---

## Proposed Architecture & Component Design

```
User (Browser)
   │
   ├─► Logged into PersonalVault (JWT Cookie)
   │
   └─► Accesses /vault ──► Vault is LOCKED
           │
           ├─► Enters Vault Master Password ──► POST /api/vault/unlock
           │                                        │
           │                                        ▼
           │                             Issues Vault Session Token (15 min)
           │
           ▼
    Vault UNLOCKED (In-memory token, never in localStorage)
    Inactivity timer (15 mins) automatically relocks vault
           │
           ├── Passwords & Credentials (AES-256-GCM encrypted in PostgreSQL)
           ├── Identity Documents (AES-256-GCM encrypted fields + encrypted Drive files)
           ├── Financial Information (AES-256-GCM encrypted fields + encrypted Drive files)
           ├── Educational Documents (AES-256-GCM encrypted Drive files)
           └── Other Important Documents (AES-256-GCM encrypted Drive files)
```

---

## Proposed Changes

### Backend Components

#### Security & Encryption Layer

##### [NEW] [EncryptionService.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/service/vault/EncryptionService.java)
- AES-256-GCM authenticated encryption/decryption for strings and binary data (`byte[]`).
- Generates 12-byte secure random IV for each encryption operation.
- Reads encryption master key from `app.vault.encryption-key` (configurable via `VAULT_ENCRYPTION_KEY` environment variable).
- Methods:
  - `String encrypt(String plaintext)`
  - `String decrypt(String ciphertext)`
  - `byte[] encryptBytes(byte[] data)`
  - `byte[] decryptBytes(byte[] encryptedData)`

##### [NEW] [VaultSecurityService.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/service/vault/VaultSecurityService.java)
- Manages vault setup, unlocking, locking, and session validation.
- Issues time-limited signed Vault Session Tokens (15 min) upon successful master password verification.
- Validates `X-Vault-Token` for sensitive reveal, preview, and download requests.
- Enforces user ownership and prevents IDOR.

---

#### Database Entities & Repositories (`com.personalvault.entity.vault` & `repository.vault`)

##### [NEW] [VaultSettings.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/entity/vault/VaultSettings.java)
- Stores user vault configuration: `user_id` (OneToOne), `masterPasswordHash` (BCrypt), `passwordHint`, `autoLockMinutes`, `createdAt`, `updatedAt`.

##### [NEW] [VaultCredential.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/entity/vault/VaultCredential.java)
- Stores passwords and credentials: `name`, `username`, `encryptedPassword`, `url`, `category` (LOGIN, EMAIL, SOCIAL, FINANCIAL, WORK, OTHER), `encryptedNotes`, `encryptedApiKeys`, `encryptedRecoveryCodes`.

##### [NEW] [VaultIdentityDocument.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/entity/vault/VaultIdentityDocument.java)
- Stores identity IDs: `type` (AADHAAR, PAN, PASSPORT, DRIVING_LICENCE, VOTER_ID, OTHER), `holderName`, `maskedNumber`, `encryptedNumber`, `issueDate`, `expiryDate`, `encryptedNotes`, front/back Google Drive file IDs, file names, MIME types, and sizes.

##### [NEW] [VaultFinancialAccount.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/entity/vault/VaultFinancialAccount.java)
- Stores financial records: `bankName`, `maskedAccountNumber`, `encryptedAccountNumber`, `ifsc`, `branch`, `accountType` (SAVINGS, CURRENT, SALARY, FIXED_DEPOSIT, DEMAT, OTHER), `upiId`, `encryptedTaxInfo`, `encryptedNotes`, document file ID. CVV is explicitly excluded.

##### [NEW] [VaultDocument.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/entity/vault/VaultDocument.java)
- Stores Educational, Professional, and Other documents: `section` (EDUCATION / OTHER), `category` (DEGREE, MARKSHEET, TRANSCRIPT, STUDENT_ID, INTERNSHIP_CERTIFICATE, OFFER_LETTER, EXPERIENCE_CERTIFICATE, PROFESSIONAL_CERTIFICATION, CONTRACT, INSURANCE, PROPERTY, MEDICAL, OTHER), `title`, `issuerOrInstitution`, `identifier`, `issueDate`, `expiryDate`, `encryptedNotes`, `googleDriveFileId`, `originalFileName`, `mimeType`, `fileSize`.

##### [NEW] Repositories
- [VaultSettingsRepository.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/repository/vault/VaultSettingsRepository.java)
- [VaultCredentialRepository.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/repository/vault/VaultCredentialRepository.java)
- [VaultIdentityDocumentRepository.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/repository/vault/VaultIdentityDocumentRepository.java)
- [VaultFinancialAccountRepository.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/repository/vault/VaultFinancialAccountRepository.java)
- [VaultDocumentRepository.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/repository/vault/VaultDocumentRepository.java)

---

#### Google Drive Integration Layer

##### [MODIFY] [GoogleDriveService.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/service/googledrive/GoogleDriveService.java) & [GoogleDriveServiceImpl.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/service/googledrive/GoogleDriveServiceImpl.java)
- Add methods for Secure Vault without modifying Certificate methods:
  - `String uploadVaultFile(User user, byte[] data, String fileName, String mimeType, String subfolderName)`: uploads encrypted file into `PersonalVault/SecureVault/{subfolderName}`.
  - `byte[] downloadFileBytes(User user, String googleDriveFileId)`: reuses existing download method.
  - `ensureVaultFolder(User user, String subfolderName)`: locates or creates `PersonalVault -> SecureVault -> {subfolderName}` in Google Drive.

---

#### DTOs & Mappers (`com.personalvault.dto.vault` & `mapper.vault`)

##### [NEW] DTOs
- `VaultStatusResponse`, `VaultSetupRequest`, `VaultUnlockRequest`, `VaultUnlockResponse`, `VaultChangePasswordRequest`
- `CredentialRequest`, `CredentialResponse`, `CredentialRevealResponse`
- `IdentityDocumentRequest`, `IdentityDocumentResponse`, `IdentityDocumentRevealResponse`
- `FinancialAccountRequest`, `FinancialAccountResponse`, `FinancialAccountRevealResponse`
- `VaultDocumentRequest`, `VaultDocumentResponse`, `VaultDocumentRevealResponse`
- Masking utilities (e.g. `maskAadhaar`, `maskPan`, `maskAccountNumber`).

##### [NEW] Mappers
- `VaultCredentialMapper`, `VaultIdentityDocumentMapper`, `VaultFinancialAccountMapper`, `VaultDocumentMapper`.

---

#### Controllers & Services (`com.personalvault.controller.vault` & `service.vault`)

##### [NEW] Controllers
- [VaultAuthController.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/controller/vault/VaultAuthController.java): Status, Setup, Unlock, Lock, Change Master Password.
- [VaultCredentialController.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/controller/vault/VaultCredentialController.java): CRUD + Reveal for Credentials.
- [VaultIdentityDocumentController.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/controller/vault/VaultIdentityDocumentController.java): CRUD + Reveal + Preview + Download for Identity Docs.
- [VaultFinancialAccountController.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/controller/vault/VaultFinancialAccountController.java): CRUD + Reveal + Preview + Download for Financial Accounts.
- [VaultDocumentController.java](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/backend/src/main/java/com/personalvault/controller/vault/VaultDocumentController.java): CRUD + Reveal + Preview + Download for Education & Other Docs.

---

### Frontend Components (`frontend/src/features/vault`)

#### Context & Service Layer

##### [NEW] [VaultLockContext.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/contexts/VaultLockContext.tsx)
- Manages in-memory vault state: `isConfigured`, `isUnlocked`, `vaultToken`, `activeTab`.
- Inactivity tracking: listens for user activity; automatically locks after 15 minutes of inactivity.
- Never persists master password or decrypted secrets in `localStorage`.

##### [NEW] [vaultService.ts](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/services/vaultService.ts)
- API service calling backend endpoints with `X-Vault-Token` header for sensitive actions.
- Methods for status, unlock, lock, setup, reveal, CRUD, preview blob retrieval, and download.

##### [NEW] [types/index.ts](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/types/index.ts)
- Strict TypeScript types for all vault models, requests, responses, and tab enums. No `any` used.

---

#### UI Components (Slush Design System from `design.md`)

##### [NEW] Components
- [VaultHeader.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/VaultHeader.tsx): Slush-styled banner with lock/unlock pill, tab switcher (Passwords, Identity, Finance, Education, Other), search bar, and action buttons.
- [VaultUnlockCard.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/VaultUnlockCard.tsx): Styled card for unlocking or initial setup with password hint support.
- [CredentialSection.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/CredentialSection.tsx) & [CredentialCard.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/CredentialCard.tsx): Password list with Reveal, Copy, Edit, Delete.
- [CredentialFormModal.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/CredentialFormModal.tsx): Modal for creating/editing credentials.
- [IdentitySection.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/IdentitySection.tsx) & [IdentityCard.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/IdentityCard.tsx): Identity cards with masked numbers, document badges, front/back preview buttons.
- [IdentityFormModal.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/IdentityFormModal.tsx): Modal supporting Aadhaar, PAN, Passport, etc., with front/back file uploads.
- [FinancialSection.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/FinancialSection.tsx) & [FinancialCard.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/FinancialCard.tsx): Bank accounts, IFSC, UPI, masked account numbers, document attachment.
- [FinancialFormModal.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/FinancialFormModal.tsx): Modal for financial accounts (explicitly no CVV).
- [DocumentSection.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/DocumentSection.tsx) & [DocumentCard.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/DocumentCard.tsx): Education/Other document cards with preview/download.
- [DocumentFormModal.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/DocumentFormModal.tsx): Modal for Educational & Other document uploads.
- [VaultDocumentViewerModal.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/VaultDocumentViewerModal.tsx): Inline preview modal for PDF iframe & JPG/PNG with download action.
- [DeleteVaultItemDialog.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/components/DeleteVaultItemDialog.tsx): Confirmation modal for safe deletion.

##### [MODIFY] [VaultPage.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/vault/pages/VaultPage.tsx)
- Connects `VaultLockContext`, renders locked/unlocked state, tabs, active section, and modals.

##### [MODIFY] [HomePage.tsx](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/features/dashboard/pages/HomePage.tsx)
- Ensure Secure Vault links and descriptions accurately represent the complete feature.

##### [MODIFY] [app.css](file:///c:/Users/91984/OneDrive/Desktop/oops%20project/PersonalVault/frontend/src/styles/app.css)
- Add CSS rules for vault components, following `DESIGN.md`: 1px solid black borders, rounded pills, sticker badges, paper-white backgrounds, no box shadows or gradients.

---

## Verification Plan

### Automated Builds & Checks
1. **Backend Compilation**: Run `./mvnw clean compile -DskipTests` or `mvn compile` in `backend` to ensure all Java classes, DTOs, controllers, and services compile without errors.
2. **Frontend Type Check & Build**: Run `npm run build` (runs `tsc -b && vite build`) and `npm run lint` in `frontend` to verify strict TypeScript adherence with zero errors and zero `any` usage.

### Manual / Logical Verification
1. **Vault Lock/Unlock State**:
   - Initial state is Locked.
   - Master password setup and unlock transitions to Unlocked.
   - Lock button immediately resets state to Locked.
   - 15 minutes of inactivity resets state to Locked.
2. **Data Encryption in DB**:
   - Verify stored fields in PostgreSQL are encrypted ciphertexts, not plaintext.
3. **Masked API Responses**:
   - Verify list endpoints return masked values (e.g. `XXXX-XXXX-1234`) and reveal endpoints require valid vault token.
4. **Google Drive Integration**:
   - Verify files are uploaded encrypted to `PersonalVault/SecureVault/*` subfolders and decrypted during inline preview and download.
   - Verify existing Certificates functionality is preserved.
5. **Ownership & IDOR Prevention**:
   - Verify server-side ownership checks ensure User A cannot view, modify, or delete User B's vault items.

### Git Verification
- Check `git status` and `git diff` to ensure no secrets or `.env` files are tracked.
- Commit to `develop` branch with message: `feat: implement secure vault feature`.
- Push to `origin/develop`.
