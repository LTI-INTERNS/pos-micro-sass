import { Discount, CreateDiscountPayload } from "@/types/discount";

const API_BASE_URL = "http://localhost:5000/api/v1/discounts";

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 1. Try to use the token passed directly from NextAuth
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } 
  // 2. Fallback: Local storage (matching your user-service exactly)
  else if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (localToken) {
      headers['Authorization'] = `Bearer ${localToken}`;
    }
  }

  return headers;
};

export const discountService = {
  async getDiscounts(token?: string): Promise<Discount[]> {
    const res = await fetch(API_BASE_URL, {
      method: "GET",
      headers: getHeaders(token),
      credentials: "include", 
    });
    
    if (!res.ok) throw new Error("Failed to fetch discounts");
    
    const data = (await res.json()) as Omit<Discount, "id">[];
    return data.map((d) => ({ ...d, id: d.discountId }) as Discount);
  },

  async createDiscount(payload: CreateDiscountPayload, token?: string) {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: getHeaders(token),
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to create discount");
    }
    return res.json();
  },

  async deleteDiscount(discountId: string, token?: string) {
    const res = await fetch(`${API_BASE_URL}/${discountId}`, {
      method: "DELETE",
      headers: getHeaders(token),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete discount");
    return res.json();
  },

  async getBranches(token?: string) {
    const res = await fetch(`${API_BASE_URL}/branches`, {
      method: "GET",
      headers: getHeaders(token),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch branches");
    return res.json();
  },
  async toggleStatus(id: string, status: boolean, token?: string) {
    const res = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(token),
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to toggle discount status");
    return res.json();
  }
};