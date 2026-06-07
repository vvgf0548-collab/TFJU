import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Hash, LogIn, Loader2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useAuth } from '../App';
import { mockUsers } from '../mock';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [militaryNumber, setMilitaryNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !militaryNumber.trim()) {
      toast.error('الرجاء إدخال جميع البيانات');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const existing = mockUsers.find(u => u.militaryNumber === militaryNumber.trim());
      if (existing) {
        login(existing);
        toast.success(`أهلاً ${existing.rank} ${existing.name}`);
        navigate('/');
      } else if (militaryNumber.trim() === '00000') {
        const newAdmin = { id: 'admin-' + Date.now(), name: name.trim(), militaryNumber: '00000', role: 'admin', status: 'active', rank: 'عقيد', department: 'الإدارة العامة', joinDate: '2025-07-08', serviceYears: 0 };
        login(newAdmin);
        toast.success('تم تسجيل الدخول كمسؤول');
        navigate('/');
      } else {
        const newUser = { id: 'u-' + Date.now(), name: name.trim(), militaryNumber: militaryNumber.trim(), role: 'officer', status: 'pending', rank: 'ملازم', department: 'غير محدد', joinDate: '2025-07-08', serviceYears: 0 };
        login(newUser);
        toast.info('تم استلام طلبك، بانتظار موافقة القيادة');
        navigate('/pending');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 camo-bg relative overflow-hidden">
      {/* Safety stripe top */}
      <div className="absolute top-0 left-0 right-0 h-2 safety-stripe"></div>
      <div className="absolute bottom-0 left-0 right-0 h-2 safety-stripe"></div>

      {/* Stars/dots pattern */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="w-full max-w-md relative animate-fade-in z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-2xl opacity-40"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-300">
                <Shield className="w-12 h-12 text-slate-900" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">بوابة اللواء حمد</h1>
          <p className="text-amber-400 font-bold text-base md:text-lg tracking-wide">الأمنية الإلكترونية</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-12 bg-amber-500/40"></div>
            <p className="text-xs text-slate-400 font-medium">الانضباط أساس القوة</p>
            <div className="h-px w-12 bg-amber-500/40"></div>
          </div>
        </div>

        {/* Card */}
        <div className="glass-dark rounded-2xl p-7 md:p-8 mil-shadow">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-amber-500/20">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-white text-sm tracking-wide">دخول آمن للأعضاء</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200 font-semibold text-sm">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك الكامل" className="pr-10 h-11 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mil" className="text-slate-200 font-semibold text-sm">الرقم العسكري</Label>
              <div className="relative">
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="mil" value={militaryNumber} onChange={(e) => setMilitaryNumber(e.target.value)} placeholder="أدخل رقمك العسكري" className="pr-10 h-11 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black text-base shadow-lg shadow-amber-500/30 border border-amber-300 transition-all">
              {loading ? (
                <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري التحقق...</>
              ) : (
                <><LogIn className="w-5 h-5 ml-2" /> دخول / تسجيل</>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-amber-500/20">
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              تلميح: الرقم <span className="font-mono font-bold text-amber-400">12345</span> لدخول كمسؤول، أو <span className="font-mono font-bold text-amber-400">00000</span> لتسجيل مسؤول جديد
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 font-medium tracking-wider">&laquo; الاحترافية أساس النجاح &raquo;</p>
        </div>
      </div>
    </div>
  );
}
