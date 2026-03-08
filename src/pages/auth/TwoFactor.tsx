import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function TwoFactor() {
  const [code, setCode] = useState('');
  const [showBackup, setShowBackup] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [secret, setSecret] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'patient';

  useEffect(() => {
    // Fetch 2FA setup data
    const setup2FA = async () => {
      try {
        const response = await fetch('/api/auth/2fa/setup', {
          method: 'POST',
        });
        const data = await response.json();
        setQrValue(data.otpauth_url);
        setSecret(data.secret);
      } catch (error) {
        console.error('Error setting up 2FA:', error);
      }
    };
    setup2FA();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: code, secret }),
      });
      
      const data = await response.json();
      
      if (data.verified) {
        if (type === 'doctor') {
          navigate('/doctor');
        } else {
          navigate('/patient');
        }
      } else {
        alert('Código inválido');
      }
    } catch (error) {
      alert('Erro na verificação');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Autenticação em Duas Etapas</h2>
        <p className="text-center text-slate-500 mb-8 text-sm">
          Para sua segurança, configure o Google Authenticator ou insira seu código de backup.
        </p>

        {!showBackup ? (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 mb-6">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                {qrValue && <QRCode value={qrValue} size={150} />}
              </div>
              <p className="text-xs text-center text-slate-500 mt-4">
                Escaneie este QR Code com seu aplicativo de autenticação.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 text-center">
                Código de 6 dígitos
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="block w-full text-center text-2xl tracking-widest py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow"
                placeholder="000000"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Verificar Código
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowBackup(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Ver códigos de recuperação (Backup Codes)
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-800 font-medium mb-2">
                Guarde estes códigos em um local seguro.
              </p>
              <p className="text-xs text-amber-700">
                Eles podem ser usados para acessar sua conta caso você perca o acesso ao seu aplicativo autenticador.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="text-center py-1">
                  {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowBackup(false)}
              className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Voltar para verificação
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
