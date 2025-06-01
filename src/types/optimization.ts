export interface PortfolioWeight {
  asset: string;
  weight: number;
  color: string;
}

export interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

export interface AdvancedOptions {
  optimizationType: 'portfolio' | 'svm' | 'lqr' | 'resource';
  solverMethod: 'lu' | 'cholesky' | 'qr' | 'svd';
  constraints: {
    nonNegativity: boolean;
    sumToOne: boolean;
    customConstraints: boolean;
  };
  kktParams: {
    tolerance: number;
    maxIterations: number;
  };
}

export interface OptimizationResults {
  weights: PortfolioWeight[];
  metrics: PortfolioMetrics;
  constraintsMet: boolean;
  advancedOptions: AdvancedOptions;
}
