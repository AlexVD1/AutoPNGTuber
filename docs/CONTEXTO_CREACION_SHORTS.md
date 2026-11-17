# CONTEXTO Y REGLAS MAESTRAS PARA AGENTES DE IA (AutoPNGTuber)

Este documento condensa la arquitectura, las directrices de animación dinámica, el lenguaje de cámara, los estándares técnicos y las lecciones aprendidas al producir Shorts animados con **Remotion**, **Chatterbox TTS / edge-tts** y el motor neo-brutalista de **Stickman**.

Cualquier agente de IA que tome el control de este repositorio debe leer y aplicar rigurosamente estas reglas para producir videos con el nivel de dinamismo, fluidez física y claridad visual que exige el proyecto.

---

## 1. Filosofía Visual: Animación Física Progresiva («Show, Don't Tell»)

El canal combina una estética **neo-brutalista limpia** (contornos negros marcados `stroke="#000000"` de `4px` a `8px`, uniones redondeadas `strokeLinejoin="round"`, colores vibrantes y contrastantes) con **animación física progresiva cuadro a cuadro**.

### 🚫 Prohibido el «Efecto Diapositiva / PowerPoint»
- **Nunca** expliques un fenómeno colocando un recuadro gigante estático con 4 líneas de texto flotando en el cielo mientras abajo solo hay un piso plano.
- **El escenario ES la explicación**: El fenómeno científico, histórico, biológico o psicológico debe **ocurrir físicamente frente a los ojos del espectador** a medida que avanza `frame` (`0 -> duracionEnFrames`).
- **Sin cartelitos redundantes en los props**: No agregues etiquetas rectangulares con texto debajo de cada prop en `propsLibrary.ts`. Los objetos deben ser herramientas, criaturas, reacciones o piezas físicas puras; los subtítulos (`WordSubtitles`) y el rótulo superior (`AnimatedIcon`) ya cumplen la función textual.

### 🌍 Cómo Traducir Cualquier Tema a un Mundo Físico Progresivo (`NarrativeStage.tsx`)
Sin importar el tema del guion, construye un **mundo continuo con corte transversal 2.5D o vista interna viva** donde la geometría evolucione con `frame`:

| Tipo de Tema | Cómo Diseñar y Animar el Escenario (`NarrativeStage.tsx`) |
| :--- | :--- |
| **Ingeniería, Física y Geología** | Mantén un entorno continuo (ej. fachada de edificio/casa, superficie y **corte subterráneo 2.5D profundo**). Anima el terreno y los materiales cuadro a cuadro: paredes que se erosionan y ensanchan, niveles de fluido que suben, vigas o tablas que se arquean bajo vectores de fuerza antes de partirse en dos, rocas o piezas que caen una por una con gravedad y se apilan. |
| **Biología, Medicina y Neurociencia** | Diseña un corte orgánico o microscópico multicapa (vasos sanguíneos, sinapsis, membranas celulares). Anima impulsos eléctricos viajando por axones, enzimas acoplándose y cortando polímeros paso a paso, o tejidos cambiando de color/estado al recibir un estímulo. |
| **Astronomía, Cuántica y Química** | Mallas espacio-temporales que se deforman progresivamente, horizontes de sucesos que emiten partículas y reducen su radio con `frame`, o recipientes/reactores donde los líquidos cambian de fase, burbujean y precipitan cristales en tiempo real. |
| **Psicología, Historia y Vida Cotidiana** | Escenarios arquitectónicos con profundidad real (bancos con cámaras y monitores CCTV en vivo, tribunales con banquillo en primer plano, aulas con pupitres, sabanas con arbustos que se agitan) donde los elementos del entorno reaccionan sincronizados con la historia. |

---

## 2. Reglas de Oro de Utilería y Composición

### 🚫 Prohibición Total de Lucide Icons en Escena
- **REGLA ABSOLUTA**: Queda terminantemente prohibido usar íconos de `lucide-react` o prefijos `"lucide:"` en `prop`, `props`, `objetos[].propId` o elementos dentro del escenario.
- **Solución obligatoria**:
  1. Usa o crea props vectoriales neo-brutalistas propios dentro de `src/stickman/propsLibrary.ts` y regenera el catálogo con `npm run poses:build`.
  2. Cada prop nuevo debe implementar `animatedSvg: (f: number, stepProgress?: number, currentState?: string) => string` con piezas móviles reales (ej. una herramienta que pivota y lanza partículas, un objeto que cambia de `"intacto"` a `"roto"`, un recipiente que se inclina y vierte contenido).

