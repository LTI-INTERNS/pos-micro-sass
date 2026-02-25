# Documentation: Types

## Overview
The project uses a centralized type system located in the `@/types` directory. This ensures consistency across the service layer, state management, and UI components.

## Core Types
- **Product**: `@/types/product.types.ts`
- **Order**: `@/types/order.types.ts`
- **Customer**: `@/types/customer.types.ts`
- **Staff**: `@/types/staff.types.ts`
- **Branch**: `@/types/branch.types.ts`
- **Analytics**: `@/types/analytics.types.ts`

## Standards
1. **No `any`**: The use of `any` is strictly prohibited. Use `unknown` with type guards or specific interfaces.
2. **Explicit Returns**: All service methods and helper functions must have explicit return types.
3. **Zod Inference**: Where applicable, types are inferred from Zod schemas using `z.infer<typeof schema>`.
4. **API Responses**: All API calls should utilize the `ApiResponse<T>` wrapper from `api.types.ts`.
