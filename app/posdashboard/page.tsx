"use client";
import React, { useState } from "react";
import FoodGrid from "../components/Pos/posdashboard/FoodGrid";
import CustomerInfoPanel, {
  OrderItem,
} from "../components/Pos/posdashboard/CustomerInfoPanel";
import DashboardLayout from "../components/Pos/posdashboard/posdashboardlayout";
import SearchBar from "../components/Admin/common/Search-bar";
import ManageCustomer from "../components/Pos/ManageCustomer";

const page = () => {
  const [search, setSearch] = useState("");
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  
  const handleAddFood = (food: {
    id: number;
    name: string;
    price: number;
    image: string;
  }) => {
    setOrderItems((prev) => {
      const existing = prev.find((it) => it.id === String(food.id));

      if (existing) {
        return prev.map((it) =>
          it.id === String(food.id)
            ? { ...it, qty: it.qty + 1 }
            : it
        );
      }

      return [
        ...prev,
        {
          id: String(food.id),
          name: food.name,
          price: food.price,
          qty: 1,
          imageUrl: food.image,
        },
      ];
    });
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6">
        
        <div className="flex-1 flex flex-col">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Name or ID"
          />

          <div className="flex-1 overflow-y-auto pr-2 mt-2">
            <FoodGrid search={search} onAdd={handleAddFood} />
          </div>
        </div>

       
        <div className="w-md sticky h-[calc(100vh-96px)]">
          <CustomerInfoPanel
            items={orderItems}
            onAddCustomer={() => setShowCustomerPopup(true)}
            onInc={(id) =>
              setOrderItems((prev) =>
                prev.map((it) =>
                  it.id === id ? { ...it, qty: it.qty + 1 } : it
                )
              )
            }
            onDec={(id) =>
              setOrderItems((prev) =>
                prev
                  .map((it) =>
                    it.id === id ? { ...it, qty: it.qty - 1 } : it
                  )
                  .filter((it) => it.qty > 0)
              )
            }
            onSetQty={(id, qty) =>
              setOrderItems((prev) =>
                prev.map((it) =>
                  it.id === id ? { ...it, qty } : it
                )
              )
            }
          />
        </div>
      </div>

      
      {showCustomerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCustomerPopup(false)}
          />

          <div className="relative z-10 w-full max-w-4xl mx-4">
            <ManageCustomer  />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default page;
