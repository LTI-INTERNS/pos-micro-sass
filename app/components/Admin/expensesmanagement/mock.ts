import { Expenses } from "@/app/components/Admin/expensesmanagement/ExpensesTable";

export const mockExpenses: Expenses[] = [
  {
    id: "001",
    date: "2025-10-25",
    category: "Inventory",
    description: "Cleaning Supply",
    amount: 100,
    payment: "Cash",
    addedby: "Admin",
  },
  {
    id: "002",
    date: "2025-10-25",
    category: "Inventory",
    description: "Cleaning Supply",
    amount: 200,
    payment: "Cash",
    addedby: "Admin",
  },
  {
    id: "004",
    date: "2025-11-25",
    category: "Inventory",
    description: "Cleaning Supply",
    amount: 100,
    payment: "Cash",
    addedby: "Admin",
  },
  {
    id: "005",
    date: "2025-12-25",
    category: "Inventory",
    description: "Cleaning Supply",
    amount: 2500,
    payment: "Cash",
    addedby: "Admin",
  },
  {
    id: "006",
    date: "2025-11-25",
    category: "Beverages",
    description: "Hot and cold drinks",
    amount: 1000,
    payment: "Card",
    addedby: "Manager",
  },
];
