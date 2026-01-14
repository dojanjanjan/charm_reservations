import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Reservation, Table } from '../types';
import { RESERVATION_DURATION_MINUTES, ALL_TABLES, OPENING_HOURS, TIME_SLOT_MINUTES, UNASSIGNED_TABLE } from '../constants';
import { supabase } from '../supabase';

// --- Helper Functions ---
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const TABLE_NAME = 'reservations_charm_thai';

// --- Context Definition ---
interface ReservationContextType {
  reservations: Reservation[];
  loading: boolean;
  addReservation: (res: Omit<Reservation, 'id'>) => Promise<{ success: boolean; message: string }>;
  updateReservation: (res: Reservation) => Promise<{ success: boolean; message: string }>;
  deleteReservation: (id: string) => Promise<void>;
  getReservationsForDate: (date: string) => Reservation[];
  refreshReservations: () => Promise<void>;
}

export const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservations = (): ReservationContextType => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};

// --- State Management Hook ---
export const useReservationState = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*');

      if (error) throw error;

      const mappedReservations: Reservation[] = (data || []).map(row => {
        // Ensure the date is treated as a local date string YYYY-MM-DD
        // Supabase returns 'YYYY-MM-DD' for date columns, which is what we want.
        return {
          id: row.id,
          guestName: row.name || '',
          pax: parseInt(row.guests || '2'),
          date: row.date,
          time: row.time || '',
          tableId: parseInt(row.table_number || '0'),
          email: row.email || '',
          phone: row.phone || '',
          comments: row.comment || ''
        };
      });

      setReservations(mappedReservations);
    } catch (error) {
      console.error("Error fetching reservations from Supabase", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);
  
  // --- Conflict Checking Logic ---
  const isConflict = useCallback((reservationToCheck: Reservation | Omit<Reservation, 'id'>) => {
    if (reservationToCheck.tableId === UNASSIGNED_TABLE.id) {
        return false;
    }
    const checkStart = timeToMinutes(reservationToCheck.time);
    const checkEnd = checkStart + RESERVATION_DURATION_MINUTES;

    return reservations.some(existingRes => {
        // If updating, ignore conflict with self
        if ('id' in reservationToCheck && existingRes.id === reservationToCheck.id) {
            return false;
        }
        if (existingRes.tableId !== reservationToCheck.tableId || existingRes.date !== reservationToCheck.date) {
            return false;
        }

        const existingStart = timeToMinutes(existingRes.time);
        const existingEnd = existingStart + RESERVATION_DURATION_MINUTES;
        
        // Check for overlap
        return checkStart < existingEnd && checkEnd > existingStart;
    });
  }, [reservations]);

  // --- Core Actions ---
  const addReservation = useCallback(async (res: Omit<Reservation, 'id'>) => {
    if (isConflict(res)) {
      return { success: false, message: 'This table is already booked for the selected time slot.' };
    }

    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([{
          name: res.guestName,
          guests: res.pax.toString(),
          date: res.date,
          time: res.time,
          table_number: res.tableId.toString(),
          email: res.email,
          phone: res.phone,
          comment: res.comments,
          status: 'confirmed'
        }])
        .select()
        .single();

      if (error) throw error;

      const newRes: Reservation = {
        id: data.id,
        guestName: data.name,
        pax: parseInt(data.guests),
        date: data.date,
        time: data.time,
        tableId: parseInt(data.table_number),
        email: data.email,
        phone: data.phone,
        comments: data.comment
      };

      setReservations(prev => [...prev, newRes]);
      return { success: true, message: 'Reservation created.' };
    } catch (error: any) {
      console.error("Error adding reservation", error);
      return { success: false, message: error.message || 'Error creating reservation.' };
    }
  }, [isConflict]);

  const updateReservation = useCallback(async (res: Reservation) => {
    if (isConflict(res)) {
      return { success: false, message: 'This table is already booked for the selected time slot.' };
    }

    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({
          name: res.guestName,
          guests: res.pax.toString(),
          date: res.date,
          time: res.time,
          table_number: res.tableId.toString(),
          email: res.email,
          phone: res.phone,
          comment: res.comments
        })
        .eq('id', res.id);

      if (error) throw error;

      setReservations(prev => prev.map(r => (r.id === res.id ? res : r)));
      return { success: true, message: 'Reservation updated.' };
    } catch (error: any) {
      console.error("Error updating reservation", error);
      return { success: false, message: error.message || 'Error updating reservation.' };
    }
  }, [isConflict]);

  const deleteReservation = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting reservation", error);
    }
  }, []);
  
  // --- Data Getter ---
  const getReservationsForDate = useCallback((date: string) => {
    return reservations.filter(res => res.date === date);
  }, [reservations]);
  
  // --- Memoized Context Value ---
  return useMemo(() => ({
    reservations,
    loading,
    addReservation,
    updateReservation,
    deleteReservation,
    getReservationsForDate,
    refreshReservations: fetchReservations
  }), [reservations, loading, addReservation, updateReservation, deleteReservation, getReservationsForDate, fetchReservations]);
};
