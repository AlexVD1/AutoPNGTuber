import React from "react";
import ReactDOMServer from "react-dom/server";
import * as LucideIcons from "lucide-react";
import { BODY_POSES, BodyPoseDef, LEGACY_POSE_MAP } from "./bodyPoses";
import { EXPRESSIONS, ExpressionDef, renderFaceMarkup } from "./expressions";
import { PROPS_LIBRARY, PropDef } from "./propsLibrary";
import {
  AMBIENT_EFFECTS,
  EfectoAmbienteFestivo,
  FESTIVE_COMPOSITES,
  FESTIVE_PROPS,
  FestivePropDef,
} from "./festiveLibrary";

export interface CompositePoseDef {
  id: string;
  name: string;
  bodyPoseId: string;
  expressionId: string;
  rightProp?: string;
  leftProp?: string;
  overheadProp?: string;
  hatProp?: string;
  faceProp?: string;
  neckProp?: string;
  waistProp?: string;
  efectoAmbiente?: EfectoAmbienteFestivo;
  emotion: string;
  action: string;
  tags: string[];
}

export const COMPOSITE_POSES: Record<string, CompositePoseDef> = {
  thinking_lightbulb: {
    id: "thinking_lightbulb",
    name: "Pensando con bombilla de idea",
    bodyPoseId: "thinking_chin_hand",
    expressionId: "eureka",
    overheadProp: "idea_bulb",
    emotion: "excited",
    action: "thinking",
    tags: ["pensando", "bombilla", "idea", "eureka", "solucion"],
  },
  explaining_book: {
    id: "explaining_book",
    name: "Explicando con libro abierto",
    bodyPoseId: "holding_both_hands",
    expressionId: "talking",
    rightProp: "open_book",
    emotion: "explaining",
    action: "explaining",
    tags: ["explicando", "libro", "educacion", "lectura", "historia"],
  },
  explaining_chalkboard: {
    id: "explaining_chalkboard",
    name: "Explicando con pizarra",
    bodyPoseId: "holding_board",
    expressionId: "talking",
    rightProp: "chalkboard",
    leftProp: "marker",
    emotion: "explaining",
    action: "teaching",
    tags: ["explicando", "pizarra", "profesor", "clase", "ciencia"],
  },
  surprised_exclamation: {
    id: "surprised_exclamation",
    name: "Sorprendido con signo de exclamación",
    bodyPoseId: "surprised_hands_up",
    expressionId: "surprised",
    overheadProp: "exclamation_mark",
    emotion: "surprised",
    action: "surprised",
    tags: ["sorprendido", "exclamacion", "impacto", "asombro"],
  },
  scared_flashlight: {
    id: "scared_flashlight",
    name: "Asustado alumbrando con linterna",
    bodyPoseId: "trembling_fear",
    expressionId: "scared",
    rightProp: "flashlight",
    emotion: "scared",
    action: "searching_dark",
    tags: ["asustado", "linterna", "miedo", "oscuridad", "misterio"],
  },
  researching_magnifier: {
    id: "researching_magnifier",
    name: "Investigando con una lupa",
    bodyPoseId: "investigating_magnifier",
    expressionId: "analytical",
    rightProp: "magnifier",
    emotion: "focused",
    action: "investigating",
    tags: ["investigando", "lupa", "analizando", "pista", "ciencia"],
  },
  celebrating_trophy: {
    id: "celebrating_trophy",
    name: "Celebrando con un trofeo",
    bodyPoseId: "celebrating_arms_up",
    expressionId: "laugh",
    rightProp: "trophy",
    emotion: "happy",
    action: "celebrating",
    tags: ["celebrando", "trofeo", "campeon", "exito", "logro"],
  },
  confused_question: {
    id: "confused_question",
    name: "Confundido con signo de interrogación",
    bodyPoseId: "scratching_head",
    expressionId: "confused",
    overheadProp: "question_mark",
    emotion: "confused",
    action: "questioning",
    tags: ["confundido", "interrogacion", "duda", "pregunta"],
  },
  analyzing_flask: {
    id: "analyzing_flask",
    name: "Analizando un matraz químico",
    bodyPoseId: "presenting_object",
    expressionId: "analytical",
    rightProp: "flask",
    leftProp: "test_tube",
    emotion: "focused",
    action: "experimenting",
    tags: ["analizando", "matraz", "quimica", "laboratorio", "experimento"],
  },
  exploring_map: {
    id: "exploring_map",
    name: "Explorando con mapa y brújula",
    bodyPoseId: "showing_both_hands",
    expressionId: "talking_enthusiastic",
    rightProp: "map",
    leftProp: "compass",
    emotion: "curious",
    action: "exploring",
    tags: ["explorando", "mapa", "brujula", "geografia", "aventura"],
  },
  explaining_corn: {
    id: "explaining_corn",
    name: "Explicando con mazorca de maíz",
    bodyPoseId: "presenting_object",
    expressionId: "talking",
    rightProp: "corn",
    emotion: "explaining",
    action: "presenting",
    tags: ["explicando", "maiz", "mazorca", "alimentos", "naturaleza"],
  },
  surprised_popcorn: {
    id: "surprised_popcorn",
    name: "Sorprendido con palomitas de maíz",
    bodyPoseId: "shock_explosion",
    expressionId: "surprised",
    rightProp: "popcorn",
    overheadProp: "exclamation_mark",
    emotion: "surprised",
    action: "reacting",
    tags: ["sorprendido", "palomitas", "explosion", "maiz", "cine"],
  },
  working_laptop: {
    id: "working_laptop",
    name: "Trabajando con computadora portátil",
    bodyPoseId: "sitting",
    expressionId: "analytical",
    rightProp: "laptop",
    emotion: "focused",
    action: "working",
    tags: ["trabajando", "portatil", "laptop", "tecnologia", "programando"],
  },
  discovering_lightbulb: {
    id: "discovering_lightbulb",
    name: "Descubriendo una gran idea",
    bodyPoseId: "eureka_idea",
    expressionId: "eureka",
    rightProp: "lightbulb",
    emotion: "excited",
    action: "discovering",
    tags: ["descubriendo", "bombilla", "idea", "invento", "ciencia"],
  },
  worried_clock: {
    id: "worried_clock",
    name: "Preocupado por el tiempo con reloj",
    bodyPoseId: "doubting_open_hands",
    expressionId: "worried",
    rightProp: "clock",
    emotion: "worried",
    action: "waiting",
    tags: ["preocupado", "reloj", "tiempo", "prisa", "urgente"],
  },
  proud_medal: {
    id: "proud_medal",
    name: "Orgulloso mostrando medalla",
    bodyPoseId: "standing_confident",
    expressionId: "proud",
    rightProp: "medal",
    emotion: "proud",
    action: "showing_medal",
    tags: ["orgulloso", "medalla", "premio", "honor", "victoria"],
  },
  embarrassed_facepalm: {
    id: "embarrassed_facepalm",
    name: "Avergonzado haciendo facepalm",
    bodyPoseId: "facepalm",
    expressionId: "embarrassed",
    emotion: "embarrassed",
    action: "facepalm",
    tags: ["avergonzado", "facepalm", "error", "equivocacion"],
  },
  warning_stop: {
    id: "warning_stop",
    name: "Dando una advertencia con señal de peligro",
    bodyPoseId: "warning_danger",
    expressionId: "worried",
    rightProp: "cross_mark",
    overheadProp: "exclamation_mark",
    emotion: "worried",
    action: "warning",
    tags: ["advertencia", "alto", "peligro", "prohibido", "cuidado"],
  },
  explaining_water_drop: {
    id: "explaining_water_drop",
    name: "Explicando con una gota de agua",
    bodyPoseId: "presenting_object",
    expressionId: "talking",
    rightProp: "water_drop",
    emotion: "explaining",
    action: "presenting",
    tags: ["agua", "gota", "humedad", "ciencia", "naturaleza"],
  },
  explaining_flame_heat: {
    id: "explaining_flame_heat",
    name: "Explicando el calor con fuego y termómetro",
    bodyPoseId: "comparing_two_objects",
    expressionId: "talking_enthusiastic",
    rightProp: "flame",
    leftProp: "thermometer",
    emotion: "explaining",
    action: "comparing",
    tags: ["fuego", "calor", "termometro", "temperatura", "vapor"],
  },
  astronomy_telescope: {
    id: "astronomy_telescope",
    name: "Observando el espacio con telescopio y planeta",
    bodyPoseId: "explaining_pointing_up",
    expressionId: "talking_enthusiastic",
    leftProp: "telescope",
    overheadProp: "planet",
    emotion: "curious",
    action: "observing",
    tags: ["espacio", "telescopio", "planeta", "universo", "astronomia"],
  },
  physics_atom: {
    id: "physics_atom",
    name: "Explicando física con átomo y molécula",
    bodyPoseId: "explaining_pointing_up",
    expressionId: "talking",
    rightProp: "atom",
    leftProp: "molecule",
    emotion: "explaining",
    action: "teaching",
    tags: ["atomo", "molecula", "fisica", "quimica", "ciencia"],
  },
  tech_ai_robot: {
    id: "tech_ai_robot",
    name: "Presentando un robot y microchip",
    bodyPoseId: "presenting_object",
    expressionId: "smile_wide",
    rightProp: "mini_robot",
    leftProp: "microchip",
    emotion: "enthusiastic",
    action: "presenting",
    tags: ["robot", "ia", "microchip", "tecnologia", "futuro"],
  },
  tech_smartphone: {
    id: "tech_smartphone",
    name: "Mostrando teléfono móvil",
    bodyPoseId: "presenting_object",
    expressionId: "smile_soft",
    rightProp: "smartphone",
    emotion: "neutral",
    action: "showing_phone",
    tags: ["telefono", "celular", "smartphone", "app", "redes"],
  },
  history_warrior: {
    id: "history_warrior",
    name: "Explorador histórico con espada y escudo",
    bodyPoseId: "standing_confident",
    expressionId: "proud",
    rightProp: "fantasy_sword",
    leftProp: "shield",
    overheadProp: "historic_helmet",
    emotion: "confident",
    action: "posing",
    tags: ["historia", "espada", "escudo", "casco", "antiguo"],
  },
  history_scroll: {
    id: "history_scroll",
    name: "Leyendo un pergamino histórico",
    bodyPoseId: "holding_both_hands",
    expressionId: "analytical",
    rightProp: "scroll",
    emotion: "focused",
    action: "reading",
    tags: ["pergamino", "historia", "antiguedad", "leyenda"],
  },
  carrying_heavy_box: {
    id: "carrying_heavy_box",
    name: "Cargando una caja pesada",
    bodyPoseId: "lifting_heavy",
    expressionId: "frustrated",
    rightProp: "box",
    emotion: "exhausted",
    action: "carrying",
    tags: ["cargando", "caja", "pesado", "esfuerzo", "trabajo"],
  },
  coffee_break: {
    id: "coffee_break",
    name: "Tomando café relajado",
    bodyPoseId: "standing_relaxed",
    expressionId: "smile_soft",
    rightProp: "mug",
    emotion: "happy",
    action: "drinking",
    tags: ["cafe", "taza", "descanso", "cotidiano"],
  },
  announcing_megaphone: {
    id: "announcing_megaphone",
    name: "Anunciando un dato importante con megáfono",
    bodyPoseId: "presenting_object",
    expressionId: "talking_enthusiastic",
    rightProp: "megaphone",
    emotion: "enthusiastic",
    action: "announcing",
    tags: ["megafono", "anuncio", "noticia", "dato_curioso"],
  },
  comparing_scale: {
    id: "comparing_scale",
    name: "Comparando opciones con balanza",
    bodyPoseId: "comparing_two_objects",
    expressionId: "analytical",
    rightProp: "scale",
    leftProp: "coins",
    emotion: "analytical",
    action: "comparing",
    tags: ["balanza", "comparar", "monedas", "decision", "economia"],
  },
  approving_check: {
    id: "approving_check",
    name: "Aprobando con símbolo de correcto",
    bodyPoseId: "thumbs_up_approval",
    expressionId: "smile_wide",
    leftProp: "check_mark",
    emotion: "happy",
    action: "approving",
    tags: ["correcto", "check", "verdadero", "aprobado", "bien"],
  },
  taking_study_notes: {
    id: "taking_study_notes",
    name: "Tomando apuntes con cuaderno y lápiz",
    bodyPoseId: "taking_notes",
    expressionId: "analytical",
    leftProp: "notebook",
    rightProp: "pencil",
    emotion: "focused",
    action: "studying",
    tags: ["cuaderno", "lapiz", "apuntes", "notas", "estudio"],
  },
  frustrated_no_wifi: {
    id: "frustrated_no_wifi",
    name: "Frustrado sin internet ni wifi",
    bodyPoseId: "frustrated_head_grab",
    expressionId: "frustrated",
    rightProp: "router",
    overheadProp: "no_wifi",
    emotion: "frustrated",
    action: "frustrated",
    tags: ["frustrado", "sin_internet", "no_wifi", "router", "desesperacion"],
  },
  reading_book_peaceful: {
    id: "reading_book_peaceful",
    name: "Leyendo un libro en calma",
    bodyPoseId: "holding_both_hands",
    expressionId: "smile_soft",
    rightProp: "open_book",
    overheadProp: "idea_bulb",
    emotion: "happy",
    action: "reading",
    tags: ["leyendo", "libro", "calma", "descubrimiento", "paz"],
  },
};

