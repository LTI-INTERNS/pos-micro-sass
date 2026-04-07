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
  outOfStockVariantCount?: number;
  categoriesCount?: number;
  categoriesPercentage?: string;
  categoriesTrend?: "up" | "down";
  newProductsCount?: number;
  lowStockVariantPercentage?: string;
  outOfStockVariantPercentage?: string;
  newProductsPercentage?: string;
  newProductsTrend?: "up" | "down";
  onAllVariantsClick?: () => void;
  onLowStockClick?: () => void;
  onOutOfStockClick?: () => void;
};

type ProductStatCard = {
  title: string;
  value: string;
  percentage?: string;
  trend?: "up" | "down";
  caption?: string;
  onClick?: () => void;
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
  outOfStockVariantCount = 0,
  categoriesCount = 0,
  categoriesPercentage = "",
  categoriesTrend = "up",
  newProductsCount = 0,
  lowStockVariantPercentage = "",
  outOfStockVariantPercentage = "",
  newProductsPercentage = "",
  newProductsTrend = "up",
  onAllVariantsClick,
  onLowStockClick,
  onOutOfStockClick,
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
      title: "All Product Variants",
      value: String(productVariantsCount),
      percentage: productVariantsPercentage,
      trend: productVariantsTrend,
      caption: "vs previous 30 days",
      onClick: userRole === "manager" ? onAllVariantsClick : undefined,
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
            onClick: onLowStockClick,
          },
          {
            title: "Out of Stock Variants",
            value: String(outOfStockVariantCount),
            percentage: outOfStockVariantPercentage,
            trend: "down" as const,
            caption: "of all variants",
            onClick: onOutOfStockClick,
          },
        ]
      : [
          {
            title: "No. of Categories",
            value: String(categoriesCount),
            percentage: categoriesPercentage,
            trend: categoriesTrend,
            caption: "vs previous 30 days",
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
          onClick={card.onClick}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}
