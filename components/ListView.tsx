
import React from 'react';
import { Reservation } from '../types';
import { ALL_TABLES, UNASSIGNED_TABLE } from '../constants';
import { Edit, Users, Clock, MapPin, MessageSquare } from './Icons';
import { useLanguage } from '../hooks/useLanguage';

interface ListViewProps {
  reservations: Reservation[];
  onSelectReservation: (reservation: Reservation) => void;
}

const tableMap = new Map(ALL_TABLES.map(t => [t.id, t]));

const ListView: React.FC<ListViewProps> = ({ reservations, onSelectReservation }) => {
  const { t } = useLanguage();
  if (reservations.length === 0) {
    return <div className="text-center py-10 text-gray-500">{t.noReservations}</div>;
  }

  const sortedReservations = [...reservations].sort((a, b) => {
    return a.time.localeCompare(b.time) || a.tableId - b.tableId;
  });

  return (
    <div className="space-y-4">
      {sortedReservations.map(res => {
        const table = tableMap.get(res.tableId);

        return (
          <div key={res.id} className="glass-pane p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-shadow hover:shadow-lg">
            <div className="flex-1 flex items-center gap-4 min-w-0 w-full sm:w-auto">
               <div className="flex flex-col items-center justify-center bg-black/5 p-3 rounded-lg w-20 flex-shrink-0">
                    <span className="font-bold text-2xl text-[var(--color-primary)]">{res.time.split(':')[0]}</span>
                    <span className="text-sm text-gray-500">:{res.time.split(':')[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-800 text-lg truncate">{res.guestName}</h3>
                    <div className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="flex items-center gap-1.5 font-medium text-gray-700">
                          <Users size={14} className="text-gray-400"/> {res.pax} {res.pax > 1 ? t.guests : t.guest}
                        </span>
                        <span className="text-gray-300 hidden xs:inline">•</span>
                        {table && table.id !== UNASSIGNED_TABLE.id ? (
                           <span className={`flex items-center gap-1.5 font-medium ${table.area === 'Indoor' ? 'text-[var(--color-primary)]' : 'text-[var(--color-accent)]'}`}>
                              <MapPin size={14}/> {table.name} ({table.area === 'Indoor' ? t.indoor : t.outdoor})
                           </span>
                        ) : (
                          <span className="flex items-center gap-1.5 font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-xs">
                            <MapPin size={14}/> {t.unassigned}
                          </span>
                        )}
                    </div>
                    {/* Mobile Comment */}
                    {res.comments && (
                      <div className="mt-2 sm:hidden text-sm text-gray-600 italic flex items-start gap-1.5 bg-black/5 p-2 rounded-md border-l-2 border-gray-300">
                        <MessageSquare size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span className="line-clamp-2">{res.comments}</span>
                      </div>
                    )}
                </div>
            </div>

            {/* Desktop Comment */}
            {res.comments && (
              <div className="hidden sm:flex flex-[2] items-start gap-2 bg-black/5 p-3 rounded-lg border-l-2 border-gray-300 mx-4 min-w-0">
                <MessageSquare size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                <p className="text-sm text-gray-600 italic line-clamp-3">{res.comments}</p>
              </div>
            )}

            <button
              onClick={() => onSelectReservation(res)}
              className="flex items-center gap-2 self-end sm:self-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 border border-gray-300/80 rounded-lg shadow-sm hover:bg-white transition-all flex-shrink-0 focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-accent)]"
            >
              <Edit size={14} />
              {t.details}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ListView;