export type AnyPropDef = PropDef | FestivePropDef;

export function findPropById(id?: string): AnyPropDef | undefined {
  if (!id) return undefined;
  if (PROPS_LIBRARY[id]) return PROPS_LIBRARY[id];
  if (FESTIVE_PROPS[id]) return FESTIVE_PROPS[id];

  // 1. Soporte para SVG personalizado inline generado por IA (ej. "svg:<path .../>" o "<circle ...>")
  if (id.startsWith("<") || id.startsWith("svg:")) {
    const rawSvg = id.startsWith("svg:") ? id.substring(4) : id;
    return {
      id: "custom_svg",
      name: "Prop Vectorial Personalizado",
      family: "reacciones_humor",
      defaultPlacement: "right",
      svg: rawSvg,
      tags: ["custom", "inline", "vector"],
    };
  }

  // 2. Soporte universal para más de 1,400 iconos de Lucide (ej. "lucide:Brain", "Coffee", "Rocket", etc.)
  const cleanIconName = id.replace(/^lucide:/i, "").trim();
  const pascalName =
    cleanIconName.charAt(0).toUpperCase() + cleanIconName.slice(1);
  const IconComponent =
    (LucideIcons as any)[cleanIconName] || (LucideIcons as any)[pascalName];

  if (
    IconComponent &&
    (typeof IconComponent === "function" || typeof IconComponent === "object")
  ) {
    try {
      const markup = ReactDOMServer.renderToStaticMarkup(
        React.createElement(IconComponent, {
          size: 40,
          color: "#000000",
          strokeWidth: 2.8,
        })
      );
      const innerMatch = markup.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
      const innerSvg = innerMatch ? innerMatch[1] : markup;

      // Paleta vibrante neo-brutalista determinista según el nombre del icono
      const BADGE_COLORS = [
        "#FFE600", // Amarillo neo-brutalista
        "#38BDF8", // Cyan cielo
        "#F43F5E", // Rosa vibrante
        "#34D399", // Esmeralda
        "#A78BFA", // Violeta eléctrico
        "#FB923C", // Naranja cálido
        "#FBBF24", // Ámbar dorado
        "#2DD4BF", // Turquesa
      ];
      let hash = 0;
      for (let i = 0; i < cleanIconName.length; i++) {
        hash = (hash << 5) - hash + cleanIconName.charCodeAt(i);
      }
      const bg = BADGE_COLORS[Math.abs(hash) % BADGE_COLORS.length];

      return {
        id,
        name: pascalName,
        family: "vida_cotidiana",
        defaultPlacement: "right",
        // Sticker Neo-Brutalista circular con fondo sólido para evitar líneas dobles en drop-shadow
        svg: `<g>
          <circle cx="0" cy="0" r="38" fill="${bg}" stroke="#000000" stroke-width="5" />
          <circle cx="0" cy="0" r="33" fill="none" stroke="#FFFFFF" stroke-width="2.5" opacity="0.65" />
          <svg x="-20" y="-20" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            ${innerSvg}
          </svg>
        </g>`,
        tags: [cleanIconName.toLowerCase(), "lucide", "icono"],
      };
    } catch {
      // Continuar si no se pudo serializar
    }
  }

  return undefined;
}

