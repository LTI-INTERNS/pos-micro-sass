export type Order = {
  id: number;
  dateTime?: string;
  branch?: string;
  cashier?: string;
  paymenttype?: string;
  totalamount?: string;
  status?: string;
  action?: string;
  
};

export const ordersData: Order[] = [
  {
    id: 1,
    dateTime: "2026-02-01 10:15 AM",
    branch: "Colombo 01",
    cashier: "Nimal Perera",
    paymenttype: "Cash",
    totalamount: "LKR 2,450.00",
    status: "Completed",
    action: "View",
  },
  {
    id: 2,
    dateTime: "2026-02-01 11:05 AM",
    branch: "Kandy",
    cashier: "Kamal Silva",
    paymenttype: "Card",
    totalamount: "LKR 1,820.00",
    status: "Completed",
    action: "View",
  },
  {
    id: 3,
    dateTime: "2026-02-01 01:30 PM",
    branch: "Galle",
    cashier: "Sunil Fernando",
    paymenttype: "QR",
    totalamount: "LKR 3,600.00",
    status: "Pending",
    action: "View",
  },
  {
    id: 4,
    dateTime: "2026-02-01 03:10 PM",
    branch: "Colombo 07",
    cashier: "Nadeesha Jayasinghe",
    paymenttype: "Cash",
    totalamount: "LKR 980.00",
    status: "Cancelled",
    action: "View",
  },
  {
    id: 5,
    dateTime: "2026-02-01 05:45 PM",
    branch: "Negombo",
    cashier: "Ruwan Wijesekara",
    paymenttype: "Card",
    totalamount: "LKR 5,250.00",
    status: "Completed",
    action: "View",
  },
];
