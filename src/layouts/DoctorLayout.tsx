import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, Video, LogOut } from 'lucide-react';
import { cn } from '../utils';

export default function DoctorLayout() {
  const location = useLocation();

const navItems = [
  { name: 'Início', href: '/doctor', icon: Home },
  { name: 'Pacientes', href: '/doctor/patients', icon: Users },
  { name: 'Agendamentos', href: '/doctor/appointments', icon: Calendar },
 
];

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-indigo-600">TeleMed Pro</h1>
          <p className="text-sm text-slate-500 mt-1">Painel do Médico</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
                             (item.href !== '/doctor' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            Sair
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
