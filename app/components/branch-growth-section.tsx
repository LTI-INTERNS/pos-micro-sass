"use client"
import React from 'react'
import BranchGrowthItem from './branch-growth-item'
import { BranchData } from '../Dashboard/mockData'

const BranchGrowthSection = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-black">
          Branch Growth
        </h3>
        
      </div>

      {BranchData.slice(0, 4).map((branch) => (
        <BranchGrowthItem
          key={branch.id}
          name={branch.name}
          avatar={branch.avatar}
          amount={branch.amount}
          subAmount={branch.subAmount}
        />
      ))}
    </div>
  )
}

export default BranchGrowthSection