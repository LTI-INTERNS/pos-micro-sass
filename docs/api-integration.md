# Documentation: API Integration

## Overview
All external communication is routed through the central `apiClient` (`@/lib/api-client.ts`).

## Configuration
- **Base URL**: Configured via `NEXT_PUBLIC_API_URL`.
- **Tenant Awareness**: The `X-Company-ID` header is automatically injected into every request via interceptors.

## Usage
Services use the `apiClient` with typed generics:
```typescript
apiClient.get<Product[]>('/products')
```

## Error Handling
The standard pattern for handling API errors in services:
```typescript
.catch((error: unknown) => {
    if (axios.isAxiosError(error)) {
        // handle or log
    }
})
```
