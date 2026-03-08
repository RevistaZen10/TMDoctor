import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../utils';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor_id: string;
  doctor_name: string;
  patient_id: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

interface Doctor {
  id: string;
  name: string;
}

export default function PatientAppointments() {
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    doctor_id: '',
    date: '',
    time: ''
  });

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) {
      setLoading(false);
      return;
    }
    fetchAppointments();
    fetchDoctors();
  }, [user.id]);

  const fetchAppointments = () => {
    try {
      const allAppointments = JSON.parse(localStorage.getItem('telemed_appointments') || '[]');
      const patientAppointments = allAppointments.filter((apt: any) => apt.patient_id === user.id);
      
      // Sort by date and time
      patientAppointments.sort((a: any, b: any) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });

      setAppointments(patientAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = () => {
    try {
      const allUsers = JSON.parse(localStorage.getItem('telemed_users') || '[]');
      const doctorList = allUsers.filter((u: any) => u.role === 'doctor');
      setDoctors(doctorList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAppointment = () => {
    if (!user.id || !formData.doctor_id || !formData.date || !formData.time) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      const doctor = doctors.find(d => d.id === formData.doctor_id);
      
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patient_id: user.id,
        doctor_id: formData.doctor_id,
        doctor_name: doctor?.name || 'Médico',
        date: formData.date,
        time: formData.time,
        status: 'scheduled'
      };

      const allAppointments = JSON.parse(localStorage.getItem('telemed_appointments') || '[]');
      allAppointments.push(newAppointment);
      localStorage.setItem('telemed_appointments', JSON.stringify(allAppointments));

      setShowNewAppointment(false);
      setFormData({ doctor_id: '', date: '', time: '' });
      fetchAppointments(); // Refresh list
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Erro ao criar agendamento');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus Agendamentos</h1>
          <p className="text-slate-500 mt-1">Gerencie suas consultas e marque novos horários.</p>
        </div>
        <button
          onClick={() => setShowNewAppointment(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Consulta
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-medium">
                <th className="p-4">Data</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Médico</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center">Carregando...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-slate-500">Nenhum agendamento encontrado.</td></tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(apt.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {apt.time}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-900">{apt.doctor_name || 'Não atribuído'}</td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
                        apt.status === 'scheduled' && "bg-blue-50 text-blue-700",
                        apt.status === 'completed' && "bg-emerald-50 text-emerald-700",
                        apt.status === 'canceled' && "bg-red-50 text-red-700"
                      )}>
                        {apt.status === 'scheduled' && 'Agendada'}
                        {apt.status === 'completed' && 'Concluída'}
                        {apt.status === 'canceled' && 'Cancelada'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNewAppointment && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Nova Consulta</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Médico</label>
                <select 
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  <option value="">Selecione um médico</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                  <input 
                    type="time" 
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewAppointment(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateAppointment}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
