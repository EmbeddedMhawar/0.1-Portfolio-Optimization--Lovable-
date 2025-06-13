import React, { useState, useRef } from 'react';
import { Header } from '../components/Header';
import { Upload, ArrowRight } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { useToast } from "@/hooks/use-toast";
import { ResultsDashboard } from '../components/ResultsDashboard';
import { optimizePortfolio } from '../utils/portfolioOptimizer';

const Index = () => {
  const [csvData, setCsvData] = useState<any>(null);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const parsed = parseCSV(csvContent);
        
        setCsvData(parsed);
        setOptimizationResults(null); // Clear previous results
        
        toast({
          title: "CSV uploaded successfully",
          description: `${parsed.assetNames.length} assets detected with ${parsed.prices.length} periods`,
        });
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast({
          title: "Error parsing CSV",
          description: "Please check the file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleOptimize = async () => {
    if (!csvData) {
      toast({
        title: "No data uploaded",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const targetReturn = 0.10; // 10% target return
      const result = optimizePortfolio(csvData.prices, targetReturn);

      // Transform the results into the expected format
      const optimizedResults = {
        weights: result.weights.map((weight, index) => ({
          asset: csvData.assetNames[index],
          weight: weight,
          color: `hsl(${(index * 360) / result.weights.length}, 70%, 60%)`
        })),
        metrics: {
          expectedReturn: result.metrics.expectedReturn,
          volatility: result.metrics.volatility,
          sharpeRatio: result.metrics.expectedReturn / result.metrics.volatility
        },
        constraintsMet: true
      };

      setOptimizationResults(optimizedResults);
      
      toast({
        title: "Portfolio optimized successfully",
        description: `Expected return: ${(result.metrics.expectedReturn * 100).toFixed(2)}%`,
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization failed",
        description: "An error occurred during optimization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCsvButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.csv')) {
        const event = { target: { files: [file] } } as any;
        handleFileUpload(event);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#162013] transition-colors duration-700">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Panel */}
          <div className="flex flex-col space-y-6">
            <h1 className="portfolio-text text-[32px] font-bold">Optimize Portfolio</h1>

            {/* CSV Upload Section */}
            <div className="space-y-4">
              <h2 className="portfolio-text text-lg font-semibold">Upload Portfolio Data</h2>
              
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleCsvButtonClick}
                className="border-2 border-dashed border-[#d4e6d7] dark:border-[#426039] rounded-xl p-8 text-center cursor-pointer hover:border-[#426039] dark:hover:border-[#a2c398] hover:bg-[#e8f0e9]/50 dark:hover:bg-[#2e4328]/50 transition-all duration-300"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {csvData ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-[#e8f0e9] dark:bg-[#2e4328] rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-[#426039] dark:text-[#a2c398]" />
                    </div>
                    <div>
                      <p className="portfolio-text font-medium text-lg">File uploaded successfully!</p>
                      <p className="text-[#426039] dark:text-[#a2c398] text-sm mt-1">
                        {csvData.assetNames.length} assets • {csvData.prices.length} periods
                      </p>
                    </div>
                    <button className="text-[#426039] dark:text-[#a2c398] text-sm hover:underline">
                      Click to upload a different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-[#e8f0e9] dark:bg-[#2e4328] rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-[#426039] dark:text-[#a2c398]" />
                    </div>
                    <div>
                      <p className="portfolio-text font-medium text-lg">Upload CSV File</p>
                      <p className="text-[#426039] dark:text-[#a2c398] text-sm mt-1">
                        Drag and drop your portfolio data file here, or click to browse
                      </p>
                    </div>
                    <p className="text-xs text-[#426039] dark:text-[#a2c398]">
                      Supported format: CSV with asset prices over time
                    </p>
                  </div>
                )}
              </div>

              {/* CSV Format Help */}
              <div className="bg-[#e8f0e9] dark:bg-[#2e4328] rounded-lg p-4">
                <h3 className="portfolio-text font-medium mb-2">Expected CSV Format:</h3>
                <div className="text-sm text-[#426039] dark:text-[#a2c398] space-y-1">
                  <p>• First column: Date (YYYY-MM-DD)</p>
                  <p>• Subsequent columns: Asset prices</p>
                  <p>• Header row with asset names</p>
                  <p>• Example: Date, AAPL, MSFT, GOOGL</p>
                </div>
              </div>
            </div>

            {/* Optimize Button */}
            <button
              onClick={handleOptimize}
              disabled={!csvData || isOptimizing}
              className="flex items-center justify-center gap-2 w-full bg-[#2e4328] hover:bg-[#426039] disabled:bg-[#e8f0e9] dark:disabled:bg-[#2e4328] text-white disabled:text-[#426039] dark:disabled:text-[#a2c398] rounded-lg py-4 font-medium transition-colors duration-300 disabled:cursor-not-allowed"
            >
              {isOptimizing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Optimizing Portfolio...
                </>
              ) : (
                <>
                  Optimize Portfolio
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {!csvData && (
              <div className="text-center text-[#426039] dark:text-[#a2c398] text-sm">
                Upload your portfolio data to get started with optimization
              </div>
            )}
          </div>

          {/* Right Column - Results Dashboard */}
          <div>
            <ResultsDashboard 
              results={optimizationResults}
              isLoading={isOptimizing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;