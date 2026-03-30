export type Customer = {
  id: number;
  name: string;
  phone: string;
  promoCard: string;
  points: number;
  email: string;
  outstanding: number;
};

export const customersData: Customer[] = [
  {
    id: 1,
    name: "Nimal",
    phone: "0771234567",
    promoCard: "P01",
    points: 10,
    email: "nimal@coca.lk",
    outstanding: 5000,
  },
  {
    id: 2,
    name: "Kamal",
    phone: "0719999999",
    promoCard: "P02",
    points: 20,
    email: "kamal@coca.lk",
    outstanding: 0,
  },
   {
    id: 3,
    name: "Kamal",
    phone: "0719999999",
    promoCard: "P02",
    points: 70,
    email: "kamal@coca.lk",
    outstanding: 0,
  },
   {
    id: 4,
    name: "Kamal",
    phone: "0719999999",
    promoCard: "P02",
    points: 120,
    email: "kamal@coca.lk",
    outstanding: 0,
  },
];
