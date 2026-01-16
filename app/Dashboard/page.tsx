import DashboardLayout from '../components/dashboard_layout';
import SearchBar from '../components/searchbar';
import CustomerManagement from '../Customermanagement/table-handle';

export default function DashboardPage() {
  return (
    <DashboardLayout>
        <div className="text-gray-500 text-center mt-20">
            <SearchBar />
            <CustomerManagement />
        </div>
    </DashboardLayout>
  );
}