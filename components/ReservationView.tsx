import React, { useState, useMemo } from 'react';
import { ViewMode, Reservation } from '../types';
import ViewToggle from './ViewToggle';
import TimelineView from './TimelineView';
import ListView from './ListView';
import ReservationModal from './ReservationModal';
import { useReservations } from '../hooks/useReservations';
import { ALL_TABLES } from '../constants';
import { Plus, Info } from './Icons';

interface ReservationViewProps {
  selectedDate: Date;
}

const ReservationView: React.FC<ReservationViewProps> = ({ selectedDate }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Timeline);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ reservation?: Reservation; tableId?: number; time?: string }>({});
  const [showAllTables, setShowAllTables] = useState(false);

  const { getReservationsForDate } = useReservations();

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const reservationsForDay = useMemo(() => getReservationsForDate(selectedDateString), [getReservationsForDate, selectedDateString]);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{dateHeader}</h2>
          <p className="text-sm text-gray-500">
            {reservationsForDay.length} reservation{reservationsForDay.length !== 1 && 's'} today
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-4">
          <ViewToggle selectedView={viewMode} onChange={setViewMode} />
          <button
            onClick={() => openNewReservationModal()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 text-xs sm:text-sm font-medium btn-gradient rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Plus size={18} />
            New Reservation
          </button>
        </div>
      </div>

      {viewMode === ViewMode.Timeline && (
        <div className="flex items-center justify-end mb-4 h-6">
            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id="showAllTables" 
                    checked={showAllTables} 
                    onChange={(e) => setShowAllTables(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-400 text-[var(--color-accent)] focus:ring-[var(--color-accent)] focus:ring-offset-2 transition"
                />
                <label htmlFor="showAllTables" className="text-sm font-medium text-gray-600 select-none">
                    Show all tables
                </label>
            </div>
        </div>
      )}

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
        {viewMode === ViewMode.Timeline ? (
          <TimelineView
            reservations={reservationsForDay}
            selectedDate={selectedDate}
            onSelectSlot={openNewReservationModal}
            onSelectReservation={openEditReservationModal}
            showAllTables={showAllTables}
          />
        ) : (
          <ListView 
            reservations={reservationsForDay} 
            onSelectReservation={openEditReservationModal} 
          />
        )}
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