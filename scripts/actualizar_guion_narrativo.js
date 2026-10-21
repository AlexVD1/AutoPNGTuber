const fs = require("fs");
const path = require("path");

const guionPath = path.join(__dirname, "../src/data/guion.json");
const guion = JSON.parse(fs.readFileSync(guionPath, "utf-8"));

// Escena 1: Pregunta disparadora (curiosidad)
guion[0].composicionVisual = "minimalista";
guion[0].escenario = "vacio";
guion[0].layout = "clasico";
guion[0].personajes = [
  {
    id: "narrador",
    nombre: "Narrador",
    posicion: { x: 0, y: 30 },
    escala: 1.05,
    orientacion: "derecha",
    props: {
      arriba: "question_mark",
      derecha: "moon",
    },
    acciones: [
      {
        tipo: "personalizada",
        pasos: [
          {
            inicioProgreso: 0,
            finProgreso: 0.5,
            poseId: "asking_question",
            expresion: "thinking",
            posicion: { x: 0, y: 30 },
            curva: "suave",
            procedural: "estatico",
          },
          {
            inicioProgreso: 0.5,
            finProgreso: 1.0,
            poseId: "thinking_chin_hand",
            expresion: "analytical",
            posicion: { x: 0, y: 30 },
            curva: "suave",
            procedural: "estatico",
          },
        ],
      },
    ],
    habla: true,
  },
];

// Escena 2: Caminando dormido (Plano general en habitación con dos personajes)
guion[1].composicionVisual = "plano_general";
guion[1].escenario = "habitacion_noche";
guion[1].layout = "narrativo";
guion[1].personajes = [
  {
    id: "sonambulo",
    nombre: "Sonámbulo",
    posicion: { x: -260, y: 70 },
    escala: 1.0,
    orientacion: "derecha",
    prop: "flashlight",
    acciones: [
      {
        tipo: "caminar_hacia",
        desdeX: -260,
        haciaX: 160,
        desdeY: 70,
        haciaY: 70,
      },
    ],
    habla: false,
    capaZ: 10,
  },
  {
    id: "narrador",
    nombre: "Narrador",
    posicion: { x: -280, y: 70 },
    escala: 1.0,
    orientacion: "derecha",
    acciones: [
      {
        tipo: "personalizada",
        pasos: [
          {
            inicioProgreso: 0,
            finProgreso: 0.45,
            poseId: "scratching_head",
            expresion: "confused",
            posicion: { x: -280, y: 70 },
            curva: "suave",
            procedural: "estatico",
          },
          {
            inicioProgreso: 0.45,
            finProgreso: 1.0,
            poseId: "covering_mouth",
            expresion: "surprised",
            posicion: { x: -240, y: 70 },
            curva: "suave",
            procedural: "estatico",
          },
        ],
      },
    ],
    habla: true,
    capaZ: 15,
  },
];

// Escena 3: Acción de despertar (Acercamiento y toque)
guion[2].composicionVisual = "escenario_ilustrado";
guion[2].escenario = "habitacion_noche";
guion[2].layout = "narrativo";
guion[2].personajes = [
  {
    id: "sonambulo",
    nombre: "Sonámbulo",
    posicion: { x: 100, y: 70 },
    escala: 1.02,
    orientacion: "derecha",
    prop: "flashlight",
    poseId: "walking",
    expresion: "bored",
    habla: false,
    capaZ: 10,
  },
  {
    id: "narrador",
    nombre: "Narrador",
    posicion: { x: -240, y: 70 },
    escala: 1.02,
    orientacion: "derecha",
    acciones: [
      {
        tipo: "acercarse_y_tocar",
        desdeX: -240,
        haciaX: -30,
        desdeY: 70,
        haciaY: 70,
      },
    ],
    habla: true,
    capaZ: 15,
  },
];

