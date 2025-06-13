import React, { useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isChanging, setIsChanging] = useState(false);

  const handleThemeToggle = useCallback(() => {
    setIsChanging(true);
    toggleDarkMode();
    setTimeout(() => setIsChanging(false), 600);
  }, [toggleDarkMode]);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <h1 className="text-foreground text-xl font-bold">InvestSmart</h1>
      </div>

      <button 
        className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors duration-200 theme-toggle-ripple"
        onClick={handleThemeToggle}
        data-theme-changing={isChanging}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-foreground" />
        ) : (
          <Moon className="h-5 w-5 text-foreground" />
        )}
      </button>
    </header>
  );
};