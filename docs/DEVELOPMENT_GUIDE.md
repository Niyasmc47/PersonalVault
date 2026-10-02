# PersonalVault Development Guide

## 1. Overview & Purpose

This guide outlines the coding standards, file placement rules, and architectural patterns for PersonalVault. All developers must follow these conventions to maintain clean layered separation and consistency across the monorepo.

---

## 2. Backend Development Guidelines

### 2.1 Package Placement Rules

All Java classes reside under `com.personalvault` in `backend/src/main/java/com/personalvault/`.

Packages are organized strictly by architectural layer:

| Layer / Package | Description | Example Files |
| :--- | :--- | :--- |
| `controller` | REST API endpoint handlers (`@RestController`) | `ProjectController.java`, `SmartDropController.java` |
| `service` | Business logic & transactional services (`@Service`) | `ProjectService.java`, `SmartDropService.java` |
| `repository` | Spring Data JPA interfaces (`@Repository`) | `ProjectRepository.java`, `VaultItemRepository.java` |
| `entity` | Relational JPA entities (`@Entity`, `@Table`) | `Project.java`, `Certificate.java`, `User.java` |
| `dto` | Request & Response Data Transfer Objects | `ProjectRequestDTO.java`, `ProjectResponseDTO.java` |
| `mapper` | Entity $\leftrightarrow$ DTO converters | `ProjectMapper.java`, `VaultMapper.java` |
| `extractor` | SmartDrop document content extractors | `PdfContentExtractor.java`, `DocxContentExtractor.java` |
| `classifier` | SmartDrop document classification strategies | `OpenAiDocumentClassifier.java`, `RuleBasedDocumentClassifier.java` |
| `model` | Non-entity domain and pipeline data models | `ExtractedContent.java`, `ClassificationResult.java` |
| `config` | Spring `@Configuration` beans | `SecurityConfig.java`, `CorsConfig.java`, `AppConfig.java` |
| `security` | Authentication filters, JWT token utilities | `JwtAuthenticationFilter.java`, `TokenProvider.java` |
| `exception` | Custom exceptions and `@RestControllerAdvice` | `GlobalExceptionHandler.java`, `ResourceNotFoundException.java` |
| `util` | Stateless cryptographic and helper utilities | `AESGCMUtil.java`, `FileUtils.java` |

> **Note**: Do not create sub-packages per feature inside `controller`, `dto`, `entity`, etc. All classes of a layer reside directly in that layer's package.

### 2.2 Naming Conventions (Backend)

- **Controllers**: `[Domain]Controller.java` (e.g., `CertificateController.java`)
- **Services**: `[Domain]Service.java` (e.g., `CertificateService.java`)
- **Repositories**: `[Domain]Repository.java` (e.g., `CertificateRepository.java`)
- **Entities**: `[Domain].java` (e.g., `Certificate.java`, `VaultItem.java`)
- **DTOs**: `[Domain]RequestDTO.java`, `[Domain]ResponseDTO.java`
- **Mappers**: `[Domain]Mapper.java` (e.g., `CertificateMapper.java`)
- **Exceptions**: `[Domain]NotFoundException.java`, `[Action]Exception.java`

### 2.3 Backend Controller Standards

1. Always use constructor injection (`@RequiredArgsConstructor` or explicit constructor).
2. Validate incoming requests with `@Valid`.
3. Extract authenticated user context using `SecurityUtils.getCurrentUserId()` or `@AuthenticationPrincipal`.
4. Return typed response objects wrapped in standard response envelopes where applicable.

```java
@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponseDTO> createProject(
            @Valid @RequestBody ProjectRequestDTO requestDTO) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(requestDTO, userId));
    }
}
```

---

## 3. Frontend Development Guidelines

### 3.1 Folder Structure & Placement Rules

The frontend follows a **flat, layered structure** under `frontend/src/`:

