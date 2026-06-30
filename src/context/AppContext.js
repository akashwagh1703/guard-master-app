import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api, setToken, getToken, unwrapList, downloadFile } from '../services/api';

const AppContext = createContext(null);

const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function mapProfile(user) {
  const g = user?.guard || {};
  return {
    id: g.id || user?.guard_id,
    employeeId: g.employee_id || user?.guard?.employee_id,
    name: user?.name || g.name,
    mobile: user?.phone || '',
    email: user?.email || '',
    joiningDate: g.joining_date || '',
    emergencyContact: user?.phone || '—',
    photo: user?.photo,
  };
}

function mapAssignment(a) {
  if (!a) return null;
  return {
    site: a.site || '',
    siteLat: a.site_lat || 0,
    siteLng: a.site_lng || 0,
    radius: a.radius || 100,
    shift: a.shift || '',
    shiftStart: a.shift_start ? String(a.shift_start).slice(0, 5) : '',
    shiftEnd: a.shift_end ? String(a.shift_end).slice(0, 5) : '',
  };
}

function mapAttendance(a) {
  return {
    id: a.id,
    date: a.date,
    site: a.site?.name || '',
    shift: a.shift?.name || '',
    checkIn: a.check_in_time ? String(a.check_in_time).slice(0, 5) : '-',
    checkOut: a.check_out_time ? String(a.check_out_time).slice(0, 5) : null,
    hours: a.working_hours ?? '-',
    late: (a.late_minutes ?? 0) > 0,
    status: a.status,
  };
}

