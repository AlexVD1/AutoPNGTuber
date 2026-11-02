# AGENTS.md — AutoPNGTuber (Generador de Shorts con Remotion + edge-tts)

Guía de arquitectura, flujo de trabajo y estructura de datos para agentes y desarrolladores que trabajen en este repositorio.

---

## 1. Flujo de Trabajo Completo (End-to-End)

> 🚨 **REGLA DE ORO ANTES DE CREAR UN GUION**: Siempre que el usuario pida un nuevo video o una idea de historia, el agente DEBE leer primero `src/data/historial_temas.json`, revisar los temas y ganchos existentes, y asegurarse de proponer un tema, enfoque científico o fenómeno completamente distinto a los ya registrados.
>
> ⏱️ **REGLA DE DURACIÓN DEL GUION (configurable por video)**:
> - Cada guion declara `meta.duracionObjetivo: [min, max]` en segundos. Rangos de referencia: **35-45 s** (corto), **60-75 s** (medio), **80-95 s** (largo). Sin el campo, el rango por defecto es **62-110 s**.
> - TikTok solo paga videos de **más de 60 s**; la duración estándar se decide con los datos del experimento A/B (`docs/CHECKLIST_PUBLICACION.md`, `docs/SEGUIMIENTO.csv`).
> - **Estructura recomendada**: gancho en 1-2 s, dato clave entre 5 y 10 s, giro a la mitad y cierre que enlaza con el inicio. Escenas de 5 a 8 segundos con curiosidades y detalles científicos.
> - `npm run validar` (esquema zod + catálogos + tiempos + lint de ritmo) y `npm run qa` (ffprobe/ffmpeg sobre el MP4) usan ese mismo rango. `npm run render` ejecuta ambos y falla con un mensaje claro.
>
> 🎨 **REGLA DE ESCENARIOS, PROPS Y ANIMACIÓN DINÁMICA (NO VACÍOS)**:
> - **Expansión Dinámica de Escenarios (`NarrativeStage.tsx`)**: Si la narración requiere un ambiente no existente (ej. `abismo_oceanico`, `interior_cuerpo`, `volcan_activo`), debe programarse en SVG/CSS con: atmósfera rica en color/gradiente, 3 planos de profundidad/parallax y partículas vivas con `Math.sin()`.
> - **Contraste del Stickman (`Stickman.tsx`)**: En escenarios oscuros (`ESCENARIOS_OSCUROS`), el Stickman recibe automáticamente un halo blanco nítido (`drop-shadow`) para garantizar visibilidad total.
> - **Cero Encuadres Vacíos (`Scene.tsx`)**: Prohibido colocar al Stickman a un lado señalando al vacío. Cada escena debe incluir escenario y un prop protagónico o interactivo.
> - **Props Ilustrados con Volumen y Animación (`propsLibrary.ts` / `SceneObject.tsx`)**: Diseñar props neo-brutalistas a todo color con `animatedSvg(frame)` permanente para conceptos científicos clave.
> - 🚫 **PROHIBICIÓN TOTAL DE LUCIDE (DISEÑO PROPIO OBLIGATORIO)**: Queda terminantemente prohibido usar íconos de `lucide-react` o prefijos `"lucide:"` en props, objetos o accesorios. Al usuario NO le gusta la estética genérica de Lucide. Si una escena o narración requiere un objeto, prop, herramienta o símbolo visual que no existe en el catálogo, el agente DEBE diseñar e ilustrar props vectoriales propios en SVG/CSS dentro de `src/stickman/propsLibrary.ts` con estética neo-brutalista (colores vibrantes, contornos negros de 4-6px, volumen y detalle) y ejecutar `npm run poses:build`, o bien usar SVG inline personalizado (`"svg:<...>"`). Jamás sustituir con Lucide.
> - **Generación y Expansión Dinámica de SFX (`public/sfx/`)**: Al igual que con los props SVG, si una escena requiere un efecto de sonido puntual o narrativo que no existe en la biblioteca (`whoosh`, `impact`, `dramatic_hit`, `tension_riser`, `transition`, `pop`), el agente DEBE generarlo/sintetizarlo en formato WAV en `public/sfx/<nombre>.wav` (usando `python scripts/generar_sfx.py <nombre> <tipo>` o síntesis procedural en Python con `wave`/`numpy`), en lugar de omitirlo o usar un efecto inadecuado. Asignarlo a `"sfx": "sfx/<nombre>.wav"` con su respectivo `volumenSfx`.
> - **Movimiento Físico continuo y Rig Esquelético IK/FK de 2 Huesos (`skeletalRig.ts`)**: El Stickman interpola continuamente hombros, codos, muñecas, rodillas y tobillos entre poses (`prevPoseId` -> `poseId`), con cabeza 2.5D (`lookOffset`), torso volumétrico con luz de recorte (`colorRim`), modo holograma (`esHolograma` + `trayectoriaSuelo`) y ciclos procedurales suaves (`"caminar"`, `"correr"`, `"manipular"`, `"esfuerzo"`, `"agachar_recoger"`).
> - **Anclaje Léxico por Palabra (`desdePalabra` / `hastaPalabra` en `actionSequences.ts`)**: Pasos de personaje (`personajes[].acciones[].pasos`), pasos de objeto (`objetos[].pasos`), micro-planos de cámara (`planos`), cotas vectoriales (`cotasVectoriales`), emisores de partículas (`emisoresParticulas`) y SFX a mitad de escena (`eventosSfx`) se sincronizan con las marcas de tiempo palabra por palabra de Faster-Whisper.
> - **Props Multi-Estado Reactivos y Vibración Suave (`SceneObject.tsx` + `propsLibrary.ts`)**: Los objetos soportan `pasos[]` con `estado` y `animatedSvg(frame, stepProgress, currentState)`. A 30 FPS toda vibración u oscilación debe usar frecuencias suaves (`Math.sin(f * 0.12)` a `Math.sin(f * 0.30)`) y amplitudes moderadas (`1.0` a `2.5 px`), con `zIndex >= 26` siempre al frente.
> - **Micro-Planos (`planos`), DoF (`blurFondo`), Cotas Vectoriales (`DiegeticCallout.tsx`) y Partículas (`ParticleEmitter.tsx`)**: Soporta cortes de cámara (`"general"`, `"plano_medio"`, `"primer_plano"`, `"sobre_hombro"`, `"detalle_mano"` con `accionMano`), flechas/etiquetas diegéticas y emisores de partículas balísticas adaptados al lienzo vertical `1080x1920`.
> - **Normalización Fonética Automática de Cifras (`scripts/normalizador_numeros.py`)**: `generar_voz.py` expande automáticamente números, años, decimales y unidades técnicas a palabras en español antes de sintetizar con Chatterbox TTS, evitando tropiezos de dicción.
> - **Duración de Monetización**: se valida contra `meta.duracionObjetivo` (por defecto 62-110 s). `scripts/generar_voz.py` y `scripts/registrar_historia.py` emiten alerta si el total queda fuera del rango.
> - **Pipeline de Audio Infalible y Alineación Quirúrgica (`v4_nw_precision_align`)**:
>   - Gating estricto en `scripts/render_short.js`: Compara automáticamente cada escena contra `.tts_cache.json` y `public/audios/`; si hay desajuste, falta un audio o el pipeline es obsoleto, ejecuta `python scripts/generar_voz.py` antes de renderizar.
>   - Fragmentación por cláusulas completas con puntuación de cierre guiada, evitando cortes sintácticos y truncamientos tempranos de EOS.
>   - Síntesis Chatterbox calibrada con `repetition_penalty=1.2` (evita que el detector de repetición fuerce EOS en sílabas similares).
>   - Poda segura de colas residuales con margen acústico de 0.38s y fundido de 60ms (jamás corta la última sílaba o decaimiento natural de la palabra).
>   - Alineación global Needleman-Wunsch (`align_words_nw`) con prompt de dominio Whisper (`initial_prompt=texto`): sincronización exacta palabra por palabra, inmune al desfase en cascada por palabras omitidas o fusionadas.
>   - Validación activa de pronunciación real con reintentos adaptativos si la similitud Whisper cae por debajo del 70%.
> - **Subtítulos Estables y en zona segura**: `WordSubtitles.tsx` mantiene progresión monótona sin parpadeos; bloques de hasta 3 palabras/20 caracteres, franja y≈1400-1600 y margen derecho +120 px (la interfaz de TikTok/Shorts tapa el resto). `generar_voz.py` valida que `palabras` coincida con el texto y que `inicioMs` sea creciente.
> - **Gancho en el frame 0**: en la escena 1, `Scene.tsx` superpone `tituloVisual` en grande durante los primeros 1.5 s.
> - **Hashtags Optimizados**: `scripts/exportar_metadata.js` genera entre 6 y 10 hashtags limpios sin números ni preposiciones.
> - **Metadata de publicación**: título ≤ 60 caracteres con rotación de plantillas, `titulo_corto`, descripción ≤ 500 caracteres (gancho + datos + CTA + `fuentes` + hashtags), `transcript` con la narración completa, duración medida con ffprobe, `storyId` estable (hash del slug), categoría Education / Science & Technology, y campos de seguimiento (`playlist`, `idioma_alterno`, `estado`, `fecha_publicacion`) que se conservan al re-exportar. Campos opcionales en `meta` del guion: `titulo`, `titulo_corto`, `gancho`, `fuentes`, `genero`, `playlist`, `idioma_alterno`.
> - **Licencias**: antes de monetizar, `docs/LICENCIAS.md` no debe tener ⚠️ en voz, música ni SFX. El destino de copia (Drive) se define en `.env` (`DESTINO_DIR`).

