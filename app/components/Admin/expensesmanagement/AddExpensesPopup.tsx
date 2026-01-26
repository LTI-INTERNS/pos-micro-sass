"use client";
import React from 'react'
import ReusableForm , { FieldConfig } from '../common/ReusableForm'
import PopupActions from '../common/PopupActions';
import ModalShell from '../common/ModalShell';


type AddExpensesPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (values: {
    date: string;
    category: string;
    description: string;
    amount: string;

  }) => void;
};
const addExpenseFields: FieldConfig[] = [
  { name: "date", label: "Date", placeholder: "Enter date", type: "text" },
  { name: "category", label: "Category", placeholder: "Enter category", type: "text" },
  { name: "description", label: "Description", placeholder: "Enter description", type: "text" },
  { name: "amount", label: "Amount", placeholder: "Enter amount", type: "number" },
];

const AddExpensesPopup = ({ open, onClose, onSave }: AddExpensesPopupProps) => {
   const [latestValues, setLatestValues] = React.useState<Record<string, string>>({});

  return (
  
   <ModalShell open={true} title="Add New Expense" onClose={onClose} widthClassName="w-[980px] max-w-[92vw]">

   <div >
    <ReusableForm
          fields={addExpenseFields}
          onSubmit={(values) => {
            setLatestValues(values);
            onSave(values as any);
          }}
        />

    <div className="mt-10 flex items-center justify-center gap-x-6 ">
          <a href="#" className="flex h-20 w-full items-center justify-center rounded-md border border-gray-200"> <img src="/Popcard.png"  className="h-10 w-auto object-contain" alt="card" /> </a>
          <a href="#" className="flex h-20 w-full items-center justify-center rounded-md border border-gray-200"> <img src="/Popcash.png" className="h-10 w-auto object-contain" alt="cash" /> </a>
    </div>

      <div className="flex items-center justify-center">
          <div className="w-105">
            <PopupActions
              actions={[
                { label: "Cancel", onClick: onClose, variant: "secondary" },
                {
                  label: "Save",
                  onClick: () => onSave(latestValues as any),
                  variant: "primary",
                },
              ]}
            />
          </div>
        </div>


   </div>

     
   </ModalShell>  

  )
}
export default AddExpensesPopup