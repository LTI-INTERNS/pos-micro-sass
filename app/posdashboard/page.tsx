"use client";
import React, { useState } from "react";
import FoodGrid from "../components/Pos/posdashboard/FoodGrid";

import DashboardLayout from "../components/Pos/posdashboard/posdashboardlayout";
import SearchBar from "../components/Admin/common/Search-bar";

const page = () => {
  const [search, setSearch] = useState("");
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

        
        <div className="w-md sticky top-18 h-[calc(100vh-96px)]">
          
        </div>

      </div>

    </DashboardLayout>
  );
};

export default page;

