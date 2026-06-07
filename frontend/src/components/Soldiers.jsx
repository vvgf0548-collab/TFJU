import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { mockSoldiers } from '../mock';
import { toast } from 'sonner';

const statusColors = {
  'حاضر': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'غائب': 'bg-red-100 text-red-700 border-red-200',
  'إجازة': 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function Soldiers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [soldiers, setSoldiers] = useState(mockSoldiers);

  const filtered = soldiers.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (search && !s.name.includes(search) && !s.militaryNumber.includes(search)) return false;
    return true;
  });

  const handleDelete = (id) => {
    setSoldiers(soldiers.filter(s => s.id !== id));
    toast.success('تم حذف الجندي بنجاح');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">إدارة الجنود</h2>
          <p className="text-sm text-slate-500">إجمالي {soldiers.length} جندي في الأرشيف</p>
        </div>
        <Button onClick={() => toast.info('صفحة إضافة جندي جديد')} className="bg-gradient-to-l from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md">
          <Plus className="w-4 h-4 ml-2" /> إضافة جندي
        </Button>
      </div>

      <Card className="p-4 md:p-6 border-slate-100">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الرقم العسكري..." className="pr-10 bg-slate-50 border-slate-200" />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="حاضر">حاضر</TabsTrigger>
              <TabsTrigger value="غائب">غائب</TabsTrigger>
              <TabsTrigger value="إجازة">إجازة</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="text-right py-3 px-4 font-semibold">الجندي</th>
                <th className="text-right py-3 px-4 font-semibold hidden md:table-cell">الرقم العسكري</th>
                <th className="text-right py-3 px-4 font-semibold hidden lg:table-cell">الرتبة</th>
                <th className="text-right py-3 px-4 font-semibold hidden lg:table-cell">الوحدة</th>
                <th className="text-right py-3 px-4 font-semibold">الحالة</th>
                <th className="text-right py-3 px-4 font-semibold hidden md:table-cell">المخالفات</th>
                <th className="text-right py-3 px-4 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const initials = s.name.split(' ').slice(0, 2).map(w => w[0]).join('');
                return (
                  <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 bg-gradient-to-br from-orange-400 to-amber-500">
                          <AvatarFallback className="bg-transparent text-white text-xs font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500 md:hidden">{s.militaryNumber} · {s.rank}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell font-mono text-slate-700">{s.militaryNumber}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-700">{s.rank}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-700">{s.unit}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={statusColors[s.status]}>{s.status}</Badge>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {s.violations > 0 ? (
                        <span className="font-semibold text-red-600">{s.violations}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`عرض ملف: ${s.name}`)}><Eye className="w-4 h-4 ml-2" /> عرض</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info(`تعديل: ${s.name}`)}><Edit className="w-4 h-4 ml-2" /> تعديل</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => handleDelete(s.id)}><Trash2 className="w-4 h-4 ml-2" /> حذف</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد نتائج</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
