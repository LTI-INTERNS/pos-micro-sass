# Documentation: Authentication

## Overview
SaaS POS uses a multi-layered authentication system involving NextAuth for sessions and a custom service layer for API communication.

## Implementation Details
- **Auth Store**: `useAuthStore` manages the client-side user state.
- **Server Actions**: `loginAction` and `registerAction` handle the handshake with the backend.
- **Secure Cookies**: JWT tokens are stored in secure, httpOnly cookies (`lt_session`).
- **Type Safety**: The `User` interface in `user.types.ts` defines the session payload.

## Standards
- All auth-related catch blocks must use `axios.isAxiosError` for type-safe error messaging.
- Passwords are never hashed on the frontend; hashing is a backend-only responsibility.
