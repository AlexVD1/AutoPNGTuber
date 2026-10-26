# Reglas Permanentes del Agente (AutoPNGTuber)

## 🚨 REGLA DE ORO ANTES DE CREAR UN GUION

> **REGLA DE ORO ANTES DE CREAR UN GUION**: Siempre que el usuario pida un nuevo video o una idea de historia, el agente DEBE leer primero `src/data/historial_temas.json`, revisar los temas y ganchos existentes, y asegurarse de proponer un tema, enfoque científico o fenómeno completamente distinto a los ya registrados.

---

## ⏱️ REGLA DE DURACIÓN OBLIGATORIA DEL GUION

1. **Duración configurable por video**: cada guion declara `meta.duracionObjetivo: [minSegundos, maxSegundos]`. Rangos de referencia para el experimento: **35-45 s** (corto), **60-75 s** (medio) y **80-95 s** (largo).
2. **Valor por defecto**: si el guion no define `duracionObjetivo`, se aplica **62-110 s** (el comportamiento histórico). `generar_voz.py`, `registrar_historia.py`, `npm run validar` y `npm run qa` leen este mismo rango.
3. **Monetización en TikTok**: el Programa de Recompensas del Creador solo paga videos de **más de 60 s**; usa 60-75 s o más si el video se publica allí.
4. **La duración estándar se decide con datos**: tras el experimento A/B de `docs/CHECKLIST_PUBLICACION.md` (5 cortos + 5 medios, métricas a 48 h en `docs/SEGUIMIENTO.csv`), no por regla fija.
5. **Estructura de guion**: gancho en los primeros 1-2 s, dato clave entre los 5 y 10 s, giro a la mitad y cierre que enlaza con el inicio. La escena 1 debe mostrar una imagen o cifra impactante desde el frame 0 (el motor superpone `tituloVisual` en grande durante 1.5 s).
6. **Dimensionamiento**: ~4.5-7.5 s por escena tras la síntesis; el número de escenas sale del rango elegido (p. ej. 10-14 escenas para 60-90 s).
7. **Ritmo visual**: `npm run validar` avisa si dos escenas consecutivas repiten composición/pose/encuadre o si una escena pasa de ~6 s sin cambio de cámara (`punch`/`shake`).
8. **Voz**: se puede probar una velocidad ligeramente mayor y pausas cortas antes del dato clave, manteniendo siempre la validación Whisper.

---

## 🎙️ REGLA ESTRICTA DE SÍNTESIS DE VOZ Y VALIDACIÓN DE AUDIOS (ZERO-ARTIFACTS PIPELINE)

> 🚨 **GARANTÍA TOTAL DE AUDIO Y SINCRONIZACIÓN**: Todo audio generado en el proyecto debe pasar por los 6 filtros obligatorios del pipeline `v3_sentence_tailcut`. Queda estrictamente prohibido renderizar con audios desfasados, mutilados o con ruidos parásitos.

1. **Gating Obligatorio Pre-Render (`render_short.js`)**:
   - `verificarCoherenciaAudios()` compara cada escena del guion activo con `.tts_cache.json` y los `.mp3` en disco.
   - Si falta un archivo, si el texto del guion difiere del audio, o si la versión del pipeline es anterior a `v3_sentence_tailcut`, **ejecuta automáticamente `python scripts/generar_voz.py`** antes de llamar a Remotion.
2. **Fragmentación Natural por Oración (`dividir_en_fragmentos`)**:
   - El límite de fragmento está fijado en **135 caracteres** preservando oraciones completas y cláusulas sintácticas naturales con signos de puntuación (`.`, `!`, `?`, `,`, `;`, `:`).
   - Prohibido trocear frases a mitad de una cláusula o separar verbos de sus objetos directos (ej. jamás partir *"sin beber nada que tomando"* | *"agua de mar"*).
3. **Poda Estricta de Cola Residual (Anti-Ruidos y Cero Chasquidos)**:
   - Todo audio se recorta exactamente a los **160ms tras la última palabra pronunciada** con un *fade out* suave de 40ms, purgando cualquier respiración, clic o murmullo que el sintetizador deje al final del archivo.
