export type SaleRow = {
  id: string;
  date: string;
  invoiceId: string;
  customer: string;
  items: string;
  paymentMethod: string;
  status: "Completed" | "Refunded" | "Pending";
  amount: number;
  branch: string;
};


export type ExpenseRow = {
 id: string;
  date: string;
  category: string;
  description: string;
  approvedBy: string;
  amount: number;
  branch: string;
};

export type ProductRow = {
   id: string;
  sku: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  stock: number;
};