### 🚫 Cero Encuadres Vacíos y Cero Objetos Duplicados
- El Stickman jamás debe aparecer señalando al vacío: cada escena requiere su escenario activo y al menos un `SceneObject` protagónico interactuando con él.
- **Evita duplicar el mismo objeto en el fondo y en el prop**: Si un elemento protagónico (ej. una tabla que se rompe, una puerta o un reactor) ya es un `SceneObject` animado en `objetos[]`, el escenario (`NarrativeStage.tsx`) debe dibujar el entorno que lo rodea (el agua subiendo, la zanja, los muros) sin volver a dibujar una segunda copia estática detrás.

### 💡 Claridad Didáctica en Menos de 2 Segundos
- Si el guion menciona un experimento, principio físico o personaje específico (ej. $P = \rho \cdot g \cdot h$, *Curva de Dunning-Kruger*, *Experimento de Loftus*, *Barry Manilow*), represéntalo visualmente en la acción misma (vectores rojos que crecen con la profundidad, curva que el personaje escala y de la que cae, retrato ilustrado en pizarrón).

---

## 3. Dirección de Cámara Dinámica: Acercamientos (`focoCamara`) y Micro-Planos (`planos`)

Para que un Short se sienta vivo y cinematográfico —y no como una cámara fija de teatro—, **toda escena debe mover la cámara con intención narrativa** usando `focoCamara` o `planos` en `src/data/guion.json`.

### 🎥 Estructura Recomendada de `focoCamara` por Escena (2 a 3 Keyframes)
En lugar de dejar la cámara quieta, define en cada escena de `src/data/guion.json` una secuencia de 2 o 3 encuadres con `focoCamara`:
1. **Plano de Contexto / Reacción Inicial (`inicioProgreso: 0.0 -> 0.32`)**:
   - Encuadra al Stickman y su entorno inmediato (`escala: 1.10` a `1.20`, `x: -160..0`, `y: -60..40`, `curva: "suave"`).
2. **Acercamiento Dramático a la Acción Física (`inicioProgreso: 0.32 -> 0.75`)**:
   - Haz *push-in* decidido (`escala: 1.34` a `1.44`, `curva: "impacto"` o `"suave"`) hacia las coordenadas exactas donde ocurre la transformación física (ej. `y: 120..180` si la acción sucede en el corte subterráneo o sobre una mesa de trabajo).
3. **Paneo de Consecuencia o Reencuadre (`inicioProgreso: 0.75 -> 1.0`)**:
   - Sigue el flujo de la acción (paneo hacia donde viaja la onda/agua/reacción) o abre el plano (`escala: 1.08` a `1.22`, `curva: "rebote"` o `"suave"`) para mostrar el resultado completo antes de cortar a la siguiente escena.

```json
"focoCamara": [
  {
    "x": -160,
    "y": -50,
    "escala": 1.15,
    "inicioProgreso": 0.0,
    "finProgreso": 0.32,
    "curva": "suave"
  },
  {
    "x": 25,
    "y": 155,
    "escala": 1.42,
    "inicioProgreso": 0.32,
    "finProgreso": 0.75,
    "curva": "impacto"
  },
  {
    "x": 90,
    "y": 80,
    "escala": 1.18,
    "inicioProgreso": 0.75,
    "finProgreso": 1.0,
    "curva": "rebote"
  }
]
```

### ⚠️ Regla de Zona Segura durante Acercamientos (`zoom > 1.30x`)
- Los subtítulos (`WordSubtitles`) viven fijos en la capa HUD en la franja `y = 1400..1600`.
- Cuando la cámara hace zoom (`1.35x–1.45x`) hacia la mitad inferior del escenario (`y > 100`), cualquier texto diegético dibujado en el escenario por debajo de `y = 1320` se desplazará hacia la zona de `y = 1400..1550` y **chocará con los subtítulos**.
- **Regla**: No coloques textos diegéticos en la parte baja del escenario (`y > 1280`) cuando haya acercamientos; deja que los gráficos visuales (capas de color, flechas, partículas) hablen por sí solos o sitúa las fórmulas arriba (`y = 880..1150`).

