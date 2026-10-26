# WORKFLOW.md — Flujo de Trabajo del AutoPNGTuber

## 🚨 REGLA DE ORO ANTES DE CREAR UN GUION

> **REGLA DE ORO ANTES DE CREAR UN GUION**: Siempre que el usuario pida un nuevo video o una idea de historia, el agente DEBE leer primero `src/data/historial_temas.json`, revisar los temas y ganchos existentes, y asegurarse de proponer un tema, enfoque científico o fenómeno completamente distinto a los ya registrados.
>
> ⏱️ **REGLA DE DURACIÓN DEL GUION (configurable por video)**:
> - **Duración configurable**: Cada guion declara `meta.duracionObjetivo: [min, max]` en segundos (ej. `[35, 45]`, `[60, 75]`, `[80, 95]`). Por defecto: **62-110 s**.
> - **Monetización**: TikTok exige videos de **más de 60 s**. La duración estándar se decide con los datos del experimento A/B (`docs/CHECKLIST_PUBLICACION.md`, `docs/SEGUIMIENTO.csv`).
> - **Estructura recomendada**: gancho en 1-2 s, dato clave en 5-10 s, giro a la mitad y cierre circular.
> - **Garantía técnica**: `npm run validar` y `npm run qa` validan contra ese mismo rango objetivo.
>
> 🎨 **CONGRUENCIA, ENFOQUE VISUAL Y ANIMACIÓN DINÁMICA**:
> - Prohibido el contenido visual estático (personaje inmóvil en `{x: 0, y: 0}`).
> - Emplear secuencias de movimiento y físicas (`acciones`: `caminar_hacia`, `sorpresa_y_retroceso`, `tropezar`, desplazamientos).
> - **Cero saturación**: A lo sumo 1 prop en mano cuando corresponda (dejando la otra mano libre para gesticular) y como máximo 1 objeto protagónico en escena (`objetos: [...]`) con física (`flotar`, `caer`, `vibrar` o `pulso`).
> - Priorizar props vectoriales ilustrados (`kidneys`, `black_hole`, `salt_crystal`, `shrinking_cell`, `spaceship`, etc.) sobre stickers circulares genéricos.
> - Activar `elementosNarrativos` (`giant_waves`, `speed_lines`, `danger_vignette`, `shockwave_burst`) y alternar planos de cámara (`primer_plano`, `plano_general`, `shake`, `punch`).

---

## Ciclo de Vida de Producción de un Short

```mermaid
flowchart TD
    A["1. Revisar Historial y Licencias<br>(historial_temas.json & docs/LICENCIAS.md)"] --> B{"¿Tema nuevo?<br>(Similitud < 65%)"}
    B -- No --> C["Proponer tema o enfoque diferente"]
    C --> A
    B -- Sí --> D["2. Redactar src/data/guion.json<br>(meta.duracionObjetivo, escenas)"]
    D --> E["3. Validar guion: npm run validar"]
    E --> F["4. Generar voz: npm run tts"]
    F --> G["scripts/registrar_historia.py<br>(Verifica duplicados, respalda y actualiza historial)"]
    G --> H["5. Previsualizar (npm run dev) o Renderizar (npm run render)"]
    H --> I["6. QA Automático (npm run qa) + Exportar Metadata"]
    I --> J["7. Publicar según docs/CHECKLIST_PUBLICACION.md"]
```

---

## Archivos Clave del Sistema de Historial

- `src/data/historial_temas.json`: Base de datos de temas ya producidos con `id`, `fecha`, `gancho`, `palabrasClave`, `archivoRespaldo` y `textoCompleto`.
- `archivo_videos/`: Carpeta con copias completas de cada `guion.json` generado en la historia del canal.
- `scripts/registrar_historia.py`: Algoritmo de detección de duplicados por similitud y archivador.
- `scripts/generar_voz.py`: Pipeline TTS que actualiza el guion y dispara el registro automático.
