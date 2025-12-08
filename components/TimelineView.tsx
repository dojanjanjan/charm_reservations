import React, { useMemo } from 'react';
import { Table, Reservation } from '../types';
import { INDOOR_TABLES, OUTDOOR_TABLES, OPENING_HOURS, TIME_SLOT_MINUTES, RESERVATION_DURATION_MINUTES } from '../constants';
import { Sun, MapPin, Users } from './Icons';

interface TimelineViewProps {
  reservations: Reservation[];
  selectedDate: Date;
  onSelectSlot: (tableId: number, time: string) => void;
  onSelectReservation: (reservation: Reservation) => void;
  showAllTables: boolean;
}

type SlotStatus = 
  | { status: 'free' }
  | { status: 'booked'; reservation: Reservation }
  | { status: 'covered' };


const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const generateTimeSlots = (date: Date): string[] => {
  const dayOfWeek = date.getDay();
  const hours = OPENING_HOURS[dayOfWeek as keyof typeof OPENING_HOURS];
  const slots: string[] = [];

  hours.forEach(period => {
    let currentMinutes = timeToMinutes(period.start);
    const endMinutes = timeToMinutes(period.end);

    while (currentMinutes < endMinutes) {
      slots.push(minutesToTime(currentMinutes));
      currentMinutes += TIME_SLOT_MINUTES;
    }
  });

  return slots;
};

const TimelineView: React.FC<TimelineViewProps> = ({ reservations, selectedDate, onSelectSlot, onSelectReservation, showAllTables }) => {
  const timeSlots = useMemo(() => generateTimeSlots(selectedDate), [selectedDate]);

  const tablesToDisplay = useMemo(() => {
    if (showAllTables) {
      return { indoor: INDOOR_TABLES, outdoor: OUTDOOR_TABLES };
    }
    const tableIdsWithReservations = new Set(reservations.map(r => r.tableId));
    return {
      indoor: INDOOR_TABLES.filter(t => tableIdsWithReservations.has(t.id)),
      outdoor: OUTDOOR_TABLES.filter(t => tableIdsWithReservations.has(t.id)),
    };
  }, [reservations, showAllTables]);
  
  const occupancyByTable = useMemo(() => {
    const occupancyMap = new Map<number, Map<string, SlotStatus>>();
    const reservationsByTable = new Map<number, Reservation[]>();

    reservations.forEach(res => {
      if (!reservationsByTable.has(res.tableId)) {
        reservationsByTable.set(res.tableId, []);
      }
      reservationsByTable.get(res.tableId)!.push(res);
    });

    const slotsPerReservation = RESERVATION_DURATION_MINUTES / TIME_SLOT_MINUTES;

    for (const [tableId, tableReservations] of reservationsByTable.entries()) {
      const tableOccupancy = new Map<string, SlotStatus>();
      tableReservations.forEach(res => {
        tableOccupancy.set(res.time, { status: 'booked', reservation: res });
        const startMinutes = timeToMinutes(res.time);
        for (let i = 1; i < slotsPerReservation; i++) {
          const coveredTime = minutesToTime(startMinutes + i * TIME_SLOT_MINUTES);
          tableOccupancy.set(coveredTime, { status: 'covered' });
        }
      });
      occupancyMap.set(tableId, tableOccupancy);
    }
    return occupancyMap;
  }, [reservations]);

  if (timeSlots.length === 0) {
    return <div className="text-center py-10 text-gray-500">The restaurant is closed on this day.</div>;
  }
  
  const hasReservations = reservations.length > 0;
  const shouldDisplayGrid = showAllTables || hasReservations;

  if (!shouldDisplayGrid) {
    return <div className="text-center py-10 text-gray-500">No reservations scheduled for this day. Click 'New Reservation' to add one.</div>;
  }
  
  const slotsPerReservation = RESERVATION_DURATION_MINUTES / TIME_SLOT_MINUTES;

  const gridStyle = {
    gridTemplateColumns: `140px repeat(${timeSlots.length}, minmax(80px, 1fr))`,
  };

  const renderTableRows = (tables: Table[], area: 'Indoor' | 'Outdoor') => {
    return tables.map(table => (
      <div key={table.id} className="grid items-center" style={gridStyle}>
        <div className="py-4 px-3 text-sm font-medium sticky left-0 bg-white/60 backdrop-blur-sm border-r z-10">{table.name}</div>
        {timeSlots.map((time, idx) => {
          const occupancy = occupancyByTable.get(table.id);
          const slotStatus = occupancy?.get(time);

          if (slotStatus?.status === 'booked') {
            return (
              <div key={time} className={`col-span-4 z-10 p-1.5`}>
                <button
                  onClick={() => onSelectReservation(slotStatus.reservation)}
                  className={`w-full h-14 p-2 text-left btn-gradient rounded-lg hover:shadow-lg transition-all duration-300 text-xs leading-tight shadow-md transform hover:scale-105`}
                >
                  <div className="font-bold truncate">{slotStatus.reservation.guestName}</div>
                  <div className="flex items-center gap-1 opacity-80"><Users size={12}/>{slotStatus.reservation.pax}</div>
                </button>
              </div>
            );
          }
          
          if (slotStatus?.status === 'covered') {
            return null;
          }

          return (
            <div key={time} className={`h-16 border-b border-l border-gray-200/50 group`}>
                <button
                    onClick={() => onSelectSlot(table.id, time)}
                    className="w-full h-full bg-transparent group-hover:bg-green-400/20 transition-colors"
                    aria-label={`Book table ${table.name} at ${time}`}
                ></button>
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="overflow-x-auto border border-white/20 rounded-lg bg-white/30">
      <div className="inline-block min-w-full align-middle">
        <div className="grid sticky top-0 bg-white/50 backdrop-blur-sm z-20 border-b-2 border-white/30" style={gridStyle}>
            <div className="py-3 px-3 font-semibold text-sm sticky left-0 bg-white/50 backdrop-blur-sm z-20 border-r border-white/20">Table</div>
            {timeSlots.map((slot, index) => (
              <div key={slot} className={`text-center py-3 text-xs font-mono text-gray-500 ${index % 2 === 0 ? 'border-l border-gray-200/50' : ''}`}>
                {slot}
              </div>
            ))}
        </div>

        {tablesToDisplay.indoor.length > 0 && (
          <>
            <div className="py-2 pl-3 bg-black/5 text-sm font-bold text-gray-700 flex items-center gap-2 sticky left-0 z-20"><MapPin size={16} /> Indoor</div>
            {renderTableRows(tablesToDisplay.indoor, 'Indoor')}
          </>
        )}
        
        {tablesToDisplay.outdoor.length > 0 && (
          <>
            <div className="py-2 pl-3 bg-black/5 text-sm font-bold text-gray-700 flex items-center gap-2 sticky left-0 z-20 mt-4"><Sun size={16} /> Outdoor</div>
            {renderTableRows(tablesToDisplay.outdoor, 'Outdoor')}
          </>
        )}
      </div>
    </div>
  );
};

export default TimelineView;