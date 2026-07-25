export type ShiftType = 'MORNING' | 'AFTERNOON';

export type ShiftStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OFF';

export type DepartmentCategory = 'VACCINATION' | 'GENERAL_EXAM' | 'SURGERY';

export type ScheduleViewMode = 'SHIFT_GRID' | 'DOCTOR_ROSTER' | 'HOURLY_TIMELINE';

export interface DoctorScheduleInfo {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  specialization: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'ON_LEAVE';
  assignedRoom?: string;
}

export interface ShiftAppointmentInfo {
  id: string;
  petName: string;
  species: string;
  ownerName: string;
  ownerPhone: string;
  serviceName: string;
  timeSlot: string;
  status: 'CHECKED_IN' | 'WAITING' | 'DONE';
}

export interface DoctorShift {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar?: string;
  doctorTitle: string;
  doctorSpecialization: string;
  date: string; // YYYY-MM-DD
  shiftType: ShiftType;
  startTime: string; // e.g. "07:30"
  endTime: string; // e.g. "11:30"
  roomCode: string;
  roomName: string;
  department: DepartmentCategory;
  maxCapacity: number;
  bookedCount: number;
  status: ShiftStatus;
  notes?: string;
  appointments?: ShiftAppointmentInfo[];
}

export interface ScheduleFilters {
  date: string; // YYYY-MM-DD
  search?: string;
  shiftType?: ShiftType;
  department?: DepartmentCategory;
  status?: ShiftStatus;
  viewMode: ScheduleViewMode;
}

export interface ScheduleOverview {
  totalScheduledToday: number;
  morningCount: number;
  afternoonCount: number;
  totalCapacity: number;
  bookedCapacity: number;
  activeVetsCount: number;
}
