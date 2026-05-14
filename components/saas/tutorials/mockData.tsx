export interface TutorialItem {
  id: string;
  title: string;
  description?: string;
  points?: string[];
  youtubeUrl: string;
}

export const tutorialsData: TutorialItem[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description:
      "Learn the basics: login, selecting business/branch, creating your first sale, and generating a receipt.",
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1",
  },
  {
    id: "role-based",
    title: "Role-Based Tutorials",
    points: [
      "Admin: setup, staff permissions, branches, products.",
      "Cashier: billing flow, refunds, customer selection.",
      "Manager: reports, shift summaries, stock alerts.",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2",
  },
  {
    id: "feature-micro",
    title: "Feature-Focused Micro Tutorials",
    points: [
      "How to add products with variants",
      "How to do stock adjustments",
      "How to apply discounts and taxes",
      "How to handle returns/refunds",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3",
  },
  {
    id: "business-type",
    title: "Business Type Specific Tutorials",
    points: [
      "Retail: barcode scanning, inventory counts, promotions",
      "Restaurant/Café: table orders, split bills, kitchen flow",
      "Grocery: fast checkout, weighted items, bulk pricing",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_4",
  },
  {
    id: "videos",
    title: "Video Tutorials",
    points: [
      "Short 30–60s clips for each feature",
      "Long-form walkthroughs for onboarding",
      "Release notes video for major updates",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_5",
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    points: [
      "Can’t login / OTP not received",
      "Printer not working",
      "Payment status confusion",
      "Stock mismatch / sync issues",
    ],
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_6",
  },
  {
    id: "whats-new",
    title: "What’s New",
    points: ["New features added", "Improvements", "Bug fixes"],
    youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_7",
  },
];
