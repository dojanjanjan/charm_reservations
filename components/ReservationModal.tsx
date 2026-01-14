import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import { Reservation } from '../types';
import { useReservations } from '../hooks/useReservations';
import { INDOOR_TABLES, OUTDOOR_TABLES, OPENING_HOURS, TIME_SLOT_MINUTES, RESERVATION_DURATION_MINUTES, UNASSIGNED_TABLE } from '../constants';
import { X, Trash2 } from './Icons';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation?: Reservation;
  selectedDate: Date;
  defaultTime?: string;
  defaultTableId?: number;
}

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const formatDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, reservation, selectedDate, defaultTime, defaultTableId }) => {
  const { addReservation, updateReservation, deleteReservation } = useReservations();
  
  const [formDate, setFormDate] = useState(selectedDate);
  const [guestName, setGuestName] = useState('');
  const [pax, setPax] = useState(2);
  const [time, setTime] = useState(defaultTime || '');
  const [tableId, setTableId] = useState<number | undefined>(defaultTableId);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  const timeSlots = useMemo(() => {
    if (!formDate) return [];
    
    const dayOfWeek = formDate.getDay();
    const hours = OPENING_HOURS[dayOfWeek as keyof typeof OPENING_HOURS];
    if (!hours || hours.length === 0) return [];

    const slots: string[] = [];
  
    hours.forEach(period => {
      let currentMinutes = timeToMinutes(period.start);
      const endMinutes = timeToMinutes(period.end) - RESERVATION_DURATION_MINUTES;
  
      while (currentMinutes <= endMinutes) {
        slots.push(minutesToTime(currentMinutes));
        currentMinutes += TIME_SLOT_MINUTES;
      }
    });
  
    return slots;
  }, [formDate]);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (reservation) {
        const dateParts = reservation.date.split('-').map(Number);
        const resDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        setFormDate(resDate);
        setGuestName(reservation.guestName);
        setPax(reservation.pax);
        setTime(reservation.time);
        setTableId(reservation.tableId);
        setEmail(reservation.email || '');
        setPhone(reservation.phone || '');
        setComments(reservation.comments || '');
      } else {
        setFormDate(selectedDate);
        setGuestName('');
        setPax(2);
        setTableId(defaultTableId || UNASSIGNED_TABLE.id);
        setEmail('');
        setPhone('');
        setComments('');

        const dayOfWeek = selectedDate.getDay();
        const hours = OPENING_HOURS[dayOfWeek as keyof typeof OPENING_HOURS];
        const initialTimeSlots: string[] = [];
        if (hours) {
          hours.forEach(period => {
            let currentMinutes = timeToMinutes(period.start);
            const endMinutes = timeToMinutes(period.end) - RESERVATION_DURATION_MINUTES;
            while (currentMinutes <= endMinutes) {
              initialTimeSlots.push(minutesToTime(currentMinutes));
              currentMinutes += TIME_SLOT_MINUTES;
            }
          });
        }
        
        if (defaultTime && initialTimeSlots.includes(defaultTime)) {
          setTime(defaultTime);
        } else if (initialTimeSlots.length > 0) {
          setTime(initialTimeSlots[0]);
        } else {
          setTime('');
        }
      }
    }
  }, [reservation, isOpen, selectedDate, defaultTableId, defaultTime]);

  useEffect(() => {
    if (!isOpen) return;

    if (reservation && formatDate(formDate) === reservation.date) {
      return;
    }

    if (!timeSlots.includes(time)) {
      setTime(timeSlots.length > 0 ? timeSlots[0] : '');
    }
  }, [formDate, timeSlots, isOpen, reservation, time]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!guestName || !pax || !time || tableId === undefined || !formDate) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    
    const reservationData = {
      guestName,
      pax: Number(pax),
      date: formatDate(formDate),
      time,
      tableId: Number(tableId),
      email,
      phone,
      comments,
    };

    const result = reservation 
      ? await updateReservation({ ...reservationData, id: reservation.id }) 
      : await addReservation(reservationData);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  const handleDelete = async () => {
    if (reservation && window.confirm('Are you sure you want to delete this reservation?')) {
      await deleteReservation(reservation.id);
      onClose();
    }
  };

  if (!isOpen) return null;
  
  const inputClasses = "w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent bg-white transition-all duration-200 input-focus-glow";
  const labelClasses = "block mb-1.5 text-sm font-medium text-gray-700";
  const legendClasses = "w-full pb-2 mb-4 text-md font-semibold text-gray-800 border-b border-gray-200";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg relative animate-fade-in-up flex flex-col max-h-[95vh] sm:max-h-[90vh] shadow-2xl">
        <style>
          {`
            input[type="date"]::-webkit-calendar-picker-indicator {
              cursor: pointer;
              filter: contrast(0.5) sepia(0) saturate(1) hue-rotate(0deg) brightness(0.2);
            }
          `}
        </style>
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-bold text-[var(--color-primary)]">{reservation ? 'Edit Reservation' : 'New Reservation'}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-5 sm:p-6 space-y-6 flex-grow overflow-y-auto bg-white">
            {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-md text-sm">{error}</div>}
            
            <fieldset className="space-y-4">
              <legend className={legendClasses}>Booking Details</legend>
              <div>
                  <label htmlFor="date" className={labelClasses}>Date*</label>
                  <input 
                    type="date" 
                    id="date" 
                    value={formatDate(formDate)} 
                    min={formatDate(new Date())}
                    onChange={e => {
                      const newDate = new Date(e.target.value + 'T00:00:00');
                      setFormDate(newDate);
                    }} 
                    className={inputClasses}
                    required 
                  />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="tableId" className={labelClasses}>Table*</label>
                  <select id="tableId" value={tableId} onChange={e => setTableId(Number(e.target.value))} className={inputClasses} required>
                    <option value={UNASSIGNED_TABLE.id}>{UNASSIGNED_TABLE.name}</option>
                    <optgroup label="Indoor">
                      {INDOOR_TABLES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </optgroup>
                    <optgroup label="Outdoor">
                      {OUTDOOR_TABLES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label htmlFor="time" className={labelClasses}>Time*</label>
                  <select id="time" value={time} onChange={e => setTime(e.target.value)} className={inputClasses} required disabled={timeSlots.length === 0}>
                    {timeSlots.length > 0 ? (
                      timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)
                    ) : (
                      <option>Closed</option>
                    )}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className={legendClasses}>Guest Details</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="guestName" className={labelClasses}>Guest Name*</label>
                  <input type="text" id="guestName" value={guestName} onChange={e => setGuestName(e.target.value)} className={inputClasses} required />
                </div>
                <div>
                  <label htmlFor="pax" className={labelClasses}>Pax*</label>
                  <select id="pax" value={pax} onChange={e => setPax(Number(e.target.value))} className={inputClasses} required>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num > 1 ? 'guests' : 'guest'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="email" className={labelClasses}>Email</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClasses} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClasses}>Phone</label>
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={inputClasses} />
                  </div>
              </div>
            </fieldset>

            <fieldset>
                <legend className={legendClasses}>Additional Information</legend>
                 <div>
                    <label htmlFor="comments" className={labelClasses}>Comments</label>
                    <textarea id="comments" value={comments} onChange={e => setComments(e.target.value)} rows={3} className={inputClasses}></textarea>
                </div>
            </fieldset>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex-shrink-0">
            <div>
              {reservation && (
                <button type="button" onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 text-sm font-medium btn-gradient rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                {reservation ? 'Save Changes' : 'Create Reservation'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