---

## 4. Sincronización Léxica por Palabra y Conexión del Motor en `Scene.tsx`

### 🔗 Anclaje Palabra por Palabra (`desdePalabra` / `hastaPalabra`)
Tanto los pasos del Stickman (`personajes[].acciones[].pasos`) como los pasos y estados de los objetos (`objetos[].pasos`) y los emisores de partículas (`emisoresParticulas`) deben sincronizarse con lo que dice el narrador:
- Si el narrador dice *"la presión hidrostática simplemente la hace mil pedazos"* en el segundo `4.95 s` (`frame = 148` de la escena):
  - El paso 1 del objeto (`estado: "intacto"`, arqueándose por la presión) va hasta `"plana..."`.
  - El paso 2 del objeto (`estado: "roto"`, partiéndose en dos pedazos voladores) inicia exactamente en `"presión"` (`desdePalabra: "presión"`, `hastaPalabra: "pedazos."`).
  - Si el escenario (`NarrativeStage.tsx`) también reacciona a esa rotura (ej. liberando una ola gigante), su condición de disparo debe usar ese mismo frame (`const breakFrame = 148`) para que escenario, prop, cámara (`shake` / `impacto`) y voz estallen al unísono.

### ⚙️ Conexión Obligatoria de Componentes en `src/components/Scene.tsx`
En `src/components/Scene.tsx`, verifica siempre que todos los subsistemas reciban `escena.palabras`, `fps` y `sceneDurationFrames`:
1. `evaluateCharacterState(p, frame, fps, sceneDurationFrames, escena.palabras)` (el 5.º argumento `escena.palabras` es indispensable para que `desdePalabra`/`hastaPalabra` funcione en los personajes).
2. `<CameraRig ... focoCamara={escena.focoCamara} planos={escena.planos} palabras={escena.palabras}>`.
3. `<SceneObject key={obj.id} objeto={obj} frame={frame} fps={fps} totalFrames={sceneDurationFrames} palabras={escena.palabras} />`.
4. `<ParticleEmitterLayer emisores={escena.emisoresParticulas} palabras={escena.palabras} />` y `<DiegeticCalloutsLayer cotas={escena.cotasVectoriales} personajes={personajesList} palabras={escena.palabras} />` montados dentro de `<CameraRig>`.

---

## 5. Jerarquía de Capas, Stacking Context y Z-Index

En el lienzo vertical `1080x1920`, el árbol de renderizado se divide en el **Mundo Cinemático** (afectado por `CameraRig`) y la **Capa HUD Fija** (inmune al zoom y al *shake*):

```text
▲ Capa HUD Fija (z-30 / z-50, fuera de CameraRig)
│   ├── Rótulo Superior compacto (AnimatedIcon)
│   ├── Gancho gigante en Escena 1 durante los primeros 1.5s (frames 0..45)
│   └── Subtítulos Activos (WordSubtitles, zona segura y: 1400-1600)
│
└── Mundo Cinemático (dentro de CameraRig)
    ├── Capa 3.5: Primer Plano de Oclusión (NarrativeStageForeground, style={{ zIndex: 35 }})
    ├── Capa 3.2: Cotas Vectoriales y Partículas (DiegeticCalloutsLayer zIndex: 34, ParticleEmitterLayer zIndex: 32)
    ├── Capa 3.0: Props Interactivos al Frente (SceneObject, capaZ >= 26)
    ├── Capa 2.0: Actores y Personajes (Stickman, capaZ: 15-22)
    └── Capa 1.0: Escenario Progresivo de Fondo (NarrativeStage, z-0)
```

### ⚠️ Reglas Críticas de Profundidad y Contraste
1. **Usa siempre `style={{ zIndex: N }}` para capas intermedias**: Tailwind no incluye clases `z-22`, `z-26` o `z-35` por defecto.
2. **Contraste del Stickman (`ESCENARIOS_OSCUROS`)**: Si el escenario tiene cielo nocturno, tormenta o corte subterráneo oscuro, registra su ID en `ESCENARIOS_OSCUROS` dentro de `src/components/NarrativeStage.tsx` para que el Stickman reciba automáticamente su halo blanco (`drop-shadow`) y jamás se pierda contra el fondo.
3. **Oclusión Física Coherente**: Si un personaje está detrás de un mostrador, pupitre o banquillo, usa `NarrativeStageForeground` (`zIndex: 35`) para cubrir sus piernas de forma realista.

