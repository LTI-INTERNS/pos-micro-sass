import React from 'react'
import StatCard from './StatCard'
import { branchStatCards } from '../Dashboard/mockData'

const BranchStatCardGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {branchStatCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              percentage={card.percentage}
              trend={card.trend as 'up' | 'down'}
            />
          ))}
        </div>
  )
}

export default BranchStatCardGrid