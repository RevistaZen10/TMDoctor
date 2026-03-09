import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Clock, CheckCircle2, Video } from 'lucide-react';
import { cn } from '../../utils';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor_id: string;
  doctor_name: string;
  patient_id: string;
  doctor_peer_id?: string;
  status: string;
}

interface Record {
  id: string;
  date: string;
  content: string;
  doctor_name: string;
  type: string;
  attachment: string | null;
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [canEnterRoom, setCanEnterRoom] = useState(false);

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = () => {
      if (!user.id) return;

      try {
        // 1. Get Appointments from localStorage
        const allAppointments = JSON.parse(localStorage.getItem('telemed_appointments') || '[]');
        const patientAppointments = allAppointments.filter((apt: any) => apt.patient_id === user.id);
        
        setAppointments(patientAppointments);

        // Find next upcoming appointment
        const upcoming = patientAppointments.find((a: any) => a.status === 'scheduled');
        
        setNextAppointment(upcoming || null);

        // 2. Get Records from localStorage
        const allRecords = JSON.parse(localStorage.getItem('telemed_records') || '[]');
        const patientRecords = allRecords.filter((rec: any) => rec.patient_id === user.id);
        setRecords(patientRecords);

      } catch (error) {
        console.error('Error fetching patient dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  const handleEnterRoom = () => {
    if (!nextAppointment || !user.peer_id) return;

    // Set local storage for k10.html
    localStorage.setItem('p2pChatClientId', user.peer_id);
    localStorage.setItem('p2pUserName', user.name);
    
    // Add doctor to contacts if ID is available
    if (nextAppointment.doctor_peer_id) {
      const contacts = JSON.parse(localStorage.getItem('p2pContacts') || '[]');
      const doctorContact = { name: nextAppointment.doctor_name, peerId: nextAppointment.doctor_peer_id };
      
      // Avoid duplicates
      if (!contacts.some((c: any) => c.peerId === doctorContact.peerId)) {
        contacts.push(doctorContact);
        localStorage.setItem('p2pContacts', JSON.stringify(contacts));
      }
    }

    // Open k10.html in same tab to avoid iframe popup blockers
    window.location.href = '/k10.html';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sua Próxima Consulta</h2>
            {nextAppointment ? (
              <>
                <p className="text-slate-600 mb-6">{nextAppointment.doctor_name || 'Médico'}</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <button
                    onClick={handleEnterRoom}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl shadow-lg font-bold text-lg transition-all bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200"
                  >
                    <Video className="w-6 h-6" />
                    Entrar na Sala de Espera
                  </button>
                </div>
              </>
            ) : (
              <p className="text-slate-500">Você não tem consultas agendadas.</p>
            )}
          </div>
          
          <div className="hidden md:block w-px h-48 bg-slate-200" />
          
          <div className="w-full md:w-72 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Detalhes do Agendamento
            </h3>
            {nextAppointment ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-600/70 font-medium">Data</span>
                  <span className="text-indigo-900 font-bold">{new Date(nextAppointment.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-600/70 font-medium">Horário</span>
                  <span className="text-indigo-900 font-bold">{nextAppointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-600/70 font-medium">Duração</span>
                  <span className="text-indigo-900 font-bold">30 min</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-indigo-600/70">Nenhum agendamento.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          Meus Prontuários e Documentos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.length === 0 ? (
            <p className="text-slate-500 col-span-2 text-center py-8 bg-white rounded-xl border border-slate-200">Nenhum documento encontrado.</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-indigo-300 transition-colors group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                      {record.type}
                    </span>
                    <span className="text-sm font-medium text-slate-500">{new Date(record.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{record.doctor_name || 'Médico'}</h3>
                  <p className="text-sm text-slate-600 mb-6 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Documento liberado para visualização
                  </p>
                </div>
                
                {record.attachment && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 text-indigo-600 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors font-medium text-sm group-hover:bg-indigo-600 group-hover:text-white">
                    <Download className="w-4 h-4" />
                    Baixar {record.attachment}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
