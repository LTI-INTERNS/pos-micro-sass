# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-02-25

### Added
- Centralized type system in `/types` directory.
- `types/api.types.ts` for standardized API communication formats.
- `types/analytics.types.ts` for dashboard and reporting data.
- Domain types for `Product`, `Order`, `Customer`, `Staff`, `Branch`, and `User`.

### Changed
- Refactored all services (`productService`, `orderService`, etc.) to be fully typed with explicit return types.
- Updated `useAuthStore` and `usePosStore` with strict state interfaces.
- Migrated management pages for Staff, Customers, and Branches to use shared domain types.
- Hardened service layer error handling with `axios.isAxiosError`.

### Fixed
- ESLint errors regarding unsafe `any` usage in auth actions (`loginAction`, `registerAction`).
- TypeScript compilation errors in `EditEntityModal` and `useCSVExport` by implementing proper generic constraints.
- Corrected missing `Product` and `Order` exports in the centralized service index.
- Resolved build-time warnings for unused variables and specific `any` assertions.
