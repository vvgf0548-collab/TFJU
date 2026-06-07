import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Users } from 'lucide-react';
import { mockMembers } from '../mock';

const statusColors = {
  'نشط': 'bg-emerald-100 text-emerald-700',
  'موقوف': 'bg-red-100 text-red-700',
  'متقاعد': 'bg-slate-100 text-slate-700',
};

export default function Personnel() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = mockMembers.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search && !m.name.includes(search) && !m.militaryNumber.includes(search)) return false;
    return true;
  });

  const counts = {
    active: mockMembers.filter(m => m.status === 'نشط').length,
    suspended: mockMembers.filter(m => m.status === 'موقوف').length,
    retired: mockMembers.filter(m => m.status === 'متقاعد').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">شؤون الأفراد</h2>
        <p className="text-sm text-slate-500">إجمالي {mockMembers.length} عضو في القطاع</p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Card className="p-4 border-emerald-100 bg-emerald-50/40">
          <p className="text-xs text-emerald-700 font-bold mb-1">نشطون</p>
          <p className="text-2xl font-black text-emerald-900">{counts.active}</p>
        </Card>
        <Card className="p-4 border-red-100 bg-red-50/40">
          <p className="text-xs text-red-700 font-bold mb-1">موقوفون</p>
          <p className="text-2xl font-black text-red-900">{counts.suspended}</p>
        </Card>
        <Card className="p-4 border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-700 font-bold mb-1">متقاعدون</p>
          <p className="text-2xl font-black text-slate-900">{counts.retired}</p>
        </Card>
      </div>

      <Card className="p-4 md:p-6 border-stone-200">
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="pr-10 bg-stone-50" />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-stone-100">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="نشط">نشطون</TabsTrigger>
              <TabsTrigger value="موقوف">موقوفون</TabsTrigger>
              <TabsTrigger value="متقاعد">متقاعدون</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-slate-600">
                <th className="text-right py-3 px-3 font-bold">العضو</th>
                <th className="text-right py-3 px-3 font-bold hidden md:table-cell">الرقم</th>
                <th className="text-right py-3 px-3 font-bold hidden lg:table-cell">الرتبة</th>
                <th className="text-right py-3 px-3 font-bold hidden md:table-cell">القسم</th>
                <th className="text-right py-3 px-3 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const initials = m.name.split(' ').slice(0, 2).map(w => w[0]).join('');
                return (
                  <tr key={m.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 bg-slate-900">
                          <AvatarFallback className="bg-transparent text-amber-400 text-xs font-black">{initials}</AvatarFallback>
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
                    <td className="py-3 px-3"><Badge className={statusColors[m.status]}>{m.status}</Badge></td>
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
