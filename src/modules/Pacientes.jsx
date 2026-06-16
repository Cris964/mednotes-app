import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Search, Plus, UserCircle, Calendar, Phone, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Pacientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [nuevoPaciente, setNuevoPaciente] = useState({ nombre: '', documento: '', genero: 'F', fechaNacimiento: '', telefono: '' });

  const { modoActual } = useAppContext();

  // Consultar pacientes desde IndexedDB en tiempo real, filtrando por modo
  const pacientes = useLiveQuery(
    async () => {
      let query = db.pacientes.where('modo').equals(modoActual);
      let list = await query.toArray();
      
      if (searchTerm) {
        return list.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.documento.includes(searchTerm));
      }
      return list;
    },
    [searchTerm, modoActual]
  );

  const handleAddPaciente = async (e) => {
    e.preventDefault();
    await db.pacientes.add({
      ...nuevoPaciente,
      ultimaVisita: new Date().toISOString(),
      modo: modoActual
    });
    setShowAddModal(false);
    setNuevoPaciente({ nombre: '', documento: '', genero: 'F', fechaNacimiento: '', telefono: '' });
  };

  const calcularEdad = (fecha) => {
    const diff = Date.now() - new Date(fecha).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Directorio de Pacientes</h2>
          <p className="text-on-surface-variant text-lg">Gestiona la información de tus pacientes de forma local y segura.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-[0_8px_20px_rgba(0,98,141,0.3)] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Paciente
        </button>
      </div>

      <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o cédula..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-outline/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pacientes?.map(paciente => (
          <div key={paciente.id} className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 border border-outline/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <UserCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface leading-tight">{paciente.nombre}</h3>
                  <p className="text-sm text-outline font-medium">CC: {paciente.documento}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Calendar className="w-4 h-4 text-primary/60" />
                <span>{calcularEdad(paciente.fechaNacimiento)} años ({paciente.genero})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Phone className="w-4 h-4 text-primary/60" />
                <span>{paciente.telefono}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to={`/historias?paciente=${paciente.id}`} className="flex-1 bg-primary/10 text-primary font-bold py-2.5 rounded-xl text-center hover:bg-primary/20 transition-colors text-sm flex items-center justify-center gap-2">
                <Activity className="w-4 h-4" />
                Historia Clínica
              </Link>
            </div>
          </div>
        ))}

        {pacientes?.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="w-20 h-20 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-outline" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">No se encontraron pacientes</h3>
            <p className="text-on-surface-variant">Intenta con otra búsqueda o agrega uno nuevo.</p>
          </div>
        )}
      </div>

      {/* Modal Nuevo Paciente */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-3xl w-full max-w-lg shadow-2xl p-6 animate-fade-in border border-outline/10">
            <h3 className="text-2xl font-bold text-on-surface mb-6">Nuevo Paciente</h3>
            <form onSubmit={handleAddPaciente} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Nombre Completo</label>
                <input required type="text" value={nuevoPaciente.nombre} onChange={e => setNuevoPaciente({...nuevoPaciente, nombre: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Cédula</label>
                  <input required type="text" value={nuevoPaciente.documento} onChange={e => setNuevoPaciente({...nuevoPaciente, documento: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Género</label>
                  <select value={nuevoPaciente.genero} onChange={e => setNuevoPaciente({...nuevoPaciente, genero: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary">
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">F. Nacimiento</label>
                  <input required type="date" value={nuevoPaciente.fechaNacimiento} onChange={e => setNuevoPaciente({...nuevoPaciente, fechaNacimiento: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-1">Teléfono</label>
                  <input type="tel" value={nuevoPaciente.telefono} onChange={e => setNuevoPaciente({...nuevoPaciente, telefono: e.target.value})} className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-outline/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-outline hover:bg-surface-container transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md">Guardar Paciente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
