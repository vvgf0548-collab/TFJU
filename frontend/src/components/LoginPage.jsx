import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hash, LogIn, Loader2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useAuth } from '../App';
import { mockUsers } from '../mock';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_discourse-pro-5/artifacts/hvpwgy6j_photo_5848105849551785356_x.jpg';

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
    <div className="min-h-screen flex items-center justify-center px-4 naval-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      {/* Red & Blue accent stripes */}
      <div className="absolute top-0 left-0 right-0 flex">
        <div className="h-1 flex-1 bg-blue-600"></div>
        <div className="h-1 flex-1 bg-red-600"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex">
        <div className="h-1 flex-1 bg-red-600"></div>
        <div className="h-1 flex-1 bg-blue-600"></div>
      </div>

      <div className="w-full max-w-md relative animate-fade-in z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-3xl logo-glow"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-700 to-red-700 rounded-2xl p-2 shadow-2xl border-2 border-red-400">
                <img src={LOGO_URL} alt="فريق أمن ملك الطارة" className="w-full h-full object-contain rounded-xl" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">فريق أمن ملك الطارة</h1>
          <p className="text-red-200 font-bold text-sm md:text-base tracking-wide">البوابة الإلكترونية الرسمية</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-12 bg-red-300/40"></div>
            <p className="text-xs text-blue-200/80 font-medium">الانضباط أساس القوة</p>
            <div className="h-px w-12 bg-red-300/40"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-red-900 rounded-2xl p-7 md:p-8 mil-shadow border-t-4 border-t-red-500 border-x border-b border-blue-700">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-blue-700/50">
            <Lock className="w-4 h-4 text-red-300" />
            <h2 className="font-bold text-white text-sm tracking-wide">دخول آمن للأعضاء</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-100 font-semibold text-sm">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك الكامل" className="pr-10 h-11 bg-blue-950/60 border-blue-600 text-white placeholder:text-blue-300/60 focus:border-red-400 focus:bg-blue-950" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mil" className="text-blue-100 font-semibold text-sm">الرقم العسكري</Label>
              <div className="relative">
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <Input id="mil" value={militaryNumber} onChange={(e) => setMilitaryNumber(e.target.value)} placeholder="أدخل رقمك العسكري" className="pr-10 h-11 bg-blue-950/60 border-blue-600 text-white placeholder:text-blue-300/60 focus:border-red-400 focus:bg-blue-950" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-l from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-lg shadow-red-500/30 border border-red-400/50 transition-all">
              {loading ? (
                <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري التحقق...</>
              ) : (
                <><LogIn className="w-5 h-5 ml-2" /> دخول / تسجيل</>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-blue-700/50">
            <p className="text-[11px] text-blue-200 text-center leading-relaxed">
              تلميح: الرقم <span className="font-mono font-bold text-red-300">12345</span> لدخول كمسؤول، أو <span className="font-mono font-bold text-red-300">00000</span> لتسجيل مسؤول جديد
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-blue-200/80 font-medium tracking-wider">&laquo; الاحترافية أساس النجاح &raquo;</p>
        </div>
      </div>
    </div>
  );
}
