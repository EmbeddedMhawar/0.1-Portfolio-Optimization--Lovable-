import React, { useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isChanging, setIsChanging] = useState(false);

  const handleThemeToggle = useCallback(() => {
    setIsChanging(true);
    toggleDarkMode();
    setTimeout(() => setIsChanging(false), 1000);
  }, [toggleDarkMode]);

  return (
    <header className="flex items-center justify-between px-10 py-3 border-b border-[#dee2e6] dark:border-[#2e4328] bg-white dark:bg-[#162013] transition-colors duration-700">
      <div className="flex items-center gap-4">
        <div className="w-4 h-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" className="text-[#343a40] dark:text-white" />
          </svg>
        </div>
        <h1 className="text-[#343a40] dark:text-white text-lg font-bold">InvestSmart</h1>
      </div>

      <button 
        className="header-button theme-toggle-ripple"
        onClick={handleThemeToggle}
        data-theme-changing={isChanging}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </header>
  );
};