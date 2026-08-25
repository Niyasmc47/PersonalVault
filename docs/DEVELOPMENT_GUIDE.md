# PersonalVault Development Guide

## 1. Purpose

This guide defines exactly where code belongs so all team members follow the same structure.

## 2. Backend File Placement Rules

Base package:

- `com.personalvault`

Layers:

- `entity/<feature>/`: JPA entities
- `dto/<feature>/`: request/response DTOs
- `repository/<feature>/`: Spring Data repositories
- `service/<feature>/`: business services
- `controller/<feature>/`: REST controllers
- `mapper/<feature>/`: mapping classes (entity/DTO conversion)
- `exception/`: global and custom exception handling
- `config/`: Spring configuration
- `security/`: security configuration and auth components
- `util/`: helper utilities used by multiple features

### Expense feature example (backend)

- `Expense.java` -> `entity/expense/`
- `ExpenseDTO.java` -> `dto/expense/`
- `ExpenseRepository.java` -> `repository/expense/`
- `ExpenseService.java` -> `service/expense/`
- `ExpenseController.java` -> `controller/expense/`

## 3. Frontend File Placement Rules

Shared folders under `frontend/src`:

- `components/`: reusable components shared across features
- `layouts/`: page/layout shells
- `pages/`: app-level pages not owned by one feature
- `hooks/`: shared hooks
- `services/`: shared API utilities/clients
- `types/`: shared TS types/interfaces
- `utils/`: helper functions
- `routes/`: route definitions and route-related helpers
- `contexts/`: context providers
- `styles/`: global CSS/themes/tokens

Feature modules under `frontend/src/features`:

- `auth/`
- `vault/`
- `expenses/`
- `skills/`
- `projects/`
- `achievements/`
- `certificates/`
- `social/`
- `resume/`

Recommended structure per feature:

```text
features/<feature>/
├── components/
├── pages/
├── hooks/
├── services/
├── types/
└── index.ts
```

### Expense feature example (frontend)

- `ExpensePage.tsx` -> `features/expenses/pages/`
- `ExpenseCard.tsx` -> `features/expenses/components/`
- `expenseService.ts` -> `features/expenses/services/`
- `expenseTypes.ts` -> `features/expenses/types/`

## 4. Naming Conventions

Backend:

- Entities: `PascalCase` (`Expense`, `Certificate`)
- DTOs: `PascalCase` with suffix (`ExpenseRequestDTO`, `ExpenseResponseDTO`)
- Repositories: `PascalCase` + `Repository`
- Services: `PascalCase` + `Service`
- Controllers: `PascalCase` + `Controller`

Frontend:

- React components/pages/layouts: `PascalCase.tsx`
- Hooks: `camelCase` with `use` prefix (`useExpenses.ts`)
- Services: `camelCase` with `Service` suffix (`expenseService.ts`)
- Types: `camelCase` or `PascalCase` by team preference, but keep consistent per file
- Utilities: `camelCase.ts`

## 5. API Call Rules

- All HTTP calls belong in `services`.
- Feature-specific calls stay in `features/<feature>/services`.
- Shared/common API utilities stay in `src/services`.
- UI components/pages should not make raw Axios calls directly when a service exists.

## 6. Reusable vs Feature-Specific Components

- If used in multiple features, place in `src/components`.
- If only used by one feature, place in `features/<feature>/components`.

## 7. Type Placement Rules

- Feature-specific types: `features/<feature>/types`.
- Shared/common types used by multiple features: `src/types`.

## 8. Hook Placement Rules

- Feature-specific hooks: `features/<feature>/hooks`.
- Shared hooks: `src/hooks`.

## 9. Utility Placement Rules

- Feature-specific utilities: inside that feature folder (add `utils` if needed).
- Global/shared utilities: `src/utils`.

## 10. Git Collaboration Workflow

Branch hierarchy:

```text
main
  ^
  | Pull Request
  |
develop
  ^
  | Pull Request
  |
feature branches
```

Example feature branches:

- `feature/auth`
- `feature/vault`
- `feature/expenses`
- `feature/skills`
- `feature/projects`
- `feature/resume`

Rules:

- Never push feature work directly to `main`.
- Implement work in feature branches.
- Merge feature branches into `develop` using Pull Requests.
- Merge `develop` into `main` using Pull Requests for stable releases.
- Do not manually copy another developer's files into your branch.
- Pull/rebase from `develop` before major work when appropriate.

Commit hygiene for collaboration:

- Commit `package.json` and `package-lock.json` when dependencies change.
- Never commit `node_modules`.
- Never commit secrets, passwords, API keys, tokens, or database credentials.
