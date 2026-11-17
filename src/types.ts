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
  | "danger_vignette"
  | "sparks_explosion"
  | "steam_vent"
  | "chemical_bubbles";

export interface ElementoNarrativo {
  tipo: TipoElementoNarrativo;
  valorNumerico?: number;
  unidad?: string;
  subtitulo?: string;
  color?: string;
  direccion?: "este" | "oeste" | "arriba" | "abajo";
  intensidad?: number;
  x?: number;
  y?: number;
  inicioProgreso?: number;
  finProgreso?: number;
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
}

export type TipoTransicion =
  | "zoom_in"
  | "whip_right"
  | "whip_left"
  | "flash"
  | "corte"
  | "fundido_negro";

export type EstiloLayout = "clasico" | "narrativo" | "compacto" | "cinematico";

export type TipoComposicionVisual =
  | "minimalista"
  | "escenario_ilustrado"
  | "primer_plano"
  | "plano_general"
  | "plano_medio"
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
  | "estudio_conteo_anumerico"
  | "ribera_amazonica_piraha"
  | "laboratorio_campo_fichas_grid"
  | "microcosmos_cerebral_memoria"
  | "pedestales_ans_comparativo"
  | "estudio_engranajes_hack_mental"
  | "vacio_filosofico_cosmos_ideas"
  | "aula_escolar_pizarron_solar"
  | "habitacion_medicion_distancia_solar"
  | "macro_lupa_mota_tierra"
  | "avenida_urbana_escala_planetaria"
  | "abismo_vacio_interestelar_grid"
  | "mapa_satelital_carretera_proxima"
  | "vacio_cosmos_soledad_canica"
  | "mesa_laboratorio_cafe_vapor"
  | "caja_maxwell_equilibrio_termico"
  | "macro_compuerta_filtro_maxwell"
  | "caja_maxwell_gradiente_extremo"
  | "cerebro_digital_sobrecarga_bits"
  | "borrado_bits_principio_landauer"
  | "mesa_remate_tecla_delete_cafe"
  | "pantalla_dividida_infancia_adultez"
  | "estudio_pastel_cinco_rebanadas"
  | "estudio_pastel_cincuenta_rebanadas"
  | "sala_archivos_cerebro_rutina"
  | "montaje_recuerdos_infancia_4k"
  | "rueda_hamster_oficina_gris"
  | "montana_atardecer_despertar_mente"
  | "colina_nocturna_estrellas_contador"
  | "laboratorio_fermi_holograma_galaxia"
  | "estacion_radiotelescopio_flatline"
  | "escalera_evolutiva_gran_filtro"
  | "abismo_futuro_amenazas_tecnologicas"
  | "bosque_oscuro_depredadores_silencio"
  | "espacio_orbital_palido_punto_azul"
  | "estacion_telegrafo_victoriana_1859"
  | "campo_auroras_caribe_medianoche"
  | "observatorio_astronomico_carrington_1859"
  | "espacio_cme_impacto_magnetosfera"
  | "transicion_cables_1859_a_metropolis"
  | "metropolis_apagon_catastrofe_electrica"
  | "ciudad_oscura_auroras_vela"
  | "habitacion_noche_proyector_recuerdos"
  | "sala_control_corteza_prefrontal"
  | "sala_control_amigdala_emergencia"
  | "consola_amigdala_engranajes_ansiedad"
  | "cueva_prehistorica_fuego_tigre"
  | "habitacion_noche_amigdala_facturas"
  | "habitacion_noche_calma_sueno"
  | "estudio_blanco_celda_mandela"
  | "estudio_linea_tiempo_mandela"
  | "red_mental_siluetas_mandela"
  | "estudio_caballete_monopoly_pikachu"
  | "pantalla_dividida_choque_loftus"
  | "mesa_trabajo_vhs_rompecabezas"
  | "multitud_siluetas_pieza_falsa"
  | "estudio_blanco_rebobinado_sombrero"
  | "taller_inventor_victoriano"
  | "billar_salon_1860"
  | "laboratorio_polimeros"
  | "infraestructura_electrica"
  | "cantera_puente_piedra"
  | "arsenal_venecia_1638"
  | "estrecho_tacoma_1940"
  | "metropoli_rascacielos"
  | "pantalla_dividida_muelle_moderno_romano"
  | "corte_transversal_hormigon_varilla_oxido"
  | "barca_mezcla_volcan_pozzuoli"
  | "microscopio_tobermorita_cristales"
  | "grumos_cal_autoreparacion_mit"
  | "ruinas_puerto_romano_submarino"
  | "barca_laboratorio_futuro_calendario"
  | "altar_morado_cuatro_luces"
  | "panoramica_cuatro_destinos_mexicas"
  | "escalones_mictlan_perro_guia"
  | "obstaculos_montanas_viento_obsidiana"
  | "rio_apanohuayan_cruce_ofrenda"
  | "sala_blanca_descanso_chignahumictlan"
  | "cempasuchil_cruz_codice_historia"
  | "ofrenda_final_camino_petalos"
  | "escritorio_procrastinacion_smartphone"
  | "ring_boxeo_cerebral_corteza_vs_limbico"
  | "corteza_prefrontal_pizarron_metas"
  | "sistema_limbico_cavernicola_dopamina"
  | "laboratorio_fmri_desconocido_yo_futuro"
  | "pantalla_dividida_sofa_vs_tormenta_futuro"
  | "escritorio_regla_cinco_minutos_exito"
  | "consultorio_medico_camilla_dolor"
  | "consultorio_revelacion_frasco_azucar"
  | "microcosmos_esofago_red_nerviosa"
  | "tronco_encefalico_farmacia_interna"
  | "torso_radiografico_medidores_salud"
  | "consultorio_placebo_etiqueta_abierta"
  | "consultorio_cierre_triunfal_iris"
  | "plaza_publica_tropiezo_foco"
  | "plaza_publica_persecucion_casco_foco"
  | "aula_universitaria_barry_manilow"
  | "aula_comparativa_graficos_pastel"
  | "cine_mental_sala_egocentrica"
  | "plaza_multitud_focos_inseguridades"
  | "plaza_atardecer_interruptor_libertad"
  | "granja_campo_giroscopio"
  | "laboratorio_optica_aviar"
  | "suelo_semillas_desenfoque"
  | "pista_caminata_experimento"
  | "diagrama_cuello_resorte_mecanico"
  | "estudio_ingenieria_steadycam_auto"
  | "granja_campo_atardecer_cierre"
  | "comparativa_olfato_tiburon_nariz"
  | "piscina_olimpica_geosmina"
  | "microcosmos_suelo_streptomyces"
  | "macro_impacto_gota_aerosol"
  | "sabana_homonido_sequia"
  | "parque_lluvia_paraguas_cierre"
  | "rocas_minerales_aceite_petricor"
  | "laboratorio_neurociencia_mano_goma"
  | "macro_pinceles_dedos_sincronia"
  | "interior_corteza_cerebral_redes"
  | "climax_martillo_panico_mesa"
  | "grafica_estres_cardiaco_laboratorio"
  | "laboratorio_cierre_eureka_neuro"
  | "aula_clases_anatomia_pizarron"
  | "laboratorio_hematologia_tubos"
  | "macro_optica_piel_subcutanea"
  | "espectro_fotones_dispersion_rayleigh"
  | "estudio_desmentir_mito_escolar"
  | "laboratorio_cierre_sangre_viva"
  | "taqueria_mexicana_salsas_fuego"
  | "macro_lengua_papilas_receptor"
  | "interior_cerebro_panico_quemadura"
  | "laboratorio_quimica_agua_vs_aceite"
  | "macro_caseina_micelas_rescate"
  | "taqueria_cierre_alivio_leche"
  | "calle_choque_juguete"
  | "archivo_memorias_futurista"
  | "escritorio_hipocampo_reconsolidacion"
  | "sala_tribunal_loftus"
  | "diagrama_velocimetro_loftus"
  | "mesa_rompecabezas_confabulacion"
  | "sala_estar_album_memoria"
  | "espacio_agujero_negro_hawking"
  | "horizonte_cuantico_evaporacion"
  | "laboratorio_cosmico_quema_libro"
  | "laboratorio_reconstruccion_cuantica"
  | "espacio_glitch_realidad_rota"
  | "superficie_holografica_agujero"
  | "cosmos_radiacion_informada_paz"
  | "habitacion_objetos_pareidolia"
  | "sabana_africana_crepusculo"
  | "pantalla_dividida_asimetria_error"
  | "microcosmos_cerebro_area_fusiforme"
  | "laboratorio_escaneo_intenciones"
  | "calle_urbana_humanizacion"
  | "cafeteria_taza_sonriente_cierre"
  | "banco_camara_seguridad_limon"
  | "exterior_banco_patrulla_arresto"
  | "aula_pizarra_dunning_kruger"
  | "risco_cima_de_la_ignorancia"
  | "abismo_valle_desesperacion_libros"
  | "sendero_pendiente_iluminacion"
  | "estudio_redes_espejo_limon"
  | "patio_tormenta_zanja_erosion"
  | "patio_torrente_presion_hidrostatica"
  | "corte_geotecnico_presa_gravedad"
  | "macro_corte_filtro_graduado_terzaghi"
  | "vista_cenital_embalse_alerta_vertedero"
  | "cascada_vertedero_escalonado_coladera"
  | "patio_soleado_arcoiris_lago_represa"
  | "campo_noche_cable_foco_moribundo"
  | "campo_medicion_caida_tension_humo"
  | "macro_microcosmos_red_cobre_joule"
  | "taller_bobinado_transformador_mesa"
  | "campo_red_aerea_postes_aisladores"
  | "granero_transformador_reductor_poste"
  | "campo_granero_iluminacion_total_victoria"
  | "arroyo_lodo_tabla_rota"
  | "estudio_tecnico_flexion_viga"
  | "campo_prueba_cuerda_canamo"
  | "arroyo_clavado_torres_compresion"
  | "arroyo_catenaria_anclajes_muertos"
  | "arroyo_pendolas_calzada_suspendida"
  | "arroyo_puente_colgante_victoria"
  | "cochera_taller_escape_recto"
  | "corte_cilindro_pulso_escape"
  | "camara_expansion_gas_remolinos"
  | "tubo_perforado_fibra_vidrio_absorcion"
  | "deflectores_laberinto_dos_rutas"
  | "interferencia_destructiva_cancelacion"
  | "cochera_salida_kart_silencioso_victoria"
  | "taller_montana_rusa_1895"
  | "andenes_feria_victoriana"
  | "noche_sabotaje_rieles"
  | "diagrama_fisica_clotoide_vs_circulo"
  | "parque_moderno_sunset"
  | "vacio";

