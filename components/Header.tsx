import React, { useState } from 'react';
import { Calendar, HelpCircle } from './Icons';
import HelpModal from './HelpModal';

const Header: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <header className="p-2 sm:p-4 glass-pane sticky top-0 z-40">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="p-1.5 sm:p-2 bg-black/10 rounded-full">
            <Calendar size={24} className="text-white"/>
          </div>
          <h1 className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight text-shadow-sm text-[var(--color-primary)]">Charm Thai Reservations</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm font-medium tracking-wider text-[var(--color-primary)] text-shadow-sm">Digital Reservation Book</div>
          <button 
            onClick={() => setIsHelpOpen(true)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            title="Help / คำแนะนำ"
          >
            <HelpCircle size={24} />
          </button>
        </div>
      </div>
      </header>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default Header;