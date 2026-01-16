import DashboardLayout from "../components/dashboard_layout";
import SearchBar from "../components/searchbar";
import CustomerActionsBar from "../components/customer-actions";
import CustomersTable from "../components/customers-table";

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <SearchBar />
        <CustomerActionsBar />
        <CustomersTable customers={[]} />
      </div>
    </DashboardLayout>
  );
}
