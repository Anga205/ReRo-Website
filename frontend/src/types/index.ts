export interface User {
  email: string;
}

export interface Slot {
  id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  booked_by: string | null;
  booked_at: string | null;
}

export interface SlotsData {
  slots: Slot[];
  available_slots: number[];
  booked_slots: number[];
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BookingRequest {
  slot_id: number;
  email: string;
  password: string;
}

export interface CancellationRequest {
  slot_id: number;
  email: string;
  password: string;
}

export interface WebSocketMessage {
  type: 'book_slot' | 'cancel_slot' | 'get_slots' | 'slots_update' | 'booking_response' | 'cancellation_response' | 'error';
  slot_id?: number;
  email?: string;
  password?: string;
  data?: SlotsData;
  success?: boolean;
  message?: string;
  timestamp?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
