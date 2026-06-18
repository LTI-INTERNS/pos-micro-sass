import axios from "axios";

interface SessionLike {
  accessToken?: string;
  token?: string;
  jwt?: string;
  backendToken?: string;
  user?: {
    accessToken?: string;
    token?: string;
    jwt?: string;
    backendToken?: string;
    access_token?: string;
  };
}

export type RecurringExpenseApiItem = {
  recExpensesId: string;
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

export type RecurringExpenseCategoryItem = {
  categoryId: string;
  category: string;
};

export type BranchItem = {
  branchId: string;
  name: string;
};

export type RecurringExpenseFormPayload = {
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

const getAccessToken = (session?: unknown) => {
  const s = session as SessionLike | null | undefined;
  return (
    s?.accessToken ||
    s?.token ||
    s?.jwt ||
    s?.backendToken ||
    s?.user?.accessToken ||
    s?.user?.token ||
    s?.user?.jwt ||
    s?.user?.backendToken ||
    s?.user?.access_token ||
    ""
  );
};

const createApi = (session?: unknown) => {
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

export const recurringExpenseApi = {
  async getRecurringExpenses(
    session?: unknown,
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
    const response = await api.get<{
      success: boolean;
      data: RecurringExpenseApiItem[];
    }>("/recurring-expenses", { params });

    return response.data.data;
  },

  async getRecurringExpenseCategories(session?: unknown) {
    const api = createApi(session);
    const response = await api.get<{
      success: boolean;
      data: RecurringExpenseCategoryItem[];
    }>("/recurring-expenses/categories/all");

    return response.data.data;
  },

  async createRecurringExpense(
    session: unknown,
    payload: RecurringExpenseFormPayload
  ) {
    const api = createApi(session);
    const response = await api.post<{
      success: boolean;
      data: RecurringExpenseApiItem;
    }>("/recurring-expenses", payload);

    return response.data.data;
  },

  async updateRecurringExpense(
    session: unknown,
    recExpensesId: string,
    payload: Partial<RecurringExpenseFormPayload>
  ) {
    const api = createApi(session);
    const response = await api.patch<{
      success: boolean;
      data: RecurringExpenseApiItem;
    }>(`/recurring-expenses/${recExpensesId}`, payload);

    return response.data.data;
  },

  async deleteRecurringExpense(session: unknown, recExpensesId: string) {
    const api = createApi(session);
    await api.delete(`/recurring-expenses/${recExpensesId}`);
  },

  async getBranches(session?: unknown) {
    const api = createApi(session);
    const response = await api.get("/branches");
    const raw = response.data?.data ?? response.data ?? [];

    if (!Array.isArray(raw)) return [];

    return raw.map((branch: { branchId?: string; id?: string; name?: string; branchName?: string }) => ({
      branchId: branch.branchId ?? branch.id ?? "",
      name: branch.name ?? branch.branchName ?? "",
    })) as BranchItem[];
  },
};