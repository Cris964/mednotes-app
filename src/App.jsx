import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, Bell, Clock, Plus, LayoutDashboard, FileText, Users, Calendar, Pill, GraduationCap, Calculator, MapPin, BookOpen, CheckSquare, Lightbulb, User, ChevronRight, X, ArrowLeftRight, Bot } from 'lucide-react'
import { useAppContext } from './context/AppContext'
import Login from './modules/Login'

// Mock Components for Modules
const PlaceholderModule = ({ title, icon: Icon }) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in">
    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
      <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
    </div>
    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-4">{title}</h2>
    <p className="text-on-surface-variant max-w-md text-center">Este módulo está en construcción. Pronto podrás gestionar toda la información desde aquí.</p>
    <Link to="/" className="mt-8 px-6 py-3 bg-surface border border-outline/20 rounded-full hover:bg-surface-container-high hover:scale-105 transition-all shadow-sm font-semibold">
      Volver al Inicio
    </Link>
  </div>
)

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, modoActual, toggleModo } = useAppContext();
  
  const isInternado = modoActual === 'internado';
  
  return (
    <div className="bg-background text-on-background pb-24 md:pb-0 md:pl-80 min-h-screen font-body-md transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-clinical-purple/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-surface/80 backdrop-blur-xl border-b border-outline/10 transition-all duration-300 flex justify-between items-center px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-container tracking-tight hidden sm:block">MedRural</h1>
        </div>
        
        {/* Context Toggle */}
        <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-outline/10 shadow-inner">
          <button 
            onClick={toggleModo}
            className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all ${isInternado ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Internado
          </button>
          <button 
            onClick={toggleModo}
            className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all ${!isInternado ? 'bg-status-success text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Rural
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-primary">
          <button className="relative p-2 hover:bg-primary/10 rounded-full transition-colors hidden sm:block">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full animate-pulse border-2 border-surface"></span>
          </button>
          <Link to="/perfil" className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-primary cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
            <img alt="Doctor Profile" className="w-full h-full object-cover" src={user?.photo || "/dra-elizabeth.jpg"} />
          </Link>
        </div>
      </header>

      {/* NavigationDrawer Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* NavigationDrawer */}
      <aside className={`flex flex-col h-full py-8 w-80 fixed left-0 top-0 z-[60] bg-surface/95 backdrop-blur-2xl border-r border-outline/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ease-in-out duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="px-6 mb-8 flex justify-between items-start">
          <Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary-container overflow-hidden border-2 border-white shadow-md">
              <img alt="Doctor" className="w-full h-full object-cover" src={user?.photo || "/dra-elizabeth.jpg"} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface truncate w-32">{user?.name || "Dra. Elizabeth"}</h2>
              <p className="text-xs text-on-surface-variant font-medium bg-primary/10 inline-block px-2 py-0.5 rounded-full mt-1 uppercase">
                {modoActual}
              </p>
            </div>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 rounded-full hover:bg-surface-container text-outline"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-20">
          <ul className="space-y-1">
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${isHome ? 'bg-primary text-white shadow-md shadow-primary/30 translate-x-1' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <LayoutDashboard className={`w-5 h-5 ${isHome ? 'fill-white/20' : ''}`} />
                <span className="font-semibold">Inicio</span>
              </Link>
            </li>
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-outline uppercase tracking-widest">Atención</div>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/historias" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/historias' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <FileText className="w-5 h-5" />
                <span>Historias Clínicas</span>
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/pacientes" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/pacientes' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <Users className="w-5 h-5" />
                <span>Pacientes</span>
              </Link>
            </li>
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-outline uppercase tracking-widest">Administrativo</div>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/turnos" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/turnos' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <Calendar className="w-5 h-5" />
                <span>Turnos y Nómina</span>
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/farmacia" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/farmacia' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <Pill className="w-5 h-5" />
                <span>Farmacia</span>
              </Link>
            </li>
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-outline uppercase tracking-widest">Inteligencia Artificial</div>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/ia" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/ia' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <Bot className="w-5 h-5" />
                <span>Asistente Clínico IA</span>
              </Link>
            </li>
            <div className="pt-4 pb-2 px-4 text-xs font-bold text-outline uppercase tracking-widest">Herramientas</div>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/caces" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/caces' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <GraduationCap className="w-5 h-5" />
                <span>Simulador CACES</span>
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/herramientas" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/herramientas' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <Calculator className="w-5 h-5" />
                <span>Calculadoras</span>
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/rural" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/rural' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <MapPin className="w-5 h-5" />
                <span>Módulo Rural</span>
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/biblioteca" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${location.pathname==='/biblioteca' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface hover:bg-surface-container hover:text-primary'}`}>
                <BookOpen className="w-5 h-5" />
                <span>Biblioteca Médica</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {children}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-surface/90 backdrop-blur-xl border-t border-outline/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl pb-safe">
        <Link to="/" className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${isHome ? 'text-primary' : 'text-outline hover:text-primary'}`}>
          <LayoutDashboard className={`w-6 h-6 ${isHome ? 'scale-110 fill-primary/20' : ''}`} />
          <span className="text-[10px] mt-1 font-bold">Inicio</span>
        </Link>
        <Link to="/historias" className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${location.pathname==='/historias' ? 'text-primary' : 'text-outline hover:text-primary'}`}>
          <FileText className={`w-6 h-6 ${location.pathname==='/historias' ? 'scale-110 fill-primary/20' : ''}`} />
          <span className="text-[10px] mt-1 font-bold">Historias</span>
        </Link>
        <div className="-mt-8">
          <Link to="/pacientes" className="bg-gradient-to-r from-primary to-primary-container text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,98,141,0.4)] hover:scale-110 transition-transform active:scale-95">
            <Plus className="w-8 h-8" />
          </Link>
        </div>
        <Link to="/turnos" className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${location.pathname==='/turnos' ? 'text-primary' : 'text-outline hover:text-primary'}`}>
          <Calendar className={`w-6 h-6 ${location.pathname==='/turnos' ? 'scale-110 fill-primary/20' : ''}`} />
          <span className="text-[10px] mt-1 font-bold">Turnos</span>
        </Link>
        <Link to="/perfil" className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${location.pathname==='/perfil' ? 'text-primary' : 'text-outline hover:text-primary'}`}>
          <User className={`w-6 h-6 ${location.pathname==='/perfil' ? 'scale-110 fill-primary/20' : ''}`} />
          <span className="text-[10px] mt-1 font-bold">Perfil</span>
        </Link>
      </nav>
    </div>
  )
}

