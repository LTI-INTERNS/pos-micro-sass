# LankaTech Micro SaaS POS - Frontend

A modern, scalable, and feature-rich POS Micro SaaS solution built for efficiency. This frontend provides a seamless experience for administrators, staff, and customers through three main modules: SaaS Landing, Admin Dashboard, and Point of Sale (POS).

## 🚀 Vision & Purpose
This platform is designed to empower small to medium businesses (SMBs) in Sri Lanka with a robust, cloud-based Point of Sale system. It features multi-tenancy support, enabling multiple companies to manage their operations, branches, and staff within a unified ecosystem.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4+](https://tailwindcss.com/)
- **State Management**: React Context API
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations/UI Components**: [Swiper.js](https://swiperjs.com/) for sliders, custom-built Glassmorphism components.
- **Reporting**: [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) for dynamic PDF exports.
- **Languages**: [TypeScript](https://www.typescriptlang.org/)

---

## 📂 Project Structure Overview

```text
/app
├── components/          # Reusable UI components organized by module
│   ├── Admin/           # Admin Dashboard specific components (Charts, Tables, etc.)
│   ├── Pos/             # POS Terminal components (Item grids, Checkout, Modals)
│   ├── saas/            # Landing page, Pricing, and Onboarding components
│   └── Landing/         # Auth and shared landing screens
├── context/             # Global state (Currency, Notifications, Store Info, POS Settings)
├── hooks/               # Custom hooks (POS Channels, Receipt actions)
├── utils/               # Helper functions (Receipt generation, Stat calculations)
├── (routes)/            # Next.js App Router folders (overview, posdashboard, etc.)
/public                  # Static assets (Logos, Backgrounds, Icons)
/types                   # Global TypeScript definitions
```

---

## ✨ Key Features & Modules

### 🏪 SaaS & Onboarding
- **Dynamic Landing Page**: Showcasing features, growth stats, and testimonials.
- **Step-by-Step Onboarding**: Smooth business type selection, company creation, and branch setup.
- **Pricing & Subscription**: Tiered plans integrated with payment process flows.

### 📊 Admin Dashboard
- **Overview Dashboard**: Real-time sales charts (Line/Bar) and top-selling item alerts.
- **Inventory Management**: Comprehensive product tables with stock approval workflows.
- **Staff & Cashier Management**: Role-based access control and staff performance tracking.
- **Financial Tracking**: Expenses management, profit calculations, and recurring expense logs.
- **Advanced Settings**: Receipt customization, loyalty program configuration, and regional settings.

### 💳 Point of Sale (POS)
- **Fast Checkout**: Intuitive item selection grid with category filtering.
- **Customer Loyalty**: Quick customer addition and history tracking.
- **Order Management**: Order summaries, payment modal simulations (Cash/Card), and digital receipt previews.
- **Dual Display Support**: Dedicated customer-facing display screen logic.

---

## 🚦 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📝 Standards & Best Practices
- **Glassmorphism UI**: High-end aesthetic using modern CSS backdrops and gradients.
- **Responsive Design**: Mobile-friendly layouts for diverse business environments.
- **Component Reusability**: Modularized components in `app/components/Admin/common` for rapid development.
- **Type Safety**: Full TypeScript integration for robust and maintainable code.

---

Built with ❤️ by the **LankaTech Interns Team**.

