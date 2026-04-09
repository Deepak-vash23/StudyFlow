import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import RequireAuth from './components/RequireAuth';
import LoadingScreen from './components/LoadingScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Planner from './pages/Planner';
import Landing from './pages/Landing';
import CalendarPage from './pages/CalendarPage';
import FocusSession from './pages/FocusSession';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { PlannerProvider } from './context/PlannerContext';

function App() {
  const [isLoading, setIsLoading] = useState(window.location.pathname === '/');

  return (
    <AuthProvider>
      <TaskProvider>
        <PlannerProvider>
          {/* Loading Screen Preloader */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <LoadingScreen onComplete={() => setIsLoading(false)} />
            )}
          </AnimatePresence>

          {/* Main App Content */}
          <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-out' }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              <Route element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/focus" element={<FocusSession />} />
              </Route>
            </Routes>
          </div>
        </PlannerProvider>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
