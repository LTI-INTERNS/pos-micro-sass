export type Branch = {
  id: string;
  name: string;
  phone: string;
  address: string;
  regno: number;
  email: string;
  password: string;
};

export const branchesData: Branch[] = [
  {
    id: "A001",
    name: "colombo",
    phone: "0771234567",
    address: "colombo 01",
    regno: 10,
    email: "nimal@coca.lk",
    password: "password123",
  },
  {
    id: "A002",
    name: "kandy",
    phone: "0719999999",
    address: "kandy",
    regno: 20,
    email: "kamal@coca.lk",
    password: "password123",
  },
];
