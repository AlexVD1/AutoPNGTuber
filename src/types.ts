import { EfectoAmbienteFestivo } from "./stickman/festiveLibrary";

export type LegacyPose = "normal" | "pensando" | "sorprendido" | "explicando";
export type Pose = LegacyPose | (string & {});

export type OrientacionStickman = "derecha" | "izquierda";
export type AnimacionEntradaStickman =
  | "rebote"
  | "zoom"
  | "deslizar"
  | "ninguna";

export interface StickmanPropsAttachment {
  derecha?: string;
  izquierda?: string;
  arriba?: string;
  sombrero?: string;
  cara?: string;
  cuello?: string;
  cintura?: string;
}

export interface PalabraTiming {
  palabra: string;
  inicioMs: number;
  finMs: number;
}

export type TipoElementoNarrativo =
  | "speed_counter"
  | "speed_lines"
  | "flying_debris"
  | "giant_waves"
  | "shockwave_burst"
  | "orbital_peace"
  | "danger_vignette";

export interface ElementoNarrativo {
  tipo: TipoElementoNarrativo;
  valorNumerico?: number;
  unidad?: string;
  subtitulo?: string;
  color?: string;
  direccion?: "este" | "oeste" | "arriba" | "abajo";
  intensidad?: number;
}

export type TipoTransicion =
  | "zoom_in"
  | "whip_right"
  | "whip_left"
  | "flash"
  | "corte";

export type EstiloLayout = "clasico" | "narrativo" | "compacto";

export type TipoComposicionVisual =
  | "minimalista"
  | "escenario_ilustrado"
  | "primer_plano"
  | "plano_general"
  | "cifras_concepto";

export type TipoEscenario =
  | "habitacion_noche"
  | "laboratorio"
  | "calle"
  | "lunar"
  | "vacio";

export type TipoCurvaMovimiento =
  | "lineal"
  | "suave"
  | "anticipacion"
  | "rebote"
  | "impacto";

export type TipoMovimientoProcedural =
  | "caminar"
  | "temblar"
  | "rebotar"
  | "flotar"
  | "recoil"
  | "estatico";

export type AccionPredefinidaTipo =
  | "caminar_hacia"
  | "detenerse_y_mirar"
  | "acercarse_y_tocar"
  | "sorpresa_y_retroceso"
  | "tropezar_y_reaccionar"
  | "mirar_y_reaccionar"
  | "sonambulo_avanzar"
  | "despertar_asustado"
  | "guiar_amigo"
  | "explicar_calma";

export interface PasoAccion {
  inicioFrame?: number;
  finFrame?: number;
  inicioProgreso?: number;
  finProgreso?: number;
  poseId?: string;
  expresion?: string;
  posicion?: { x?: number; y?: number };
  deltaPosicion?: { x?: number; y?: number };
  escala?: number;
  orientacion?: OrientacionStickman;
  curva?: TipoCurvaMovimiento;
  prop?: string;
  props?: StickmanPropsAttachment;
  mirarHacia?: { x: number; y: number } | "objetivo";
  procedural?: TipoMovimientoProcedural;
}

export interface AccionPersonaje {
  tipo?: AccionPredefinidaTipo | "personalizada";
  pasos?: PasoAccion[];
  desdeX?: number;
  haciaX?: number;
  desdeY?: number;
  haciaY?: number;
  inicioFrame?: number;
  duracionFrames?: number;
  objetivoId?: string;
}

export interface PersonajeEscena {
  id: string;
  nombre?: string;
  poseId?: string;
  expresion?: string;
  prop?: string;
  props?: StickmanPropsAttachment;
  efectoAmbiente?: EfectoAmbienteFestivo;
  posicion?: { x?: number; y?: number };
  escala?: number;
  orientacion?: OrientacionStickman;
  animacionEntrada?: AnimacionEntradaStickman;
  acciones?: AccionPersonaje[];
  habla?: boolean;
  capaZ?: number;
}

export interface ObjetoEscena {
  id: string;
  propId: string;
  posicion: { x: number; y: number };
  escala?: number;
  rotacion?: number;
  capaZ?: number;
  animacion?: {
    tipo: "caer" | "flotar" | "vibrar" | "pulso" | "fijo";
    inicioFrame?: number;
    finFrame?: number;
    deltaY?: number;
  };
}

export interface EscenaGuion {
  id: number;
  texto: string;
  /** Compatible con poses antiguas ('normal', 'pensando', 'sorprendido', 'explicando') o cualquier ID del catálogo */
  pose?: Pose;
  /** Identificador de pose o combinación compuesta de src/data/poses.json */
  poseId?: string;
  /** Expresión facial opcional para sobreescribir la expresión por defecto de la pose */
  expresion?: string;
  /** Prop rápido para la mano principal */
  prop?: string;
  /** Configuración detallada de props en manos y accesorios festivos vestibles */
  props?: StickmanPropsAttachment;
  /** Efecto decorativo de ambiente opcional ('confeti', 'nieve', 'fuegos_artificiales', etc.) */
  efectoAmbiente?: EfectoAmbienteFestivo;
  /** Orientación horizontal del personaje */
  orientacion?: OrientacionStickman;
  /** Escala multiplicadora del personaje (por defecto 1) */
  escala?: number;
  /** Desplazamiento opcional en píxeles { x, y } */
  posicion?: { x?: number; y?: number };
  /** Tipo de animación determinista de entrada */
  animacionEntrada?: AnimacionEntradaStickman;
  icono: string;
  colorIcono: string;
  tituloVisual: string;
  duracionSegundos?: number;
  palabras?: PalabraTiming[];
  /** Estilo de distribución espacial de la escena */
  layout?: EstiloLayout;
  /** Elementos visuales narrativos animados para apoyar la explicación del guion */
  elementosNarrativos?: ElementoNarrativo[];
  /** Efectos de cámara cinemática ('shake', 'punch', 'drift') */
  efectosCamara?: ("shake" | "punch" | "drift")[];
  /** Transición visual de entrada */
  transicion?: TipoTransicion;
  /** Archivo SFX sincronizado específico (ej. 'sfx/sfx_whoosh.wav') */
  sfx?: string;
  /** Nivel de volumen para el SFX de esta escena (0 a 1) */
  volumenSfx?: number;
  /** Palabras clave para destacar con jerarquía tipográfica */
  palabrasClave?: string[];
  /** Tipo de encuadre y composición narrativa */
  composicionVisual?: TipoComposicionVisual;
  /** Tipo de escenario ilustrado de fondo */
  escenario?: TipoEscenario;
  /** Múltiples personajes actuando de forma sincronizada en la escena */
  personajes?: PersonajeEscena[];
  /** Objetos o props interactivos presentes en el escenario */
  objetos?: ObjetoEscena[];
}

export type ShortProps = {
  escenas: EscenaGuion[];
};
