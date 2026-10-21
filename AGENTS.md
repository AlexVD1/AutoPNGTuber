# AGENTS.md — AutoPNGTuber (Generador de Shorts con Remotion + edge-tts)

Guía de arquitectura, flujo de trabajo y estructura de datos para agentes y desarrolladores que trabajen en este repositorio.

---

## 1. Flujo de Trabajo Completo (End-to-End)

Cada vez que se pida crear o actualizar un Short animado o estilo *"¿Sabías que...?"*, sigue estos pasos en orden:

1. **Definir el guion (`src/data/guion.json`)**:
   - Puede ser tan simple como `{ id, texto, icono, colorIcono, tituloVisual, poseId, prop }` o tan avanzado como una escena multi-personaje con `acciones` y `objetos`.
   - **Auto-Director Integrado**: Si la IA no especifica `acciones`, `composicionVisual` o `escenario`, el motor auto-dirige la puesta en escena (infiere el escenario temático, asigna encuadres dinámicos de cámara y dota al personaje de micro-movimiento procedural comunicativo y bamboleo de peso para que nunca quede congelado).
   - **Miles de Props Disponibles**: Además de los 213 props de biblioteca, la IA puede solicitar cualquier icono de `lucide-react` (ej. `"lucide:Brain"`, `"lucide:Coffee"`, `"Dna"`, `"Rocket"`) o insertar código SVG inline (`"svg:<path ...>"`).
2. **Generar voz y tiempos por palabra (`npm run tts` o `python scripts/generar_voz.py`)**:
   - Sintetiza los audios MP3 en `public/audios/escena_{id}.mp3`.
   - Inyecta automáticamente `duracionSegundos` (duración real + `0.25s`) y el arreglo `palabras` (`{ palabra, inicioMs, finMs }`) en `src/data/guion.json`.
3. **Previsualizar o Renderizar**:
   - Previsualización en vivo: `npm run dev` (`http://localhost:3000`).
   - Renderizar prueba aislada: `npx remotion render TestNarrativa out/test_narrativa.mp4 --port 3003`.
   - Renderizar Short completo (1080×1920, 30fps): `npm run render` (ejecuta `scripts/render_short.js`: nombra el video según el tema del guion, purga videos >48h en `/out` y lo copia a `H:\Mi unidad\ShortsMotionGraphics`).

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

### Sistema Universal de Props (Miles de posibilidades)

Cualquier campo `prop`, `props.derecha`, `props.izquierda`, `props.arriba` u `objeto.propId` acepta tres orígenes sin necesidad de tocar código:
1. **Catálogo nativo**: IDs del catálogo (`flashlight`, `laptop`, `beach_ball`, `magnifier`, `scale`, etc.).
2. **Cualquier icono de Lucide (+1,400 iconos)**: Prefijo `"lucide:<IconName>"` o nombre exacto (ej. `"lucide:Brain"`, `"lucide:Coffee"`, `"Dna"`, `"Rocket"`, `"Coins"`). El motor lo renderiza automáticamente como un sticker neo-brutalista circular con contorno negro de 5px.
3. **SVG inline personalizado**: Código SVG directo o con prefijo `"svg:"` (ej. `"svg:<circle cx='0' cy='0' r='20' fill='#FF0000'/>"`).

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
├── public/
│   ├── audios/                 # MP3 generados por scripts/generar_voz.py
│   └── poses/                  # 357 SVGs organizados + contact_sheet.html / .png
├── scripts/
│   ├── generar_voz.py          # TTS (edge-tts + mutagen) -> actualiza guion.json
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
│   │   ├── WordSubtitles.tsx   # Subtítulos neo-brutalistas sin empastes y con énfasis en cifras
│   │   ├── AnimatedIcon.tsx    # Ícono neo-brutalista animado con soporte de modo banner compacto
│   │   └── ShowcasePoses.tsx   # Composición HojaDeContacto
│   ├── data/
│   │   ├── guion.json          # Guion activo del Short
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

- `npm run tts` — Genera los audios MP3 y actualiza tiempos en `src/data/guion.json`.
- `npm run poses:build` — Regenera SVGs, `src/data/poses.json` y `public/poses/contact_sheet.html`.
- `npm run dev` — Inicia Remotion Studio en `http://localhost:3000`.
- `npm run render` — Renderiza el Short asignándole nombre temático según el guion, purga videos antiguos (>48h) en `/out` y lo envía a `H:\Mi unidad\ShortsMotionGraphics`.
- `npx remotion render TestNarrativa out/test_narrativa.mp4 --port 3003` — Renderiza la escena de prueba narrativa.
