import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shield, User, Briefcase, Clock, Award, Edit } from 'lucide-react';
import { useAuth } from '../App';
import { toast } from 'sonner';

export default function MyProfile() {
  const { user } = useAuth();
  const initials = (user?.name || '').split(' ').slice(0, 2).map(w => w[0]).join('');

  const stats = [
    { label: 'ساعات الخدمة', value: '2,847', icon: Clock },
    { label: 'سنوات الخدمة', value: user?.serviceYears || 0, icon: Briefcase },
    { label: 'عدد الأوسمة', value: '4', icon: Award },
    { label: 'نسبة الالتزام', value: '96%', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-blue-100 mil-shadow">
        <div className="relative naval-bg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 rounded-2xl blur-xl opacity-40"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-red-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg border-2 border-red-300">
                <span className="text-3xl font-black text-white">{initials}</span>
              </div>
            </div>
            <div className="flex-1">
              <Badge className="bg-red-600 text-white font-bold mb-2">{user?.rank}</Badge>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1">{user?.name}</h2>
              <p className="text-red-100 text-sm mb-4 font-medium">عضو في {user?.department}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-950/40 rounded-lg px-3 py-2 border border-red-400/30">
                  <p className="text-[10px] text-red-200">الرقم العسكري</p>
                  <p className="text-white font-mono font-bold">{user?.militaryNumber}</p>
                </div>
                <div className="bg-blue-950/40 rounded-lg px-3 py-2 border border-red-400/30">
                  <p className="text-[10px] text-red-200">تاريخ الالتحاق</p>
                  <p className="text-white font-bold">{user?.joinDate || '-'}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => toast.info('تعديل البيانات')} className="bg-red-600 hover:bg-red-700 text-white font-bold"><Edit className="w-4 h-4 ml-2" /> تعديل</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="p-4 border-blue-100 stat-card-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-red-100 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-red-700" /></div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-lg font-black text-slate-900">{s.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-blue-100">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-red-600" /> البيانات الأساسية</h3>
          {[
            { label: 'الاسم الكامل', value: user?.name },
            { label: 'الرقم العسكري', value: user?.militaryNumber },
            { label: 'الرتبة الحالية', value: user?.rank },
            { label: 'القسم', value: user?.department },
            { label: 'تاريخ الالتحاق', value: user?.joinDate || '-' },
            { label: 'الحالة', value: user?.status === 'active' ? 'نشط' : user?.status },
          ].map((f, i) => (
            <div key={i} className="flex justify-between items-center py-2.5 border-b border-blue-50 last:border-0">
              <span className="text-sm text-slate-500">{f.label}</span>
              <span className="text-sm font-bold text-slate-900">{f.value}</span>
            </div>
          ))}
        </Card>

        <Card className="p-6 border-blue-100">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-red-600" /> سجل الخدمة</h3>
          <div className="relative pr-6">
            <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-300 to-blue-300"></div>
            {[
              { year: '2025', event: 'التعيين الحالي' },
              { year: '2022', event: 'ترقية إلى الرتبة الحالية' },
              { year: '2018', event: 'وسام الاستحقاق' },
              { year: user?.joinDate?.split('-')[0] || '2012', event: 'الالتحاق بالخدمة' },
            ].map((e, i) => (
              <div key={i} className="relative pb-4 last:pb-0">
                <div className="absolute right-[-22px] top-0.5 w-4 h-4 bg-gradient-to-br from-red-600 to-blue-600 rounded-full border-2 border-white shadow"></div>
                <p className="text-xs font-bold text-red-700">{e.year}</p>
                <p className="text-sm text-slate-700">{e.event}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