export type TipoCurvaMovimiento =
  | "lineal"
  | "suave"
  | "anticipacion"
  | "rebote"
  | "impacto";

export type TipoMovimientoProcedural =
  | "caminar"
  | "correr"
  | "temblar"
  | "rebotar"
  | "flotar"
  | "recoil"
  | "manipular"
  | "esfuerzo"
  | "agachar_recoger"
  | "balanceo_cuerda"
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
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
  poseId?: string;
  expresion?: string;
  desdePosicion?: { x?: number; y?: number };
  posicion?: { x?: number; y?: number };
  deltaPosicion?: { x?: number; y?: number };
  escala?: number;
  orientacion?: OrientacionStickman;
  curva?: TipoCurvaMovimiento;
  prop?: string;
  props?: StickmanPropsAttachment;
  mirarHacia?: { x: number; y: number } | "objetivo";
  procedural?: TipoMovimientoProcedural;
  esHolograma?: boolean;
  opacidad?: number;
  rotacion?: number;
  transformOrigin?: string;
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

export interface TrayectoriaSuelo {
  desdeX: number;
  hastaX: number;
  y?: number;
  etiqueta?: string;
  color?: string;
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
  esHolograma?: boolean;
  colorRim?: string;
  trayectoriaSuelo?: TrayectoriaSuelo;
  inicioProgreso?: number;
  finProgreso?: number;
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
}

