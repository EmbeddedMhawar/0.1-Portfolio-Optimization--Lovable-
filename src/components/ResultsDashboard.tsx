import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResultsDashboardProps {
  results: any;
  isLoading: boolean;
  priceData?: {
    dates: string[];
    prices: number[][];
    assetNames: string[];
  };
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, isLoading, priceData }) => {
  if (isLoading) {
    return (
      <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-400 border-t-indigo-500 dark:border-t-indigo-300 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Résolution du Système KKT</h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>• Calcul de la matrice de covariance...</p>
            <p>• Formulation des contraintes linéaires...</p>
            <p>• Décomposition LU en cours...</p>
            <p>• Application des multiplicateurs de Lagrange...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-slate-400 dark:text-slate-300" />
          </div>
          <h3 className="text-lg font-medium mb-2 dark:text-slate-200">Prêt pour l'Optimisation</h3>
          <p className="text-sm">Téléchargez vos données et lancez l'optimisation pour voir les résultats.</p>
        </div>
      </div>
    );
  }

  const generateColors = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const hue = (i * 360) / count;
      return `hsl(${hue}, 70%, 60%)`;
    });
  };

  const colors = generateColors(priceData?.assetNames.length || 0);

  const barData = results.weights.map((item: any) => ({
    name: item.asset,
    value: item.weight * 100,
    color: item.color
  }));

  const lineChartData = priceData?.dates.map((date, i) => ({
    date,
    ...priceData.assetNames.reduce((acc, name, j) => ({
      ...acc,
      [name]: priceData.prices[i][j]
    }), {})
  }));

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`p-4 rounded-xl flex items-center space-x-3 ${
        results.constraintsMet 
          ? 'bg-green-500/10 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50' 
          : 'bg-yellow-500/10 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/50'
      }`}>
        {results.constraintsMet ? (
          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
        )}
        <span className={`font-medium ${
          results.constraintsMet ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'
        }`}>
          {results.constraintsMet 
            ? 'Toutes les contraintes sont respectées' 
            : 'Attention: Certaines contraintes ont été violées'
          }
        </span>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-slate-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Rendement Attendu</p>
              <p className={`text-2xl font-bold ${results.metrics.expectedReturn < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                {(results.metrics.expectedReturn * 100).toFixed(2)}%
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${results.metrics.expectedReturn < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`} />
          </div>
        </div>

        <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-slate-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Volatilité</p>
              <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">
                {(results.metrics.volatility * 100).toFixed(2)}%
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          </div>
        </div>

        <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-slate-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Ratio de Sharpe</p>
              <p className="text-2xl font-bold text-purple-500 dark:text-purple-400">
                {(results.metrics.expectedReturn / results.metrics.volatility).toFixed(2)}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-500 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price History Chart */}
        {priceData && (
          <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Historique des Prix
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#64748b' }}
                    interval={Math.floor(lineChartData?.length / 5)}
                  />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  {priceData.assetNames.map((name, index) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={colors[index]}
                      strokeWidth={2}
                      dot={false}
                      filter={`drop-shadow(0 0 6px ${colors[index]})`}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Allocation Chart */}
        <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
            Allocation des Actifs
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}%`]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      filter={`drop-shadow(0 0 6px ${entry.color})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};