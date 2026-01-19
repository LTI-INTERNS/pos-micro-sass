import DashboardLayout from "../components/dashboard_layout";
import SearchBar from "../components/supplier-searchbar";
import CustomerActionsBar from "../components/supplier-actions";
import CustomersTable from "../components/supplier-table";
import StatCardGrid from "../components/supplierStatCardGrid";
import DateRangeBar from "../components/DateRangeBar";

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangeBar />
        <StatCardGrid />
        <SearchBar />
        <CustomerActionsBar />
        <CustomersTable customers={[]} />
      </div>
    </DashboardLayout>
  );
}
