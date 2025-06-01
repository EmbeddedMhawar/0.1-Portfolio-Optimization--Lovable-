import React from 'react';
import { Bell, Sun } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-10 py-3 border-b border-[#2e4328]">
      <div className="flex items-center gap-4">
        <div className="w-4 h-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="white" />
          </svg>
        </div>
        <h1 className="text-white text-lg font-bold">InvestSmart</h1>
      </div>

      <div className="flex items-center gap-8">
        <nav className="flex gap-9">
          {['Dashboard', 'Portfolio', 'Optimize', 'Research', 'Learn'].map(item => (
            <a key={item} href="#" className="text-white text-sm font-medium">
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="header-button">
            <Bell className="h-5 w-5" />
          </button>
          <button className="header-button">
            <Sun className="h-5 w-5" />
          </button>
          <div 
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}
          />
        </div>
      </div>
    </header>
  );
};