function mapVisitor(v) {
  return {
    id: v.id,
    name: v.visitor_name,
    mobile: v.mobile || '',
    purpose: v.purpose || '',
    personToMeet: v.person_to_meet || '',
    vehicle: v.vehicle_number || '',
    idType: v.id_type || '',
    idNumber: v.id_number || '',
    entryTime: v.entry_time ? new Date(v.entry_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '-',
    exitTime: v.exit_time ? new Date(v.exit_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null,
    status: v.status,
    remarks: v.remarks || '',
  };
}

function mapIncident(i) {
  return {
    id: i.id,
    ticket: `INC-${new Date(i.incident_time || i.created_at).getFullYear()}-${String(i.id).padStart(4, '0')}`,
    type: i.category || i.title,
    description: i.description,
    date: i.incident_time ? i.incident_time.slice(0, 10) : '',
    time: i.incident_time ? new Date(i.incident_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
    status: i.status,
  };
}

function mapPayroll(p) {
  return {
    id: p.id,
    month: `${months[p.month] || p.month} ${p.year}`,
    baseSalary: parseFloat(p.base_salary) || 0,
    overtime: parseFloat(p.overtime_amount) || 0,
    bonus: parseFloat(p.bonus) || 0,
    deduction: parseFloat(p.deduction) || 0,
    netSalary: parseFloat(p.net_salary) || 0,
    status: p.status,
  };
}

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));
  const [guard, setGuard] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [duty, setDuty] = useState({
    checkedIn: false,
    checkInTime: null,
    checkOutTime: null,
    workingSeconds: 0,
    gpsStatus: 'active',
    lat: 0,
    lng: 0,
  });
  const [visitors, setVisitors] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(false);

  const applyProfile = useCallback((user) => {
    setGuard(mapProfile(user));
    const a = mapAssignment(user?.assignment);
    setAssignment(a || { site: 'No assignment', siteLat: 0, siteLng: 0, radius: 100, shift: '-', shiftStart: '', shiftEnd: '' });
    if (a) {
      setDuty((d) => ({ ...d, lat: a.siteLat, lng: a.siteLng }));
    }
  }, []);

  const loadSession = useCallback(async () => {
    if (!getToken()) return;
    setLoading(true);
    try {
      const profile = await api('/profile');
      applyProfile(profile.data);
      setIsLoggedIn(true);

      const [attR, leaveR, notifR, visR, incR, payR] = await Promise.allSettled([
        api('/my-attendance?per_page=20'),
        api('/my-leave-requests?per_page=20'),
        api('/my-notifications?per_page=20'),
        api('/my-visitors?per_page=50'),
        api('/my-incidents?per_page=20'),
        api('/my-payroll?per_page=12'),
      ]);

      if (attR.status === 'fulfilled') {
        const rows = unwrapList(attR.value).map(mapAttendance);
        setAttendance(rows);
        const today = rows.find((r) => r.date === new Date().toISOString().slice(0, 10));
        if (today?.checkIn && today.checkIn !== '-') {
          setDuty((d) => ({
            ...d,
            checkedIn: !today.checkOut || today.checkOut === '-',
            checkInTime: today.checkIn,
            checkOutTime: today.checkOut && today.checkOut !== '-' ? today.checkOut : null,
          }));
        }
      }

      if (leaveR.status === 'fulfilled') {
        setLeaveRequests(unwrapList(leaveR.value).map((l) => ({
          id: l.id,
          type: l.type,
          from: l.from_date,
          to: l.to_date,
          reason: l.reason,
          status: l.status,
          appliedOn: l.created_at?.slice(0, 10) || '',
        })));
      }

      if (notifR.status === 'fulfilled') {
        setNotifications(unwrapList(notifR.value).map((n) => ({
          id: n.id,
          category: n.category,
          title: n.title,
          message: n.message,
          time: n.created_at,
          read: n.read,
        })));
      }

      if (visR.status === 'fulfilled') {
        setVisitors(unwrapList(visR.value).map(mapVisitor));
      }

      if (incR.status === 'fulfilled') {
        setIncidents(unwrapList(incR.value).map(mapIncident));
      }

      if (payR.status === 'fulfilled') {
        setPayroll(unwrapList(payR.value).map(mapPayroll));
      }
    } catch {
      setToken(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, [applyProfile]);

  useEffect(() => {
    if (getToken()) loadSession();
  }, [loadSession]);

  const login = async (username, password) => {
    const res = await api('/login', {
      method: 'POST',
      body: { identifier: username, password, device_name: 'guard-app' },
    });
    setToken(res.data.token);
    applyProfile(res.data.user);
    setIsLoggedIn(true);
    await loadSession();
    return res.data;
  };

  const logout = async () => {
    try { await api('/logout', { method: 'POST' }); } catch { /* ignore */ }
    setToken(null);
    setIsLoggedIn(false);
    setGuard(null);
    setAssignment(null);
    setVisitors([]);
    setIncidents([]);
    setPayroll([]);
  };

  const updateProfile = async (values) => {
    const res = await api('/profile', {
      method: 'PUT',
      body: {
        name: guard?.name,
        email: values.email,
        phone: values.mobile,
      },
    });
    applyProfile(res.data);
    return res.data;
  };

  const changePassword = async (currentPassword, password, passwordConfirmation) => {
    await api('/change-password', {
      method: 'PUT',
      body: {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      },
    });
  };

  const checkIn = useCallback(async (latitude, longitude) => {
    const res = await api('/check-in', {
      method: 'POST',
      body: { latitude, longitude },
    });
    const row = mapAttendance(res.data);
    setDuty((d) => ({
      ...d,
      checkedIn: true,
      checkInTime: row.checkIn,
      checkOutTime: null,
    }));
    setAttendance((prev) => [row, ...prev.filter((a) => a.date !== row.date)]);
    return row;
  }, []);

  const checkOut = useCallback(async (latitude, longitude) => {
    const res = await api('/check-out', {
      method: 'POST',
      body: { latitude, longitude },
    });
    const row = mapAttendance(res.data);
    setDuty((d) => ({
      ...d,
      checkedIn: false,
      checkOutTime: row.checkOut,
    }));
    setAttendance((prev) => prev.map((a) => (a.date === row.date ? row : a)));
    return row;
  }, []);

  const addVisitor = useCallback(async (v) => {
    const res = await api('/visitor-entries', {
      method: 'POST',
      body: {
        visitor_name: v.name,
        mobile: v.mobile,
        purpose: v.purpose,
        person_to_meet: v.personToMeet,
        vehicle_number: v.vehicle || null,
        id_type: v.idType || null,
        id_number: v.idNumber || null,
        remarks: v.remarks || null,
      },
    });
    const item = mapVisitor(res.data);
    setVisitors((prev) => [item, ...prev]);
    return item;
  }, []);

  const markVisitorExit = useCallback(async (id) => {
    const res = await api(`/visitor-entries/${id}/exit`, { method: 'PUT', body: {} });
    const item = mapVisitor(res.data);
    setVisitors((prev) => prev.map((v) => (v.id === id ? item : v)));
    return item;
  }, []);

  const addIncident = useCallback(async (inc) => {
    const res = await api('/report-incident', {
      method: 'POST',
      body: {
        category: inc.type,
        description: inc.description,
        latitude: inc.latitude,
        longitude: inc.longitude,
      },
    });
    const item = mapIncident(res.data);
    setIncidents((prev) => [item, ...prev]);
    return item.ticket;
  }, []);

  const addLeave = useCallback(async (leave) => {
    const res = await api('/leave-requests', {
      method: 'POST',
      body: {
        type: leave.type,
        from_date: leave.from,
        to_date: leave.to,
        reason: leave.reason,
      },
    });
    const item = {
      id: res.data.id,
      type: res.data.type,
      from: res.data.from_date,
      to: res.data.to_date,
      reason: res.data.reason,
      status: res.data.status,
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [item, ...prev]);
    return item;
  }, []);

  const downloadPayslip = useCallback(async (payrollId) => {
    await downloadFile(`/my-payroll/${payrollId}/payslip`, `payslip-${payrollId}.pdf`);
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    try {
      await api(`/my-notifications/${id}/read`, { method: 'PUT' });
    } catch { /* ignore */ }
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      await api(`/my-notifications/${id}`, { method: 'DELETE' });
    } catch { /* ignore */ }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const currentSalary = payroll[0] || null;
  const salaryHistory = payroll.slice(1);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const todayVisitors = visitors.filter((v) => v.status === 'inside').length;
  const todayIncidents = incidents.filter((i) => i.date === new Date().toISOString().split('T')[0]).length;

  return (
    <AppContext.Provider value={{
      isLoggedIn, guard, assignment, duty, loading,
      login, logout, loadSession, updateProfile, changePassword,
      checkIn, checkOut,
      visitors, addVisitor, markVisitorExit,
      incidents, addIncident,
      leaveRequests, addLeave,
      notifications, markNotificationRead, deleteNotification,
      attendance, payroll, currentSalary, salaryHistory, downloadPayslip,
      unreadCount, todayVisitors, todayIncidents,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
