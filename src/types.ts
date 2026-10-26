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
  | "abismo_oceanico"
  | "interior_cuerpo"
  | "mar_abierto"
  | "espacio_profundo"
  | "cielo_dia"
  | "atardecer_dorado"
  | "tormenta_electrica"
  | "bosque_frio_nocturno"
  | "sala_estar"
  | "laboratorio_neuro"
  | "azotea_rascacielos"
  | "rascacielos"
  | "tumba_egipcia"
  | "egipto"
  | "superficie_marte"
  | "marte"
  | "lago_helado"
  | "glaciar"
  | "artico"
  | "selva_tropical"
  | "bosque_tropical"
  | "amazonas"
  | "nucleo_tierra"
  | "arrecife_coral"
  | "red_subterranea"
  | "vuelo_relativista"
  | "playa_bioluminiscente"
  | "caldera_volcan"
  | "crater_volcanico"
  | "volcan"
  | "ofrenda_dia_muertos"
  | "cosmogonia_prehispanica"
  | "paramo_celta_niebla"
  | "umbral_cielo_infierno"
  | "laboratorio_balistica"
  | "diagrama_termico_rupert"
  | "laboratorio_penumbra"
  | "microcosmos_acuatico"
  | "desierto_polar_antartico"
  | "corte_glaciar_antartico"
  | "llanura_antartica_pozo"
  | "interior_guia_ondas_hielo"
  | "carrera_ondas_dispersion"
  | "laboratorio_antartico"
  | "atardecer_polar_despedida"
  | "estanque_terrestre_dia"
  | "microcosmos_choque_fotones"
  | "orbita_sol_estrellas"
  | "despliegue_vela_solar"
  | "diagrama_optica_rebote"
  | "velocidad_curvatura_espacio"
  | "surf_nebulosa_estelar"
  | "modulo_iss_gravedad_cero"
  | "primer_plano_tapon_fluido"
  | "microcosmos_cohesion_molecular"
  | "pecera_flotante_360"
  | "peligro_adhesion_capilar"
  | "mascara_agua_asfixia"
  | "cierre_orbital_tierra"
  | "cordillera_penitentes_panoramica"
  | "laberinto_penitentes_cerrado"
  | "macro_sublimacion_fosforo"
  | "diagrama_sublimacion_fases"
  | "corte_geologico_timelapse_solar"
  | "ejercito_penitentes_sol"
  | "atardecer_andino_despedida"
  | "crater_kawah_ijen_noche"
  | "crater_gas_toxico_azufre"
  | "corte_subsuelo_olla_presion"
  | "macro_soplete_autoignicion"
  | "ladera_azufre_liquido_flujo"
  | "crater_kawah_ijen_dia"
  | "panoramica_kawah_ijen_cierre"
  | "vertedero_botellas_pet"
  | "planta_reciclaje_petri_japon"
  | "parque_mascota_bacteria"
  | "microcosmos_polimero_petasa"
  | "metabolismo_mhetasa_powerup"
  | "laboratorio_mutacion_x6"
  | "calle_verde_paseo_final"
  | "autopista_en_fuga"
  | "estudio_pausa_fotogramas"
  | "estudio_reloj_estroboscopico"
  | "helipuerto_despegue_exterior"
  | "helipuerto_camara_tripode"
  | "habitacion_ventilador_pov"
  | "habitacion_mareo_cierre"
  | "lago_natron_orilla_roja"
  | "lago_natron_macro_contacto"
  | "lago_natron_test_ph_alcalino"
  | "volcan_ol_doinyo_lengai"
  | "lago_natron_espejo_mortal"
  | "lago_natron_calcificacion_timelapse"
  | "lago_natron_flamencos_paraiso"
  | "selva_ant_mill_cenital"
  | "selva_suelo_macro_fila"
  | "macro_anatomia_cabeza_hormiga"
  | "diagrama_quimico_feromonas"
  | "diagrama_bucle_cerrado_glitch"
  | "selva_atomizador_corte_quimico"
  | "selva_colonia_liberada_cierre"
  | "cueva_naica_megacristales_calor"
  | "cueva_naica_escala_panoramica"
  | "corte_geologico_magma_submarino"
  | "cueva_naica_drenaje_horno"
  | "diagrama_condensacion_lata_pulmon"
  | "cueva_naica_rescate_traje_hielo"
  | "mina_naica_compuerta_escape"
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
  opacidad?: number;
  espectral?: boolean;
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

export interface GuionMeta {
  id?: string;
  slug?: string;
  temaResumen?: string;
  [key: string]: unknown;
}

export interface GuionConMeta {
  meta?: GuionMeta;
  escenas: EscenaGuion[];
}

export type GuionEstructura = EscenaGuion[] | GuionConMeta;

export interface RegistroHistorialTema {
  id: string;
  fecha: string;
  gancho: string;
  palabrasClave: string;
  archivoRespaldo: string;
  textoCompleto?: string;
}

export interface VideoMetadata {
  storyId: string;
  title: string;
  description: string;
  hashtags: string[];
  genre: string;
  category: string;
  language: string;
  duration_seconds: number;
  resolution: string;
  format: string;
  codec_video: string;
  codec_audio: string;
  fps: number;
  created_at: string;
  video_file: string;
  scene_count: number;
  has_subtitles: boolean;
  has_narration: boolean;
  has_music: boolean;
  tts_voice: string;
}
