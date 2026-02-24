export interface OrderItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    imageUrl?: string;
}

export interface PosState {
    orderItems: OrderItem[];
    addItem: (item: { id: number | string; name: string; price: number; image?: string }) => void;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    setQty: (id: string, qty: number) => void;
    clearCart: () => void;
}

export interface AuthState {
    token: string | null;
    user: any; // Ideally user type
    setAuth: (token: string, user: any) => void;
    logout: () => void;
}

export interface ConfigState {
    tenantId: string | null;
    setTenantId: (id: string) => void;
    clearConfig: () => void;
}
