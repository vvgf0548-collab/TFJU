import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Megaphone, AlertTriangle, FileText, Bell } from 'lucide-react';
import { mockAnnouncements } from '../mock';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

const priorityStyles = {
  critical: { color: 'border-red-300 bg-red-50/50', icon: AlertTriangle, iconColor: 'text-red-600', badge: 'bg-red-500 text-white' },
  high: { color: 'border-amber-300 bg-amber-50/50', icon: Bell, iconColor: 'text-amber-600', badge: 'bg-amber-500 text-slate-900' },
  normal: { color: 'border-stone-200', icon: FileText, iconColor: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
};

export default function Announcements() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? mockAnnouncements : mockAnnouncements.filter(a => a.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">الإعلانات والتعاميم</h2>
        <p className="text-sm text-slate-500">تعاميم القيادة والقرارات الرسمية</p>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-stone-100">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="تعميم">تعاميم</TabsTrigger>
          <TabsTrigger value="تنبيه">تنبيهات</TabsTrigger>
          <TabsTrigger value="قرار">قرارات</TabsTrigger>
          <TabsTrigger value="تحديث">تحديثات</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.map(a => {
          const st = priorityStyles[a.priority];
          const Icon = st.icon;
          return (
            <Card key={a.id} className={`p-5 border-2 ${st.color} hover:shadow-md transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white border ${st.color.split(' ')[0]}`}>
                  <Icon className={`w-6 h-6 ${st.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-black text-slate-900">{a.title}</h3>
                    <Badge className={st.badge}>{a.category}</Badge>
                    {a.priority === 'critical' && <Badge variant="outline" className="text-red-700 border-red-300 animate-pulse">عاجل</Badge>}
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{a.content}</p>
                  <p className="text-xs text-slate-500">{a.author} · {a.date}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
