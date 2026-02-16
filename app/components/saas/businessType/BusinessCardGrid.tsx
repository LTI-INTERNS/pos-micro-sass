import React from 'react'
import BaseCard from '../common/BaseCard'

const BusinessCardGrid = () => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start px-15" >
       <BaseCard
          title="Retail"
          icon={<img
                  src="/retail.png"
                  alt="Retail"
                  className="w-14 h-14 object-contain"
                />}
          features={[
            { label: "Inventory Management", available: true },
            { label: "Sales Tracking", available: true },
            { label: "Customer Records", available: true },
            { label: "Advanced Reports", available: false },
            { label: "Multi Branch", available: false },
          ]}
          showButton
        />

         <BaseCard
          title="Restaurant / Café"
          icon={<img
                  src="/cafe.png"
                  alt="Restaurant / Café"
                  className="w-14 h-14 object-contain"
                />}
          features={[
            { label: "Inventory Management", available: true },
            { label: "Sales Tracking", available: true },
            { label: "Customer Records", available: true },
            { label: "Advanced Reports", available: false },
            { label: "Multi Branch", available: false },
          ]}
          showButton
        />

         <BaseCard
          title="Grocery / Supermarket"
          icon={<img
                  src="/supermarket.png"
                  alt="Grocery / Supermarket"
                  className="w-14 h-14 object-contain"
                />}
          features={[
            { label: "Inventory Management", available: true },
            { label: "Sales Tracking", available: true },
            { label: "Customer Records", available: true },
            { label: "Advanced Reports", available: false },
            { label: "Multi Branch", available: false },
          ]}
          showButton
        />


    </div>
  )
}

export default BusinessCardGrid