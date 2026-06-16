import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Estado de Autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Estado Global: Modo de la App (internado o rural)
  const [modoActual, setModoActual] = useState('internado');

  useEffect(() => {
    // Check local storage for session
    const session = localStorage.getItem('medrural_session');
    if (session) {
      setIsAuthenticated(true);
      setUser(JSON.parse(session));
    }
    
    // Check local storage for preferred mode
    const mode = localStorage.getItem('medrural_mode');
    if (mode) {
      setModoActual(mode);
    }
  }, []);

  const login = (username, password) => {
    // Simulación de login con usuario y contraseña
    if (username === 'Admin' && password === '161224') {
      const savedSession = localStorage.getItem('medrural_session');
      const userData = savedSession ? JSON.parse(savedSession) : {
        name: 'Dra. Elizabeth',
        role: 'Médico General',
        photo: '/dra-elizabeth.jpg',
        contractType: 'Prestacion',
        baseSalary: 3500000,
        overtimeRate: 15000
      };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('medrural_session', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('medrural_session', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('medrural_session');
  };

  const toggleModo = () => {
    const nuevoModo = modoActual === 'internado' ? 'rural' : 'internado';
    setModoActual(nuevoModo);
    localStorage.setItem('medrural_mode', nuevoModo);
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      modoActual,
      login,
      logout,
      toggleModo,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
