import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { IdCard, Plus, RefreshCw, Edit, Search } from 'lucide-react';
import { mockCards } from '../mock';
import { toast } from 'sonner';

export default function Cards() {
  const [cards] = useState(mockCards);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">البطاقات العسكرية</h2>
          <p className="text-sm text-slate-500">إدارة البطاقات والتصاريح الرسمية</p>
        </div>
        <Button onClick={() => toast.success('تم إرسال طلب بطاقة جديدة')} className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold border border-amber-500/30">
          <Plus className="w-4 h-4 ml-2" /> طلب بطاقة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(c => (
          <Card key={c.id} className="p-0 overflow-hidden border-stone-200 mil-shadow group hover:scale-[1.01] transition-transform">
            <div className="camo-bg p-5 relative">
              <div className="absolute top-0 left-0 right-0 h-1 safety-stripe"></div>
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-amber-500 text-slate-900 font-bold">{c.status}</Badge>
                <IdCard className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-white font-black text-lg mb-1">{c.type}</h3>
              <p className="text-amber-300 text-xs">بوابة اللواء حمد الأمنية</p>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 bg-white">
              <div>
                <p className="text-[10px] text-slate-500">تاريخ الإصدار</p>
                <p className="text-sm font-bold text-slate-900">{c.issueDate}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">تاريخ الانتهاء</p>
                <p className="text-sm font-bold text-slate-900">{c.expiryDate}</p>
              </div>
            </div>
            <div className="flex border-t border-stone-100">
              <Button variant="ghost" className="flex-1 rounded-none text-amber-700 hover:bg-amber-50" onClick={() => toast.info('طلب تجديد')}><RefreshCw className="w-4 h-4 ml-2" /> تجديد</Button>
              <Button variant="ghost" className="flex-1 rounded-none text-slate-700 hover:bg-slate-50 border-r" onClick={() => toast.info('تعديل')}><Edit className="w-4 h-4 ml-2" /> تعديل</Button>
              <Button variant="ghost" className="flex-1 rounded-none text-slate-700 hover:bg-slate-50 border-r" onClick={() => toast.info('متابعة')}><Search className="w-4 h-4 ml-2" /> متابعة</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