4. **Micro-Fundidos Anti-Clic**:
   - Cada fragmento de audio generado recibe micro-fades de entrada (6ms) y salida (12ms) para eliminar chasquidos de corriente directa (*DC offset pops*).
5. **Calibración Fonética y Reintentos Adaptativos**:
   - Temperatura acústica fijada en **0.50** para pronunciación nítida y articulada sin deformaciones fonéticas.
   - Whisper evalúa la fidelidad del audio respecto al texto; si la similitud cae por debajo del 72%, el motor reintenta automáticamente hasta 4 veces variando la temperatura (`+0.03`).
6. **Invalidez Automática de Caché**:
   - El hash SHA-256 de `.tts_cache.json` incluye `PIPELINE_VERSION = "v3_sentence_tailcut"`, garantizando que cualquier audio sintetizado con versiones obsoletas se actualice automáticamente.

---

## 🎨 REGLA DE CONGRUENCIA VISUAL, ESCENARIOS Y PROPS A MEDIDA

> 🚨 **PROHIBIDO EL FONDO EN BLANCO VACÍO O ESCENARIOS INCONGRUENTES**: El proyecto jamás debe usar por error un escenario que no corresponda al tema (ej. escenario lunar cuando se habla del océano) ni dejar escenas con la mitad de la pantalla vacía.

1. **Expansión Dinámica y Obligatoria de Escenarios (`NarrativeStage.tsx`)**:
   - Cada vez que se cree una nueva narración, revisa qué ambientes requiere el guion.
   - Si un ambiente necesario no existe aún en `NarrativeStage.tsx` (ej. `abismo_oceanico`, `interior_cuerpo`, `volcan_activo`, `reactor_nuclear`, `bosque_nocturno`, `ciudad_futurista`), **DEBES programar e incorporar ese nuevo escenario en código SVG/CSS antes de renderizar**.
   - **Estándar de Calidad Visual para Escenarios Nuevos (Neo-Brutalism)**:
     - *Fondo con atmósfera*: Gradientes suaves y paletas cromáticas ricas coherentes con la escena (no fondos planos sin vida).
     - *Profundidad por capas (Parallax)*: Mínimo 3 planos visuales (fondo lejano, elementos de plano medio y un suelo/superficie clara donde pisa el Stickman con trazos negros definidos de 3px a 6px).
     - *Vida en el ambiente (Partículas deterministas)*: Elementos animados con `frame` y `Math.sin()` acordes al lugar (ej. burbujas y rayos cenitales en océano, chispas/ceniza en fuego, células flotando en biología, etc.).

2. **Expansión Dinámica de Props Ilustrados (`propsLibrary.ts` / `SceneObject.tsx`)**:
   - Si una escena habla de un concepto específico (ej. manómetro estallando, pila de aviones, pulmones colapsando, molécula de trimetilamina, batiscafo) y no existe un prop ilustrado en `propsLibrary.ts`, NO uses únicamente un ícono plano simple ni dejes el espacio vacío:
   - Diseña un prop SVG neo-brutalista a todo color, con volumen, sombras duras, contornos negros de 4px a 6px y animación interna determinista con `animatedSvg(frame)` (partes que laten, giran o vibran) y regístralo permanentemente en el catálogo.

3. **Contraste Garantizado del Stickman (`Stickman.tsx`)**:
   - Cuando una escena utilice un escenario oscuro (`abismo_oceanico`, `interior_cuerpo`, `lunar`, `habitacion_noche`, etc.), el Stickman recibe automáticamente un contorno exterior o halo blanco nítido (`filter: drop-shadow(0px 0px 4px #FFFFFF) drop-shadow(0px 0px 2px #FFFFFF)`) para que sus extremidades negras jamás se pierdan contra el fondo.

4. **Cero Encuadres Vacíos (`Scene.tsx`)**:
   - Prohibido colocar al Stickman a un lado señalando hacia un espacio vacío. Toda escena debe contar con un escenario temático y al menos un objeto protagónico (`SceneObject`) o actor bien distribuido en el lienzo.

