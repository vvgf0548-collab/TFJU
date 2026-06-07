import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Crosshair, MapPin, Users, Calendar, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import api from '../api';
import { useAuth } from '../App';

const statusColors = {
  'جارية': 'bg-red-100 text-red-700 border-red-200',
  'مجدولة': 'bg-blue-100 text-blue-700 border-blue-200',
  'مكتملة': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function Operations() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'دورية', location: '', team: 6, status: 'مجدولة' });

  const load = () => api.get('/operations').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? items : items.filter(o => o.type === filter);

  const submit = async () => {
    if (!form.name.trim() || !form.location.trim()) { toast.error('أكمل الحقول'); return; }
    try {
      await api.post('/operations', { ...form, team: Number(form.team) });
      toast.success('تم إنشاء العملية');
      setForm({ name: '', type: 'دورية', location: '', team: 6, status: 'مجدولة' });
      setOpen(false);
      load();
    } catch (e) { toast.error(e.response?.data?.detail || 'فشل'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">العمليات الأمنية</h2>
          <p className="text-sm text-slate-500">العمليات الجارية والمجدولة</p>
        </div>
        {user?.role === 'admin' && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-l from-blue-700 to-red-700 hover:opacity-90 text-white font-bold"><Plus className="w-4 h-4 ml-2" /> إنشاء عملية</Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader><DialogTitle>إنشاء عملية جديدة</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2"><Label>الاسم</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>النوع</Label>
                    <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="دورية">دورية</SelectItem>
                        <SelectItem value="مداهمة">مداهمة</SelectItem>
                        <SelectItem value="نقطة تفتيش">نقطة تفتيش</SelectItem>
                        <SelectItem value="مهمة خاصة">مهمة خاصة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>الحالة</Label>
                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="مجدولة">مجدولة</SelectItem>
                        <SelectItem value="جارية">جارية</SelectItem>
                        <SelectItem value="مكتملة">مكتملة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>الموقع</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                <div className="space-y-2"><Label>حجم الفريق</Label><Input type="number" value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                <Button onClick={submit} className="bg-gradient-to-l from-blue-700 to-red-700 text-white">حفظ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-blue-50">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="مداهمة">مداهمات</TabsTrigger>
          <TabsTrigger value="نقطة تفتيش">نقاط تفتيش</TabsTrigger>
          <TabsTrigger value="دورية">دوريات</TabsTrigger>
          <TabsTrigger value="مهمة خاصة">مهمات خاصة</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(op => (
          <Card key={op.id} className="p-5 border-blue-100 hover:shadow-lg hover:border-red-200 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-red-700 rounded-xl flex items-center justify-center"><Crosshair className="w-5 h-5 text-white" /></div>
              <Badge variant="outline" className={statusColors[op.status]}>{op.status}</Badge>
            </div>
            <h3 className="font-black text-slate-900 text-base mb-1">{op.name}</h3>
            <Badge variant="secondary" className="text-[10px] bg-blue-50 mb-3">{op.type}</Badge>
            <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-blue-50">
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-600" /> {op.location}</div>
              <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-red-600" /> {op.team} فرد</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-red-600" /> {op.date}</div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <Card className="col-span-full p-10 text-center text-slate-400"><Crosshair className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>لا توجد عمليات</p></Card>}
      </div>
    </div>
  );
}
