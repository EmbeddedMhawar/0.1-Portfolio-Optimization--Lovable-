import React, { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { Search, X, ArrowRight, Calendar as CalendarIcon } from 'lucide-react';
import { availableStocks } from '../utils/stockApi';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const periods = ['1Y', '3Y', '5Y', '10Y', 'MAX'];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filteredStocks = availableStocks.filter(stock => 
    (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !selectedStocks.includes(stock.symbol)
  );

  const handleStockSelect = useCallback((symbol: string) => {
    if (selectedStocks.length < 10) {
      setSelectedStocks(prev => [...prev, symbol]);
      setSearchTerm('');
    }
  }, [selectedStocks]);

  const handleStockRemove = useCallback((symbol: string) => {
    setSelectedStocks(prev => prev.filter(s => s !== symbol));
  }, []);

  const handleOptimize = () => {
    // Optimization logic will be implemented here
    console.log('Optimizing portfolio...');
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#162013] transition-colors duration-700">
      <Header />
      
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col w-[512px] max-w-[512px] py-5">
          <h1 className="text-[#2e4328] dark:text-white text-[32px] font-bold mb-6">Optimize Portfolio</h1>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#426039] dark:text-[#a2c398]" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Stocks... 🔎"
              className="search-input w-full h-12 pl-12"
            />
            {searchTerm && filteredStocks.length > 0 && (
              <div className="absolute w-full mt-1 bg-white dark:bg-[#21301c] rounded-lg shadow-lg border border-[#d4e6d7] dark:border-[#2e4328] max-h-60 overflow-y-auto">
                {filteredStocks.map(stock => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock.symbol)}
                    className="w-full px-4 py-3 text-left hover:bg-[#e8f0e9] dark:hover:bg-[#2e4328] text-[#2e4328] dark:text-white transition-colors duration-300"
                  >
                    <span className="font-medium">{stock.symbol}</span> - {stock.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="stock-chip w-fit mb-6">Upload CSV</button>

          {selectedStocks.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedStocks.map(symbol => {
                const stock = availableStocks.find(s => s.symbol === symbol);
                return (
                  <div key={symbol} className="stock-chip flex items-center gap-2">
                    <span>{symbol} {stock?.name}</span>
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

          <h2 className="text-[#2e4328] dark:text-white text-lg font-bold mb-4">Popular Stocks</h2>
          <div className="flex gap-3 mb-6">
            {availableStocks.slice(0, 3).map(stock => (
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

          <h2 className="text-[#2e4328] dark:text-white text-lg font-bold mb-4">Time Period</h2>
          <div className="flex bg-[#e8f0e9] dark:bg-[#2e4328] rounded-lg p-1 mb-6 transition-colors duration-300">
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

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-[#2e4328] dark:text-white font-medium mb-2 block">Start Date</label>
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
              <label className="text-[#2e4328] dark:text-white font-medium mb-2 block">End Date</label>
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

          <p className="text-[#426039] dark:text-[#a2c398] text-sm mb-6">Data Points: 252 (daily)</p>

          <button
            onClick={handleOptimize}
            disabled={selectedStocks.length === 0}
            className="flex items-center justify-center gap-2 w-full bg-[#2e4328] hover:bg-[#426039] disabled:bg-[#e8f0e9] dark:disabled:bg-[#2e4328] text-white disabled:text-[#426039] dark:disabled:text-[#a2c398] rounded-lg py-4 font-medium transition-colors duration-300"
          >
            Optimize Portfolio
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;