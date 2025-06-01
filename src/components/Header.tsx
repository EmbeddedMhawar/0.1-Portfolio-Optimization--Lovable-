import React from 'react';
import { Bell } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#2e4328] px-10 py-3">
      <div className="flex items-center gap-4 text-white">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">InvestSmart</h2>
      </div>
      
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <a className="text-white text-sm font-medium leading-normal" href="#">Dashboard</a>
          <a className="text-white text-sm font-medium leading-normal" href="#">Portfolio</a>
          <a className="text-white text-sm font-medium leading-normal" href="#">Optimize</a>
          <a className="text-white text-sm font-medium leading-normal" href="#">Research</a>
          <a className="text-white text-sm font-medium leading-normal" href="#">Learn</a>
        </div>
        
        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#2e4328] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
          <Bell className="text-white" size={20} />
        </button>
        
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
             style={{ backgroundImage: 'url("https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }} />
      </div>
    </header>
  );
};