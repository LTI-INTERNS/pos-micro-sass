export interface ProductDemand {
  name: string;
  changePercent: number;
  status: "High Demand" | "Declining" | "Stable";
  confidence: number;
}

export const mockProducts: ProductDemand[] = [
  { name: "Coffee Talk", changePercent: 35, status: "High Demand", confidence: 94 },
  { name: "Cold n brew", changePercent: 1.5, status: "Declining", confidence: 87 },
  { name: "Coffee Talk", changePercent: 5, status: "Stable", confidence: 91 },
];
