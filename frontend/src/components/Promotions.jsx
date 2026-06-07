import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Award, Star, ArrowLeft, Medal, BookOpen } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import api from '../api';

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [medals, setMedals] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/promotions').then(r => setPromotions(r.data)).catch(() => {}),
      api.get('/medals').then(r => setMedals(r.data)).catch(() => {}),
    ]);
  }, []);

  const conditions = [
    { rank: 'نقيب', years: 5, exam: 'اجتياز الاختبار الأساسي', cond: 'سجل نظيف' },
    { rank: 'رائد', years: 8, exam: 'اجتياز دورة القيادة', cond: 'توصية إدارية' },
    { rank: 'عقيد', years: 12, exam: 'اجتياز دورة الأركان', cond: 'تقييم ممتاز' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">الترقيات والأوسمة</h2>
        <p className="text-sm text-slate-500">سجل الترقيات والتكريمات</p>
      </div>

      <Tabs defaultValue="promotions">
        <TabsList className="bg-blue-50">
          <TabsTrigger value="promotions">الترقيات</TabsTrigger>
          <TabsTrigger value="conditions">شروط الترقية</TabsTrigger>
          <TabsTrigger value="medals">الأوسمة</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map(p => (
              <Card key={p.id} className="p-5 border-blue-100 bg-gradient-to-br from-blue-50 to-red-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center"><Award className="w-6 h-6 text-white" /></div>
                  <div>
                    <p className="font-black text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.department}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm bg-white rounded-lg p-3 border border-blue-100">
                  <Badge variant="outline" className="bg-slate-100">{p.fromRank}</Badge>
                  <ArrowLeft className="w-4 h-4 text-red-600" />
                  <Badge className="bg-gradient-to-l from-blue-700 to-red-700 text-white font-bold">{p.toRank}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-3 text-center">{p.date}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conditions" className="mt-4">
          <Card className="p-6 border-blue-100">
            <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-red-600" /><h3 className="font-black text-slate-900">شروط الترقيات</h3></div>
            <div className="space-y-3">
              {conditions.map((c, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><Star className="w-5 h-5 text-red-700" /></div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">الترقية إلى {c.rank}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs">{c.years} سنوات خدمة</Badge>
                      <Badge variant="outline" className="text-xs">{c.exam}</Badge>
                      <Badge variant="outline" className="text-xs">{c.cond}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="medals" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medals.map(m => (
              <Card key={m.id} className="p-6 border-blue-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-red-700 rounded-full flex items-center justify-center shrink-0"><Medal className="w-8 h-8 text-white" /></div>
                <div>
                  <h4 className="font-black text-slate-900">{m.name}</h4>
                  <p className="text-sm text-slate-700">{m.recipient}</p>
                  <p className="text-xs text-slate-500">{m.reason}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{m.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
