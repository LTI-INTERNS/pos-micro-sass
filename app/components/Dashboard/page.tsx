"use client";
import React from 'react'
import ReusableForm , { FieldConfig } from './common/ReusableForm'
import PopupActions from './common/PopupActions';
import ModalShell from './common/ModalShell';

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
  
   <div >
    <ReusableForm
          fields={addExpenseFields}
          onSubmit={(values) => {
            setLatestValues(values);
            onSave(values as any);
          }}
        />
   </div>
   
     
      
  )
}

export default AddExpensesPopup