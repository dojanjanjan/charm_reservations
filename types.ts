
export interface Table {
  id: number;
  name: string;
  area: 'Indoor' | 'Outdoor';
  capacity: number;
}

export interface Reservation {
  id: string;
  guestName: string;
  pax: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  tableId: number;
  email?: string;
  phone?: string;
  comments?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export enum ViewMode {
  Timeline = 'Timeline',
  List = 'List',
}
