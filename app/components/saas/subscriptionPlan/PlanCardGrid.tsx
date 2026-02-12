import React from 'react'
import BaseCard from '../common/BaseCard'


const PlanCardGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start px-5" >
            <BaseCard
          title="FREE"
          price="$0.00"
          features={[
            { label: "Basic POS", available: true },
            { label: "Single Branch", available: true },
            { label: "Limited Products", available: true },
            { label: "Advanced Analytics", available: false },
            { label: "Priority Support", available: false },
          ]}
          showButton ={true}
          buttonLabel="Get Started"
        />
        <BaseCard
          title="PRO"
          price="$29.99"
          features={[
            { label: "Advanced POS", available: true },
            { label: "Multiple Branches", available: true },
            { label: "Unlimited Products", available: true },
            { label: "Advanced Analytics", available: true },
            { label: "Priority Support", available: true },
          ]}
          showButton ={true}
          buttonLabel="Get Started"
        />
        <BaseCard
          title="ENTERPRISE"
          price="$99.99"
          features={[
            { label: "Enterprise POS", available: true },
            { label: "Unlimited Branches", available: true },
            { label: "Unlimited Products", available: true },
            { label: "Advanced Analytics", available: true },
            { label: "24/7 Support", available: true },
          ]}
          showButton ={true}
          buttonLabel="Get Started"
        />
        </div>
  )
}

export default PlanCardGrid