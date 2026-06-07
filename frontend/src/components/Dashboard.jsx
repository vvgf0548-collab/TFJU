import React from 'react';
import { Users, UserCheck, AlertTriangle, FileText, TrendingUp, TrendingDown, ArrowUpRight, Activity, Shield, Target } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { mockStats, mockComplianceChart, mockUnits, mockViolations, mockAttendance } from '../mock';

function StatCard({ icon: Icon, label, value, change, accent, suffix }) {
  const isPositive = change >= 0;
  return (
    <Card className="p-5 stat-card-shadow border-slate-100 hover:shadow-lg transition-all relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1 h-full ${accent}`}></div>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent.replace('bg-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-5 h-5 ${accent.replace('bg-', 'text-')}`} strokeWidth={2.2} />
        </div>
        {change !== undefined && (
          <Badge variant="secondary" className={`text-xs ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />}
            {Math.abs(change)}%
          </Badge>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const maxChart = Math.max(...mockComplianceChart.map(c => c.rate));
  const maxAttendance = Math.max(...mockAttendance.map(a => a.present));

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-l from-slate-900 via-slate-800 to-orange-900 rounded-2xl p-6 md:p-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-orange-300 text-sm font-medium mb-2">تقرير اليوم</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">نظرة عامة على الإدارة</h2>
            <p className="text-slate-300 text-sm">جميع الوحدات تعمل بكفاءة · معدل الامتثال {mockStats.complianceRate}%</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">التاريخ</p>
              <p className="text-white font-semibold">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <Shield className="w-7 h-7 text-orange-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="إجمالي الجنود" value={mockStats.totalSoldiers} change={2.3} accent="bg-orange-500" />
        <StatCard icon={UserCheck} label="الحاضرون اليوم" value={mockStats.presentToday} change={1.8} accent="bg-amber-500" />
        <StatCard icon={AlertTriangle} label="مخالفات نشطة" value={mockStats.activeViolations} change={-12.5} accent="bg-red-500" />
        <StatCard icon={Target} label="معدل الامتثال" value={mockStats.complianceRate} suffix="%" change={mockStats.monthlyChange} accent="bg-emerald-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Chart */}
        <Card className="lg:col-span-2 p-6 border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">معدل الامتثال الشهري</h3>
              <p className="text-sm text-slate-500">تطور نسبة الالتزام خلال الأشهر السبعة الماضية</p>
            </div>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700">
              <Activity className="w-3 h-3 ml-1" /> متصاعد
            </Badge>
          </div>
          <div className="h-56 flex items-end justify-between gap-3 px-2">
            {mockComplianceChart.map((c, i) => {
              const height = (c.rate / 100) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-xs font-semibold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">{c.rate}%</div>
                  <div className="w-full relative" style={{ height: '180px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-md hover:from-orange-600 hover:to-amber-500 transition-all cursor-pointer"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500">{c.month}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Units */}
        <Card className="p-6 border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-lg">أداء الوحدات</h3>
            <p className="text-sm text-slate-500">معدل الامتثال لكل وحدة</p>
          </div>
          <div className="space-y-4">
            {mockUnits.map((u, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="text-sm font-semibold text-slate-700">{u.name}</span>
                    <span className="text-xs text-slate-400 mr-2">({u.count})</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{u.compliance}%</span>
                </div>
                <Progress value={u.compliance} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row - Recent violations + Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-lg">آخر المخالفات</h3>
            <a href="/violations" className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
              عرض الكل <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="space-y-3">
            {mockViolations.slice(0, 4).map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.severity === 'عالية' ? 'bg-red-100' : v.severity === 'متوسطة' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                  <AlertTriangle className={`w-5 h-5 ${v.severity === 'عالية' ? 'text-red-600' : v.severity === 'متوسطة' ? 'text-amber-600' : 'text-slate-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">{v.soldierName}</p>
                  <p className="text-xs text-slate-500 truncate">{v.type}</p>
                </div>
                <Badge variant="outline" className="text-xs">{v.date}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-slate-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-lg">الحضور الأسبوعي</h3>
            <p className="text-sm text-slate-500">إجمالي الحاضرين خلال الأيام السبعة الماضية</p>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {mockAttendance.map((a, i) => {
              const total = a.present + a.absent + a.leave;
              const presentPct = (a.present / total) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-xs font-semibold text-slate-700 opacity-0 group-hover:opacity-100">{a.present}</div>
                  <div className="w-full bg-slate-100 rounded-md overflow-hidden" style={{ height: '150px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 mt-auto rounded-md transition-all hover:from-emerald-600"
                      style={{ height: `${presentPct}%`, marginTop: `${100 - presentPct}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500">{a.date.split('-')[2]}/{a.date.split('-')[1]}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
