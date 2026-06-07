import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../App';

export default function PendingApproval() {
  const navigate = useNavigate();
  const { user, logout, refresh } = useAuth();

  useEffect(() => {
    // poll every 6 seconds to check if approved
    const interval = setInterval(async () => {
      await refresh();
    }, 6000);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (user && user.status === 'active') navigate('/');
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 naval-bg relative">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-red-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="max-w-md w-full bg-gradient-to-br from-red-900/90 via-red-800/85 to-blue-900/90 backdrop-blur rounded-2xl p-8 mil-shadow border-t-4 border-t-red-500 relative z-10">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 pulse-ring"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center border-2 border-red-300">
              <Clock className="w-10 h-10 text-white" strokeWidth={2.2} />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-black text-white text-center mb-2">طلبك قيد المراجعة</h1>
        <p className="text-red-200 text-center text-sm mb-2 font-bold">مرحباً {user?.name}</p>
        <p className="text-red-100/90 text-center mb-6 leading-relaxed text-sm">تم استلام طلبك. سوف تقوم القيادة بالمراجعة بأسرع وقت ممكن.</p>
        <div className="bg-red-950/60 border border-red-400/40 rounded-lg p-3 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <p className="text-sm text-red-100">يتم التحقق تلقائياً من حالة طلبك...</p>
        </div>
        <Button variant="outline" className="w-full bg-transparent border-red-400/50 text-red-100 hover:bg-red-500/20 hover:text-white" onClick={handleLogout}>
          <LogOut className="w-4 h-4 ml-2" /> العودة لصفحة الدخول
        </Button>
      </div>
    </div>
  );
}
