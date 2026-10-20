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
}

export type ShortProps = {
  escenas: EscenaGuion[];
};
