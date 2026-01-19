"use client";
import * as React from "react";
import NewSupplierPopup from "@/app/components/Dashboard/NewSupplierPopup";

export default function SupplierPopup() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)} className="rounded-full bg-orange-500 px-4 py-2 text-white">
        Add New Supplier
      </button>

      <NewSupplierPopup
        open={open}
        onClose={() => setOpen(false)}
        onSave={(values) => {
          console.log("save", values);
          setOpen(false);
        }}
      />
    </div>
  );
}