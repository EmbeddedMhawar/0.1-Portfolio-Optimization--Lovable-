import React, { useState, useCallback, useRef } from 'react';
import { Header } from '../components/Header';
import { Search, X, ArrowRight, Calendar as CalendarIcon, Upload } from 'lucide-react';
import { availableStocks } from '../utils/stockApi';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseCSV } from '../utils/csvParser';
import { useToast } from "@/hooks/use-toast";
import { ResultsDashboard } from '../components/ResultsDashboard';
import { optimizePortfolio } from '../utils/portfolioOptimizer';

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const periods = ['1Y', '3Y', '5Y', '10Y', 'MAX'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [csvData, setCsvData] = useState<any>(null);
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const filteredStocks = availableStocks.filter(stock => 
    (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !selectedStocks.includes(stock.symbol)
  );

  const popularCryptos = availableStocks.filter(stock => 
    stock.type === 'crypto'
  ).slice(0, 3);

  const popularStocks = availableStocks.filter(stock => 
    stock.type === 'stock'
  ).slice(0, 3);

  const handleStockSelect = useCallback((symbol: string) => {
    if (selectedStocks.length < 10) {
      setSelectedStocks(prev => [...prev, symbol]);
      setSearchTerm('');
    }
  }, [selectedStocks]);

  const handleStockRemove = useCallback((symbol: string) => {
    setSelectedStocks(prev => prev.filter(s => s !== symbol));
  }, []);

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
        setSelectedStocks([]); // Clear manually selected stocks
        
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
    if (!csvData && selectedStocks.length === 0) {
      toast({
        title: "No data selected",
        description: "Please select stocks or upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      // Use CSV data if available, otherwise use selected stocks data
      const data = csvData || {
        prices: [[100, 150, 200], [110, 160, 180], [120, 155, 190]], // Mock data for example
        assetNames: selectedStocks
      };

      const targetReturn = 0.10; // 10% target return
      const result = optimizePortfolio(data.prices, targetReturn);

      // Transform the results into the expected format
      const optimizedResults = {
        weights: result.weights.map((weight, index) => ({
          asset: data.assetNames[index],
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
        title: "Portfolio optimized",
        description: "Check the results below",
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization failed",
        description: "An error occurred during optimization",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCsvButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#162013] transition-colors duration-700">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Panel */}
          <div className="flex flex-col space-y-6">
            <h1 className="portfolio-text text-[32px] font-bold">Optimize Portfolio</h1>

            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#426039] dark:text-[#a2c398]" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Stocks... 🔎"
                className="search-input w-full h-12 pl-12"
                disabled={!!csvData}
              />
              {searchTerm && filteredStocks.length > 0 && (
                <div className="absolute w-full mt-1 bg-white dark:bg-[#21301c] rounded-lg shadow-lg border border-[#d4e6d7] dark:border-[#2e4328] max-h-60 overflow-y-auto z-10">
                  {filteredStocks.map(stock => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleStockSelect(stock.symbol)}
                      className="w-full px-4 py-3 text-left hover:bg-[#e8f0e9] dark:hover:bg-[#2e4328] portfolio-text transition-colors duration-300"
                    >
                      <span className="font-medium">{stock.symbol}</span> - {stock.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button 
                onClick={handleCsvButtonClick}
                className="stock-chip w-fit flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {csvData ? 'Change CSV' : 'Upload CSV'}
              </button>
              {csvData && (
                <div className="mt-2 text-sm text-[#426039] dark:text-[#a2c398]">
                  {csvData.assetNames.length} assets loaded • {csvData.prices.length} periods
                </div>
              )}
            </div>

            {selectedStocks.length > 0 && !csvData && (
              <div className="flex flex-wrap gap-2">
                {selectedStocks.map(symbol => {
                  const stock = availableStocks.find(s => s.symbol === symbol);
                  return (
                    <div key={symbol} className="stock-chip flex items-center gap-2">
                      <span>{symbol}</span>
                      <button
                        onClick={() => handleStockRemove(symbol)}
                        className="p-1 hover:bg-[#d4e6d7] dark:hover:bg-[#426039] rounded-full transition-colors duration-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {!csvData && (
              <>
                <div>
                  <h2 className="portfolio-text text-lg font-bold mb-4">Popular Stocks</h2>
                  <div className="flex gap-3">
                    {popularStocks.map(stock => (
                      <button
                        key={stock.symbol}
                        className="stock-chip"
                        onClick={() => handleStockSelect(stock.symbol)}
                        disabled={selectedStocks.includes(stock.symbol)}
                      >
                        {stock.symbol}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="portfolio-text text-lg font-bold mb-4">Popular Cryptocurrencies</h2>
                  <div className="flex gap-3">
                    {popularCryptos.map(crypto => (
                      <button
                        key={crypto.symbol}
                        className="stock-chip"
                        onClick={() => handleStockSelect(crypto.symbol)}
                        disabled={selectedStocks.includes(crypto.symbol)}
                      >
                        {crypto.symbol.replace('-USD', '')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="portfolio-text text-lg font-bold mb-4">Time Period</h2>
                  <div className="flex bg-[#e8f0e9] dark:bg-[#2e4328] rounded-lg p-1">
                    {periods.map(period => (
                      <button
                        key={period}
                        className="time-period-button flex-1"
                        data-active={selectedPeriod === period}
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="portfolio-text font-medium mb-2 block">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "date-input w-full h-14 justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white dark:bg-[#21301c]">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="portfolio-text font-medium mb-2 block">End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "date-input w-full h-14 justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white dark:bg-[#21301c]">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleOptimize}
              disabled={(!csvData && selectedStocks.length === 0) || isOptimizing}
              className="flex items-center justify-center gap-2 w-full bg-[#2e4328] hover:bg-[#426039] disabled:bg-[#e8f0e9] dark:disabled:bg-[#2e4328] text-white disabled:text-[#426039] dark:disabled:text-[#a2c398] rounded-lg py-4 font-medium transition-colors duration-300"
            >
              {isOptimizing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Optimizing...
                </>
              ) : (
                <>
                  Optimize Portfolio
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
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