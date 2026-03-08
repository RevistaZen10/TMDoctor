import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MoreVertical, CheckCircle2, XCircle, RefreshCw, Video } from 'lucide-react';
import { cn } from '../../utils';

interface Appointment {
  id: number;
  date: string;
  time: string;
  patient_name: string;
  patient_peer_id?: string;
  status: 'scheduled' | 'completed' | 'canceled';
}

interface Patient {
  id: number;
  name: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get doctor ID from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const doctorId = user.id;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/appointments?doctor_id=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterRoom = (patientName: string, patientPeerId?: string) => {
    if (!user.peer_id) return;

    // Set local storage for k10.html
    localStorage.setItem('p2pChatClientId', user.peer_id);
    localStorage.setItem('p2pUserName', user.name);
    
    // Add patient to contacts if ID is available
    if (patientPeerId) {
      const contacts = JSON.parse(localStorage.getItem('p2pContacts') || '[]');
      const patientContact = { name: patientName, peerId: patientPeerId };
      
      // Avoid duplicates
      if (!contacts.some((c: any) => c.peerId === patientContact.peerId)) {
        contacts.push(patientContact);
        localStorage.setItem('p2pContacts', JSON.stringify(contacts));
      }
    }

    // Open k10.html in new tab
    window.open('/k10.html', '_blank');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agendamentos</h1>
          <p className="text-slate-500 mt-1">Gerencie suas consultas marcadas.</p>
        </div>
        <button
          onClick={fetchAppointments}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          Atualizar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-medium">
                <th className="p-4">Data</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Paciente</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-4 text-center">Carregando...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={5} className="p-4 text-center text-slate-500">Nenhum agendamento encontrado.</td></tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 font-medium text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(apt.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {apt.time}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-900">{apt.patient_name}</td>
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
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {apt.status === 'scheduled' && (
                          <>
                            <button 
                              onClick={() => handleEnterRoom(apt.patient_name, apt.patient_peer_id)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" 
                              title="Sala de atendimento"
                            >
                              <Video className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Marcar como concluída">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Cancelar consulta">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
