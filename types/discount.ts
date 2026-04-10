export type Discount = {
  id: string; // Used for UI mapping
  discountId: string; // Database ID
  title: string;
  percentage: number;
  startDate: string;
  endDate: string;
  branchId: string;
  branch?: { name: string };
  status: boolean;
};

export type CreateDiscountPayload = {
  title: string;
  percentage: number;
  startDate: string;
  endDate: string;
  branchId: string;
};