5. **Prioridades para Props**:
   - **Prioridad 1 — Prop Permanente Ilustrado y Animado**: Registrar en `src/stickman/propsLibrary.ts` con SVG enriquecido y compilar con `npm run poses:build`.
   - **Prioridad 2 — Iconos de Lucide (+1,400 listos)**: `"lucide:<IconName>"` como sticker neo-brutalista circular para props secundarios.
   - **Prioridad 3 — SVG Inline Personalizado**: `"svg:<path ...>"` para detalles vectoriales directos.

6. **Generación y Expansión Dinámica de SFX (`public/sfx/`)**:
   - Similar a los props SVG a medida, si la narración o una escena requiere un efecto de sonido puntual (ej. rayo láser, latido de corazón, alarma de peligro, glitch, choque metálico, destello) que no exista en `public/sfx/`, **el agente DEBE generar el archivo WAV correspondiente**:
     - Usar el generador procedural: `python scripts/generar_sfx.py <nombre_archivo> <tipo> [duracion]` (presets: `laser`, `heartbeat`, `glitch`, `alarm`, `impact`, `sparkle`, `click`).
     - O sintetizar directamente con un script Python usando `wave` y `math`/`numpy` guardando en `public/sfx/<nombre>.wav`.
   - Prohibido omitir acentos sonoros clave o forzar un sonido que desentone con la emoción de la escena.
   - Configurar siempre `"sfx": "sfx/<nombre>.wav"` y su respectivo `volumenSfx` (`0.18` a `0.28`, subordinado a la voz).

---

## 🎬 REGLA OBLIGATORIA DE ANIMACIÓN DINÁMICA, PROPS PERSONALIZADOS Y NO REPETICIÓN VISUAL

> 🚨 **PROHIBIDO EL CONTENIDO ESTÁTICO O REPETITIVO**: Jamás generar escenas donde el stickman quede inmóvil en el centro (`{x: 0, y: 0}`) repitiendo solo cambios de pose. Cada historia debe sentirse como una animación artesanal, viva y personalizada al tema.

1. **Movimiento Físico y Acciones Continuas (`acciones`)**:
   - Usar el motor de secuencias de acción predefinidas y personalizadas:
     - `"caminar_hacia"`: Desplazamientos rítmicos cruzando o entrando al encuadre (`desdeX` a `haciaX`).
     - `"sorpresa_y_retroceso"` / `"despertar_asustado"`: Saltos y retrocesos con temblor ante peligros o revelaciones.
     - `"tropezar_y_reaccionar"`: Tropiezos y desequilibrios dramáticos o humorísticos.
     - `"mirar_y_reaccionar"` / `"acercarse_y_tocar"`: Interacción directa con objetos y puntos de interés.
   - Variar las posiciones (`posicion: { x, y }`) y orientaciones (`orientacion: "derecha" | "izquierda"`) entre escenas consecutivas.
   - Emplear escenas multi-personaje (`personajes: [...]`) cuando haya interacción (ej. narrador + sujeto del experimento, amigo, médico o astronauta).

2. **Props Significativos y Enfoque Visual (Cero Saturación)**:
   - **No saturar de props**: Evitar llenar ambas manos y llenar la pantalla con objetos volando por doquier al mismo tiempo. Debe verse limpio, intencional y cinematográfico.
   - **En manos**: A lo sumo **1 solo prop principal temático** en la mano que muestra el objeto (`prop` o `props.derecha`), dejando la otra mano libre para gesticulación natural del stickman, caminar o reaccionar. Muchas escenas de explicación o sorpresa funcionan mejor con gestos corporales limpios sin nada en la mano.
   - **En el escenario (`objetos`)**: Como máximo **1 objeto hero/protagónico** en escena cuando sea necesario reforzar visualmente el concepto clave (ej. el agujero negro gigante, los riñones, la célula deshidratada, el cristal de sal, la nave espacial).
   - **Prioridad a ilustraciones vectoriales temáticas**: Priorizar props vectoriales detallados a todo color (`black_hole`, `kidneys`, `salt_crystal`, `shrinking_cell`, `spaceship`, `cosmic_hourglass`, `singularity`, `atom`) antes que abusar de stickers circulares.

