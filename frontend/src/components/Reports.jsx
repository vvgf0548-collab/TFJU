import React, { useState } from 'react';
import { FileText, Download, Eye, Plus, Calendar, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { mockReports } from '../mock';
import { toast } from 'sonner';

const statusColors = {
  'معتمد': 'bg-emerald-100 text-emerald-700',
  'قيد المراجعة': 'bg-amber-100 text-amber-700',
  'مسودة': 'bg-slate-100 text-slate-700',
};

const typeColors = {
  'دورية': 'bg-blue-100 text-blue-700',
  'مداهمة': 'bg-red-100 text-red-700',
  'مهمة': 'bg-purple-100 text-purple-700',
  'مخالفة': 'bg-amber-100 text-amber-700',
};

export default function Reports() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockReports : mockReports.filter(r => r.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">التقارير الأمنية</h2>
          <p className="text-sm text-slate-500">رفع وأرشفة تقارير القطاع</p>
        </div>
        <Button onClick={() => toast.info('رفع تقرير جديد')} className="bg-gradient-to-l from-blue-700 to-red-700 hover:from-blue-800 hover:to-red-800 text-white font-bold">
          <Plus className="w-4 h-4 ml-2" /> رفع تقرير
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-stone-100">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="دورية">دورية</TabsTrigger>
          <TabsTrigger value="مداهمة">مداهمة</TabsTrigger>
          <TabsTrigger value="مهمة">مهمة</TabsTrigger>
          <TabsTrigger value="مخالفة">مخالفة</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <Card key={r.id} className="p-5 border-stone-200 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-red-700 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <Badge className={statusColors[r.status]}>{r.status}</Badge>
            </div>
            <h3 className="font-black text-slate-900 mb-2 line-clamp-2 min-h-[2.5rem]">{r.title}</h3>
            <Badge variant="secondary" className={`${typeColors[r.type]} text-[10px] mb-3`}>{r.type}</Badge>
            <div className="space-y-1.5 text-xs text-slate-500 mb-4 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {r.date}</div>
              <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {r.author}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info('عرض التقرير')}><Eye className="w-3.5 h-3.5 ml-1" /> عرض</Button>
              <Button size="sm" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold" onClick={() => toast.success('تم بدء التحميل')}><Download className="w-3.5 h-3.5 ml-1" /> تحميل</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
