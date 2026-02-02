export type Order = {
  id: number;
  name: string;
  price: string;
  discount: string;
  tax: number;
  stock: string;
};

export const ordersData: Order[] = [
  {
    id: 1,
    name: "Nimal Perera",
    price: "LKR 2,450.00",
    discount: "DISC10",
    tax: 10,
    stock: "7",
  },
  {
    id: 2,
    name: "Kamal Silva",
    price: "LKR 1,820.00",
    discount: "DISC05",
    tax: 5,
    stock: "5",
  },
  {
    id: 3,
    name: "Sunil Fernando",
    price: "LKR 3,600.00",
    discount: "NONE",
    tax: 15,
    stock: "3",
  },
  {
    id: 4,
    name: "Nadeesha Jayasinghe",
    price: "LKR 980.00",
    discount: "NEWUSER",
    tax: 8,
    stock: "1",
  },
  {
    id: 5,
    name: "Ruwan Wijesekara",
    price: "LKR 5,250.00",
    discount: "BULK20",
    tax: 12,
    stock: "2",
  },
];
