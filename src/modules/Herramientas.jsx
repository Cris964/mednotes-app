import { useState } from 'react';
import { Calculator, Activity, Brain, Baby, Droplets, ChevronRight } from 'lucide-react';

export default function Herramientas() {
  const [activeTab, setActiveTab] = useState('calculadoras');

  // Herramienta 1: IMC
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  
  const calcularIMC = () => {
    if (!peso || !talla) return null;
    const m = talla > 3 ? talla / 100 : talla; // Convertir cm a m si es necesario
    const imc = peso / (m * m);
    let clasificacion = '';
    let color = '';
    
    if (imc < 18.5) { clasificacion = 'Bajo peso'; color = 'text-orange-500'; }
    else if (imc < 24.9) { clasificacion = 'Normal'; color = 'text-status-success'; }
    else if (imc < 29.9) { clasificacion = 'Sobrepeso'; color = 'text-status-warning'; }
    else { clasificacion = 'Obesidad'; color = 'text-error'; }
    
    return { valor: imc.toFixed(1), clasificacion, color };
  };

  const imcResult = calcularIMC();

  // Herramienta 2: FPP (Fecha Probable de Parto - Regla de Naegele)
  const [fur, setFur] = useState('');
  
  const calcularFPP = () => {
    if (!fur) return null;
    const f = new Date(fur);
    f.setUTCDate(f.getUTCDate() + 7);
    f.setUTCMonth(f.getUTCMonth() - 3);
    f.setUTCFullYear(f.getUTCFullYear() + 1);
    
    // Semanas actuales
    const diffTime = Math.abs(new Date() - new Date(fur));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const semanas = Math.floor(diffDays / 7);
    const dias = diffDays % 7;
    
    return {
      fpp: f.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
      gestacion: `${semanas} semanas y ${dias} días`
    };
  };

  const fppResult = calcularFPP();

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Herramientas Clínicas</h2>
        <p className="text-on-surface-variant text-lg">Calculadoras y utilidades médicas rápidas para consulta.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        <button onClick={() => setActiveTab('calculadoras')} className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'calculadoras' ? 'bg-primary text-white shadow-md' : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'}`}>
          Calculadoras
        </button>
        <button onClick={() => setActiveTab('escalas')} className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'escalas' ? 'bg-primary text-white shadow-md' : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'}`}>
          Escalas de Riesgo
        </button>
        <button onClick={() => setActiveTab('dosis')} className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'dosis' ? 'bg-primary text-white shadow-md' : 'bg-surface border border-outline/20 text-on-surface hover:bg-surface-container'}`}>
          Dosis Pediátricas
        </button>
      </div>

      {activeTab === 'calculadoras' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Calculadora IMC */}
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-on-surface">Calculadora de IMC</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Peso (kg)</label>
                <input type="number" placeholder="Ej: 70" value={peso} onChange={e => setPeso(e.target.value)} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Talla (m o cm)</label>
                <input type="number" step="0.01" placeholder="Ej: 1.75 o 175" value={talla} onChange={e => setTalla(e.target.value)} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            
            {imcResult ? (
              <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline/10 text-center">
                <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Resultado</span>
                <div className="text-4xl font-extrabold text-on-surface mb-1">{imcResult.valor}</div>
                <div className={`font-bold ${imcResult.color}`}>{imcResult.clasificacion}</div>
              </div>
            ) : (
              <div className="bg-surface-container p-4 rounded-2xl border border-transparent text-center opacity-50">
                <p className="text-sm font-bold">Ingresa los datos para calcular</p>
              </div>
            )}
          </div>

          {/* Calculadora Obstétrica */}
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-on-surface">Gestograma (FPP)</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Fecha de Última Regla (FUR)</label>
                <input type="date" value={fur} onChange={e => setFur(e.target.value)} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 px-4 focus:outline-none focus:border-pink-500" />
              </div>
              <p className="text-xs text-outline leading-tight">Cálculo basado en la regla de Naegele (ciclos regulares de 28 días).</p>
            </div>
            
            {fppResult ? (
              <div className="bg-pink-500/5 p-4 rounded-2xl border border-pink-500/20 text-center">
                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider block mb-1">Fecha Probable de Parto</span>
                <div className="text-2xl font-extrabold text-on-surface mb-3">{fppResult.fpp}</div>
                
                <span className="text-xs font-bold text-pink-500 uppercase tracking-wider block mb-1">Edad Gestacional Hoy</span>
                <div className="text-lg font-bold text-on-surface-variant">{fppResult.gestacion}</div>
              </div>
            ) : (
              <div className="bg-surface-container p-4 rounded-2xl border border-transparent text-center opacity-50">
                <p className="text-sm font-bold">Selecciona la FUR para calcular</p>
              </div>
            )}
          </div>
          
        </div>
      )}

      {activeTab === 'escalas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Escala de Glasgow</h3>
            <p className="text-sm text-on-surface-variant mb-4">Evaluación del nivel de conciencia en pacientes con trauma craneoencefálico.</p>
            <div className="text-primary font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Abrir Calculadora <ChevronRight className="w-4 h-4"/></div>
          </div>
          
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">CRB-65 / CURB-65</h3>
            <p className="text-sm text-on-surface-variant mb-4">Predicción de mortalidad en neumonía adquirida en la comunidad.</p>
            <div className="text-primary font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Abrir Calculadora <ChevronRight className="w-4 h-4"/></div>
          </div>
        </div>
      )}

      {activeTab === 'dosis' && (
        <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-8 border border-outline/10 shadow-sm text-center">
          <div className="w-20 h-20 bg-primary/10 mx-auto rounded-full flex items-center justify-center mb-4">
            <Calculator className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-on-surface mb-2">Calculadora Pediátrica</h3>
          <p className="text-on-surface-variant max-w-md mx-auto mb-6">El módulo de dosificación por kilogramo de peso está siendo calibrado por seguridad del paciente.</p>
          <button className="bg-surface-container px-6 py-2 rounded-full font-bold text-outline cursor-not-allowed">Próximamente</button>
        </div>
      )}
    </div>
  );
}
