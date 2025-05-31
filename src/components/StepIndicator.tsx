
import React from 'react';
import { Upload, Cog, BarChart3 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Configuration', icon: Upload, description: 'Télécharger les données' },
    { number: 2, title: 'Optimisation', icon: Cog, description: 'Résolution KKT' },
    { number: 3, title: 'Résultats', icon: BarChart3, description: 'Analyse du portefeuille' }
  ];

  return (
    <div className="flex items-center justify-center space-x-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= step.number
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/70 border-2 border-slate-200 text-slate-400'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <div className="text-center mt-2">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-indigo-600' : 'text-slate-500'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-slate-400">{step.description}</p>
            </div>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
              currentStep > step.number
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                : 'bg-slate-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};
