import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDashboardData, getProfile, loginUser, logoutUser } from '../services/api';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [activeWarehouseId, setActiveWarehouseId] = useState('all');
  const [dateRange, setDateRange] = useState({
    fromDate: '2026-06-01',
    toDate: '2026-06-30',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [authError, setAuthError] = useState('');

  // Global HR workers roster state
  const [workers, setWorkers] = useState([
    { id: 'WRK-01', name: 'Suresh Gowda', type: 'Daily-Waged', section: 'Sorting', wage: 450, mobile: '98765 43210' },
    { id: 'WRK-02', name: 'Haran Das', type: 'Seasonal', section: 'Weighbridge', wage: 550, mobile: '87654 32109' },
    { id: 'WRK-03', name: 'Raju Naik', type: 'Daily-Waged', section: 'Silo 2', wage: 450, mobile: '76543 21098' },
    { id: 'WRK-04', name: 'Shivam Pal', type: 'Seasonal', section: 'Packing', wage: 500, mobile: '65432 10987' },
    { id: 'WRK-05', name: 'Baldev Singh', type: 'Seasonal', section: 'Boiler Line', wage: 600, mobile: '54321 09876' },
    { id: 'WRK-06', name: 'Devendra Prasad', type: 'Daily-Waged', section: 'Warehouse 1', wage: 480, mobile: '98701 23456' },
  ]);

  // Global attendance roster logs
  const [attendanceHistory, setAttendanceHistory] = useState([
    {
      date: '2026-06-15',
      shift: 'Shift A',
      records: {
        'WRK-01': { status: 'Present', ot: 2 },
        'WRK-02': { status: 'Present', ot: 0 },
        'WRK-03': { status: 'Absent', ot: 0 },
        'WRK-04': { status: 'Half-Day', ot: 0 },
        'WRK-05': { status: 'Present', ot: 1 },
        'WRK-06': { status: 'Present', ot: 3 },
      }
    },
    {
      date: '2026-06-14',
      shift: 'Shift A',
      records: {
        'WRK-01': { status: 'Present', ot: 1 },
        'WRK-02': { status: 'Present', ot: 0 },
        'WRK-03': { status: 'Present', ot: 0 },
        'WRK-04': { status: 'Present', ot: 2 },
        'WRK-05': { status: 'Absent', ot: 0 },
        'WRK-06': { status: 'Half-Day', ot: 0 },
      }
    }
  ]);

  // Global salary disbursements tracking
  const [disbursedWages, setDisbursedWages] = useState({});

  const addWorker = (newWorker) => {
    setWorkers(prev => [...prev, newWorker]);
  };

  const saveAttendance = (date, shift, records) => {
    setAttendanceHistory(prev => {
      // Overwrite if entry for date & shift already exists, else append
      const filtered = prev.filter(r => !(r.date === date && r.shift === shift));
      return [...filtered, { date, shift, records }];
    });
  };

  const disburseWage = (workerId, amount) => {
    setDisbursedWages(prev => ({
      ...prev,
      [workerId]: { status: 'Paid', date: new Date().toISOString().split('T')[0], amount }
    }));
  };

  const syncDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    }
  };

  const login = async (username, password) => {
    try {
      setAuthError('');
      const response = await loginUser(username, password);
      const token = response?.token;
      const currentUser = response?.user;

      if (token) {
        localStorage.setItem('erp_token', token);
      }

      setUser(currentUser || null);
      setIsAuthenticated(true);
      await syncDashboard();
      return true;
    } catch (error) {
      setAuthError(error.message || 'Login failed');
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('erp_token');
      setIsAuthenticated(false);
      setUser(null);
      setDashboardData(null);
    }
  };

  // Mock list of warehouses/silos for global filter selector
  const warehouses = [
    { id: 'all', name: 'All Warehouses & Silos' },
    { id: 'silo-1', name: 'Silo A - Premium Basmati' },
    { id: 'silo-2', name: 'Silo B - Non-Basmati Raw' },
    { id: 'warehouse-1', name: 'Warehouse 1 - Finished Goods' },
    { id: 'warehouse-2', name: 'Warehouse 2 - Broken Rice & Husk' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('erp_token');
    if (!token) return;

    const bootstrap = async () => {
      try {
        const profile = await getProfile();
        setUser(profile?.user || null);
        setIsAuthenticated(true);
        await syncDashboard();
      } catch (error) {
        localStorage.removeItem('erp_token');
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    bootstrap();
  }, []);

  return (
    <AppContext.Provider value={{
      activeWarehouseId,
      setActiveWarehouseId,
      dateRange,
      setDateRange,
      warehouses,
      isAuthenticated,
      login,
      logout,
      workers,
      addWorker,
      attendanceHistory,
      saveAttendance,
      disbursedWages,
      disburseWage,
      user,
      dashboardData,
      authError,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
