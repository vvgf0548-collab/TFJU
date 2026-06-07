import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus, FilePlus, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { mockRequests } from '../mock';
import { toast } from 'sonner';

const statusStyles = {
  'قيد المراجعة': { color: 'bg-amber-100 text-amber-700', icon: ClockIcon },
  'موافق': { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  'مرفوض': { color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function Requests() {
  const [requests, setRequests] = useState(mockRequests);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'إجازة', details: '' });

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const handleAdd = () => {
    if (!form.details.trim()) { toast.error('أدخل تفاصيل الطلب'); return; }
    setRequests([{ id: 'req' + Date.now(), type: form.type, applicant: 'أنت', date: new Date().toISOString().split('T')[0], status: 'قيد المراجعة', details: form.details }, ...requests]);
    setForm({ type: 'إجازة', details: '' });
    setOpen(false);
    toast.success('تم إرسال الطلب للقيادة');
  };

  const types = ['إجازة', 'ترقية', 'نقل', 'استقالة', 'عودة للخدمة'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">الطلبات العسكرية</h2>
          <p className="text-sm text-slate-500">تقديم الطلبات ومتابعتها</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-l from-blue-700 to-red-700 hover:from-blue-800 hover:to-red-800 text-white font-bold">
              <Plus className="w-4 h-4 ml-2" /> طلب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader><DialogTitle>تقديم طلب جديد</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>نوع الطلب</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>تفاصيل الطلب</Label>
                <Textarea value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="اشرح سبب الطلب بالتفصيل..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button onClick={handleAdd} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold">إرسال</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {types.map(t => (
          <button key={t} onClick={() => { setForm({ type: t, details: '' }); setOpen(true); }} className="p-3 rounded-lg border border-stone-200 bg-white hover:bg-amber-50 hover:border-amber-300 transition-all text-center">
            <FilePlus className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-700">طلب {t}</p>
          </button>
        ))}
      </div>

      <Card className="p-4 md:p-6 border-stone-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-slate-900">سجل الطلبات</h3>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-stone-100">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="قيد المراجعة">قيد المراجعة</TabsTrigger>
              <TabsTrigger value="موافق">موافق</TabsTrigger>
              <TabsTrigger value="مرفوض">مرفوض</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="space-y-2">
          {filtered.map(r => {
            const st = statusStyles[r.status];
            const Icon = st.icon;
            return (
              <div key={r.id} className="flex items-center gap-4 p-4 border border-stone-100 rounded-lg hover:border-amber-200 transition-all">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <FilePlus className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-slate-900">طلب {r.type}</h4>
                    <Badge className={st.color}><Icon className="w-3 h-3 ml-1" /> {r.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{r.applicant} · {r.date}</p>
                  <p className="text-sm text-slate-700 mt-1">{r.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
