import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Users, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../api';
import { useAuth } from '../App';

const statusColors = {
  'active': 'bg-emerald-100 text-emerald-700',
  'pending': 'bg-amber-100 text-amber-700',
  'موقوف': 'bg-red-100 text-red-700',
  'متقاعد': 'bg-slate-100 text-slate-700',
  'نشط': 'bg-emerald-100 text-emerald-700',
};
const statusLabel = (u) => u.status === 'pending' ? 'بانتظار الموافقة' : (u.memberStatus || (u.status === 'active' ? 'نشط' : u.status));

export default function Personnel() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const load = () => api.get('/users').then(r => setUsers(r.data)).catch(() => toast.error('تعذر تحميل البيانات'));
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try { await api.post(`/users/${id}/approve`); toast.success('تمت الموافقة'); load(); }
    catch (e) { toast.error(e.response?.data?.detail || 'فشل'); }
  };
  const reject = async (id) => {
    try { await api.post(`/users/${id}/reject`); toast.success('تم الرفض'); load(); }
    catch (e) { toast.error(e.response?.data?.detail || 'فشل'); }
  };

  const filtered = users.filter(m => {
    const lbl = statusLabel(m);
    if (filter === 'pending' && m.status !== 'pending') return false;
    if (filter === 'نشط' && !(m.status === 'active' && lbl !== 'موقوف' && lbl !== 'متقاعد')) return false;
    if (filter === 'موقوف' && lbl !== 'موقوف') return false;
    if (filter === 'متقاعد' && lbl !== 'متقاعد') return false;
    if (search && !m.name?.includes(search) && !m.militaryNumber?.includes(search)) return false;
    return true;
  });

  const counts = {
    active: users.filter(m => m.status === 'active' && (m.memberStatus || 'نشط') === 'نشط').length,
    pending: users.filter(m => m.status === 'pending').length,
    suspended: users.filter(m => m.memberStatus === 'موقوف').length,
    retired: users.filter(m => m.memberStatus === 'متقاعد').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">شؤون الأفراد</h2>
        <p className="text-sm text-slate-500">إجمالي {users.length} عضو</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 border-emerald-100 bg-emerald-50/40"><p className="text-xs text-emerald-700 font-bold mb-1">نشطون</p><p className="text-2xl font-black text-emerald-900">{counts.active}</p></Card>
        <Card className="p-4 border-amber-100 bg-amber-50/40"><p className="text-xs text-amber-700 font-bold mb-1">بانتظار الموافقة</p><p className="text-2xl font-black text-amber-900">{counts.pending}</p></Card>
        <Card className="p-4 border-red-100 bg-red-50/40"><p className="text-xs text-red-700 font-bold mb-1">موقوفون</p><p className="text-2xl font-black text-red-900">{counts.suspended}</p></Card>
        <Card className="p-4 border-slate-200 bg-slate-50"><p className="text-xs text-slate-700 font-bold mb-1">متقاعدون</p><p className="text-2xl font-black text-slate-900">{counts.retired}</p></Card>
      </div>

      <Card className="p-4 md:p-6 border-blue-100">
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="pr-10 bg-blue-50/50" />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-blue-50">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="pending">بانتظار الموافقة</TabsTrigger>
              <TabsTrigger value="نشط">نشطون</TabsTrigger>
              <TabsTrigger value="موقوف">موقوفون</TabsTrigger>
              <TabsTrigger value="متقاعد">متقاعدون</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-100 text-slate-600">
                <th className="text-right py-3 px-3 font-bold">العضو</th>
                <th className="text-right py-3 px-3 font-bold hidden md:table-cell">الرقم</th>
                <th className="text-right py-3 px-3 font-bold hidden lg:table-cell">الرتبة</th>
                <th className="text-right py-3 px-3 font-bold hidden md:table-cell">القسم</th>
                <th className="text-right py-3 px-3 font-bold">الحالة</th>
                {me?.role === 'admin' && <th className="text-right py-3 px-3 font-bold">إجراء</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const initials = (m.name || '').split(' ').slice(0, 2).map(w => w[0]).join('');
                const lbl = statusLabel(m);
                return (
                  <tr key={m.id} className="border-b border-blue-50 hover:bg-blue-50/30">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 bg-gradient-to-br from-blue-700 to-red-700">
                          <AvatarFallback className="bg-transparent text-white text-xs font-black">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900">{m.name}</p>
                          <p className="text-xs text-slate-500 md:hidden">{m.militaryNumber} · {m.rank}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell font-mono text-slate-700">{m.militaryNumber}</td>
                    <td className="py-3 px-3 hidden lg:table-cell text-slate-700">{m.rank}</td>
                    <td className="py-3 px-3 hidden md:table-cell text-slate-700">{m.department}</td>
                    <td className="py-3 px-3"><Badge className={statusColors[m.status] || statusColors[lbl] || 'bg-slate-100'}>{lbl}</Badge></td>
                    {me?.role === 'admin' && (
                      <td className="py-3 px-3">
                        {m.status === 'pending' ? (
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => approve(m.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white h-8"><Check className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" variant="outline" onClick={() => reject(m.id)} className="text-red-700 border-red-200 hover:bg-red-50 h-8"><X className="w-3.5 h-3.5" /></Button>
                          </div>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-10 text-center text-slate-400"><Users className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>لا توجد نتائج</p></div>}
        </div>
      </Card>
    </div>
  );
}
