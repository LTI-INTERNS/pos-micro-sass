import React from 'react'
import CommonLayout from '../components/saas/common/CommonLayout'
import GlassBackground from '../components/saas/common/GlassBackground'
import PricingCardGrid from '../components/saas/pricing/PricingCardGrid'
import Navbar from '../components/saas/landing/Navigation'
     

const page = () => {
  return (
    <CommonLayout navbar={<Navbar />}>
        <div className="h-20" /> {/* Spacer for fixed navbar */}
      <GlassBackground>
        <div className="container mx-auto py-20">
          <h1 className="text-4xl font-bold text-center text-white mb-12">Pricing</h1>
          <PricingCardGrid />
        </div>
      </GlassBackground>
    </CommonLayout>
  )
}

export default page