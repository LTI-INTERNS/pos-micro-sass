import { Column } from "./CommonTable";


export type Cashier = {
  id: number;
  name: string;
  cashno: number;
  totalre: number;
  email: string;
  password: string;
  pin: number;
};

export const cashierColumns: Column<Cashier>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "cashno", label: "Cashier No" },
  {
    key: "totalre",
    label: "Total Revenue",
    render: (c) => `Rs. ${c.totalre.toLocaleString()}`,
  },
  { key: "email", label: "Email" },
  {
    key: "password",
    label: "Password",
    render: () => "••••••",
  },
  {
    key: "pin",
    label: "PIN",
    align: "right",
    render: () => "****",
  },
];



export type Customer = {
  id: number;
  name: string;
  phone: string;
  promoCard: string;
  points: number;
  email: string;
  outstanding: number;
};

export const customerColumns: Column<Customer>[] = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "promoCard", label: "Promo Card" },
  { key: "points", label: "Points" },
  { key: "email", label: "Email" },
  {
    key: "outstanding",
    label: "Outstanding Payments",
    align: "right",
    render: (c) => `Rs. ${c.outstanding.toLocaleString()}`,
  },
];
