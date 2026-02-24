import React from 'react'
import BaseCard from '../common/BaseCard'

const PricingCardGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start px-15" >
        <BaseCard
      title="FREE"
      price="$0.00/mo"
      features={[
        { label: "Basic POS", available: true },
        { label: "Single Branch", available: true },
        { label: "Limited Products", available: true },
        { label: "Advanced Analytics", available: false },
        { label: "Priority Support", available: false },
      ]}
      showButton ={false}
    />
    <BaseCard
      title="PRO"
      price="$29.99/mo"
      features={[
        { label: "Advanced POS", available: true },
        { label: "Multiple Branches", available: true },
        { label: "Unlimited Products", available: true },
        { label: "Advanced Analytics", available: true },
        { label: "Priority Support", available: true },
      ]}
      showButton ={false}
    />
    <BaseCard
      title="ENTERPRISE"
      price="$99.99/mo"
      features={[
        { label: "Enterprise POS", available: true },
        { label: "Unlimited Branches", available: true },
        { label: "Unlimited Products", available: true },
        { label: "Advanced Analytics", available: true },
        { label: "24/7 Support", available: true },
      ]}
      showButton ={false}
    />
    </div>
  )
}

export default PricingCardGrid