Cada vez que se pida crear o actualizar un Short animado o estilo *"¿Sabías que...?"*, sigue estos pasos en orden:

1. **Consultar historial y definir el guion (`src/data/historial_temas.json` y `src/data/guion.json`)**:
   - **Obligatorio**: Inspeccionar `src/data/historial_temas.json` para garantizar que la nueva propuesta no coincida con historias previas (>65% similitud).
   - Puede ser un arreglo directo `[...]` o con metadatos `{ meta: { id, slug, temaResumen }, escenas: [...] }`.
   - Puede ser tan simple como `{ id, texto, icono, colorIcono, tituloVisual, poseId, prop }` o tan avanzado como una escena multi-personaje con `acciones` y `objetos`.
   - **Auto-Director Integrado**: Si la IA no especifica `acciones`, `composicionVisual` o `escenario`, el motor auto-dirige la puesta en escena (infiere el escenario temático, asigna encuadres dinámicos de cámara y dota al personaje de micro-movimiento procedural comunicativo y bamboleo de peso para que nunca quede congelado).
   - **Catálogo de Props Ilustrados Propios (Prohibido Lucide)**: Con más de 227 props nativos de biblioteca, el agente DEBE diseñar props vectoriales propios en `src/stickman/propsLibrary.ts` o insertar código SVG inline personalizado (`"svg:<path ...>"`), evitando por completo los íconos genéricos de `lucide-react` (prohibidos por regla visual).
