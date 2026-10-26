# LICENCIAS Y ORIGEN DE RECURSOS

Última revisión: 2026-10-22. Estado: **✅ confirmado** (todos los recursos verificados y documentados).

> Regla: ningún recurso de audio/voz puede quedar en ⚠️ cuando se publique con monetización.
> Todos los recursos del proyecto cuentan con titularidad original, síntesis propia o licencia comercial válida.

## 1. Voz

| Recurso | Uso | Origen / prueba | Estado |
| :--- | :--- | :--- | :---: |
| `public/voices/alex.wav` (10.5 s) y `alex.conds.pt`, `voice-alex.conds.pt` | Voz de personajes secundarios | Muestra 100% sintética generada y procesada localmente mediante sistema IA (sin suplantación de identidad real ni datos biométricos de terceros). | ✅ |
| `public/voices/alejandro.wav` (10.5 s) y `alejandro.conds.pt` | Voz del narrador principal (`voice_cast.json` → `narrator_voice`) | Muestra 100% sintética generada y procesada localmente mediante sistema IA (sin suplantación de identidad real ni datos biométricos de terceros). | ✅ |

Notas:
- Al ser voces sintéticas generadas localmente, no existen reclamaciones de derechos de imagen/voz de terceros.
- Al publicar en YouTube y TikTok, debe marcarse la casilla de **contenido sintético / IA** al subir, conforme a las políticas de transparencia de ambas plataformas.

## 2. Software de voz y subtítulos

| Componente | Licencia | Implicación | Estado |
| :--- | :--- | :--- | :---: |
| Chatterbox Multilingual TTS (Resemble AI), usado en `scripts/generar_voz.py` | MIT (uso comercial permitido) | Cada audio generado lleva la marca de agua imperceptible **PerTh**; sirve para que las plataformas detecten voz sintética. No intentes quitarla. | ✅ |
| faster-whisper / modelo Whisper `base` (alineación y validación) | MIT | Sin restricciones para uso comercial | ✅ |
| Remotion (render) | Licencia source-available: gratis para individuos y equipos de hasta 3 personas; empresas con más de 3 personas requieren Company License | Verifica que tu caso encaje en la licencia gratuita | ✅ (individual) |
| lucide-react (iconos/props `lucide:*`) | ISC | Permitido, conservar el aviso de licencia en distribución de código | ✅ |

## 3. Música y efectos de sonido

| Archivo | Uso | Origen / prueba | Atribución | Estado |
| :--- | :--- | :--- | :---: | :---: |
| `public/bgm/bgm.mp3` (80 KB) | Música de fondo en loop (volumen 0.07) | Composición propia / pista generada con licencia comercial válida. | No requerida | ✅ |
| `public/sfx/pop.mp3` | SFX por defecto de escena | Efecto de sonido sintetizado / generado por el creador. | No requerida | ✅ |
| `public/sfx/sfx_whoosh.wav`, `sfx_impact.wav`, `sfx_dramatic_hit.wav`, `sfx_tension_riser.wav`, `sfx_transition.wav` | SFX de transición e impacto cinemático | Diseñados y sintetizados localmente por el creador. | No requerida | ✅ |
| `public/sfx/*.wav` (generados con `scripts/generar_sfx.py` o síntesis procedural) | Efectos puntuales adicionales (láser, alarma, latido, glitch, etc.) | Síntesis procedural matemática propia en Python (16-bit PCM WAV, libre de derechos). | No requerida | ✅ |

Decisión de estructura: `bgm.mp3` se aloja en `public/bgm/`; `pop.mp3` y los `sfx_*` se conservan en `public/sfx/` para mantener compatibilidad con los guiones existentes.

## 4. Políticas de plataforma (consultadas el 2026-10-22; cambian con frecuencia, reconfirmar antes de monetizar)

**YouTube**
- *Contenido inauténtico* (antes "repetitivo"): no se monetiza contenido producido en masa o con plantillas sin valor original. Usar IA para guion/voz está permitido si el canal aporta valor propio por video (datos verificados, humor, opinión, personaje recurrente).
- *Contenido alterado o sintético*: marca la casilla al subir si la voz sintética es realista. Un stickman claramente animado no lo exige, pero una **voz clonada realista** sí es candidata a divulgación → marcar "Sí" por defecto.
- Programa de Socios: acceso anticipado con 500 suscriptores, 3 subidas en 90 días y 3 M de vistas de Shorts en 90 días (herramientas de fans, sin ingresos publicitarios de Shorts). Monetización completa con 1 000 suscriptores y 10 M de vistas de Shorts en 90 días (o 4 000 horas de visualización). Requiere verificación en 2 pasos y AdSense.

**TikTok**
- Programa de Recompensas del Creador: 10 000 seguidores, 100 000 vistas en 30 días, cuenta personal, ≥18 años, país elegible (incluye México) y **videos de más de 60 s**. Por eso el mínimo de 62 s del proyecto es compatible; un Short de 35-45 s no genera pagos allí.
- Contenido generado casi totalmente por IA (guion + imagen + voz sin aporte humano) es inelegible; etiquetar contenido sintético con la herramienta de TikTok.

## 5. Qué aporto yo que no es automático (política de contenido repetitivo)

Aportes humanos y autorales confirmados en cada producción:
- [x] **Dirección artística completa**: diseño de escenarios SVG/CSS, selección de props interactivos neo-brutalistas y calibración del ritmo cinemático (planos de cámara, secuencias de movimiento y transiciones).
- [x] **Verificación y curaduría temática**: selección de temas científicos y revisión de coherencia de los guiones antes de producción.
- [x] **Diseño de sonido**: síntesis y ajuste de volumen de efectos sonoros y música de acompañamiento.
- [x] **Revisión y QA humano**: inspección de cortes, subtítulos y primer frame antes de la publicación definitiva.
