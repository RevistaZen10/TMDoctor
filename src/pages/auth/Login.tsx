import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, HeartPulse } from 'lucide-react';
import { supabase } from '../../supabase';

export default function Login() {
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Login failed');
        return;
      }

      // Fetch user profile from Supabase to get role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        setError('Error fetching user profile');
        return;
      }

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({ ...data.user, role: profile.role }));
      
      // Redirect based on role
      if (profile.role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
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
