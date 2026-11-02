# CONTEXTO Y REGLAS MAESTRAS PARA AGENTES DE IA (AutoPNGTuber)

Este documento condensa la arquitectura, las directrices estéticas, los estándares técnicos y las lecciones aprendidas al producir Shorts automatizados con **Remotion**, **Chatterbox TTS / edge-tts** y el sistema de animación neo-brutalista de **Stickman**.

Cualquier agente de IA que tome el control de este proyecto debe leer y acatar rigurosamente estas reglas para garantizar la calidad que espera el usuario.

---

## 1. Filosofía y Estándar Visual Neo-Brutalista

El canal se basa en una identidad visual **neo-brutalista de alto impacto**:
- **Trazos y contornos**: Bordes negros marcados (`stroke="#000000"`, de 4px a 8px de grosor) con uniones redondeadas (`strokeLinejoin="round"`).
- **Paleta de color**: Colores vivos, saturados y contrastantes (amarillos vibrantes `#FEF08A` / `#FDE047`, rojos carmín `#DC2626`, azules profundos `#0284C7`, verdes pizarra `#064E3B`).
- **Sombras sólidas**: Sombras proyectadas duras (`boxShadow: "8px 8px 0px #000000"`) sin difuminados gaussianos débiles.
- **Atmósferas ricas y vivas**: Los fondos jamás son lienzos vacíos. Cuentan con al menos 3 planos de profundidad (fondo, plano medio interactivo, primer plano de oclusión) y partículas u oscilaciones rítmicas (`Math.sin()`).

---

## 2. Reglas de Oro Visuales (Lo que NUNCA debes hacer)

### 🚫 Prohibición Total de Lucide Icons en Escena
- **REGLA ABSOLUTA**: Jamás uses íconos de `lucide-react` ni prefijos `"lucide:"` para props, objetos, herramientas, personajes o elementos diegéticos dentro del escenario. Al usuario le desagrada la estética genérica de Lucide.
- **La Solución**:
  1. Usa props vectoriales neo-brutalistas del catálogo ilustrado (`src/stickman/propsLibrary.ts`, con más de 227 recursos disponibles).
  2. Si el objeto no existe en el catálogo, **diséñalo e ilústralo tú mismo en SVG** dentro de `propsLibrary.ts` y ejecuta `npm run poses:build`.
  3. O bien insértalo como SVG inline personalizado: `"svg:<g>...</g>"`.

### 🚫 Cero Encuadres Vacíos o Personajes Señalando a la Nada
- Ninguna escena puede mostrar al Stickman a un lado de la pantalla señalando al vacío.
- Si el personaje está a un lado, el espacio libre **debe contener un objeto protagónico**, una infografía diegética, un personaje secundario o un elemento narrativo de peso.

### 💡 Claridad Didáctica Inmediata (Conceptos o Personajes Poco Conocidos)
- Si el guion hace referencia a una figura, estudio o concepto que el usuario común no reconoce de inmediato (ej. *Barry Manilow*, *Demonio de Maxwell*, *Efecto Mandela*, *Evento Carrington*), **no basta con un prop diminuto**.
- El escenario debe integrar una **explicación visual gigante e ilustrada** (ejemplo: un pizarrón con el retrato del personaje y la camiseta kitsch, o un gráfico esquemático rotulado) para que cualquier persona entienda el chiste o dato en menos de 2 segundos.

---

## 3. Jerarquía de Capas, Stacking Context y Z-Index

En el lienzo vertical `1080x1920`, el árbol de renderizado cinemático se estructura en capas estrictas dentro de `src/components/Scene.tsx`:

```text
▲ Capa 4: HUD e Interfaz Fija (z-50)
│   ├── Rótulo Superior / Categoría (AnimatedIcon)
│   └── Subtítulos Activos (WordSubtitles, zona segura y: 1400-1600)
│
▲ Capa 3.5: Elementos de Escenario en Primer Plano (NarrativeStageForeground)
│   └── zIndex: 35 (Pupitres de aula, mesas de bar, faldones, árboles frontales)
│
▲ Capa 3: Actores y Personajes (Stickman)
│   └── z-20 (Stickman principal y personajes secundarios interactivos)
│
▲ Capa 2: Objetos del Escenario (SceneObject)
│   └── z-10 (Props colocados en el suelo o flotando en el entorno)
│
▲ Capa 1: Fondo Cinemático y Escenario (NarrativeStage)
    └── z-0 (Paredes, pizarrón, puertas, cielo, arquitectura de fondo)
```

### ⚠️ Reglas Críticas de Profundidad
1. **Limitación de Tailwind con Z-Index**: Tailwind CSS **no** tiene clases como `z-25` o `z-35` por defecto. Si usas `className="z-25"`, el navegador lo ignora y el z-index cae a `auto` (0), provocando que el Stickman quede dibujado *por encima* de los objetos frontales.
   - **SOLUCIÓN OBLIGATORIA**: Usa siempre estilos inline para capas intermedias: `style={{ zIndex: 35 }}`.
2. **Coherencia Física y Oclusión**:
   - Si el Stickman está sentado o de pie detrás de un escritorio, pupitre o mostrador, sus piernas **deben estar tapadas físicamente** por la estructura del mueble.
   - Alinea las coordenadas `posicion.y` del Stickman para que su torso y cabeza queden a la vista, mientras la bancada escolar cubre sus caderas y piernas.
3. **Pasillos y Puertas Despejadas**:
   - Si hay una puerta de entrada a la izquierda (ej. `x: 25 a 220`), los muebles de primer plano deben empezar después (ej. `x >= 210`) para dejar el pasillo libre y que la puerta se vea completa desde el techo hasta el suelo.

---

## 4. Animación Esquelética IK/FK y Ciclos Procedurales

