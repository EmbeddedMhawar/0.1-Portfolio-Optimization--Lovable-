import React, { useState } from 'react';
import { Header } from '../components/Header';
import { InputPanel } from '../components/InputPanel';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { AdvancedOptions } from '../components/AdvancedOptions';
import { StepIndicator } from '../components/StepIndicator';
import { optimizePortfolio } from '../utils/portfolioOptimizer';
import { parseCSV } from '../utils/csvParser';
import { useToast } from '@/hooks/use-toast';
import { ThemeProvider } from '../contexts/ThemeContext';

const IndexContent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [targetReturn, setTargetReturn] = useState(0.08);
  const [csvData, setCsvData] = useState<any>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState<any>({});
  const { toast } = useToast();

  const handleCsvUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const parsed = parseCSV(csvContent);
        
        console.log('Parsed CSV data:', parsed);
        
        setParsedData(parsed);
        setCsvData({
          name: file.name,
          size: file.size,
          type: file.type
        });
        
        toast({
          title: "CSV chargé avec succès",
          description: `${parsed.assetNames.length} actifs détectés avec ${parsed.prices.length} périodes`,
        });
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast({
          title: "Erreur de lecture CSV",
          description: "Vérifiez le format de votre fichier",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleOptimize = () => {
    if (!parsedData) {
      toast({
        title: "Aucune donnée disponible",
        description: "Veuillez d'abord télécharger un fichier CSV",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(2);
    
    try {
      console.log('Using advanced options:', advancedOptions);
      
      // Pass advanced options to the optimizer
      const result = optimizePortfolio(parsedData.prices, targetReturn, advancedOptions);
      
      console.log('Optimization result:', result);
      
      // Transform weights into the format expected by the UI
      const weights = result.weights.map((weight, index) => ({
        asset: parsedData.assetNames[index] || `Asset ${index + 1}`,
        weight: weight,
        color: `hsl(${(index * 360) / result.weights.length}, 70%, 60%)`
      }));

      const optimizationResults = {
        weights,
        expectedReturn: result.metrics.expectedReturn,
        volatility: result.metrics.volatility,
        sharpeRatio: result.metrics.expectedReturn / result.metrics.volatility,
        constraintsMet: true,
        advancedOptions: advancedOptions
      };

      setResults(optimizationResults);
      setCurrentStep(3);
      
      toast({
        title: "Optimisation terminée",
        description: `Portefeuille optimisé avec ${weights.length} actifs`,
      });
    } catch (error) {
      console.error('Optimization error:', error);
      setCurrentStep(1);
      toast({
        title: "Erreur d'optimisation",
        description: "Vérifiez vos données et réessayez",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <Header />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <StepIndicator currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <InputPanel
              targetReturn={targetReturn}
              setTargetReturn={setTargetReturn}
              csvData={csvData}
              setCsvData={handleCsvUpload}
              onOptimize={handleOptimize}
              isOptimizing={currentStep === 2}
            />
            
            <div className="mt-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-left px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Paramètres Avancés</span>
                  <span className={`transform transition-transform duration-200 text-slate-500 dark:text-slate-400 ${showAdvanced ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </div>
              </button>
              
              {showAdvanced && (
                <div className="mt-4">
                  <AdvancedOptions onOptionsChange={setAdvancedOptions} />
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <ResultsDashboard results={results} isLoading={currentStep === 2} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
