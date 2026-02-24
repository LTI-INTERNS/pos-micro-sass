# Frontend Refactor Roadmap: Micro SaaS POS
## Phase 3: Migration & Integration

This document outlines the next steps to migrate the frontend prototype logic into the newly established production-grade infrastructure.

---

## 🚀 Priority Status Tracking

| Task | Status | Priority | Phase |
| :--- | :--- | :--- | :--- |
| **Foundation: Zustand Stores** | ✅ Completed | High | Phase 2 |
| **Foundation: API Client (Axios)** | ✅ Completed | High | Phase 2 |
| **Foundation: TanStack Query Setup** | ✅ Completed | High | Phase 2 |
| **Foundation: Service Layer Base** | ✅ Completed | High | Phase 2 |
| **Foundation: Middleware & Auth Structure**| ✅ Completed | High | Phase 2 |
| **Migrate POS Cart to Zustand** | 🔄 Next | High | Phase 3 |
| **Replace Mock Data with API Services** | 🔄 Planned | High | Phase 3 |
| **Implement URL-Driven Filtering** | 🔄 Planned | Medium | Phase 3 |
| **Convert Static Forms to Zod** | 🔄 Planned | Medium | Phase 3 |

---

## 🧠 1. Infrastructure (COMPLETED)
The core foundation has been established to support a scaleable, backend-ready application:

*   **State Management**: `zustand` is installed with foundational stores in `/store` (Auth, Pos, Config).
*   **Networking**: `Axios` client configured in `lib/api-client.ts` with multi-tenancy and JWT interceptors.
*   **Data Fetching**: `TanStack Query` integrated into the root layout via `Providers`.
*   **Routing**: Next.js Middleware implemented for protected route handling.
*   **Validation**: `Zod` schemas started in `lib/validation/`.

---

## 🏗️ 2. Phase 3: Migration Strategy

### A. POS Component Refactor
*   Remove local `cart` states and local storage logic.
*   Connect `ItemGrid.tsx` and `OrderSummaryContent.tsx` to `usePosStore`.

### B. API Integration
*   Switch components from searching `lib/mocks/` directly to using `lib/services/`.
*   Wrap service calls with `useQuery` or `useMutation` for automated state management.

### C. Server-Side Table States
*   Update `Filterlogic.ts` to push filter states to URL search parameters.
*   Allow the API layer to read these params for server-side filtering and pagination.

---

### Recently Completed (Phase 1 & 2)
- ✅ Standardized absolute imports (`@/`).
- ✅ Consolidated project folder structure.
- ✅ Centralized all mock data to `lib/mocks`.
- ✅ Resolved all build-time resolution errors.
- ✅ Implemented foundational Refactor Architecture (Stores, Services, API).

---

### Resources
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching)
