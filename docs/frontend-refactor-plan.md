# Frontend Refactor Roadmap: Micro SaaS POS
## Phase 2: Implementation (Remaining Tasks)

This document outlines the remaining steps to transition the frontend from a stabilized prototype into a production-grade system.

---

## 🚀 Priority Status Tracking

| Task | Status | Priority | Timeline |
| :--- | :--- | :--- | :--- |
| **Integrate Zustand (State Management)** | 🔄 Planned | High | Week 1 |
| **API Client Implementation (Axios)** | 🔄 Planned | High | Week 2 |
| **TanStack Query (Data Fetching/Caching)** | 🔄 Planned | High | Week 2 |
| **Server-Driven Logic (URL Params)** | 🔄 Planned | Medium | Week 3 |
| **Zod Form Validation** | 🔄 Planned | Medium | Week 3 |
| **NextAuth.js Integration** | 🔄 Planned | Medium | Week 4 |
| **Service Layer Abstraction** | 🔄 Planned | Low | Week 4 |

---

## 🧠 1. State Management: The "Zustand" Strategy
Move 7+ Context Providers in `layout.tsx` into unified stores to improve performance and maintainability.

*   **Goal**: Create central stores for `usePosStore`, `useAuthStore`, and `useConfigStore`.
*   **Target**: Replace the POS Cart logic first.

---

## 📡 2. API Layer & Data Fetching
Move from localized mock imports to a centralized service-driven architecture.

*   **Step A (Axios)**: Create `@/lib/api-client.ts` with interceptors for JWT and `X-Company-ID` (Multi-tenancy).
*   **Step B (TanStack Query)**: Implement hooks to handle loading, error, and caching automatically.

---

## ⚖️ 3. Architecture: URL-Driven State
Implement `useSearchParams` to handle table filtering, sorting, and pagination.

*   **Why**: Essential for 100% backend integration (Server-side pagination).
*   **Target**: Admin tables (Product, Staff, Orders).

---

## 🔐 4. Auth, Security & Multi-Tenancy
*   **NextAuth.js**: Standardize session handling.
*   **Security**: Remove any frontend hashing (sha256). Passwords must be handled by the backend.
*   **Tenant Resolution**: Ensure Every API request includes the `CompanyID` in the headers.

---

## 📋 5. Data Modeling: Zod Validation
Replace manual error checking in forms with Zod schemas.

*   **Target**: Add Product, Staff Registration, and Payment forms.
*   **Benefit**: Guaranteed data integrity before hitting API endpoints.

---

### Recently Completed (Phase 1)
- ✅ Standardized absolute imports (`@/`).
- ✅ Consolidated project folder structure.
- ✅ Centralized all mock data to `lib/mocks`.
- ✅ Resolved all build-time resolution errors.

---

### Resources
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching)
