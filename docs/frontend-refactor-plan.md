# Frontend Refactor Roadmap: Micro SaaS POS
## Status: Phase 4 Implementation & Stabilization

This document outlines the current progress and detailed breakdown of remaining tasks to reach a 100% production-ready frontend state.

---

## 🚀 Priority Status Tracking

| Task | Status | Priority | Phase |
| :--- | :--- | :--- | :--- |
| **Foundation: Infrastructure Setup** | ✅ Completed | High | Phase 2 |
| **Migration: POS Cart to Zustand** | ✅ Completed | High | Phase 3 |
| **Integrate: Product Service Layer** | ✅ Completed | High | Phase 3 |
| **Feature: URL-Driven Filtering** | ✅ Completed | High | Phase 3 |
| **Validation: Zod Form Migration** | ✅ Completed | High | Phase 3 |
| **Cleanup: Removal of Direct Mock Imports** | 🔄 In Progress| High | Phase 4 |
| **Expansion: Full Service Layer Coverage**| 🔄 Planned | High | Phase 4 |
| **Security: NextAuth & Hashing Cleanup** | 🔄 Planned | Medium | Phase 4 |

---

## 🏗️ 1. Recently Completed (Phase 3)
*   **Zustand POS Cart**: Migrated `app/posdashboard/page.tsx` handlers to the centralized `usePosStore`.
*   **Initial Service Pattern**: Created `lib/services/product-service.ts` and successfully integrated it into `app/productmanagement/page.tsx`.
*   **URL Search Params**: Implemented the `useUrlFilters` hook to sync search and filter states with the URL, improving SEO and UX.
*   **Zod Foundation**: Migrated `AddProductPopup.tsx` from manual string checks to schema-based validation.

---

## 📝 2. Detailed "To-Do" List (Phase 4)

### A. Component-Level Migration (Highest Priority)
All components still importing directly from `lib/mocks/` need to be refactored to use the service layer.
*   **Staff Management**: Migrate `/app/staffmanagement` to use a `staffService`.
*   **Customer Management**: Migrate `/app/customermanagement` and POS customer selection to a `customerService`.
*   **Order Management**: Port the history and table views to `orderService`.
*   **Profit & Expenses**: Implement analytics-focused services for financial dashboards.

### B. Implementation of Mutations
Currently, most integrations are "Read-Only" (using `useEffect` or `useQuery`).
*   **C.R.U.D Logic**: Update all "Save", "Edit", and "Delete" buttons to call service methods.
*   **TanStack Query Sync**: Wrap creation/deletion logic in `useMutation` hooks so the UI automatically re-fetches data upon successful changes.

### C. Authentication Finalization
*   **Credentials Provider**: Configure `lib/auth.ts` to use actual backend endpoints for login.
*   **Session Management**: Replace `localStorage` token hacks with proper `useSession` and `getServerSession`.
*   **Security Cleanup**: Scan the codebase for any frontend-side password hashing (like legacy sha256 utils) and remove them—all sensitive logic MUST reside in the backend.

### D. Multi-Tenancy Headers
*   **Config Store Binding**: Ensure the `X-Company-ID` interceptor in `lib/api-client.ts` is dynamically pulling the correct Tenant ID from `useConfigStore` or URL patterns.

### E. Global UX Improvements
*   **Loading States**: Replace "Loading..." text with `Skeleton` loaders across all management tables.
*   **Error Boundaries**: Implement standardized error catchers to prevent the app from crashing during API failures.
*   **Validation**: Continue porting all forms (Staff registration, Branch settings) to use the `lib/validation` schema patterns.

---

### Resources
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching)
