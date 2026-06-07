import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { LifeBuoy, MessageCircle, Lightbulb, Wrench, Phone, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Support() {
  const [form, setForm] = useState({ subject: '', message: '' });

  const submit = (kind) => {
    if (!form.subject.trim() || !form.message.trim()) { toast.error('أكمل جميع الحقول'); return; }
    toast.success(`تم إرسال ${kind} بنجاح`);
    setForm({ subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">الدعم والتواصل</h2>
        <p className="text-sm text-slate-500">نحن هنا لمساعدتك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-stone-200 flex items-center gap-4 hover:border-amber-200 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><Phone className="w-6 h-6 text-amber-700" /></div>
          <div>
            <p className="text-xs text-slate-500">الهاتف المباشر</p>
            <p className="font-black text-slate-900 font-mono">920-001-001</p>
          </div>
        </Card>
        <Card className="p-5 border-stone-200 flex items-center gap-4 hover:border-amber-200 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><Mail className="w-6 h-6 text-amber-700" /></div>
          <div>
            <p className="text-xs text-slate-500">البريد الرسمي</p>
            <p className="font-bold text-slate-900">support@liwa-hamad.gov</p>
          </div>
        </Card>
        <Card className="p-5 border-stone-200 flex items-center gap-4 hover:border-amber-200 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center"><LifeBuoy className="w-6 h-6 text-amber-700" /></div>
          <div>
            <p className="text-xs text-slate-500">ساعات العمل</p>
            <p className="font-bold text-slate-900">24/7 طوال الأسبوع</p>
          </div>
        </Card>
      </div>

      <Card className="p-6 border-stone-200">
        <Tabs defaultValue="complaint">
          <TabsList className="bg-stone-100 mb-4">
            <TabsTrigger value="complaint"><MessageCircle className="w-4 h-4 ml-1" /> شكوى</TabsTrigger>
            <TabsTrigger value="suggestion"><Lightbulb className="w-4 h-4 ml-1" /> اقتراح</TabsTrigger>
            <TabsTrigger value="ticket"><Wrench className="w-4 h-4 ml-1" /> تذكرة فنية</TabsTrigger>
          </TabsList>

          {[
            { value: 'complaint', label: 'شكوى', desc: 'قدم شكواك وسيتم دراستها بسرية تامة' },
            { value: 'suggestion', label: 'اقتراح', desc: 'شاركنا بأفكارك لتحسين الخدمات' },
            { value: 'ticket', label: 'تذكرة فنية', desc: 'ابلغ عن مشكلة تقنية في النظام' },
          ].map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              <p className="text-sm text-slate-500">{tab.desc}</p>
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="اختصر عنوان رسالتك..." />
              </div>
              <div className="space-y-2">
                <Label>التفاصيل</Label>
                <Textarea rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="اشرح بالتفصيل..." />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => submit(tab.label)} className="bg-gradient-to-l from-blue-700 to-red-700 hover:from-blue-800 hover:to-red-800 text-white font-bold">
                  <Send className="w-4 h-4 ml-2" /> إرسال
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
