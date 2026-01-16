import DashboardLayout from '../components/dashboard_layout';
import SearchBar from '../components/searchbar';
//import CustomerManagement from '@/app/Customermanagement/table-handle';
import CustomersTable from '../components/customers-table';

export default function DashboardPage() {
  return (
    <DashboardLayout>
        <div className="text-gray-500 text-center mt-20">
            <SearchBar />
           <CustomersTable customers={[]} />
        </div>
    </DashboardLayout>
  );
}