export interface RenderStickmanOptions {
  poseId?: string;
  expressionId?: string;
  rightProp?: string;
  leftProp?: string;
  overheadProp?: string;
  hatProp?: string;
  faceProp?: string;
  neckProp?: string;
  waistProp?: string;
  efectoAmbiente?: EfectoAmbienteFestivo;
}

export interface ResolvedStickmanConfig {
  bodyPose: BodyPoseDef;
  expression: ExpressionDef;
  rightProp?: AnyPropDef;
  leftProp?: AnyPropDef;
  overheadProp?: AnyPropDef;
  hatProp?: AnyPropDef;
  faceProp?: AnyPropDef;
  neckProp?: AnyPropDef;
  waistProp?: AnyPropDef;
  efectoAmbiente?: EfectoAmbienteFestivo;
  usedFallback: boolean;
  warningMessage?: string;
}

export function resolveStickmanConfig(
  options: RenderStickmanOptions
): ResolvedStickmanConfig {
  let rawPoseId = options.poseId || "standing_relaxed";
  if (LEGACY_POSE_MAP[rawPoseId]) {
    rawPoseId = LEGACY_POSE_MAP[rawPoseId];
  }

  let usedFallback = false;
  let warningMessage: string | undefined;

  let bodyPose: BodyPoseDef | undefined;
  let defaultExprId: string | undefined;
  let presetRightProp: string | undefined;
  let presetLeftProp: string | undefined;
  let presetOverheadProp: string | undefined;
  let presetHatProp: string | undefined;
  let presetFaceProp: string | undefined;
  let presetNeckProp: string | undefined;
  let presetWaistProp: string | undefined;
  let presetAmbient: EfectoAmbienteFestivo | undefined;

  const comp = COMPOSITE_POSES[rawPoseId] ?? FESTIVE_COMPOSITES[rawPoseId];

  if (comp) {
    bodyPose = BODY_POSES[comp.bodyPoseId];
    defaultExprId = comp.expressionId;
    presetRightProp = comp.rightProp;
    presetLeftProp = comp.leftProp;
    presetOverheadProp = comp.overheadProp;
    presetHatProp = comp.hatProp;
    presetFaceProp = comp.faceProp;
    presetNeckProp = comp.neckProp;
    presetWaistProp = comp.waistProp;
    presetAmbient = comp.efectoAmbiente;
  } else if (BODY_POSES[rawPoseId]) {
    bodyPose = BODY_POSES[rawPoseId];
    defaultExprId = bodyPose.defaultExpression;
  } else {
    usedFallback = true;
    warningMessage = `[Stickman] Pose "${options.poseId}" no encontrada. Usando respaldo "standing_relaxed".`;
    bodyPose = BODY_POSES.standing_relaxed;
    defaultExprId = bodyPose.defaultExpression;
  }

  const exprKey = options.expressionId || defaultExprId || "smile_soft";
  const expression = EXPRESSIONS[exprKey] || EXPRESSIONS.smile_soft;

  return {
    bodyPose,
    expression,
    rightProp: findPropById(options.rightProp ?? presetRightProp),
    leftProp: findPropById(options.leftProp ?? presetLeftProp),
    overheadProp: findPropById(options.overheadProp ?? presetOverheadProp),
    hatProp: findPropById(options.hatProp ?? presetHatProp),
    faceProp: findPropById(options.faceProp ?? presetFaceProp),
    neckProp: findPropById(options.neckProp ?? presetNeckProp),
    waistProp: findPropById(options.waistProp ?? presetWaistProp),
    efectoAmbiente: options.efectoAmbiente ?? presetAmbient,
    usedFallback,
    warningMessage,
  };
}

