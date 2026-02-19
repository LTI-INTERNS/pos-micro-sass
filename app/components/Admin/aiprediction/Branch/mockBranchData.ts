export type BranchForecast = {
  branchName: string;
  currentSale: number;
  predictedSale: number;
  efficiencyPercent: number;
  highlighted?: boolean;
};

export const mockBranchData: BranchForecast[] = [
  {
    branchName: "Branch 1",
    currentSale: 1290,
    predictedSale: 2290,
    efficiencyPercent: 10.4,
  },
  {
    branchName: "Branch 2",
    currentSale: 1290,
    predictedSale: 2290,
    efficiencyPercent: 0,
  },
  {
    branchName: "Branch 3",
    currentSale: 1290,
    predictedSale: 2290,
    efficiencyPercent: 50.5,
  },
  {
    branchName: "Branch 4",
    currentSale: 1290,
    predictedSale: 2290,
    efficiencyPercent: 42.4,
  },
  {
    branchName: "Branch 5",
    currentSale: 1290,
    predictedSale: 2290,
    efficiencyPercent: 18,
  },
];
