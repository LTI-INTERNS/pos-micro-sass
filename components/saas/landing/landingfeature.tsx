"use client";

import React from "react";
import FeaturesSection from "@/components/saas/landing/FeaturesSection";
import { 
  FileUser, 
  TrendingUp, 
  UserCog, 
  Users, 
  Package, 
  FileBarChart,
  ClipboardList,
  GitBranch,
  Sparkles,
  Wallet,
  Receipt,
  ShieldCheck
} from "lucide-react";

export default function LandingPageWithComponents() {
  const features = [
    {
      id: "staff",
      icon: <FileUser className="w-7 h-7" />,
      label: "Staff Management",
      onClick: () => console.log("Navigate to Staff Management"),
    },
    {
      id: "profit",
      icon: <TrendingUp className="w-7 h-7" />,
      label: "Profit Calculation",
      onClick: () => console.log("Navigate to Profit Calculation"),
    },
    {
      id: "supplier",
      icon: <UserCog className="w-7 h-7" />,
      label: "Supplier Management",
      onClick: () => console.log("Navigate to Supplier Management"),
    },
    {
      id: "customer",
      icon: <Users className="w-7 h-7" />,
      label: "Customer Management",
      onClick: () => console.log("Navigate to Customer Management"),
    },
    {
      id: "product",
      icon: <Package className="w-7 h-7" />,
      label: "Product Management",
      onClick: () => console.log("Navigate to Product Management"),
    },
    {
      id: "report",
      icon: <FileBarChart className="w-7 h-7" />,
      label: "Report Generation",
      onClick: () => console.log("Navigate to Report Generation"),
    },
    {
      id: "order",
      icon: <ClipboardList className="w-7 h-7" />,
      label: "Order Management",
      onClick: () => console.log("Navigate to Order Management"),
    },
    {
      id: "branch",
      icon: <GitBranch className="w-7 h-7" />,
      label: "Branch Management",
      onClick: () => console.log("Navigate to Branch Management"),
    },
    {
      id: "ai",
      icon: <Sparkles className="w-7 h-7" />,
      label: "AI Prediction",
      onClick: () => console.log("Navigate to AI Prediction"),
    },
    {
      id: "cashier",
      icon: <Wallet className="w-7 h-7" />,
      label: "Cashier Management",
      onClick: () => console.log("Navigate to Cashier Management"),
    },
    {
      id: "expense",
      icon: <Receipt className="w-7 h-7" />,
      label: "Expense Management",
      onClick: () => console.log("Navigate to Expense Management"),
    },
    {
      id: "payment",
      icon: <ShieldCheck className="w-7 h-7" />,
      label: "Secure Payments",
      onClick: () => console.log("Navigate to Secure Payments"),
    },
  ];

  return (
    <FeaturesSection
      title="Powerful Features to Run Your Business Smarter"
      subtitle="Manage sales, inventory, customers, and reporting with powerful tools designed for modern businesses."
      features={features}
      backgroundImage="/landingfeature.png"
      // Or use gradient:
      // backgroundGradient="linear-gradient(135deg, #1a0a00 0%, #2d1810 25%, #4a2818 50%, #2d1810 75%, #1a0a00 100%)"
    />
  );
}
