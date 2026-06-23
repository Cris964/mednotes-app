import { useState } from 'react';
import { Calculator, Activity, Brain, Baby, Droplets, ChevronRight, Syringe, AlertTriangle, Search, ArrowLeft } from 'lucide-react';

export default function Herramientas() {
  const [activeTab, setActiveTab] = useState('calculadoras');

  // Buscador y Detalle de Medicamentos
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);
  const [pesoSir, setPesoSir] = useState('');
  
  const medsSir = [
    { id: 'fentanilo', nombre: 'Fentanilo', tipo: 'Pretratamiento', dosisEstandar: '2 mcg/kg', dosisUnidad: 'mcg', valorDosis: 2, presentacion: '0.5 mg / 10 ml', mgTotal: 0.5, mlTotal: 10, uso: 'Disminuye respuesta hipertensiva a la intubación.' },
    { id: 'ketamina', nombre: 'Ketamina', tipo: 'Inducción', dosisEstandar: '1.5 mg/kg', dosisUnidad: 'mg', valorDosis: 1.5, presentacion: '500 mg / 10 ml', mgTotal: 500, mlTotal: 10, uso: 'Elección en hipotensión/asma.', alerta: 'Puede causar hipertensión transitoria y aumento de secreciones.' },
    { id: 'etomidato', nombre: 'Etomidato', tipo: 'Inducción', dosisEstandar: '0.3 mg/kg', dosisUnidad: 'mg', valorDosis: 0.3, presentacion: '20 mg / 10 ml', mgTotal: 20, mlTotal: 10, uso: 'Elección en inestabilidad hemodinámica.' },
    { id: 'midazolam', nombre: 'Midazolam', tipo: 'Inducción', dosisEstandar: '0.2 mg/kg', dosisUnidad: 'mg', valorDosis: 0.2, presentacion: '15 mg / 3 ml', mgTotal: 15, mlTotal: 3, uso: 'Útil, pero con mayor riesgo de hipotensión.' },
    { id: 'rocuronio', nombre: 'Rocuronio', tipo: 'Paralizante', dosisEstandar: '1 mg/kg', dosisUnidad: 'mg', valorDosis: 1, presentacion: '50 mg / 5 ml', mgTotal: 50, mlTotal: 5, uso: 'Alternativa segura si hay contraindicación para Succinilcolina.' },
  ];

  const filteredMeds = medsSir.filter(med => med.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  let medCalculated = null;
  if (selectedMed && pesoSir) {
    let dosisMg = selectedMed.dosisUnidad === 'mcg' ? (pesoSir * selectedMed.valorDosis) / 1000 : pesoSir * selectedMed.valorDosis;
    let concentracion = selectedMed.mgTotal / selectedMed.mlTotal;
    let volumenMl = dosisMg / concentracion;
    medCalculated = {
      dosisTotalMg: dosisMg.toFixed(2),
      volumenTotalMl: volumenMl.toFixed(1)
    };
  }

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
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm lg:col-span-2 min-h-[400px]">
            {!selectedMed ? (
              // Vista de Buscador
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-error/10 text-error flex items-center justify-center">
                    <Syringe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Calculadora de Dosis de Medicamentos</h3>
                    <p className="text-sm text-on-surface-variant">Vademécum y cálculo exacto en cc según presentación</p>
                  </div>
                </div>
                
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Buscar medicamento (ej: Fentanilo)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredMeds.map(med => (
                    <button 
                      key={med.id}
                      onClick={() => { setSelectedMed(med); setPesoSir(''); }}
                      className="text-left bg-surface border border-outline/10 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-1.5 h-full bg-error/50 group-hover:bg-error transition-colors"></div>
                      <h4 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{med.nombre}</h4>
                      <p className="text-sm text-on-surface-variant mb-2">{med.tipo}</p>
                      <p className="text-xs text-outline">{med.dosisEstandar}</p>
                    </button>
                  ))}
                  {filteredMeds.length === 0 && (
                    <div className="col-span-full text-center py-8 text-on-surface-variant">
                      No se encontraron medicamentos con ese nombre.
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Vista de Detalle de Medicamento
              <div className="animate-fade-in flex flex-col h-full">
                <button 
                  onClick={() => setSelectedMed(null)}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold mb-6 w-fit"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Volver al buscador
                </button>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Detalles Clinicos */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-3xl font-extrabold text-on-surface">{selectedMed.nombre}</h2>
                      <span className="text-xs font-bold bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-lg uppercase tracking-wider">{selectedMed.tipo}</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline/10">
                        <p className="text-sm text-on-surface-variant mb-1">Dosis Recomendada</p>
                        <p className="text-lg font-bold text-on-surface">{selectedMed.dosisEstandar}</p>
                      </div>
                      
                      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline/10">
                        <p className="text-sm text-on-surface-variant mb-1">Presentación Comercial (Colombia)</p>
                        <p className="text-lg font-bold text-on-surface">{selectedMed.presentacion}</p>
                      </div>
                      
                      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline/10">
                        <p className="text-sm text-on-surface-variant mb-1">Indicación / Uso</p>
                        <p className="text-base text-on-surface">{selectedMed.uso}</p>
                      </div>
                      
                      {selectedMed.alerta && (
                        <div className="flex items-start gap-2 bg-status-warning/10 border border-status-warning/20 p-4 rounded-2xl text-status-warning">
                          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                          <p className="font-semibold text-sm">{selectedMed.alerta}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Calculadora */}
                  <div className="w-full md:w-80 bg-surface-container-low rounded-3xl p-6 border border-outline/20 flex flex-col">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      Calcular Dosis
                    </h3>
                    
                    <label className="block text-sm font-bold text-on-surface-variant mb-2">Peso del Paciente</label>
                    <div className="relative mb-6">
                      <input 
                        type="number" 
                        placeholder="Ej: 70" 
                        value={pesoSir} 
                        onChange={e => setPesoSir(e.target.value)} 
                        className="w-full bg-surface border border-outline/20 rounded-xl py-4 px-4 focus:outline-none focus:border-error text-2xl font-bold text-center" 
                      />
                      <span className="absolute right-4 top-5 text-on-surface-variant font-bold">kg</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-end mt-4">
                      {medCalculated ? (
                        <div className="bg-error/10 border border-error/20 rounded-2xl p-5 text-center animate-fade-in relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error to-pink-500"></div>
                          <span className="text-xs font-bold text-error uppercase tracking-wider block mb-2">Cargar en Jeringa</span>
                          <div className="text-5xl font-extrabold text-on-surface mb-2">{medCalculated.volumenTotalMl}</div>
                          <span className="text-lg font-bold text-on-surface-variant mb-4 block">cc (ml)</span>
                          <div className="bg-surface/50 py-1.5 rounded-lg">
                            <span className="text-xs text-on-surface-variant font-semibold">Total activo: {medCalculated.dosisTotalMg} mg</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-surface-container border border-transparent border-dashed rounded-2xl p-6 text-center opacity-60 h-full flex flex-col items-center justify-center">
                          <Syringe className="w-8 h-8 mb-2 text-outline" />
                          <p className="text-sm font-bold text-on-surface-variant">Ingresa el peso arriba para ver los mililitros a inyectar</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
