import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Glasses as MagnifyingGlass, Sun } from 'lucide-react';

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const periods = ['1Y', '3Y', '5Y', '10Y', 'MAX'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col w-[512px] max-w-[512px] py-5">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
              Optimize Portfolio
            </p>
          </div>

          <div className="px-4 py-3">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-[#a2c398] flex border-none bg-[#2e4328] items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <MagnifyingGlass size={24} />
                </div>
                <input
                  placeholder="Search Stocks... 🔎"
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#2e4328] focus:border-none h-full placeholder:text-[#a2c398] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
          </div>

          <div className="flex gap-3 p-3 flex-wrap pr-4">
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#2e4328] pl-4 pr-4">
              <p className="text-white text-sm font-medium leading-normal">AAPL Apple Inc.</p>
            </div>
          </div>

          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Popular Stocks
          </h3>

          <div className="flex gap-3 p-3 flex-wrap pr-4">
            {['Tesla', 'Amazon', 'Meta'].map((stock) => (
              <div key={stock} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#2e4328] pl-4 pr-4">
                <p className="text-white text-sm font-medium leading-normal">{stock}</p>
              </div>
            ))}
          </div>

          <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Time Period
          </h3>

          <div className="flex px-4 py-3">
            <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#2e4328] p-1">
              {periods.map((period) => (
                <label
                  key={period}
                  className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 ${
                    selectedPeriod === period
                      ? 'bg-[#162013] shadow-[0_0_4px_rgba(0,0,0,0.1)] text-white'
                      : 'text-[#a2c398]'
                  } text-sm font-medium leading-normal`}
                >
                  <span className="truncate">{period}</span>
                  <input
                    type="radio"
                    name="period"
                    className="invisible w-0"
                    value={period}
                    checked={selectedPeriod === period}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">Start Date</p>
              <input
                placeholder="MM/DD/YYYY"
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#426039] bg-[#21301c] focus:border-[#426039] h-14 placeholder:text-[#a2c398] p-[15px] text-base font-normal leading-normal"
              />
            </label>
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-white text-base font-medium leading-normal pb-2">End Date</p>
              <input
                placeholder="MM/DD/YYYY"
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#426039] bg-[#21301c] focus:border-[#426039] h-14 placeholder:text-[#a2c398] p-[15px] text-base font-normal leading-normal"
              />
            </label>
          </div>

          <p className="text-[#a2c398] text-sm font-normal leading-normal pb-3 pt-1 px-4">
            Data Points: 252 (daily)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;