3. **Elementos Narrativos Cinemáticos (`elementosNarrativos`)**:
   - Integrar componentes vectoriales reactivos según el tema:
     - `"giant_waves"`: Olas oceánicas para agua, tsunamis, fluidos o naufragios.
     - `"speed_lines"`: Líneas cinéticas de aceleración cósmica, caída libre o inercia.
     - `"shockwave_burst"`: Estallidos expansivos para impactos, explosiones o colapsos.
     - `"danger_vignette"`: Pulso perimetral rojo para peligro mortal, asfixia o daño biológico.
     - `"orbital_peace"`: Constelaciones y satélites para el espacio y calma cósmica.
     - `"speed_counter"`: Velocímetros digitales cuando se mencionen cifras extremas.

4. **Cinematografía Dinámica de Cámara (`CameraRig`)**:
   - Alternar encuadres: `"primer_plano"` (zoom al 142% con viñeta para clímax o sorpresa), `"plano_general"`, `"escenario_ilustrado"` y `"cifras_concepto"`.
   - Aplicar efectos de cámara expresivos: `["drift"]` (acercamiento continuo), `["punch"]` (impacto de zoom rápido) y `["shake"]` (sacudida sísmica en golpes o sobresaltos).

---

## 1. Verificación de Historial y Temas Únicos

1. **Lectura obligatoria**:
   - Archivo: `src/data/historial_temas.json`
   - Extraer todos los `gancho`, `palabrasClave` e `id` previos.
2. **Evaluación de similitud semántica**:
   - Evitar proponer temas o fenómenos con más del 65% de similitud temática con los existentes.
   - Si el usuario solicita un tema ya tratado (ej. "palomitas de maíz", "la Tierra deja de girar" o "estrella de neutrones"), el agente debe notificarle amablemente que ya existe en el historial y sugerir un enfoque radicalmente nuevo o un tema alternativo.

---

## 2. Estructura de Guiones Soportada (`src/data/guion.json`)

El sistema soporta dos modalidades totalmente válidas:

### Modalidad A: Con metadatos explícitos (Recomendada)
```json
{
  "meta": {
    "id": "agujeros_negros_espagueti",
    "slug": "agujeros_negros_espagueti",
    "temaResumen": "¿Qué es la espaguetificación en un agujero negro?"
  },
  "escenas": [
    {
      "id": 1,
      "texto": "¿Sabías qué le pasaría a tu cuerpo si cayeras dentro de un agujero negro?",
      "icono": "Orbit",
      "colorIcono": "#8B5CF6",
      "tituloVisual": "ESPAGUETIFICACIÓN"
    }
  ]
}
```

### Modalidad B: Arreglo directo de escenas
```json
[
  {
    "id": 1,
    "texto": "¿Sabías qué le pasaría a tu cuerpo si cayeras dentro de un agujero negro?",
    "icono": "Orbit",
    "colorIcono": "#8B5CF6",
    "tituloVisual": "ESPAGUETIFICACIÓN"
  }
]
```
*(Si no se incluye `meta`, el sistema extrae automáticamente el gancho de la escena 1 y genera el slug limpio desde `tituloVisual`).*

---

## 3. Flujo End-to-End Obligatorio

1. **Revisar historial**: Leer `src/data/historial_temas.json`.
2. **Escribir guion**: Guardar en `src/data/guion.json`.
3. **Generar audios y registrar**: Ejecutar `npm run tts` (o `python scripts/generar_voz.py`).
   - Al terminar, se ejecuta automáticamente `scripts/registrar_historia.py`.
   - Verifica duplicados con `difflib.SequenceMatcher`.
   - Guarda respaldo en `archivo_videos/{fecha}_{id_o_slug}.json`.
   - Registra o actualiza en `src/data/historial_temas.json`.
4. **Exportar metadata y renderizar**:
   - `npm run metadata` (`node scripts/exportar_metadata.js`).
   - `npm run render` (`node scripts/render_short.js`).
