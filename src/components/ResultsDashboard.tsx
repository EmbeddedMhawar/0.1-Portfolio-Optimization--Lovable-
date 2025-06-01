import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle, ChevronDown, Info } from 'lucide-react';
import { availableStocks } from '../utils/stockApi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

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
  const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
  const [isCrypto, setIsCrypto] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#d4e6d7] dark:border-[#2e4328]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#426039] dark:border-[#a2c398] border-t-[#2e4328] dark:border-t-[#426039] rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold portfolio-text mb-2">Optimizing Portfolio...</h3>
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
          <h3 className="text-lg font-medium mb-2 portfolio-text">Ready to Optimize</h3>
          <p className="text-sm">Select your assets and click optimize to see the results.</p>
        </div>
      </div>
    );
  }

  const getExpectedReturnTooltip = (value: number) => {
    if (isCrypto) {
      if (value >= 50) return "Extremely high return potential. High risk likely.";
      if (value >= 20) return "Very high return potential. Consider risk carefully.";
      if (value >= 10) return "Good return potential for crypto assets.";
      return value >= 0 
        ? "Moderate return potential. Below crypto market average." 
        : "Negative expected return. High risk of losses.";
    } else {
      if (value >= 20) return "Exceptionally high return. Verify assumptions.";
      if (value >= 15) return "Very high return. Consider risk carefully.";
      if (value >= 10) return "High return potential. Above market average.";
      if (value >= 5) return "Good return potential. Near market average.";
      return value >= 0 
        ? "Moderate return potential." 
        : "Negative expected return. Consider reallocation.";
    }
  };

  const getSharpeRatioTooltip = (value: number) => {
    if (isCrypto) {
      if (value >= 3) return "Exceptional risk-adjusted returns for crypto.";
      if (value >= 2) return "Very good risk-adjusted returns for crypto.";
      if (value >= 1) return "Good risk-adjusted returns for crypto.";
      if (value >= 0.5) return "Moderate risk-adjusted returns for crypto.";
      return "Poor risk-adjusted returns. Consider reallocation.";
    } else {
      if (value >= 2) return "Exceptional risk-adjusted returns.";
      if (value >= 1.5) return "Very good risk-adjusted returns.";
      if (value >= 1) return "Good risk-adjusted returns.";
      if (value >= 0.5) return "Moderate risk-adjusted returns.";
      return "Poor risk-adjusted returns. Consider reallocation.";
    }
  };

  const getVolatilityTooltip = (volatility: number) => {
    if (isCrypto) {
      if (volatility <= 3) return "Low volatility for crypto assets. Very stable performance.";
      if (volatility <= 6) return "Moderate volatility for crypto assets. Good tradability.";
      if (volatility <= 10) return "High but tradable volatility for crypto assets.";
      return "Very high volatility. Increased risk of significant losses.";
    } else {
      if (volatility <= 2.5) return "Low volatility. Very stable performance.";
      if (volatility <= 4) return "Moderate volatility. Still tradable but requires attention.";
      return "High volatility. Increased risk of significant losses.";
    }
  };

  const getMetricColor = (value: number, isReturn = false, isVolatility = false) => {
    if (isReturn) {
      return value >= 0 
        ? 'text-emerald-500 dark:text-emerald-400 [text-shadow:0_0_10px_rgba(16,185,129,0.3)]' 
        : 'text-red-500 dark:text-red-400 [text-shadow:0_0_10px_rgba(239,68,68,0.3)]';
    }

    if (isVolatility) {
      if (isCrypto) {
        return value <= 3 
          ? 'text-emerald-500 dark:text-emerald-400'
          : value <= 6
            ? 'text-amber-500 dark:text-amber-400'
            : value <= 10
              ? 'text-orange-500 dark:text-orange-400'
              : 'text-red-500 dark:text-red-400';
      } else {
        return value <= 2.5
          ? 'text-emerald-500 dark:text-emerald-400'
          : value <= 4
            ? 'text-amber-500 dark:text-amber-400'
            : 'text-red-500 dark:text-red-400';
      }
    }

    // Sharpe Ratio colors
    if (isCrypto) {
      return value >= 2 
        ? 'text-emerald-500 dark:text-emerald-400'
        : value >= 1
          ? 'text-amber-500 dark:text-amber-400'
          : 'text-red-500 dark:text-red-400';
    } else {
      return value >= 1.5 
        ? 'text-emerald-500 dark:text-emerald-400'
        : value >= 1
          ? 'text-amber-500 dark:text-amber-400'
          : 'text-red-500 dark:text-red-400';
    }
  };

  const MetricCard = ({ 
    label, 
    value, 
    tooltip, 
    icon: Icon, 
    format = (v: number) => v.toFixed(2), 
    isReturn = false,
    isVolatility = false
  }) => (
    <div className="relative bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#d4e6d7] dark:border-[#2e4328] hover:shadow-[0_0_20px_rgba(46,67,40,0.15)] transition-shadow duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#426039] dark:text-[#a2c398]">{label}</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="hover:bg-[#e8f0e9]/50 dark:hover:bg-[#2e4328]/50 rounded-full p-1 transition-colors">
                <Info className="w-4 h-4 text-[#426039] dark:text-[#a2c398]" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              align="center" 
              className="bg-white dark:bg-[#2e4328] border border-[#d4e6d7] dark:border-[#426039] p-3 max-w-xs z-[60]"
            >
              <p className="portfolio-text text-sm">
                {isVolatility 
                  ? getVolatilityTooltip(value)
                  : isReturn
                    ? getExpectedReturnTooltip(value)
                    : getSharpeRatioTooltip(value)}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        {isVolatility && (
          <div className="flex items-center gap-2 text-[#426039] dark:text-[#a2c398] text-xs">
            <span>Crypto</span>
            <Switch
              checked={isCrypto}
              onCheckedChange={setIsCrypto}
              className="data-[state=checked]:bg-[#426039] h-4 w-7"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Icon className={`w-6 h-6 ${getMetricColor(value, isReturn, isVolatility)}`} />
        <p className={`text-2xl font-bold ${getMetricColor(value, isReturn, isVolatility)}`}>
          {format(value)}
        </p>
      </div>
    </div>
  );

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TooltipProvider>
          <MetricCard
            label="Expected Return"
            value={results.metrics.expectedReturn * 100}
            tooltip={getExpectedReturnTooltip(results.metrics.expectedReturn * 100)}
            icon={results.metrics.expectedReturn >= 0 ? TrendingUp : TrendingDown}
            format={(v) => `${v.toFixed(2)}%`}
            isReturn={true}
          />
          
          <MetricCard
            label="Volatility"
            value={results.metrics.volatility * 100}
            tooltip={getVolatilityTooltip(results.metrics.volatility * 100)}
            icon={TrendingDown}
            format={(v) => `${v.toFixed(2)}%`}
            isVolatility={true}
          />
          
          <MetricCard
            label="Sharpe Ratio"
            value={results.metrics.sharpeRatio}
            tooltip={getSharpeRatioTooltip(results.metrics.sharpeRatio)}
            icon={Shield}
          />
        </TooltipProvider>
      </div>

      {/* Portfolio Allocation */}
      <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#d4e6d7] dark:border-[#2e4328]">
        <h3 className="text-lg font-semibold portfolio-text mb-6 flex items-center gap-2">
          Portfolio Allocation
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-[#426039] dark:text-[#a2c398]" />
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-[#2e4328] border border-[#d4e6d7] dark:border-[#426039] p-3">
                <p className="portfolio-text text-sm">
                  Click on a stock to see detailed information
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>

        {/* Weights List */}
        <div className="space-y-2">
          {results.weights
            .sort((a, b) => b.weight - a.weight)
            .map((item) => {
              const stockInfo = availableStocks.find(s => s.symbol === item.asset);
              return (
                <div key={item.asset} className="group">
                  <button
                    onClick={() => setExpandedAsset(expandedAsset === item.asset ? null : item.asset)}
                    className="portfolio-asset w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="portfolio-text font-medium">
                        {item.asset}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#426039] dark:text-[#a2c398] font-medium">
                        {(item.weight * 100).toFixed(2)}%
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-[#426039] dark:text-[#a2c398] transition-transform duration-300 ${
                          expandedAsset === item.asset ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  {expandedAsset === item.asset && (
                    <div className="mt-2 p-4 rounded-lg bg-white/5 dark:bg-[#2e4328]/30 border border-[#d4e6d7]/20 dark:border-[#2e4328]/50">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[#426039] dark:text-[#a2c398]">Company Name</p>
                          <p className="portfolio-text font-medium">
                            {stockInfo?.name || item.asset}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#426039] dark:text-[#a2c398]">Exchange</p>
                          <p className="portfolio-text font-medium">
                            {stockInfo?.exchange || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#426039] dark:text-[#a2c398]">Weight</p>
                          <p className="portfolio-text font-medium">
                            {(item.weight * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[#426039] dark:text-[#a2c398]">Return Contribution</p>
                          <p className={`font-medium ${getMetricColor(item.weight * results.metrics.expectedReturn, true)}`}>
                            {(item.weight * results.metrics.expectedReturn * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};