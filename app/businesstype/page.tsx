import React from 'react'
import CommonLayout from '../components/saas/common/CommonLayout'
import GlassBackground from '../components/saas/common/GlassBackground'
import BusinessCardGrid from '../components/saas/businessType/BusinessCardGrid'
import Navbar from '../components/saas/common/Navbar'
import StepProgressBar from '../components/saas/common/StepProgressBar'

const Page = () => {
  return (
    <CommonLayout navbar={<Navbar />}>
        <div className="h-20" /> {/* Spacer for fixed navbar */}
        <StepProgressBar currentStep={2} steps={[
    { id: "1", label: "Account" },
    { id: "2", label: "Business" },
    { id: "3", label: "Subscription" },
    { id: "4", label: "Checkout" },
  ]} />
      <GlassBackground>
        <div className="container mx-auto py-20">
          <h1 className="text-4xl font-bold text-center text-white mb-12">Select Your Business Type</h1>
            <BusinessCardGrid />
        </div>
      </GlassBackground>
    </CommonLayout>
  )
}

export default Page