import React, { useState } from 'react';
import { FileText, Download, Eye, Plus, Calendar, User } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockReports } from '../mock';
import { toast } from 'sonner';

const statusColors = {
  'مكتمل': 'bg-emerald-100 text-emerald-700',
  'قيد الإعداد': 'bg-amber-100 text-amber-700',
  'مسودة': 'bg-slate-100 text-slate-700',
};

const typeIcons = {
  'يومي': 'bg-blue-100 text-blue-600',
  'أسبوعي': 'bg-purple-100 text-purple-600',
  'شهري': 'bg-orange-100 text-orange-600',
  'ربع سنوي': 'bg-pink-100 text-pink-600',
};

export default function Reports() {
  const [reports] = useState(mockReports);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">التقارير</h2>
          <p className="text-sm text-slate-500">جميع التقارير المنشأة</p>
        </div>
        <Button onClick={() => toast.info('إنشاء تقرير جديد')} className="bg-gradient-to-l from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md">
          <Plus className="w-4 h-4 ml-2" /> إنشاء تقرير
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => (
          <Card key={r.id} className="p-5 border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeIcons[r.type] || 'bg-slate-100 text-slate-600'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <Badge className={statusColors[r.status]}>{r.status}</Badge>
            </div>
            <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 min-h-[3rem]">{r.title}</h3>
            <div className="space-y-1.5 text-xs text-slate-500 mb-4">
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {r.date}</div>
              <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {r.author}</div>
              <Badge variant="outline" className="text-[10px] mt-2">{r.type}</Badge>
            </div>
            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info('عرض التقرير')}>
                <Eye className="w-3.5 h-3.5 ml-1" /> عرض
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-orange-700 border-orange-200 hover:bg-orange-50" onClick={() => toast.success('تم بدء التحميل')}>
                <Download className="w-3.5 h-3.5 ml-1" /> تحميل
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
