import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import DashboardLayout from './layouts/DashboardLayout';

// Page imports
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PaddyEntry from './pages/PaddyEntry';
import Production from './pages/Production';
import Warehouse from './pages/Warehouse';
import Reports from './pages/Reports';
import Supplier from './pages/Supplier';
import Buyer from './pages/Buyer';
import Payment from './pages/Payment';
import Ledger from './pages/Ledger';
import Worker from './pages/Worker';
import Attendance from './pages/Attendance';
import Salary from './pages/Salary';
import Infrastructure from './pages/Infrastructure';
import Profile from './pages/Profile';

function AppContent() {
  const { isAuthenticated } = useApp();

  // Route Guard: If not authenticated, force LoginPage view
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Once authenticated, render standard App shell layout with routing
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/paddy-entry" element={<PaddyEntry />} />
          <Route path="/production" element={<Production />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/buyer" element={<Buyer />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/worker" element={<Worker />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/spare-parts" element={<Infrastructure />} />
          <Route path="/maintenance" element={<Infrastructure />} />
          <Route path="/transport" element={<Infrastructure />} />
          <Route path="/electricity" element={<Infrastructure />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
