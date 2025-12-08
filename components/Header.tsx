import React from 'react';
import { Calendar } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="p-2 sm:p-4 glass-pane sticky top-0 z-40">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-1.5 sm:p-2 bg-black/10 rounded-full">
            <Calendar size={24} className="text-white"/>
          </div>
          <h1 className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight text-shadow-sm text-[var(--color-primary)]">Charm Thai Reservations</h1>
        </div>
        <div className="hidden sm:block text-sm font-medium tracking-wider text-[var(--color-primary)] text-shadow-sm">Digital Reservation Book</div>
      </div>
    </header>
  );
};

export default Header;