2. **Generar voz, alinear palabras y registrar historial (`npm run tts` o `python scripts/generar_voz.py`)**:
   - Sintetiza los audios MP3 en `public/audios/escena_{id}.mp3`.
   - Inyecta automáticamente `duracionSegundos` (duración real + `0.25s`) y el arreglo `palabras` (`{ palabra, inicioMs, finMs }`) en `src/data/guion.json`.
   - **Historial y Respaldo Automático**: Al concluir, ejecuta `scripts/registrar_historia.py`:
     - Evalúa mediante `difflib.SequenceMatcher` si el gancho o guion supera el 65% de similitud con un registro previo diferente. Si detecta duplicado, emite: `[ALERTA DUPLICADO] Este tema ya se trató en el video {id}`.
     - Guarda una copia exacta en `archivo_videos/{fecha}_{id_o_slug}.json`.
     - Registra o actualiza la entrada en `src/data/historial_temas.json` con `id`, `fecha`, `gancho`, `palabrasClave`, `archivoRespaldo` y `textoCompleto`.
3. **Previsualizar o Renderizar**:
   - Previsualización en vivo: `npm run dev` (`http://localhost:3000`).
   - Renderizar prueba aislada: `npx remotion render TestNarrativa out/test_narrativa.mp4 --port 3003`.
   - Renderizar Short completo (1080×1920, 30fps): `npm run render` (ejecuta `scripts/render_short.js`: nombra el video según el tema del guion, purga videos >48h en `/out`, genera la metadata `.json` para publicación y copia ambos archivos a `H:\Mi unidad\ShortsMotionGraphics`).
