import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shield, User, Hash, Briefcase, Calendar, Clock, Award, Edit, IdCard } from 'lucide-react';
import { useAuth } from '../App';
import { mockMedals } from '../mock';
import { toast } from 'sonner';

export default function MyProfile() {
  const { user } = useAuth();
  const initials = (user?.name || '').split(' ').slice(0, 2).map(w => w[0]).join('');

  const stats = [
    { label: 'ساعات الخدمة', value: '2,847', icon: Clock },
    { label: 'سنوات الخدمة', value: user?.serviceYears || 13, icon: Briefcase },
    { label: 'عدد الأوسمة', value: '4', icon: Award },
    { label: 'نسبة الالتزام', value: '96%', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Military Card */}
      <Card className="overflow-hidden border-stone-200 mil-shadow">
        <div className="relative camo-bg p-6 md:p-8">
          <div className="absolute top-0 left-0 right-0 h-1 safety-stripe"></div>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center border-2 border-amber-300 shadow-lg">
                <span className="text-3xl font-black text-slate-900">{initials}</span>
              </div>
            </div>
            <div className="flex-1">
              <Badge className="bg-amber-500 text-slate-900 font-bold mb-2">{user?.rank}</Badge>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1">{user?.name}</h2>
              <p className="text-amber-300 text-sm mb-4 font-medium">عضو في {user?.department}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-amber-500/20">
                  <p className="text-[10px] text-slate-400">الرقم العسكري</p>
                  <p className="text-white font-mono font-bold">{user?.militaryNumber}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-amber-500/20">
                  <p className="text-[10px] text-slate-400">تاريخ الالتحاق</p>
                  <p className="text-white font-bold">{user?.joinDate || '2012-03-15'}</p>
                </div>
              </div>
            </div>
            <Button onClick={() => toast.info('تعديل البيانات')} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold">
              <Edit className="w-4 h-4 ml-2" /> تعديل
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="p-4 border-stone-200 stat-card-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-amber-700" /></div>
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
        <Card className="p-6 border-stone-200">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-amber-600" /> البيانات الأساسية</h3>
          {[
            { label: 'الاسم الكامل', value: user?.name },
            { label: 'الرقم العسكري', value: user?.militaryNumber },
            { label: 'الرتبة الحالية', value: user?.rank },
            { label: 'القسم', value: user?.department },
            { label: 'تاريخ الالتحاق', value: user?.joinDate || '2012-03-15' },
            { label: 'الحالة', value: 'نشط' },
          ].map((f, i) => (
            <div key={i} className="flex justify-between items-center py-2.5 border-b border-stone-100 last:border-0">
              <span className="text-sm text-slate-500">{f.label}</span>
              <span className="text-sm font-bold text-slate-900">{f.value}</span>
            </div>
          ))}
        </Card>

        <Card className="p-6 border-stone-200">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-amber-600" /> الأوسمة والتكريمات</h3>
          <div className="space-y-3">
            {mockMedals.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-600">{m.reason}</p>
                  <p className="text-[10px] text-slate-400">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 border-stone-200">
        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600" /> سجل الخدمة</h3>
        <div className="relative pr-6">
          <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-amber-200"></div>
          {[
            { year: '2025', event: 'تعيين في الأمن الداخلي' },
            { year: '2022', event: 'ترقية إلى رتبة عقيد' },
            { year: '2018', event: 'وسام الاستحقاق' },
            { year: '2015', event: 'ترقية إلى رتبة رائد' },
            { year: '2012', event: 'الالتحاق بالخدمة' },
          ].map((e, i) => (
            <div key={i} className="relative pb-4 last:pb-0">
              <div className="absolute right-[-22px] top-0.5 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow"></div>
              <p className="text-xs font-bold text-amber-700">{e.year}</p>
              <p className="text-sm text-slate-700">{e.event}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