export type TipoAnimacionObjeto =
  | "caer"
  | "flotar"
  | "vibrar"
  | "pulso"
  | "fijo"
  | "rodar"
  | "rebotar";

export interface PasoObjeto {
  inicioFrame?: number;
  finFrame?: number;
  inicioProgreso?: number;
  finProgreso?: number;
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
  desdePosicion?: { x: number; y: number };
  posicion?: { x: number; y: number };
  escala?: number;
  rotacion?: number;
  opacidad?: number;
  estado?: string;
  propId?: string;
  curva?: TipoCurvaMovimiento;
  animacion?: TipoAnimacionObjeto;
}

export interface ObjetoEscena {
  id: string;
  propId: string;
  posicion: { x: number; y: number };
  escala?: number;
  rotacion?: number;
  opacidad?: number;
  capaZ?: number;
  estado?: string;
  inicioProgreso?: number;
  finProgreso?: number;
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
  pasos?: PasoObjeto[];
  animacion?: {
    tipo: TipoAnimacionObjeto;
    inicioFrame?: number;
    finFrame?: number;
    deltaY?: number;
    deltaX?: number;
  };
}

export interface EventoSfx {
  sfx: string;
  tiempoSegundos?: number;
  progreso?: number;
  desdePalabra?: string;
  volumen?: number;
}