const Dashboard = () => {
  const { user, modoActual } = useAppContext();
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-2">¡Hola, {user?.name || 'Doctora'}! 👋</h2>
        <p className="text-on-surface-variant text-lg">Tienes <span className="font-bold text-primary">3 pacientes</span> en el <span className="uppercase font-bold text-primary">{modoActual}</span>.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Simulador CACES */}
        <Link to="/caces" className="group relative bg-surface/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline/10 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-6 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white shadow-lg shadow-primary/30 flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="bg-primary/10 text-primary font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">Destacado</span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 flex items-center gap-1 group-hover:text-primary transition-colors">
            Simulador CACES
            <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Banco de preguntas y simuladores para tus exámenes.</p>
        </Link>

        {/* Herramientas */}
        <Link to="/herramientas" className="group relative bg-surface/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline/10 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-clinical-purple/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-6 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <Calculator className="w-7 h-7" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 flex items-center gap-1 group-hover:text-clinical-purple transition-colors">
            Herramientas
            <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Calculadoras médicas y plantillas clínicas de uso rápido.</p>
        </Link>

        {/* Módulo Rural */}
        <Link to="/rural" className="group relative bg-surface/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline/10 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-status-success/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-6 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 flex items-center gap-1 group-hover:text-status-success transition-colors">
            Módulo Rural
            <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Guías offline y mapas de plazas para tu año rural.</p>
        </Link>

        {/* Biblioteca */}
        <Link to="/biblioteca" className="group relative bg-surface/60 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline/10 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="flex justify-between items-start mb-6 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2 flex items-center gap-1 group-hover:text-orange-600 transition-colors">
            Biblioteca
            <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </h3>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">Artículos, libros y referencias offline.</p>
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-on-surface mb-6">Próximos Turnos</h2>
        <div className="bg-surface/60 backdrop-blur-md rounded-3xl p-6 border border-outline/10 shadow-sm">
          <Link to="/turnos" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface transition-colors cursor-pointer border border-transparent hover:border-outline/10">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">12<br/><span className="text-[10px] font-normal leading-none">OCT</span></div>
            <div className="flex-1">
              <h4 className="font-bold text-on-surface">Urgencias - Noche</h4>
              <p className="text-sm text-on-surface-variant">Hospital Nivel 1 • 19:00 - 07:00</p>
            </div>
            <ChevronRight className="w-5 h-5 text-outline" />
          </Link>
        </div>
      </div>
    </div>
  )
}

import Pacientes from './modules/Pacientes'
import Historias from './modules/Historias'
import Turnos from './modules/Turnos'
import Farmacia from './modules/Farmacia'
import Herramientas from './modules/Herramientas'
import Caces from './modules/Caces'
import Rural from './modules/Rural'
import Biblioteca from './modules/Biblioteca'
import Perfil from './modules/Perfil'
import AsistenteIA from './modules/AsistenteIA'

function App() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/historias" element={<Historias />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/farmacia" element={<Farmacia />} />
          <Route path="/caces" element={<Caces />} />
          <Route path="/herramientas" element={<Herramientas />} />
          <Route path="/rural" element={<Rural />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/ia" element={<AsistenteIA />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
