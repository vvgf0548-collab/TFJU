import React, { useState, useEffect, useContext, createContext } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import PendingApproval from './components/PendingApproval';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MyProfile from './components/MyProfile';
import Attendance from './components/Attendance';
import Cards from './components/Cards';
import Requests from './components/Requests';
import Operations from './components/Operations';
import Reports from './components/Reports';
import Violations from './components/Violations';
import Personnel from './components/Personnel';
import Promotions from './components/Promotions';
import Honors from './components/Honors';
import Announcements from './components/Announcements';
import Statistics from './components/Statistics';
import Support from './components/Support';
import Settings from './components/Settings';
import { Toaster } from './components/ui/sonner';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('mil_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (e) { localStorage.removeItem('mil_user'); }
    }
    setLoading(false);
  }, []);

  const login = (u) => { setUser(u); localStorage.setItem('mil_user', JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem('mil_user'); };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.status === 'pending') return <Navigate to="/pending" replace />;
  return children;
}

function App() {
  return (
    <div className="App" dir="rtl">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/pending" element={<PendingApproval />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="cards" element={<Cards />} />
              <Route path="requests" element={<Requests />} />
              <Route path="operations" element={<Operations />} />
              <Route path="reports" element={<Reports />} />
              <Route path="violations" element={<Violations />} />
              <Route path="personnel" element={<Personnel />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="honors" element={<Honors />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="support" element={<Support />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