4. **Exportar Metadata para Publicación (`npm run metadata` o `node scripts/exportar_metadata.js`)**:
   - Genera el archivo `${slug}.json` con el mismo nombre base que el video `.mp4`, conteniendo id, título, sinopsis/descripción, hashtags virales, género, métricas de video y voz, listo para automatizaciones de publicación (YouTube, TikTok, Instagram). Se exporta automáticamente al renderizar y también puede ejecutarse de forma aislada.

> **Nota sobre la biblioteca de poses**: Si agregas nuevas poses, expresiones o props en `src/stickman/`, ejecuta `npm run poses:build` (`node scripts/generar_biblioteca_poses.mjs`) para regenerar los archivos `.svg` en `public/poses/`, actualizar el catálogo `src/data/poses.json` y la hoja de contacto `public/poses/contact_sheet.html`.

---

## 2. Estructura de Petición / Esquema de `src/data/guion.json`

Cada elemento del arreglo en `src/data/guion.json` sigue la interfaz `EscenaGuion` (`src/types.ts`). Soporta tanto el modo clásico (personaje único) como el **sistema narrativo multi-personaje con acciones**:

```json
[
  {
    "id": 2,
    "texto": "Imagínate ver a tu amigo caminando dormido por la casa, con los ojos abiertos, ¡pero completamente inconsciente!",
    "icono": "Eye",
    "colorIcono": "#38BDF8",
    "tituloVisual": "CAMINANDO DORMIDO",
    "composicionVisual": "plano_general",
    "escenario": "habitacion_noche",
    "layout": "narrativo",
    "transicion": "whip_right",
    "efectosCamara": ["drift"],
    "sfx": "sfx/sfx_whoosh.wav",
    "volumenSfx": 0.2,
    "palabrasClave": ["caminando", "dormido", "inconsciente"],
    "personajes": [
      {
        "id": "sonambulo",
        "nombre": "Sonámbulo",
        "posicion": { "x": -260, "y": 70 },
        "escala": 1.0,
        "orientacion": "derecha",
        "prop": "flashlight",
        "acciones": [
          {
            "tipo": "caminar_hacia",
            "desdeX": -260,
            "haciaX": 160,
            "desdeY": 70,
            "haciaY": 70
          }
        ],
        "habla": false,
        "capaZ": 10
      },
      {
        "id": "narrador",
        "nombre": "Narrador",
        "posicion": { "x": -280, "y": 70 },
        "escala": 1.0,
        "orientacion": "derecha",
        "acciones": [
          {
            "tipo": "personalizada",
            "pasos": [
              {
                "inicioProgreso": 0,
                "finProgreso": 0.45,
                "poseId": "scratching_head",
                "expresion": "confused",
                "posicion": { "x": -280, "y": 70 },
                "curva": "suave",
                "procedural": "estatico"
              },
              {
                "inicioProgreso": 0.45,
                "finProgreso": 1.0,
                "poseId": "covering_mouth",
                "expresion": "surprised",
                "posicion": { "x": -240, "y": 70 },
                "curva": "suave",
                "procedural": "estatico"
              }
            ]
          }
        ],
        "habla": true,
        "capaZ": 15
      }
    ]
  }
]
```

