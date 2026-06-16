import { useState } from 'react';
import { BookOpen, Search, Download, FileText, ChevronRight, Bookmark, Stethoscope, AlertTriangle, Lightbulb } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { conocimientoMedico, getEspecialidades } from '../data/conocimientoMedico';

export default function Biblioteca() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const { modoActual } = useAppContext();

  const especialidades = ['Todas', ...getEspecialidades(modoActual)];
  const documentos = conocimientoMedico[modoActual] || [];

  const filteredDocs = documentos.filter(doc => {
    const matchesSearch = doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || doc.contenido.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || doc.especialidad === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconForType = (tipo) => {
    switch(tipo) {
      case 'Enfermedad Común': return <Stethoscope className="w-6 h-6" />;
      case 'Guía Rápida': return <BookOpen className="w-6 h-6" />;
      case 'Tips Clínicos': return <Lightbulb className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="animate-fade-in pb-20 md:pb-0">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">Conocimiento Médico</h2>
        <p className="text-on-surface-variant text-lg">Guías, enfermedades comunes y tips para el <span className="uppercase font-bold text-primary">{modoActual}</span>.</p>
      </div>

      <div className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 border border-outline/10 shadow-sm mb-8">
        <div className="relative max-w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por patología, síntoma o tratamiento..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-outline/20 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex gap-3 mt-6 overflow-x-auto pb-2 custom-scrollbar">
          {especialidades.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 border border-outline/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {getIconForType(doc.tipo)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface leading-tight mb-1">{doc.titulo}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{doc.especialidad}</span>
                    <span className="text-xs text-outline font-medium">• {doc.tipo}</span>
                  </div>
                </div>
              </div>
              <button className="text-outline hover:text-primary transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-surface-container-lowest/50 rounded-2xl p-4 border border-outline/5 mb-4 text-sm text-on-surface">
              <p className="whitespace-pre-line leading-relaxed">{doc.contenido}</p>
            </div>

            {doc.tips && (
              <div className="mt-auto bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block mb-1">Tip Clínico</span>
                  <p className="text-sm text-orange-900 leading-snug">{doc.tips}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <div className="w-20 h-20 bg-surface-container mx-auto rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-outline" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">No se encontró información</h3>
            <p className="text-on-surface-variant">Prueba con otra búsqueda o cambia de especialidad.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
