// app/dashboard/mockData.ts

export const supplierStatCards = [
  {
    title: "All Suppliers",
    value: "342",
    percentage: "+4.2%",
    trend: "up",
  },
  {
    title: "New Suppliers",
    value: "12",
    percentage: "-1.5%",
    trend: "down",
  },
  
];
export const branchStatCards = [
  {
    title: "All Branches",
    value: "342",
    percentage: "+4.2%",
    trend: "up",
  },
  
];

export const BranchData =[
  {
    id: 1,
    name: "Nimala Azalea",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwxLxYIC2L2JqwkjrLhgh0e_d_jaHuxPRkDA&s",
    amount: "$12,450",
    subAmount: "+2.5%"
  },
  {
    id: 2,
    name: "Bena Kane",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ZSO2tXGKf88S7fxc9js8XAyMMpei6v518w&s",
    amount: "$9,800",
    subAmount: "+1.8%"
  },
  {
    id: 3,
    name: "Firmino Kudo",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN2Krpr7sdfhw-wzGqR_mRcYrvm_Jy8Jgr-A&s",
    amount: "$15,200",
    subAmount: "+3.2%"
  },
  {
    id: 4,
    name: "Beby Jovancy",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb332edXHK5WGDiAikXoSSsZD4Eq1V3NMKRg&s",
    amount: "$7,650",
    subAmount: "-0.5%"
  }
]

export const salesLineData = [
  { day: "Mon", value: 220 },
  { day: "Tue", value: 280 },
  { day: "Wed", value: 260 },
  { day: "Thu", value: 310 },
  { day: "Fri", value: 290 },
  { day: "Sat", value: 340 },
  { day: "Sun", value: 320 },
];

export const salesBarData = [
  { hour: "1-2 AM", value: 1600 },
  { hour: "3-4 AM", value: 2100 },
  { hour: "5-6 AM", value: 1800 },
  { hour: "7-8 AM", value: 3200 },
  { hour: "9-10 AM", value: 2800 },
  { hour: "11-12 AM", value: 3600 },
];


export type Supplier = {
  id: number;
  type: "Individual" | "Company";
  name: string;
  phone: number;
  email: string;
  address: string;
  regNo: string;
};

export const suppliers: Supplier[] = [
  {
    id: 1,
    type: "Individual",
    name: "Kamal Perera",
    phone: 771234567,
    email: "kamal@gmail.com",
    address: "Colombo",
    regNo: "SUP-001",
  },
  {
    id: 2,
    type: "Company",
    name: "ABC Traders",
    phone: 719876543,
    email: "abc@gmail.com",
    address: "Kandy",
    regNo: "SUP-002",
  },
  {
    id: 3,
    type: "Individual",
    name: "Sunil Fernando",
    phone: 761112233,
    email: "sunil@gmail.com",
    address: "Galle",
    regNo: "SUP-003",
  },
];