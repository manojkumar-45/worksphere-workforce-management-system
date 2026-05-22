import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import LeavesPage from './pages/LeavesPage';
import PayrollPage from './pages/PayrollPage';
import ShiftsPage from './pages/ShiftsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/employees" element={<ProtectedRoute roles={['ADMIN', 'HR']}><EmployeesPage /></ProtectedRoute>} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/leaves" element={<LeavesPage />} />
        <Route path="/payroll" element={<PayrollPage />} />
        <Route path="/shifts" element={<ProtectedRoute roles={['ADMIN', 'HR']}><ShiftsPage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
