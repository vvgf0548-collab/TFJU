import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Crosshair, MapPin, Users, Calendar } from 'lucide-react';
import { mockOperations } from '../mock';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';

const statusColors = {
  'جارية': 'bg-red-100 text-red-700 border-red-200',
  'مجدولة': 'bg-blue-100 text-blue-700 border-blue-200',
  'مكتملة': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function Operations() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockOperations : mockOperations.filter(o => o.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">العمليات الأمنية</h2>
        <p className="text-sm text-slate-500">العمليات الجارية والمجدولة</p>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-stone-100">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="مداهمة">مداهمات</TabsTrigger>
          <TabsTrigger value="نقطة تفتيش">نقاط تفتيش</TabsTrigger>
          <TabsTrigger value="دورية">دوريات</TabsTrigger>
          <TabsTrigger value="مهمة خاصة">مهمات خاصة</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(op => (
          <Card key={op.id} className="p-5 border-stone-200 hover:shadow-lg hover:border-amber-200 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center border border-amber-500/30">
                <Crosshair className="w-5 h-5 text-amber-400" />
              </div>
              <Badge variant="outline" className={statusColors[op.status]}>{op.status}</Badge>
            </div>
            <h3 className="font-black text-slate-900 text-base mb-1">{op.name}</h3>
            <Badge variant="secondary" className="text-[10px] bg-stone-100 mb-3">{op.type}</Badge>
            <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-600" /> {op.location}</div>
              <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-amber-600" /> {op.team} فرد</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-600" /> {op.date}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
