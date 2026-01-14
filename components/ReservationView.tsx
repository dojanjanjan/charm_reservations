import React, { useState, useMemo } from 'react';
import { ViewMode, Reservation } from '../types';
import ViewToggle from './ViewToggle';
import TimelineView from './TimelineView';
import ListView from './ListView';
import UpcomingListView from './UpcomingListView';
import ReservationModal from './ReservationModal';
import { useReservations } from '../hooks/useReservations';
import { ALL_TABLES } from '../constants';
import { Plus, Info } from './Icons';

interface ReservationViewProps {
  selectedDate: Date;
}

const ReservationView: React.FC<ReservationViewProps> = ({ selectedDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ reservation?: Reservation; tableId?: number; time?: string }>({});

  const { getReservationsForDate, loading, reservations } = useReservations();

  const selectedDateString = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const reservationsForDay = useMemo(() => getReservationsForDate(selectedDateString), [getReservationsForDate, selectedDateString]);

  if (loading) {
    return (
      <div className="glass-pane p-4 sm:p-6 rounded-2xl flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading reservations...</p>
        </div>
      </div>
    );
  }

  const openNewReservationModal = (tableId?: number, time?: string) => {
    setModalData({ tableId, time });
    setIsModalOpen(true);
  };

  const openEditReservationModal = (reservation: Reservation) => {
    setModalData({ reservation });
    setIsModalOpen(true);
  };

  const dateHeader = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isMonday = selectedDate.getDay() === 1;

  return (
    <div className="glass-pane p-4 sm:p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{dateHeader}</h2>
          <p className="text-sm text-gray-500">
            {reservationsForDay.length} reservation{reservationsForDay.length !== 1 && 's'} today
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-4">
          <button
            onClick={() => openNewReservationModal()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 text-xs sm:text-sm font-medium btn-gradient rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Plus size={18} />
            New Reservation
          </button>
        </div>
      </div>

      {isMonday && (
         <div className="bg-amber-50/50 border-l-4 border-[var(--color-accent)] text-gray-800 p-4 rounded-lg mb-6 flex items-center gap-4 shadow-sm" role="alert">
            <Info size={24} className="flex-shrink-0 text-[var(--color-accent)]" />
            <div>
                <p className="font-bold">Montags Ruhetag (Rest Day)</p>
                <p className="text-sm text-gray-600">Please note that service may be limited on Mondays.</p>
            </div>
        </div>
      )}

      <div className="min-h-[400px]">
        <ListView 
          reservations={reservationsForDay} 
          onSelectReservation={openEditReservationModal} 
        />

        <UpcomingListView 
          reservations={reservations}
          selectedDate={selectedDate}
          onSelectReservation={openEditReservationModal}
        />
      </div>


      {isModalOpen && (
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reservation={modalData.reservation}
          selectedDate={selectedDate}
          defaultTime={modalData.time}
          defaultTableId={modalData.tableId}
        />
      )}
    </div>
  );
};

export default ReservationView;