### Campos de Entrada (definidos al crear el guion)

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `id` | `number` | Sí | Número secuencial de escena (`1, 2, 3...`). Define el archivo `public/audios/escena_{id}.mp3`. |
| `texto` | `string` | Sí | Texto narrado y mostrado en los subtítulos. |
| `icono` | `string` | Sí | Nombre exacto (PascalCase) de cualquier ícono de `lucide-react`. |
| `colorIcono` | `string` | Sí | Color HEX para el ícono superior (ej. `"#F59E0B"`). |
| `tituloVisual` | `string` | Sí | Texto corto en mayúsculas debajo del ícono superior (2–4 palabras). |
| `composicionVisual` | `string` | Opcional | Encuadre visual: `"minimalista"`, `"escenario_ilustrado"`, `"primer_plano"` (zoom a 142% con viñeta para reacciones), `"plano_general"` (escala 95% para contexto espacial), `"cifras_concepto"`. |
| `escenario` | `string` | Opcional | Fondo ilustrado: `"habitacion_noche"` (piso de madera, ventana con luna/estrellas, cama, reloj), `"laboratorio"`, `"vacio"` (minimalista con patrón). |
| `personajes` | `array` | Opcional | Lista de personajes actuando en la escena (`PersonajeEscena[]`). Si se define, toma prioridad sobre la pose raíz. |
| `objetos` | `array` | Opcional | Lista de props u objetos en el escenario (`ObjetoEscena[]`) con posición, escala y animación física (`caer`, `flotar`, `vibrar`, `pulso`). |
| `poseId` | `string` | Opcional | Modo simple: ID de pose corporal o compuesta para personaje único. |
| `expresion` | `string` | Opcional | Modo simple: Sobrescribe la expresión facial (`24` disponibles). |
| `prop` / `props` | `string` / `object` | Opcional | Modo simple: Props en mano o ranuras `{ derecha, izquierda, arriba, sombrero, cara, cuello, cintura }`. |
| `efectoAmbiente` | `string` | Opcional | Overlay decorativo: `"confeti"`, `"nieve"`, `"destellos"`, `"fuegos_artificiales"`, etc. |
| `orientacion` | `string` | Opcional | `"derecha"` (por defecto) o `"izquierda"`. |
| `escala` | `number` | Opcional | Multiplicador de escala (`1` por defecto). |
| `posicion` | `{x, y}` | Opcional | Desplazamiento en píxeles relativo al centro del canvas. |
| `animacionEntrada` | `string` | Opcional | Entrada: `"rebote"`, `"zoom"`, `"deslizar"`, `"ninguna"`. |
| `layout` | `string` | Opcional | `"clasico"` (tarjeta superior grande), `"narrativo"` (banner compacto superior + espacio central amplio) o `"compacto"`. |
| `elementosNarrativos` | `array` | Opcional | Gráficos vectoriales: `speed_counter`, `speed_lines`, `flying_debris`, `giant_waves`, `shockwave_burst`, `orbital_peace`, `danger_vignette`. |
| `efectosCamara` | `array` | Opcional | Modificadores cinemáticos: `["shake"]`, `["punch"]`, `["drift"]` (micro-zoom continuo). |
| `transicion` | `string` | Opcional | Entrada hacia la escena: `"zoom_in"`, `"whip_right"`, `"whip_left"`, `"flash"`, `"corte"`. |
| `sfx` | `string` | Opcional | Ruta relativa a `public/` de audio de impacto (`sfx/sfx_dramatic_hit.wav`, `sfx/sfx_impact.wav`, `sfx/sfx_whoosh.wav`, etc.). |
| `volumenSfx` | `number` | Opcional | Volumen del SFX (`0.15` a `0.30`, subordinado a la voz). |
| `palabrasClave` | `array` | Opcional | Palabras clave destacadas en amarillo con énfasis tipográfico dinámico. |

### Sub-esquema: Acciones de Personaje (`acciones`)

Cada personaje en `personajes` puede tener una lista de `acciones` (`AccionPersonaje`):
- **Tipos de acción compuesta predefinidos**:
  - `"caminar_hacia"`: Desplazamiento con ciclo de paso (bobbing en Y e inclinación rítmica) y frenado suave hacia `haciaX`.
  - `"acercarse_y_tocar"`: Aproximación, extensión de brazo de contacto e impulso en el frame objetivo.
  - `"despertar_asustado"` / `"sorpresa_y_retroceso"`: Estado previo -> estallido de sobresalto (`shock_explosion`), salto y retroceso con temblor -> recuperación desorientada (`backing_away_scared`).
  - `"sonambulo_avanzar"`: Caminata pausada con brazos al frente, linterna y oscilación hipnótica.
  - `"guiar_amigo"`: Acompañamiento armónico lado a lado hacia un objetivo.
  - `"mirar_y_reaccionar"`: Giro de cabeza y transición emocional de confusión o eureka.
  - `"tropezar_y_reaccionar"`: Pérdida de equilibrio hacia adelante y recuperación.
