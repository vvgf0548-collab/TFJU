import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, Star, Award, Crown, Medal } from 'lucide-react';
import { mockHonors } from '../mock';

export default function Honors() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">لوحة الشرف</h2>
        <p className="text-sm text-slate-500">تكريم المتميزين لهذا الشهر</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 relative overflow-hidden">
          <div className="absolute top-3 left-3 opacity-10"><Crown className="w-24 h-24 text-amber-700" /></div>
          <Badge className="bg-amber-600 text-white font-bold mb-3">أفضل فرد</Badge>
          <div className="flex justify-center my-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-lg">
              <Crown className="w-10 h-10 text-slate-900" />
            </div>
          </div>
          <p className="text-center font-black text-slate-900 text-lg">{mockHonors.bestMember.name}</p>
          <p className="text-center text-sm text-amber-800 font-bold">{mockHonors.bestMember.rank}</p>
          <p className="text-center text-xs text-slate-600 mt-2">{mockHonors.bestMember.reason}</p>
        </Card>

        <Card className="p-6 border-stone-200 bg-gradient-to-br from-slate-50 to-stone-100 relative overflow-hidden">
          <div className="absolute top-3 left-3 opacity-10"><Star className="w-24 h-24 text-slate-700" /></div>
          <Badge className="bg-slate-700 text-white font-bold mb-3">أفضل ضابط</Badge>
          <div className="flex justify-center my-4">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center border-4 border-slate-300 shadow-lg">
              <Star className="w-10 h-10 text-amber-400" />
            </div>
          </div>
          <p className="text-center font-black text-slate-900 text-lg">{mockHonors.bestOfficer.name}</p>
          <p className="text-center text-sm text-slate-600 font-bold">{mockHonors.bestOfficer.rank}</p>
          <p className="text-center text-xs text-slate-600 mt-2">{mockHonors.bestOfficer.reason}</p>
        </Card>

        <Card className="p-6 border-stone-200 bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
          <div className="absolute top-3 left-3 opacity-10"><Trophy className="w-24 h-24 text-orange-700" /></div>
          <Badge className="bg-orange-600 text-white font-bold mb-3">أفضل قسم</Badge>
          <div className="flex justify-center my-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-4 border-orange-300 shadow-lg">
              <Trophy className="w-10 h-10 text-slate-900" />
            </div>
          </div>
          <p className="text-center font-black text-slate-900 text-lg">{mockHonors.bestDepartment.name}</p>
          <p className="text-center text-xs text-slate-600 mt-2">{mockHonors.bestDepartment.reason}</p>
        </Card>
      </div>

      <Card className="p-6 border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <Medal className="w-5 h-5 text-amber-600" />
          <h3 className="font-black text-slate-900">المتميزون لهذا الشهر</h3>
        </div>
        <div className="space-y-3">
          {mockHonors.monthly.map((h, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-stone-100 rounded-lg hover:border-amber-200 hover:bg-amber-50/40 transition-all">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg font-black text-amber-700 border-2 border-amber-300">{i + 1}</div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{h.name}</p>
                <p className="text-xs text-slate-600">{h.achievement}</p>
              </div>
              <Award className="w-5 h-5 text-amber-600" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
