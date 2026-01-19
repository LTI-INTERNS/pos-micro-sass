import DashboardLayout from '../components/dashboard_layout';
import CashierActionsBar from '../components/cashier-actions';
import CashiersTable from '../components/Cashier-table';
import SearchBar from '../components/Search-bar';

export default function DashboardPage() {
  return (
    <DashboardLayout>
        <div className="text-gray-500 text-center mt-20">
           <CashierActionsBar />
           <div className="my-6">
             <SearchBar ></SearchBar>
             </div>
            <CashiersTable Cashier={[]} />
        </div>
    </DashboardLayout>
  );
}

 