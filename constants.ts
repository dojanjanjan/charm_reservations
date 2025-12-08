import { Table } from './types';

export const UNASSIGNED_TABLE: Table = {
  id: 0,
  name: 'Unassigned',
  area: 'Indoor', // Area is nominal for this special type
  capacity: 0,
};

export const INDOOR_TABLES: Table[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  area: 'Indoor',
  capacity: 4,
}));

export const OUTDOOR_TABLES: Table[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 11,
  name: `Table ${i + 11}`,
  area: 'Outdoor',
  capacity: 6,
}));

export const ALL_TABLES: Table[] = [UNASSIGNED_TABLE, ...INDOOR_TABLES, ...OUTDOOR_TABLES];

export const OPENING_HOURS = {
  // 0: Sunday, 1: Monday, ..., 6: Saturday
  0: [{ start: '11:00', end: '22:00' }], // Sun
  1: [{ start: '11:00', end: '22:00' }], // Mon - Ruhetag
  2: [{ start: '11:00', end: '16:00' }, { start: '17:00', end: '22:00' }], // Tue
  3: [{ start: '11:00', end: '16:00' }, { start: '17:00', end: '22:00' }], // Wed
  4: [{ start: '11:00', end: '16:00' }, { start: '17:00', end: '22:00' }], // Thu
  5: [{ start: '11:00', end: '16:00' }, { start: '17:00', end: '22:00' }], // Fri
  6: [{ start: '11:00', end: '22:00' }], // Sat
};

export const TIME_SLOT_MINUTES = 30;
export const RESERVATION_DURATION_MINUTES = 120;