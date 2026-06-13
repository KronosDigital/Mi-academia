// Malla curricular - Ingeniería Civil EPE
// Extraído del PDF proporcionado
const MALLA = [
  // CICLO 1
  { ciclo: 1, codigo: 'HE59', nombre: 'Estrategias de Redacción', creditos: 5, tipo: 'General' },
  { ciclo: 1, codigo: 'CE82', nombre: 'Matemática Básica', creditos: 6, tipo: 'General' },
  { ciclo: 1, codigo: 'IP34', nombre: 'Dibujo Asistido por el Computador', creditos: 4, tipo: 'Carrera' },
  { ciclo: 1, codigo: 'IP131', nombre: 'Introducción a la Ingeniería Civil', creditos: 3, tipo: 'Carrera' },
  { ciclo: 1, codigo: 'CE83', nombre: 'Química', creditos: 4, tipo: 'Carrera' },

  // CICLO 2
  { ciclo: 2, codigo: 'CE84', nombre: 'Cálculo 1', creditos: 6, tipo: 'General' },
  { ciclo: 2, codigo: 'HE60', nombre: 'Estrategias de Comunicación', creditos: 5, tipo: 'General' },
  { ciclo: 2, codigo: 'HE61', nombre: 'Ética y Ciudadanía', creditos: 5, tipo: 'General' },
  { ciclo: 2, codigo: 'IP91', nombre: 'Topografía', creditos: 3, tipo: 'Carrera' },
  { ciclo: 2, codigo: 'ELEC2', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },

  // CICLO 3
  { ciclo: 3, codigo: 'CE86', nombre: 'Estadística Aplicada 1', creditos: 4, tipo: 'General' },
  { ciclo: 3, codigo: 'CE88', nombre: 'Física 1', creditos: 4, tipo: 'General' },
  { ciclo: 3, codigo: 'CE85', nombre: 'Cálculo 2', creditos: 6, tipo: 'Carrera' },
  { ciclo: 3, codigo: 'IP92', nombre: 'Materiales De Construcción', creditos: 3, tipo: 'Carrera' },
  { ciclo: 3, codigo: 'ELEC3', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },

  // CICLO 4
  { ciclo: 4, codigo: 'CE89', nombre: 'Ecuaciones Diferenciales y Álgebra Lineal', creditos: 6, tipo: 'Carrera' },
  { ciclo: 4, codigo: 'IP94', nombre: 'Estática', creditos: 4, tipo: 'Carrera' },
  { ciclo: 4, codigo: 'CE90', nombre: 'Física 2', creditos: 6, tipo: 'Carrera' },
  { ciclo: 4, codigo: 'IP93', nombre: 'Tecnología del Concreto', creditos: 4, tipo: 'Carrera' },
  { ciclo: 4, codigo: 'ELEC4', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },

  // CICLO 5
  { ciclo: 5, codigo: 'IP96', nombre: 'Construcción I', creditos: 4, tipo: 'Carrera' },
  { ciclo: 5, codigo: 'IP98', nombre: 'Dinámica', creditos: 5, tipo: 'Carrera' },
  { ciclo: 5, codigo: 'IP95', nombre: 'Ingeniería De Carreteras', creditos: 3, tipo: 'Carrera' },
  { ciclo: 5, codigo: 'IP42', nombre: 'Mecánica de Materiales', creditos: 5, tipo: 'Carrera' },
  { ciclo: 5, codigo: 'IP97', nombre: 'Mecánica de Suelos', creditos: 5, tipo: 'Carrera' },

  // CICLO 6
  { ciclo: 6, codigo: 'IP132', nombre: 'Análisis Estructural', creditos: 4, tipo: 'Carrera' },
  { ciclo: 6, codigo: 'IP134', nombre: 'Análisis Numérico para Ingenieros Civiles', creditos: 4, tipo: 'Carrera' },
  { ciclo: 6, codigo: 'IP133', nombre: 'Ingeniería de Cimentaciones', creditos: 5, tipo: 'Carrera' },
  { ciclo: 6, codigo: 'IP115', nombre: 'Mecánica de Fluidos', creditos: 5, tipo: 'Carrera' },
  { ciclo: 6, codigo: 'IP114', nombre: 'Modelación de Edificaciones', creditos: 2, tipo: 'Carrera' },

  // CICLO 7
  { ciclo: 7, codigo: 'IP103', nombre: 'Comportamiento y Diseño en Concreto', creditos: 5, tipo: 'Carrera' },
  { ciclo: 7, codigo: 'IP105', nombre: 'Construcción II', creditos: 4, tipo: 'Carrera' },
  { ciclo: 7, codigo: 'IP49', nombre: 'Costos y Presupuestos', creditos: 3, tipo: 'Carrera' },
  { ciclo: 7, codigo: 'IP116', nombre: 'Hidráulica de Canales', creditos: 4, tipo: 'Carrera' },
  { ciclo: 7, codigo: 'ELEC7', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },

  // CICLO 8
  { ciclo: 8, codigo: 'IP104', nombre: 'Ingeniería de Tránsito', creditos: 3, tipo: 'Carrera' },
  { ciclo: 8, codigo: 'IP108', nombre: 'Planificación y Control de Obras', creditos: 3, tipo: 'Carrera' },
  { ciclo: 8, codigo: 'IP117', nombre: 'Seminario de Investigación Aplicada', creditos: 3, tipo: 'Carrera' },
  { ciclo: 8, codigo: 'IP106', nombre: 'Taller de Tesis', creditos: 3, tipo: 'Carrera' },
  { ciclo: 8, codigo: 'ELEC8', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },

  // CICLO 9
  { ciclo: 9, codigo: 'IP148', nombre: 'Gerencia de Proyectos de Construcción', creditos: 4, tipo: 'Carrera' },
  { ciclo: 9, codigo: 'IP119', nombre: 'Ingeniería Sismo-Resistente', creditos: 5, tipo: 'Carrera' },
  { ciclo: 9, codigo: 'IP111', nombre: 'Productividad en Obras', creditos: 3, tipo: 'Carrera' },
  { ciclo: 9, codigo: 'IP112', nombre: 'Proyecto de Tesis I', creditos: 5, tipo: 'Carrera' },
  { ciclo: 9, codigo: 'ELEC9', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },

  // CICLO 10
  { ciclo: 10, codigo: 'IP113', nombre: 'Curso de Trabajo de Investigación - Proyecto de Tesis II', creditos: 5, tipo: 'Carrera' },
  { ciclo: 10, codigo: 'ELEC10A', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },
  { ciclo: 10, codigo: 'ELEC10B', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },
  { ciclo: 10, codigo: 'ELEC10C', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },
  { ciclo: 10, codigo: 'ELEC10D', nombre: 'Electivo', creditos: 3, tipo: 'Electivo' },
];

// Asignar un ID único a cada curso
MALLA.forEach((c, i) => { c.id = `c${i + 1}`; });

const TOTAL_CREDITOS = MALLA.reduce((sum, c) => sum + c.creditos, 0); // 200
const TOTAL_CREDITOS_OBLIGATORIOS = MALLA.filter(c => c.tipo !== 'Electivo').reduce((s, c) => s + c.creditos, 0); // 170
const TOTAL_CREDITOS_ELECTIVOS = MALLA.filter(c => c.tipo === 'Electivo').reduce((s, c) => s + c.creditos, 0); // 30
const TOTAL_ASIGNATURAS = MALLA.length; // 50
