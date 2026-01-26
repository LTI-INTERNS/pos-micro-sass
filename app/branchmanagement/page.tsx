import React from 'react'
import DashboardLayout from '../components/Admin/common/dashboard_layout'
import StatCard from '../components/Admin/branchmanagement/BranchCardGrid'
import ActionButton from "../components/Admin/common/ActionButton";
import BranchGrowthSection from '../components/Admin/branchmanagement/BranchGrowthSection'
import DateRangeBar from '../components/Admin/common/DateRangeBar'

const Branchpage = () => {

  return (
    <DashboardLayout>
      <div className="w-full space-y-6"> 
       <DateRangeBar/>
       <StatCard/>
       <div className="grid grid-cols-3 gap-3">
                 
                 <ActionButton label="Delete Supplier" className="w-full rounded-full border border-orange-400 bg-white py-2
                            text-xs font-semibold text-orange-500
                            hover:bg-orange-50 hover:shadow-sm
                            transition"/>
                 <ActionButton label="Edit Supplier" className="w-full rounded-full border border-orange-400 bg-white py-2
                            text-xs font-semibold text-orange-500
                            hover:bg-orange-50 hover:shadow-sm
                            transition" />           
                 <ActionButton label="Add New Supplier" variant="primary" className="w-full rounded-full bg-orange-500 py-2
                            text-xs font-semibold text-white
                            hover:bg-orange-600
                            transition" />
               </div>  
       <BranchGrowthSection/>
      </div> 
    </DashboardLayout>
  )
}

export default Branchpage
