import React from "react";
import FoodGrid from "../components/FoodGrid";
import CustomerInfoPanel from "../components/Dashboard/common/CustomerInfoPanel";
import DashboardLayout from "../components/posdashboardlayout";

const page = () => {
  return (
    
     <DashboardLayout>
      <div className="flex gap-6 px-6 pt-6 ">
        
        
        <div className="flex-1 flex flex-col ">
          
         
          <div className="sticky top-18 z-10  bg-gray-50">
            <input
              placeholder="Search Name or ID..."
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-500"
            />
          </div>

          
          <div className="flex-1 overflow-y-auto pr-2 mt-15">
            <FoodGrid />
          </div>
        </div>

        
        <div className="w-80 sticky top-18 h-fit">
          <CustomerInfoPanel/>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default page;
