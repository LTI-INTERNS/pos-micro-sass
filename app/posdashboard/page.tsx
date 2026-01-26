"use client";
import React, { useState } from "react";
import FoodGrid from "../components/Pos/posdashboard/FoodGrid";
import CustomerInfoPanel from "../components/Pos/posdashboard/CustomerInfoPanel";
import DashboardLayout from "../components/Pos/posdashboard/posdashboardlayout";
import SearchBar from "../components/Admin/common/Search-bar";
import ManageCustomer from "../components/Pos/ManageCustomerPopup";

const page = () => {
  const [search, setSearch] = useState("");
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  return (
    
     <DashboardLayout>
      <div className="flex gap-6   ">
        
        
        <div className="flex-1 flex flex-col ">
            <SearchBar value={search}
            onChange={setSearch}
            placeholder="Search Name or ID" />
            <div className="flex-1 overflow-y-auto pr-2 mt-2">
              <FoodGrid search={search} />
            </div>
        </div>

        
        <div className="w-md sticky  h-[calc(100vh-96px)]">
          <CustomerInfoPanel onAddCustomer={() => setShowCustomerPopup(true)}/>
        </div>

      </div>

      {showCustomerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCustomerPopup(false)}
          />

          {/* Modal content */}
          <div className="relative z-10 w-full max-w-4xl mx-4">
            <ManageCustomer />
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default page;

