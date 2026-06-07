import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../App';

export default function PendingApproval() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 camo-bg relative">
      <div className="absolute top-0 left-0 right-0 h-2 safety-stripe"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 safety-stripe"></div>
      <div className="max-w-md w-full glass-dark rounded-2xl p-8 mil-shadow animate-fade-in relative z-10">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-50 pulse-glow"></div>
            <div className="relative w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-400">
              <Clock className="w-10 h-10 text-amber-700" strokeWidth={2.2} />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-black text-white text-center mb-2">طلبك قيد المراجعة</h1>
        <p className="text-amber-400 text-center text-sm mb-2 font-bold">مرحباً {user?.name}</p>
        <p className="text-slate-300 text-center mb-6 leading-relaxed text-sm">
          تم استلام طلبك بنجاح. سوف تقوم القيادة بمراجعة طلبك بأسرع وقت ممكن.
        </p>
        <div className="bg-slate-800/60 border border-amber-500/30 rounded-lg p-3 mb-6 flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <p className="text-sm text-amber-200">يتم التحقق تلقائياً من حالة طلبك...</p>
        </div>
        <Button variant="outline" className="w-full bg-transparent border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300" onClick={handleLogout}>
          <LogOut className="w-4 h-4 ml-2" /> العودة لصفحة الدخول
        </Button>
      </div>
    </div>
  );
}
