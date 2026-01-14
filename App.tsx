import React, { useState, useCallback } from 'react';
import PinLockScreen from './components/PinLockScreen';
import ReservationBook from './components/ReservationBook';
import { LanguageProvider } from './hooks/useLanguage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  return (
    <LanguageProvider>
      {!isAuthenticated ? (
        <PinLockScreen onSuccess={handleAuthSuccess} />
      ) : (
        <ReservationBook />
      )}
    </LanguageProvider>
  );
};

export default App;
