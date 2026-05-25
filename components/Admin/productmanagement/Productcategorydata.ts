// ─── Business Type IDs ────────────────────────────────────────────────────────

export type BusinessTypeId =
  | "BT001" // Cafe
  | "BT002" // Clothing
  | "BT003" // Supermarket
  | "BT004" // Pharmacy
  | "BT005" // Hardware
  | "BT006" // Bookshop
  | "BT007"; // Other

export type ProductCategory = {
  categoryId: string;
  businessTypeId: BusinessTypeId;
  categoryName: string;
};

// ─── All categories ───────────────────────────────────────────────────────────

export const ALL_PRODUCT_CATEGORIES: ProductCategory[] = [
  // CAFE (BT001)
  { categoryId: "CAT001", businessTypeId: "BT001", categoryName: "Beverages" },
  { categoryId: "CAT002", businessTypeId: "BT001", categoryName: "Hot Drinks" },
  { categoryId: "CAT003", businessTypeId: "BT001", categoryName: "Cold Drinks" },
  { categoryId: "CAT004", businessTypeId: "BT001", categoryName: "Breakfast Items" },
  { categoryId: "CAT005", businessTypeId: "BT001", categoryName: "Main Meals" },
  { categoryId: "CAT006", businessTypeId: "BT001", categoryName: "Snacks" },
  { categoryId: "CAT007", businessTypeId: "BT001", categoryName: "Desserts" },
  { categoryId: "CAT008", businessTypeId: "BT001", categoryName: "Bakery Items" },
  { categoryId: "CAT009", businessTypeId: "BT001", categoryName: "Combo Meals" },
  { categoryId: "CAT010", businessTypeId: "BT001", categoryName: "Add-ons & Extras" },

  // CLOTHING (BT002)
  { categoryId: "CAT301", businessTypeId: "BT002", categoryName: "Men's Wear" },
  { categoryId: "CAT302", businessTypeId: "BT002", categoryName: "Women's Wear" },
  { categoryId: "CAT303", businessTypeId: "BT002", categoryName: "Kids Wear" },
  { categoryId: "CAT304", businessTypeId: "BT002", categoryName: "Footwear" },
  { categoryId: "CAT305", businessTypeId: "BT002", categoryName: "Accessories" },
  { categoryId: "CAT306", businessTypeId: "BT002", categoryName: "Formal Wear" },
  { categoryId: "CAT307", businessTypeId: "BT002", categoryName: "Casual Wear" },
  { categoryId: "CAT308", businessTypeId: "BT002", categoryName: "Sportswear" },
  { categoryId: "CAT309", businessTypeId: "BT002", categoryName: "Innerwear" },
  { categoryId: "CAT310", businessTypeId: "BT002", categoryName: "Bags & Fashion Items" },

  // SUPERMARKET (BT003)
  { categoryId: "CAT101", businessTypeId: "BT003", categoryName: "Fruits & Vegetables" },
  { categoryId: "CAT102", businessTypeId: "BT003", categoryName: "Dairy Products" },
  { categoryId: "CAT103", businessTypeId: "BT003", categoryName: "Meat & Seafood" },
  { categoryId: "CAT104", businessTypeId: "BT003", categoryName: "Bakery & Bread" },
  { categoryId: "CAT105", businessTypeId: "BT003", categoryName: "Beverages" },
  { categoryId: "CAT106", businessTypeId: "BT003", categoryName: "Frozen Foods" },
  { categoryId: "CAT107", businessTypeId: "BT003", categoryName: "Snacks & Confectionery" },
  { categoryId: "CAT108", businessTypeId: "BT003", categoryName: "Household Items" },
  { categoryId: "CAT109", businessTypeId: "BT003", categoryName: "Personal Care" },
  { categoryId: "CAT110", businessTypeId: "BT003", categoryName: "Baby Products" },

  // PHARMACY (BT004)
  { categoryId: "CAT201", businessTypeId: "BT004", categoryName: "Medicines" },
  { categoryId: "CAT202", businessTypeId: "BT004", categoryName: "Vitamins & Supplements" },
  { categoryId: "CAT203", businessTypeId: "BT004", categoryName: "Personal Care" },
  { categoryId: "CAT204", businessTypeId: "BT004", categoryName: "Baby Care" },
  { categoryId: "CAT205", businessTypeId: "BT004", categoryName: "Medical Equipment" },
  { categoryId: "CAT206", businessTypeId: "BT004", categoryName: "First Aid" },
  { categoryId: "CAT207", businessTypeId: "BT004", categoryName: "Health Drinks" },
  { categoryId: "CAT208", businessTypeId: "BT004", categoryName: "Skin Care" },
  { categoryId: "CAT209", businessTypeId: "BT004", categoryName: "Hair Care" },
  { categoryId: "CAT210", businessTypeId: "BT004", categoryName: "Hygiene Products" },

  // HARDWARE (BT005)
  { categoryId: "CAT401", businessTypeId: "BT005", categoryName: "Tools" },
  { categoryId: "CAT402", businessTypeId: "BT005", categoryName: "Electrical Items" },
  { categoryId: "CAT403", businessTypeId: "BT005", categoryName: "Plumbing Supplies" },
  { categoryId: "CAT404", businessTypeId: "BT005", categoryName: "Paint & Accessories" },
  { categoryId: "CAT405", businessTypeId: "BT005", categoryName: "Building Materials" },
  { categoryId: "CAT406", businessTypeId: "BT005", categoryName: "Fasteners" },
  { categoryId: "CAT407", businessTypeId: "BT005", categoryName: "Safety Equipment" },
  { categoryId: "CAT408", businessTypeId: "BT005", categoryName: "Gardening Tools" },
  { categoryId: "CAT409", businessTypeId: "BT005", categoryName: "Adhesives & Sealants" },
  { categoryId: "CAT410", businessTypeId: "BT005", categoryName: "Machinery & Equipment" },

  // BOOKSHOP (BT006)
  { categoryId: "CAT501", businessTypeId: "BT006", categoryName: "School Books" },
  { categoryId: "CAT502", businessTypeId: "BT006", categoryName: "Novels" },
  { categoryId: "CAT503", businessTypeId: "BT006", categoryName: "Educational Books" },
  { categoryId: "CAT504", businessTypeId: "BT006", categoryName: "Children's Books" },
  { categoryId: "CAT505", businessTypeId: "BT006", categoryName: "Stationery" },
  { categoryId: "CAT506", businessTypeId: "BT006", categoryName: "Magazines" },
  { categoryId: "CAT507", businessTypeId: "BT006", categoryName: "Religious Books" },
  { categoryId: "CAT508", businessTypeId: "BT006", categoryName: "Office Supplies" },
  { categoryId: "CAT509", businessTypeId: "BT006", categoryName: "Art & Craft Materials" },
  { categoryId: "CAT510", businessTypeId: "BT006", categoryName: "Gifts & Cards" },

  // OTHER (BT007) - Commonly used categories for general businesses
  { categoryId: "CAT601", businessTypeId: "BT007", categoryName: "General Merchandise" },
  { categoryId: "CAT602", businessTypeId: "BT007", categoryName: "Electronics & Gadgets" },
  { categoryId: "CAT603", businessTypeId: "BT007", categoryName: "Home & Living" },
  { categoryId: "CAT604", businessTypeId: "BT007", categoryName: "Beauty & Cosmetics" },
  { categoryId: "CAT605", businessTypeId: "BT007", categoryName: "Toys & Games" },
  { categoryId: "CAT606", businessTypeId: "BT007", categoryName: "Sports & Outdoors" },
  { categoryId: "CAT607", businessTypeId: "BT007", categoryName: "Pet Supplies" },
  { categoryId: "CAT608", businessTypeId: "BT007", categoryName: "Automotive" },
  { categoryId: "CAT609", businessTypeId: "BT007", categoryName: "Gifts & Souvenirs" },
  { categoryId: "CAT610", businessTypeId: "BT007", categoryName: "Services" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getCategoriesByBusinessType(businessTypeId?: BusinessTypeId): ProductCategory[] {
  if (!businessTypeId) return ALL_PRODUCT_CATEGORIES;
  return ALL_PRODUCT_CATEGORIES.filter(c => c.businessTypeId === businessTypeId);
}