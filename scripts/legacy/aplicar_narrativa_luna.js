const fs = require("fs");
const path = require("path");

const guionPath = path.join(__dirname, "../../src/data/guion.json");
const guion = JSON.parse(fs.readFileSync(guionPath, "utf-8"));

// Escena 1: Pregunta en la superficie lunar con pelota
guion[0].composicionVisual = "plano_general";
guion[0].escenario = "lunar";
guion[0].layout = "narrativo";
guion[0].personajes = [
  {
    id: "astronauta",
    nombre: "Astronauta",
    posicion: { x: -80, y: 70 },
    escala: 1.05,
    orientacion: "derecha",
    props: {
      arriba: "question_mark",
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
            posicion: { x: -80, y: 70 },
            curva: "suave",
            procedural: "estatico",
          },
          {
            inicioProgreso: 0.5,
            finProgreso: 1.0,
            poseId: "thinking_chin_hand",
            expresion: "analytical",
            posicion: { x: -80, y: 70 },
            curva: "suave",
            procedural: "estatico",
          },
        ],
      },
    ],
    habla: true,
  },
];
guion[0].objetos = [
  {
    id: "pelota_lunar_flotando",
    propId: "beach_ball",
    posicion: { x: 160, y: 20 },
    escala: 1.2,
    animacion: {
      tipo: "flotar",
    },
  },
];

// Escena 2: ¡Para nada! La gravedad es débil
guion[1].composicionVisual = "plano_general";
guion[1].escenario = "lunar";
guion[1].layout = "narrativo";
guion[1].personajes = [
  {
    id: "astronauta",
    nombre: "Astronauta",
    posicion: { x: 0, y: 70 },
    escala: 1.05,
    orientacion: "derecha",
    acciones: [
      {
        tipo: "personalizada",
        pasos: [
          {
            inicioProgreso: 0,
            finProgreso: 0.45,
            poseId: "shaking_no",
            expresion: "shocked",
            posicion: { x: 0, y: 70 },
            curva: "impacto",
            procedural: "temblar",
          },
          {
            inicioProgreso: 0.45,
            finProgreso: 1.0,
            poseId: "showing_both_hands",
            expresion: "talking_enthusiastic",
            posicion: { x: 0, y: 70 },
            curva: "suave",
            procedural: "estatico",
          },
        ],
      },
    ],
    habla: true,
  },
];
guion[1].objetos = [
  {
    id: "tierra_referencia",
    propId: "globe",
    posicion: { x: 220, y: -60 },
    escala: 1.1,
    animacion: {
      tipo: "pulso",
    },
  },
];

// Escena 3: 1/6 de gravedad (Cifras y conceptos comparativos)
guion[2].composicionVisual = "cifras_concepto";
guion[2].escenario = "vacio";
guion[2].layout = "narrativo";
guion[2].elementosNarrativos = [
  {
    tipo: "speed_counter",
    valorNumerico: 16,
    unidad: "% GRAVEDAD",
  },
];
guion[2].personajes = [
  {
    id: "astronauta",
    nombre: "Astronauta",
    posicion: { x: 0, y: 50 },
    escala: 1.05,
    orientacion: "derecha",
    props: {
      derecha: "scale",
      izquierda: "moon",
    },
    poseId: "comparing_two_objects",
    expresion: "analytical",
    habla: true,
  },
];

// Escena 4: ¡Salto lunar gigante y pelota en órbita baja!
guion[3].composicionVisual = "plano_general";
guion[3].escenario = "lunar";
guion[3].layout = "narrativo";
guion[3].personajes = [
  {
    id: "astronauta",
    nombre: "Astronauta",
    posicion: { x: -60, y: 70 },
    escala: 1.05,
    orientacion: "derecha",
    acciones: [
      {
        tipo: "personalizada",
        pasos: [
          // Fase 1: Flexión y anticipación
          {
            inicioProgreso: 0,
            finProgreso: 0.2,
            poseId: "crouching",
            expresion: "smile_soft",
            posicion: { x: -60, y: 90 },
            curva: "anticipacion",
            procedural: "estatico",
          },
          // Fase 2: Salto lunar gigante (eleva hacia arriba flotando)
          {
            inicioProgreso: 0.2,
            finProgreso: 0.65,
            poseId: "jumping_joy",
            expresion: "smile_wide",
            posicion: { x: 40, y: -190 },
            curva: "suave",
            procedural: "estatico",
          },
          // Fase 3: Aterrizaje suave en cámara lenta
          {
            inicioProgreso: 0.65,
            finProgreso: 1.0,
            poseId: "standing_confident",
            expresion: "smile_wide",
            posicion: { x: 120, y: 70 },
            curva: "suave",
            procedural: "estatico",
          },
        ],
      },
    ],
    habla: true,
  },
];
guion[3].objetos = [
  {
    id: "pelota_super_rebote",
    propId: "beach_ball",
    posicion: { x: -160, y: 70 },
    escala: 1.3,
    animacion: {
      tipo: "flotar",
      deltaY: 260,
    },
  },
];

// Escena 5: Pero ojo: no es infinito (Primer plano con advertencia y física de colisión)
guion[4].composicionVisual = "primer_plano";
guion[4].escenario = "lunar";
guion[4].layout = "narrativo";
guion[4].personajes = [
  {
    id: "astronauta",
    nombre: "Astronauta",
    posicion: { x: 0, y: 60 },
    escala: 1.05,
    orientacion: "derecha",
    acciones: [
      {
        tipo: "personalizada",
        pasos: [
          {
            inicioProgreso: 0,
            finProgreso: 0.45,
            poseId: "warning_danger",
            expresion: "skeptical",
            posicion: { x: 0, y: 60 },
            curva: "impacto",
            procedural: "temblar",
          },
          {
            inicioProgreso: 0.45,
            finProgreso: 1.0,
            poseId: "thinking_chin_hand",
            expresion: "analytical",
            posicion: { x: 0, y: 60 },
            curva: "suave",
            procedural: "estatico",
          },
        ],
      },
    ],
    habla: true,
  },
];

// Escena 6: Outro y llamado a la acción
guion[5].composicionVisual = "minimalista";
guion[5].escenario = "vacio";
guion[5].layout = "clasico";
guion[5].personajes = [
  {
    id: "astronauta",
    nombre: "Astronauta",
    posicion: { x: 0, y: 20 },
    escala: 1.05,
    orientacion: "derecha",
    efectoAmbiente: "destellos",
    props: {
      izquierda: "moon",
      derecha: "flask",
      arriba: "question_mark",
    },
    acciones: [
      {
        tipo: "personalizada",
        pasos: [
          {
            inicioProgreso: 0,
            finProgreso: 0.5,
            poseId: "pointing_at_viewer",
            expresion: "talking_enthusiastic",
            posicion: { x: 0, y: 20 },
            curva: "suave",
            procedural: "estatico",
          },
          {
            inicioProgreso: 0.5,
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
console.log("Guion lunar actualizado con éxito con la nueva arquitectura narrativa!");
