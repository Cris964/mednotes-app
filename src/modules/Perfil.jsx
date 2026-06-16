import { useState, useRef } from 'react';
import { User, Award, Shield, Settings, LogOut, ChevronRight, Bell, Smartphone, HelpCircle, Edit3, Save, X, Camera, DollarSign, Briefcase, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Perfil() {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const { user, modoActual, logout, updateUser } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    role: user?.role || '',
    photo: user?.photo || '',
    contractType: user?.contractType || 'Prestacion',
    baseSalary: user?.baseSalary || 3500000,
    overtimeRate: user?.overtimeRate || 15000
  });

  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser({
      ...editForm,
      baseSalary: parseInt(editForm.baseSalary),
      overtimeRate: parseInt(editForm.overtimeRate)
    });
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0 max-w-4xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Mi Perfil</h2>
        <p className="text-on-surface-variant text-lg">Configuración de tu cuenta y datos profesionales.</p>
      </div>

      <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-outline/10 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="relative group cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-surface shadow-xl relative">
              <img 
                alt={editForm.name || "Doctor"} 
                className="w-full h-full object-cover" 
                src={editForm.photo || "/dra-elizabeth.jpg"} 
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            {!isEditing && (
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-status-success rounded-full border-4 border-surface flex items-center justify-center shadow-sm">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            {isEditing ? (
              <div className="space-y-4 max-w-md mx-auto md:mx-0">
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})} 
                  className="w-full text-2xl font-extrabold bg-surface-container-low border border-outline/20 rounded-xl py-2 px-4 focus:outline-none focus:border-primary"
                  placeholder="Tu Nombre"
                />
                <input 
                  type="text" 
                  value={editForm.role} 
                  onChange={e => setEditForm({...editForm, role: e.target.value})} 
                  className="w-full text-lg bg-surface-container-low border border-outline/20 rounded-xl py-2 px-4 focus:outline-none focus:border-primary"
                  placeholder="Especialidad"
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <h3 className="text-3xl font-extrabold text-on-surface mb-1">{user?.name}</h3>
                  <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    <Edit3 className="w-4 h-4" /> Editar Perfil
                  </button>
                </div>
                <p className="text-primary font-bold text-lg mb-4 flex items-center justify-center md:justify-start gap-2 uppercase">
                  <Award className="w-5 h-5" /> {user?.role} • Modo: {modoActual}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="bg-surface-container-low px-4 py-2 rounded-xl border border-outline/10 text-sm">
                    <span className="block text-outline font-bold text-xs uppercase tracking-wider mb-0.5">Centro Actual</span>
                    <span className="font-semibold text-on-surface">{modoActual === 'internado' ? 'Hospital Regional' : 'Puesto de Salud Veredal'}</span>
                  </div>
                  <div className="bg-surface-container-low px-4 py-2 rounded-xl border border-outline/10 text-sm">
                    <span className="block text-outline font-bold text-xs uppercase tracking-wider mb-0.5">Contrato</span>
                    <span className="font-semibold text-on-surface">{user?.contractType === 'Planta' ? 'Planta' : 'Prestación de Servicios'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-surface/80 backdrop-blur-md rounded-3xl p-6 border border-outline/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-8 animate-fade-in">
          <h4 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" /> Configuración Financiera (Nómina)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">Tipo de Contrato</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <select 
                  value={editForm.contractType} 
                  onChange={e => setEditForm({...editForm, contractType: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="Planta">De Planta (Nomina Oficial)</option>
                  <option value="Prestacion">Prestación de Servicios (OPS)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">Salario Base (COP)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  type="number" 
                  value={editForm.baseSalary} 
                  onChange={e => setEditForm({...editForm, baseSalary: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">Valor Hora Extra (COP)</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  type="number" 
                  value={editForm.overtimeRate} 
                  onChange={e => setEditForm({...editForm, overtimeRate: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-outline/10">
            <button onClick={() => {
              setIsEditing(false);
              setEditForm({
                name: user?.name, role: user?.role, photo: user?.photo, 
                contractType: user?.contractType, baseSalary: user?.baseSalary, overtimeRate: user?.overtimeRate
              });
            }} className="px-6 py-3 rounded-xl font-bold text-outline hover:bg-surface-container transition-colors flex items-center gap-2">
              <X className="w-5 h-5" /> Cancelar
            </button>
            <button onClick={handleSave} className="px-6 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md flex items-center gap-2">
              <Save className="w-5 h-5" /> Guardar Cambios
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 border border-outline/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <h4 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" /> Ajustes de la App
            </h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface text-sm">Sincronización Offline</h5>
                    <p className="text-xs text-on-surface-variant">Guardar datos en el teléfono</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSyncEnabled(!syncEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${syncEnabled ? 'bg-status-success' : 'bg-surface-container-high'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${syncEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface text-sm">Notificaciones</h5>
                    <p className="text-xs text-on-surface-variant">Alertas de turnos e inventario</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifEnabled(!notifEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notifEnabled ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 border border-outline/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <h4 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Cuenta y Soporte
            </h4>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                  <span className="font-bold text-on-surface text-sm">Centro de Ayuda Rural</span>
                </div>
                <ChevronRight className="w-4 h-4 text-outline" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-outline/10">
              <button onClick={logout} className="w-full bg-error/10 text-error font-bold p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-error hover:text-white transition-all shadow-sm">
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-12 mb-6">
        <p className="text-xs font-bold text-outline uppercase tracking-widest">MedRural App v2.0.0</p>
        <p className="text-xs text-outline/60 mt-1">Sincronización PWA Local Activa</p>
      </div>
    </div>
  );
}
