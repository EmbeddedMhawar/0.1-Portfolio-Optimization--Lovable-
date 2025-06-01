import React from 'react';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface OptimizationResults {
  weights: {
    asset: string;
    weight: number;
    color: string;
  }[];
  metrics: {
    expectedReturn: number;
    volatility: number;
    sharpeRatio: number;
  };
  constraintsMet: boolean;
}

interface ResultsDashboardProps {
  results: OptimizationResults | null;
  isLoading: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#d4e6d7] dark:border-[#2e4328]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#426039] dark:border-[#a2c398] border-t-[#2e4328] dark:border-t-[#426039] rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-[#2e4328] dark:text-white mb-2">Optimizing Portfolio...</h3>
          <div className="space-y-2 text-sm text-[#426039] dark:text-[#a2c398]">
            <p>• Calculating covariance matrix...</p>
            <p>• Formulating constraints...</p>
            <p>• Solving optimization problem...</p>
            <p>• Computing portfolio metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#d4e6d7] dark:border-[#2e4328]">
        <div className="text-center text-[#426039] dark:text-[#a2c398]">
          <div className="w-16 h-16 bg-[#e8f0e9] dark:bg-[#2e4328] rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-[#2e4328] dark:text-white">Ready to Optimize</h3>
          <p className="text-sm">Select your assets and click optimize to see the results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`p-4 rounded-xl flex items-center space-x-3 ${
        results.constraintsMet 
          ? 'bg-[#e8f0e9]/50 dark:bg-[#2e4328]/50 border border-[#d4e6d7]/50 dark:border-[#426039]/50' 
          : 'bg-[#ffd43b]/10 dark:bg-[#ffd43b]/20 border border-[#ffd43b]/50'
      }`}>
        {results.constraintsMet ? (
          <CheckCircle className="w-5 h-5 text-[#2e4328] dark:text-[#a2c398]" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-[#ffd43b]" />
        )}
        <span className={`font-medium ${
          results.constraintsMet 
            ? 'text-[#2e4328] dark:text-[#a2c398]' 
            : 'text-[#ffd43b]'
        }`}>
          {results.constraintsMet 
            ? 'Optimal portfolio found' 
            : 'Warning: Some constraints were violated'
          }
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#d4e6d7] dark:border-[#2e4328]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#426039] dark:text-[#a2c398]">Expected Return</p>
              <p className={`text-2xl font-bold ${results.metrics.expectedReturn < 0 ? 'text-[#ff6b6b]' : 'text-[#2e4328] dark:text-[#a2c398]'}`}>
                {(results.metrics.expectedReturn * 100).toFixed(2)}%
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${results.metrics.expectedReturn < 0 ? 'text-[#ff6b6b]' : 'text-[#2e4328] dark:text-[#a2c398]'}`} />
          </div>
        </div>

        <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#d4e6d7] dark:border-[#2e4328]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#426039] dark:text-[#a2c398]">Volatility</p>
              <p className="text-2xl font-bold text-[#2e4328] dark:text-[#a2c398]">
                {(results.metrics.volatility * 100).toFixed(2)}%
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-[#2e4328] dark:text-[#a2c398]" />
          </div>
        </div>

        <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#d4e6d7] dark:border-[#2e4328]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#426039] dark:text-[#a2c398]">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-[#2e4328] dark:text-[#a2c398]">
                {results.metrics.sharpeRatio.toFixed(2)}
              </p>
            </div>
            <Shield className="w-8 h-8 text-[#2e4328] dark:text-[#a2c398]" />
          </div>
        </div>
      </div>

      {/* Asset Weights List */}
      <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#d4e6d7] dark:border-[#2e4328]">
        <h3 className="text-lg font-semibold text-[#2e4328] dark:text-white mb-4">
          Portfolio Allocation
        </h3>
        <div className="space-y-3">
          {results.weights
            .sort((a, b) => b.weight - a.weight)
            .map((item, index) => (
              <div 
                key={item.asset}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-[#2e4328]/30 border border-[#d4e6d7]/20 dark:border-[#2e4328]/50"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#2e4328] dark:text-white font-medium">
                    {item.asset}
                  </span>
                </div>
                <span className="text-[#426039] dark:text-[#a2c398] font-medium">
                  {(item.weight * 100).toFixed(2)}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};