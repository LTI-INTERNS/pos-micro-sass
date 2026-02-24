# Frontend Refactor Guide: Micro SaaS POS
## (Intern-Friendly Implementation Manual)

This document is a step-by-step manual for refactoring the current frontend prototype into a production-grade system. Each section includes a conceptual explanation, why it matters, and a implementation guide.

---

## ⚖️ 1. Architecture: From "Client-Only" to "Server-Driven"

### A. Server-Side Data Logic (URL Search Params)
*   **What it is**: Instead of using `useState` to filter a list of products, you put the search term or page number directly into the browser URL (e.g., `?page=2&search=cola`).
*   **Why**: If you have 10,000 products, the browser can't load them all at once. The backend needs to know which "page" to send.
*   **Guide**:
    1.  In your table component, use `useSearchParams` from `next/navigation`.
    2.  When a user types in the search bar, use `router.push('/products?search=' + value)`.
    3.  The Page component will read these params and send them to the API.

### B. Service Layer Abstraction (`/lib/services`)
*   **What it is**: Moving "thinking" logic (math, calculations, data formatting) out of the UI components and into separate JS files.
*   **Why**: You don't want to write the same "Calculate VAT" code in 5 different files.
*   **Guide**: Create `lib/services/pos-service.ts`.
    ```typescript
    // Example: lib/services/vat-service.ts
    export const calculateVAT = (price: number, rate: number = 0.15) => price * rate;
    ```

### C. Middleware Tenant Resolution
*   **What it is**: Code that runs *before* a page loads to identify which company is logged in based on the domain (e.g., `coca.pos.com` vs `pepsi.pos.com`).
*   **Why**: Essential for SaaS security. It prevents a user from one company seeing data from another.

---

## 🧠 2. State Management: The "Zustand" Strategy

### The Problem: "Provider Hell"
Currently, `layout.tsx` is wrapped in 7+ Context Providers. This makes the code messy and slow.

### The Solution: Zustand
*   **What it is**: A small, fast library to manage global variables (like the User's name or the POS Cart).
*   **Guide**:
    1.  Install: `npm install zustand`
    2.  Create a store: `store/usePosStore.ts`
    ```typescript
    import { create } from 'zustand';

    interface CartStore {
      cartItems: any[];
      addToCart: (item: any) => void;
    }

    export const usePosStore = create<CartStore>((set) => ({
      cartItems: [],
      addToCart: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),
    }));
    ```

---

## 📡 3. API Layer: Communication with the Backend

### A. The Base Client (Axios)
*   **What it is**: A central "phone book" that knows how to call the backend.
*   **Why**: You need to automatically add security tokens (JWT) to every call.
*   **Guide**: Create `lib/api-client.ts`.
    ```typescript
    import axios from 'axios';

    const apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    ```

### B. TanStack Query (React Query)
*   **What it is**: A library that handles "Loading..." and "Error" states for you automatically.
*   **Guide**:
    ```typescript
    const { data, isLoading } = useQuery({ 
      queryKey: ['products'], 
      queryFn: () => apiClient.get('/products') 
    });
    ```

---

## 🔐 4. Auth & Security: NextAuth.js

*   **What it is**: A standard library to handle Login, Logout, and sessions.
*   **Implementation Guide**:
    1.  Replace the current `auth.ts` logic with a NextAuth configuration.
    2.  Use `useSession()` in your components to check if the user is an "Admin" or a "Cashier".
    3.  **No More Hashing on Frontend**: Never use `sha256` in the frontend code. Just send the password to the backend; let the backend secure it.

---

## 🏢 5. Multi-Tenancy readiness

*   **Rule**: Every single API request must have a `CompanyID`.
*   **Implementation**: In your Axios interceptor (Step 3), add a line:
    `config.headers['X-Company-ID'] = currentTenantID;`

---

## 📋 6. Data Modeling: Zod Validation

*   **What it is**: A tool to make sure the data entered in a form is correct before sending it to the server.
*   **Example**:
    ```typescript
    import { z } from "zod";

    const productSchema = z.object({
      name: z.string().min(3, "Name is too short"),
      price: z.number().positive(),
    });

    // Use this in your "Add Product" form
    ```

---

---

## ✅ 7. Folder Structure & Import Standards (COMPLETED)

The project structure has been standardized to maintain clean separation of concerns:
- **`/app`**: Next.js App Router (Routes & Layouts only).
- **`/components`**: Reusable UI components. Organized by module (Admin, Pos, saas).
- **`/lib`**: Logic, constants, and utilities.
  - `/lib/context`: Legacy React Context providers.
  - `/lib/mocks`: Centralized mock data (Moved from individual app folders).
  - `/lib/utils`: Helper functions.
- **`/hooks`**: Custom React hooks.
- **`/store`**: (Planned) Zustand stores.
- **`/types`**: TypeScript interfaces and types.

**Import Standard**: All imports must use the absolute `@/` alias to avoid messy relative paths (e.g., `../../../`). This is enforced and verified by the build system.

---

## 🚀 Refactor Priority & Status Tracking

| Task | Status | Priority |
| :--- | :--- | :--- |
| **Folder Structure Cleanup** | ✅ Completed | High |
| **Absolute Import Standardization (@/)** | ✅ Completed | High |
| **Centralize Mock Data (`/lib/mocks`)** | ✅ Completed | High |
| **Fix Build & Type Errors** | ✅ Completed | High |
| **Integrate Zustand (State Management)** | 🔄 Planned (W1) | High |
| **API Client Implementation (Axios)** | 🔄 Planned (W2) | High |
| **TanStack Query Integration** | 🔄 Planned (W2) | High |
| **Zod Form Validation** | 🔄 Planned (W3) | Medium |
| **Service Layer Abstraction** | 🔄 Planned (W4) | Medium |

---

### Recent Changes (Feb 25, 2026)
- **Zero-Error Build**: The project now successfully compiles via `npm run build`.
- **Mock Migration**: All scattered `data.ts` and `mock/` folders were moved to `@/lib/mocks` to clean up the routing directory.
- **Import Audit**: Scanned and fixed 180+ files to ensure no relative path leaks (`../..`).

---

### Need Help?
- Documentation: [Zustand](https://docs.pmnd.rs/zustand), [TanStack Query](https://tanstack.com/query/latest), [Zod](https://zod.dev/).
- Ask your Lead Architect if you're unsure about where a piece of logic belongs!
