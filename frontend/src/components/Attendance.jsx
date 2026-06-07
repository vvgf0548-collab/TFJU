import React, { useState } from 'react';
import { CalendarCheck, CheckCircle, XCircle, Coffee, Calendar as CalIcon, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { mockSoldiers, mockAttendance } from '../mock';
import { toast } from 'sonner';

export default function Attendance() {
  const [records, setRecords] = useState(mockSoldiers.map(s => ({ ...s, todayStatus: s.status })));
  const today = new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const setStatus = (id, status) => {
    setRecords(records.map(r => r.id === id ? { ...r, todayStatus: status } : r));
    toast.success('تم تحديث الحالة');
  };

  const stats = {
    present: records.filter(r => r.todayStatus === 'حاضر').length,
    absent: records.filter(r => r.todayStatus === 'غائب').length,
    leave: records.filter(r => r.todayStatus === 'إجازة').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">الحضور والغياب</h2>
        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1"><CalIcon className="w-4 h-4" /> {today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">حاضر</Badge>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.present}</p>
          <p className="text-sm text-slate-500">جندي حاضر</p>
        </Card>
        <Card className="p-5 border-red-100 bg-gradient-to-br from-red-50 to-white">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-600" />
            <Badge variant="secondary" className="bg-red-100 text-red-700">غائب</Badge>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.absent}</p>
          <p className="text-sm text-slate-500">جندي غائب</p>
        </Card>
        <Card className="p-5 border-amber-100 bg-gradient-to-br from-amber-50 to-white">
          <div className="flex items-center justify-between mb-2">
            <Coffee className="w-8 h-8 text-amber-600" />
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">إجازة</Badge>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.leave}</p>
          <p className="text-sm text-slate-500">في إجازة</p>
        </Card>
      </div>

      {/* Records */}
      <Card className="p-4 md:p-6 border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">سجل حضور اليوم</h3>
        <div className="space-y-2">
          {records.map(r => {
            const initials = r.name.split(' ').slice(0, 2).map(w => w[0]).join('');
            return (
              <div key={r.id} className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500">
                    <AvatarFallback className="bg-transparent text-white text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.rank} · {r.unit} · <span className="font-mono">{r.militaryNumber}</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={r.todayStatus === 'حاضر' ? 'default' : 'outline'} onClick={() => setStatus(r.id, 'حاضر')} className={r.todayStatus === 'حاضر' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'}>حاضر</Button>
                  <Button size="sm" variant={r.todayStatus === 'غائب' ? 'default' : 'outline'} onClick={() => setStatus(r.id, 'غائب')} className={r.todayStatus === 'غائب' ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-red-700 border-red-200 hover:bg-red-50'}>غائب</Button>
                  <Button size="sm" variant={r.todayStatus === 'إجازة' ? 'default' : 'outline'} onClick={() => setStatus(r.id, 'إجازة')} className={r.todayStatus === 'إجازة' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'text-amber-700 border-amber-200 hover:bg-amber-50'}>إجازة</Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Weekly history */}
      <Card className="p-4 md:p-6 border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">سجل الأسبوع</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="text-right py-2 px-4 font-semibold">التاريخ</th>
                <th className="text-right py-2 px-4 font-semibold">حاضر</th>
                <th className="text-right py-2 px-4 font-semibold">غائب</th>
                <th className="text-right py-2 px-4 font-semibold">إجازة</th>
                <th className="text-right py-2 px-4 font-semibold">النسبة</th>
              </tr>
            </thead>
            <tbody>
              {mockAttendance.map((a, i) => {
                const total = a.present + a.absent + a.leave;
                const pct = ((a.present / total) * 100).toFixed(1);
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-700">{a.date}</td>
                    <td className="py-3 px-4"><Badge className="bg-emerald-100 text-emerald-700">{a.present}</Badge></td>
                    <td className="py-3 px-4"><Badge className="bg-red-100 text-red-700">{a.absent}</Badge></td>
                    <td className="py-3 px-4"><Badge className="bg-amber-100 text-amber-700">{a.leave}</Badge></td>
                    <td className="py-3 px-4 font-bold text-slate-900">{pct}%</td>
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
