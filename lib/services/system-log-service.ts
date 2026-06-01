import { apiClient } from "@/lib/api-client";

export type SystemActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "REFUND";
export type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "CASHIER";

export type SystemLogEntry = {
  logId: string;
  branchId: string | null;
  userId: string;
  role: UserRole;
  entityType: string;
  entityId: string;
  actionType: SystemActionType;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  message: string | null;
  ipAddress: string;
  deviceInfo: { userAgent: string; origin: string };
  createdAt: string;
  logoutAt: string | null;
  branch: { name: string } | null;
};

export type SystemLogPage = {
  logs: SystemLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type SystemLogFilters = {
  branchId?: string;
  actionType?: SystemActionType;
  role?: UserRole;
  entityType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const systemLogService = {
  getLogs: (filters?: SystemLogFilters): Promise<SystemLogPage> =>
    apiClient
      .get<ApiResponse<SystemLogPage>>("/system-logs", { params: filters })
      .then((res) => res.data.data),
};
