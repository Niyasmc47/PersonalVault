# PersonalVault Setup & Installation Guide

## 1. System Requirements

Before running PersonalVault locally, ensure the following software is installed:

- **Java JDK**: Version 21 or higher (OpenJDK / Eclipse Temurin / Oracle JDK)
- **Node.js**: Version 18.x or 20.x+ (LTS recommended)
- **npm**: Version 9.x+ (bundled with Node.js)
- **PostgreSQL**: Version 14+ (Local service or Docker container)
- **Maven**: Version 3.8+ (or use the included `./mvnw` wrapper in `backend/`)
- **Tesseract OCR** *(Optional for local OCR on scanned PDFs/images)*:
  - Ubuntu/Debian: `sudo apt-get install tesseract-ocr`
  - macOS: `brew install tesseract`
  - Windows: Download installer from official repository

---

## 2. Clone Repository

```bash
git clone <repository-url>
cd PersonalVault
```

Switch to the `develop` integration branch:

```bash
git checkout develop
git pull origin develop
```

---

## 3. Database Setup (PostgreSQL)

Create a dedicated PostgreSQL database and user:

```sql
CREATE DATABASE personalvault;
CREATE USER pv_user WITH ENCRYPTED PASSWORD 'pv_password';
GRANT ALL PRIVILEGES ON DATABASE personalvault TO pv_user;
```

---

## 4. Backend Configuration & Setup

### 4.1 Environment Variables / Configuration

Navigate to the `backend/` directory:

```bash
cd backend
```

Configure backend parameters in `src/main/resources/application.properties` or create an `.env` file / set system environment variables:

| Variable / Property | Description | Example / Default |
| :--- | :--- | :--- |
| `spring.datasource.url` | PostgreSQL JDBC connection URL | `jdbc:postgresql://localhost:5432/personalvault` |
| `spring.datasource.username` | Database username | `pv_user` |
| `spring.datasource.password` | Database password | `pv_password` |
| `app.jwt.secret` | 256-bit cryptographic secret for signing JWTs | `base64-or-hex-secret-key-at-least-256-bits` |
| `app.vault.encryption-key` | 256-bit AES-GCM vault master key (32 bytes) | `your-32-byte-hex-or-base64-key` |
| `app.smartdrop.ai-provider` | SmartDrop AI strategy (`openai`, `gemini`, `rule_based`) | `openai` (falls back to `rule_based` if key is omitted) |
| `app.smartdrop.openai.api-key` | OpenAI API key for SmartDrop analysis | `sk-...` |
| `app.smartdrop.gemini.api-key` | Google Gemini API key for SmartDrop analysis | `AIzaSy...` |
| `spring.security.oauth2.client.registration.google.client-id` | Google OAuth2 Client ID | `your-google-client-id.apps.googleusercontent.com` |
| `spring.security.oauth2.client.registration.google.client-secret` | Google OAuth2 Client Secret | `your-google-client-secret` |

### 4.2 Build & Run Backend

Using Maven:

```bash
mvn clean spring-boot:run
```

Or using Maven Wrapper:

```bash
./mvnw spring-boot:run
```

The backend server starts by default at `http://localhost:8080`.

---

## 5. Frontend Setup

In a new terminal window, navigate to the `frontend/` directory:

```bash
cd frontend
```

### 5.1 Install Dependencies

```bash
npm install
```

### 5.2 Configure Frontend Environment

Create a `.env` file in `frontend/` (if custom backend port is needed):

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 5.3 Run Development Server

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

---

## 6. Verification & Health Check

1. **Verify Backend API**:
   - Access `http://localhost:8080/api/health` or `http://localhost:8080/api/auth/status` in your browser/Postman.
2. **Verify Frontend UI**:
   - Open `http://localhost:5173` in your browser.
   - Register a new account or log in.
3. **Verify SmartDrop**:
   - Navigate to the Dashboard.
   - Drag & drop a sample document (PDF, PNG, JPG, or DOCX) into the SmartDrop zone.
   - Confirm analysis and verify classification review dialog.

---

## 7. Build for Production

### Frontend Production Build:

```bash
cd frontend
npm run build
```

This compiles optimized assets into `frontend/dist/`.

### Backend Production Build:

```bash
cd backend
mvn clean package -DskipTests
```

This produces an executable JAR file at `backend/target/personalvault-backend.jar`.

---

## 8. Security & Commit Hygiene

- **Never commit `.env` files, API keys, private passwords, or database credentials.**
- Ensure `node_modules/`, `target/`, and build artifacts are excluded in `.gitignore`.
- Always test compilation locally (`mvn clean compile` and `npm run build`) before pushing code.