export function buildStickmanSvgString(options: RenderStickmanOptions): string {
  const {
    bodyPose,
    expression,
    rightProp,
    leftProp,
    overheadProp,
    hatProp,
    faceProp,
    neckProp,
    waistProp,
    efectoAmbiente,
  } = resolveStickmanConfig(options);

  const stroke = "#111827";
  const hx = bodyPose.head.cx;
  const hy = bodyPose.head.cy;
  const tilt = bodyPose.head.tilt ?? 0;

  const faceTranslateX = hx - 200;
  const faceTranslateY = hy - 115;
  const headTransform = `translate(${faceTranslateX}, ${faceTranslateY}) rotate(${tilt}, 200, 115)`;

  const faceSvg = renderFaceMarkup(expression, stroke);

  // Accesorios corporales (cuello / capa / cintura)
  const isCape = neckProp?.id === "vampire_cape";
  const backNeckSvg =
    neckProp && isCape
      ? `<g transform="translate(${hx}, ${hy + 72})">${neckProp.svg}</g>`
      : "";
  const frontNeckSvg =
    neckProp && !isCape
      ? `<g transform="translate(${hx}, ${hy + 72})">${neckProp.svg}</g>`
      : "";
  const waistSvg = waistProp
    ? `<g transform="translate(200, 290)">${waistProp.svg}</g>`
    : "";

  // Accesorios de cabeza y cara (gorros, gafas, barba)
  const faceAccessorySvg = faceProp
    ? `<g transform="translate(200, 115)">${faceProp.svg}</g>`
    : "";
  const hatAccessorySvg = hatProp
    ? `<g transform="translate(200, 47)">${hatProp.svg}</g>`
    : "";

  const leftPropSvg = leftProp
    ? `<g transform="translate(${bodyPose.hands.left.x}, ${bodyPose.hands.left.y}) rotate(${bodyPose.hands.left.angle ?? 0})">${leftProp.svg}</g>`
    : "";

  const rightPropSvg = rightProp
    ? `<g transform="translate(${bodyPose.hands.right.x}, ${bodyPose.hands.right.y}) rotate(${bodyPose.hands.right.angle ?? 0})">${rightProp.svg}</g>`
    : "";

  const overheadX = bodyPose.overhead.x === 200 ? 282 : bodyPose.overhead.x;
  const overheadY = bodyPose.overhead.y < 45 ? 48 : bodyPose.overhead.y;

  const overheadPropSvg = overheadProp
    ? `<g transform="translate(${overheadX}, ${overheadY})">${overheadProp.svg}</g>`
    : "";

  const ambientSvg =
    efectoAmbiente && AMBIENT_EFFECTS[efectoAmbiente]
      ? AMBIENT_EFFECTS[efectoAmbiente]
      : "";

  return `<svg width="500" height="620" viewBox="-35 -40 470 545" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Efectos festivos de ambiente opcionales -->
  ${ambientSvg}
  <!-- Sombra base -->
  <ellipse cx="200" cy="472" rx="85" ry="14" fill="#E5E7EB" />
  <!-- Capa trasera si aplica -->
  ${backNeckSvg}
  <!-- Piernas -->
  <path d="${bodyPose.legs}" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Torso -->
  <path d="${bodyPose.torso}" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Accesorios de cintura -->
  ${waistSvg}
  <!-- Brazos -->
  <path d="${bodyPose.leftArm}" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <path d="${bodyPose.rightArm}" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Accesorios de cuello delanteros -->
  ${frontNeckSvg}
  <!-- Accesorios de postura -->
  ${bodyPose.accents ?? ""}
  <!-- Cabeza, expresion facial y accesorios de cabeza/cara -->
  <g transform="${headTransform}">
    <circle cx="200" cy="115" r="68" fill="#FFFFFF" stroke="${stroke}" stroke-width="12" />
    ${faceSvg}
    ${faceAccessorySvg}
    ${hatAccessorySvg}
  </g>
  <!-- Props integrados en manos y cabeza -->
  ${leftPropSvg}
  ${rightPropSvg}
  ${overheadPropSvg}
</svg>`;
}

