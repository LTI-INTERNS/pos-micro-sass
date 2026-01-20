import DashboardLayout from "../components/dashboard_layout";
import DateRangeBar from "../components/DateRangeBar";
import SearchBar from "../components/ProfitCalculation/CashierSearch";
import ActionsBar from "../components/RecurringExpences/ActionBar";
import ProductTable, {Product} from "../components/RecurringExpences/ProductsTable";
import StatCardGrid from "../components/RecurringExpences/RecStatCardGrid";

const sampleProducts: Product[] = [
  {
    id: "001",
    date: "2025.10.25",
    category: "Inventory",
    description: "Cleaning Supply",
    profit: "4500.00",
    payment: "Cash",
    addedby: "Admin",
  },
  {
    id: "002",
    date: "2025.10.25",
    category: "Inventory",
    description: "Cleaning Supply",
    profit: "4500.00",
    payment: "Cash",
    addedby: "Admin",
  },
  {
    id: "003",
    date: "2025.10.25",
    category: "Inventory",
    description: "Cleaning Supplies",
    profit: "4500.00",
    payment: "Cash",
    addedby: "Admin",
  },
  {
    id: "004",
    date: "2025.11.25",
    category: "Inventory",
    description: "Cleaning Supply",
    profit: "4500.00",
    payment: "Cash",
    addedby: "Admin",
  },
  {
    id: "005",
    date: "2025.12.25",
    category: "Inventory",
    description: "Cleaning Supply",
    profit: "4500.00",
    payment: "Cash",
    addedby: "Admin",
  },
];


export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangeBar/>
        <StatCardGrid />
        <SearchBar />
        <ActionsBar />
        <ProductTable products={sampleProducts} />
      </div>
    </DashboardLayout>
  );
}
