import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle, ChevronDown, Info } from 'lucide-react';
import { availableStocks } from '../utils/stockApi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const getMetricColor = (value: number, isReturn = false) => {
    if (isReturn) {
      return value >= 0 
        ? 'text-emerald-500 dark:text-emerald-400 [text-shadow:0_0_10px_rgba(16,185,129,0.3)]' 
        : 'text-red-500 dark:text-red-400 [text-shadow:0_0_10px_rgba(239,68,68,0.3)]';
    }
    return value >= 2 
      ? 'text-emerald-500 dark:text-emerald-400 [text-shadow:0_0_10px_rgba(16,185,129,0.3)]'
      : value >= 1
        ? 'text-amber-500 dark:text-amber-400 [text-shadow:0_0_10px_rgba(245,158,11,0.3)]'
        : 'text-red-500 dark:text-red-400 [text-shadow:0_0_10px_rgba(239,68,68,0.3)]';
  };

  const MetricCard = ({ 
    label, 
    value, 
    tooltip, 
    icon: Icon, 
    format = (v: number) => v.toFixed(2), 
    isReturn = false 
  }) => (
    <div className="relative bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#d4e6d7] dark:border-[#2e4328] hover:shadow-[0_0_20px_rgba(46,67,40,0.15)] transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-2">
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
            <p className="text-[#2e4328] dark:text-white text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-2xl font-bold ${getMetricColor(value, isReturn)}`}>
          {format(value)}
        </p>
        <Icon className={`w-6 h-6 ${getMetricColor(value, isReturn)}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`p-4 rounded-xl flex items-center space-x-3 ${
        results.constraintsMet 
          ? 'bg-[#e8f0e9]/50 dark:bg-[#2e4328]/50 border border-[#d4e6d7]/50 dark:border-[#426039]/50 shadow-[0_0_15px_rgba(46,67,40,0.1)]' 
          : 'bg-[#ffd43b]/10 dark:bg-[#ffd43b]/20 border border-[#ffd43b]/50 shadow-[0_0_15px_rgba(255,212,59,0.1)]'
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
            label="Return"
            value={results.metrics.expectedReturn * 100}
            tooltip="The anticipated annual return of the portfolio based on historical data. A positive value (green) indicates expected profits, while negative (red) suggests potential losses."
            icon={results.metrics.expectedReturn >= 0 ? TrendingUp : TrendingDown}
            format={(v) => `${v.toFixed(2)}%`}
            isReturn={true}
          />
          
          <MetricCard
            label="Volatility"
            value={results.metrics.volatility * 100}
            tooltip="Measures the portfolio's risk level through price fluctuations. Lower volatility (green) indicates stability, while higher values (red) suggest more risk. Calculated as the standard deviation of returns."
            icon={TrendingDown}
            format={(v) => `${v.toFixed(2)}%`}
          />
          
          <MetricCard
            label="Sharpe"
            value={results.metrics.sharpeRatio}
            tooltip="A measure of risk-adjusted returns. Higher values (green) indicate better returns per unit of risk. Values above 1 are considered good, above 2 excellent. Calculated as (portfolio return - risk-free rate) / portfolio volatility."
            icon={Shield}
          />
        </TooltipProvider>
      </div>

      {/* Portfolio Allocation */}
      <div className="bg-white/10 dark:bg-[#21301c] backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#d4e6d7] dark:border-[#2e4328]">
        <h3 className="text-lg font-semibold text-[#2e4328] dark:text-white mb-6 flex items-center gap-2">
          Portfolio Allocation
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-[#426039] dark:text-[#a2c398]" />
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-[#2e4328] border border-[#d4e6d7] dark:border-[#426039] p-3">
                <p className="text-[#2e4328] dark:text-white text-sm">
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
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-[#2e4328]/30 border border-[#d4e6d7]/20 dark:border-[#2e4328]/50 hover:bg-white/10 dark:hover:bg-[#2e4328]/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#2e4328] dark:text-white font-medium">
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
                          <p className="text-[#2e4328] dark:text-white font-medium">
                            {stockInfo?.name || item.asset}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#426039] dark:text-[#a2c398]">Exchange</p>
                          <p className="text-[#2e4328] dark:text-white font-medium">
                            {stockInfo?.exchange || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#426039] dark:text-[#a2c398]">Weight</p>
                          <p className="text-[#2e4328] dark:text-white font-medium">
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