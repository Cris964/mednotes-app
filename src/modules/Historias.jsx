import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Search, Plus, FileText, UserCircle, Save, Clock, Activity, Heart, Thermometer, Ruler, Scale } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Historias() {
  const [searchParams] = useSearchParams();
  const pacienteQueryId = searchParams.get('paciente');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(pacienteQueryId ? true : false);
  const [nuevaHistoria, setNuevaHistoria] = useState({
    pacienteId: pacienteQueryId ? parseInt(pacienteQueryId) : '',
    motivoConsulta: '',
    enfermedadActual: '',
    diagnostico: '',
    tratamiento: '',
    notas: '',
    // Signos Vitales
    fc: '',
    fr: '',
    ta: '',
    temp: '',
    sato2: '',
    peso: '',
    talla: ''
  });

  const { modoActual } = useAppContext();

  const pacientes = useLiveQuery(() => db.pacientes.where('modo').equals(modoActual).toArray(), [modoActual]) || [];
  const historias = useLiveQuery(async () => {
    let query = db.historias.where('modo').equals(modoActual);
    let list = await query.toArray();
    
    if (searchTerm) {
      list = list.filter(h => h.diagnostico.toLowerCase().includes(searchTerm.toLowerCase()) || h.motivoConsulta.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return list.reverse();
  }, [searchTerm, modoActual]);

  const handleAddHistoria = async (e) => {
    e.preventDefault();
    if (!nuevaHistoria.pacienteId) return alert('Selecciona un paciente');
    
    await db.historias.add({
      ...nuevaHistoria,
      pacienteId: parseInt(nuevaHistoria.pacienteId),
      fechaHora: new Date().toISOString(),
      modo: modoActual
    });
    
    setShowAddModal(false);
    setNuevaHistoria({ pacienteId: '', motivoConsulta: '', enfermedadActual: '', diagnostico: '', tratamiento: '', notas: '', fc:'', fr:'', ta:'', temp:'', sato2:'', peso:'', talla:'' });
  };

  const getPaciente = (id) => pacientes.find(p => p.id === id);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'Edad desconocida';
    const hoy = new Date();
    const nace = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nace.getFullYear();
    const m = hoy.getMonth() - nace.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nace.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Historias Clínicas</h2>
          <p className="text-on-surface-variant text-lg">Registros médicos detallados con constantes vitales.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_8px_20px_rgba(0,98,141,0.3)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Evolución
        </button>
      </div>

      <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por diagnóstico o motivo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-outline/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="space-y-6">
        {historias?.map(historia => {
          const paciente = getPaciente(historia.pacienteId);
          return (
            <div key={historia.id} className="bg-surface/60 backdrop-blur-md rounded-3xl overflow-hidden border border-outline/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
              {/* Encabezado Paciente */}
              <div className="bg-primary/5 px-6 py-4 border-b border-outline/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                    <UserCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-on-surface leading-tight">{paciente?.nombre || 'Desconocido'}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant mt-1">
                      <span className="font-medium">ID: {paciente?.documento}</span>
                      <span className="w-1 h-1 bg-outline/40 rounded-full"></span>
                      <span className="font-medium">{calcularEdad(paciente?.fechaNacimiento)}</span>
                      <span className="w-1 h-1 bg-outline/40 rounded-full"></span>
                      <span className="font-medium uppercase">{paciente?.genero}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary font-bold bg-white/60 px-3 py-1.5 rounded-lg border border-primary/10">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(historia.fechaHora).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>

              <div className="p-6">
                {/* Signos Vitales (Si existen) */}
                {(historia.fc || historia.ta || historia.peso) && (
                  <div className="flex flex-wrap gap-3 mb-6 bg-surface-container-lowest p-4 rounded-2xl border border-outline/5">
                    {historia.ta && <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline/10"><Activity className="w-3.5 h-3.5 text-error"/> TA: {historia.ta}</span>}
                    {historia.fc && <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline/10"><Heart className="w-3.5 h-3.5 text-status-success"/> FC: {historia.fc} lpm</span>}
                    {historia.fr && <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline/10"><Activity className="w-3.5 h-3.5 text-primary"/> FR: {historia.fr} rpm</span>}
                    {historia.temp && <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline/10"><Thermometer className="w-3.5 h-3.5 text-orange-500"/> T: {historia.temp}°C</span>}
                    {historia.sato2 && <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline/10"><Activity className="w-3.5 h-3.5 text-blue-500"/> SpO2: {historia.sato2}%</span>}
                    {historia.peso && <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline/10"><Scale className="w-3.5 h-3.5 text-purple-500"/> {historia.peso} kg</span>}
                    {historia.talla && <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline/10"><Ruler className="w-3.5 h-3.5 text-teal-500"/> {historia.talla} cm</span>}
                  </div>
                )}

                {/* Resumen Clínico */}
                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">Motivo de Consulta & Enfermedad Actual</span>
                    <p className="text-on-surface text-sm font-semibold mb-1">"{historia.motivoConsulta}"</p>
                    <p className="text-on-surface-variant text-sm whitespace-pre-wrap">{historia.enfermedadActual}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-outline/5">
                    <div>
                      <span className="text-xs font-bold text-error uppercase tracking-wider mb-1 block">Diagnóstico (CIE-10)</span>
                      <p className="text-on-surface text-sm font-bold bg-error/5 p-3 rounded-xl border border-error/10">{historia.diagnostico}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-status-success uppercase tracking-wider mb-1 block">Plan y Tratamiento</span>
                      <p className="text-on-surface text-sm bg-status-success/5 p-3 rounded-xl border border-status-success/10 whitespace-pre-wrap">{historia.tratamiento}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {historias?.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-outline" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">No hay historias clínicas registradas</h3>
            <p className="text-on-surface-variant mb-6">Comienza a registrar las atenciones de tus pacientes aquí.</p>
            <button onClick={() => setShowAddModal(true)} className="text-primary font-bold hover:underline">Crear primera evolución</button>
          </div>
        )}
      </div>

      {/* Modal Nueva Historia */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 animate-fade-in border border-outline/10 custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3">
                <FileText className="text-primary w-7 h-7" />
                Nueva Evolución Clínica
              </h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center bg-surface-container hover:bg-surface-container-high rounded-full font-bold">X</button>
            </div>
            
            <form onSubmit={handleAddHistoria} className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <label className="block text-sm font-extrabold text-primary mb-2 uppercase tracking-wide">Paciente</label>
                <select 
                  required 
                  value={nuevaHistoria.pacienteId} 
                  onChange={e => setNuevaHistoria({...nuevaHistoria, pacienteId: e.target.value})} 
                  className="w-full bg-white border border-outline/20 rounded-xl py-3 px-4 focus:outline-none focus:border-primary font-bold shadow-sm"
                >
                  <option value="" disabled>Selecciona un paciente del directorio...</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} - {p.documento} ({calcularEdad(p.fechaNacimiento)})</option>
                  ))}
                </select>
                {pacientes.length === 0 && <p className="text-xs text-error mt-2">Primero debes <Link to="/pacientes" className="underline font-bold">crear un paciente</Link> en el directorio.</p>}
              </div>

              {/* Signos Vitales */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline/10">
                <h4 className="text-sm font-extrabold text-on-surface mb-4 uppercase tracking-wide flex items-center gap-2"><Activity className="w-4 h-4 text-error"/> Constantes Vitales</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase mb-1">TA (mmHg)</label>
                    <input type="text" value={nuevaHistoria.ta} onChange={e => setNuevaHistoria({...nuevaHistoria, ta: e.target.value})} className="w-full bg-white border border-outline/20 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary" placeholder="120/80" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase mb-1">FC (lpm)</label>
                    <input type="number" value={nuevaHistoria.fc} onChange={e => setNuevaHistoria({...nuevaHistoria, fc: e.target.value})} className="w-full bg-white border border-outline/20 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary" placeholder="80" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase mb-1">FR (rpm)</label>
                    <input type="number" value={nuevaHistoria.fr} onChange={e => setNuevaHistoria({...nuevaHistoria, fr: e.target.value})} className="w-full bg-white border border-outline/20 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary" placeholder="16" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase mb-1">Temp (°C)</label>
                    <input type="number" step="0.1" value={nuevaHistoria.temp} onChange={e => setNuevaHistoria({...nuevaHistoria, temp: e.target.value})} className="w-full bg-white border border-outline/20 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary" placeholder="36.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase mb-1">SpO2 (%)</label>
                    <input type="number" value={nuevaHistoria.sato2} onChange={e => setNuevaHistoria({...nuevaHistoria, sato2: e.target.value})} className="w-full bg-white border border-outline/20 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary" placeholder="98" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase mb-1">Peso (kg)</label>
                    <input type="number" step="0.1" value={nuevaHistoria.peso} onChange={e => setNuevaHistoria({...nuevaHistoria, peso: e.target.value})} className="w-full bg-white border border-outline/20 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary" placeholder="70.5" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-outline uppercase mb-1">Talla (cm)</label>
                    <input type="number" value={nuevaHistoria.talla} onChange={e => setNuevaHistoria({...nuevaHistoria, talla: e.target.value})} className="w-full bg-white border border-outline/20 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary" placeholder="175" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Motivo de Consulta</label>
                <input required type="text" value={nuevaHistoria.motivoConsulta} onChange={e => setNuevaHistoria({...nuevaHistoria, motivoConsulta: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary font-bold" placeholder="Ej: Dolor abdominal de 3 días de evolución..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Enfermedad Actual (Anamnesis)</label>
                <textarea required rows="4" value={nuevaHistoria.enfermedadActual} onChange={e => setNuevaHistoria({...nuevaHistoria, enfermedadActual: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 px-4 focus:outline-none focus:border-primary resize-none" placeholder="Describe los síntomas, aliviantes, agravantes, inicio del cuadro..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-error/5 p-4 rounded-xl border border-error/10">
                  <label className="block text-sm font-extrabold text-error mb-2">Diagnóstico Presuntivo/Definitivo</label>
                  <input required type="text" value={nuevaHistoria.diagnostico} onChange={e => setNuevaHistoria({...nuevaHistoria, diagnostico: e.target.value})} className="w-full bg-white border border-error/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-error focus:ring-1 focus:ring-error font-bold" placeholder="Ej: Gastroenteritis infecciosa (A09)" />
                </div>
                <div className="bg-status-success/5 p-4 rounded-xl border border-status-success/10">
                  <label className="block text-sm font-extrabold text-status-success mb-2">Plan y Tratamiento</label>
                  <textarea required rows="3" value={nuevaHistoria.tratamiento} onChange={e => setNuevaHistoria({...nuevaHistoria, tratamiento: e.target.value})} className="w-full bg-white border border-status-success/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-status-success focus:ring-1 focus:ring-status-success resize-none" placeholder="Medicamentos, dosis, incapacidad, recomendaciones..."></textarea>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Notas Privadas / Observaciones</label>
                <textarea rows="2" value={nuevaHistoria.notas} onChange={e => setNuevaHistoria({...nuevaHistoria, notas: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 px-4 focus:outline-none focus:border-primary resize-none text-sm" placeholder="Opcional. Notas que no van en la receta..."></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-outline/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 rounded-xl font-bold text-outline hover:bg-surface-container transition-colors">Cancelar</button>
                <button type="submit" disabled={pacientes.length === 0} className="px-8 py-3 rounded-xl font-extrabold bg-primary text-white hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_8px_20px_rgba(0,98,141,0.3)] flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Guardar Evolución
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
