# CHECKLIST DE PUBLICACIÓN

## Antes de subir (2 minutos por video)

- [ ] `npm run validar` sin errores y `npm run render` terminó con `[QA] ✅`.
- [ ] **Primer frame**: se ve el título corto grande (no pantalla vacía ni animación lenta).
- [ ] **Subtítulos**: dentro de la franja y≈1400-1600, sin palabras desordenadas ni partidas fuera de pantalla (revisa un frame cada 5 s).
- [ ] **Datos**: cada cifra o afirmación contrastada con una fuente; la fuente está en `fuentes` del metadata.
- [ ] **Props**: cada prop se reconoce en 0.5 s (si no, usa `lucide:*` o quítalo).
- [ ] **Metadata** (`out/<slug>_metadata.json`): título ≤ 60 caracteres, descripción ≤ 500, hashtags acordes al tema, `estado: "pendiente"`.
- [ ] **Divulgación de IA**: marcar "contenido sintético" en YouTube (Studio → Detalles) y la etiqueta de IA en TikTok, porque la voz es clonada y realista.
- [ ] `docs/LICENCIAS.md` sin ⚠️ en voz, música y SFX usados.
- [ ] Mover MP4 + metadata de `out/` a `out/pendientes/` (programado) o `out/publicados/` (ya subido) y actualizar `estado` y `fecha_publicacion`.

## Después de subir

- [ ] Responder comentarios en las primeras horas.
- [ ] A las 48 h anotar las métricas en `docs/SEGUIMIENTO.csv`.

## Ritmo y formatos

- 3 videos por semana al inicio (no los 30 de golpe).
- Mezclar formatos: mito vs realidad, comparativa, historia.
- Tras 10 videos en `SEGUIMIENTO.csv`: repetir lo que supere la mediana de retención y descartar lo que quede por debajo.
- Versión en inglés: adaptar los 3 mejores (guion, voz y metadata) y anotar `idioma_alterno` en el metadata original.

## Experimento de duración (Fase 4)

1. Producir 5 videos cortos (`"duracionObjetivo": [35, 45]`) y 5 medios (`[60, 75]`) del mismo estilo (marca `grupo` = `corto` / `medio` en el CSV). Ojo: TikTok solo paga videos de más de 60 s.
2. Registrar a las 48 h: vistas, retención media y % visto frente a deslizado.
3. La duración estándar se elige con esos datos, no por regla.