- **Acción personalizada por pasos (`pasos`)**:
  - `{ inicioProgreso, finProgreso, poseId, expresion, posicion, curva, procedural }`
  - `curva`: `"lineal"`, `"suave"`, `"anticipacion"`, `"rebote"`, `"impacto"`.
  - `procedural`: `"caminar"` (bobbing sinusoidal), `"temblar"` (vibración de alta frecuencia en decaimiento), `"recoil"`, `"estatico"`.

### Campos Autogenerados (inyectados por `scripts/generar_voz.py`)

- `duracionSegundos` (`number`): Duración real del MP3 medida con `mutagen` + `0.25s` de pausa. `calculateMetadata` en `src/Root.tsx` suma este campo para ajustar la duración total del video.
- `palabras` (`Array<{ palabra: string, inicioMs: number, finMs: number }>`): Eventos `WordBoundary` de `edge-tts` usados por `src/components/Subtitles.tsx` para mostrar bloques de 2 a 3 palabras en mayúsculas y resaltar en amarillo (`#FFE600`) la palabra activa.

### Sistema de Props Ilustrados Propios (Prohibición de Lucide)

Queda estrictamente prohibido usar íconos de `lucide-react` o prefijos `"lucide:"` para props u objetos. Todo campo `prop`, `props.derecha`, `props.izquierda`, `props.arriba` u `objeto.propId` debe provenir de:
1. **Catálogo nativo ilustrado**: IDs de la biblioteca (`propsLibrary.ts` / `poses.json`) con más de 227 props diseñados a mano con volumen, animación física y estética neo-brutalista.
2. **Diseño e ilustración de props nuevos**: Si el guion requiere un objeto que no existe (ej. herramientas científicas, equipo de expedición, recipientes específicos, reliquias), el agente DEBE programarlo en SVG dentro de `src/stickman/propsLibrary.ts` y regenerar con `npm run poses:build`.
3. **SVG inline personalizado**: Código SVG directo o con prefijo `"svg:"` (ej. `"svg:<g><circle cx='0' cy='0' r='20' fill='#FF0000' stroke='#000000' stroke-width='4'/></g>"`).

### Sistema de SFX Dinámico y Generación Procedural

Al igual que con los props SVG, los efectos sonoros deben crearse cuando la historia lo amerite:
1. **Biblioteca base**: `sfx/sfx_whoosh.wav`, `sfx/sfx_impact.wav`, `sfx/sfx_dramatic_hit.wav`, `sfx/sfx_tension_riser.wav`, `sfx/sfx_transition.wav`, `sfx/pop.mp3`.
2. **Generación procedural bajo demanda**: Si la escena requiere un efecto no existente (ej. láser espacial, latido de corazón, alarma/alerta, glitch digital, destello o impacto sordo), el agente debe generar el archivo WAV en `public/sfx/<nombre>.wav` ejecutando `python scripts/generar_sfx.py <archivo> <tipo> [duracion]` (presets: `laser`, `heartbeat`, `glitch`, `alarm`, `impact`, `sparkle`, `click`) o con un script procedural Python rápido (`wave`/`numpy`).
3. **Calibración de volumen**: Definir siempre `volumenSfx` en la escena (habitualmente entre `0.18` y `0.28`, subordinado a la voz).


### Desacoplamiento de Cámara y HUD (Subtítulos siempre legibles)

En `src/components/Scene.tsx`, el `CameraRig` opera exclusivamente sobre el mundo cinemático (fondo, escenario, props de escena y personajes). Los elementos de interfaz o HUD (Rótulo superior `AnimatedIcon` y Subtítulos `WordSubtitles`) se renderizan en una capa fija superior, garantizando que nunca se corten ni salgan de pantalla durante zooms dramáticos de primer plano (`primer_plano`) o sacudidas sísmicas (`shake`).

---

## 3. Catálogo del Stickman (`src/data/poses.json` — 357 recursos)

Para consultar o filtrar recursos programáticamente usa `src/stickman/catalog.ts` (`obtenerRecursoPorId`, `buscarRecursos({ categoria, subcategoria, festividad, temporada, pais, emocion, accion, prop, tema })`) o abre `public/poses/contact_sheet.html`.

