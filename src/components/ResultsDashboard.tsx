import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle, ChevronDown, Info } from 'lucide-react';
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
      <div className="portfolio-card p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold portfolio-text mb-2">Optimizing Portfolio...</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
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
      <div className="portfolio-card p-8">
        <div className="text-center text-muted-foreground">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2 portfolio-text">Ready to Optimize</h3>
          <p className="text-sm">Upload your portfolio data and click optimize to see the results.</p>
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
      return value >= 0 ? 'text-emerald-600' : 'text-red-600';
    }

    if (isVolatility) {
      if (isCrypto) {
        if (value <= 3) return 'text-emerald-600';
        if (value <= 6) return 'text-amber-600';
        if (value <= 10) return 'text-orange-600';
        return 'text-red-600';
      } else {
        if (value <= 2.5) return 'text-emerald-600';
        if (value <= 4) return 'text-amber-600';
        return 'text-red-600';
      }
    }

    // Sharpe Ratio colors
    if (isCrypto) {
      if (value >= 2) return 'text-emerald-600';
      if (value >= 1) return 'text-amber-600';
      return 'text-red-600';
    } else {
      if (value >= 1.5) return 'text-emerald-600';
      if (value >= 1) return 'text-amber-600';
      return 'text-red-600';
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
    <div className="portfolio-card p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="hover:bg-accent rounded-full p-1 transition-colors">
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              align="center" 
              className="bg-popover border border-border p-3 max-w-xs z-[60]"
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
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <span>Crypto</span>
            <Switch
              checked={isCrypto}
              onCheckedChange={setIsCrypto}
              className="data-[state=checked]:bg-primary h-4 w-7"
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
          ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800' 
          : 'bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800'
      }`}>
        {results.constraintsMet ? (
          <CheckCircle className="w-5 h-5 text-emerald-600" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        )}
        <span className={`font-medium ${
          results.constraintsMet 
            ? 'text-emerald-800 dark:text-emerald-200' 
            : 'text-amber-800 dark:text-amber-200'
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
      <div className="portfolio-card p-6">
        <h3 className="text-lg font-semibold portfolio-text mb-6 flex items-center gap-2">
          Portfolio Allocation
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border p-3">
                <p className="portfolio-text text-sm">
                  Click on an asset to see detailed information
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>

        {/* Weights List */}
        <div className="space-y-2">
          {results.weights
            .sort((a, b) => b.weight - a.weight)
            .map((item) => (
              <div key={item.asset} className="group">
                <button
                  onClick={() => setExpandedAsset(expandedAsset === item.asset ? null : item.asset)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="portfolio-text font-medium">
                      {item.asset}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-medium">
                      {(item.weight * 100).toFixed(2)}%
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                        expandedAsset === item.asset ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {expandedAsset === item.asset && (
                  <div className="mt-2 p-4 rounded-lg bg-accent/50 border border-border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Asset Name</p>
                        <p className="portfolio-text font-medium">
                          {item.asset}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="portfolio-text font-medium">
                          {(item.weight * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Return Contribution</p>
                        <p className={`font-medium ${getMetricColor(item.weight * results.metrics.expectedReturn, true)}`}>
                          {(item.weight * results.metrics.expectedReturn * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};