import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../App';

export default function PendingApproval() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mil-pattern">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-300 rounded-full blur-xl opacity-60 pulse-glow"></div>
            <div className="relative w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-amber-600" strokeWidth={2} />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">طلبك قيد المراجعة</h1>
        <p className="text-slate-500 text-center text-sm mb-1">مرحباً {user?.name}</p>
        <p className="text-slate-600 text-center mb-6 leading-relaxed">
          تم استلام طلبك وسيتم مراجعته من قبل المسؤول بأسرع وقت ممكن.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-start gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
          <p className="text-sm text-amber-800">يتم التحقق تلقائياً من حالة طلبك...</p>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full border-slate-200" onClick={handleLogout}>
            <LogOut className="w-4 h-4 ml-2" /> العودة لصفحة الدخول
          </Button>
        </div>
      </div>
    </div>
  );
}
