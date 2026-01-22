"use client";

import { useState } from "react";

import ModalShell from "@/app/components/Dashboard/common/ModalShell";
import ReusableForm, {
  FieldConfig,
} from "@/app/components/Dashboard/common/ReusableForm";
import PopupActions from "@/app/components/Dashboard/common/PopupActions";

import { staffData } from "../staff-management/mockStaffData";

type Props = {
  onClose: () => void;
};

export default function AddStaffPopup({ onClose }: Props) {
  const [open, setOpen] = useState(true);

  // Auto-generate next staff ID (UI only)
  const nextId = (staffData.length + 1).toString();

  const fields: FieldConfig[] = [
    {
      name: "id",
      label: "ID",
      disabled: true,
    },
    {
      name: "name",
      label: "Name",
      placeholder: "Enter name",
    },
    {
      name: "staffNo",
      label: "Staff No",
      placeholder: "Enter staff number",
    },
    {
      name: "position",
      label: "Position",
      placeholder: "Enter position",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter password",
    },
    {
      name: "pin",
      label: "Pin",
      placeholder: "Enter PIN",
    },
  ];

  return (
    <ModalShell
      open={open}
      title="Add New Staff"
      onClose={() => {
        setOpen(false);
        onClose();
      }}
      widthClassName="w-[800px] max-w-[95vw]"
    >
      <ReusableForm
        fields={fields}
        initialValues={{
          id: nextId,
          name: "",
          staffNo: "",
          position: "",
          email: "",
          password: "",
          pin: "",
        }}
        onSubmit={(values) => {
          console.log("Staff form values:", values);
        }}
      />

      <PopupActions
        actions={[
          {
            label: "Cancel",
            onClick: () => {
              setOpen(false);
              onClose();
            },
            variant: "secondary",
          },
          {
            label: "Save",
            onClick: () => {},
            variant: "primary",
          },
        ]}
      />
    </ModalShell>
  );
}
