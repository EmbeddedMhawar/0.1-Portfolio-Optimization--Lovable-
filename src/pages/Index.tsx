import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Search } from 'lucide-react';

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const periods = ['1Y', '3Y', '5Y', '10Y', 'MAX'];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#162013] transition-colors duration-700">
      <Header />
      
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col w-[512px] max-w-[512px] py-5">
          <h1 className="text-[#343a40] dark:text-white text-[32px] font-bold mb-6">Optimize Portfolio</h1>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#6c757d] dark:text-[#a2c398]" />
            </div>
            <input
              type="text"
              placeholder="Search Stocks... 🔎"
              className="search-input w-full h-12 pl-12"
            />
          </div>

          <button className="stock-chip w-fit mb-6">Upload CSV</button>

          <div className="stock-chip w-fit mb-6">AAPL Apple Inc.</div>

          <h2 className="text-[#343a40] dark:text-white text-lg font-bold mb-4">Popular Stocks</h2>
          <div className="flex gap-3 mb-6">
            {['Tesla', 'Amazon', 'Meta'].map(stock => (
              <button key={stock} className="stock-chip">
                {stock}
              </button>
            ))}
          </div>

          <h2 className="text-[#343a40] dark:text-white text-lg font-bold mb-4">Time Period</h2>
          <div className="flex bg-[#e9ecef] dark:bg-[#2e4328] rounded-lg p-1 mb-6 transition-colors duration-300">
            {periods.map(period => (
              <button
                key={period}
                className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                data-active={selectedPeriod === period}
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[#343a40] dark:text-white font-medium mb-2 block">Start Date</label>
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                className="date-input w-full h-14"
              />
            </div>
            <div>
              <label className="text-[#343a40] dark:text-white font-medium mb-2 block">End Date</label>
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                className="date-input w-full h-14"
              />
            </div>
          </div>

          <p className="text-[#6c757d] dark:text-[#a2c398] text-sm">Data Points: 252 (daily)</p>
        </div>
      </div>
    </div>
  );
};

export default Index;