### Resumen de IDs más usados

- **Expresiones (`expresion`)**:
  `neutral`, `smile_soft`, `smile_wide`, `laugh`, `talking`, `talking_enthusiastic`, `thinking`, `analytical`, `confused`, `eureka`, `surprised`, `shocked`, `scared`, `worried`, `sad`, `crying`, `angry`, `frustrated`, `exhausted`, `bored`, `embarrassed`, `proud`, `skeptical`, `shushing`.
- **Poses corporales (`poseId`)**:
  - *Base/Transición*: `standing_relaxed`, `standing_confident`, `walking`, `running`, `jumping`, `sitting`, `crouching`, `kneeling`, `leaning_forward`, `looking_up_pose`, `looking_down_pose`, `pointing_up`, `pointing_right`, `pointing_left`, `pointing_down`, `waving_hello`, `waving_goodbye`, `arms_crossed`, `shrugging`, `asking_question`, `nodding_yes`, `shaking_no`.
  - *Enseñanza/Acción*: `explaining_pointing_up`, `explaining_both_hands`, `presenting_object`, `showing_both_hands`, `comparing_two_objects`, `raising_one_finger`, `counting_fingers`, `holding_board`, `warning_danger`, `investigating_magnifier`, `taking_notes`, `pushing`, `pulling`, `lifting_heavy`, `holding_both_hands`, `throwing_object`, `tripping_falling`, `protecting_shielding`, `running_escape`, `listening_attentively`, `shushing_silence`, `pointing_at_viewer`.
  - *Emociones*: `thinking_chin_hand`, `scratching_head`, `eureka_idea`, `doubting_open_hands`, `surprised_hands_up`, `backing_away_scared`, `trembling_fear`, `covering_eyes`, `covering_mouth`, `shock_explosion`, `hiding_scared`, `celebrating_arms_up`, `jumping_joy`, `clapping`, `thumbs_up_approval`, `laughing_belly`, `sad_slumped`, `crying_pose`, `angry_fists`, `frustrated_head_grab`, `exhausted_slouch`, `facepalm`, `bored_waiting`, `embarrassed_shy`.
- **Poses compuestas listas (`poseId`)**:
  - *Generales*: `thinking_lightbulb`, `explaining_book`, `explaining_chalkboard`, `surprised_exclamation`, `scared_flashlight`, `researching_magnifier`, `celebrating_trophy`, `confused_question`, `analyzing_flask`, `exploring_map`, `explaining_corn`, `surprised_popcorn`, `working_laptop`, `discovering_lightbulb`, `worried_clock`, `proud_medal`, `embarrassed_facepalm`, `warning_stop`, `explaining_water_drop`, `explaining_flame_heat`, `astronomy_telescope`, `physics_atom`, `tech_ai_robot`, `tech_smartphone`, `history_warrior`, `history_scroll`, `carrying_heavy_box`, `coffee_break`, `announcing_megaphone`, `comparing_scale`, `approving_check`, `taking_study_notes`.
  - *Festivas*: `festive_celebrating_confetti`, `festive_holding_cake`, `festive_opening_gift`, `festive_party_hat_balloons`, `festive_santa_claus`, `festive_decorating_tree`, `festive_holding_pumpkin`, `festive_halloween_costume`, `festive_placing_papel_picado`, `festive_holding_cempasuchil`, `festive_new_year_toast`, `festive_holding_heart`, `festive_giving_rose`, `festive_easter_egg_hunt`, `festive_celebrating_trophy`, `festive_graduation_cap`, `festive_vacation_suitcase`, `festive_taking_photo`, `festive_throwing_confetti`, `festive_raining_gifts`.

---

## 4. Estructura del Proyecto y Comandos Rápidos

