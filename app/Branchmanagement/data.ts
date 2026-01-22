export type Branch = {
  id: number;
  name: string;
  phone: string;
  address: string;
  regno: number;
  email: string;
  password: string;
};

export const branchesData: Branch[] = [
  {
    id: 1,
    name: "Nimal",
    phone: "0771234567",
    address: "P01",
    regno: 10,
    email: "nimal@coca.lk",
    password: "password123",
  },
  {
    id: 2,
    name: "Kamal",
    phone: "0719999999",
    address: "P02",
    regno: 20,
    email: "kamal@coca.lk",
    password: "password123",
  },
];