El Stickman no es un PNG estático; cuenta con un rig cinemático interpolable en `src/stickman/skeletalRig.ts`:
- **Paso de parámetros indispensable en `Scene.tsx`**:
  Cada personaje evaluado en `Scene.tsx` debe suministrar explícitamente a `<Stickman ... />`:
  - `proceduralMode={ev.proceduralMode}` (`"correr"`, `"caminar"`, `"manipular"`, `"temblar"`, `"estatico"`).
  - `prevPoseId={ev.prevPoseId}` y `poseTransitionProgress={ev.poseTransitionProgress}` para interpolación suave de 2 huesos.
  - `colorRim={ev.colorRim}` y `esHolograma={ev.esHolograma}` si la iluminación o temática lo exige.
- **Fluidez física a 30 FPS**:
  - Toda oscilación procedural debe usar frecuencias suaves (`Math.sin(f * 0.12)` a `Math.sin(f * 0.28)`) y amplitudes moderadas (1.5px a 4px) para evitar vibraciones grotescas.
- **Iluminación diegética**:
  - Si en la escena hay una fuente de luz (una farola de calle, un foco teatral, una linterna), el haz de luz debe conectar geométricamente desde la bombilla/farola hacia el suelo o hacia el actor.

---

## 5. Narrativa, Guion y Monetización

### Estructura Temporal y Retención
- **Duración estricta para monetización**: TikTok y YouTube Shorts solo monetizan a partir de **60 segundos**. La duración del video debe situarse entre **62 y 76 segundos** (o la declarada en `meta.duracionObjetivo`).
- **Estructura dramática**:
  - **Frame 0 (0-2s)**: Gancho demoledor y título visual en grande (`tituloVisual`).
  - **5-10s**: Planteamiento de la curiosidad o dato científico central.
  - **Mitad del video**: Giro inesperado, revelación del estudio o experimento.
  - **Cierre**: Reflexión liberadora o conclusión que invita al bucle (*loop* narrativo).

### Regla Previa Anti-Duplicados
- **Antes de redactar un guion nuevo**, el agente **DEBE inspeccionar** `src/data/historial_temas.json`.
- Si la nueva historia tiene una similitud semántica superior al 65% con algún video anterior, se debe proponer un enfoque o tema completamente distinto.

---

## 6. TTS, Audio, Subtítulos y Normalización Fonética

1. **Normalización Fonética**:
   - Las herramientas de TTS (Chatterbox / edge-tts) pueden equivocarse con números o extranjerismos.
   - Convierte números a palabras completas (ej. "el año dos mil" en lugar de "2000").
   - Ajusta fonéticamente términos anglosajones que la voz en español pronuncie mal (ej. *"jaquearlo"* en lugar de *"hackearlo"* si el sintetizador omite la aspiración).
2. **Subtítulos Estables (`WordSubtitles.tsx`)**:
   - Bloques cortos de 2 a 3 palabras en mayúsculas (`Arial Black`).
   - Palabra activa destacada en amarillo (`#FFE600`).
   - Ubicación en zona segura: `y ≈ 1400 - 1600` y margen derecho para no ser tapados por la interfaz de usuario de TikTok o Shorts.
3. **Efectos de Sonido (SFX)**:
   - Toda escena debe contar con un SFX (`"sfx": "sfx/sfx_....wav"`, volumen `0.18` a `0.26`).
   - Si se requiere un sonido puntual inexistente, sintetízalo con `python scripts/generar_sfx.py <nombre> <tipo>` o con Python `wave`/`numpy`.

---

## 7. Flujo de Trabajo Técnico y Comandos

Sigue siempre este orden exacto al modificar o crear videos:

```bash
# 1. Diseñar o actualizar guion en src/data/guion.json
# (Si agregaste props o poses, regenerar catálogo)
npm run poses:build

# 2. Generar voces y marcas de tiempo palabra por palabra
npm run tts     # o python scripts/generar_voz.py

# 3. Validar esquema, catálogos y ritmo narrativo (0 errores)
npm run validar

# 4. Validar tipos de TypeScript
npx tsc --noEmit

# 5. Previsualizar un frame crítico (still) para verificar capas visuales
npx remotion still ShortSabiasQue out/test_frame.png --frame=<num_frame> --port=3004

# 6. Renderizar video final, ejecutar QA y exportar metadatos
npm run render
```

> **Destino de Entrega**: `npm run render` genera el archivo MP4 y el JSON de metadata en `out/`, valida duración y formato con ffprobe, y los sincroniza automáticamente a `H:\Mi unidad\ShortsMotionGraphics\`.

---

## 8. Trucos Operativos para Agentes de Código (Windows / PowerShell)

1. **Evitar errores de comillas en PowerShell**:
   - Ejecutar scripts de Python multilínea directamente en la consola de PowerShell suele fallar por el escape de comillas dobles y caracteres especiales (`\`, `"`, `$`).
   - **Mejor práctica**: Escribe un script auxiliar temporal (ej. `scripts/temp_fix.py`), ejecútalo con `python scripts/temp_fix.py` y luego bórralo con `Remove-Item`.
2. **Edición Segura con `edit_file` / `write_file`**:
   - En archivos grandes como `NarrativeStage.tsx`, si vas a modificar bloques completos, usa búsquedas exactas con índices o reemplazos limpios para evitar duplicaciones accidentales de etiquetas de cierre (`</div>` o `</svg>`).
3. **Verificación Visual con Herramientas de Imagen**:
   - Siempre que realices un cambio en la composición visual, renderiza un `still` con Remotion y léelo con `read_file` sobre el `.png` para confirmar con tus propios ojos que los personajes, accesorios y fondos se ven perfectos antes de entregar.
