import React, { useState, useEffect } from 'react';
import { Delete } from './Icons';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../translations';

interface PinLockScreenProps {
  onSuccess: () => void;
}

const CORRECT_PIN = '0409';

const PinLockScreen: React.FC<PinLockScreenProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        onSuccess();
      } else {
        setIsError(true);
        setTimeout(() => {
          setPin('');
          setIsError(false);
        }, 500);
      }
    }
  }, [pin, onSuccess]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleBackspaceClick = () => {
    setPin(pin.slice(0, -1));
  };

  const keypadButtons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '', '0', 'backspace'
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-accent)]/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-sm glass-card-3d p-10 rounded-[2.5rem] animate-fade-in-up z-10">
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-[var(--color-accent)]/20 blur-2xl rounded-full"></div>
            <img 
              src="/charm_logo_positiv.png" 
              alt="Charm Thai Logo" 
              className="w-40 mx-auto relative z-10 drop-shadow-2xl"
            />
          </div>
          <p className="text-gray-500 font-medium tracking-wide text-sm uppercase">{t.enterPin}</p>
        </div>
        
        <div className={`flex justify-center space-x-6 my-10 ${isError ? 'animate-shake' : ''}`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 transform ${
                pin.length > index 
                  ? 'bg-[var(--color-primary)] scale-125 pin-dot-glow' 
                  : 'bg-white/50 scale-100 border border-black/5'
              }`}
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {keypadButtons.map((key, idx) => {
            if (key === '') return <div key={`empty-${idx}`}></div>;
            if (key === 'backspace') {
              return (
                <button
                  key={key}
                  onClick={handleBackspaceClick}
                  className="h-16 flex items-center justify-center rounded-2xl text-gray-700 keypad-btn-3d group"
                  aria-label="Delete"
                >
                  <Delete size={28} className="transition-transform group-hover:scale-110" />
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => handleNumberClick(key)}
                className="h-16 text-2xl font-bold rounded-2xl text-[var(--color-primary)] keypad-btn-3d"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex bg-white/30 backdrop-blur-md p-1 rounded-xl mt-10 shadow-lg border border-white/40 z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {(['en', 'de', 'th'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${
              language === lang 
                ? 'bg-[var(--color-primary)] text-white shadow-md transform scale-105' 
                : 'text-[var(--color-primary)] hover:bg-white/40'
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mt-8 text-gray-400 text-xs font-medium tracking-widest uppercase opacity-50 z-10">
        © 2026 Charm Thai Reservations
      </div>
    </div>
  );
};

export default PinLockScreen;