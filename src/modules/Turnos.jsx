import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Plus, Calendar as CalendarIcon, Clock, DollarSign, Wallet, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Turnos() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [nuevoTurno, setNuevoTurno] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Guardia 12h',
    hospital: '',
    horaInicio: '07:00',
    horaFin: '19:00',
  });

  const { modoActual, user } = useAppContext();

  const turnos = useLiveQuery(async () => {
    let query = db.turnos.where('modo').equals(modoActual);
    let list = await query.toArray();
    return list.reverse();
  }, [modoActual]) || [];

  const handleAddTurno = async (e) => {
    e.preventDefault();
    await db.turnos.add({ ...nuevoTurno, modo: modoActual });
    setShowAddModal(false);
    setNuevoTurno({ ...nuevoTurno, hospital: '' });
  };

  const handleDeleteTurno = async (id) => {
    if (window.confirm('¿Eliminar este turno?')) {
      await db.turnos.delete(id);
    }
  };

  const stats = useMemo(() => {
    let totalHoras = 0;
    let pagoEstimado = 0; 
    let extras = 0;
    
    // Configuración del usuario
    const baseSalary = user?.baseSalary || 3500000;
    const overtimeRate = user?.overtimeRate || 15000;
    const contractType = user?.contractType || 'Prestacion';

    turnos.forEach(t => {
      const h1 = parseInt(t.horaInicio.split(':')[0]);
      const h2 = parseInt(t.horaFin.split(':')[0]);
      let horas = h2 >= h1 ? h2 - h1 : (24 - h1) + h2;
      
      totalHoras += horas;
      
      if (t.tipo.includes('Guardia') || t.tipo === 'Horas Extras') {
        extras += horas * overtimeRate;
      }
    });

    let grossSalary = baseSalary + extras;
    // Si es prestación de servicios, usualmente se descuenta ~11% (SS) sobre el 40%
    // Para simplificar la demo, mostraremos el Bruto y un estimado Neto.
    let netSalary = contractType === 'Prestacion' ? grossSalary * 0.89 : grossSalary; 
    
    pagoEstimado = netSalary;

    return { totalHoras, pagoEstimado, extras, grossSalary };
  }, [turnos, user]);

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Turnos y Nómina</h2>
          <p className="text-on-surface-variant text-lg">Registra tus guardias para calcular horas extras y salarios.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_8px_20px_rgba(0,98,141,0.3)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Registrar Turno
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary to-primary-container text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>
          <Wallet className="w-8 h-8 text-white/80 mb-4" />
          <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-1">Pago Estimado Mes (Neto)</p>
          <h3 className="text-3xl font-extrabold">${Math.round(stats.pagoEstimado).toLocaleString('es-CO')}</h3>
          <p className="text-white/60 text-xs mt-2">
            Bruto: ${Math.round(stats.grossSalary).toLocaleString('es-CO')} ({user?.contractType})
          </p>
        </div>

        <div className="bg-surface/80 backdrop-blur-md border border-outline/10 rounded-3xl p-6 shadow-sm">
          <DollarSign className="w-8 h-8 text-status-success mb-4" />
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-1">Proyección Quincenal</p>
          <h3 className="text-3xl font-extrabold text-on-surface">${Math.round(stats.pagoEstimado / 2).toLocaleString('es-CO')}</h3>
          <p className="text-outline text-xs mt-2">Ingreso estimado por quincena</p>
        </div>

        <div className="bg-surface/80 backdrop-blur-md border border-outline/10 rounded-3xl p-6 shadow-sm">
          <Clock className="w-8 h-8 text-orange-500 mb-4" />
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-1">Horas Totales</p>
          <h3 className="text-3xl font-extrabold text-on-surface">{stats.totalHoras} h</h3>
          <p className="text-outline text-xs mt-2">Extras ganadas: ${Math.round(stats.extras).toLocaleString('es-CO')}</p>
        </div>
      </div>

      <div className="bg-surface/60 backdrop-blur-xl rounded-3xl border border-outline/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline/10 bg-surface/50">
          <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Historial de Turnos
          </h3>
        </div>
        
        <div className="divide-y divide-outline/5">
          {turnos.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-outline/50 mx-auto mb-4" />
              <p className="text-on-surface-variant">No has registrado ningún turno todavía.</p>
            </div>
          ) : (
            turnos.map((turno) => (
              <div key={turno.id} className="p-4 sm:p-6 hover:bg-surface-container-lowest/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shrink-0
                    ${turno.tipo.includes('Guardia') ? 'bg-orange-500' : 'bg-primary'}`}
                  >
                    {turno.fecha.split('-')[2]}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{turno.tipo}</h4>
                    <p className="text-sm text-on-surface-variant flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {turno.hospital || 'Hospital Rural'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-bold text-on-surface bg-surface-container px-3 py-1 rounded-lg">
                      {turno.horaInicio} - {turno.horaFin}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteTurno(turno.id)} className="text-error/70 hover:text-error hover:bg-error/10 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl p-6 md:p-8 animate-fade-in border border-outline/10">
            <h3 className="text-2xl font-bold text-on-surface mb-6">Registrar Turno</h3>
            
            <form onSubmit={handleAddTurno} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Fecha</label>
                <input required type="date" value={nuevoTurno.fecha} onChange={e => setNuevoTurno({...nuevoTurno, fecha: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Tipo de Turno</label>
                <select value={nuevoTurno.tipo} onChange={e => setNuevoTurno({...nuevoTurno, tipo: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary">
                  <option value="Turno Normal">Turno Normal</option>
                  <option value="Guardia 12h">Guardia 12h</option>
                  <option value="Guardia 24h">Guardia 24h</option>
                  <option value="Horas Extras">Horas Extras</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Lugar / Servicio</label>
                <input type="text" value={nuevoTurno.hospital} onChange={e => setNuevoTurno({...nuevoTurno, hospital: e.target.value})} placeholder="Ej. Urgencias, Centro de Salud..." className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Hora Inicio</label>
                  <input required type="time" value={nuevoTurno.horaInicio} onChange={e => setNuevoTurno({...nuevoTurno, horaInicio: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Hora Fin</label>
                  <input required type="time" value={nuevoTurno.horaFin} onChange={e => setNuevoTurno({...nuevoTurno, horaFin: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-outline/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-outline hover:bg-surface-container transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md">Guardar Turno</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-usamos el ícono de MapPin que nos faltaba arriba para no romper
function MapPin(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );
}
