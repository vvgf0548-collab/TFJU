import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Megaphone, AlertTriangle, FileText, Bell, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import api from '../api';
import { useAuth } from '../App';

const priorityStyles = {
  critical: { color: 'border-red-300 bg-red-50/50', icon: AlertTriangle, iconColor: 'text-red-600', badge: 'bg-red-600 text-white' },
  high: { color: 'border-blue-300 bg-blue-50/50', icon: Bell, iconColor: 'text-blue-600', badge: 'bg-blue-600 text-white' },
  normal: { color: 'border-blue-100', icon: FileText, iconColor: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
};

export default function Announcements() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'تعميم', priority: 'normal', content: '' });

  const load = () => api.get('/announcements').then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? items : items.filter(a => a.category === filter);

  const submit = async () => {
    if (!form.title.trim() || !form.content.trim()) { toast.error('أكمل الحقول'); return; }
    try {
      await api.post('/announcements', form);
      toast.success('تم نشر التعميم');
      setForm({ title: '', category: 'تعميم', priority: 'normal', content: '' });
      setOpen(false);
      load();
    } catch (e) { toast.error(e.response?.data?.detail || 'فشل'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">الإعلانات والتعاميم</h2>
          <p className="text-sm text-slate-500">تعاميم القيادة والقرارات الرسمية</p>
        </div>
        {user?.role === 'admin' && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-l from-blue-700 to-red-700 hover:from-blue-800 hover:to-red-800 text-white font-bold"><Plus className="w-4 h-4 ml-2" /> تعميم جديد</Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader><DialogTitle>إنشاء تعميم</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2"><Label>العنوان</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>التصنيف</Label>
                    <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تعميم">تعميم</SelectItem>
                        <SelectItem value="تنبيه">تنبيه</SelectItem>
                        <SelectItem value="قرار">قرار</SelectItem>
                        <SelectItem value="تحديث">تحديث</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الأولوية</Label>
                    <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">عادية</SelectItem>
                        <SelectItem value="high">مرتفعة</SelectItem>
                        <SelectItem value="critical">حرجة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>المحتوى</Label><Textarea rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                <Button onClick={submit} className="bg-gradient-to-l from-blue-700 to-red-700 text-white">نشر</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="bg-blue-50">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="تعميم">تعاميم</TabsTrigger>
          <TabsTrigger value="تنبيه">تنبيهات</TabsTrigger>
          <TabsTrigger value="قرار">قرارات</TabsTrigger>
          <TabsTrigger value="تحديث">تحديثات</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.map(a => {
          const st = priorityStyles[a.priority] || priorityStyles.normal;
          const Icon = st.icon;
          return (
            <Card key={a.id} className={`p-5 border-2 ${st.color} hover:shadow-md transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white border ${st.color.split(' ')[0]}`}><Icon className={`w-6 h-6 ${st.iconColor}`} /></div>
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
        {filtered.length === 0 && <Card className="p-10 text-center text-slate-400"><Megaphone className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>لا توجد تعاميم</p></Card>}
      </div>
    </div>
  );
}
