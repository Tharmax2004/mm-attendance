import type { Employee, AttendanceStatus, DayShiftLog } from '../types/attendance';

const EMPLOYEES_STORAGE_KEY = 'mm_attendance_employees_v1';
const ATTENDANCE_STORAGE_KEY = 'mm_attendance_records_v1';

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'employee name 1', role: 'Team Lead', department: 'Operations', avatarColor: '#3b82f6' },
  { id: 'emp-2', name: 'employee name 2', role: 'Senior Specialist', department: 'Operations', avatarColor: '#10b981' },
  { id: 'emp-3', name: 'employee name 3', role: 'Staff Associate', department: 'Logistics', avatarColor: '#f59e0b' },
  { id: 'emp-4', name: 'employee name 4', role: 'Coordinator', department: 'Customer Service', avatarColor: '#ec4899' },
  { id: 'emp-5', name: 'employee name 5', role: 'Officer', department: 'Management', avatarColor: '#8b5cf6' },
  { id: 'emp-6', name: 'employee name 6', role: 'Technician', department: 'Field Support', avatarColor: '#06b6d4' },
  { id: 'emp-7', name: 'employee name 7', role: 'Analyst', department: 'Quality Assurance', avatarColor: '#14b8a6' },
  { id: 'emp-8', name: 'employee name 8', role: 'Executive', department: 'Administration', avatarColor: '#f97316' },
];

export const getStoredEmployees = (): Employee[] => {
  try {
    const raw = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load employees from localStorage', e);
    return INITIAL_EMPLOYEES;
  }
};

export const saveStoredEmployees = (employees: Employee[]): void => {
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error('Failed to save employees to localStorage', e);
  }
};

export const getAllLogs = (): Record<string, DayShiftLog> => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to load attendance logs', e);
    return {};
  }
};

export const getLogKey = (date: string, shift: string) => `${date}__${shift.replace(/\s+/g, '_').toLowerCase()}`;

export const getAttendanceLog = (date: string, shift: string): Record<string, AttendanceStatus> => {
  const all = getAllLogs();
  const key = getLogKey(date, shift);
  return all[key]?.records || {};
};

export const saveAttendanceLog = (
  date: string,
  shift: string,
  records: Record<string, AttendanceStatus>
): void => {
  try {
    const all = getAllLogs();
    const key = getLogKey(date, shift);
    all[key] = {
      date,
      shift,
      records,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save attendance log', e);
  }
};

export const downloadCSV = (
  date: string,
  shift: string,
  employees: Employee[],
  records: Record<string, AttendanceStatus>
) => {
  const headers = ['Employee ID', 'Employee Name', 'Department', 'Role', 'Status', 'Date', 'Shift'];
  const rows = employees.map(emp => {
    const status = records[emp.id] || 'Not Marked';
    const statusNames: Record<string, string> = {
      P: 'Present',
      A: 'Absent',
      L: 'Leave',
      E: 'Excused'
    };
    return [
      `"${emp.id}"`,
      `"${emp.name}"`,
      `"${emp.department || ''}"`,
      `"${emp.role || ''}"`,
      `"${statusNames[status] || status}"`,
      `"${date}"`,
      `"${shift}"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `attendance_${date}_${shift.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
