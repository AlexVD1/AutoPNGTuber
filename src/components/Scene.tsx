import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EscenaGuion, PersonajeEscena } from "../types";
import { evaluateCharacterState } from "../stickman/actionSequences";
import { AnimatedIcon } from "./AnimatedIcon";
import { CameraRig } from "./CameraRig";
import { NarrativeElements } from "./NarrativeElements";
import { NarrativeStage } from "./NarrativeStage";
import { SceneObject } from "./SceneObject";
import { Stickman } from "./Stickman";
import { WordSubtitles } from "./WordSubtitles";

interface SceneProps {
  escena: EscenaGuion;
}

/**
 * Comprueba de forma segura si un archivo estático existe en public/ sin lanzar error.
 */
function fileExistsInStatic(targetRelativePath: string): boolean {
  try {
    const files = getStaticFiles();
    if (!files || files.length === 0) {
      return true;
    }
    const normalizedTarget = targetRelativePath
      .replace(/\\/g, "/")
      .toLowerCase();
    return files.some((f) => {
      const name = (f.name || "").replace(/\\/g, "/").toLowerCase();
      const src = (f.src || "").replace(/\\/g, "/").toLowerCase();
      return name.endsWith(normalizedTarget) || src.includes(normalizedTarget);
    });
  } catch {
    return false;
  }
}

