import React, { useState, useCallback } from 'react';
import PinLockScreen from './components/PinLockScreen';
import ReservationBook from './components/ReservationBook';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return <PinLockScreen onSuccess={handleAuthSuccess} />;
  }

  return <ReservationBook />;
};

export default App;
