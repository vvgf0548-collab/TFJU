import React, { useState } from 'react';
import { User, Bell, Lock, Palette, Globe, Save } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { useAuth } from '../App';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    militaryNumber: user?.militaryNumber || '',
    rank: user?.rank || '',
    unit: user?.unit || '',
  });
  const [notifications, setNotifications] = useState({ email: true, push: true, sound: false });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">الإعدادات</h2>
        <p className="text-sm text-slate-500">إدارة حسابك وتفضيلاتك</p>
      </div>

      {/* Profile */}
      <Card className="p-6 border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">الملف الشخصي</h3>
            <p className="text-xs text-slate-500">تحديث بياناتك الشخصية</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>الاسم الكامل</Label>
            <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>الرقم العسكري</Label>
            <Input value={profile.militaryNumber} disabled className="bg-slate-50" />
          </div>
          <div className="space-y-2">
            <Label>الرتبة</Label>
            <Input value={profile.rank} onChange={e => setProfile({ ...profile, rank: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>الوحدة</Label>
            <Input value={profile.unit} onChange={e => setProfile({ ...profile, unit: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={() => toast.success('تم حفظ التغييرات')} className="bg-orange-500 hover:bg-orange-600 text-white">
            <Save className="w-4 h-4 ml-2" /> حفظ
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">الإشعارات</h3>
            <p className="text-xs text-slate-500">اختر أنواع الإشعارات</p>
          </div>
        </div>
        <div className="space-y-1">
          {[
            { key: 'email', label: 'إشعارات البريد', desc: 'استلم تحديثات عبر البريد' },
            { key: 'push', label: 'إشعارات التطبيق', desc: 'تنبيهات فورية في اللوحة' },
            { key: 'sound', label: 'الأصوات', desc: 'تشغيل صوت عند وصول إشعار' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="font-medium text-slate-900 text-sm">{n.label}</p>
                <p className="text-xs text-slate-500">{n.desc}</p>
              </div>
              <Switch checked={notifications[n.key]} onCheckedChange={(v) => setNotifications({ ...notifications, [n.key]: v })} />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">الأمان</h3>
            <p className="text-xs text-slate-500">إدارة أمان الحساب</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => toast.info('سيتم تفعيل هذه الميزة لاحقاً')}>تفعيل التحقق الثنائي</Button>
      </Card>
    </div>
  );
}
