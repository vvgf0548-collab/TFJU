import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, CalendarCheck, FileText, Settings as SettingsIcon, LogOut, Bell, Search, Shield, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '../App';
import { mockNotifications } from '../mock';

const navItems = [
  { to: '/', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
  { to: '/soldiers', label: 'الجنود', icon: Users },
  { to: '/violations', label: 'المخالفات', icon: AlertTriangle },
  { to: '/attendance', label: 'الحضور والغياب', icon: CalendarCheck },
  { to: '/reports', label: 'التقارير', icon: FileText },
  { to: '/settings', label: 'الإعدادات', icon: SettingsIcon },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = (user?.name || '').split(' ').slice(0, 2).map(w => w[0]).join('');

  const pageTitle = navItems.find(n => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))?.label || 'لوحة التحكم';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-40 w-72 bg-white border-l border-slate-200 transform transition-transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base leading-tight">إدارة المرور</h2>
                <p className="text-xs text-slate-500">العسكري</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                      isActive
                        ? 'bg-gradient-to-l from-orange-500 to-amber-500 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User box */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
              <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500">
                <AvatarFallback className="bg-transparent text-white font-bold text-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.rank} · {user?.militaryNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-4 md:px-6 h-16 gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900">{pageTitle}</h1>
                <p className="text-xs text-slate-500 hidden md:block">مرحباً بعودتك، {user?.rank} {user?.name?.split(' ')[0]}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="بحث..." className="pr-10 w-56 h-9 bg-slate-50 border-slate-200" />
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 left-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockNotifications.map(n => (
                    <DropdownMenuItem key={n.id} className="flex-col items-start py-3 cursor-pointer">
                      <div className="flex items-center gap-2 w-full">
                        {!n.read && <span className="w-2 h-2 bg-orange-500 rounded-full"></span>}
                        <span className="font-semibold text-sm">{n.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 px-2 gap-2">
                    <Avatar className="w-7 h-7 bg-gradient-to-br from-orange-400 to-amber-500">
                      <AvatarFallback className="bg-transparent text-white text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 hidden md:block text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-xs text-slate-500 font-normal">{user?.rank}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <SettingsIcon className="w-4 h-4 ml-2" /> الإعدادات
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                    <LogOut className="w-4 h-4 ml-2" /> تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
