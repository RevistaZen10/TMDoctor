import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogOut, User, Home, Calendar } from 'lucide-react';
import { cn } from '../utils';

export default function PatientLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Início', href: '/patient', icon: Home },
    { name: 'Agendamentos', href: '/patient/appointments', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">TeleMed Pro</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <User className="w-4 h-4 text-slate-400" />
              <span>Área do Paciente</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
