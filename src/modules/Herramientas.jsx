import { useState } from 'react';
import { Calculator, Activity, Brain, Baby, Droplets, ChevronRight, Syringe, AlertTriangle } from 'lucide-react';

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

  // Herramienta 3: SIR (Secuencia Intubación Rápida)
  const [pesoSir, setPesoSir] = useState('');
  
  const medsSir = [
    { id: 'fentanilo', nombre: 'Fentanilo', tipo: 'Pretratamiento', dosisEstandar: '2 mcg/kg', dosisUnidad: 'mcg', valorDosis: 2, presentacion: '0.5 mg / 10 ml', mgTotal: 0.5, mlTotal: 10, uso: 'Disminuye respuesta hipertensiva a la intubación.' },
    { id: 'ketamina', nombre: 'Ketamina', tipo: 'Inducción', dosisEstandar: '1.5 mg/kg', dosisUnidad: 'mg', valorDosis: 1.5, presentacion: '500 mg / 10 ml', mgTotal: 500, mlTotal: 10, uso: 'Elección en hipotensión/asma.', alerta: 'Puede causar hipertensión transitoria y aumento de secreciones.' },
    { id: 'etomidato', nombre: 'Etomidato', tipo: 'Inducción', dosisEstandar: '0.3 mg/kg', dosisUnidad: 'mg', valorDosis: 0.3, presentacion: '20 mg / 10 ml', mgTotal: 20, mlTotal: 10, uso: 'Elección en inestabilidad hemodinámica.' },
    { id: 'midazolam', nombre: 'Midazolam', tipo: 'Inducción', dosisEstandar: '0.2 mg/kg', dosisUnidad: 'mg', valorDosis: 0.2, presentacion: '15 mg / 3 ml', mgTotal: 15, mlTotal: 3, uso: 'Útil, pero con mayor riesgo de hipotensión.' },
    { id: 'rocuronio', nombre: 'Rocuronio', tipo: 'Paralizante', dosisEstandar: '1 mg/kg', dosisUnidad: 'mg', valorDosis: 1, presentacion: '50 mg / 5 ml', mgTotal: 50, mlTotal: 5, uso: 'Alternativa segura si hay contraindicación para Succinilcolina.' },
  ];

  const calcularSIR = () => {
    if (!pesoSir) return null;
    return medsSir.map(med => {
      let dosisMg = med.dosisUnidad === 'mcg' ? (pesoSir * med.valorDosis) / 1000 : pesoSir * med.valorDosis;
      let concentracion = med.mgTotal / med.mlTotal;
      let volumenMl = dosisMg / concentracion;
      return {
        ...med,
        dosisTotalMg: dosisMg.toFixed(2),
        volumenTotalMl: volumenMl.toFixed(1)
      };
    });
  };

  const resultadosSIR = calcularSIR();

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
          
          {/* Calculadora SIR */}
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center">
                <Syringe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface">Calculadora de Dosis de Medicamentos</h3>
                <p className="text-sm text-on-surface-variant">Cálculo exacto en mililitros (cc) según presentación</p>
              </div>
            </div>
            
            <div className="bg-surface-container-low border border-outline/20 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
              <label className="text-lg font-bold text-on-surface-variant whitespace-nowrap">Peso del Paciente:</label>
              <div className="relative w-full md:w-64">
                <input type="number" placeholder="Ej: 70" value={pesoSir} onChange={e => setPesoSir(e.target.value)} className="w-full bg-surface border border-outline/20 rounded-xl py-3 px-4 focus:outline-none focus:border-error text-xl font-bold" />
                <span className="absolute right-4 top-3 text-on-surface-variant font-bold">kg</span>
              </div>
            </div>
            
            {!resultadosSIR ? (
              <div className="bg-surface-container p-8 rounded-2xl border border-transparent text-center opacity-50">
                <p className="text-lg font-bold">Ingresa el peso del paciente para ver las dosis en cc</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resultadosSIR.map((med) => (
                  <div key={med.id} className="bg-surface border border-outline/10 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-error to-error/50"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-on-surface">{med.nombre}</h4>
                      <span className="text-xs font-bold bg-surface-container-high text-on-surface-variant px-2 py-1 rounded-md">{med.tipo}</span>
                    </div>
                    
                    <div className="flex flex-col gap-1 mb-4 flex-1">
                      <p className="text-sm text-on-surface-variant"><span className="font-semibold">Dosis:</span> {med.dosisEstandar}</p>
                      <p className="text-sm text-on-surface-variant"><span className="font-semibold">Presentación:</span> {med.presentacion}</p>
                      <p className="text-sm text-on-surface-variant mt-1">{med.uso}</p>
                      {med.alerta && (
                        <div className="flex items-start gap-1 mt-2 text-status-warning bg-status-warning/10 p-2 rounded-lg text-xs font-semibold">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>{med.alerta}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-error/10 border border-error/20 rounded-xl p-3 flex justify-between items-center mt-auto">
                      <div>
                        <span className="text-xs font-bold text-error uppercase tracking-wider block">Cargar en Jeringa</span>
                        <div className="text-2xl font-extrabold text-on-surface">{med.volumenTotalMl} <span className="text-base font-bold text-on-surface-variant">cc (ml)</span></div>
                        <div className="text-xs text-on-surface-variant font-medium mt-1">Total activo: {med.dosisTotalMg} mg</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center shadow-sm">
                        <Syringe className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
