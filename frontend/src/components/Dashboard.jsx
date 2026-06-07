import React from 'react';
import { Users, UserCheck, Crosshair, FileText, TrendingUp, TrendingDown, ArrowUpRight, Shield, Target, Megaphone, Award, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useNavigate } from 'react-router-dom';
import { mockStats, mockComplianceChart, mockDepartments, mockAnnouncements, mockPromotions } from '../mock';
import { useAuth } from '../App';

function StatCard({ icon: Icon, label, value, change, accent, suffix }) {
  const isPositive = change >= 0;
  return (
    <Card className="p-5 stat-card-shadow border-stone-200 hover:shadow-lg transition-all relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-1 h-full ${accent}`}></div>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent.replace('-500', '-100')}`}>
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
        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
        {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Command banner */}
      <div className="relative camo-bg rounded-2xl p-6 md:p-8 overflow-hidden mil-shadow">
        <div className="absolute top-0 left-0 right-0 h-1 safety-stripe"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge className="bg-amber-500 text-slate-900 font-bold mb-3">تقرير اليوم</Badge>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">أهلاً بعودتك، {user?.rank} {user?.name?.split(' ')[0]}</h2>
            <p className="text-amber-300 text-sm font-medium">جميع أقسام القطاع تعمل بجاهزية تامة · معدل الالتزام {mockStats.complianceRate}%</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">تاريخ التقرير</p>
              <p className="text-white font-bold">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center border-2 border-amber-300 shadow-lg">
              <Shield className="w-7 h-7 text-slate-900" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="إجمالي الأعضاء" value={mockStats.totalMembers} change={2.3} accent="bg-amber-500" />
        <StatCard icon={UserCheck} label="الحاضرون اليوم" value={mockStats.presentToday} change={1.8} accent="bg-emerald-500" />
        <StatCard icon={Crosshair} label="عمليات نشطة" value={mockStats.activeOperations} change={5.1} accent="bg-blue-500" />
        <StatCard icon={Target} label="معدل الالتزام" value={mockStats.complianceRate} suffix="%" change={mockStats.monthlyChange} accent="bg-orange-500" />
      </div>

      {/* Announcements + Promotions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center"><Megaphone className="w-4 h-4 text-amber-700" /></div>
              <div>
                <h3 className="font-black text-slate-900">الإعلانات والتعاميم</h3>
                <p className="text-xs text-slate-500">أحدث تعاميم القيادة</p>
              </div>
            </div>
            <button onClick={() => navigate('/announcements')} className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1">الكل <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-3">
            {mockAnnouncements.slice(0, 3).map(a => (
              <div key={a.id} className="flex gap-3 p-3 rounded-lg border border-stone-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all">
                <div className={`w-1 rounded-full ${a.priority === 'critical' ? 'bg-red-500' : a.priority === 'high' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 text-sm">{a.title}</h4>
                    <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{a.content}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{a.author} · {a.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-stone-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center"><Award className="w-4 h-4 text-amber-700" /></div>
            <div>
              <h3 className="font-black text-slate-900">آخر الترقيات</h3>
              <p className="text-xs text-slate-500">تهانينا</p>
            </div>
          </div>
          <div className="space-y-3">
            {mockPromotions.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50/40 transition-colors">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.fromRank} ← <span className="font-bold text-amber-700">{p.toRank}</span></p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Compliance chart + Departments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-stone-200">
          <div className="mb-6">
            <h3 className="font-black text-slate-900 text-lg">معدل الالتزام الشهري</h3>
            <p className="text-sm text-slate-500">تطور أداء القطاع خلال الأشهر السبعة الماضية</p>
          </div>
          <div className="h-56 flex items-end justify-between gap-3 px-2">
            {mockComplianceChart.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">{c.rate}%</div>
                <div className="w-full relative" style={{ height: '180px' }}>
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-800 to-amber-500 rounded-t-md hover:from-slate-900 hover:to-amber-400 transition-all cursor-pointer" style={{ height: `${(c.rate / 100) * 100}%` }}></div>
                </div>
                <span className="text-xs text-slate-500 font-medium">{c.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-stone-200">
          <div className="mb-4">
            <h3 className="font-black text-slate-900 text-lg">أداء الأقسام</h3>
            <p className="text-sm text-slate-500">معدل الالتزام</p>
          </div>
          <div className="space-y-3.5">
            {mockDepartments.slice(0, 6).map((d, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
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
