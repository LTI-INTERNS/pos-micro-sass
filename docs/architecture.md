# Documentation: Architecture

## Overview
The project follows a modular Next.js 15 (App Router) architecture with a clear separation of concerns.

## Layers
1. **UI Layer (`/app`, `/components`)**: React components using Tailwind CSS.
2. **Service Layer (`/lib/services`)**: Business logic and API coordination.
3. **Data Layer (`/types`)**: Centralized type definitions and Zod schemas.
4. **State Layer (`/store`)**: Global state management via Zustand.

## Core Principles
- **Tenant Isolation**: All data fetching is scoped by `companyId`.
- **Strict Typing**: Zero use of `any` across the entire codebase.
- **Resiliency**: Mock data fallbacks for all critical services.
