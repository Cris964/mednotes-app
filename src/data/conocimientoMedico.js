export const conocimientoMedico = {
  internado: [
    {
      id: 'int-mi-1',
      especialidad: 'Medicina Interna',
      titulo: 'Manejo de Cetoacidosis Diabética (CAD) en Piso',
      tipo: 'Guía Rápida',
      contenido: '1. Líquidos IV (SSN 0.9% a 1000cc/hr inicialmente).\n2. Insulina regular en infusión (0.1 U/kg/hr).\n3. Reposición de Potasio según niveles.\n4. Monitoreo estricto de gases arteriales y glicemia cada hora.',
      tips: 'Ojo con el Potasio: la insulina lo mete a la célula. Si el K < 3.3, NO iniciar insulina hasta reponerlo.'
    },
    {
      id: 'int-sx-1',
      especialidad: 'Cirugía General',
      titulo: 'Apendicitis Aguda (Escala de Alvarado)',
      tipo: 'Enfermedad Común',
      contenido: 'Migración del dolor (1), Anorexia (1), Náuseas/Vómitos (1), Dolor en CID (2), Rebote (+) (1), Fiebre (1), Leucocitosis (2), Desviación a la izquierda (1). Total 10 puntos.',
      tips: 'Puntaje > 7 requiere valoración urgente por Cirujano de turno. Dejar NVO y SSN.'
    },
    {
      id: 'int-go-1',
      especialidad: 'Ginecoobstetricia',
      titulo: 'Código Rojo Obstétrico',
      tipo: 'Protocolo',
      contenido: 'Hemorragia postparto masiva. 1. Minuto 0: Activar código. 2. Minuto 1-20 (Reanimación): 2 accesos venosos gruesos, SSN o Lactato Ringer, sonda Foley. Oxitocina 40 UI en 500cc. 3. Minuto 20-60: Transfusión si hay choque severo.',
      tips: 'Asegurar las 4 T: Tono (Atonía), Trauma (Desgarros), Tejido (Restos), Trombina (Coagulopatías).'
    },
    {
      id: 'int-ped-1',
      especialidad: 'Pediatría',
      titulo: 'Crisis Asmática Severa',
      tipo: 'Tratamiento',
      contenido: '1. Oxígeno para saturar > 92%. 2. Salbutamol nebulizado continuo o inhaladores con espaciador (4-10 puffs cada 20 min). 3. Corticoide sistémico (Hidrocortisona o Metilprednisolona).',
      tips: 'Si no mejora o hay inminencia de falla respiratoria: Preparar para intubación y traslado a UCI Pediátrica.'
    }
  ],
  rural: [
    {
      id: 'rur-mi-1',
      especialidad: 'Medicina General (Rural)',
      titulo: 'Hipertensión Arterial - Manejo Inicial',
      tipo: 'Enfermedad Común',
      contenido: 'Diagnóstico con tomas repetidas > 140/90. Iniciar medidas no farmacológicas (dieta DASH, ejercicio). Fármacos primera línea (Losartán 50mg o Amlodipino 5mg).',
      tips: 'En el rural, siempre revisar adherencia antes de subir la dosis. Educar sobre consumo de sal.'
    },
    {
      id: 'rur-ped-1',
      especialidad: 'Pediatría',
      titulo: 'Enfermedad Diarreica Aguda (AIEPI)',
      tipo: 'Guía Rápida',
      contenido: 'Clasificar grado de deshidratación. Plan A: En casa, SRO, Zinc 20mg/día por 14 días. Plan B: SRO en centro de salud por 4 horas. Plan C: Líquidos IV (Lactato Ringer) y remisión inmediata.',
      tips: 'El Zinc es FUNDAMENTAL para prevenir futuros episodios. Enseñar signos de alarma a la madre (llanto sin lágrimas, no bebe líquidos).'
    },
    {
      id: 'rur-sx-1',
      especialidad: 'Urgencias Rurales',
      titulo: 'Manejo de Heridas y Suturas',
      tipo: 'Tips Clínicos',
      contenido: '1. Lavado exhaustivo con SSN. 2. Anestesia local (Lidocaína 1% o 2% SIN epinefrina en dedos/nariz). 3. Sutura según tensión. Cara: Prolene 5-0. Extremidades: Nylon 3-0 o 4-0.',
      tips: 'Si la herida fue por mordedura de perro/humano, NO suturar de entrada. Lavar, iniciar Amoxicilina/Clavulanato y curaciones.'
    },
    {
      id: 'rur-tox-1',
      especialidad: 'Toxicología',
      titulo: 'Accidente Ofídico (Mordedura de Serpiente)',
      tipo: 'Protocolo de Remisión',
      contenido: '1. Calmar al paciente. 2. NO hacer torniquetes ni succionar veneno. 3. Canalizar 2 venas. 4. Administrar Suero Antiofídico (Polivalente) según severidad (leve: 2 a 4 frascos, moderado: 5 a 9, grave: 10 o más).',
      tips: 'Contactar a Toxicología nacional y REMITIR de inmediato a nivel de mayor complejidad con ambulancia.'
    }
  ]
};

export const getEspecialidades = (modo) => {
  const datos = conocimientoMedico[modo] || [];
  const especialidades = new Set(datos.map(d => d.especialidad));
  return Array.from(especialidades);
};
