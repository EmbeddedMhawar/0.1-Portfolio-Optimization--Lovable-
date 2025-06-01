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
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 bg-[#2e4328] dark:bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%)' }}></div>
        </div>
        <h1 className="text-[#343a40] dark:text-white text-xl font-bold">Invsmart</h1>
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