import React, { useState } from 'react';
import { Calendar, HelpCircle, Sun, MapPin, BarChart2 } from './Icons';
import HelpModal from './HelpModal';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../translations';

interface HeaderProps {
  currentView: 'book' | 'stats';
  onViewChange: (view: 'book' | 'stats') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <header className="p-2 sm:p-4 glass-pane sticky top-0 z-40">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 bg-black/10 rounded-full">
              <Calendar size={24} className="text-white"/>
            </div>
            <h1 className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight text-shadow-sm text-[var(--color-primary)]">{t.title}</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden lg:block text-sm font-medium tracking-wider text-[var(--color-primary)] text-shadow-sm">{t.digitalBook}</div>
            
            <button
              onClick={() => onViewChange(currentView === 'book' ? 'stats' : 'book')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                currentView === 'stats'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-primary)] hover:bg-black/5'
              }`}
              title={t.statistics}
            >
              <BarChart2 size={20} />
              <span className="hidden sm:inline font-bold text-sm uppercase tracking-wider">{t.statistics}</span>
            </button>

            <div className="flex bg-black/5 p-1 rounded-lg">
              {(['en', 'de', 'th'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                    language === lang 
                      ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                      : 'text-[var(--color-primary)] hover:bg-black/5'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              title={t.helpTitle}
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