// Escena 4: Reacción (Primer plano dramático del susto y desconcierto)
guion[3].composicionVisual = "primer_plano";
guion[3].escenario = "habitacion_noche";
guion[3].layout = "narrativo";
guion[3].personajes = [
  {
    id: "sonambulo",
    nombre: "Sonámbulo",
    posicion: { x: 40, y: 70 },
    escala: 1.05,
    orientacion: "derecha",
    prop: "flashlight",
    acciones: [
      {
        tipo: "despertar_asustado",
        desdeX: 40,
        haciaX: 180,
        desdeY: 70,
        haciaY: 70,
      },
    ],
    habla: false,
    capaZ: 10,
  },
  {
    id: "narrador",
    nombre: "Narrador",
    posicion: { x: -120, y: 70 },
    escala: 1.05,
    orientacion: "derecha",
    poseId: "explaining_both_hands",
    expresion: "worried",
    habla: true,
    capaZ: 15,
  },
];

// Escena 5: Peligro y explicación (Cifras/concepto con peligro y prevención)
guion[4].composicionVisual = "cifras_concepto";
guion[4].escenario = "vacio";
guion[4].layout = "narrativo";
guion[4].personajes = [
  {
    id: "narrador",
    nombre: "Narrador",
    posicion: { x: 0, y: 40 },
    escala: 1.05,
    orientacion: "derecha",
    acciones: [
      {
        tipo: "personalizada",
        pasos: [
          {
            inicioProgreso: 0,
            finProgreso: 0.35,
            poseId: "explaining_pointing_up",
            expresion: "talking",
            posicion: { x: 0, y: 40 },
            curva: "suave",
            procedural: "estatico",
          },
          {
            inicioProgreso: 0.35,
            finProgreso: 0.7,
            poseId: "warning_danger",
            expresion: "worried",
            posicion: { x: 0, y: 40 },
            curva: "impacto",
            procedural: "temblar",
          },
          {
            inicioProgreso: 0.7,
            finProgreso: 1.0,
            poseId: "protecting_shielding",
            expresion: "scared",
            posicion: { x: 0, y: 40 },
            curva: "suave",
            procedural: "estatico",
          },
        ],
      },
    ],
    habla: true,
  },
];

// Escena 6: Guía suave de vuelta a la cama (Resolución armónica en habitación)
guion[5].composicionVisual = "plano_general";
guion[5].escenario = "habitacion_noche";
guion[5].layout = "narrativo";
guion[5].personajes = [
  {
    id: "sonambulo",
    nombre: "Sonámbulo",
    posicion: { x: -40, y: 70 },
    escala: 1.0,
    orientacion: "derecha",
    acciones: [
      {
        tipo: "caminar_hacia",
        desdeX: -40,
        haciaX: 140,
        desdeY: 70,
        haciaY: 70,
      },
    ],
    habla: false,
    capaZ: 10,
  },
  {
    id: "narrador",
    nombre: "Narrador",
    posicion: { x: -160, y: 70 },
    escala: 1.0,
    orientacion: "derecha",
    props: {
      derecha: "heart",
    },
    acciones: [
      {
        tipo: "caminar_hacia",
        desdeX: -160,
        haciaX: 20,
        desdeY: 70,
        haciaY: 70,
      },
    ],
    habla: true,
    capaZ: 15,
  },
];

// Escena 7: Conclusión optimista y moraleja
guion[6].composicionVisual = "minimalista";
guion[6].escenario = "vacio";
guion[6].layout = "clasico";
guion[6].personajes = [
  {
    id: "narrador",
    nombre: "Narrador",
    posicion: { x: 0, y: 20 },
    escala: 1.05,
    orientacion: "derecha",
    efectoAmbiente: "destellos",
    props: {
      derecha: "star",
    },
    acciones: [
      {
        tipo: "personalizada",
        pasos: [
          {
            inicioProgreso: 0,
            finProgreso: 0.45,
            poseId: "shushing_silence",
            expresion: "talking_enthusiastic",
            posicion: { x: 0, y: 20 },
            curva: "suave",
            procedural: "estatico",
          },
          {
            inicioProgreso: 0.45,
            finProgreso: 1.0,
            poseId: "thumbs_up_approval",
            expresion: "smile_wide",
            posicion: { x: 0, y: 20 },
            curva: "rebote",
            procedural: "estatico",
          },
        ],
      },
    ],
    habla: true,
  },
];

fs.writeFileSync(guionPath, JSON.stringify(guion, null, 2), "utf-8");
console.log("src/data/guion.json actualizado con arquitectura narrativa completa!");
