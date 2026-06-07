import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Crosshair, ArrowUpRight, Target, Megaphone, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useNavigate } from 'react-router-dom';
import { mockComplianceChart, mockDepartments } from '../mock';
import { useAuth } from '../App';
import api from '../api';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_discourse-pro-5/artifacts/hvpwgy6j_photo_5848105849551785356_x.jpg';

function StatCard({ icon: Icon, label, value, change, accent, suffix }) {
  const isPositive = change >= 0;
  return (
    <Card className="p-5 stat-card-shadow border-blue-100 hover:shadow-lg transition-all relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-1 h-full ${accent}`}></div>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent.replace('-600', '-100').replace('-500', '-100')}`}>
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
  const [stats, setStats] = useState({ totalMembers: 0, presentToday: 0, activeOperations: 0, complianceRate: 94.8, monthlyChange: 3.2 });
  const [announcements, setAnnouncements] = useState([]);
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/stats/dashboard').then(r => setStats(r.data)).catch(()=>{}),
      api.get('/announcements').then(r => setAnnouncements(r.data)).catch(()=>{}),
      api.get('/promotions').then(r => setPromotions(r.data)).catch(()=>{}),
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative naval-bg rounded-2xl p-6 md:p-8 overflow-hidden mil-shadow">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <Badge className="bg-red-600 hover:bg-red-600 text-white font-bold mb-3">تقرير اليوم</Badge>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">أهلاً بعودتك، {user?.rank} {user?.name?.split(' ')[0]}</h2>
            <p className="text-red-100 text-sm font-medium">جميع أقسام الفريق تعمل بجاهزية تامة · معدل الالتزام {stats.complianceRate}%</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-red-100 mb-1">تاريخ التقرير</p>
              <p className="text-white font-bold">{new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-blue-700 rounded-2xl p-1 shadow-lg border-2 border-red-300">
              <img src={LOGO_URL} alt="" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="إجمالي الأعضاء" value={stats.totalMembers} change={2.3} accent="bg-blue-600" />
        <StatCard icon={UserCheck} label="الحاضرون اليوم" value={stats.presentToday} change={1.8} accent="bg-emerald-500" />
        <StatCard icon={Crosshair} label="عمليات نشطة" value={stats.activeOperations} change={5.1} accent="bg-red-600" />
        <StatCard icon={Target} label="معدل الالتزام" value={stats.complianceRate} suffix="%" change={stats.monthlyChange} accent="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center"><Megaphone className="w-4 h-4 text-red-700" /></div>
              <div>
                <h3 className="font-black text-slate-900">الإعلانات والتعاميم</h3>
                <p className="text-xs text-slate-500">أحدث تعاميم القيادة</p>
              </div>
            </div>
            <button onClick={() => navigate('/announcements')} className="text-xs text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1">الكل <ArrowUpRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(a => (
              <div key={a.id} className="flex gap-3 p-3 rounded-lg border border-blue-50 hover:border-red-200 hover:bg-red-50/30 transition-all">
                <div className={`w-1 rounded-full ${a.priority === 'critical' ? 'bg-red-600' : a.priority === 'high' ? 'bg-blue-600' : 'bg-slate-400'}`}></div>
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
            {announcements.length === 0 && <p className="text-center text-sm text-slate-400 py-4">لا توجد تعاميم</p>}
          </div>
        </Card>

        <Card className="p-6 border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center"><Award className="w-4 h-4 text-blue-700" /></div>
            <div>
              <h3 className="font-black text-slate-900">آخر الترقيات</h3>
              <p className="text-xs text-slate-500">تهانينا</p>
            </div>
          </div>
          <div className="space-y-3">
            {promotions.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/40 transition-colors">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-red-600 rounded-full flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.fromRank} ← <span className="font-bold text-blue-700">{p.toRank}</span></p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-blue-100">
          <div className="mb-6">
            <h3 className="font-black text-slate-900 text-lg">معدل الالتزام الشهري</h3>
            <p className="text-sm text-slate-500">تطور أداء الفريق خلال الأشهر السبعة</p>
          </div>
          <div className="h-56 flex items-end justify-between gap-3 px-2">
            {mockComplianceChart.map((c, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">{c.rate}%</div>
                <div className="w-full relative" style={{ height: '180px' }}>
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-red-600 via-red-500 to-blue-500 rounded-t-md hover:from-red-700 transition-all cursor-pointer" style={{ height: `${(c.rate / 100) * 100}%` }}></div>
                </div>
                <span className="text-xs text-slate-500 font-medium">{c.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-blue-100">
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
