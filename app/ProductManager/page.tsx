import DashboardLayout from '@/app/components/dashboard_layout';
import CashierActionsBar from '@/app/ProductManager/product-actions';
import SearchBar from '@/app/components/Search-bar';
import ProductsTable from '@/app/ProductManager/product-table';
import SupplierPopup from '@/app/components/SupplyPopUp/Supplier-popup';

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

 