
import React, { useMemo } from 'react';
import { Reservation } from '../types';
import ListView from './ListView';

interface UpcomingListViewProps {
  reservations: Reservation[];
  selectedDate: Date;
  onSelectReservation: (reservation: Reservation) => void;
}

const UpcomingListView: React.FC<UpcomingListViewProps> = ({ reservations, selectedDate, onSelectReservation }) => {
  const upcomingDays = useMemo(() => {
    const days = [];
    // Start from tomorrow, show next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      const dayReservations = reservations.filter(res => res.date === dateString);
      
      if (dayReservations.length > 0) {
        days.push({
          dateString,
          dateLabel: date.toLocaleDateString('de-DE', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          reservations: dayReservations
        });
      }
    }
    return days;
  }, [reservations, selectedDate]);

  if (upcomingDays.length === 0) {
    return (
      <div className="mt-12 p-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-300">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Vorschau nächste 7 Tage</h3>
        <p className="text-gray-500 italic">Keine weiteren Reservierungen in den nächsten 7 Tagen geplant.</p>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-gray-200"></div>
        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider">Vorschau nächste 7 Tage</h3>
        <div className="h-[1px] flex-1 bg-gray-200"></div>
      </div>
      
      {upcomingDays.map(day => (
        <div key={day.dateString} className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></div>
            <h4 className="font-bold text-gray-700">{day.dateLabel}</h4>
            <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              {day.reservations.length} {day.reservations.length === 1 ? 'Reservierung' : 'Reservierungen'}
            </span>
          </div>
          <ListView 
            reservations={day.reservations} 
            onSelectReservation={onSelectReservation} 
          />
        </div>
      ))}
    </div>
  );
};

export default UpcomingListView;

