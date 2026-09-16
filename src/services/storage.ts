import type { Employee, AttendanceStatus, DayShiftLog, EmployeeReportItem } from '../types/attendance';

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

// Normalize raw record into AttendanceStatus[]
const normalizeRecords = (records: Record<string, unknown>): Record<string, AttendanceStatus[]> => {
  const normalized: Record<string, AttendanceStatus[]> = {};
  for (const [empId, val] of Object.entries(records || {})) {
    if (Array.isArray(val)) {
      normalized[empId] = val.filter((item): item is AttendanceStatus => item === 'P' || item === 'OT' || item === 'A');
    } else if (typeof val === 'string') {
      if (val === 'P' || val === 'OT' || val === 'A') {
        normalized[empId] = [val];
      }
    }
  }
  return normalized;
};

export const getAllLogs = (): Record<string, DayShiftLog> => {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const normalizedLogs: Record<string, DayShiftLog> = {};
    for (const [key, log] of Object.entries(parsed as Record<string, DayShiftLog>)) {
      normalizedLogs[key] = {
        ...log,
        records: normalizeRecords(log.records)
      };
    }
    return normalizedLogs;
  } catch (e) {
    console.error('Failed to load attendance logs', e);
    return {};
  }
};

export const getLogKey = (date: string, shift: string) => `${date}__${shift.replace(/\s+/g, '_').toLowerCase()}`;

export const getAttendanceLog = (date: string, shift: string): Record<string, AttendanceStatus[]> => {
  const all = getAllLogs();
  const key = getLogKey(date, shift);
  return all[key]?.records || {};
};

export const saveAttendanceLog = (
  date: string,
  shift: string,
  records: Record<string, AttendanceStatus[]>
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

// Compute Monthly Report across all days in YYYY-MM
export const getMonthlyReport = (
  year: number,
  month: number, // 1-12
  employees: Employee[]
): { daysRecorded: number; items: EmployeeReportItem[] } => {
  const allLogs = getAllLogs();
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;

  const matchingLogs = Object.values(allLogs).filter((log) => log.date.startsWith(monthPrefix));
  const uniqueDates = new Set(matchingLogs.map((l) => l.date));
  const daysRecorded = uniqueDates.size;

  const items: EmployeeReportItem[] = employees.map((emp) => {
    let presentDays = 0;
    let otDays = 0;
    let absentDays = 0;

    matchingLogs.forEach((log) => {
      const statuses = log.records[emp.id] || [];
      if (statuses.includes('P')) presentDays++;
      if (statuses.includes('OT')) otDays++;
      if (statuses.includes('A')) absentDays++;
    });

    const attendancePercentage = daysRecorded > 0 ? Math.round((presentDays / daysRecorded) * 100) : 0;

    return {
      employeeId: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      avatarColor: emp.avatarColor,
      presentDays,
      otDays,
      absentDays,
      recordedDays: daysRecorded,
      attendancePercentage
    };
  });

  return { daysRecorded, items };
};

// Compute Yearly Report across all days in YYYY
export const getYearlyReport = (
  year: number,
  employees: Employee[]
): { daysRecorded: number; items: EmployeeReportItem[] } => {
  const allLogs = getAllLogs();
  const yearPrefix = `${year}-`;

  const matchingLogs = Object.values(allLogs).filter((log) => log.date.startsWith(yearPrefix));
  const uniqueDates = new Set(matchingLogs.map((l) => l.date));
  const daysRecorded = uniqueDates.size;

  const items: EmployeeReportItem[] = employees.map((emp) => {
    let presentDays = 0;
    let otDays = 0;
    let absentDays = 0;

    matchingLogs.forEach((log) => {
      const statuses = log.records[emp.id] || [];
      if (statuses.includes('P')) presentDays++;
      if (statuses.includes('OT')) otDays++;
      if (statuses.includes('A')) absentDays++;
    });

    const attendancePercentage = daysRecorded > 0 ? Math.round((presentDays / daysRecorded) * 100) : 0;

    return {
      employeeId: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      avatarColor: emp.avatarColor,
      presentDays,
      otDays,
      absentDays,
      recordedDays: daysRecorded,
      attendancePercentage
    };
  });

  return { daysRecorded, items };
};

// Download Daily CSV
export const downloadCSV = (
  date: string,
  shift: string,
  employees: Employee[],
  records: Record<string, AttendanceStatus[]>
) => {
  const headers = ['Employee ID', 'Employee Name', 'Department', 'Role', 'Status', 'Date', 'Shift'];
  const rows = employees.map((emp) => {
    const statuses = records[emp.id] || [];
    const statusLabel = statuses.length > 0 ? statuses.join(' + ') : 'Not Marked';
    return [
      `"${emp.id}"`,
      `"${emp.name}"`,
      `"${emp.department || ''}"`,
      `"${emp.role || ''}"`,
      `"${statusLabel}"`,
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

// Download Monthly Report CSV
export const downloadMonthlyCSV = (
  year: number,
  month: number,
  items: EmployeeReportItem[]
) => {
  const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
  const headers = ['Employee ID', 'Employee Name', 'Department', 'Role', 'Present (P) Days', 'Over time (OT) Days', 'Absent (A) Days', 'Recorded Days', 'Turnout %', 'Month', 'Year'];
  const rows = items.map((item) => [
    `"${item.employeeId}"`,
    `"${item.name}"`,
    `"${item.department || ''}"`,
    `"${item.role || ''}"`,
    item.presentDays,
    item.otDays,
    item.absentDays,
    item.recordedDays,
    `"${item.attendancePercentage}%"`,
    `"${monthName}"`,
    year
  ].join(','));

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `attendance_monthly_${year}_${String(month).padStart(2, '0')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Download Yearly Report CSV
export const downloadYearlyCSV = (
  year: number,
  items: EmployeeReportItem[]
) => {
  const headers = ['Employee ID', 'Employee Name', 'Department', 'Role', 'Total Present Days', 'Total Over time Days', 'Total Absent Days', 'Total Recorded Days', 'Turnout %', 'Year'];
  const rows = items.map((item) => [
    `"${item.employeeId}"`,
    `"${item.name}"`,
    `"${item.department || ''}"`,
    `"${item.role || ''}"`,
    item.presentDays,
    item.otDays,
    item.absentDays,
    item.recordedDays,
    `"${item.attendancePercentage}%"`,
    year
  ].join(','));

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `attendance_yearly_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
