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
    name: "colombo",
    phone: "0771234567",
    address: "colombo 01",
    regno: 10,
    email: "nimal@coca.lk",
    password: "password123",
  },
  {
    id: 2,
    name: "kandy",
    phone: "0719999999",
    address: "kandy",
    regno: 20,
    email: "kamal@coca.lk",
    password: "password123",
  },
];