export interface FocoCamaraKeyframe {
  inicioProgreso?: number;
  finProgreso?: number;
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
  x: number;
  y: number;
  escala?: number;
  curva?: TipoCurvaMovimiento;
}

export type TipoPlanoCamara =
  | "general"
  | "plano_medio"
  | "primer_plano"
  | "sobre_hombro"
  | "detalle_mano";

export interface PlanoCamara {
  tipo: TipoPlanoCamara;
  x?: number;
  y?: number;
  zoom?: number;
  blurFondo?: number;
  hombroLado?: "izquierda" | "derecha";
  accionMano?:
    | "verter_acido"
    | "prensar_palanca"
    | "estirar_cadena"
    | "girar_valvula"
    | "tocar_esfera"
    | "apilar_bloques"
    | "medir_compas"
    | "tensar_cable_acero"
    | "bajar_interruptor"
    | "ajustar_telescopio";
  etiquetaInsert?: string;
  inicioProgreso?: number;
  finProgreso?: number;
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
}

export interface CotaVectorial {
  id?: string;
  origenX: number;
  origenY: number;
  destinoX: number;
  destinoY: number;
  valor: string;
  etiqueta?: string;
  color?: string;
  inicioProgreso?: number;
  finProgreso?: number;
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
}

export type TipoParticulaEscena =
  | "chispas_quimicas"
  | "gotas_acido"
  | "vapor_presion"
  | "eslabones_polimero"
  | "fragmentos_marfil"
  | "escombros_piedra"
  | "rafagas_viento"
  | "fotones_luz"
  | "polvo_estelar";

export interface EmisorParticulas {
  id?: string;
  tipo: TipoParticulaEscena;
  x: number;
  y: number;
  cantidad?: number;
  color?: string;
  inicioProgreso?: number;
  finProgreso?: number;
  inicioSegundos?: number;
  finSegundos?: number;
  desdePalabra?: string;
  hastaPalabra?: string;
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
  /** Efectos de cámara cinemática ('shake', 'punch', 'drift', 'pan_left', 'pan_right') */
  efectosCamara?: ("shake" | "punch" | "drift" | "pan_left" | "pan_right")[];
  /** Keyframes de foco de cámara */
  focoCamara?: FocoCamaraKeyframe[];
  /** Micro-planos cinematográficos */
  planos?: PlanoCamara[];
  /** Cotas vectoriales diegéticas */
  cotasVectoriales?: CotaVectorial[];
  /** Emisores de partículas físicas */
  emisoresParticulas?: EmisorParticulas[];
  /** Rayos de luz volumétricos */
  iluminacionVolumetrica?: boolean;
  /** Transición visual de entrada */
  transicion?: TipoTransicion;
  /** Archivo SFX sincronizado específico (ej. 'sfx/sfx_whoosh.wav') */
  sfx?: string;
  /** Nivel de volumen para el SFX de esta escena (0 a 1) */
  volumenSfx?: number;
  /** Eventos SFX disparados a mitad de escena */
  eventosSfx?: EventoSfx[];
  /** Palabras clave para destacar con jerarquía tipográfica */
  palabrasClave?: string[];
  /** Tipo de encuadre y composición narrativa */
  composicionVisual?: TipoComposicionVisual;
  /** Tipo de escenario ilustrado de fondo */
  escenario?: TipoEscenario;
  /** Escena coreografiada personalizada (ej. 'clotoide_escena_1') */
  escenaPersonalizada?: string;
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
