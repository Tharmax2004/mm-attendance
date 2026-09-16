export type AttendanceStatus = 'P' | 'OT' | 'A';

export interface Employee {
  id: string;
  name: string;
  role?: string;
  department?: string;
  phone?: string;
  avatarColor?: string;
}

export interface DayShiftLog {
  date: string; // YYYY-MM-DD
  shift: string; // e.g. "09:00 am - 06:00 pm"
  records: Record<string, AttendanceStatus[]>; // employeeId -> array of statuses e.g. ['P', 'OT']
  lastUpdated: string;
}

export type ActiveTab = 'attendance' | 'employees' | 'reports';
export type ReportPeriod = 'daily' | 'monthly' | 'yearly';

export interface EmployeeReportItem {
  employeeId: string;
  name: string;
  role?: string;
  department?: string;
  avatarColor?: string;
  presentDays: number;
  otDays: number;
  absentDays: number;
  recordedDays: number;
  attendancePercentage: number;
}

export const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; full: string; color: string; activeBg: string; border: string; text: string }
> = {
  P: {
    label: 'P',
    full: 'Present',
    color: 'emerald',
    activeBg: 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200 ring-2 ring-emerald-400/30',
    border: 'border-emerald-300',
    text: 'text-emerald-700'
  },
  OT: {
    label: 'OT',
    full: 'Over time',
    color: 'amber',
    activeBg: 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200 ring-2 ring-amber-400/30',
    border: 'border-amber-300',
    text: 'text-amber-700'
  },
  A: {
    label: 'A',
    full: 'Absent',
    color: 'rose',
    activeBg: 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-200 ring-2 ring-rose-400/30',
    border: 'border-rose-300',
    text: 'text-rose-700'
  }
};
