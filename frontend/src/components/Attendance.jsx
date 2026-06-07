import React, { useState } from 'react';
import { CheckCircle, XCircle, Coffee, Calendar as CalIcon, LogIn, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { mockMembers, mockAttendance } from '../mock';
import { useAuth } from '../App';
import { toast } from 'sonner';

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState(mockMembers.slice(0, 8).map(s => ({ ...s, todayStatus: 'حاضر' })));
  const [myCheckIn, setMyCheckIn] = useState(null);
  const [myCheckOut, setMyCheckOut] = useState(null);
  const today = new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setMyCheckIn(time);
    toast.success(`تم تسجيل الحضور الساعة ${time}`);
  };
  const handleCheckOut = () => {
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    setMyCheckOut(time);
    toast.success(`تم تسجيل الانصراف الساعة ${time}`);
  };

  const stats = {
    present: records.filter(r => r.todayStatus === 'حاضر').length,
    absent: records.filter(r => r.todayStatus === 'غائب').length,
    leave: records.filter(r => r.todayStatus === 'إجازة').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">الحضور والانصراف</h2>
        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1"><CalIcon className="w-4 h-4" /> {today}</p>
      </div>

      {/* My check in / out */}
      <Card className="p-6 border-stone-200 mil-shadow bg-gradient-to-br from-stone-50 to-white">
        <h3 className="font-black text-slate-900 mb-4">تسجيلي لليوم</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border-2 border-emerald-200 bg-emerald-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5 text-emerald-700" />
                <span className="font-bold text-emerald-900">حضور</span>
              </div>
              {myCheckIn && <Badge className="bg-emerald-600 text-white">{myCheckIn}</Badge>}
            </div>
            <Button onClick={handleCheckIn} disabled={!!myCheckIn} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-60">
              {myCheckIn ? 'تم تسجيل الحضور' : 'تسجيل حضور'}
            </Button>
          </div>
          <div className="p-5 rounded-xl border-2 border-amber-200 bg-amber-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-amber-700" />
                <span className="font-bold text-amber-900">انصراف</span>
              </div>
              {myCheckOut && <Badge className="bg-amber-600 text-white">{myCheckOut}</Badge>}
            </div>
            <Button onClick={handleCheckOut} disabled={!myCheckIn || !!myCheckOut} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold disabled:opacity-60">
              {myCheckOut ? 'تم تسجيل الانصراف' : 'تسجيل انصراف'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Card className="p-5 border-emerald-100 bg-emerald-50/40">
          <CheckCircle className="w-7 h-7 text-emerald-600 mb-2" />
          <p className="text-2xl font-black text-emerald-900">{stats.present}</p>
          <p className="text-xs text-emerald-700 font-bold">حاضر</p>
        </Card>
        <Card className="p-5 border-red-100 bg-red-50/40">
          <XCircle className="w-7 h-7 text-red-600 mb-2" />
          <p className="text-2xl font-black text-red-900">{stats.absent}</p>
          <p className="text-xs text-red-700 font-bold">غائب</p>
        </Card>
        <Card className="p-5 border-amber-100 bg-amber-50/40">
          <Coffee className="w-7 h-7 text-amber-600 mb-2" />
          <p className="text-2xl font-black text-amber-900">{stats.leave}</p>
          <p className="text-xs text-amber-700 font-bold">إجازة</p>
        </Card>
      </div>

      {/* Weekly history */}
      <Card className="p-4 md:p-6 border-stone-200">
        <h3 className="font-black text-slate-900 mb-4">سجل الأسبوع العام</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-slate-600">
                <th className="text-right py-2 px-4 font-bold">التاريخ</th>
                <th className="text-right py-2 px-4 font-bold">حاضر</th>
                <th className="text-right py-2 px-4 font-bold">غائب</th>
                <th className="text-right py-2 px-4 font-bold">إجازة</th>
                <th className="text-right py-2 px-4 font-bold">النسبة</th>
              </tr>
            </thead>
            <tbody>
              {mockAttendance.map((a, i) => {
                const total = a.present + a.absent + a.leave;
                const pct = ((a.present / total) * 100).toFixed(1);
                return (
                  <tr key={i} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4 text-slate-700">{a.date}</td>
                    <td className="py-3 px-4"><Badge className="bg-emerald-100 text-emerald-700">{a.present}</Badge></td>
                    <td className="py-3 px-4"><Badge className="bg-red-100 text-red-700">{a.absent}</Badge></td>
                    <td className="py-3 px-4"><Badge className="bg-amber-100 text-amber-700">{a.leave}</Badge></td>
                    <td className="py-3 px-4 font-black text-slate-900">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
