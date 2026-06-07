import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Clock, IdCard, FilePlus, Award, ShieldAlert, Crosshair, Users, Megaphone, Scale, Trophy, BarChart3, LifeBuoy, LogOut, Bell, Search, Menu, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '../App';
import { mockNotifications } from '../mock';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_discourse-pro-5/artifacts/hvpwgy6j_photo_5848105849551785356_x.jpg';

const navGroups = [
  {
    label: 'الرئيسية',
    items: [
      { to: '/', label: 'الرئيسية', icon: Home, end: true },
      { to: '/profile', label: 'ملفي العسكري', icon: User },
      { to: '/attendance', label: 'الحضور والانصراف', icon: Clock },
      { to: '/cards', label: 'البطاقات العسكرية', icon: IdCard },
      { to: '/requests', label: 'الطلبات العسكرية', icon: FilePlus },
    ],
  },
  {
    label: 'العمليات والتقارير',
    items: [
      { to: '/operations', label: 'العمليات الأمنية', icon: Crosshair },
      { to: '/reports', label: 'التقارير الأمنية', icon: ShieldAlert },
      { to: '/violations', label: 'المخالفات والعقوبات', icon: Scale },
    ],
  },
  {
    label: 'شؤون الأفراد',
    items: [
      { to: '/personnel', label: 'شؤون الأفراد', icon: Users },
      { to: '/promotions', label: 'الترقيات والأوسمة', icon: Award },
      { to: '/honors', label: 'لوحة الشرف', icon: Trophy },
    ],
  },
  {
    label: 'الإدارة',
    items: [
      { to: '/announcements', label: 'الإعلانات والتعاميم', icon: Megaphone },
      { to: '/statistics', label: 'الإحصائيات', icon: BarChart3 },
      { to: '/support', label: 'الدعم والتواصل', icon: LifeBuoy },
    ],
  },
];
const flatNav = navGroups.flatMap(g => g.items);

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = (user?.name || '').split(' ').slice(0, 2).map(w => w[0]).join('');
  const pageTitle = flatNav.find(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))?.label || 'الرئيسية';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-72 transform transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-blue-50 relative overflow-hidden">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-blue-400 via-white to-blue-400"></div>

          {/* Logo */}
          <div className="p-5 border-b border-blue-700/50">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-xl p-1 shadow-lg border border-blue-300">
                <img src={LOGO_URL} alt="الشعار" className="w-full h-full object-contain rounded-lg" />
              </div>
              <div>
                <h2 className="font-black text-white text-base leading-tight">فريق أمن</h2>
                <p className="text-xs text-blue-200 font-bold">ملك الطارة</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
            {navGroups.map((group, gi) => (
              <div key={gi}>
                <p className="text-[10px] font-bold text-blue-300/80 tracking-widest px-3 mb-2 uppercase">{group.label}</p>
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-white text-blue-900 font-bold shadow-md'
                              : 'text-blue-100 hover:bg-blue-700/60 hover:text-white'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Quote */}
          <div className="p-4 border-t border-blue-700/50">
            <div className="bg-blue-950/60 rounded-lg p-3 border border-blue-400/20">
              <p className="text-[11px] text-blue-200 leading-relaxed text-center italic">
                &laquo; الانضباط أساس القوة،
                <br />والاحترافية أساس النجاح &raquo;
              </p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 h-16 gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-base md:text-xl font-black text-slate-900">{pageTitle}</h1>
                <p className="text-xs text-slate-500 hidden md:block">{user?.rank} {user?.name?.split(' ').slice(0, 2).join(' ')} · {user?.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="بحث..." className="pr-10 w-56 h-9 bg-blue-50/60 border-blue-200" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 left-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">{unreadCount}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockNotifications.map(n => (
                    <DropdownMenuItem key={n.id} className="flex-col items-start py-3 cursor-pointer">
                      <div className="flex items-center gap-2 w-full">
                        {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                        <span className="font-semibold text-sm">{n.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 px-2 gap-2">
                    <Avatar className="w-7 h-7 bg-blue-700">
                      <AvatarFallback className="bg-transparent text-white text-xs font-black">{initials}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 hidden md:block text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-bold">{user?.name}</div>
                    <div className="text-xs text-slate-500 font-normal">{user?.rank} · {user?.militaryNumber}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}><User className="w-4 h-4 ml-2" /> ملفي العسكري</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}><SettingsIcon className="w-4 h-4 ml-2" /> الإعدادات</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                    <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
