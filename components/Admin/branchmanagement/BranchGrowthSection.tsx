"use client"
import React from 'react'
import BranchGrowthItem from '@/components/Admin/branchmanagement/BranchGrowthItem'
export const BranchData =[
  {
    id: 1,
    name: "Nimala Azalea",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwxLxYIC2L2JqwkjrLhgh0e_d_jaHuxPRkDA&s",
    amount: "$12,450",
    subAmount: "+2.5%"
  },
  {
    id: 2,
    name: "Bena Kane",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_ZSO2tXGKf88S7fxc9js8XAyMMpei6v518w&s",
    amount: "$9,800",
    subAmount: "+1.8%"
  },
  {
    id: 3,
    name: "Firmino Kudo",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN2Krpr7sdfhw-wzGqR_mRcYrvm_Jy8Jgr-A&s",
    amount: "$15,200",
    subAmount: "+3.2%"
  },
  {
    id: 4,
    name: "Beby Jovancy",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb332edXHK5WGDiAikXoSSsZD4Eq1V3NMKRg&s",
    amount: "$7,650",
    subAmount: "-0.5%"
  }
]


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