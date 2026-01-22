import DashboardLayout from '../components/dashboard_layout';
import CashierActionsBar from '../components/product-actions';
import SearchBar from '../components/Search-bar';
import SupplierPopup from '../components/Dashboard/Supplier-popup';
import ProductsTable from '../components/product-table';

export default function DashboardPage() {
  return (
    <DashboardLayout>
        <div className="text-gray-500 text-center mt-20">
          <SupplierPopup />
           <CashierActionsBar />
           <div className="my-6">
             <SearchBar ></SearchBar>
             </div>
            <ProductsTable products={[]} />

        </div>
    </DashboardLayout>
  );
}

 