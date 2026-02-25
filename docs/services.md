# Documentation: Services

## Overview
The service layer (`@/lib/services`) acts as the intermediary between the API client and the application logic.

## Implementation Standard
All services follow a standard pattern:
- **Type Safety**: Methods use generics from `@/types`.
- **Error Handling**: Catch blocks handle API failures and often provide fallback mock data for resilience.
- **Async Logic**: All methods return `Promise<T>`.

## Available Services
- `productService`: CRUD for products.
- `orderService`: Order processing and history.
- `customerService`: Customer profile management.
- `staffService`: Staff and role assignment.
- `branchService`: Branch and location management.
- `analyticsService`: Dashboard metrics and reports.