---

## 6. Narrativa, Duración de Monetización, TTS y SFX

1. **Regla Anti-Duplicados (`src/data/historial_temas.json`)**:
   - Antes de crear cualquier guion, lee `src/data/historial_temas.json` y verifica que el tema y enfoque tengan menos de 65% de similitud con videos anteriores.
2. **Duración de Monetización (`62 a 75 segundos`)**:
   - El total de `duracionSegundos` de las escenas debe superar los **60 segundos** (idealmente `62–75 s`, distribuido en 7 escenas de `8.3 a 10.0 s` cada una).
   - Cache de TTS (`.tts_cache.json`): Si solo estás mejorando animaciones, cámaras o escenarios de un guion cuyos audios ya fueron generados, **no modifiques `texto`, `duracionSegundos` ni `palabras`** en `src/data/guion.json`; así `npm run render` reutilizará los MP3 al instante sin re-sintetizar.
3. **Efectos de Sonido Procedurales (`public/sfx/`)**:
   - Diseña y sintetiza un SFX específico en WAV (`public/sfx/sfx_<escena>.wav`) para cada escena usando Python (`wave` / `numpy` o `scripts/generar_sfx.py`) que combine las texturas acústicas de la acción (ej. lluvia + pala + crujido de madera + impacto de rocas + cascada de agua) con `volumenSfx` entre `0.22` y `0.26`.

---

## 7. Flujo de Trabajo y Protocolo de Evaluación Visual Multi-Frame

Sigue siempre este orden estricto antes de dar por terminado un Short:

```powershell
# 1. Si agregaste o editaste props en src/stickman/propsLibrary.ts, regenerar catálogo:
npm run poses:build

# 2. Si el texto del guion es nuevo o cambió, sintetizar voz y alinear palabras:
npm run tts

# 3. Validar esquema Zod, poses, expresiones y ritmo de cámara (debe dar 0 errores y 0 avisos):
npm run validar
npx tsc --noEmit

# 4. EVALUACIÓN VISUAL MULTI-FRAME OBLIGATORIA (Plano abierto + Acercamiento):
# Renderiza al menos 1 frame inicial y 1 frame de acercamiento/impacto por escena:
npx remotion still ShortSabiasQue out/eval_s1a.png --frame=35
npx remotion still ShortSabiasQue out/eval_s1b.png --frame=140
npx remotion still ShortSabiasQue out/eval_s2a.png --frame=310
npx remotion still ShortSabiasQue out/eval_s2b.png --frame=420
# ... (inspecciona cada PNG con read_file para verificar encuadre, acción y subtítulos)

# 5. Borrar capturas temporales de evaluación y lanzar el renderizado final:
Remove-Item -Force out/eval_*.png -ErrorAction SilentlyContinue
npm run render
```

### 🔍 Checklist al Inspeccionar los PNGs con `read_file`
Antes de ejecutar `npm run render`, confirma visualmente en tus capturas:
- [ ] **¿Se nota el acercamiento de cámara (`focoCamara`) y el cambio físico entre el frame A y el frame B?** (Ej. la zanja se ensanchó, la tabla se partió en dos, las rocas cayeron, el recipiente cambió de estado).
- [ ] **¿Hay cero cajas estáticas tipo PowerPoint tapando el escenario?**
- [ ] **¿Hay cero elementos duplicados?** (Ej. que no se vean dos tablas o dos puertas superpuestas entre el fondo y el prop).
- [ ] **¿La franja de subtítulos (`y = 1400..1600`) está completamente limpia de textos del escenario?**

---

## 8. Buenas Prácticas Operativas en Windows / PowerShell

1. **En PowerShell usa `;` en lugar de `&&`** para encadenar comandos en una sola línea (en Windows PowerShell 5.1 el token `&&` lanza `ParserError`).
2. **Usa scripts auxiliares en `scratch/` para ediciones masivas**: Para actualizar bloques grandes en `propsLibrary.ts`, `NarrativeStage.tsx` o `guion.json` sin problemas de saltos de línea CRLF o escape de comillas en PowerShell, escribe un script corto `.py` en la carpeta `scratch/`, ejecútalo con `python` y verifica con `npx tsc --noEmit` y `npm run validar`.
