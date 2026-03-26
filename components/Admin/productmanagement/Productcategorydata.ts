// ─── Business Type IDs ────────────────────────────────────────────────────────

export type BusinessTypeId =
  | "bt-001" // Cafe
  | "bt-002" // Clothing
  | "bt-003" // Supermarket
  | "bt-004" // Pharmacy
  | "bt-005" // Hardware
  | "bt-006" // Bookshop
  | "bt-007"; // Other

export type ProductCategory = {
  categoryId: string;
  businessTypeId: BusinessTypeId;
  categoryName: string;
};

// ─── All categories ───────────────────────────────────────────────────────────

export const ALL_PRODUCT_CATEGORIES: ProductCategory[] = [
  // CAFE (bt-001)
  { categoryId: "cat-001", businessTypeId: "bt-001", categoryName: "Beverages" },
  { categoryId: "cat-002", businessTypeId: "bt-001", categoryName: "Hot Drinks" },
  { categoryId: "cat-003", businessTypeId: "bt-001", categoryName: "Cold Drinks" },
  { categoryId: "cat-004", businessTypeId: "bt-001", categoryName: "Breakfast Items" },
  { categoryId: "cat-005", businessTypeId: "bt-001", categoryName: "Main Meals" },
  { categoryId: "cat-006", businessTypeId: "bt-001", categoryName: "Snacks" },
  { categoryId: "cat-007", businessTypeId: "bt-001", categoryName: "Desserts" },
  { categoryId: "cat-008", businessTypeId: "bt-001", categoryName: "Bakery Items" },
  { categoryId: "cat-009", businessTypeId: "bt-001", categoryName: "Combo Meals" },
  { categoryId: "cat-010", businessTypeId: "bt-001", categoryName: "Add-ons & Extras" },

  // CLOTHING (bt-002)
  { categoryId: "cat-301", businessTypeId: "bt-002", categoryName: "Men's Wear" },
  { categoryId: "cat-302", businessTypeId: "bt-002", categoryName: "Women's Wear" },
  { categoryId: "cat-303", businessTypeId: "bt-002", categoryName: "Kids Wear" },
  { categoryId: "cat-304", businessTypeId: "bt-002", categoryName: "Footwear" },
  { categoryId: "cat-305", businessTypeId: "bt-002", categoryName: "Accessories" },
  { categoryId: "cat-306", businessTypeId: "bt-002", categoryName: "Formal Wear" },
  { categoryId: "cat-307", businessTypeId: "bt-002", categoryName: "Casual Wear" },
  { categoryId: "cat-308", businessTypeId: "bt-002", categoryName: "Sportswear" },
  { categoryId: "cat-309", businessTypeId: "bt-002", categoryName: "Innerwear" },
  { categoryId: "cat-310", businessTypeId: "bt-002", categoryName: "Bags & Fashion Items" },

  // SUPERMARKET (bt-003)
  { categoryId: "cat-101", businessTypeId: "bt-003", categoryName: "Fruits & Vegetables" },
  { categoryId: "cat-102", businessTypeId: "bt-003", categoryName: "Dairy Products" },
  { categoryId: "cat-103", businessTypeId: "bt-003", categoryName: "Meat & Seafood" },
  { categoryId: "cat-104", businessTypeId: "bt-003", categoryName: "Bakery & Bread" },
  { categoryId: "cat-105", businessTypeId: "bt-003", categoryName: "Beverages" },
  { categoryId: "cat-106", businessTypeId: "bt-003", categoryName: "Frozen Foods" },
  { categoryId: "cat-107", businessTypeId: "bt-003", categoryName: "Snacks & Confectionery" },
  { categoryId: "cat-108", businessTypeId: "bt-003", categoryName: "Household Items" },
  { categoryId: "cat-109", businessTypeId: "bt-003", categoryName: "Personal Care" },
  { categoryId: "cat-110", businessTypeId: "bt-003", categoryName: "Baby Products" },

  // PHARMACY (bt-004)
  { categoryId: "cat-201", businessTypeId: "bt-004", categoryName: "Medicines" },
  { categoryId: "cat-202", businessTypeId: "bt-004", categoryName: "Vitamins & Supplements" },
  { categoryId: "cat-203", businessTypeId: "bt-004", categoryName: "Personal Care" },
  { categoryId: "cat-204", businessTypeId: "bt-004", categoryName: "Baby Care" },
  { categoryId: "cat-205", businessTypeId: "bt-004", categoryName: "Medical Equipment" },
  { categoryId: "cat-206", businessTypeId: "bt-004", categoryName: "First Aid" },
  { categoryId: "cat-207", businessTypeId: "bt-004", categoryName: "Health Drinks" },
  { categoryId: "cat-208", businessTypeId: "bt-004", categoryName: "Skin Care" },
  { categoryId: "cat-209", businessTypeId: "bt-004", categoryName: "Hair Care" },
  { categoryId: "cat-210", businessTypeId: "bt-004", categoryName: "Hygiene Products" },

  // HARDWARE (bt-005)
  { categoryId: "cat-401", businessTypeId: "bt-005", categoryName: "Tools" },
  { categoryId: "cat-402", businessTypeId: "bt-005", categoryName: "Electrical Items" },
  { categoryId: "cat-403", businessTypeId: "bt-005", categoryName: "Plumbing Supplies" },
  { categoryId: "cat-404", businessTypeId: "bt-005", categoryName: "Paint & Accessories" },
  { categoryId: "cat-405", businessTypeId: "bt-005", categoryName: "Building Materials" },
  { categoryId: "cat-406", businessTypeId: "bt-005", categoryName: "Fasteners" },
  { categoryId: "cat-407", businessTypeId: "bt-005", categoryName: "Safety Equipment" },
  { categoryId: "cat-408", businessTypeId: "bt-005", categoryName: "Gardening Tools" },
  { categoryId: "cat-409", businessTypeId: "bt-005", categoryName: "Adhesives & Sealants" },
  { categoryId: "cat-410", businessTypeId: "bt-005", categoryName: "Machinery & Equipment" },

  // BOOKSHOP (bt-006)
  { categoryId: "cat-501", businessTypeId: "bt-006", categoryName: "School Books" },
  { categoryId: "cat-502", businessTypeId: "bt-006", categoryName: "Novels" },
  { categoryId: "cat-503", businessTypeId: "bt-006", categoryName: "Educational Books" },
  { categoryId: "cat-504", businessTypeId: "bt-006", categoryName: "Children's Books" },
  { categoryId: "cat-505", businessTypeId: "bt-006", categoryName: "Stationery" },
  { categoryId: "cat-506", businessTypeId: "bt-006", categoryName: "Magazines" },
  { categoryId: "cat-507", businessTypeId: "bt-006", categoryName: "Religious Books" },
  { categoryId: "cat-508", businessTypeId: "bt-006", categoryName: "Office Supplies" },
  { categoryId: "cat-509", businessTypeId: "bt-006", categoryName: "Art & Craft Materials" },
  { categoryId: "cat-510", businessTypeId: "bt-006", categoryName: "Gifts & Cards" },

  // OTHER (bt-007) - Commonly used categories for general businesses
  { categoryId: "cat-601", businessTypeId: "bt-007", categoryName: "General Merchandise" },
  { categoryId: "cat-602", businessTypeId: "bt-007", categoryName: "Electronics & Gadgets" },
  { categoryId: "cat-603", businessTypeId: "bt-007", categoryName: "Home & Living" },
  { categoryId: "cat-604", businessTypeId: "bt-007", categoryName: "Beauty & Cosmetics" },
  { categoryId: "cat-605", businessTypeId: "bt-007", categoryName: "Toys & Games" },
  { categoryId: "cat-606", businessTypeId: "bt-007", categoryName: "Sports & Outdoors" },
  { categoryId: "cat-607", businessTypeId: "bt-007", categoryName: "Pet Supplies" },
  { categoryId: "cat-608", businessTypeId: "bt-007", categoryName: "Automotive" },
  { categoryId: "cat-609", businessTypeId: "bt-007", categoryName: "Gifts & Souvenirs" },
  { categoryId: "cat-610", businessTypeId: "bt-007", categoryName: "Services" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getCategoriesByBusinessType(businessTypeId?: BusinessTypeId): ProductCategory[] {
  if (!businessTypeId) return ALL_PRODUCT_CATEGORIES;
  return ALL_PRODUCT_CATEGORIES.filter(c => c.businessTypeId === businessTypeId);
}