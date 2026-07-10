"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ActionButton from "@/components/Admin/common/ActionButton";
import SupplierDeleteWarningModal, { SupplierDeleteWarnings } from "./SupplierDeleteWarningModal";
import { productService } from "@/lib/services/product-service";
import SupplierPopUp, {
  SupplierFormValues,
} from "@/components/Admin/suppliermanagement/SupplierPopUp";
import type {
  Supplier,
  CreateSupplierInput,
  UpdateSupplierInput,
} from "@/types/supplier.types";
import type { Branch } from "@/types/branch.types";
import { getApiErrorMessage } from "@/lib/utils/api-error";

type Props = {
  selectedSupplier: Supplier | null;
  branches: Branch[];
  suppliers: Supplier[];
  onAdd: (payload: CreateSupplierInput) => Promise<void>;
  onEdit: (supplierId: string, payload: UpdateSupplierInput) => Promise<void>;
  onDelete: (supplierId: string) => Promise<void>;
  showToast: (message: string, type: "success" | "error" | "info") => void; // THE FIX
};

function buildPayload(values: SupplierFormValues & { supplierType: "company" | "individual" }): CreateSupplierInput {
  const common = {
    email: values.email.trim(),
    address: values.address.trim(),
    coverArea: values.coverArea.trim(),
    regNo: values.registrationNumber.trim() || undefined,
    branchIds: values.branchIds,
  };

  if (values.supplierType === "company") {
    return {
      type: "COMPANY",
      name: values.contactPersonName.trim(),
      phone: values.contactPersonPhone.trim(),
      companyName: values.companyName.trim() || undefined,
      ...common,
    };
  }

  return {
    type: "INDIVIDUAL",
    name: values.name.trim(),
    phone: values.phone.trim(),
    ...common,
  };
}

export default function SupplierActionsBar({
  selectedSupplier,
  branches,
  suppliers,
  onAdd,
  onEdit,
  onDelete,
  showToast, // THE FIX
}: Props) {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [deleteWarnings, setDeleteWarnings] = useState<SupplierDeleteWarnings>({ productCount: 0 });
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowAddPopup(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("action");
      window.history.replaceState(null, "", url.toString());
    }
  }, [searchParams]);

  const branchOptions = branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
  }));

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <ActionButton
          label={isDeleting ? "Checking..." : "Delete Supplier"}
          disabled={isDeleting}
          onClick={async () => {
            if (!selectedSupplier) {
              showToast("Please select a supplier first!", "error"); // THE FIX
              return;
            }
            setIsDeleting(true);
            try {
              const products = await productService.getAll();
              let productCount = 0;
              products.forEach(p => {
                const hasVariant = p.variants?.some(v => v.supplierId === selectedSupplier.id);
                if (hasVariant) productCount++;
              });
              setDeleteWarnings({ productCount });
              setDeleteWarningOpen(true);
            } catch (err) {
              console.error("Failed to check relations", err);
              setDeleteWarnings({ productCount: 0 });
              setDeleteWarningOpen(true);
            } finally {
              setIsDeleting(false);
            }
          }}
        />

        <ActionButton
          label="Edit Supplier"
          onClick={() => {
            if (!selectedSupplier) {
              showToast("Please select a supplier first!", "error"); // THE FIX
              return;
            }
            setShowEditPopup(true);
          }}
        />

        <ActionButton
          label="Add New Supplier"
          variant="primary"
          onClick={() => setShowAddPopup(true)}
        />
      </div>

      {showAddPopup && (
        <SupplierPopUp
          open={showAddPopup}
          onClose={() => setShowAddPopup(false)}
          title="New Supplier"
          branchOptions={branchOptions}
          onSave={async (values) => {
            // Duplicate checks for addition
            const emailToCheck = values.email.trim().toLowerCase();
            const phoneToCheck = (values.supplierType === "company" ? values.contactPersonPhone : values.phone).trim();
            const regNoToCheck = values.registrationNumber.trim().toLowerCase();

            const duplicateEmail = suppliers.some(
              (s) => s.email && s.email.toLowerCase() === emailToCheck
            );
            if (duplicateEmail) {
              showToast("Email address is already in use by another supplier.", "error");
              return;
            }

            const duplicatePhone = suppliers.some(
              (s) => s.phone && s.phone === phoneToCheck
            );
            if (duplicatePhone) {
              showToast("Phone number is already in use by another supplier.", "error");
              return;
            }

            if (regNoToCheck) {
              const duplicateRegNo = suppliers.some(
                (s) => s.regNo && s.regNo.toLowerCase() === regNoToCheck
              );
              if (duplicateRegNo) {
                showToast("Registration number is already in use by another supplier.", "error");
                return;
              }
            }

            try {
              const payload = buildPayload(values);
              await onAdd(payload);
              setShowAddPopup(false);
              showToast("Supplier added successfully!", "success"); // THE FIX
            } catch (error: unknown) {
              console.error("Failed to create supplier:", error);
              const message = getApiErrorMessage(error, "Failed to create supplier.");
              showToast(message, "error");
            }
          }}
        />
      )}

      {selectedSupplier && showEditPopup && (
        <SupplierPopUp
          open={showEditPopup}
          onClose={() => setShowEditPopup(false)}
          title="Edit Supplier"
          initialSupplier={selectedSupplier}
          supplierId={selectedSupplier.id}
          branchOptions={branchOptions}
          onSave={async (values) => {
            // Duplicate checks for editing (exclude current supplier)
            const emailToCheck = values.email.trim().toLowerCase();
            const phoneToCheck = (values.supplierType === "company" ? values.contactPersonPhone : values.phone).trim();
            const regNoToCheck = values.registrationNumber.trim().toLowerCase();

            const otherSuppliers = suppliers.filter((s) => s.id !== selectedSupplier.id);

            const duplicateEmail = otherSuppliers.some(
              (s) => s.email && s.email.toLowerCase() === emailToCheck
            );
            if (duplicateEmail) {
              showToast("Email address is already in use by another supplier.", "error");
              return;
            }

            const duplicatePhone = otherSuppliers.some(
              (s) => s.phone && s.phone === phoneToCheck
            );
            if (duplicatePhone) {
              showToast("Phone number is already in use by another supplier.", "error");
              return;
            }

            if (regNoToCheck) {
              const duplicateRegNo = otherSuppliers.some(
                (s) => s.regNo && s.regNo.toLowerCase() === regNoToCheck
              );
              if (duplicateRegNo) {
                showToast("Registration number is already in use by another supplier.", "error");
                return;
              }
            }

            try {
              await onEdit(selectedSupplier.id, buildPayload(values));
              setShowEditPopup(false);
              showToast("Supplier updated successfully!", "success"); // THE FIX
            } catch (error: unknown) {
              console.error("Failed to update supplier:", error);
              const message = getApiErrorMessage(error, "Failed to update supplier.");
              showToast(message, "error");
            }
          }}
        />
      )}

      {selectedSupplier && (
        <SupplierDeleteWarningModal
          isOpen={deleteWarningOpen}
          onClose={() => setDeleteWarningOpen(false)}
          supplierName={selectedSupplier.companyName || selectedSupplier.name}
          warnings={deleteWarnings}
          onConfirm={async () => {
            try {
              await onDelete(selectedSupplier.id);
              setDeleteWarningOpen(false);
              showToast("Supplier deleted successfully!", "success"); // THE FIX
            } catch (error: unknown) {
              console.error("Failed to delete supplier:", error);
              const message = getApiErrorMessage(error, "Failed to delete supplier.");
              showToast(message, "error");
            }
          }}
        />
      )}
    </>
  );
}