import React from 'react'
import DashboardLayout from '../components/dashboard_layout'
import BranchStatCardGrid from '../components/branchStatCardGrid'
import BranchActionBar from '../components/branch-actions'
import BranchGrowthSection from '../components/branch-growth-section'
import DateRangeBar from '../components/DateRangeBar'

const Branchpage = () => {
  return (
    <DashboardLayout>
      <div className="w-full space-y-6"> 
       <DateRangeBar/>
       <BranchStatCardGrid/>
       <BranchActionBar/>
       <BranchGrowthSection/>
      </div> 
    </DashboardLayout>
  )
}

export default Branchpage