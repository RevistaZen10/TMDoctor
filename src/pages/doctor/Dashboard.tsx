import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Calendar, Plus, Search, MoreVertical } from 'lucide-react';
import { cn } from '../../utils';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  email: string;
  status?: string;
}

interface Appointment {
  id: string;
  date: string;
  doctor_id: string;
}

export default function Dashboard() {
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Get doctor ID from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const doctorId = user.id;

  useEffect(() => {
    const fetchData = () => {
      try {
        const allUsers = JSON.parse(localStorage.getItem('telemed_users') || '[]');
        const allAppointments = JSON.parse(localStorage.getItem('telemed_appointments') || '[]');

        const patientList = allUsers.filter((u: any) => u.role === 'patient');
        const doctorAppointments = allAppointments.filter((apt: any) => apt.doctor_id === doctorId);

        setPatients(patientList);
        setAppointments(doctorAppointments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const stats = [
    { name: 'Total de Pacientes', value: patients.length.toString(), icon: Users, color: 'bg-blue-500' },
    { name: 'Prontuários Criados', value: '0', icon: FileText, color: 'bg-emerald-500' }, // Placeholder as records API not fully integrated in dashboard yet
    { name: 'Consultas (Total)', value: appointments.length.toString(), icon: Calendar, color: 'bg-indigo-500' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
          <p className="text-slate-500 mt-1">Acompanhe seus indicadores e pacientes recentes.</p>
        </div>
        <button
          onClick={() => setShowNewPatient(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Paciente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{loading ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Pacientes Recentes</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-medium">
                <th className="p-4">Nome</th>
                <th className="p-4">CPF</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center">Carregando...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">Nenhum paciente encontrado.</td></tr>
              ) : (
                patients.slice(0, 5).map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 font-medium text-slate-900">
                      <Link to={`/doctor/patients/${patient.id}`} className="hover:text-indigo-600">
                        {patient.name}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-600">{patient.cpf}</td>
                    <td className="p-4 text-slate-600">{patient.email}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          "bg-slate-300" // Default to offline as we don't have real status tracking yet
                        )} />
                        <span className="text-slate-600 capitalize text-xs font-medium">
                          Offline
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNewPatient && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Cadastrar Novo Paciente</h3>
            {/* Reusing the logic from Patients.tsx would be better, but for now just a placeholder or redirect */}
            <div className="text-center py-4">
              <p className="mb-4">Para cadastrar um novo paciente, vá para a tela de Pacientes.</p>
              <Link 
                to="/doctor/patients" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                onClick={() => setShowNewPatient(false)}
              >
                Ir para Pacientes
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
