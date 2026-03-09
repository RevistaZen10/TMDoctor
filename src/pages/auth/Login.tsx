import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, HeartPulse, Info } from 'lucide-react';

const MOCK_USERS = [
  { id: 'd1', name: 'Dra. Ana Silva', email: 'dra.ana@telemed.com', password: '123', role: 'doctor', specialty: 'Psiquiatra', peer_id: 'doc1' },
  { id: 'd2', name: 'Dr. Carlos Mendes', email: 'dr.carlos@telemed.com', password: '123', role: 'doctor', specialty: 'Psicólogo', peer_id: 'doc2' },
  { id: 'd3', name: 'Dra. Beatriz Costa', email: 'dra.beatriz@telemed.com', password: '123', role: 'doctor', specialty: 'Neuropediatra', peer_id: 'doc3' },
  { id: 'p1', name: 'Maria Oliveira', cpf: '111.222.333-44', phone: '(11) 98888-7777', dob: '1985-04-12', email: 'maria@email.com', password: '123', role: 'patient', peer_id: 'pat1' },
  { id: 'p2', name: 'Joana Santos', cpf: '555.666.777-88', phone: '(11) 99999-0000', dob: '1990-08-25', email: 'joana@email.com', password: '123', role: 'patient', peer_id: 'pat2' }
];

const MOCK_APPOINTMENTS: any[] = [];
const MOCK_RECORDS: any[] = [];

const pastDates = ['2026-01-10', '2026-02-05', '2026-03-01'];
const futureDates = ['2026-03-15', '2026-04-10', '2026-05-05'];
const times = ['09:00', '10:30', '14:00'];

let aptId = 1;
let recId = 1;

const doctors = [
  { id: 'd1', name: 'Dra. Ana Silva' },
  { id: 'd2', name: 'Dr. Carlos Mendes' },
  { id: 'd3', name: 'Dra. Beatriz Costa' }
];
const patients = ['p1', 'p2'];

patients.forEach(pId => {
  doctors.forEach(doc => {
    // Past appointments
    pastDates.forEach((date, i) => {
      MOCK_APPOINTMENTS.push({
        id: `a${aptId++}`,
        doctor_id: doc.id,
        patient_id: pId,
        date: date,
        time: times[i],
        status: 'completed'
      });
      MOCK_RECORDS.push({
        id: recId++,
        patient_id: pId,
        doctor_id: doc.id,
        doctor_name: doc.name,
        date: `${date}T${times[i]}:00.000Z`,
        content: `Atendimento realizado em ${date}. Paciente apresentou boa evolução. Orientações mantidas.`,
        type: 'Evolução',
        attachment: null
      });
    });

    // Future appointments
    futureDates.forEach((date, i) => {
      MOCK_APPOINTMENTS.push({
        id: `a${aptId++}`,
        doctor_id: doc.id,
        patient_id: pId,
        date: date,
        time: times[i],
        status: 'scheduled'
      });
    });
  });
});

export default function Login() {
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Users
    const existingUsers = JSON.parse(localStorage.getItem('telemed_users') || '[]');
    if (existingUsers.length === 0) {
      localStorage.setItem('telemed_users', JSON.stringify(MOCK_USERS));
    } else {
      const combinedUsers = [...existingUsers];
      let updated = false;
      MOCK_USERS.forEach(mockUser => {
        if (!combinedUsers.find(u => u.email === mockUser.email)) {
          combinedUsers.push(mockUser);
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem('telemed_users', JSON.stringify(combinedUsers));
      }
    }

    // Appointments
    const existingAppointments = JSON.parse(localStorage.getItem('telemed_appointments') || '[]');
    if (existingAppointments.length === 0) {
      localStorage.setItem('telemed_appointments', JSON.stringify(MOCK_APPOINTMENTS));
    }

    // Records
    const existingRecords = JSON.parse(localStorage.getItem('telemed_records') || '[]');
    if (existingRecords.length === 0) {
      localStorage.setItem('telemed_records', JSON.stringify(MOCK_RECORDS));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Get users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('telemed_users') || '[]');
      
      // 2. Find matching user
      const user = existingUsers.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        setError('E-mail ou senha inválidos.');
        return;
      }

      // 3. Store active user info in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // 4. Redirect based on role
      if (user.role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    }
  };

  const fillCredentials = (mockEmail: string) => {
    setEmail(mockEmail);
    setPassword('123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row items-center justify-center p-4 gap-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Bem-vindo ao TeleMed Pro</h2>
          <p className="text-center text-slate-500 mb-8">Acesse sua conta para continuar</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Criar uma conta
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Example Accounts Panel */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
        <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-indigo-900">Contas de Exemplo (Testes)</h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Médicos Especialistas</h4>
            <div className="space-y-2">
              {MOCK_USERS.filter(u => u.role === 'doctor').map(doc => (
                <button 
                  key={doc.id}
                  onClick={() => fillCredentials(doc.email)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 group-hover:text-indigo-700">{doc.name}</span>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{doc.specialty}</span>
                  </div>
                  <div className="text-sm text-slate-500">E-mail: {doc.email}</div>
                  <div className="text-sm text-slate-500">Senha: {doc.password}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Pacientes (Mães)</h4>
            <div className="space-y-2">
              {MOCK_USERS.filter(u => u.role === 'patient').map(patient => (
                <button 
                  key={patient.id}
                  onClick={() => fillCredentials(patient.email)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-indigo-700 mb-1">{patient.name}</div>
                  <div className="text-sm text-slate-500">E-mail: {patient.email}</div>
                  <div className="text-sm text-slate-500">Senha: {patient.password}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Redefinir Senha</h3>
            <p className="text-sm text-slate-500 mb-4">
              Digite seu e-mail para receber as instruções de redefinição de senha.
            </p>
            <input
              type="email"
              placeholder="seu@email.com"
              className="block w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForgot(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowForgot(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
