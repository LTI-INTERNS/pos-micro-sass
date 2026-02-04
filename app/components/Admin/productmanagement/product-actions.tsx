"use client";

import ActionButton from "@/app/components/Admin/common/ActionButton";
import { useState } from "react";
import AddProductPopup from "@/app/components/Admin/productmanagement/AddProductPopup";
import DeletePopup from "../common/Deletepopup";
import AddStockPopup from "./addStockPopup";
import type { Product } from "@/app/productmanagement/data";

type Props = {
  selectedProduct: Product | null;
  onAdd?: (qty: number) => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

export default function CashierActionsBar({
  onAdd,
  onEdit,
  onDelete,
  selectedProduct,
}: Props) {
  const [showAddStock, setShowAddStock] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  return (
      <>
        <div className="flex items-center gap-5">
          <ActionButton
            label="Add to Stock"
            onClick={() => {
              if (!selectedProduct) {
                alert("Please Select a Product First!")
                return;
              }
              setShowAddStock(true);
            }}
          />

          <ActionButton
            label="Delete Product"
            onClick={() => {
              if (!selectedProduct) {
                alert("Please select a product first!");
                return;
              }
               setDeletePopupOpen(true);
            }}
          />

          <ActionButton
            label="Edit Product"
            onClick={onEdit}
          />

          <ActionButton
            label="Add New Product"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />
        </div>

        {selectedProduct && (
          <DeletePopup
            isOpen={deletePopupOpen}
            onClose={() => setDeletePopupOpen(false)}
            item={selectedProduct}
            itemName="Product"
            getDisplayText={(p) => (
              <>
                <br /><br />
                ID - {p.id}<br />
                Product Name - {p.name}<br />
                Category - {p.category}<br />
                Supplier - {p.supplier}
              </>
            )}
            onConfirm={() => {
              onDelete?.();
              setDeletePopupOpen(false);
            }}
          />
        )}

        {selectedProduct && (
          <AddStockPopup
            product={selectedProduct}
            isOpen={showAddStock}
            onClose={() => setShowAddStock(false)}
            onSave={(qty) => {
              onAdd?.(qty);
              setShowAddStock(false);
            }}
          />
        )}
        
      {showPopup && (
        <AddProductPopup 
          open={showPopup} 
          onClose={() => setShowPopup(false)}
          onSave={(values) => {
            // Handle product save logic here
            console.log('Product saved:', values);
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
