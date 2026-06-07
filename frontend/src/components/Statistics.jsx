import React from 'react';
import { Card } from './ui/card';
import { Users, Crosshair, FileText, UserCheck, Target, Award, TrendingUp, Shield } from 'lucide-react';
import { mockStats, mockComplianceChart, mockDepartments } from '../mock';
import { Progress } from './ui/progress';

function BigStat({ icon: Icon, label, value, color, suffix }) {
  return (
    <Card className="p-6 border-stone-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-500" />
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </div>
    </Card>
  );
}

export default function Statistics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">إحصائيات القطاع</h2>
        <p className="text-sm text-slate-500">نظرة شاملة على أداء اللواء</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <BigStat icon={Users} label="إجمالي الأعضاء" value={mockStats.totalMembers} color="bg-slate-900" />
        <BigStat icon={Crosshair} label="إجمالي العمليات" value={mockStats.activeOperations} color="bg-blue-600" />
        <BigStat icon={FileText} label="إجمالي التقارير" value={mockStats.totalReports} color="bg-amber-600" />
        <BigStat icon={UserCheck} label="نسبة الحضور" value={94} suffix="%" color="bg-emerald-600" />
        <BigStat icon={Target} label="نسبة الإنجاز" value={mockStats.complianceRate} suffix="%" color="bg-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-stone-200">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-600" /> معدل الالتزام الشهري</h3>
          <div className="h-56 flex items-end justify-between gap-3">
            {mockComplianceChart.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-slate-700">{c.rate}%</div>
                <div className="w-full bg-gradient-to-t from-slate-800 to-amber-500 rounded-t-md" style={{ height: `${(c.rate / 100) * 180}px` }}></div>
                <span className="text-xs text-slate-500">{c.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-stone-200">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-amber-600" /> أداء الأقسام</h3>
          <div className="space-y-3">
            {mockDepartments.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-slate-700">{d.name} <span className="text-xs text-slate-400">({d.count})</span></span>
                  <span className="text-sm font-black text-slate-900">{d.compliance}%</span>
                </div>
                <Progress value={d.compliance} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
