import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { HeartPulse, Lock, ArrowRight, Activity, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-clinical-purple/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <div className="w-full max-w-md bg-surface/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-outline/10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] relative z-10 animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-container text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 mb-6 transform -rotate-6">
            <HeartPulse className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-on-surface mb-2">MedRural</h1>
          <p className="text-on-surface-variant font-medium">Asistente Clínico Inteligente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">Usuario</label>
            <div className="relative mb-4">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario..."
                className={`w-full bg-surface-container-low border py-3.5 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                  error ? 'border-error/50 focus:ring-error/20 bg-error/5' : 'border-outline/20 focus:border-primary focus:ring-primary/20'
                }`}
              />
            </div>
            <label className="block text-sm font-bold text-on-surface mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña..."
                className={`w-full bg-surface-container-low border py-3.5 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 transition-all ${
                  error ? 'border-error/50 focus:ring-error/20 bg-error/5' : 'border-outline/20 focus:border-primary focus:ring-primary/20'
                }`}
              />
            </div>
            {error && (
              <p className="text-error text-xs font-bold mt-2 animate-shake flex items-center gap-1">
                <Activity className="w-4 h-4" /> Credenciales incorrectas.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-container text-white hover:text-on-primary-container py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(0,98,141,0.3)] hover:shadow-[0_8px_30px_rgba(0,98,141,0.4)] active:scale-[0.98]"
          >
            Entrar al Consultorio <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-outline/10 pt-6">
          <p className="text-xs font-bold text-outline uppercase tracking-widest">Base de Datos Local Segura</p>
          <p className="text-xs text-outline/60 mt-1">Soporte PWA Offline Activo</p>
        </div>
      </div>
    </div>
  );
}
