// Matrix operations
function createMatrix(rows: number, cols: number): number[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(0));
}

function solveLinearSystem(matrixA: number[][], vectorY: number[], n: number): number[] {
  // LU decomposition with partial pivoting
  const LU = matrixA.map(row => [...row]);
  const P = Array(n).fill(0).map((_, i) => i);
  const X = Array(n).fill(0);
  const Y_P = Array(n).fill(0);

  // LU decomposition
  for (let k = 0; k < n; k++) {
    let i_p = k;
    let maxVal = Math.abs(LU[k][k]);

    // Find pivot
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(LU[i][k]) > maxVal) {
        maxVal = Math.abs(LU[i][k]);
        i_p = i;
      }
    }

    // Swap rows if necessary
    if (i_p !== k) {
      [LU[k], LU[i_p]] = [LU[i_p], LU[k]];
      [P[k], P[i_p]] = [P[i_p], P[k]];
    }

    // Calculate L and U elements
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(LU[k][k]) > 1e-12) {
        LU[i][k] = LU[i][k] / LU[k][k];
      } else {
        LU[i][k] = 0;
      }
      for (let j = k + 1; j < n; j++) {
        LU[i][j] -= LU[i][k] * LU[k][j];
      }
    }
  }

  // Forward substitution (Ly = Pb)
  for (let i = 0; i < n; i++) {
    Y_P[i] = vectorY[P[i]];
  }
  for (let i = 0; i < n; i++) {
    let sum = Y_P[i];
    for (let j = 0; j < i; j++) {
      sum -= LU[i][j] * Y_P[j];
    }
    Y_P[i] = sum;
  }

  // Backward substitution (Ux = y)
  for (let i = n - 1; i >= 0; i--) {
    let sum = Y_P[i];
    for (let j = i + 1; j < n; j++) {
      sum -= LU[i][j] * X[j];
    }
    X[i] = Math.abs(LU[i][i]) < 1e-12 ? 0 : sum / LU[i][i];
  }

  return X;
}

function calculateReturnsMatrix(prices: number[][]): number[][] {
  const numPeriods = prices.length;
  const numAssets = prices[0].length;
  const returns: number[][] = [];

  for (let i = 1; i < numPeriods; i++) {
    const periodReturns: number[] = [];
    for (let j = 0; j < numAssets; j++) {
      const prevPrice = prices[i-1][j];
      const currPrice = prices[i][j];
      periodReturns.push(Math.abs(prevPrice) < 1e-9 ? 0 : (currPrice - prevPrice) / prevPrice);
    }
    returns.push(periodReturns);
  }

  return returns;
}

function calculateMeanReturns(returns: number[][]): number[] {
  const numAssets = returns[0].length;
  const meanReturns = Array(numAssets).fill(0);

  for (let j = 0; j < numAssets; j++) {
    meanReturns[j] = returns.reduce((sum, r) => sum + r[j], 0) / returns.length;
  }

  return meanReturns;
}

function calculateCovariance(returns: number[][], meanReturns: number[]): number[][] {
  const numAssets = returns[0].length;
  const covariance = createMatrix(numAssets, numAssets);
  const numPeriods = returns.length;

  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < numPeriods; k++) {
        const diffI = returns[k][i] - meanReturns[i];
        const diffJ = returns[k][j] - meanReturns[j];
        sum += diffI * diffJ;
      }
      covariance[i][j] = sum / (numPeriods - 1);
      if (i !== j) {
        covariance[j][i] = covariance[i][j];
      }
    }
  }

  return covariance;
}

function constructKKTMatrix(covariance: number[][], meanReturns: number[]): number[][] {
  const numAssets = meanReturns.length;
  const kktSize = numAssets + 2;
  const kkt = createMatrix(kktSize, kktSize);

  // Copy covariance matrix
  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      kkt[i][j] = covariance[i][j];
    }
  }

  // Add mean returns and constraints
  for (let i = 0; i < numAssets; i++) {
    kkt[i][numAssets] = meanReturns[i];
    kkt[i][numAssets + 1] = 1;
    kkt[numAssets][i] = meanReturns[i];
    kkt[numAssets + 1][i] = 1;
  }

  return kkt;
}

export interface OptimizationResult {
  weights: number[];
  metrics: {
    expectedReturn: number;
    volatility: number;
  };
}

export function optimizePortfolio(prices: number[][], targetReturn: number, advancedOptions: any = {}) {
  console.log('Optimizing with advanced options:', advancedOptions);
  
  const returns = calculateReturnsMatrix(prices);
  const meanReturns = calculateMeanReturns(returns);
  const covariance = calculateCovariance(returns, meanReturns);
  const numAssets = prices[0].length;

  // Use advanced options if provided
  const tolerance = advancedOptions.kktParams?.tolerance || 1e-8;
  const maxIterations = advancedOptions.kktParams?.maxIterations || 1000;
  const enforceNonNegativity = advancedOptions.constraints?.nonNegativity !== false;
  const enforceSumToOne = advancedOptions.constraints?.sumToOne !== false;

  console.log('Tolerance:', tolerance, 'Max iterations:', maxIterations);
  console.log('Enforce non-negativity:', enforceNonNegativity, 'Enforce sum to one:', enforceSumToOne);

  // Construct KKT matrix and RHS vector
  const kktMatrix = constructKKTMatrix(covariance, meanReturns);
  const kktSize = numAssets + 2;
  const Y = Array(kktSize).fill(0);
  Y[numAssets] = targetReturn;
  Y[numAssets + 1] = 1;

  // Solve KKT system
  let weights = solveLinearSystem(kktMatrix, Y, kktSize);
  weights = weights.slice(0, numAssets);

  // Handle negative weights based on advanced options
  const hasNegative = weights.some(w => w < 0);
  if (hasNegative && enforceNonNegativity) {
    console.log('Applying non-negativity constraints');
    weights = weights.map(w => Math.max(0, w));
    
    if (enforceSumToOne) {
      const sum = weights.reduce((a, b) => a + b, 0);
      if (sum > tolerance) {
        weights = weights.map(w => w / sum);
      }
    }
  }

  // Calculate portfolio metrics
  const portfolioReturn = weights.reduce((sum, w, i) => sum + w * meanReturns[i], 0);
  let portfolioVariance = 0;
  for (let i = 0; i < numAssets; i++) {
    for (let j = 0; j < numAssets; j++) {
      portfolioVariance += weights[i] * weights[j] * covariance[i][j];
    }
  }
  const portfolioVolatility = Math.sqrt(Math.max(0, portfolioVariance));

  return {
    weights,
    metrics: {
      expectedReturn: portfolioReturn,
      volatility: portfolioVolatility
    }
  };
}
