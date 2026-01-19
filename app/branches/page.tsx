import React from 'react'
import DashboardLayout from '../components/dashboard_layout'
import BranchStatCardGrid from '../components/branchStatCardGrid'
import BranchActionBar from '../components/branch-actions'

const Branchpage = () => {
  return (
    <DashboardLayout>
      <div className="w-full space-y-6"> 
       <BranchStatCardGrid/>
       <BranchActionBar/>
      </div> 
    </DashboardLayout>
  )
}

export default Branchpage