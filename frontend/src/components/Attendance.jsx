import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Coffee, Calendar as CalIcon, LogIn, LogOut } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import api from '../api';
import { toast } from 'sonner';

export default function Attendance() {
  const [today, setToday] = useState({ checkIn: null, checkOut: null });
  const [history, setHistory] = useState([]);
  const todayStr = new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const load = async () => {
    try {
      const [t, h] = await Promise.all([api.get('/attendance/today'), api.get('/attendance/history')]);
      setToday({ checkIn: t.data.mine?.checkIn || null, checkOut: t.data.mine?.checkOut || null });
      setHistory(h.data);
    } catch (e) {}
  };
  useEffect(() => { load(); }, []);

  const checkIn = async () => {
    try { const r = await api.post('/attendance/checkin'); if (r.data.ok) { toast.success('تم تسجيل الحضور'); } else { toast.info(r.data.message); } load(); }
    catch (e) { toast.error('فشل'); }
  };
  const checkOut = async () => {
    try { await api.post('/attendance/checkout'); toast.success('تم تسجيل الانصراف'); load(); }
    catch (e) { toast.error(e.response?.data?.detail || 'فشل'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">الحضور والانصراف</h2>
        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1"><CalIcon className="w-4 h-4" /> {todayStr}</p>
      </div>

      <Card className="p-6 border-blue-100 mil-shadow bg-gradient-to-br from-blue-50/40 to-white">
        <h3 className="font-black text-slate-900 mb-4">تسجيلي لليوم</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border-2 border-blue-200 bg-blue-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><LogIn className="w-5 h-5 text-blue-700" /><span className="font-bold text-blue-900">حضور</span></div>
              {today.checkIn && <Badge className="bg-blue-600 text-white">{today.checkIn}</Badge>}
            </div>
            <Button onClick={checkIn} disabled={!!today.checkIn} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold disabled:opacity-60">{today.checkIn ? 'تم تسجيل الحضور' : 'تسجيل حضور'}</Button>
          </div>
          <div className="p-5 rounded-xl border-2 border-red-200 bg-red-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><LogOut className="w-5 h-5 text-red-700" /><span className="font-bold text-red-900">انصراف</span></div>
              {today.checkOut && <Badge className="bg-red-600 text-white">{today.checkOut}</Badge>}
            </div>
            <Button onClick={checkOut} disabled={!today.checkIn || !!today.checkOut} className="w-full bg-red-700 hover:bg-red-800 text-white font-bold disabled:opacity-60">{today.checkOut ? 'تم تسجيل الانصراف' : 'تسجيل انصراف'}</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-6 border-blue-100">
        <h3 className="font-black text-slate-900 mb-4">سجل الأسبوع العام</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-100 text-slate-600">
                <th className="text-right py-2 px-4 font-bold">التاريخ</th>
                <th className="text-right py-2 px-4 font-bold">حاضر</th>
                <th className="text-right py-2 px-4 font-bold">غائب</th>
                <th className="text-right py-2 px-4 font-bold">إجازة</th>
                <th className="text-right py-2 px-4 font-bold">النسبة</th>
              </tr>
            </thead>
            <tbody>
              {history.map((a, i) => {
                const total = a.present + a.absent + a.leave;
                const pct = total > 0 ? ((a.present / total) * 100).toFixed(1) : 0;
                return (
                  <tr key={i} className="border-b border-blue-50 hover:bg-blue-50/30">
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