```text
├── archivo_videos/             # Copias completas de guiones generados ({fecha}_{id}.json)
├── public/
│   ├── audios/                 # MP3 generados por scripts/generar_voz.py
│   └── poses/                  # 357 SVGs organizados + contact_sheet.html / .png
├── scripts/
│   ├── exportar_metadata.js    # Genera y exporta la metadata JSON para publicación en redes
│   ├── generar_sfx.py          # Síntesis procedural de SFX (laser, alarm, glitch, heartbeat, etc.)
│   ├── generar_voz.py          # TTS (edge-tts + mutagen) -> actualiza guion.json y llama historial
│   ├── registrar_historia.py   # Respaldo, detección de duplicados (SequenceMatcher) e historial
│   └── generar_biblioteca_poses.mjs # Compila SVGs, poses.json y contact_sheet.html
├── src/
│   ├── components/
│   │   ├── Scene.tsx           # Coordinador de escena (multi-personaje, props, fondos y layouts)
│   │   ├── CameraRig.tsx       # Rig cinemático de cámara (push-in, trauma shake, punch, transiciones)
│   │   ├── NarrativeStage.tsx  # Escenarios ilustrados (habitación noche, laboratorio, viñetas)
│   │   ├── NarrativeElements.tsx # Motor de elementos vectoriales narrativos (velocímetro, olas, escombros)
│   │   ├── SceneObject.tsx     # Props y objetos interactivos en el escenario
│   │   ├── Stickman.tsx        # Renderizador determinista SVG/PNG + parpadeo, lip-sync y gesticulación
│   │   ├── TestNarrativaScene.tsx # Composición de prueba aislada de interacción y reacción
│   │   ├── WordSubtitles.tsx   # Subtítulos neo-brutalistas (zona segura y≈1400-1600, bloques ≤3 palabras/20 car.)
│   │   ├── AnimatedIcon.tsx    # Ícono neo-brutalista animado con soporte de modo banner compacto
│   │   └── ShowcasePoses.tsx   # Composición HojaDeContacto
│   ├── data/
│   │   ├── guion.json          # Guion activo del Short
│   │   ├── historial_temas.json # Registro histórico de historias creadas y ganchos
│   │   └── poses.json          # Catálogo validado de poses, expresiones y props
│   └── stickman/
│       ├── actionSequences.ts  # Motor de secuencias de acciones, interpolaciones y procedimentales
│       ├── expressions.ts      # 24 expresiones faciales
│       ├── bodyPoses.ts        # 68 poses corporales + anclajes de manos/cabeza
│       ├── propsLibrary.ts     # 90 props generales (ciencia, tecnología, historia, etc.)
│       ├── festiveLibrary.ts   # 123 props festivos, efectos de ambiente y 20 compuestas festivas
│       ├── composites.ts       # Ensamblador SVG y respaldo automático
│       └── catalog.ts          # Buscador por emoción, acción, festividad, país y etiquetas
```

### Comandos

- `npm run sfx -- <archivo> <tipo> [duracion]` — Genera proceduralmente un efecto de sonido WAV en `public/sfx/`.
- `npm run tts` — Genera los audios MP3, actualiza tiempos en `src/data/guion.json` y ejecuta el respaldo/historial.
- `npm run historial` — Registra y respalda manualmente el guion actual en `src/data/historial_temas.json` y `archivo_videos/`.
- `npm run poses:build` — Regenera SVGs, `src/data/poses.json` y `public/poses/contact_sheet.html`.
- `npm run dev` — Inicia Remotion Studio en `http://localhost:3000`.
- `npm run metadata` — Genera el archivo JSON de metadata enriquecida para publicación en redes (se guarda en `out/` y se copia a `DESTINO_DIR` del `.env`).
- `npm run validar` — Valida esquema zod de `guion.json` (poses, expresiones, props, escenarios, composiciones, tiempos en orden, duración) y avisa de ritmo visual.
- `npm run qa [-- ruta.mp4]` — ffprobe/ffmpeg: duración, 1080×1920, 30 fps, tamaño ≤100MB, loudness ≈ -14 LUFS y silencios > 1 s.
- `npm run render` — Renderiza el Short con CRF 22, validación previa del guion (`validar`) y QA posterior (`qa`), nombra según el tema, purga videos y metadata antigua (>48h) en `/out`, exporta la metadata `.json` y envía ambos archivos a `DESTINO_DIR`.
- `npm run render:all` — Ejecuta `npm run tts` seguido de `npm run render`.
- `npx remotion render TestNarrativa out/test_narrativa.mp4 --port 3003` — Renderiza la escena de prueba narrativa.
