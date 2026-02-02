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
    name: "Colombo Main Branch",
    phone: "0112345678",
    address: "No. 120, Galle Road, Colombo 03",
    regno: 1001,
    email: "colombo@company.lk",
    password: "branch@123",
  },
  {
    id: 2,
    name: "Kandy Branch",
    phone: "0812233445",
    address: "45 Peradeniya Road, Kandy",
    regno: 1002,
    email: "kandy@company.lk",
    password: "branch@123",
  },
  {
    id: 3,
    name: "Galle Branch",
    phone: "0915678899",
    address: "78 Matara Road, Galle",
    regno: 1003,
    email: "galle@company.lk",
    password: "branch@123",
  },
  {
    id: 4,
    name: "Negombo Branch",
    phone: "0314455667",
    address: "22 Main Street, Negombo",
    regno: 1004,
    email: "negombo@company.lk",
    password: "branch@123",
  },
  {
    id: 5,
    name: "Jaffna Branch",
    phone: "0213344556",
    address: "10 Hospital Road, Jaffna",
    regno: 1005,
    email: "jaffna@company.lk",
    password: "branch@123",
  },
];
