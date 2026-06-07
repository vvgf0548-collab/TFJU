import React, { useState } from 'react';
import { Plus, AlertTriangle, Search, CheckCircle, Clock as ClockIcon, Scale } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockViolations, mockMembers } from '../mock';
import { toast } from 'sonner';

const severityColors = {
  'عالية': 'bg-red-100 text-red-700 border-red-200',
  'متوسطة': 'bg-amber-100 text-amber-700 border-amber-200',
  'بسيطة': 'bg-slate-100 text-slate-700 border-slate-200',
};
const statusColors = {
  'مفتوحة': 'bg-blue-100 text-blue-700',
  'قيد المراجعة': 'bg-amber-100 text-amber-700',
  'مغلقة': 'bg-emerald-100 text-emerald-700',
};

export default function Violations() {
  const [violations, setViolations] = useState(mockViolations);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ soldierId: '', type: '', severity: 'متوسطة', description: '' });

  const filtered = violations.filter(v => {
    if (filter !== 'all' && v.status !== filter) return false;
    if (search && !v.soldierName.includes(search) && !v.type.includes(search)) return false;
    return true;
  });

  const handleAdd = () => {
    if (!form.soldierId || !form.type) { toast.error('أكمل جميع الحقول'); return; }
    const soldier = mockMembers.find(s => s.id === form.soldierId);
    setViolations([{ id: 'v' + Date.now(), soldierName: soldier.name, militaryNumber: soldier.militaryNumber, type: form.type, severity: form.severity, date: new Date().toISOString().split('T')[0], status: 'مفتوحة', description: form.description }, ...violations]);
    setOpen(false);
    setForm({ soldierId: '', type: '', severity: 'متوسطة', description: '' });
    toast.success('تم تسجيل المخالفة');
  };
  const updateStatus = (id, status) => {
    setViolations(violations.map(v => v.id === id ? { ...v, status } : v));
    toast.success(`تم التحديث إلى ${status}`);
  };

  const counts = {
    open: violations.filter(v => v.status === 'مفتوحة').length,
    review: violations.filter(v => v.status === 'قيد المراجعة').length,
    closed: violations.filter(v => v.status === 'مغلقة').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">المخالفات والعقوبات</h2>
          <p className="text-sm text-slate-500">إدارة المخالفات والإنذارات</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold border border-amber-500/30">
              <Plus className="w-4 h-4 ml-2" /> تسجيل مخالفة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader><DialogTitle>تسجيل مخالفة جديدة</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>العضو</Label>
                <Select value={form.soldierId} onValueChange={v => setForm({ ...form, soldierId: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر العضو" /></SelectTrigger>
                  <SelectContent>{mockMembers.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — {s.militaryNumber}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>نوع المخالفة</Label><Input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>درجة الخطورة</Label>
                <Select value={form.severity} onValueChange={v => setForm({ ...form, severity: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="بسيطة">بسيطة</SelectItem>
                    <SelectItem value="متوسطة">متوسطة</SelectItem>
                    <SelectItem value="عالية">عالية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>التفاصيل</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button onClick={handleAdd} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold">حفظ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Card className="p-4 border-blue-100 bg-blue-50/50">
          <div className="flex items-center gap-2 mb-1"><ClockIcon className="w-4 h-4 text-blue-600" /><p className="text-xs text-blue-700 font-bold">مفتوحة</p></div>
          <p className="text-2xl font-black text-blue-900">{counts.open}</p>
        </Card>
        <Card className="p-4 border-amber-100 bg-amber-50/50">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4 text-amber-600" /><p className="text-xs text-amber-700 font-bold">قيد المراجعة</p></div>
          <p className="text-2xl font-black text-amber-900">{counts.review}</p>
        </Card>
        <Card className="p-4 border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-emerald-600" /><p className="text-xs text-emerald-700 font-bold">مغلقة</p></div>
          <p className="text-2xl font-black text-emerald-900">{counts.closed}</p>
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
              <TabsTrigger value="مفتوحة">مفتوحة</TabsTrigger>
              <TabsTrigger value="قيد المراجعة">مراجعة</TabsTrigger>
              <TabsTrigger value="مغلقة">مغلقة</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-3">
          {filtered.map(v => (
            <div key={v.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-stone-100 rounded-lg hover:border-amber-200 hover:bg-amber-50/20 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${v.severity === 'عالية' ? 'bg-red-100' : v.severity === 'متوسطة' ? 'bg-amber-100' : 'bg-stone-100'}`}>
                <Scale className={`w-5 h-5 ${v.severity === 'عالية' ? 'text-red-600' : v.severity === 'متوسطة' ? 'text-amber-600' : 'text-slate-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900">{v.type}</h4>
                  <Badge variant="outline" className={severityColors[v.severity]}>{v.severity}</Badge>
                  <Badge className={statusColors[v.status]}>{v.status}</Badge>
                </div>
                <p className="text-sm text-slate-600">{v.soldierName} · <span className="font-mono">{v.militaryNumber}</span></p>
                <p className="text-xs text-slate-500 mt-1">{v.description}</p>
                <p className="text-xs text-slate-400 mt-1">{v.date}</p>
              </div>
              <div className="flex gap-2">
                {v.status !== 'مغلقة' && <Button size="sm" variant="outline" onClick={() => updateStatus(v.id, 'مغلقة')} className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"><CheckCircle className="w-3.5 h-3.5 ml-1" /> إغلاق</Button>}
                {v.status === 'مفتوحة' && <Button size="sm" variant="outline" onClick={() => updateStatus(v.id, 'قيد المراجعة')} className="text-amber-700 border-amber-200 hover:bg-amber-50">مراجعة</Button>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
