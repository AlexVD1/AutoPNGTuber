import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraRig } from "./CameraRig";
import { NarrativeStage } from "./NarrativeStage";
import { Stickman } from "./Stickman";
import { WordSubtitles } from "./WordSubtitles";
import { evaluateCharacterState } from "../stickman/actionSequences";
import { PersonajeEscena } from "../types";

export const TestNarrativaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = 180; // 6 segundos a 30fps

  // Frame clave del acontecimiento: Momento exacto del toque y susto
  const IMPACT_FRAME = 80;

  // 1. Personaje 1: El Sonámbulo (avanza dormido, recibe el toque y reacciona asustado)
  const sonambulo: PersonajeEscena = useMemo(
    () => ({
      id: "sonambulo",
      nombre: "Sonámbulo",
      posicion: { x: -110, y: 70 },
      escala: 1.05,
      orientacion: "derecha",
      prop: "flashlight",
      acciones: [
        // Fase 1: Caminando dormido por la habitación
        {
          tipo: "personalizada",
          pasos: [
            {
              inicioFrame: 0,
              finFrame: IMPACT_FRAME,
              poseId: "walking",
              expresion: "bored",
              posicion: { x: 100, y: 70 },
              curva: "lineal",
              procedural: "caminar",
              prop: "flashlight",
            },
            // Fase 2: EL SUSTO / REACCIÓN INMEDIATA (Salto atrás, ojos abiertos de golpe, brazos arriba)
            {
              inicioFrame: IMPACT_FRAME,
              finFrame: IMPACT_FRAME + 38,
              poseId: "shock_explosion",
              expresion: "shocked",
              posicion: { x: 190, y: 35 },
              curva: "impacto",
              procedural: "temblar",
              prop: "flashlight",
            },
            // Fase 3: Desorientado tratando de entender qué pasó
            {
              inicioFrame: IMPACT_FRAME + 38,
              finFrame: totalFrames,
              poseId: "backing_away_scared",
              expresion: "confused",
              posicion: { x: 190, y: 70 },
              curva: "suave",
              procedural: "estatico",
            },
          ],
        },
      ],
      habla: false,
      capaZ: 10,
    }),
    [totalFrames]
  );

  // 2. Personaje 2: El Amigo / Narrador (se acerca sigiloso, toca el hombro y retrocede en calma)
  const amigo: PersonajeEscena = useMemo(
    () => ({
      id: "amigo",
      nombre: "Amigo",
      posicion: { x: -440, y: 70 },
      escala: 1.05,
      orientacion: "derecha",
      acciones: [
        {
          tipo: "personalizada",
          pasos: [
            // Fase 1: Acercamiento decidido
            {
              inicioFrame: 0,
              finFrame: IMPACT_FRAME - 16,
              poseId: "walking",
              expresion: "talking_enthusiastic",
              posicion: { x: -60, y: 70 },
              curva: "suave",
              procedural: "caminar",
            },
            // Fase 2: Estirar el brazo y tocar el hombro del sonámbulo
            {
              inicioFrame: IMPACT_FRAME - 16,
              finFrame: IMPACT_FRAME,
              poseId: "pointing_right",
              expresion: "talking_enthusiastic",
              posicion: { x: -20, y: 70 },
              curva: "impacto",
              procedural: "recoil",
            },
            // Fase 3: Reacción al susto del amigo -> retroceso calmante con manos arriba
            {
              inicioFrame: IMPACT_FRAME,
              finFrame: totalFrames,
              poseId: "explaining_both_hands",
              expresion: "worried",
              posicion: { x: -120, y: 70 },
              curva: "suave",
              procedural: "estatico",
            },
          ],
        },
      ],
      habla: true,
      capaZ: 15,
    }),
    [totalFrames]
  );

  const evalSonambulo = evaluateCharacterState(sonambulo, frame, fps, totalFrames);
  const evalAmigo = evaluateCharacterState(amigo, frame, fps, totalFrames);

  // Cambio de composición dinámico:
  // Del frame 0 al 79: 'plano_general' (para ver el escenario completo y la aproximación)
  // A partir del frame 80: 'primer_plano' (para sentir el susto y la conmoción en el rostro)
  const composicion = frame >= IMPACT_FRAME ? "primer_plano" : "plano_general";
  const hasContact = frame >= IMPACT_FRAME && frame <= IMPACT_FRAME + 8;

  // Subtítulos sincronizados
  const palabrasPrueba = [
    { palabra: "De", inicioMs: 0, finMs: 280 },
    { palabra: "pronto,", inicioMs: 280, finMs: 800 },
    { palabra: "decides", inicioMs: 1100, finMs: 1700 },
    { palabra: "despertarlo...", inicioMs: 1700, finMs: 2500 },
    { palabra: "¡Y", inicioMs: 2700, finMs: 2900 },
    { palabra: "SE", inicioMs: 2900, finMs: 3300 },
    { palabra: "ASUSTA!", inicioMs: 3300, finMs: 4400 },
  ];

  return (
    <CameraRig
      transicion="corte"
      efectosCamara={["drift"]}
      composicionVisual={composicion}
      impactFrame={IMPACT_FRAME}
      durationInFrames={totalFrames}
    >
      <AbsoluteFill className="flex flex-col justify-between items-center bg-transparent overflow-hidden">
        {/* Audio de narración */}
        <Audio src={staticFile("audios/escena_3.mp3")} volume={1.0} />

        {/* SFX 1: Sonido de aproximación rápida */}
        <Sequence from={20} durationInFrames={35}>
          <Audio src={staticFile("sfx/sfx_whoosh.wav")} volume={0.22} />
        </Sequence>

        {/* SFX 2: Impacto dramático exactamente en el toque / susto */}
        <Sequence from={IMPACT_FRAME} durationInFrames={45}>
          <Audio src={staticFile("sfx/sfx_dramatic_hit.wav")} volume={0.32} />
        </Sequence>

        {/* Escenario ilustrado: Habitación nocturna con ventana a la luna y cama */}
        <NarrativeStage
          escenario="habitacion_noche"
          composicionVisual={composicion}
          frame={frame}
        />

        {/* Badge superior compacto que contextualiza la acción */}
        <div className="w-full flex items-center justify-center pt-6 z-30 pointer-events-none">
          <div
            className="flex items-center gap-3 px-6 py-2.5 bg-white border-4 border-black rounded-full shadow-[5px_5px_0px_#000]"
            style={{
              transform: `scale(${frame >= IMPACT_FRAME ? 1.08 : 1.0})`,
              transition: "transform 0.15s ease",
            }}
          >
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{
                backgroundColor: frame >= IMPACT_FRAME ? "#EF4444" : "#F59E0B",
              }}
            />
            <span className="text-xl font-black tracking-wider uppercase text-black">
              {frame >= IMPACT_FRAME
                ? "¡REACCIÓN INESPERADA!"
                : "ACERCÁNDOSE AL SONÁMBULO"}
            </span>
          </div>
        </div>

        {/* Capa de personajes en movimiento y coordinados */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {/* Personaje 1: Sonámbulo */}
          <div
            className="absolute"
            style={{
              zIndex: 10,
              transform: `translate(${evalSonambulo.x}px, ${evalSonambulo.y}px)`,
            }}
          >
            <Stickman
              poseId={evalSonambulo.poseId}
              expresion={evalSonambulo.expresion}
              prop={evalSonambulo.prop}
              props={evalSonambulo.props}
              orientacion={evalSonambulo.orientacion}
              escala={evalSonambulo.escala}
              posicion={{ x: 0, y: 0 }}
              headTiltOffset={evalSonambulo.headTilt}
              vibrationOffset={evalSonambulo.vibrationX}
              animacionEntrada="ninguna"
              overrideIsSpeaking={false}
            />
          </div>

          {/* Personaje 2: Amigo que despierta */}
          <div
            className="absolute"
            style={{
              zIndex: 15,
              transform: `translate(${evalAmigo.x}px, ${evalAmigo.y}px)`,
            }}
          >
            <Stickman
              poseId={evalAmigo.poseId}
              expresion={evalAmigo.expresion}
              prop={evalAmigo.prop}
              props={evalAmigo.props}
              orientacion={evalAmigo.orientacion}
              escala={evalAmigo.escala}
              posicion={{ x: 0, y: 0 }}
              headTiltOffset={evalAmigo.headTilt}
              vibrationOffset={evalAmigo.vibrationX}
              animacionEntrada="ninguna"
              palabras={palabrasPrueba}
              overrideIsSpeaking={frame < IMPACT_FRAME}
            />
          </div>
        </div>

        {/* Chispas/Estallido cósmico de impacto neo-brutalista en el frame del toque */}
        {hasContact && (
          <div
            className="absolute pointer-events-none z-40"
            style={{
              left: 540 + 90,
              top: 960 - 20,
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg width="180" height="180" viewBox="0 0 140 140">
              <path
                d="M 70 10 L 82 48 L 122 32 L 94 66 L 132 86 L 90 96 L 102 136 L 70 106 L 40 134 L 50 90 L 10 82 L 48 62 L 20 24 L 62 48 Z"
                fill="#FFE600"
                stroke="#000000"
                strokeWidth="5"
              />
              <circle cx="70" cy="70" r="14" fill="#EF4444" stroke="#000" strokeWidth="4" />
            </svg>
          </div>
        )}

        {/* Subtítulos neo-brutalistas */}
        <div className="w-full flex items-center justify-center pb-20 z-30 pointer-events-none h-[280px]">
          <WordSubtitles
            palabras={palabrasPrueba}
            palabrasClave={["despertarlo", "ASUSTA"]}
          />
        </div>
      </AbsoluteFill>
    </CameraRig>
  );
};
