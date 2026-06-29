export type ScoreBreakdown = Record<string, number>;

export type ProjectionPoint = {
  year: number;
  bear: number;
  base: number;
  bull: number;
};

export type Stock = {
  symbol: string;
  name: string;
  currentPrice: number;
  return1D: number;
  return1M: number;
  return6M: number;
  return1Y: number;
  peRatio: number;
  pbRatio: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  revenueGrowth: number;
  profitGrowth: number;
  promoterHolding: number;
  fiiDiiTrend: string;
  newsSentiment: string;
  movingAverage50: number;
  movingAverage200: number;
  sector: string;
  dataSource?: string;
  lastUpdated?: string;
};

export type StockAnalysis = {
  stock: Stock;
  score: number;
  label: "Buy" | "Hold" | "Avoid";
  breakdown: ScoreBreakdown;
  bullCase: string[];
  bearCase: string[];
  riskFactors: string[];
  technicalTrend: string;
  projections: ProjectionPoint[];
  explanation: string;
  disclaimer: string;
};

export type Fund = {
  id: string;
  name: string;
  category: string;
  nav: number;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  expenseRatio: number;
  aum: number;
  riskLevel: string;
  sharpeRatio: number;
  alpha: number;
  beta: number;
  rollingReturn: number;
  maxDrawdown: number;
  fundManager: string;
  suitableFor: string;
};

export type FundAnalysis = {
  fund: Fund;
  score: number;
  breakdown: ScoreBreakdown;
  suggestedAllocationPct: number;
  pros: string[];
  cons: string[];
  suitableInvestorType: string;
  explanation: string;
  disclaimer: string;
};

export type Commodity = {
  name: string;
  trend: string;
  return1Y: number;
  riskScore: number;
  suggestedMaxAllocation: number;
  scenarioProjections: ProjectionPoint[];
  notes: string[];
};

export type CommoditiesAnalysis = {
  gold: Commodity;
  silver: Commodity;
  fomoWarning: string;
  diversificationWarning: string;
  disclaimer: string;
};

export type AllocationItem = {
  asset: string;
  percent: number;
  amount: number;
  rationale: string;
  riskNote: string;
};

export type PortfolioPlanRequest = {
  totalInvestment: number;
  emergencyFundRequirement: number;
  timeHorizonYears: number;
  riskAppetite: string;
  goal: string;
  investmentMode: string;
};

export type PortfolioPlan = {
  score: number;
  suggestedAllocation: AllocationItem[];
  deploymentPlan: string[];
  phasedSchedule: string[];
  projections: ProjectionPoint[];
  rebalancingRules: string[];
  riskExplanation: string;
  scoreBreakdown: ScoreBreakdown;
  disclaimer: string;
};