```text
frontend/src/
├── assets/             # Global images, icons, and SVG graphics
├── components/         # Reusable and domain-specific UI components
│   ├── common/         # Generic UI (Button, Modal, Card, Navbar, etc.)
│   ├── auth/           # Login, Register, ProtectedRoute
│   ├── dashboard/      # Dashboard widgets, stats, quick-action cards
│   ├── smartdrop/      # SmartDropZone, SmartDropModal, FileItemPreview
│   ├── projects/       # ProjectCard, ProjectModal, ProjectForm
│   ├── certificates/   # CertificateCard, CertificateModal
│   ├── skills/         # SkillBadge, SkillCategoryList, SkillModal
│   ├── achievements/   # AchievementCard, AchievementModal
│   ├── vault/          # VaultFileCard, VaultSecurityModal, EncryptedViewer
│   ├── resume/         # ResumeBuilder, SectionEditor, TemplateSelector
│   ├── social/         # SocialLinksList, SocialLinkModal
│   ├── expenses/       # ExpenseList, ExpenseSummaryCard, ExpenseModal
│   └── profile/        # ProfileHeader, UserSettingsForm
├── contexts/           # React context providers (AuthContext, ThemeContext)
├── hooks/              # Custom React hooks (useAuth, useVault, etc.)
├── layouts/            # Page layouts (MainLayout, DashboardLayout, AuthLayout)
├── pages/              # Route view pages (DashboardPage, ProjectsPage, etc.)
├── routes/             # App routing definitions (AppRoutes.tsx)
├── services/           # Typed API service modules (projectService, authService, etc.)
├── styles/             # Global CSS, Tailwind styling rules
├── types/              # TypeScript interfaces and DTO definitions
└── utils/              # Helper functions (dates, validation, formatting)
```

### 3.2 Naming Conventions (Frontend)

- **Pages**: `[Domain]Page.tsx` under `src/pages/` (e.g., `ProjectsPage.tsx`, `VaultPage.tsx`)
- **Components**: `[Name].tsx` under `src/components/<domain>/` (e.g., `src/components/projects/ProjectCard.tsx`)
- **Services**: `[domain]Service.ts` under `src/services/` (e.g., `projectService.ts`, `smartdropService.ts`)
- **Types**: `[domain].ts` under `src/types/` (e.g., `project.ts`, `smartdrop.ts`)
- **Hooks**: `use[Name].ts` under `src/hooks/` (e.g., `useAuth.ts`, `useProjects.ts`)

### 3.3 API Calling Standards

- **Never** make raw `fetch` or `axios` calls directly from inside UI components or pages.
- Always encapsulate HTTP requests inside typed service functions in `src/services/`.

```typescript
// src/services/projectService.ts
import api from './api';
import { Project, ProjectRequest } from '../types/project';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/api/projects');
    return response.data;
  },

  createProject: async (data: ProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/api/projects', data);
    return response.data;
  },
};
```

---

## 4. Extending SmartDrop

### 4.1 Adding a New Document Extractor

1. Implement the `ContentExtractor` interface in `com.personalvault.extractor`:

```java
@Component
public class CustomFormatExtractor implements ContentExtractor {

    @Override
    public boolean supports(String contentType, String fileExtension) {
        return "custom/mime".equalsIgnoreCase(contentType) || "custom".equalsIgnoreCase(fileExtension);
    }

    @Override
    public ExtractedContent extract(InputStream inputStream, String fileName) throws Exception {
        // Extraction logic
        return ExtractedContent.builder()
                .rawText(extractedText)
                .metadata(metadataMap)
                .build();
    }
}
```

2. Spring will automatically register your extractor in `ExtractorFactory` via dependency injection.

### 4.2 Adding a New Classifier or AI Provider

1. Implement `DocumentClassifier` in `com.personalvault.classifier`.
2. Configure provider selection in `application.properties` via `app.smartdrop.ai-provider`.

---

## 5. Adding a New Feature (End-to-End Workflow)

When introducing a new domain feature (e.g., `Certifications`):

### 1. Backend Steps:
1. Create entity in `com.personalvault.entity.Certificate`.
2. Create repository in `com.personalvault.repository.CertificateRepository`.
3. Create DTOs in `com.personalvault.dto.CertificateRequestDTO` and `CertificateResponseDTO`.
4. Create mapper in `com.personalvault.mapper.CertificateMapper`.
5. Create service in `com.personalvault.service.CertificateService`.
6. Create controller in `com.personalvault.controller.CertificateController`.

### 2. Frontend Steps:
1. Define types in `src/types/certificate.ts`.
2. Create API methods in `src/services/certificateService.ts`.
3. Create UI components in `src/components/certificates/` (`CertificateCard.tsx`, `CertificateModal.tsx`).
4. Create view page in `src/pages/CertificatesPage.tsx`.
5. Register route in `src/routes/AppRoutes.tsx`.
6. Add navigation link in `src/components/common/Navbar.tsx` or `Sidebar.tsx`.

---

## 6. Git & Collaboration Workflow

### Branch Strategy

- `main`: Production-ready releases.
- `develop`: Main development integration branch.
- `feature/<feature-name>`: Active feature work branched from `develop`.

### Pull Request & Commit Rules

1. **Test Before Committing**: Run `mvn clean compile` on backend and `npm run build` on frontend.
2. **Never Commit Secrets**: Ensure `.env`, API keys, private passwords, and JWT secrets are kept in `.gitignore`.
3. **Commit Clean Packages**: When package dependencies change, commit `package.json` and `package-lock.json` or `pom.xml`.
