import axios from "axios";

export type ExpenseApiItem = {
  expensesId: string;
  branchId: string;
  companyId: string;
  categoryId: string;
  date: string;
  description: string;
  amount: string | number;
  paymentType: string;
  addedByName?: string | null;
  createdAt: string;
  branch?: {
    branchId: string;
    name: string;
  };
  category?: {
    categoryId: string;
    category: string;
  };
};

export type ExpenseCategoryItem = {
  categoryId: string;
  category: string;
};

export type BranchItem = {
  branchId: string;
  name: string;
};

export type ExpenseFormPayload = {
  branchId?: string;
  categoryId: string;
  date: string;
  description: string;
  amount: number;
  paymentType: "CASH" | "CARD";
};

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
}/api/v1`;

const getAccessToken = (session?: any) => {
  return (
    session?.accessToken ||
    session?.token ||
    session?.jwt ||
    session?.backendToken ||
    session?.user?.accessToken ||
    session?.user?.token ||
    session?.user?.jwt ||
    session?.user?.backendToken ||
    session?.user?.access_token ||
    ""
  );
};

const createApi = (session?: any) => {
  const token = getAccessToken(session);

  if (!token) {
    console.error("No auth token found in session:", session);
  }

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
};

export const expenseApi = {
  async getExpenses(
    session?: any,
    params?: {
      branchId?: string;
      categoryId?: string;
      paymentType?: string;
      search?: string;
      from?: string;
      to?: string;
    }
  ) {
    const api = createApi(session);
    const response = await api.get<{ success: boolean; data: ExpenseApiItem[] }>(
      "/expenses",
      { params }
    );
    return response.data.data;
  },

  async getExpenseCategories(session?: any) {
    const api = createApi(session);
    const response = await api.get<{ success: boolean; data: ExpenseCategoryItem[] }>(
      "/expenses/categories/all"
    );
    return response.data.data;
  },

  async createExpense(session: any, payload: ExpenseFormPayload) {
    const api = createApi(session);
    const response = await api.post<{ success: boolean; data: ExpenseApiItem }>(
      "/expenses",
      payload
    );
    return response.data.data;
  },

  async updateExpense(
    session: any,
    expenseId: string,
    payload: Partial<ExpenseFormPayload>
  ) {
    const api = createApi(session);
    const response = await api.patch<{ success: boolean; data: ExpenseApiItem }>(
      `/expenses/${expenseId}`,
      payload
    );
    return response.data.data;
  },

  async deleteExpense(session: any, expenseId: string) {
    const api = createApi(session);
    await api.delete(`/expenses/${expenseId}`);
  },

  async getBranches(session?: any) {
    const api = createApi(session);
    const response = await api.get("/branches");
    const raw = response.data?.data ?? response.data ?? [];

    if (!Array.isArray(raw)) return [];

    return raw.map((branch: any) => ({
      branchId: branch.branchId ?? branch.id ?? "",
      name: branch.name ?? branch.branchName ?? "",
    })) as BranchItem[];
  },
};