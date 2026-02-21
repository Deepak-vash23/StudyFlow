import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import RequireAuth from './components/RequireAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import CalendarPage from './pages/CalendarPage';
import FocusSession from './pages/FocusSession';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { PlannerProvider } from './context/PlannerContext';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <PlannerProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/" element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }>
              <Route index element={<Dashboard />} />
              <Route path="planner" element={<Planner />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="focus" element={<FocusSession />} />
            </Route>
          </Routes>
        </PlannerProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
