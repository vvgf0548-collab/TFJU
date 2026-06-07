import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Hash, LogIn, Loader2, ChevronLeft } from 'lucide-react';
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
        if (existing.status === 'pending') {
          login({ ...existing });
          toast.info('حسابك قيد المراجعة');
          navigate('/pending');
        } else {
          login(existing);
          toast.success(`أهلاً بك ${existing.rank} ${existing.name}`);
          navigate('/');
        }
      } else {
        // New registration - pending approval (admin shortcut: 00000 -> instant admin)
        if (militaryNumber.trim() === '00000') {
          const newAdmin = { id: 'admin-' + Date.now(), name: name.trim(), militaryNumber: '00000', role: 'admin', status: 'active', rank: 'عقيد', unit: 'إدارة المرور' };
          login(newAdmin);
          toast.success('تم تسجيل الدخول كمسؤول');
          navigate('/');
        } else {
          const newUser = { id: 'u-' + Date.now(), name: name.trim(), militaryNumber: militaryNumber.trim(), role: 'officer', status: 'pending', rank: 'ملازم', unit: 'غير محدد' };
          login(newUser);
          toast.info('تم استلام طلبك، بانتظار موافقة المسؤول');
          navigate('/pending');
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mil-pattern relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="w-full max-w-md relative animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" strokeWidth={2.2} />
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-1">تسجيل الدخول</h1>
          <p className="text-slate-500 text-center text-sm mb-8">إدارة تخصص المرور العسكري</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium text-sm">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mil" className="text-slate-700 font-medium text-sm">الرقم العسكري</Label>
              <div className="relative">
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="mil"
                  value={militaryNumber}
                  onChange={(e) => setMilitaryNumber(e.target.value)}
                  placeholder="أدخل رقمك العسكري"
                  className="pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-l from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري الدخول...</>
              ) : (
                <><LogIn className="w-4 h-4 ml-2" /> دخول / تسجيل</>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center">
              تلميح: استخدم الرقم <span className="font-mono font-bold text-orange-600">12345</span> لدخول كمسؤول، أو <span className="font-mono font-bold text-orange-600">00000</span> لتسجيل مسؤول جديد
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          منصة رقمية متكاملة لتعزيز الانضباط العسكري
        </p>
      </div>
    </div>
  );
}
