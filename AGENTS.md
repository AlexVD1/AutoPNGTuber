# AGENTS.md — AutoPNGTuber (Generador de Shorts con Remotion + edge-tts)

Guía de arquitectura, flujo de trabajo y estructura de datos para agentes y desarrolladores que trabajen en este repositorio.

---

## 1. Flujo de Trabajo Completo (End-to-End)

Cada vez que se pida crear o actualizar un Short estilo *"¿Sabías que...?"*, sigue estos pasos en orden:

1. **Definir el guion (`src/data/guion.json`)**:
   - Escribe el arreglo de escenas con `id`, `texto`, `icono` (nombre de ícono en `lucide-react`), `colorIcono`, `tituloVisual` y la configuración del Stickman (`poseId`, `expresion`, `props`, `efectoAmbiente`, etc.).
2. **Generar voz y tiempos por palabra (`npm run tts` o `python scripts/generar_voz.py`)**:
   - Genera `public/audios/escena_{id}.mp3` con `edge-tts` (`es-MX-JorgeNeural`, `rate='+10%'`, `boundary='WordBoundary'`).
   - Mide la duración real con `mutagen` (`+0.25s` de pausa) e inyecta automáticamente `duracionSegundos` y el arreglo `palabras` (`{ palabra, inicioMs, finMs }`) en `src/data/guion.json`.
3. **Previsualizar o Renderizar**:
   - Previsualización en vivo: `npm run dev` (`http://localhost:3000`).
   - Renderizar MP4 final (1080×1920, 30fps): `npm run render` (genera `out/short.mp4` usando el puerto `3002` para no colisionar con Remotion Studio).

> **Nota sobre la biblioteca de poses**: Si agregas nuevas poses, expresiones o props en `src/stickman/`, ejecuta `npm run poses:build` (`node scripts/generar_biblioteca_poses.mjs`) para regenerar los archivos `.svg` en `public/poses/`, actualizar el catálogo `src/data/poses.json` y la hoja de contacto `public/poses/contact_sheet.html`.

---

## 2. Estructura de Petición / Esquema de `src/data/guion.json`

Cada elemento del arreglo en `src/data/guion.json` sigue la interfaz `EscenaGuion` (`src/types.ts`):

```json
[
  {
    "id": 1,
    "texto": "¿Sabías por qué el maíz explota al hacerse palomita?",
    "icono": "HelpCircle",
    "colorIcono": "#F59E0B",
    "tituloVisual": "¿POR QUÉ EXPLOTA?",
    "pose": "pensando",
    "poseId": "explaining_corn",
    "expresion": "thinking",
    "props": {
      "derecha": "corn",
      "izquierda": "water_drop",
      "arriba": "question_mark",
      "sombrero": "party_hat",
      "cara": "sunglasses",
      "cuello": "scarf_gloves",
      "cintura": "swim_ring"
    },
    "efectoAmbiente": "confeti",
    "orientacion": "derecha",
    "escala": 1,
    "posicion": { "x": 0, "y": 0 },
    "animacionEntrada": "rebote"
  }
]
```

### Campos de Entrada (definidos al crear el guion)

| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :---: | :--- |
| `id` | `number` | Sí | Número secuencial de escena (`1, 2, 3...`). Define el archivo `public/audios/escena_{id}.mp3`. |
| `texto` | `string` | Sí | Texto narrado por `edge-tts` y mostrado en los subtítulos. |
| `icono` | `string` | Sí | Nombre exacto (PascalCase) de cualquier ícono de `lucide-react` (ej. `HelpCircle`, `Droplets`, `Flame`, `Zap`, `Sparkles`, `Atom`, `Cpu`). |
| `colorIcono` | `string` | Sí | Color HEX para el ícono superior (ej. `"#F59E0B"`). |
| `tituloVisual` | `string` | Sí | Texto corto en mayúsculas debajo del ícono superior (2–4 palabras). |
| `pose` | `string` | Opcional | Compatible con las 4 poses clásicas (`"normal"`, `"pensando"`, `"sorprendido"`, `"explicando"`) o cualquier ID del catálogo. |
| `poseId` | `string` | Opcional | ID de pose corporal (`68` disponibles) o pose compuesta (`52` disponibles) en `src/data/poses.json`. Tiene prioridad sobre `pose`. |
| `expresion` | `string` | Opcional | Sobrescribe la expresión facial de la pose (`24` disponibles en `src/stickman/expressions.ts`). |
| `prop` | `string` | Opcional | Atajo para colocar un prop en la mano derecha. |
| `props` | `object` | Opcional | Ranuras independientes: `{ derecha, izquierda, arriba, sombrero, cara, cuello, cintura }`. |
| `efectoAmbiente` | `string` | Opcional | Overlay decorativo sin alterar la pose: `"confeti"`, `"serpentinas"`, `"nieve"`, `"destellos"`, `"fuegos_artificiales"`, `"lluvia_regalos"`, `"papel_picado"`, `"murcielagos"`. |
| `orientacion` | `string` | Opcional | `"derecha"` (por defecto) o `"izquierda"` (invierte horizontalmente al Stickman). |
| `escala` | `number` | Opcional | Multiplicador de tamaño del Stickman (`1` por defecto). |
| `posicion` | `{x, y}` | Opcional | Ajuste fino en píxeles (`{ "x": 0, "y": 0 }`). |
| `animacionEntrada` | `string` | Opcional | `"rebote"` (por defecto), `"zoom"`, `"deslizar"` o `"ninguna"`. |
| `layout` | `string` | Opcional | `"clasico"` (tarjeta superior grande), `"narrativo"` (banner compacto + espacio central libre) o `"compacto"`. |
| `elementosNarrativos` | `array` | Opcional | Lista de elementos visuales vectoriales: `speed_counter`, `speed_lines`, `flying_debris`, `giant_waves`, `shockwave_burst`, `orbital_peace`, `danger_vignette`. |
| `efectosCamara` | `array` | Opcional | Modificadores cinemáticos: `["shake"]`, `["punch"]`, `["drift"]` (micro-zoom continuo). |
| `transicion` | `string` | Opcional | Entrada visual hacia la escena: `"zoom_in"` (por defecto), `"whip_right"`, `"whip_left"`, `"flash"`, `"corte"`. |
| `sfx` | `string` | Opcional | Ruta relativa a `public/` de audio de impacto (ej. `"sfx/sfx_whoosh.wav"`, `"sfx/sfx_impact.wav"`, `"sfx/sfx_dramatic_hit.wav"`, `"sfx/pop.mp3"`). |
| `volumenSfx` | `number` | Opcional | Volumen del SFX (`0.15` a `0.30`, subordinado a la voz). |
| `palabrasClave` | `array` | Opcional | Lista de palabras o cifras que recibirán énfasis tipográfico dinámico y pop de escala. |

### Campos Autogenerados (inyectados por `scripts/generar_voz.py`)

- `duracionSegundos` (`number`): Duración real del MP3 medida con `mutagen` + `0.25s` de pausa. `calculateMetadata` en `src/Root.tsx` suma este campo para ajustar la duración total del video.
- `palabras` (`Array<{ palabra: string, inicioMs: number, finMs: number }>`): Eventos `WordBoundary` de `edge-tts` usados por `src/components/Subtitles.tsx` para mostrar bloques de 2 a 3 palabras en mayúsculas y resaltar en amarillo (`#FFE600`) la palabra activa.

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
│   │   ├── Scene.tsx           # Layout adaptable con soporte de layouts clásico o narrativo
│   │   ├── CameraRig.tsx       # Rig cinemático de cámara (push-in, trauma shake, transiciones)
│   │   ├── NarrativeElements.tsx # Motor de elementos vectoriales narrativos (velocímetro, olas, escombros)
│   │   ├── Stickman.tsx        # Renderizador determinista SVG/PNG + parpadeo, lip-sync y gesticulación
│   │   ├── Subtitles.tsx       # Bloques de 2-3 palabras sincronizados con inicioMs
│   │   ├── WordSubtitles.tsx   # Subtítulos neo-brutalistas sin empastes y con énfasis en cifras
│   │   ├── AnimatedIcon.tsx    # Ícono neo-brutalista animado con soporte de modo banner compacto
│   │   └── ShowcasePoses.tsx   # Composición HojaDeContacto
│   ├── data/
│   │   ├── guion.json          # Guion activo del Short
│   │   └── poses.json          # Catálogo validado de poses, expresiones y props
│   └── stickman/
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
- `npm run render` — Renderiza `ShortSabiasQue` en `out/short.mp4`.
