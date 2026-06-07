import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Star, Award, Crown, Medal } from 'lucide-react';
import api from '../api';

export default function Honors() {
  const [users, setUsers] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/users').then(r => setUsers(r.data)).catch(() => {}),
      api.get('/promotions').then(r => setPromotions(r.data)).catch(() => {}),
    ]);
  }, []);

  const bestMember = users[0] || { name: 'غير محدد', rank: '-' };
  const bestOfficer = users.find(u => ['رائد', 'عقيد', 'نقيب'].includes(u.rank)) || bestMember;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">لوحة الشرف</h2>
        <p className="text-sm text-slate-500">تكريم المتميزين لهذا الشهر</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-red-200 bg-gradient-to-br from-red-50 via-blue-50 to-red-100 relative overflow-hidden">
          <div className="absolute top-3 left-3 opacity-10"><Crown className="w-24 h-24 text-red-700" /></div>
          <Badge className="bg-red-600 text-white font-bold mb-3">أفضل فرد</Badge>
          <div className="flex justify-center my-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg"><Crown className="w-10 h-10 text-white" /></div>
          </div>
          <p className="text-center font-black text-slate-900 text-lg">{bestMember.name}</p>
          <p className="text-center text-sm text-red-800 font-bold">{bestMember.rank}</p>
          <p className="text-center text-xs text-slate-600 mt-2">تميز في أداء الواجب</p>
        </Card>

        <Card className="p-6 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 relative overflow-hidden">
          <div className="absolute top-3 left-3 opacity-10"><Star className="w-24 h-24 text-blue-700" /></div>
          <Badge className="bg-blue-700 text-white font-bold mb-3">أفضل ضابط</Badge>
          <div className="flex justify-center my-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center shadow-lg"><Star className="w-10 h-10 text-white" /></div>
          </div>
          <p className="text-center font-black text-slate-900 text-lg">{bestOfficer.name}</p>
          <p className="text-center text-sm text-blue-700 font-bold">{bestOfficer.rank}</p>
          <p className="text-center text-xs text-slate-600 mt-2">قيادة عمليات ناجحة</p>
        </Card>

        <Card className="p-6 border-red-200 bg-gradient-to-br from-red-50 to-blue-50 relative overflow-hidden">
          <div className="absolute top-3 left-3 opacity-10"><Trophy className="w-24 h-24 text-red-700" /></div>
          <Badge className="bg-gradient-to-l from-blue-700 to-red-700 text-white font-bold mb-3">أفضل قسم</Badge>
          <div className="flex justify-center my-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg"><Trophy className="w-10 h-10 text-white" /></div>
          </div>
          <p className="text-center font-black text-slate-900 text-lg">الأمن الداخلي</p>
          <p className="text-center text-xs text-slate-600 mt-2">أعلى نسبة التزام 96%</p>
        </Card>
      </div>

      <Card className="p-6 border-blue-100">
        <div className="flex items-center gap-2 mb-4"><Medal className="w-5 h-5 text-red-600" /><h3 className="font-black text-slate-900">المتميزون لهذا الشهر</h3></div>
        <div className="space-y-3">
          {promotions.slice(0, 5).map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 p-4 border border-blue-50 rounded-lg hover:border-red-200 hover:bg-red-50/30 transition-all">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-blue-100 rounded-full flex items-center justify-center text-lg font-black text-red-700 border-2 border-red-300">{i + 1}</div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-600">ترقية إلى {p.toRank} · {p.department}</p>
              </div>
              <Award className="w-5 h-5 text-red-600" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
