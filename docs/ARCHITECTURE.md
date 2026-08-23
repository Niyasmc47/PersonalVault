# PersonalVault Architecture

## 1. Overall System Architecture

PersonalVault is a monorepo with two independent applications:

- `frontend/`: React + TypeScript + Vite client
- `backend/`: Spring Boot REST API

The frontend and backend are developed, run, and deployed independently.
Communication happens over HTTP/JSON APIs.

### High-level flow

1. User interacts with the React UI.
2. Frontend calls backend APIs using Axios-based service modules.
3. Backend controllers receive requests and delegate to services.
4. Services apply business rules and use repositories.
5. Repositories read/write database data via JPA.
6. Backend returns DTO-based JSON responses to the frontend.

## 2. Frontend Architecture

Current frontend architecture is feature-based under `frontend/src`.

```text
frontend/src/
├── assets/
├── components/
├── layouts/
├── pages/
├── features/
├── hooks/
├── services/
├── types/
├── utils/
├── routes/
├── contexts/
└── styles/
```

### Responsibilities

- `assets/`: static images/icons/fonts
- `components/`: reusable cross-feature UI components
- `layouts/`: app layout wrappers (dashboard layout, auth layout, etc.)
- `pages/`: route-level pages not owned by a single feature
- `features/`: feature modules (`auth`, `vault`, `expenses`, etc.)
- `hooks/`: shared custom hooks used by multiple features
- `services/`: shared API clients or common service utilities
- `types/`: shared TypeScript interfaces/types
- `utils/`: pure helper functions
- `routes/`: route configuration and route guards
- `contexts/`: React context providers
- `styles/`: global styling tokens, theme, and shared CSS

### Feature module pattern

Each feature folder is self-contained:

```text
features/<feature-name>/
├── components/
├── pages/
├── hooks/
├── services/
├── types/
└── index.ts
```

## 3. Backend Architecture

Backend follows layered architecture with feature-based subpackages.

```text
backend/src/main/java/com/personalvault/
├── config/
├── security/
├── controller/
├── dto/
├── entity/
├── repository/
├── service/
├── exception/
├── mapper/
└── util/
```

Feature subpackages are prepared under relevant layers:

- `auth`
- `vault`
- `expense`
- `skill`
- `project`
- `achievement`
- `certificate`
- `social`
- `resume`

Example for one feature (`expense`):

```text
entity/expense/
repository/expense/
service/expense/
controller/expense/
dto/expense/
mapper/expense/
```

### Layer responsibilities

- `config/`: Spring configuration classes
- `security/`: security setup and auth filters/config
- `controller/`: REST API endpoints
- `dto/`: request/response transport models
- `entity/`: JPA domain models
- `repository/`: Spring Data repository interfaces
- `service/`: business rules and orchestration
- `exception/`: custom exceptions and handlers
- `mapper/`: entity <-> DTO mapping logic
- `util/`: stateless utility helpers

## 4. Frontend-Backend Communication Rules

- Frontend never accesses database directly.
- Frontend calls backend endpoints through service files.
- Controllers return DTOs, not entities.
- Validation and security checks are done in backend layers.
- API contracts should be documented per feature before implementation.

## 5. Why Feature-Based Organization

This structure keeps each feature cohesive and easier to assign to separate developers.
Developers can work in parallel on isolated feature folders with fewer merge conflicts.

## 6. Team Collaboration Readiness

The architecture is intentionally scaffold-only:

- No feature behavior is implemented yet.
- No placeholder API/business logic is added.
- Folder boundaries are ready so each team member can start feature work immediately.
