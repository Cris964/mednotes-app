import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Plus, Pill, Search, AlertTriangle, CheckCircle2, Calculator, Database } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { medicamentosColombia } from '../data/medicamentosColombia';

export default function Farmacia() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    medicamento: '',
    enfermedades: '',
    descripcion: '',
    concentracion: '',
    presentacion: 'Tabletas',
    cantidad: 0,
    dosisRecomendada: '',
    unidadDosis: 'mg/kg/dia',
    fechaCaducidad: ''
  });

  // Calculadora Pediátrica
  const [pesoCalculadora, setPesoCalculadora] = useState('');
  const [medSeleccionado, setMedSeleccionado] = useState(null);

  const { modoActual } = useAppContext();

  const inventario = useLiveQuery(async () => {
    let query = db.inventario.where('modo').equals(modoActual);
    let list = await query.toArray();
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return list.filter(m => 
        m.medicamento.toLowerCase().includes(term) || 
        (m.enfermedades && m.enfermedades.toLowerCase().includes(term))
      );
    }
    return list;
  }, [searchTerm, modoActual]) || [];

  const handleSeedColombiaMeds = async () => {
    if (window.confirm('¿Deseas cargar la lista de medicamentos más usados en Colombia?')) {
      const medsToInsert = medicamentosColombia.map(m => ({ ...m, modo: modoActual }));
      await db.inventario.bulkAdd(medsToInsert);
    }
  };

  const handleAddMedicamento = async (e) => {
    e.preventDefault();
    await db.inventario.add({
      ...nuevoMedicamento,
      cantidad: parseInt(nuevoMedicamento.cantidad),
      modo: modoActual
    });
    setShowAddModal(false);
    setNuevoMedicamento({ medicamento: '', enfermedades: '', concentracion: '', presentacion: 'Tabletas', cantidad: 0, dosisRecomendada: '', unidadDosis: 'mg/kg/dia', fechaCaducidad: '' });
  };

  const handleUpdateStock = async (id, nuevaCantidad) => {
    if (nuevaCantidad < 0) return;
    await db.inventario.update(id, { cantidad: nuevaCantidad });
  };

  const isBajoStock = (cantidad) => cantidad <= 10;
  const isPorCaducar = (fecha) => {
    if (!fecha) return false;
    const dias = (new Date(fecha) - new Date()) / (1000 * 60 * 60 * 24);
    return dias > 0 && dias <= 90; // Menos de 3 meses
  };

  const calcularDosis = (med) => {
    if (!pesoCalculadora || !med.dosisRecomendada) return null;
    const peso = parseFloat(pesoCalculadora);
    const dosis = parseFloat(med.dosisRecomendada);
    const total = peso * dosis;
    return `${total.toFixed(1)} ${med.unidadDosis.split('/')[0]}`;
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Farmacia y Dosis</h2>
          <p className="text-on-surface-variant text-lg">Busca por síntoma, calcula dosis por peso y gestiona tu stock.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_8px_20px_rgba(0,98,141,0.3)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Agregar Medicamento
        </button>
      </div>

      <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm mb-8 flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre (ej: Amoxicilina) o síntoma (ej: Faringitis)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-outline/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium"
          />
        </div>
        
        <div className="flex-1 bg-primary/5 rounded-2xl p-4 flex items-center gap-4 border border-primary/10">
          <Calculator className="w-6 h-6 text-primary shrink-0" />
          <div className="flex-1">
            <span className="block text-xs font-bold text-primary uppercase mb-1">Calculadora de Dosis</span>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="Peso en Kg" 
                value={pesoCalculadora}
                onChange={(e) => setPesoCalculadora(e.target.value)}
                className="w-full max-w-[120px] bg-white border border-outline/20 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-primary"
              />
              <span className="text-sm font-bold text-on-surface-variant">kg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventario.map(med => (
          <div key={med.id} className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 border border-outline/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm
                ${isBajoStock(med.cantidad) ? 'bg-error/10 text-error' : 'bg-status-success/10 text-status-success'}`}
              >
                <Pill className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-lg text-on-surface leading-tight mb-1">{med.medicamento}</h3>
                <p className="text-sm font-bold text-primary">{med.concentracion} • {med.presentacion}</p>
                
                {isPorCaducar(med.fechaCaducidad) && (
                  <div className="mt-2 inline-flex items-center gap-1 bg-orange-500/10 text-orange-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    <AlertTriangle className="w-3 h-3" /> Por caducar
                  </div>
                )}
              </div>
            </div>

            {med.enfermedades && (
              <div className="mb-2 text-xs text-on-surface-variant line-clamp-2">
                <span className="font-bold text-outline uppercase mr-1">Usos:</span>
                {med.enfermedades}
              </div>
            )}
            {med.descripcion && (
              <div className="mb-4 text-xs text-on-surface-variant italic line-clamp-2">
                "{med.descripcion}"
              </div>
            )}

            {/* Dosis Calculator Result */}
            {med.dosisRecomendada && (
              <div className="bg-primary/5 rounded-xl p-3 mb-4 border border-primary/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-extrabold text-primary uppercase">Dosis Guía</span>
                  <span className="text-[10px] font-bold text-primary bg-white px-2 py-0.5 rounded">{med.dosisRecomendada} {med.unidadDosis}</span>
                </div>
                {pesoCalculadora && (
                  <div className="text-sm font-extrabold text-on-surface flex items-center gap-2 mt-2">
                    <Calculator className="w-4 h-4 text-primary" />
                    <span>Dar: <span className="text-primary text-lg">{calcularDosis(med)}</span></span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-auto bg-surface-container-lowest/50 rounded-2xl p-4 border border-outline/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-outline uppercase tracking-wider mb-1 block">Stock Actual</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-extrabold ${isBajoStock(med.cantidad) ? 'text-error' : 'text-on-surface'}`}>
                    {med.cantidad}
                  </span>
                  {isBajoStock(med.cantidad) && <AlertTriangle className="w-5 h-5 text-error" />}
                  {!isBajoStock(med.cantidad) && <CheckCircle2 className="w-5 h-5 text-status-success" />}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleUpdateStock(med.id, med.cantidad + 1)} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors font-bold">+</button>
                <button onClick={() => handleUpdateStock(med.id, med.cantidad - 1)} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-error/10 hover:text-error transition-colors font-bold">-</button>
              </div>
            </div>
          </div>
        ))}

        {inventario.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="w-20 h-20 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4">
              <Pill className="w-10 h-10 text-outline" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Inventario Vacío</h3>
            <p className="text-on-surface-variant mb-6">Aún no has agregado medicamentos al sistema.</p>
            <button 
              onClick={handleSeedColombiaMeds} 
              className="bg-surface-container hover:bg-surface-container-high text-on-surface px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 mx-auto"
            >
              <Database className="w-5 h-5 text-primary" />
              Cargar Medicamentos de Colombia
            </button>
          </div>
        )}
      </div>

      {/* Modal Agregar Medicamento */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 animate-fade-in border border-outline/10 custom-scrollbar">
            <h3 className="text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <Pill className="text-primary w-7 h-7" />
              Agregar Medicamento Inteligente
            </h3>
            
            <form onSubmit={handleAddMedicamento} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Nombre Comercial / Genérico</label>
                  <input required type="text" value={nuevoMedicamento.medicamento} onChange={e => setNuevoMedicamento({...nuevoMedicamento, medicamento: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary font-bold" placeholder="Ej: Amoxicilina" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Enfermedades Relacionadas (Usos)</label>
                  <input type="text" value={nuevoMedicamento.enfermedades} onChange={e => setNuevoMedicamento({...nuevoMedicamento, enfermedades: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" placeholder="Ej: Faringitis, Otitis..." />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Concentración</label>
                  <input required type="text" value={nuevoMedicamento.concentracion} onChange={e => setNuevoMedicamento({...nuevoMedicamento, concentracion: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" placeholder="Ej: 500mg" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Presentación</label>
                  <select value={nuevoMedicamento.presentacion} onChange={e => setNuevoMedicamento({...nuevoMedicamento, presentacion: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary">
                    <option value="Tabletas">Tabletas / Cápsulas</option>
                    <option value="Ampollas">Ampollas</option>
                    <option value="Jarabe">Jarabe / Suspensión</option>
                    <option value="Crema">Crema / Ungüento</option>
                    <option value="Inhalador">Inhalador</option>
                    <option value="Gotas">Gotas</option>
                  </select>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <h4 className="text-sm font-extrabold text-primary mb-3 flex items-center gap-2"><Calculator className="w-4 h-4"/> Regla de Dosis (Opcional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Cantidad</label>
                    <input type="number" step="0.1" value={nuevoMedicamento.dosisRecomendada} onChange={e => setNuevoMedicamento({...nuevoMedicamento, dosisRecomendada: e.target.value})} className="w-full bg-white border border-outline/20 rounded-xl py-2 px-3 focus:outline-none focus:border-primary" placeholder="Ej: 50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Unidad base</label>
                    <select value={nuevoMedicamento.unidadDosis} onChange={e => setNuevoMedicamento({...nuevoMedicamento, unidadDosis: e.target.value})} className="w-full bg-white border border-outline/20 rounded-xl py-2 px-3 focus:outline-none focus:border-primary">
                      <option value="mg/kg/dia">mg / kg / día</option>
                      <option value="mg/kg/dosis">mg / kg / dosis</option>
                      <option value="mcg/kg/min">mcg / kg / min</option>
                      <option value="gotas/kg">gotas / kg</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Stock Inicial</label>
                  <input required type="number" min="0" value={nuevoMedicamento.cantidad} onChange={e => setNuevoMedicamento({...nuevoMedicamento, cantidad: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Vencimiento</label>
                  <input type="date" value={nuevoMedicamento.fechaCaducidad} onChange={e => setNuevoMedicamento({...nuevoMedicamento, fechaCaducidad: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-outline/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-outline hover:bg-surface-container transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md">Guardar en Farmacia</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
