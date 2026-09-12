export type AttendanceStatus = 'P' | 'A' | 'L' | 'E';

export interface Employee {
  id: string;
  name: string;
  role?: string;
  department?: string;
  phone?: string;
  avatarColor?: string;
}

export interface AttendanceRecord {
  employeeId: string;
  status: AttendanceStatus;
  markedAt?: string;
  note?: string;
}

export interface DayShiftLog {
  date: string; // YYYY-MM-DD
  shift: string; // e.g. "12:00 pm"
  records: Record<string, AttendanceStatus>; // employeeId -> status
  lastUpdated: string;
}

export type ActiveTab = 'attendance' | 'employees' | 'analytics';

export const STATUS_CONFIG: Record<AttendanceStatus, { label: string; full: string; color: string; activeBg: string; border: string; text: string }> = {
  P: {
    label: 'P',
    full: 'Present',
    color: 'emerald',
    activeBg: 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200',
    border: 'border-emerald-300',
    text: 'text-emerald-700'
  },
  A: {
    label: 'A',
    full: 'Absent',
    color: 'rose',
    activeBg: 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-200',
    border: 'border-rose-300',
    text: 'text-rose-700'
  },
  L: {
    label: 'L',
    full: 'Leave',
    color: 'amber',
    activeBg: 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200',
    border: 'border-amber-300',
    text: 'text-amber-700'
  },
  E: {
    label: 'E',
    full: 'Excused',
    color: 'indigo',
    activeBg: 'bg-indigo-500 text-white border-indigo-600 shadow-sm shadow-indigo-200',
    border: 'border-indigo-300',
    text: 'text-indigo-700'
  }
};
