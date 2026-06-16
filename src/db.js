import Dexie from 'dexie';

export const db = new Dexie('MedRuralDB');

// Definir la estructura de la base de datos local (IndexedDB)
// ++id significa auto-incrementable
db.version(3).stores({
  pacientes: '++id, nombre, documento, genero, fechaNacimiento, telefono, ultimaVisita, modo',
  historias: '++id, pacienteId, fechaHora, motivoConsulta, enfermedadActual, diagnostico, tratamiento, notas, modo',
  turnos: '++id, fecha, tipo, hospital, horaInicio, horaFin, modo',
  inventario: '++id, medicamento, enfermedades, concentracion, presentacion, cantidad, fechaCaducidad, modo'
});

// Semilla de datos iniciales (opcional, para desarrollo)
db.on('populate', () => {
  db.pacientes.add({
    nombre: 'Ana María Gómez', documento: '1023456789', genero: 'F', fechaNacimiento: '1985-04-12', telefono: '3101234567', ultimaVisita: new Date().toISOString(), modo: 'internado'
  });
  db.pacientes.add({
    nombre: 'Carlos Eduardo Ruiz', documento: '1098765432', genero: 'M', fechaNacimiento: '1950-11-23', telefono: '3209876543', ultimaVisita: new Date().toISOString(), modo: 'rural'
  });
  
  // Semilla de Inventario (Farmacia)
  const medicamentosSemilla = [
    { medicamento: 'Amoxicilina', enfermedades: 'Faringitis, Otitis, Neumonía, Infección bacteriana', concentracion: '500mg', presentacion: 'Tabletas', cantidad: 50, fechaCaducidad: '2027-12-31', modo: 'rural', dosisRecomendada: '50', unidadDosis: 'mg/kg/dia' },
    { medicamento: 'Amoxicilina', enfermedades: 'Faringitis, Otitis, Neumonía, Infección bacteriana', concentracion: '250mg/5ml', presentacion: 'Jarabe', cantidad: 20, fechaCaducidad: '2027-05-31', modo: 'rural', dosisRecomendada: '50', unidadDosis: 'mg/kg/dia' },
    { medicamento: 'Acetaminofén (Paracetamol)', enfermedades: 'Fiebre, Dolor leve, Cefalea, Mialgias', concentracion: '500mg', presentacion: 'Tabletas', cantidad: 200, fechaCaducidad: '2028-01-01', modo: 'rural', dosisRecomendada: '15', unidadDosis: 'mg/kg/dosis' },
    { medicamento: 'Acetaminofén (Paracetamol)', enfermedades: 'Fiebre, Dolor leve', concentracion: '150mg/5ml', presentacion: 'Jarabe', cantidad: 30, fechaCaducidad: '2026-10-15', modo: 'rural', dosisRecomendada: '15', unidadDosis: 'mg/kg/dosis' },
    { medicamento: 'Ibuprofeno', enfermedades: 'Dolor moderado, Inflamación, Fiebre', concentracion: '400mg', presentacion: 'Tabletas', cantidad: 100, fechaCaducidad: '2027-06-30', modo: 'rural', dosisRecomendada: '10', unidadDosis: 'mg/kg/dosis' },
    { medicamento: 'Azitromicina', enfermedades: 'Faringitis estreptocócica, Infección respiratoria, ETS', concentracion: '500mg', presentacion: 'Tabletas', cantidad: 15, fechaCaducidad: '2026-11-30', modo: 'internado', dosisRecomendada: '10', unidadDosis: 'mg/kg/dia' },
    { medicamento: 'Losartán', enfermedades: 'Hipertensión arterial, HTA', concentracion: '50mg', presentacion: 'Tabletas', cantidad: 300, fechaCaducidad: '2028-03-15', modo: 'rural', dosisRecomendada: '1', unidadDosis: 'mg/kg/dia' },
    { medicamento: 'Omeprazol', enfermedades: 'Gastritis, Reflujo gastroesofágico, Dispepsia', concentracion: '20mg', presentacion: 'Cápsulas', cantidad: 120, fechaCaducidad: '2027-09-01', modo: 'rural', dosisRecomendada: '1', unidadDosis: 'mg/kg/dia' },
    { medicamento: 'Loratadina', enfermedades: 'Alergias, Rinitis, Urticaria', concentracion: '10mg', presentacion: 'Tabletas', cantidad: 50, fechaCaducidad: '2027-02-28', modo: 'rural', dosisRecomendada: '0.2', unidadDosis: 'mg/kg/dia' },
    { medicamento: 'Ceftriaxona', enfermedades: 'Meningitis, Infección severa, Sepsis', concentracion: '1g', presentacion: 'Ampollas', cantidad: 10, fechaCaducidad: '2026-08-30', modo: 'internado', dosisRecomendada: '50', unidadDosis: 'mg/kg/dia' },
  ];
  db.inventario.bulkAdd(medicamentosSemilla);
});
