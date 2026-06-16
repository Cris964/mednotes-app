import { useState } from 'react';
import { MapPin, Search, Navigation2, Info, CheckCircle2 } from 'lucide-react';

export default function Rural() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Datos ficticios de plazas rurales
  const plazas = [
    { id: 1, nombre: 'Centro de Salud La Victoria', municipio: 'La Victoria', departamento: 'Valle del Cauca', tipo: 'Centro de Salud Nivel 1', zona: 'Urbano/Rural', salario: '3.800.000', vacantes: 2, riesgo: 'Bajo' },
    { id: 2, nombre: 'Hospital San Juan de Dios', municipio: 'Andes', departamento: 'Antioquia', tipo: 'Hospital Nivel 2', zona: 'Urbano', salario: '4.200.000', vacantes: 1, riesgo: 'Medio' },
    { id: 3, nombre: 'Puesto de Salud Alto Baudó', municipio: 'Alto Baudó', departamento: 'Chocó', tipo: 'Puesto de Salud', zona: 'Rural Disperso', salario: '5.100.000', vacantes: 3, riesgo: 'Alto' },
    { id: 4, nombre: 'Hospital Regional', municipio: 'San Gil', departamento: 'Santander', tipo: 'Hospital Nivel 2', zona: 'Urbano', salario: '3.500.000', vacantes: 0, riesgo: 'Bajo' },
    { id: 5, nombre: 'Centro Médico Indígena', municipio: 'Uribia', departamento: 'La Guajira', tipo: 'Nivel 1 Especial', zona: 'Rural', salario: '4.800.000', vacantes: 2, riesgo: 'Medio' },
  ];

  const filteredPlazas = plazas.filter(p => 
    p.municipio.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Módulo Rural</h2>
        <p className="text-on-surface-variant text-lg">Explora las plazas para tu año rural, salarios y niveles de riesgo.</p>
      </div>

      <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por municipio, departamento o centro..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-outline/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Mapa / Imagen */}
        <div className="lg:col-span-1">
          <div className="bg-surface/80 backdrop-blur-xl rounded-3xl border border-outline/10 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-outline/10 bg-surface/50">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <Navigation2 className="w-5 h-5 text-primary" />
                Mapa de Plazas
              </h3>
            </div>
            <div className="flex-1 bg-surface-container-lowest relative min-h-[300px] flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
              <div className="relative z-10">
                <MapPin className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                <p className="text-sm font-bold text-on-surface-variant">Mapa Interactivo Offline</p>
                <p className="text-xs text-outline mt-2">El mapa completo de Colombia se descarga al instalar la PWA.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Lista de Plazas */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPlazas.map(plaza => (
            <div key={plaza.id} className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 border border-outline/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{plaza.tipo}</span>
                    {plaza.vacantes > 0 ? (
                      <span className="bg-status-success/10 text-status-success flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> {plaza.vacantes} Vacantes
                      </span>
                    ) : (
                      <span className="bg-error/10 text-error text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Sin Vacantes
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-1">{plaza.nombre}</h3>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {plaza.municipio}, {plaza.departamento}
                  </p>
                </div>
                
                <div className="sm:text-right bg-surface-container-low sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                  <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Salario Estimado</p>
                  <p className="text-xl font-extrabold text-on-surface">${plaza.salario}</p>
                  <div className="mt-2 flex sm:justify-end items-center gap-1">
                    <span className="text-xs text-on-surface-variant font-medium">Riesgo:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      plaza.riesgo === 'Alto' ? 'bg-error/10 text-error' : 
                      plaza.riesgo === 'Medio' ? 'bg-orange-500/10 text-orange-600' : 
                      'bg-status-success/10 text-status-success'
                    }`}>{plaza.riesgo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredPlazas.length === 0 && (
            <div className="py-12 text-center bg-surface/60 rounded-3xl border border-outline/10">
              <Info className="w-12 h-12 text-outline/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-on-surface mb-2">No se encontraron plazas</h3>
              <p className="text-on-surface-variant">Intenta buscar con otro departamento o municipio.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
