import React, { useState } from 'react';
import Header from './Header';
import CalendarView from './CalendarView';
import ReservationView from './ReservationView';
import StatisticsView from './StatisticsView';
import { ReservationContext, useReservationState } from '../hooks/useReservations';

const ReservationBook: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'book' | 'stats'>('book');
  const reservationState = useReservationState();

  return (
    <ReservationContext.Provider value={reservationState}>
      <div className="min-h-screen animate-fade-in-up">
        <Header currentView={view} onViewChange={setView} />
        <main className="max-w-8xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
          {view === 'book' ? (
            <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
              <div className="w-full xl:max-w-md">
                <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />
              </div>
              <div className="flex-1">
                <ReservationView selectedDate={selectedDate} />
              </div>
            </div>
          ) : (
            <StatisticsView onBack={() => setView('book')} />
          )}
        </main>
      </div>
    </ReservationContext.Provider>
  );
};

export default ReservationBook;