const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const GUION_PATH = path.resolve(__dirname, "../src/data/guion.json");
const OUT_DIR = path.resolve(__dirname, "../out");
const { DESTINO_DIR } = require("./exportar_metadata");

const VIDEOS = [
  // =========================================================================
  // VIDEO 1: LA MIEL INMORTAL Y LAS TUMBAS EGIPCIAS
  // =========================================================================
  {
    meta: {
      id: "miel_inmortal_arqueologia",
      slug: "miel_inmortal_arqueologia",
      temaResumen: "¿Por qué la miel es el único alimento que nunca caduca en miles de años?"
    },
    escenas: [
      {
        id: 1,
        texto: "¿Sabías que los arqueólogos han encontrado vasijas de miel en tumbas del antiguo Egipto con más de tres mil años y aún era comestible?",
        icono: "Bug",
        colorIcono: "#F59E0B",
        tituloVisual: "MIEL INMORTAL",
        composicionVisual: "plano_general",
        escenario: "tumba_egipcia",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        sfx: "sfx/sfx_whoosh.wav",
        volumenSfx: 0.2,
        palabrasClave: ["vasijas de miel", "antiguo Egipto", "tres mil años"],
        personajes: [
          {
            id: "arqueologo",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "honey_pot",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            acciones: [{ tipo: "caminar_hacia", desdeX: -260, haciaX: -120 }],
            habla: true
          }
        ]
      },
      {
        id: 2,
        texto: "Cualquier otro alimento orgánico se pudre, se llena de hongos o fermenta en cuestión de días si lo dejas al aire libre.",
        icono: "AlertTriangle",
        colorIcono: "#EF4444",
        tituloVisual: "CADUCIDAD TOTAL",
        composicionVisual: "primer_plano",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["shake", "punch"],
        sfx: "sfx/sfx_dramatic_hit.wav",
        volumenSfx: 0.25,
        elementosNarrativos: [{ tipo: "danger_vignette" }],
        palabrasClave: ["alimento orgánico", "se pudre", "hongos"],
        personajes: [
          {
            id: "victima",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            poseId: "backing_away_scared",
            expresion: "shocked",
            acciones: [{ tipo: "sorpresa_y_retroceso" }],
            habla: true
          }
        ]
      },
      {
        id: 3,
        texto: "El primer gran secreto de la miel es su bajísimo contenido de agua: apenas un diecisiete por ciento de humedad en su estado natural.",
        icono: "Droplet",
        colorIcono: "#38BDF8",
        tituloVisual: "CERO HUMEDAD",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["bajísimo contenido", "diecisiete por ciento", "humedad"],
        personajes: [
          {
            id: "quimico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "honey_pot",
            poseId: "presenting_object",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 4,
        texto: "A nivel microscópico, esta concentración masiva de azúcares genera una presión osmótica implacable que absorbe el agua de cualquier bacteria.",
        icono: "Activity",
        colorIcono: "#EC4899",
        tituloVisual: "ÓSMOSIS BRUTAL",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["presión osmótica", "absorbe el agua", "cualquier bacteria"],
        personajes: [
          {
            id: "quimico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_both_hands",
            expresion: "eureka",
            habla: true
          }
        ],
        objetos: [
          {
            id: "celula_deshidratada",
            propId: "shrinking_cell",
            posicion: { x: 220, y: -50 },
            escala: 1.6,
            animacion: { tipo: "pulso" }
          }
        ]
      },
      {
        id: 5,
        texto: "Cuando una bacteria o espora aterriza en la miel, el líquido le extrae toda el agua interna en segundos, secándola y matándola al instante.",
        icono: "Skull",
        colorIcono: "#EF4444",
        tituloVisual: "MUERTE BACTERIANA",
        composicionVisual: "cifras_concepto",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["punch", "drift"],
        palabrasClave: ["extrae toda el agua", "secándola", "matándola al instante"],
        personajes: [
          {
            id: "quimico",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "pointing_right",
            expresion: "analytical",
            habla: true
          }
        ],
        objetos: [
          {
            id: "bacteria_muerta",
            propId: "shrinking_cell",
            posicion: { x: 220, y: -40 },
            escala: 1.7,
            animacion: { tipo: "vibrar" }
          }
        ]
      },
      {
        id: 6,
        texto: "Además, la miel posee una acidez natural sorprendente, con un pH entre tres y cuatro, un nivel tan ácido como el vinagre o el limón.",
        icono: "FlaskConical",
        colorIcono: "#10B981",
        tituloVisual: "ÁCIDO NATURAL",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["drift"],
        palabrasClave: ["acidez natural", "pH entre tres y cuatro", "vinagre"],
        personajes: [
          {
            id: "quimico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "flask",
            poseId: "investigating_magnifier",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 7,
        texto: "Pero el arma definitiva la añaden las abejas en su estómago: una poderosa enzima llamada glucosa oxidasa que transforma el néctar.",
        icono: "Sparkles",
        colorIcono: "#F59E0B",
        tituloVisual: "ENZIMA SECRETA",
        composicionVisual: "primer_plano",
        escenario: "tumba_egipcia",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["arma definitiva", "glucosa oxidasa", "estómago abejas"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            poseId: "explaining_pointing_up",
            expresion: "eureka",
            habla: true
          }
        ]
      },
      {
        id: 8,
        texto: "Esta enzima descompone la glucosa produciendo microdosis constantes de peróxido de hidrógeno, el mismo compuesto del agua oxigenada.",
        icono: "Atom",
        colorIcono: "#6366F1",
        tituloVisual: "AGUA OXIGENADA",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["drift"],
        palabrasClave: ["peróxido de hidrógeno", "microdosis constantes", "agua oxigenada"],
        personajes: [
          {
            id: "cientifico",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "atom",
            poseId: "presenting_object",
            expresion: "talking_enthusiastic",
            habla: true
          }
        ]
      },
      {
        id: 9,
        texto: "Es un escudo químico antibacteriano perpetuo: un medio sin agua, ácido y cargado de desinfectante natural que no da tregua.",
        icono: "ShieldCheck",
        colorIcono: "#10B981",
        tituloVisual: "ESCUDO PERPETUO",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["escudo químico", "desinfectante natural", "sin agua"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "shield",
            poseId: "standing_confident",
            expresion: "proud",
            habla: true
          }
        ]
      },
      {
        id: 10,
        texto: "La única forma de arruinar la miel es dejarla abierta en un ambiente húmedo, ya que absorbe agua del aire y podría fermentar.",
        icono: "AlertCircle",
        colorIcono: "#F59E0B",
        tituloVisual: "CUIDADO HUMEDAD",
        composicionVisual: "plano_general",
        escenario: "tumba_egipcia",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["ambiente húmedo", "absorbe agua", "podría fermentar"],
        personajes: [
          {
            id: "arqueologo",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "honey_pot",
            poseId: "explaining_both_hands",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 11,
        texto: "Mientras permanezca sellada, la miel desafía las leyes del tiempo y se convierte en el tesoro eterno de la naturaleza.",
        icono: "Trophy",
        colorIcono: "#FACC15",
        tituloVisual: "ORO ETERNO",
        composicionVisual: "plano_general",
        escenario: "tumba_egipcia",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["desafía el tiempo", "tesoro eterno", "naturaleza"],
        personajes: [
          {
            id: "arqueologo",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            prop: "trophy",
            poseId: "celebrating_arms_up",
            expresion: "eureka",
            habla: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // VIDEO 2: RESPIRAR EN MARTE SIN CASCO
  // =========================================================================
  {
    meta: {
      id: "marte_sin_escafandra",
      slug: "marte_sin_escafandra",
      temaResumen: "¿Qué le pasaría a tu cuerpo si intentaras respirar en la atmósfera de Marte sin traje espacial?"
    },
    escenas: [
      {
        id: 1,
        texto: "¿Alguna vez te has preguntado qué le ocurriría exactamente a tu cuerpo si te quitaras el casco en la superficie de Marte por solo diez segundos?",
        icono: "Rocket",
        colorIcono: "#EA580C",
        tituloVisual: "MARTE SIN TRAJE",
        composicionVisual: "plano_general",
        escenario: "superficie_marte",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        sfx: "sfx/sfx_whoosh.wav",
        volumenSfx: 0.2,
        palabrasClave: ["quitaras el casco", "superficie de Marte", "diez segundos"],
        personajes: [
          {
            id: "astronauta",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "mars_helmet",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            acciones: [{ tipo: "caminar_hacia", desdeX: -260, haciaX: -120 }],
            habla: true
          }
        ]
      },
      {
        id: 2,
        texto: "Las películas de ciencia ficción nos enseñan que explotarías como un globo, pero la realidad de la física espacial es mucho más perturbadora.",
        icono: "AlertTriangle",
        colorIcono: "#EF4444",
        tituloVisual: "MITO DE HOLLYWOOD",
        composicionVisual: "primer_plano",
        escenario: "superficie_marte",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["shake", "punch"],
        sfx: "sfx/sfx_dramatic_hit.wav",
        volumenSfx: 0.25,
        elementosNarrativos: [{ tipo: "danger_vignette" }],
        palabrasClave: ["explotarías como un globo", "física espacial", "perturbadora"],
        personajes: [
          {
            id: "victima",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            poseId: "backing_away_scared",
            expresion: "shocked",
            acciones: [{ tipo: "sorpresa_y_retroceso" }],
            habla: true
          }
        ]
      },
      {
        id: 3,
        texto: "La presión atmosférica en Marte es de solo seis milibares, menos del uno por ciento de la presión a nivel del mar en la Tierra.",
        icono: "Gauge",
        colorIcono: "#38BDF8",
        tituloVisual: "PRESIÓN MÍNIMA",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["seis milibares", "menos del uno por ciento", "presión mínima"],
        personajes: [
          {
            id: "astrofisico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_both_hands",
            expresion: "analytical",
            habla: true
          }
        ],
        objetos: [
          {
            id: "manometro_marte",
            propId: "pressure_gauge_bursting",
            posicion: { x: 220, y: -50 },
            escala: 1.5,
            animacion: { tipo: "pulso" }
          }
        ]
      },
      {
        id: 4,
        texto: "A esta presión tan ridículamente baja se cruza el Límite de Armstrong, donde el punto de ebullición del agua cae por debajo de la temperatura corporal.",
        icono: "Thermometer",
        colorIcono: "#F59E0B",
        tituloVisual: "LÍMITE ARMSTRONG",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["Límite de Armstrong", "punto de ebullición", "temperatura corporal"],
        personajes: [
          {
            id: "astrofisico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "mars_helmet",
            poseId: "presenting_object",
            expresion: "eureka",
            habla: true
          }
        ]
      },
      {
        id: 5,
        texto: "Esto significa que la saliva en tu lengua, las lágrimas en tus ojos y los fluidos de tus pulmones comenzarían a hervir a temperatura ambiente.",
        icono: "Flame",
        colorIcono: "#DC2626",
        tituloVisual: "SALIVA HIRVIENDO",
        composicionVisual: "cifras_concepto",
        escenario: "superficie_marte",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["punch", "drift"],
        palabrasClave: ["saliva en tu lengua", "lágrimas", "hervir a temperatura ambiente"],
        personajes: [
          {
            id: "astronauta",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "mars_helmet",
            poseId: "backing_away_scared",
            expresion: "shocked",
            habla: true
          }
        ]
      },
      {
        id: 6,
        texto: "Si intentas contener la respiración, el aire atrapado en tus pulmones se expandirá con violencia destrozando los alvéolos en un segundo.",
        icono: "Activity",
        colorIcono: "#EC4899",
        tituloVisual: "COLAPSO PULMONAR",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["drift"],
        palabrasClave: ["contener la respiración", "expandirá con violencia", "alvéolos"],
        personajes: [
          {
            id: "medico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_pointing_up",
            expresion: "analytical",
            habla: true
          }
        ],
        objetos: [
          {
            id: "pulmones_marte",
            propId: "lungs_compressing",
            posicion: { x: 220, y: -60 },
            escala: 1.6,
            animacion: { tipo: "pulso" }
          }
        ]
      },
      {
        id: 7,
        texto: "Tu sangre no hervirá de inmediato gracias a la presión elástica de tus venas, pero el oxígeno escapará de tus glóbulos rojos al revés.",
        icono: "Activity",
        colorIcono: "#EF4444",
        tituloVisual: "OXÍGENO INVERTIDO",
        composicionVisual: "primer_plano",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["sangre no hervirá", "presión elástica", "oxígeno al revés"],
        personajes: [
          {
            id: "medico",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            poseId: "explaining_both_hands",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 8,
        texto: "En apenas diez a quince segundos tu cerebro se apagará por hipoxia total, cayendo inconsciente sobre el polvo rojo marciano.",
        icono: "Brain",
        colorIcono: "#8B5CF6",
        tituloVisual: "HIPOXIA TOTAL",
        composicionVisual: "plano_general",
        escenario: "superficie_marte",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["drift"],
        palabrasClave: ["quince segundos", "cerebro se apagará", "hipoxia total"],
        personajes: [
          {
            id: "astronauta",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "exhausted_slouch",
            expresion: "exhausted",
            habla: true
          }
        ]
      },
      {
        id: 9,
        texto: "Al mismo tiempo, la temperatura media de sesenta grados bajo cero congelaría tu piel expuesta rápidamente sin viento que te caliente.",
        icono: "Snowflake",
        colorIcono: "#06B6D4",
        tituloVisual: "FRÍO POLAR",
        composicionVisual: "plano_general",
        escenario: "superficie_marte",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["sesenta grados bajo cero", "congelaría tu piel", "frío extremo"],
        personajes: [
          {
            id: "astronauta",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "mars_helmet",
            poseId: "trembling_fear",
            expresion: "scared",
            habla: true
          }
        ]
      },
      {
        id: 10,
        texto: "Incluso si pudieras comprimir el aire marciano, es noventa y cinco por ciento dióxido de carbono puro con cero oxígeno respirable.",
        icono: "Skull",
        colorIcono: "#64748B",
        tituloVisual: "GAS VENENOSO",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["noventa y cinco por ciento", "dióxido de carbono", "cero oxígeno"],
        personajes: [
          {
            id: "astrofisico",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "skull",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            habla: true
          }
        ]
      },
      {
        id: 11,
        texto: "Marte es un desierto fascinante pero despiadado: sin tu traje presurizado, la física cósmica no te da ni una sola segunda oportunidad.",
        icono: "Compass",
        colorIcono: "#EA580C",
        tituloVisual: "FRONTERA CÓSMICA",
        composicionVisual: "plano_general",
        escenario: "superficie_marte",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["desierto despiadado", "traje presurizado", "física cósmica"],
        personajes: [
          {
            id: "astronauta",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            prop: "trophy",
            poseId: "standing_confident",
            expresion: "proud",
            habla: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // VIDEO 3: POR QUÉ EL HIELO FLOTA
  // =========================================================================
  {
    meta: {
      id: "hielo_flotante_anomalia",
      slug: "hielo_flotante_anomalia",
      temaResumen: "¿Por qué el hielo flota en el agua y cómo esta anomalía salvó la vida en la Tierra?"
    },
    escenas: [
      {
        id: 1,
        texto: "¿Te has puesto a pensar en lo absurdo que es que el hielo flote en tu vaso cuando casi todos los sólidos del universo se hunden?",
        icono: "Snowflake",
        colorIcono: "#0284C7",
        tituloVisual: "HIELO FLOTANTE",
        composicionVisual: "plano_general",
        escenario: "lago_helado",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        sfx: "sfx/sfx_whoosh.wav",
        volumenSfx: 0.2,
        palabrasClave: ["el hielo flote", "sólidos del universo", "se hunden"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "ice_crystal_hex",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            acciones: [{ tipo: "caminar_hacia", desdeX: -260, haciaX: -120 }],
            habla: true
          }
        ]
      },
      {
        id: 2,
        texto: "En la física común, cuando una sustancia se enfría y se vuelve sólida, sus átomos se aprietan, aumenta su densidad y se va al fondo.",
        icono: "Scale",
        colorIcono: "#8B5CF6",
        tituloVisual: "REGLA UNIVERSAL",
        composicionVisual: "primer_plano",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["shake", "punch"],
        sfx: "sfx/sfx_dramatic_hit.wav",
        volumenSfx: 0.25,
        palabrasClave: ["física común", "aumenta su densidad", "se va al fondo"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            prop: "scale",
            poseId: "comparing_two_objects",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 3,
        texto: "Pero el agua es una de las moléculas más rebeldes y fascinantes del cosmos gracias a una propiedad llamada anomalía térmica.",
        icono: "Atom",
        colorIcono: "#38BDF8",
        tituloVisual: "MOLÉCULA REBELDE",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["moléculas más rebeldes", "anomalía térmica", "cosmos"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "atom",
            poseId: "presenting_object",
            expresion: "eureka",
            habla: true
          }
        ]
      },
      {
        id: 4,
        texto: "Cuando el agua líquida se enfría, se vuelve más pesada hasta alcanzar su máxima densidad exactamente a cuatro grados centígrados.",
        icono: "Thermometer",
        colorIcono: "#10B981",
        tituloVisual: "4 GRADOS LÍMITE",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["máxima densidad", "cuatro grados", "se enfría"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_both_hands",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 5,
        texto: "Pero al enfriarse por debajo de cuatro grados hasta congelarse, ocurre algo asombroso: en lugar de contraerse, ¡el agua se expande!",
        icono: "Zap",
        colorIcono: "#FACC15",
        tituloVisual: "¡SE EXPANDE!",
        composicionVisual: "cifras_concepto",
        escenario: "lago_helado",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["punch", "drift"],
        palabrasClave: ["algo asombroso", "en lugar de contraerse", "el agua se expande"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "ice_crystal_hex",
            poseId: "surprised_hands_up",
            expresion: "surprised",
            habla: true
          }
        ]
      },
      {
        id: 6,
        texto: "Las moléculas de agua forman enlaces de hidrógeno que se organizan en una hermosa red hexagonal con grandes huecos vacíos.",
        icono: "Grid",
        colorIcono: "#67E8F9",
        tituloVisual: "RED HEXAGONAL",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["drift"],
        palabrasClave: ["enlaces de hidrógeno", "red hexagonal", "huecos vacíos"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            habla: true
          }
        ],
        objetos: [
          {
            id: "cristal_hexagonal",
            propId: "ice_crystal_hex",
            posicion: { x: 220, y: -60 },
            escala: 1.6,
            animacion: { tipo: "pulso" }
          }
        ]
      },
      {
        id: 7,
        texto: "Esa estructura cristalina hexagonal ocupa un nueve por ciento más de espacio que el agua líquida, haciéndola significativamente más ligera.",
        icono: "Feather",
        colorIcono: "#38BDF8",
        tituloVisual: "MÁS LIGERO",
        composicionVisual: "primer_plano",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["nueve por ciento más", "más espacio", "más ligera"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            poseId: "explaining_both_hands",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 8,
        texto: "Si el hielo se comportara como los demás sólidos, se hundiría hasta el fondo de los ríos, lagos y océanos con cada invierno.",
        icono: "AlertTriangle",
        colorIcono: "#EF4444",
        tituloVisual: "COLAPSO MARINO",
        composicionVisual: "plano_general",
        escenario: "lago_helado",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["drift"],
        palabrasClave: ["se hundiría al fondo", "ríos y lagos", "cada invierno"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "skull",
            poseId: "backing_away_scared",
            expresion: "worried",
            habla: true
          }
        ]
      },
      {
        id: 9,
        texto: "Año tras año, los mares se congelarían desde el fondo hacia arriba hasta convertirse en bloques gigantescos de hielo perpetuo sin vida.",
        icono: "Globe",
        colorIcono: "#0369A1",
        tituloVisual: "PLANETA CONGELADO",
        composicionVisual: "plano_general",
        escenario: "lago_helado",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["desde el fondo", "hielo perpetuo", "sin vida"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "sad_slumped",
            expresion: "sad",
            habla: true
          }
        ]
      },
      {
        id: 10,
        texto: "En cambio, al flotar en la superficie, el hielo actúa como una manta térmica aislante que protege el agua líquida inferior.",
        icono: "ShieldCheck",
        colorIcono: "#10B981",
        tituloVisual: "MANTA TÉRMICA",
        composicionVisual: "plano_general",
        escenario: "lago_helado",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["manta térmica", "aislante", "protege agua líquida"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "shield",
            poseId: "standing_confident",
            expresion: "proud",
            habla: true
          }
        ]
      },
      {
        id: 11,
        texto: "Gracias a esta pequeña rareza molecular del agua, los peces sobreviven el invierno y la vida en la Tierra pudo florecer.",
        icono: "Sparkles",
        colorIcono: "#38BDF8",
        tituloVisual: "VIDA SALVADA",
        composicionVisual: "plano_general",
        escenario: "lago_helado",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["rareza molecular", "peces sobreviven", "vida pudo florecer"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            prop: "trophy",
            poseId: "celebrating_arms_up",
            expresion: "eureka",
            habla: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // VIDEO 4: LA PICADURA MÁS DOLOROSA (HORMIGA BALA)
  // =========================================================================
  {
    meta: {
      id: "dolor_extremo_schmidt",
      slug: "dolor_extremo_schmidt",
      temaResumen: "¿Por qué la picadura de la hormiga bala produce el dolor más desgarrador de la naturaleza?"
    },
    escenas: [
      {
        id: 1,
        texto: "¿Sabías que existe un insecto en la selva cuya picadura duele tanto que las víctimas sienten como si les hubieran disparado con un arma?",
        icono: "Bug",
        colorIcono: "#EF4444",
        tituloVisual: "PICADURA MORTAL",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        sfx: "sfx/sfx_whoosh.wav",
        volumenSfx: 0.2,
        palabrasClave: ["picadura duele tanto", "disparado con un arma", "selva"],
        personajes: [
          {
            id: "explorador",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "bullet_ant",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            acciones: [{ tipo: "caminar_hacia", desdeX: -260, haciaX: -120 }],
            habla: true
          }
        ]
      },
      {
        id: 2,
        texto: "Se trata de la temible hormiga bala del Amazonas, el insecto con la mordedura y picadura más dolorosa de todo el reino animal.",
        icono: "Flame",
        colorIcono: "#DC2626",
        tituloVisual: "HORMIGA BALA",
        composicionVisual: "primer_plano",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["shake", "punch"],
        sfx: "sfx/sfx_dramatic_hit.wav",
        volumenSfx: 0.25,
        elementosNarrativos: [{ tipo: "danger_vignette" }],
        palabrasClave: ["hormiga bala", "más dolorosa", "Amazonas"],
        personajes: [
          {
            id: "victima",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            poseId: "backing_away_scared",
            expresion: "shocked",
            acciones: [{ tipo: "sorpresa_y_retroceso" }],
            habla: true
          }
        ]
      },
      {
        id: 3,
        texto: "El entomólogo Justin Schmidt fue picado por más de ochenta especies para crear el índice oficial del dolor por picaduras de insectos.",
        icono: "Activity",
        colorIcono: "#F59E0B",
        tituloVisual: "ÍNDICE SCHMIDT",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["Justin Schmidt", "ochenta especies", "índice del dolor"],
        personajes: [
          {
            id: "entomologo",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "magnifier",
            poseId: "investigating_magnifier",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 4,
        texto: "La escala va del nivel uno como una abeja común, hasta el nivel cuatro plus, reservado exclusivamente para la hormiga bala.",
        icono: "Gauge",
        colorIcono: "#EF4444",
        tituloVisual: "NIVEL 4 MÁXIMO",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["nivel uno", "cuatro plus", "reservado exclusivamente"],
        personajes: [
          {
            id: "entomologo",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_both_hands",
            expresion: "eureka",
            habla: true
          }
        ]
      },
      {
        id: 5,
        texto: "Schmidt describió su dolor como caminar descalzo sobre carbones ardientes con un clavo oxidado de siete centímetros clavado en el talón.",
        icono: "AlertTriangle",
        colorIcono: "#F97316",
        tituloVisual: "DOLOR AGÓNICO",
        composicionVisual: "cifras_concepto",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["punch", "drift"],
        palabrasClave: ["carbones ardientes", "clavo oxidado", "siete centímetros"],
        personajes: [
          {
            id: "victima",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "trembling_fear",
            expresion: "shocked",
            habla: true
          }
        ]
      },
      {
        id: 6,
        texto: "El responsable de esta agonía no es el veneno convencional, sino una pequeña cadena de péptidos llamada poneratoxina.",
        icono: "Atom",
        colorIcono: "#8B5CF6",
        tituloVisual: "PONERATOXINA",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["drift"],
        palabrasClave: ["cadena de péptidos", "poneratoxina", "agonía"],
        personajes: [
          {
            id: "quimico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "atom",
            poseId: "presenting_object",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 7,
        texto: "La poneratoxina ataca directamente los canales de sodio de las neuronas sensoriales, bloqueándolos en posición permanentemente abierta.",
        icono: "Zap",
        colorIcono: "#FACC15",
        tituloVisual: "CANALES DE SODIO",
        composicionVisual: "primer_plano",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["canales de sodio", "neuronas sensoriales", "permanentemente abierta"],
        personajes: [
          {
            id: "quimico",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            habla: true
          }
        ]
      },
      {
        id: 8,
        texto: "Tus nervios envían señales de dolor catastrófico al cerebro de forma continua y a máxima potencia sin poder apagarse.",
        icono: "Brain",
        colorIcono: "#EC4899",
        tituloVisual: "SOBRECARGA NERVIOSA",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["drift"],
        palabrasClave: ["dolor catastrófico", "forma continua", "sin poder apagarse"],
        personajes: [
          {
            id: "quimico",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "brain",
            poseId: "backing_away_scared",
            expresion: "shocked",
            habla: true
          }
        ]
      },
      {
        id: 9,
        texto: "A diferencia de una avispa cuyo dolor pasa en minutos, la poneratoxina resiste en el cuerpo provocando oleadas de dolor por veinticuatro horas.",
        icono: "Clock",
        colorIcono: "#38BDF8",
        tituloVisual: "24 HORAS DE AGONÍA",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["poneratoxina resiste", "oleadas de dolor", "veinticuatro horas"],
        personajes: [
          {
            id: "explorador",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "clock",
            poseId: "worried_clock",
            expresion: "worried",
            habla: true
          }
        ]
      },
      {
        id: 10,
        texto: "Las víctimas sufren temblores incontrolables, sudor frío, taquicardia y parálisis temporal del miembro afectado.",
        icono: "ShieldAlert",
        colorIcono: "#EF4444",
        tituloVisual: "ESPASMOS TOTALES",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["temblores incontrolables", "sudor frío", "parálisis temporal"],
        personajes: [
          {
            id: "victima",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "trembling_fear",
            expresion: "scared",
            habla: true
          }
        ]
      },
      {
        id: 11,
        texto: "La hormiga bala no busca matarte, sino recordarte que en la selva, la química defensiva puede ser más aterradora que cualquier depredador.",
        icono: "ShieldCheck",
        colorIcono: "#10B981",
        tituloVisual: "QUÍMICA SALVAJE",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["química defensiva", "más aterradora", "depredador"],
        personajes: [
          {
            id: "explorador",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            prop: "trophy",
            poseId: "standing_confident",
            expresion: "proud",
            habla: true
          }
        ]
      }
    ]
  },

  // =========================================================================
  // VIDEO 5: EL SECRETO DEL COLOR DE LOS CAMALEONES
  // =========================================================================
  {
    meta: {
      id: "camaleon_cristales_color",
      slug: "camaleon_cristales_color",
      temaResumen: "¿Por qué los camaleones no cambian de color para camuflarse sino con cristales nanoscópicos?"
    },
    escenas: [
      {
        id: 1,
        texto: "¿Alguna vez te dijeron que los camaleones cambian de color para esconderse con el fondo? ¡Pues resulta que toda tu vida te mintieron!",
        icono: "Palette",
        colorIcono: "#10B981",
        tituloVisual: "GRAN ENGAÑO",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        sfx: "sfx/sfx_whoosh.wav",
        volumenSfx: 0.2,
        palabrasClave: ["cambian de color", "esconderse con el fondo", "te mintieron"],
        personajes: [
          {
            id: "biologo",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "chameleon_hero",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            acciones: [{ tipo: "caminar_hacia", desdeX: -260, haciaX: -120 }],
            habla: true
          }
        ]
      },
      {
        id: 2,
        texto: "Durante décadas creímos que si ponías un camaleón sobre un mantel a cuadros, intentaría copiar los colores para hacerse invisible.",
        icono: "Eye",
        colorIcono: "#38BDF8",
        tituloVisual: "MITO POPULAR",
        composicionVisual: "primer_plano",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["shake", "punch"],
        sfx: "sfx/sfx_dramatic_hit.wav",
        volumenSfx: 0.25,
        palabrasClave: ["mantel a cuadros", "copiar los colores", "hacerse invisible"],
        personajes: [
          {
            id: "narrador",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            poseId: "explaining_both_hands",
            expresion: "confused",
            habla: true
          }
        ]
      },
      {
        id: 3,
        texto: "En realidad, los camaleones cambian de color principalmente para comunicarse: expresar agresividad ante rivales, cortejar parejas o regular su temperatura.",
        icono: "Heart",
        colorIcono: "#EC4899",
        tituloVisual: "LENGUAJE EMOCIONAL",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["para comunicarse", "expresar agresividad", "cortejar parejas"],
        personajes: [
          {
            id: "biologo",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "chameleon_hero",
            poseId: "presenting_object",
            expresion: "eureka",
            habla: true
          }
        ]
      },
      {
        id: 4,
        texto: "Pero lo verdaderamente alucinante es cómo lo hacen: no utilizan tintas ni pigmentos químicos para cambiar a tonos brillantes como el azul o amarillo.",
        icono: "Sparkles",
        colorIcono: "#F59E0B",
        tituloVisual: "CERO PIGMENTOS",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["no utilizan tintas", "pigmentos químicos", "tonos brillantes"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_pointing_up",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 5,
        texto: "Bajo su piel transparente poseen dos capas densas de células especializadas llamadas iridóforos, cargadas de nanocristales de guanina.",
        icono: "Grid",
        colorIcono: "#8B5CF6",
        tituloVisual: "CÉLULAS IRIDÓFORAS",
        composicionVisual: "cifras_concepto",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["punch", "drift"],
        palabrasClave: ["iridóforos", "nanocristales de guanina", "piel transparente"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "atom",
            poseId: "presenting_object",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 6,
        texto: "Estos diminutos cristales microscópicos están ordenados en una red geométrica perfecta, funcionando como espejos fotónicos cuánticos.",
        icono: "Atom",
        colorIcono: "#06B6D4",
        tituloVisual: "ESPEJOS FOTÓNICOS",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_right",
        efectosCamara: ["drift"],
        palabrasClave: ["red geométrica perfecta", "espejos fotónicos", "cuánticos"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_both_hands",
            expresion: "eureka",
            habla: true
          }
        ]
      },
      {
        id: 7,
        texto: "Cuando el camaleón está en calma, los nanocristales están muy juntos y reflejan longitudes de onda cortas como el azul, que al mezclarse con piel amarilla se ve verde.",
        icono: "Sun",
        colorIcono: "#10B981",
        tituloVisual: "CALMA VERDE",
        composicionVisual: "primer_plano",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["está en calma", "reflejan azul", "se ve verde"],
        personajes: [
          {
            id: "biologo",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            prop: "chameleon_hero",
            poseId: "standing_relaxed",
            expresion: "smile_soft",
            habla: true
          }
        ]
      },
      {
        id: 8,
        texto: "Pero cuando se enoja o divisa a una hembra, el camaleón tensa su piel, separando los cristales para reflejar longitudes de onda largas como el amarillo y rojo.",
        icono: "Flame",
        colorIcono: "#EF4444",
        tituloVisual: "FURIA ROJA",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "corte",
        efectosCamara: ["drift"],
        palabrasClave: ["tensa su piel", "separando los cristales", "amarillo y rojo"],
        personajes: [
          {
            id: "biologo",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "chameleon_hero",
            poseId: "angry_fists",
            expresion: "angry",
            habla: true
          }
        ]
      },
      {
        id: 9,
        texto: "Es física óptica pura en tiempo real: modifican el espacio nanométrico entre partículas vivas para manipular cómo rebota la luz visible.",
        icono: "Zap",
        colorIcono: "#FACC15",
        tituloVisual: "FÍSICA ÓPTICA",
        composicionVisual: "plano_general",
        escenario: "laboratorio",
        layout: "narrativo",
        transicion: "whip_left",
        efectosCamara: ["drift"],
        palabrasClave: ["física óptica pura", "espacio nanométrico", "luz visible"],
        personajes: [
          {
            id: "fisico",
            posicion: { x: -160, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            poseId: "explaining_pointing_up",
            expresion: "talking_enthusiastic",
            habla: true
          }
        ]
      },
      {
        id: 10,
        texto: "Los tonos oscuros absorben más calor en mañanas frías, mientras que los tonos claros y pálidos reflejan el sol abrasador del mediodía.",
        icono: "Thermometer",
        colorIcono: "#38BDF8",
        tituloVisual: "TERMORREGULACIÓN",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["absorben más calor", "tonos claros reflejan", "termorregulación"],
        personajes: [
          {
            id: "biologo",
            posicion: { x: -150, y: 70 },
            escala: 1.05,
            orientacion: "derecha",
            prop: "chameleon_hero",
            poseId: "explaining_both_hands",
            expresion: "analytical",
            habla: true
          }
        ]
      },
      {
        id: 11,
        texto: "El camaleón no busca ocultarse del mundo: lleva en su piel la pantalla de nanotecnología viva más avanzada del reino animal.",
        icono: "Sparkles",
        colorIcono: "#6366F1",
        tituloVisual: "PANTALLA VIVA",
        composicionVisual: "plano_general",
        escenario: "selva_tropical",
        layout: "narrativo",
        transicion: "zoom_in",
        efectosCamara: ["drift"],
        palabrasClave: ["no busca ocultarse", "nanotecnología viva", "más avanzada"],
        personajes: [
          {
            id: "biologo",
            posicion: { x: 0, y: 50 },
            escala: 1.15,
            orientacion: "derecha",
            prop: "trophy",
            poseId: "celebrating_arms_up",
            expresion: "eureka",
            habla: true
          }
        ]
      }
    ]
  }
];

async function main() {
  console.log(`\n======================================================`);
  console.log(`🚀 INICIANDO GENERACIÓN BATCH DE 5 SHORTS COMPLETOS`);
  console.log(`======================================================\n`);

  for (let i = 0; i < VIDEOS.length; i++) {
    const videoData = VIDEOS[i];
    const { id, slug, temaResumen } = videoData.meta;
    console.log(`\n------------------------------------------------------`);
    console.log(`🎬 [${i + 1}/5] PROCESANDO: "${temaResumen}" (${slug})`);
    console.log(`------------------------------------------------------\n`);

    // 1. Escribir guion activo en src/data/guion.json
    fs.writeFileSync(GUION_PATH, JSON.stringify(videoData, null, 2), "utf8");
    console.log(`[GUION] 📝 Escrito en ${GUION_PATH}`);

    // 2. Generar voz y alinear con python scripts/generar_voz.py
    console.log(`[TTS] 🎙️  Ejecutando python scripts/generar_voz.py...`);
    const pythonCmd = process.platform === "win32" ? "python" : "python3";
    const scriptTTS = `"${path.resolve(__dirname, "generar_voz.py")}"`;
    const resTTS = spawnSync(pythonCmd, [scriptTTS], {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
      shell: true,
    });

    if (resTTS.status !== 0) {
      console.error(`[TTS] ❌ Error en generación de voz para "${slug}". Código: ${resTTS.status}`);
      process.exit(1);
    }

    // 3. Renderizar short y exportar metadata con node scripts/render_short.js
    console.log(`\n[RENDER] 🎥 Renderizando video "${slug}"...`);
    const scriptRender = `"${path.resolve(__dirname, "render_short.js")}"`;
    const resRender = spawnSync("node", [
      scriptRender,
      `--name="${slug}"`,
      "--port=3004"
    ], {
      stdio: "inherit",
      cwd: path.resolve(__dirname, ".."),
      shell: true,
    });

    if (resRender.status !== 0) {
      console.error(`[RENDER] ❌ Error al renderizar "${slug}". Código: ${resRender.status}`);
      process.exit(1);
    }

    // 4. Verificar salida
    const mp4Local = path.join(OUT_DIR, `${slug}.mp4`);
    const mp4Destino = DESTINO_DIR ? path.join(DESTINO_DIR, `${slug}.mp4`) : "";
    if (fs.existsSync(mp4Local)) {
      const mb = (fs.statSync(mp4Local).size / (1024 * 1024)).toFixed(1);
      console.log(`\n[COMPLETADO] ✅ [${i + 1}/5] "${slug}.mp4" generado exitosamente (${mb} MB).`);
      if (fs.existsSync(mp4Destino)) {
        console.log(`[COMPLETADO] 🚀 Sincronizado a Drive: ${mp4Destino}`);
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 ¡LOS 5 VIDEOS FUERON GENERADOS Y SINCRONIZADOS CON ÉXITO!`);
  console.log(`======================================================\n`);
}

main();
