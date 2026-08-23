# PersonalVault Setup

## 1. Requirements

Install the following tools:

- Git
- Node.js (LTS recommended)
- npm (comes with Node.js)
- Java JDK 21+
- Maven (or use Maven Wrapper in `backend/`)
- IDE/editor (VS Code recommended)

## 2. Clone Repository

```bash
git clone <your-repository-url>
cd PersonalVault
```

## 3. Switch to `develop` Branch

```bash
git checkout develop
git pull origin develop
```

Create your own feature branch from `develop` before coding:

```bash
git checkout -b feature/<your-feature-name>
```

## 4. Frontend Setup

```bash
cd frontend
npm install
```

## 5. Run Frontend Dev Server

```bash
npm run dev
```

This starts the Vite development server.

## 6. Backend Setup

Open a new terminal:

```bash
cd backend
```

If Maven is installed globally:

```bash
mvn spring-boot:run
```

Or use Maven Wrapper:

```bash
./mvnw spring-boot:run
```

## 7. Maven / Spring Boot Notes

- Keep backend dependencies managed in `backend/pom.xml`.
- Do not commit generated build output from backend.

## 8. Future Database Setup (Placeholder)

Database integration details will be finalized later.
When database setup is added, this section should include:

- MySQL version
- Local DB creation steps
- `application.properties` configuration template
- Migration/seed strategy (if used)

## 9. Environment Variable Rules

- Use environment variables for secrets and sensitive runtime config.
- Store local secrets in `.env`-style local files when adopted by the team.
- Never commit secrets, passwords, API keys, or DB credentials.

## 10. Git Ignore and Commit Rules

The following should not be committed:

- `node_modules/`
- `target/`
- `.env`

The following must be committed:

- `package.json`
- `package-lock.json`

Additional rules:

- Do not commit credentials in any file.
- Review changes before every commit.
- Keep commits focused and feature-specific.
