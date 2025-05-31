
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResultsDashboardProps {
  results: any;
  isLoading: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
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
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
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

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`p-4 rounded-xl flex items-center space-x-3 ${
        results.constraintsMet 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' 
          : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700'
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
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-slate-700/20 dark:shadow-green-500/10 dark:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Rendement Attendu</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 dark:drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                {(results.expectedReturn * 100).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500 dark:text-green-400 dark:drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-slate-700/20 dark:shadow-orange-500/10 dark:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Volatilité</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 dark:drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]">
                {(results.volatility * 100).toFixed(1)}%
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-500 dark:text-orange-400 dark:drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-slate-700/20 dark:shadow-purple-500/10 dark:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Ratio de Sharpe</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 dark:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                {results.sharpeRatio.toFixed(2)}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-500 dark:text-purple-400 dark:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20 dark:shadow-indigo-500/10 dark:shadow-2xl">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 dark:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] mb-4">
            Allocation des Actifs
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results.weights}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="weight"
                  label={({ asset, weight }) => `${asset}: ${(weight * 100).toFixed(1)}%`}
                  labelStyle={{
                    fill: 'var(--text-color)',
                    fontSize: '12px',
                    filter: 'var(--glow-filter)'
                  }}
                >
                  {results.weights.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Poids']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <style jsx global>{`
            .dark [data-chart] {
              --text-color: #e2e8f0;
              --glow-filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
            }
            [data-chart] {
              --text-color: #334155;
              --glow-filter: none;
            }
          `}</style>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20 dark:shadow-indigo-500/10 dark:shadow-2xl">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 dark:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] mb-4">
            Poids par Actif
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.weights}>
                <XAxis 
                  dataKey="asset" 
                  tick={{ 
                    fill: '#64748b',
                    filter: 'var(--axis-glow)'
                  }}
                  className="dark:fill-slate-300"
                />
                <YAxis 
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
                  tick={{ 
                    fill: '#64748b',
                    filter: 'var(--axis-glow)'
                  }}
                  className="dark:fill-slate-300"
                />
                <Tooltip 
                  formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Poids']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                  }}
                />
                <Bar 
                  dataKey="weight" 
                  fill="url(#gradient)" 
                  radius={[4, 4, 0, 0]}
                  style={{
                    filter: 'var(--bar-glow)'
                  }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <style jsx global>{`
            .dark [data-chart] {
              --axis-glow: drop-shadow(0 0 6px rgba(99, 102, 241, 0.4));
              --bar-glow: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
            }
            [data-chart] {
              --axis-glow: none;
              --bar-glow: none;
            }
            .dark .recharts-cartesian-axis-tick text {
              fill: #e2e8f0 !important;
              filter: drop-shadow(0 0 6px rgba(99, 102, 241, 0.4));
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};