export const Scene: React.FC<SceneProps> = ({ escena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDurationFrames = Math.max(
    1,
    Math.round((escena.duracionSegundos ?? 4) * fps)
  );

  // SFX inteligente: busca escena.sfx o recurre al pop.mp3 clásico
  const sfxPath = escena.sfx || "sfx/pop.mp3";
  const sfxVolume = escena.volumenSfx ?? (escena.sfx ? 0.24 : 0.18);
  const hasSfx = useMemo(() => fileExistsInStatic(sfxPath), [sfxPath]);

  // Lista normalizada de personajes (soporta tanto personajes múltiples como legacy)
  const personajesList: PersonajeEscena[] = useMemo(() => {
    if (escena.personajes && escena.personajes.length > 0) {
      return escena.personajes;
    }
    // Personaje por defecto basado en los campos clásicos de la escena
    return [
      {
        id: "principal",
        poseId: escena.poseId ?? escena.pose,
        expresion: escena.expresion,
        prop: escena.prop,
        props: escena.props,
        efectoAmbiente: escena.efectoAmbiente,
        posicion: escena.posicion ?? { x: 0, y: 0 },
        escala: escena.escala ?? 1,
        orientacion: escena.orientacion ?? "derecha",
        animacionEntrada: escena.animacionEntrada ?? "rebote",
        habla: true,
      },
    ];
  }, [
    escena.personajes,
    escena.poseId,
    escena.pose,
    escena.expresion,
    escena.prop,
    escena.props,
    escena.efectoAmbiente,
    escena.posicion,
    escena.escala,
    escena.orientacion,
    escena.animacionEntrada,
  ]);

  // Evaluación cinemática de cada personaje en el frame actual
  const evaluatedCharacters = personajesList.map((p) => {
    const evalState = evaluateCharacterState(p, frame, fps, sceneDurationFrames);
    return {
      ...p,
      evaluated: evalState,
    };
  });

  // Detectar si en este frame exacto ocurre un impacto de contacto
  const hasContactImpact = evaluatedCharacters.some(
    (c) => c.evaluated.isContactImpact
  );

  // Auto-director cinematográfico inteligente si el guion no especificó puesta en escena manual
  const escenarioFinal = useMemo(() => {
    if (escena.escenario) return escena.escenario;
    const t = (escena.texto || "").toLowerCase();
    if (/luna|espacio|universo|planeta|estrella|galaxia|marte|gravedad|orbita|cohete/i.test(t)) {
      return "lunar";
    }
    if (/dormir|cama|sueño|noche|sonambulo|sonámbulo|habitacion|habitación|dormido/i.test(t)) {
      return "habitacion_noche";
    }
    if (/ciencia|quimica|química|laboratorio|experimento|celula|célula|atomo|átomo|virus|formula/i.test(t)) {
      return "laboratorio";
    }
    return "vacio";
  }, [escena.escenario, escena.texto]);

  const composicionFinal = useMemo(() => {
    if (escena.composicionVisual) return escena.composicionVisual;
    const t = (escena.texto || "").toLowerCase();
    if (/\d+([.,]\d+)?\s*(%|veces|km|segundos|metros|por ciento)/i.test(t)) {
      return "cifras_concepto";
    }
    if (/¡|ojo|cuidado|increible|increíble|sorprendente|peligro|miedo/i.test(t)) {
      return "primer_plano";
    }
    if (escena.id === 1) {
      return "plano_general";
    }
    return escenarioFinal !== "vacio" ? "escenario_ilustrado" : "minimalista";
  }, [escena.composicionVisual, escena.texto, escena.id, escenarioFinal]);

  const composicion = composicionFinal;
  const isNarrativeMode =
    escena.layout === "narrativo" ||
    escena.layout === "compacto" ||
    composicion === "primer_plano" ||
    composicion === "plano_general" ||
    composicion === "escenario_ilustrado" ||
    Boolean(escena.personajes && escena.personajes.length > 1) ||
    Boolean(escena.elementosNarrativos && escena.elementosNarrativos.length > 0) ||
    escenarioFinal !== "vacio";

  return (
    <AbsoluteFill className="relative overflow-hidden bg-[#F8FAFC]">
      {/* Audio de locución de la escena (prioridad 1.0) */}
      <Audio src={staticFile(`audios/escena_${escena.id}.mp3`)} volume={1.0} />

      {/* Efecto de sonido sincronizado (prioridad subordinada 0.18 - 0.25) */}
      {hasSfx && <Audio src={staticFile(sfxPath)} volume={sfxVolume} />}

      {/* 1. MUNDO CINEMATOGRÁFICO: Escenario, props y personajes afectados por la cámara */}
      <div className="absolute inset-0 z-0">
        <CameraRig
          transicion={escena.transicion ?? "zoom_in"}
          efectosCamara={escena.efectosCamara ?? ["drift"]}
          composicionVisual={composicion}
          impactFrame={hasContactImpact ? frame : undefined}
          durationInFrames={sceneDurationFrames}
        >
          {/* Escenario ilustrado de fondo con capas de profundidad */}
          <NarrativeStage
            escenario={escenarioFinal}
            composicionVisual={composicion}
            frame={frame}
          />

          {/* Elementos narrativos vectoriales interactivos (velocímetro, olas, viñetas) */}
          <NarrativeElements elementos={escena.elementosNarrativos} />

          {/* Props y objetos interactivos en el escenario */}
          {escena.objetos &&
            escena.objetos.map((obj) => (
              <SceneObject key={obj.id} objeto={obj} frame={frame} />
            ))}

          {/* Escenario de personajes actuando de forma continua */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {evaluatedCharacters.map((char) => {
              const ev = char.evaluated;
              return (
                <div
                  key={char.id}
                  className="absolute"
                  style={{
                    zIndex: char.capaZ ?? 10,
                    transform: `translate(${ev.x}px, ${ev.y}px)`,
                  }}
                >
                  <Stickman
                    poseId={ev.poseId}
                    expresion={ev.expresion}
                    prop={ev.prop}
                    props={ev.props}
                    efectoAmbiente={char.efectoAmbiente}
                    orientacion={ev.orientacion}
                    escala={ev.escala}
                    posicion={{ x: 0, y: 0 }}
                    headTiltOffset={ev.headTilt}
                    vibrationOffset={ev.vibrationX}
                    animacionEntrada={char.animacionEntrada ?? "ninguna"}
                    palabras={escena.palabras}
                    overrideIsSpeaking={
                      char.habla !== undefined ? (char.habla ? undefined : false) : undefined
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* Chispas/Impacto visual cuando dos personajes u objetos interactúan */}
          {hasContactImpact && (
            <div
              className="absolute pointer-events-none z-40"
              style={{
                left: "50%",
                top: "52%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <svg width="140" height="140" viewBox="0 0 140 140">
                <path
                  d="M 70 10 L 80 50 L 120 35 L 90 68 L 130 85 L 88 95 L 98 135 L 68 105 L 42 130 L 50 88 L 12 80 L 48 60 L 22 25 L 60 48 Z"
                  fill="#FFE600"
                  stroke="#000000"
                  strokeWidth="5"
                />
              </svg>
            </div>
          )}
        </CameraRig>
      </div>

      {/* 2. CAPA HUD SUPERIOR E INFERIOR (Subtítulos y Rótulo inmunes al zoom de la cámara) */}
      <AbsoluteFill className="flex flex-col justify-between items-center pointer-events-none z-30">
        {/* Encabezado: Tarjeta compacta o clásica según el layout de la escena */}
        {isNarrativeMode ? (
          <div className="w-full flex items-center justify-center pt-4">
            <AnimatedIcon
              icono={escena.icono}
              colorIcono={escena.colorIcono}
              tituloVisual={escena.tituloVisual}
              compacto={true}
            />
          </div>
        ) : (
          <div className="w-full h-[660px] flex items-center justify-center">
            <AnimatedIcon
              icono={escena.icono}
              colorIcono={escena.colorIcono}
              tituloVisual={escena.tituloVisual}
              compacto={false}
            />
          </div>
        )}

        {/* Abajo: Subtítulos de alto contraste con margen seguro adaptativo */}
        <div
          className={`w-full flex items-center justify-center pb-20 ${
            isNarrativeMode ? "h-[320px]" : "h-[360px]"
          }`}
        >
          <WordSubtitles
            palabras={escena.palabras ?? []}
            palabrasClave={escena.palabrasClave}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
