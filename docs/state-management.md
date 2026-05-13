# Documentation: State Management

## Overview
Global state is managed using **Zustand**. We separate state into specialized stores to maintain clarity and performance.

## Stores
- **useAuthStore**: Manages authentication status and user profile.
- **useConfigStore**: Handles tenant configuration (e.g., `companyId`).
- **usePosStore**: Manages the active shopping cart and checkout state.

## Implementation Rules
1. **Strict Typing**: Every store must have a corresponding interface in `store.types.ts`.
2. **Persistence**: Sensitive data (tokens) are persisted via secure cookies or handled in-memory.
3. **Selectors**: Use selectors when consuming store state in components to prevent unnecessary re-renders.
