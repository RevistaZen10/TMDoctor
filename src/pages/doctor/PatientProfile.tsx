import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, Clock, Download, FileText, CheckCircle2, Video } from 'lucide-react';
import { cn } from '../../utils';

interface Patient {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  dob: string;
  peer_id?: string;
}

interface Record {
  id: number;
  date: string;
  content: string;
  doctor_name: string;
  type: string;
  attachment: string | null;
}

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [evolutionText, setEvolutionText] = useState('');
  const [loading, setLoading] = useState(true);

  // Get doctor ID
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const doctorId = user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patient from localStorage
        const allUsers = JSON.parse(localStorage.getItem('telemed_users') || '[]');
        const foundPatient = allUsers.find((u: any) => u.id === id && u.role === 'patient');
        
        if (foundPatient) {
          setPatient(foundPatient);
        }

        // Fetch records from localStorage
        const allRecords = JSON.parse(localStorage.getItem('telemed_records') || '[]');
        const patientRecords = allRecords.filter((r: any) => r.patient_id === id);
        
        // Sort by date descending
        patientRecords.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setRecords(patientRecords);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleCreateRecord = async () => {
    if (!evolutionText.trim()) return;

    try {
      const newRecord = {
        id: Date.now(),
        patient_id: id,
        doctor_id: doctorId,
        doctor_name: user.name,
        date: new Date().toISOString(),
        content: evolutionText,
        type: 'Evolução',
        attachment: null
      };

      const allRecords = JSON.parse(localStorage.getItem('telemed_records') || '[]');
      allRecords.push(newRecord);
      localStorage.setItem('telemed_records', JSON.stringify(allRecords));

      setEvolutionText('');
      
      // Refresh records
      const patientRecords = allRecords.filter((r: any) => r.patient_id === id);
      patientRecords.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(patientRecords);
    } catch (error) {
      console.error('Error creating record:', error);
      alert('Erro ao salvar registro');
    }
  };

  const handleEnterRoom = () => {
    if (!user.peer_id) return;

    // Set local storage for k10.html
    localStorage.setItem('p2pChatClientId', user.peer_id);
    localStorage.setItem('p2pUserName', user.name);
    
    // Add patient to contacts if ID is available
    if (patient?.peer_id) {
      const contacts = JSON.parse(localStorage.getItem('p2pContacts') || '[]');
      const patientContact = { name: patient.name, peerId: patient.peer_id };
      
      // Avoid duplicates
      if (!contacts.some((c: any) => c.peerId === patientContact.peerId)) {
        contacts.push(patientContact);
        localStorage.setItem('p2pContacts', JSON.stringify(contacts));
      }
    }

    // Open k10.html in same tab to avoid iframe popup blockers
    window.location.href = '/k10.html';
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!patient) return <div className="p-8 text-center">Paciente não encontrado</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link to="/doctor/patients" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar para Pacientes
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400" /> {patient.cpf}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {patient.dob}</span>
                <span className="flex items-center gap-1.5 text-indigo-600 font-medium">{patient.phone}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleEnterRoom}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-sm font-medium"
          >
            <Video className="w-5 h-5" />
            Sala de atendimento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Nova Evolução
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <textarea
                value={evolutionText}
                onChange={(e) => setEvolutionText(e.target.value)}
                placeholder="Digite as anotações da consulta atual..."
                className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none mb-4"
              />
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50">
                  <Paperclip className="w-4 h-4" />
                  Anexar Arquivo
                </button>
                <button
                  onClick={handleCreateRecord}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Salvar Registro
                </button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Histórico Clínico
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {records.length === 0 ? (
                <p className="text-center text-slate-500 py-4">Nenhum registro encontrado.</p>
              ) : (
                records.map((record) => (
                  <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 mb-2">{record.doctor_name || 'Médico'}</p>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{record.content}</p>
                      {record.attachment && (
                        <button className="flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-md transition-colors w-fit">
                          <Download className="w-3.5 h-3.5" />
                          {record.attachment}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Informações Adicionais</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-slate-500 font-medium">E-mail</dt>
                <dd className="text-slate-900 mt-1">{patient.email}</dd>
              </div>
              {/* Add more fields if available in DB */}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plus(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}
