
import React, { useState } from 'react';
import { Settings, Zap, Brain, Calculator } from 'lucide-react';

interface AdvancedOptionsProps {
  onOptionsChange: (options: any) => void;
}

export const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ onOptionsChange }) => {
  const [optimizationType, setOptimizationType] = useState('portfolio');
  const [solverMethod, setSolverMethod] = useState('lu');
  const [constraints, setConstraints] = useState({
    nonNegativity: true,
    sumToOne: true,
    customConstraints: false
  });
  const [kktParams, setKktParams] = useState({
    tolerance: 1e-8,
    maxIterations: 1000
  });

  // Notify parent component when options change
  React.useEffect(() => {
    onOptionsChange({
      optimizationType,
      solverMethod,
      constraints,
      kktParams
    });
  }, [optimizationType, solverMethod, constraints, kktParams, onOptionsChange]);

  const handleConstraintChange = (key: keyof typeof constraints) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setConstraints(prev => ({
      ...prev,
      [key]: e.target.checked
    }));
  };

  const handleKktParamChange = (key: keyof typeof kktParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setKktParams(prev => ({
      ...prev,
      [key]: parseFloat(e.target.value) || prev[key]
    }));
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2 text-indigo-500" />
        Options Avancées
      </h3>

      {/* Optimization Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Type d'Optimisation
        </label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: 'portfolio', label: 'Optimisation de Portefeuille', icon: Calculator },
            { value: 'svm', label: 'Support Vector Machine', icon: Brain },
            { value: 'lqr', label: 'Régulateur Linéaire Quadratique', icon: Zap },
            { value: 'resource', label: 'Allocation de Ressources', icon: Settings }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setOptimizationType(option.value)}
              className={`p-3 rounded-lg text-left flex items-center space-x-3 transition-all duration-200 ${
                optimizationType === option.value
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-300 dark:border-indigo-600 text-indigo-800 dark:text-indigo-200'
                  : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <option.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Solver Method */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Méthode de Résolution
        </label>
        <select
          value={solverMethod}
          onChange={(e) => setSolverMethod(e.target.value)}
          className="w-full p-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
        >
          <option value="lu">Décomposition LU</option>
          <option value="cholesky">Décomposition de Cholesky</option>
          <option value="qr">Décomposition QR</option>
          <option value="svd">Décomposition SVD</option>
        </select>
      </div>

      {/* Constraints */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Contraintes
        </label>
        <div className="space-y-3">
          {[
            { key: 'nonNegativity', label: 'Non-négativité des poids' },
            { key: 'sumToOne', label: 'Somme des poids = 1' },
            { key: 'customConstraints', label: 'Contraintes personnalisées' }
          ].map((constraint) => (
            <label key={constraint.key} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={constraints[constraint.key as keyof typeof constraints]}
                onChange={handleConstraintChange(constraint.key as keyof typeof constraints)}
                className="w-4 h-4 text-indigo-600 border-gray-300 dark:border-slate-600 rounded focus:ring-indigo-500 bg-white dark:bg-slate-700"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">{constraint.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* KKT System Parameters */}
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Paramètres du Système KKT</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Tolérance</label>
            <input
              type="number"
              value={kktParams.tolerance}
              onChange={handleKktParamChange('tolerance')}
              step="1e-9"
              className="w-full p-2 text-sm border border-gray-200 dark:border-slate-600 rounded focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Max Itérations</label>
            <input
              type="number"
              value={kktParams.maxIterations}
              onChange={handleKktParamChange('maxIterations')}
              className="w-full p-2 text-sm border border-gray-200 dark:border-slate-600 rounded focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