export interface DynamicStickmanOptions extends RenderStickmanOptions {
  frame?: number;
  fps?: number;
  isSpeaking?: boolean;
  headTiltOffset?: number;
}

/**
 * Generador SVG determinista con micro-animaciones procedurales en tiempo real:
 * - Parpadeo orgánico (blink) cada ~75 frames.
 * - Sincronía labial orgánica (lip-sync PNGTuber) cuando habla.
 * - Cabeceo y tilt de cabeza expresivo.
 * - Micro-gesticulación de brazos y props vinculados a las articulaciones de los hombros.
 * - Respiración sutil en sombras y accesorios.
 */
export function buildDynamicStickmanSvgString(
  options: DynamicStickmanOptions
): string {
  const {
    bodyPose,
    expression,
    rightProp,
    leftProp,
    overheadProp,
    hatProp,
    faceProp,
    neckProp,
    waistProp,
    efectoAmbiente,
  } = resolveStickmanConfig(options);

  const frame = options.frame ?? 0;
  const isSpeaking = options.isSpeaking ?? false;
  const stroke = "#111827";

  // 1. Parpadeo orgánico: cada ~75 frames (~2.5s a 30fps), parpadea durante 3 frames
  const isBlinking = ((frame + 28) % 75) < 3;
  const dynamicExpr = { ...expression };
  if (isBlinking && expression.eyes !== "closed") {
    dynamicExpr.eyes = "happy_arc" as any;
  }

  // 2. Modulación de boca al hablar (PNGTuber lip-sync determinista)
  if (isSpeaking) {
    const mouthCycle = Math.floor(frame / 4) % 3;
    if (mouthCycle === 0) {
      dynamicExpr.mouth = "talking";
    } else if (mouthCycle === 1) {
      dynamicExpr.mouth =
        expression.mouth === "talking" ? "smile_wide" : expression.mouth;
    } else {
      dynamicExpr.mouth = "surprised_o";
    }
  }

  // 3. Cabeceo e inclinación viva de la cabeza
  const hx = bodyPose.head.cx;
  const hy = bodyPose.head.cy;
  const baseTilt = bodyPose.head.tilt ?? 0;

  const speakingNod = isSpeaking ? Math.sin(frame / 3.5) * 2.2 : 0;
  const headTiltOffset = options.headTiltOffset ?? 0;
  const organicTilt =
    baseTilt +
    headTiltOffset +
    Math.sin(frame / 12) * 1.8 +
    (isSpeaking ? Math.sin(frame / 4) * 1.5 : 0);

  const faceTranslateX = hx - 200;
  const faceTranslateY = hy - 115 + speakingNod;
  const headTransform = `translate(${faceTranslateX}, ${faceTranslateY}) rotate(${organicTilt}, 200, 115)`;

  const faceSvg = renderFaceMarkup(dynamicExpr, stroke);

  // 4. Micro-gesticulación de brazos alrededor de los hombros (200, 210)
  const leftGestureAngle =
    Math.sin(frame / 9) * 2.4 + (isSpeaking ? Math.sin(frame / 4) * 2.2 : 0);
  const rightGestureAngle =
    Math.cos(frame / 9) * 2.4 + (isSpeaking ? Math.cos(frame / 4) * 2.2 : 0);

  // Accesorios corporales
  const isCape = neckProp?.id === "vampire_cape";
  const backNeckSvg =
    neckProp && isCape
      ? `<g transform="translate(${hx}, ${hy + 72 + speakingNod})">${neckProp.svg}</g>`
      : "";
  const frontNeckSvg =
    neckProp && !isCape
      ? `<g transform="translate(${hx}, ${hy + 72 + speakingNod})">${neckProp.svg}</g>`
      : "";
  const waistSvg = waistProp
    ? `<g transform="translate(200, 290)">${waistProp.svg}</g>`
    : "";

  // Accesorios de cabeza y cara (siguen el cabeceo e inclinación de la cabeza)
  const faceAccessorySvg = faceProp
    ? `<g transform="translate(200, 115)">${faceProp.svg}</g>`
    : "";
  const hatAccessorySvg = hatProp
    ? `<g transform="translate(200, 47)">${hatProp.svg}</g>`
    : "";

  const getPropContent = (propDef?: AnyPropDef) => {
    if (!propDef) return "";
    if ("animatedSvg" in propDef && typeof (propDef as any).animatedSvg === "function") {
      return (propDef as any).animatedSvg(frame);
    }
    return propDef.svg;
  };

  const leftPropSvg = leftProp
    ? `<g transform="translate(${bodyPose.hands.left.x}, ${bodyPose.hands.left.y}) rotate(${bodyPose.hands.left.angle ?? 0})">${getPropContent(leftProp)}</g>`
    : "";

  const rightPropSvg = rightProp
    ? `<g transform="translate(${bodyPose.hands.right.x}, ${bodyPose.hands.right.y}) rotate(${bodyPose.hands.right.angle ?? 0})">${getPropContent(rightProp)}</g>`
    : "";

  const overheadX = bodyPose.overhead.x === 200 ? 282 : bodyPose.overhead.x;
  const overheadY = bodyPose.overhead.y < 45 ? 48 : bodyPose.overhead.y;

  const overheadPropSvg = overheadProp
    ? `<g transform="translate(${overheadX}, ${overheadY + speakingNod * 0.5})">${getPropContent(overheadProp)}</g>`
    : "";

  const ambientSvg =
    efectoAmbiente && AMBIENT_EFFECTS[efectoAmbiente]
      ? AMBIENT_EFFECTS[efectoAmbiente]
      : "";

  const shadowRx = 85 + Math.sin(frame / 8) * 3;

  return `<svg width="500" height="620" viewBox="-35 -40 470 545" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Efectos festivos de ambiente opcionales -->
  ${ambientSvg}
  <!-- Sombra base dinámica -->
  <ellipse cx="200" cy="472" rx="${shadowRx}" ry="14" fill="#E5E7EB" />
  <!-- Capa trasera si aplica -->
  ${backNeckSvg}
  <!-- Piernas -->
  <path d="${bodyPose.legs}" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Torso -->
  <path d="${bodyPose.torso}" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Accesorios de cintura -->
  ${waistSvg}
  <!-- Accesorios de postura (detrás de brazos y props para evitar solapamientos indeseados) -->
  ${bodyPose.accents ?? ""}
  <!-- Brazo izquierdo gesticulando orgánicamente desde el hombro (200, 210) -->
  <g transform="rotate(${leftGestureAngle}, 200, 210)">
    <path d="${bodyPose.leftArm}" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <!-- Brazo derecho gesticulando orgánicamente desde el hombro (200, 210) -->
  <g transform="rotate(${rightGestureAngle}, 200, 210)">
    <path d="${bodyPose.rightArm}" stroke="${stroke}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <!-- Accesorios de cuello delanteros -->
  ${frontNeckSvg}
  <!-- Cabeza, expresion facial y accesorios de cabeza/cara -->
  <g transform="${headTransform}">
    <circle cx="200" cy="115" r="68" fill="#FFFFFF" stroke="${stroke}" stroke-width="12" />
    ${faceSvg}
    ${faceAccessorySvg}
    ${hatAccessorySvg}
  </g>
  <!-- Props en manos: renderizados SIEMPRE en la capa frontal para que nunca queden ocultos detrás de manos o cabeza -->
  <g transform="rotate(${leftGestureAngle}, 200, 210)">
    ${leftPropSvg}
  </g>
  <g transform="rotate(${rightGestureAngle}, 200, 210)">
    ${rightPropSvg}
  </g>
  <!-- Prop superior overhead -->
  ${overheadPropSvg}
</svg>`;
}
