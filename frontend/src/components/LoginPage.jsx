import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hash, LogIn, Loader2, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { useAuth } from '../App';
import api from '../api';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_discourse-pro-5/artifacts/hvpwgy6j_photo_5848105849551785356_x.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [militaryNumber, setMilitaryNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !militaryNumber.trim()) {
      toast.error('الرجاء إدخال جميع البيانات');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { name: name.trim(), militaryNumber: militaryNumber.trim() });
      const { access_token, user } = res.data;
      login(user, access_token);
      if (user.status === 'pending') {
        toast.info('تم استلام طلبك، بانتظار موافقة القيادة');
        navigate('/pending');
      } else {
        toast.success(`أهلاً ${user.rank} ${user.name}`);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'فشل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 naval-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Floating decorative orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-red-500/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-600/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-700/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
      {/* Floating decorative orbs */}

      <div className="w-full max-w-md relative animate-fade-in z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-4 animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/50 rounded-full blur-3xl logo-glow pulse-ring"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-red-600 via-red-700 to-blue-800 rounded-2xl p-2 shadow-2xl border-2 border-red-400">
                <img src={LOGO_URL} alt="فريق أمن ملك الطارة" className="w-full h-full object-contain rounded-xl" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">فريق أمن ملك الطارة</h1>
          <p className="text-red-200 font-bold text-sm md:text-base tracking-wide animate-shimmer-text">البوابة الإلكترونية الرسمية</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-12 bg-red-400/50"></div>
            <p className="text-xs text-red-200/90 font-medium">الانضباط أساس القوة</p>
            <div className="h-px w-12 bg-red-400/50"></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900 via-red-800 to-blue-900 rounded-2xl p-7 md:p-8 mil-shadow border-t-4 border-t-red-400 border-x-2 border-x-red-700/50 border-b-2 border-b-red-600/70">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-red-500/40">
            <Lock className="w-4 h-4 text-red-300" />
            <h2 className="font-bold text-white text-sm tracking-wide">دخول آمن للأعضاء</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-red-100 font-semibold text-sm">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-300" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك الكامل" className="pr-10 h-11 bg-red-950/50 border-red-600/60 text-white placeholder:text-red-200/50 focus:border-red-300 focus:bg-red-950/80" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mil" className="text-red-100 font-semibold text-sm">الرقم العسكري</Label>
              <div className="relative">
                <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-300" />
                <Input id="mil" value={militaryNumber} onChange={(e) => setMilitaryNumber(e.target.value)} placeholder="أدخل رقمك العسكري" className="pr-10 h-11 bg-red-950/50 border-red-600/60 text-white placeholder:text-red-200/50 focus:border-red-300 focus:bg-red-950/80" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-to-l from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 text-white font-bold text-base shadow-lg shadow-red-500/50 border border-red-300/50 transition-all">
              {loading ? (
                <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري التحقق...</>
              ) : (
                <><LogIn className="w-5 h-5 ml-2" /> دخول / تسجيل</>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-red-500/40">
            <div className="text-center">
              <p className="text-xs text-red-100 mb-3 font-semibold">الرتب العسكرية</p>
              <div className="flex flex-wrap justify-center gap-1.5 text-[10px]">
                {['قائد', 'عقيد', 'مقدم', 'رائد', 'نقيب', 'ملازم أول', 'ملازم', 'رئيس عرفاء', 'عرفاء', 'وكيل رقيب', 'رقيب', 'جندي أول', 'جندي'].map((rank, i) => (
                  <span key={rank} className={`px-2 py-0.5 rounded ${i === 0 ? 'bg-yellow-500/30 text-yellow-200 font-bold' : 'bg-red-800/50 text-red-200'}`}>
                    {rank}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-blue-200/80 font-medium tracking-wider">&laquo; الاحترافية أساس النجاح &raquo;</p>
        </div>
      </div>
    </div>
  );
}
