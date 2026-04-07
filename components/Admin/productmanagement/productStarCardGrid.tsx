import StatCard from "@/components/Admin/common/StatCard";

type ProductStatCardGridProps = {
  userRole: "owner" | "admin" | "manager";
  allProductsCount: number;
  productVariantsCount: number;
  allProductsPercentage?: string;
  allProductsTrend?: "up" | "down";
  productVariantsPercentage?: string;
  productVariantsTrend?: "up" | "down";
  lowStockVariantCount?: number;
  availableStockVariantCount?: number;
  categoriesCount?: number;
  newProductsCount?: number;
  lowStockVariantPercentage?: string;
  availableStockVariantPercentage?: string;
  newProductsPercentage?: string;
  newProductsTrend?: "up" | "down";
};

type ProductStatCard = {
  title: string;
  value: string;
  percentage?: string;
  trend?: "up" | "down";
  caption?: string;
};

export default function StatCardGrid({
  userRole,
  allProductsCount,
  productVariantsCount,
  allProductsPercentage = "",
  allProductsTrend = "up",
  productVariantsPercentage = "",
  productVariantsTrend = "up",
  lowStockVariantCount = 0,
  availableStockVariantCount = 0,
  categoriesCount = 0,
  newProductsCount = 0,
  lowStockVariantPercentage = "",
  availableStockVariantPercentage = "",
  newProductsPercentage = "",
  newProductsTrend = "up",
}: ProductStatCardGridProps) {
  const baseCards: ProductStatCard[] = [
    {
      title: "All Products",
      value: String(allProductsCount),
      percentage: allProductsPercentage,
      trend: allProductsTrend,
      caption: "vs previous 30 days",
    },
    {
      title: "Product Variants",
      value: String(productVariantsCount),
      percentage: productVariantsPercentage,
      trend: productVariantsTrend,
      caption: "vs previous 30 days",
    },
  ];

  const roleCards: ProductStatCard[] =
    userRole === "manager"
      ? [
          {
            title: "Low Stock Variants",
            value: String(lowStockVariantCount),
            percentage: lowStockVariantPercentage,
            trend: "down" as const,
            caption: "of all variants",
          },
          {
            title: "Available Stock Variants",
            value: String(availableStockVariantCount),
            percentage: availableStockVariantPercentage,
            trend: "up" as const,
            caption: "of all variants",
          },
        ]
      : [
          {
            title: "No. of Categories",
            value: String(categoriesCount),
            caption: "distinct categories",
          },
          {
            title: "New Products",
            value: String(newProductsCount),
            percentage: newProductsPercentage,
            trend: newProductsTrend,
            caption: "vs previous 30 days",
          },
        ];

  const statCards = [...baseCards, ...roleCards];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          percentage={card.percentage ?? ""}
          trend={card.trend ?? "up"}
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}
