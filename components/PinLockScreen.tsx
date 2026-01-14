import React, { useState, useEffect } from 'react';
import { Delete } from './Icons';

interface PinLockScreenProps {
  onSuccess: () => void;
}

const CORRECT_PIN = '0409';

const PinLockScreen: React.FC<PinLockScreenProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xs glass-pane p-8 rounded-2xl animate-fade-in-up">
        <div className="text-center mb-6">
          <img 
            src="/charm_logo_positiv.png" 
            alt="Charm Thai Logo" 
            className="w-32 mx-auto mb-4"
          />
          <p className="text-gray-500 mt-1 text-sm">Enter the PIN to access the reservation book.</p>
        </div>
        
        <div className={`flex justify-center space-x-4 my-8 ${isError ? 'animate-shake' : ''}`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin.length > index ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {keypadButtons.map((key) => {
            if (key === '') return <div key={key}></div>;
            if (key === 'backspace') {
              return (
                <button
                  key={key}
                  onClick={handleBackspaceClick}
                  className="h-14 flex items-center justify-center rounded-full text-gray-700 bg-white/50 hover:bg-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
                >
                  <Delete size={24} />
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => handleNumberClick(key)}
                className="h-14 text-2xl font-semibold rounded-full text-[var(--color-primary)] bg-white/50 hover:bg-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PinLockScreen;