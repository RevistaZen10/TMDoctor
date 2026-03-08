import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, UserRound, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [profile, setProfile] = useState<'doctor' | 'patient' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    dob: '',
    specialty: '',
    price: '',
    pix: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('telemed_users') || '[]');
      
      // 2. Check if email already exists
      const userExists = existingUsers.find((u: any) => u.email === formData.email);
      if (userExists) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      // 3. Create new user object
      const newUser: any = {
        id: Date.now().toString(), // Generate a simple unique ID
        name: formData.name,
        email: formData.email,
        password: formData.password, // Storing password in plain text ONLY for testing
        role: profile,
        cpf: formData.cpf,
        phone: formData.phone,
        dob: formData.dob || null,
      };

      if (profile === 'doctor') {
        newUser.specialty = formData.specialty;
        newUser.price = formData.price ? parseFloat(formData.price) : null;
        newUser.pix = formData.pix;
      }

      // 4. Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('telemed_users', JSON.stringify(existingUsers));

      // 5. Redirect to login
      navigate('/login');
    } catch (err) {
      setError('Ocorreu um erro inesperado ao salvar os dados.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para o login
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900">Criar uma conta</h2>
          <p className="mt-2 text-sm text-slate-600">
            Selecione o seu perfil para começar
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {!profile ? (
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => setProfile('doctor')}
              className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <Stethoscope className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="font-semibold text-slate-900">Sou Médico</span>
            </button>

            <button
              onClick={() => setProfile('patient')}
              className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <UserRound className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="font-semibold text-slate-900">Sou Paciente</span>
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-slate-900">
                Cadastro de {profile === 'doctor' ? 'Médico' : 'Paciente'}
              </h3>
              <button
                type="button"
                onClick={() => setProfile(null)}
                className="text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Trocar perfil
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nome completo</label>
                <input type="text" name="name" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {profile === 'doctor' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">CRM / Especialidade</label>
                  <input type="text" name="specialty" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">CPF</label>
                <input type="text" name="cpf" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {profile === 'patient' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">Data de Nascimento</label>
                  <input type="date" name="dob" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">E-mail</label>
                <input type="email" name="email" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Telefone</label>
                <input type="tel" name="phone" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>

              {profile === 'doctor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Valor da Consulta (R$)</label>
                    <input type="number" name="price" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Chave Pix</label>
                    <input type="text" name="pix" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">Senha</label>
                <input type="password" name="password" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cadastrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
