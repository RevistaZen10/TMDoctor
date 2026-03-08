import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Clock, CheckCircle2, Video } from 'lucide-react';
import { cn } from '../../utils';

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor_name: string;
  doctor_peer_id?: string;
  status: string;
}

interface Record {
  id: number;
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
  const [patientId, setPatientId] = useState<number | null>(null);
  const [canEnterRoom, setCanEnterRoom] = useState(false);

  // Get user info
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      if (!user.email) return;

      try {
        // 1. Get Patient ID by Email
        const patientRes = await fetch(`/api/patients/by-email/${user.email}`);
        if (!patientRes.ok) throw new Error('Patient not found');
        const patient = await patientRes.json();
        setPatientId(patient.id);

        // 2. Get Appointments & Records
        const [appointmentsRes, recordsRes] = await Promise.all([
          fetch(`/api/patients/${patient.id}/appointments`),
          fetch(`/api/patients/${patient.id}/records`)
        ]);

        if (appointmentsRes.ok) {
          const apts = await appointmentsRes.json();
          setAppointments(apts);
          // Find next upcoming appointment
          const now = new Date();
          const upcoming = apts.find((a: any) => {
            const aptDate = new Date(`${a.date}T${a.time}`);
            // Check if appointment is in the future or within the last hour (ongoing)
            return aptDate >= new Date(now.getTime() - 60 * 60 * 1000);
          });
          setNextAppointment(upcoming || null);
        }

        if (recordsRes.ok) {
          setRecords(await recordsRes.json());
        }

      } catch (error) {
        console.error('Error fetching patient dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.email]);

  // Check if can enter room (5 minutes before)
  useEffect(() => {
    if (!nextAppointment) {
      setCanEnterRoom(false);
      return;
    }

    const checkTime = () => {
      const now = new Date();
      const aptDate = new Date(`${nextAppointment.date}T${nextAppointment.time}`);
      const diffMinutes = (aptDate.getTime() - now.getTime()) / (1000 * 60);
      
      // Allow entry if less than 5 minutes before, or if we are past the start time (but not too far, e.g. 1 hour)
      // diffMinutes < 5 means we are within 5 mins of start or past start
      // diffMinutes > -60 means we are less than 60 mins late
      if (diffMinutes <= 5 && diffMinutes > -60) {
        setCanEnterRoom(true);
      } else {
        setCanEnterRoom(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [nextAppointment]);

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

    // Open k10.html in new tab
    window.open('/k10.html', '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sua Próxima Consulta</h2>
            {nextAppointment ? (
              <>
                <p className="text-slate-600 mb-6">{nextAppointment.doctor_name || 'Médico'} - Cardiologista</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  {canEnterRoom ? (
                    <button
                      onClick={handleEnterRoom}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl shadow-lg font-bold text-lg transition-all bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200"
                    >
                      <Video className="w-6 h-6" />
                      Entrar na Sala de Espera
                    </button>
                  ) : (
                    <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
                      A sala de espera será liberada 5 minutos antes da consulta.
                    </div>
                  )}
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
                  <span className="text-indigo-900 font-bold">{new Date(nextAppointment.date).toLocaleDateString()}</span>
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
                    <span className="text-sm font-medium text-slate-500">{new Date(record.date).toLocaleDateString()}</span>
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
