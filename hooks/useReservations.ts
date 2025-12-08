import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { Reservation, Table } from '../types';
import { RESERVATION_DURATION_MINUTES, ALL_TABLES, OPENING_HOURS, TIME_SLOT_MINUTES, UNASSIGNED_TABLE } from '../constants';

// --- Helper Functions ---
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const STORAGE_KEY = 'charmThaiReservations';

// --- Context Definition ---
interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, 'id'>) => { success: boolean; message: string };
  updateReservation: (res: Reservation) => { success: boolean; message: string };
  deleteReservation: (id: string) => void;
  getReservationsForDate: (date: string) => Reservation[];
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
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const storedReservations = window.localStorage.getItem(STORAGE_KEY);
      return storedReservations ? JSON.parse(storedReservations) : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  // Persist to localStorage whenever reservations change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [reservations]);
  
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
  const addReservation = useCallback((res: Omit<Reservation, 'id'>) => {
    if (isConflict(res)) {
      return { success: false, message: 'This table is already booked for the selected time slot.' };
    }
    const newReservation: Reservation = { ...res, id: new Date().toISOString() };
    setReservations(prev => [...prev, newReservation]);
    return { success: true, message: 'Reservation created.' };
  }, [isConflict]);

  const updateReservation = useCallback((res: Reservation) => {
    if (isConflict(res)) {
      return { success: false, message: 'This table is already booked for the selected time slot.' };
    }
    setReservations(prev => prev.map(r => (r.id === res.id ? res : r)));
    return { success: true, message: 'Reservation updated.' };
  }, [isConflict]);

  const deleteReservation = useCallback((id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  }, []);
  
  // --- Data Getter ---
  const getReservationsForDate = useCallback((date: string) => {
    return reservations.filter(res => res.date === date);
  }, [reservations]);
  
  // --- Memoized Context Value ---
  return useMemo(() => ({
    reservations,
    addReservation,
    updateReservation,
    deleteReservation,
    getReservationsForDate,
  }), [reservations, addReservation, updateReservation, deleteReservation, getReservationsForDate]);
};