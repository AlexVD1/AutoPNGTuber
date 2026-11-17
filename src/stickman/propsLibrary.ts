export type PropFamily =
  | "educacion_ciencia"
  | "tecnologia"
  | "vida_cotidiana"
  | "naturaleza_alimentos"
  | "historia_exploracion"
  | "reacciones_humor"
  | "herramientas_objetos";

export type PropPlacement = "right" | "left" | "overhead" | "both";

export interface PropDef {
  id: string;
  name: string;
  family: PropFamily;
  defaultPlacement: PropPlacement;
  svg: string;
  /** Versión animada determinista (partes que laten, giran, cambian de estado o evolucionan según progreso 0..1). */
  animatedSvg?: (frame: number, progress?: number, state?: string) => string;
  tags: string[];
}

const S = "#111827";

// ===========================================================================
// PROPS ILUSTRADOS ANIMADOS (Neo-Brutalismo a color, deterministas por frame)
// Cada función devuelve el SVG del prop para el frame dado (viewBox -55..55).
// ===========================================================================
const n = (v: number) => v.toFixed(2);
const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.min(1, Math.max(0, t)) * Math.PI);

/** Molécula de agua H2O (oxígeno rojo + 2 hidrógenos blancos). */
const h2o = (x: number, y: number, rot = 0, s = 1) =>
  `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(rot)}) scale(${s})"><circle cx="-5" cy="4" r="3" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/><circle cx="5" cy="4" r="3" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/><circle cx="0" cy="0" r="4.5" fill="#EF4444" stroke="${S}" stroke-width="1.8"/></g>`;

/** Arco SVG (ángulos en grados, sentido horario desde +X). */
const arcPath = (r: number, a0: number, a1: number) => {
  const p = (a: number) => `${n(Math.cos((a * Math.PI) / 180) * r)} ${n(Math.sin((a * Math.PI) / 180) * r)}`;
  return `M ${p(a0)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
};

const depthSonarMarker = (f: number) => {
  const t = easeInOut(f / 150);
  const y = -40 + t * 78;
  const depth = Math.round(t * 10994).toLocaleString("es-MX");
  const bands = ["#7DD3FC", "#0EA5E9", "#0369A1", "#1E3A8A", "#0B1028"]
    .map((c, i) => `<rect x="-6" y="${-42 + i * 17}" width="26" height="17" fill="${c}"/>`)
    .join("");
  const ticks = [0, 1, 2, 3, 4, 5]
    .map((i) => `<line x1="20" y1="${-42 + i * 17}" x2="28" y2="${-42 + i * 17}" stroke="${S}" stroke-width="3"/>`)
    .join("");
  const glow = t >= 1 ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
  return `<rect x="-10" y="-48" width="34" height="96" rx="8" fill="#0F172A" stroke="${S}" stroke-width="5"/>${bands}${ticks}<text x="30" y="-38" font-size="8" font-weight="900" font-family="'Arial Black', sans-serif" fill="#FFFFFF" stroke="${S}" stroke-width="2.5" paint-order="stroke">0 m</text><text x="30" y="46" font-size="8" font-weight="900" font-family="'Arial Black', sans-serif" fill="#FFE600" stroke="${S}" stroke-width="2.5" paint-order="stroke">11 km</text><circle cx="7" cy="40" r="${n(6 + glow * 6)}" fill="#67E8F9" opacity="${n(glow * 0.6)}"/><g transform="translate(0 ${n(y)})"><polygon points="-22,-7 -8,0 -22,7" fill="#EF4444" stroke="${S}" stroke-width="3" stroke-linejoin="round"/><line x1="-8" y1="0" x2="20" y2="0" stroke="#FFE600" stroke-width="3" stroke-dasharray="4 3"/><text x="-56" y="3" font-size="8.5" font-weight="900" font-family="'Arial Black', sans-serif" fill="#FFFFFF" stroke="${S}" stroke-width="2.5" paint-order="stroke">-${depth} m</text></g>`;
};

const pressureGaugeBursting = (f: number) => {
  const shakeX = Math.sin(f * 2.3) * 1.6;
  const needle = 382 + Math.sin(f * 1.7) * 9 + Math.sin(f * 4.1) * 3;
  const nx = Math.cos((needle * Math.PI) / 180) * 24;
  const ny = Math.sin((needle * Math.PI) / 180) * 24;
  const ticks = [...Array(9)]
    .map((_, i) => {
      const a = ((135 + i * 33.75) * Math.PI) / 180;
      return `<line x1="${n(Math.cos(a) * 22)}" y1="${n(Math.sin(a) * 22)}" x2="${n(Math.cos(a) * 28)}" y2="${n(Math.sin(a) * 28)}" stroke="${S}" stroke-width="2.5"/>`;
    })
    .join("");
  const puffs = [0, 1, 2]
    .map((k) => {
      const t = ((f + k * 12) % 36) / 36;
      return `<circle cx="${n(12 + t * 34)}" cy="${n(38 - t * 26)}" r="${n(4 + t * 9)}" fill="#F8FAFC" stroke="${S}" stroke-width="2" opacity="${n(1 - t)}"/>`;
    })
    .join("");
  return `<g transform="translate(${n(shakeX)} 0)"><rect x="-8" y="30" width="16" height="16" fill="#94A3B8" stroke="${S}" stroke-width="4"/><rect x="-18" y="44" width="36" height="9" rx="2" fill="#64748B" stroke="${S}" stroke-width="4"/><circle cx="3" cy="3" r="38" fill="${S}"/><circle cx="0" cy="0" r="38" fill="#CBD5E1" stroke="${S}" stroke-width="6"/><circle cx="0" cy="0" r="30" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><path d="${arcPath(25, 135, 240)}" stroke="#22C55E" stroke-width="6" fill="none"/><path d="${arcPath(25, 240, 320)}" stroke="#FACC15" stroke-width="6" fill="none"/><path d="${arcPath(25, 320, 405)}" stroke="#EF4444" stroke-width="6" fill="none"/>${ticks}<text x="0" y="17" text-anchor="middle" font-size="9" font-weight="900" font-family="'Arial Black', sans-serif" fill="#DC2626">1100</text><text x="0" y="25" text-anchor="middle" font-size="5.5" font-weight="900" font-family="'Arial Black', sans-serif" fill="${S}">ATM</text><line x1="0" y1="0" x2="${n(nx)}" y2="${n(ny)}" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="0" r="5" fill="${S}"/><path d="M -22 -18 L -12 -10 L -16 -2 L -6 4 M -12 -10 L -2 -16" stroke="${S}" stroke-width="2" fill="none"/><path d="M -24 -14 Q -20 -24 -10 -27" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>${puffs}</g>`;
};

const airliner = (y: number, x: number, stripe: string) =>
  `<g transform="translate(${x} ${y})"><polygon points="-6,4 10,4 -4,14 -16,14" fill="#CBD5E1" stroke="${S}" stroke-width="3" stroke-linejoin="round"/><polygon points="-40,-2 -46,-14 -36,-14 -30,-2" fill="${stripe}" stroke="${S}" stroke-width="3" stroke-linejoin="round"/><rect x="-42" y="-4" width="84" height="13" rx="6.5" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/><line x1="-36" y1="5" x2="36" y2="5" stroke="${stripe}" stroke-width="2.5"/><path d="M 34 -2 Q 40 -1 41 2" stroke="${S}" stroke-width="2.5" fill="none"/>${[-24, -16, -8, 0, 8, 16, 24]
    .map((wx) => `<circle cx="${wx}" cy="0" r="1.8" fill="#38BDF8"/>`)
    .join("")}</g>`;

const airlinerStack = (f: number) => {
  const squash = 1 - Math.max(0, Math.sin(f / 8)) * 0.07;
  const arrowY = Math.abs(Math.sin(f / 6)) * 5;
  return `<g transform="translate(0 40) scale(1 ${n(squash)}) translate(0 -40)">${airliner(-38, 3, "#EF4444")}${airliner(-20, -4, "#3B82F6")}${airliner(-2, 4, "#F59E0B")}${airliner(16, -2, "#10B981")}</g><rect x="-40" y="34" width="80" height="14" rx="7" fill="#FDBA74" stroke="${S}" stroke-width="4"/><path d="M -20 41 L 20 41" stroke="#C2410C" stroke-width="2.5" stroke-dasharray="5 4"/><g transform="translate(0 ${n(arrowY)})"><path d="M -50 -6 L -50 22 M -56 16 L -50 24 L -44 16" stroke="#DC2626" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M 50 -6 L 50 22 M 44 16 L 50 24 L 56 16" stroke="#DC2626" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g><circle cx="36" cy="-46" r="14" fill="#FFE600" stroke="${S}" stroke-width="4"/><text x="36" y="-42" text-anchor="middle" font-size="11" font-weight="900" font-family="'Arial Black', sans-serif" fill="${S}">x50</text>`;
};

const lungsCompressing = (f: number) => {
  const c = easeInOut(f / 120);
  const s = 1 - 0.45 * c + (c >= 1 ? Math.sin(f * 1.9) * 0.012 : 0);
  const wrinkle = n(c * 0.9);
  const arrowX = 6 * (1 - Math.abs(Math.sin(f / 7)));
  const lobe = (dir: number) =>
    `<path d="M ${4 * dir} -18 C ${30 * dir} -34 ${44 * dir} -6 ${40 * dir} 22 C ${38 * dir} 36 ${16 * dir} 38 ${6 * dir} 30 Z" fill="#FB7185" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><path d="M ${10 * dir} -12 C ${26 * dir} -22 ${34 * dir} -8 ${34 * dir} 6" stroke="#FECDD3" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M ${6 * dir} -10 L ${18 * dir} 4 L ${16 * dir} 18 M ${18 * dir} 4 L ${28 * dir} 12" stroke="#BE123C" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M ${14 * dir} 22 q ${4 * dir} -4 ${8 * dir} 0 t ${8 * dir} 0 M ${22 * dir} -4 q ${4 * dir} -4 ${8 * dir} 0" stroke="${S}" stroke-width="2" fill="none" opacity="${wrinkle}"/>`;
  return `<g transform="translate(0 -4) scale(${n(s)}) translate(0 4)"><path d="M 0 -46 L 0 -18 M 0 -18 L -8 -10 M 0 -18 L 8 -10" stroke="${S}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M 0 -46 L 0 -18 M 0 -18 L -8 -10 M 0 -18 L 8 -10" stroke="#FECACA" stroke-width="5" stroke-linecap="round" fill="none"/>${lobe(-1)}${lobe(1)}</g><g transform="translate(${n(arrowX)} 0)"><path d="M -54 4 L -42 4 M -47 -1 L -41 4 L -47 9" stroke="#0EA5E9" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g><g transform="translate(${n(-arrowX)} 0)"><path d="M 54 4 L 42 4 M 47 -1 L 41 4 L 47 9" stroke="#0EA5E9" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g><g transform="translate(38 38) scale(${n(0.6 + c * 0.4)})" opacity="${n(0.3 + c * 0.7)}"><path d="M 0 -8 C -12 -14 -14 4 -6 10 C -3 12 3 12 6 10 C 14 4 12 -14 0 -8 Z" fill="#DC2626" stroke="${S}" stroke-width="3.5"/><path d="M 0 -8 L 1 -14" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/><path d="M 1 -13 Q 7 -16 8 -11 Q 3 -10 1 -13 Z" fill="#22C55E" stroke="${S}" stroke-width="1.8"/></g>`;
};

const eardrumRupture = (f: number) => {
  const flash = Math.max(0, Math.sin(f / 5));
  const waveX = (f * 1.2) % 14;
  const drops = [0, 1, 2]
    .map((k) => {
      const t = ((f + k * 15) % 45) / 45;
      return `<path d="M ${-30 + k * 9} ${n(26 + t * 22)} q -3 5 0 7 q 3 -2 0 -7 Z" fill="#38BDF8" stroke="${S}" stroke-width="1.5" opacity="${n(1 - t)}"/>`;
    })
    .join("");
  const waves = [0, 1, 2]
    .map((k) => `<path d="M ${n(-56 + waveX + k * 7)} -14 q 3 4 0 8 q -3 4 0 8 q 3 4 0 8" stroke="#0EA5E9" stroke-width="3" fill="none" stroke-linecap="round" opacity="${n(0.4 + k * 0.25)}"/>`)
    .join("");
  return `${waves}<path d="M -12 -40 C -40 -40 -44 -6 -32 8 C -26 16 -28 30 -16 36 C -6 40 2 30 -2 22 C -6 14 4 10 4 -4 C 4 -22 4 -40 -12 -40 Z" fill="#FDBA74" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><path d="M -12 -28 C -28 -28 -30 -8 -20 0 C -14 6 -16 14 -10 18" stroke="#C2410C" stroke-width="3.5" stroke-linecap="round" fill="none"/><rect x="-2" y="-8" width="32" height="14" rx="7" fill="#FECACA" stroke="${S}" stroke-width="4"/><rect x="0" y="-4" width="${n(10 + waveX)}" height="6" rx="3" fill="#38BDF8"/><ellipse cx="34" cy="-1" rx="7" ry="20" fill="#FDE68A" stroke="${S}" stroke-width="4"/><path d="M 32 -16 L 37 -8 L 31 -1 L 37 6 L 32 14" stroke="#DC2626" stroke-width="2.8" stroke-linejoin="round" fill="none"/><g transform="translate(42 -1) scale(${n(0.5 + flash * 0.7)})" opacity="${n(flash)}"><polygon points="0,-12 3,-4 12,-6 5,1 10,9 1,5 -4,12 -3,3 -12,2 -4,-3" fill="#FFE600" stroke="${S}" stroke-width="2.5" stroke-linejoin="round"/></g>${drops}`;
};

const cellWaterPressure = (f: number) => {
  const sq = Math.sin(f / 7) * 0.05;
  const pull = easeInOut(f / 140);
  const mols = [...Array(8)]
    .map((_, k) => {
      const a = (k / 8) * Math.PI * 2 + 0.4;
      const r = 26 - pull * 9;
      const jx = Math.sin(f * 0.9 + k * 2) * 1.6;
      const jy = Math.cos(f * 1.1 + k) * 1.6;
      return h2o(Math.cos(a) * r + jx, Math.sin(a) * r + jy, k * 45 + f * 3, 0.9);
    })
    .join("");
  const arrows = [0, 90, 180, 270]
    .map((a) => {
      const d = 50 - Math.abs(Math.sin(f / 6)) * 5;
      return `<g transform="rotate(${a}) translate(${n(d)} 0)"><path d="M 0 0 L -10 0 M -5 -5 L -11 0 L -5 5" stroke="#FFE600" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M 0 0 L -10 0 M -5 -5 L -11 0 L -5 5" stroke="#0EA5E9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
    })
    .join("");
  return `<g transform="scale(${n(1 + sq)} ${n(1 - sq)})"><circle cx="3" cy="3" r="40" fill="${S}"/><circle cx="0" cy="0" r="40" fill="#DDD6FE" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="33" fill="#EDE9FE" stroke="#A78BFA" stroke-width="2" stroke-dasharray="5 4"/><circle cx="0" cy="0" r="11" fill="#7C3AED" stroke="${S}" stroke-width="3.5"/><circle cx="-3" cy="-3" r="3.5" fill="#C4B5FD"/>${mols}</g>${arrows}`;
};

const proteinDeforming = (f: number) => {
  const amp = 6 + easeInOut(f / 120) * 10;
  const w = (k: number) => n(Math.sin(f / 9 + k) * amp);
  const ribbon = `M -46 -10 C -36 ${-34 + +w(0)} -22 ${14 + +w(1)} -10 -10 S 10 ${-30 + +w(2)} 18 ${-4 + +w(3)} S 38 ${20 + +w(4)} 46 -6`;
  const mols = [0, 1, 2]
    .map((k) => {
      const t = easeInOut(((f + k * 20) % 60) / 50);
      const sx = [-40, 6, 40][k];
      const tx = [-22, 4, 30][k];
      return h2o(sx + (tx - sx) * t, 40 - t * 34, f * 4 + k * 90, 1.1);
    })
    .join("");
  const spark = Math.max(0, Math.sin(f / 4));
  return `<path d="${ribbon}" stroke="${S}" stroke-width="16" stroke-linecap="round" fill="none"/><path d="${ribbon}" stroke="#6366F1" stroke-width="10" stroke-linecap="round" fill="none"/><path d="${ribbon}" stroke="#A5B4FC" stroke-width="3" stroke-linecap="round" fill="none" transform="translate(0 -2)"/><polygon points="-30,20 4,20 4,14 18,26 4,38 4,32 -30,32" fill="#F59E0B" stroke="${S}" stroke-width="4" stroke-linejoin="round" transform="rotate(${w(5)} -6 26)"/>${mols}<g opacity="${n(spark)}"><path d="M -14 -20 l 6 6 m 0 -6 l -6 6 M 22 -26 l 6 6 m 0 -6 l -6 6" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round"/></g>`;
};

const anglerfishAbyssal = (f: number) => {
  const jaw = 6 + Math.max(0, Math.sin(f / 10)) * 8;
  const lureSway = Math.sin(f / 12) * 6;
  const glow = 0.55 + 0.45 * Math.sin(f / 5);
  const tail = Math.sin(f / 5) * 10;
  const fin = Math.sin(f / 4) * 12;
  const teeth = [-30, -24, -18, -12]
    .map((x) => `<polygon points="${x},4 ${x + 3},12 ${x + 6},4" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>`)
    .join("");
  const lowTeeth = [-28, -22, -16]
    .map((x) => `<polygon points="${x},${n(4 + jaw)} ${x + 3},${n(jaw - 3)} ${x + 6},${n(4 + jaw)}" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>`)
    .join("");
  return `<g transform="rotate(${n(tail * 0.25)} 30 4)"><polygon points="28,4 50,${n(-14 + tail)} 50,${n(22 + tail)}" fill="#4338CA" stroke="${S}" stroke-width="4" stroke-linejoin="round"/></g><path d="M -36 ${n(6 + jaw)} Q -10 ${n(24 + jaw)} 16 18 L 10 6 Z" fill="#312E81" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>${lowTeeth}<path d="M -36 4 C -40 -22 -6 -34 18 -20 C 34 -10 36 14 18 22 C 4 28 -14 18 -36 4 Z" fill="#1E1B4B" stroke="${S}" stroke-width="5.5" stroke-linejoin="round"/><path d="M -20 10 C -6 20 10 20 20 12" stroke="#4C1D95" stroke-width="5" stroke-linecap="round" fill="none"/>${teeth}<g transform="rotate(${n(fin)} 6 10)"><path d="M 6 10 Q 16 22 4 28 Q 0 20 6 10 Z" fill="#6366F1" stroke="${S}" stroke-width="3"/></g><circle cx="-12" cy="-8" r="7" fill="#FACC15" stroke="${S}" stroke-width="3"/><circle cx="-13" cy="-8" r="3.5" fill="${S}"/><circle cx="-11" cy="-10" r="1.3" fill="#FFFFFF"/><path d="M -4 -28 C -8 -46 ${n(-24 + lureSway)} -52 ${n(-30 + lureSway)} -40" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M -4 -28 C -8 -46 ${n(-24 + lureSway)} -52 ${n(-30 + lureSway)} -40" stroke="#818CF8" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="${n(-31 + lureSway)}" cy="-37" r="${n(10 + glow * 6)}" fill="#67E8F9" opacity="${n(glow * 0.35)}"/><circle cx="${n(-31 + lureSway)}" cy="-37" r="6" fill="#67E8F9" stroke="${S}" stroke-width="3"/><circle cx="${n(-32 + lureSway)}" cy="-38.5" r="2.2" fill="#FFFFFF"/>`;
};

const snailfishGelatinous = (f: number) => {
  const jelly = Math.sin(f / 6) * 0.06;
  const fin = Math.sin(f / 5) * 8;
  const tail = Math.sin(f / 7) * 6;
  return `<g transform="scale(${n(1 + jelly)} ${n(1 - jelly)})"><path d="M -40 0 C -40 -26 -6 -30 12 -16 C 28 -4 44 ${n(-8 + tail)} 52 ${n(-4 + tail)} C 44 ${n(4 + tail)} 30 10 12 18 C -8 28 -40 24 -40 0 Z" fill="#FBCFE8" fill-opacity="0.9" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/><path d="M -30 -6 C -26 -18 -10 -22 2 -16" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.85"/><path d="M -24 2 C -4 0 18 0 46 ${n(-4 + tail)}" stroke="#F472B6" stroke-width="3.5" stroke-dasharray="4 3" fill="none"/><ellipse cx="-12" cy="8" rx="9" ry="6" fill="#F9A8D4" stroke="#DB2777" stroke-width="2" opacity="0.8"/><circle cx="-6" cy="12" r="3" fill="#EC4899" opacity="0.7"/><circle cx="-28" cy="-8" r="4.5" fill="${S}"/><circle cx="-29" cy="-9.5" r="1.5" fill="#FFFFFF"/><path d="M -40 4 Q -36 8 -32 6" stroke="${S}" stroke-width="2.5" stroke-linecap="round" fill="none"/><g transform="rotate(${n(fin)} -18 14)"><path d="M -18 14 Q -26 30 -10 32 Q -8 22 -18 14 Z" fill="#F9A8D4" fill-opacity="0.85" stroke="${S}" stroke-width="3"/></g><path d="M 0 -20 Q 16 -30 30 ${n(-12 + tail)}" stroke="#F9A8D4" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.8"/></g>${[0, 1]
    .map((k) => {
      const t = ((f + k * 25) % 50) / 50;
      return `<circle cx="${n(-44 - t * 6)}" cy="${n(-6 - t * 30)}" r="${n(2.5 + t * 2)}" fill="none" stroke="#E0F2FE" stroke-width="1.8" opacity="${n(1 - t)}"/>`;
    })
    .join("")}`;
};

const tmaoMoleculeShield = (f: number) => {
  const rot = f * 1.2;
  const atom = (x: number, y: number, r: number, fill: string, label: string) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${S}" stroke-width="3.5"/><text x="${x}" y="${y + r * 0.42}" text-anchor="middle" font-size="${n(r * 1.15)}" font-weight="900" font-family="'Arial Black', sans-serif" fill="#FFFFFF" transform="rotate(${n(-rot)} ${x} ${y})">${label}</text>`;
  const hits = [0, 120, 240]
    .map((a, k) => {
      const d = 54 - Math.abs(Math.sin(f / 9 + k)) * 8;
      const rad = ((a + 30) * Math.PI) / 180;
      return h2o(Math.cos(rad) * d, Math.sin(rad) * d, f * 5 + k * 60, 0.85);
    })
    .join("");
  return `<circle cx="0" cy="0" r="45" fill="#FEF9C3" fill-opacity="0.35" stroke="${S}" stroke-width="3"/><circle cx="0" cy="0" r="45" fill="none" stroke="#FFE600" stroke-width="5" stroke-dasharray="14 8" transform="rotate(${n(-rot * 1.5)})" opacity="${n(0.75 + 0.25 * Math.sin(f / 6))}"/><g transform="rotate(${n(rot)})"><line x1="0" y1="0" x2="0" y2="-26" stroke="${S}" stroke-width="5"/><line x1="0" y1="0" x2="-23" y2="13" stroke="${S}" stroke-width="5"/><line x1="0" y1="0" x2="23" y2="13" stroke="${S}" stroke-width="5"/><line x1="0" y1="0" x2="0" y2="27" stroke="${S}" stroke-width="5"/>${atom(0, -27, 9, "#EF4444", "O")}${atom(-24, 14, 8, "#64748B", "C")}${atom(24, 14, 8, "#64748B", "C")}${atom(0, 28, 8, "#64748B", "C")}${atom(0, 0, 11, "#3B82F6", "N")}</g>${hits}`;
};

const bathyscapheExplorer = (f: number) => {
  const bob = Math.sin(f / 15) * 2.5;
  const blade = Math.cos(f * 0.7);
  const beam = 0.28 + 0.1 * Math.sin(f / 3);
  const bubbles = [0, 1, 2]
    .map((k) => {
      const t = ((f + k * 14) % 42) / 42;
      return `<circle cx="${n(-54 - t * 6 + Math.sin(t * 9) * 2)}" cy="${n(-2 - t * 34)}" r="${n(2 + t * 2.5)}" fill="none" stroke="#E0F2FE" stroke-width="1.8" opacity="${n(1 - t)}"/>`;
    })
    .join("");
  return `<g transform="translate(0 ${n(bob)})"><polygon points="44,6 110,-22 110,40" fill="#FEF08A" opacity="${n(beam)}"/><rect x="-36" y="-40" width="18" height="14" rx="3" fill="#F59E0B" stroke="${S}" stroke-width="4"/><rect x="-46" y="-28" width="92" height="34" rx="17" fill="#FACC15" stroke="${S}" stroke-width="5"/><path d="M -40 -6 L 40 -6" stroke="#EA580C" stroke-width="4"/><rect x="-46" y="-28" width="92" height="12" rx="6" fill="#FDE68A" opacity="0.6"/><rect x="38" y="0" width="10" height="10" rx="2" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><line x1="-8" y1="6" x2="-8" y2="14" stroke="${S}" stroke-width="4"/><line x1="8" y1="6" x2="8" y2="14" stroke="${S}" stroke-width="4"/><circle cx="2" cy="28" r="18" fill="${S}"/><circle cx="0" cy="26" r="18" fill="#E2E8F0" stroke="${S}" stroke-width="5"/><circle cx="4" cy="24" r="7" fill="#38BDF8" stroke="${S}" stroke-width="3"/><circle cx="2" cy="22" r="2.2" fill="#FFFFFF"/><rect x="-54" y="-14" width="8" height="10" fill="#64748B" stroke="${S}" stroke-width="3"/><ellipse cx="-56" cy="-9" rx="3" ry="${n(Math.max(1.5, Math.abs(blade) * 13))}" fill="#94A3B8" stroke="${S}" stroke-width="2.5"/></g>${bubbles}`;
};

const waterGlass = (f: number) => {
  const ripple = Math.sin(f / 6) * 1.5;
  const bubbleY1 = (f * 1.2) % 36;
  const bubbleY2 = (f * 1.5 + 18) % 36;
  return `<g>
    <ellipse cx="0" cy="38" rx="28" ry="8" fill="#CBD5E1"/>
    <polygon points="-24,-34 24,-34 18,36 -18,36" fill="#F8FAFC" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="-22,-6 22,-6 16,33 -16,33" fill="#38BDF8" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="0" cy="${n(-6 + ripple)}" rx="22" ry="5" fill="#7DD3FC" stroke="${S}" stroke-width="3"/>
    <g transform="translate(-6 4) rotate(14)">
      <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
      <rect x="-6" y="-6" width="6" height="6" fill="#E0F2FE"/>
    </g>
    <circle cx="8" cy="${n(30 - bubbleY1)}" r="2.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
    <circle cx="-10" cy="${n(30 - bubbleY2)}" r="2" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
    <path d="M -18 -26 L -14 26" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
  </g>`;
};

const lifeBuoy = (f: number) => {
  const rot = Math.sin(f / 16) * 8;
  const bob = Math.sin(f / 10) * 3;
  return `<g transform="translate(0 ${n(bob)}) rotate(${n(rot)})">
    <circle cx="0" cy="0" r="42" fill="#F8FAFC" stroke="${S}" stroke-width="6"/>
    <path d="M -42 0 A 42 42 0 0 1 0 -42 L 0 -22 A 22 22 0 0 0 -22 0 Z" fill="#EF4444" stroke="${S}" stroke-width="5"/>
    <path d="M 0 42 A 42 42 0 0 1 42 0 L 22 0 A 22 22 0 0 0 0 22 Z" fill="#EF4444" stroke="${S}" stroke-width="5"/>
    <circle cx="0" cy="0" r="22" fill="#38BDF8" stroke="${S}" stroke-width="6"/>
    <circle cx="0" cy="0" r="48" fill="none" stroke="#FDE047" stroke-width="4" stroke-dasharray="14 18"/>
    <path d="M -26 -28 A 38 38 0 0 1 26 -28" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>`;
};

const cosmicLock = (f: number) => {
  const pulse = 1 + Math.sin(f / 8) * 0.05;
  const glow = 0.5 + 0.5 * Math.sin(f / 5);
  return `<g transform="scale(${n(pulse)})">
    <path d="M -18 -10 L -18 -32 A 18 18 0 0 1 18 -32 L 18 -10" fill="none" stroke="${S}" stroke-width="12" stroke-linecap="round"/>
    <path d="M -18 -10 L -18 -32 A 18 18 0 0 1 18 -32 L 18 -10" fill="none" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round"/>
    <rect x="-32" y="-12" width="64" height="52" rx="10" fill="#F59E0B" stroke="${S}" stroke-width="6"/>
    <rect x="-26" y="-6" width="52" height="12" rx="4" fill="#FDE68A"/>
    <circle cx="0" cy="10" r="8" fill="${S}"/>
    <polygon points="-4,10 4,10 6,24 -6,24" fill="${S}"/>
    <circle cx="0" cy="10" r="4" fill="#67E8F9" opacity="${n(glow)}"/>
  </g>`;
};

const bionicAnt = (f: number, _stepProgress?: number, currentState?: string) => {
  const isShield = currentState === "escudo_quitina" || currentState === "paracaidas";
  const antBob = Math.sin(f * 0.18) * 3;
  const antWiggle = Math.sin(f * 0.24) * 4;
  return `<g transform="translate(0, ${n(antBob)}) scale(1.45)">
    ${isShield ? `<ellipse cx="-4" cy="2" rx="48" ry="34" fill="#38BDF8" fill-opacity="0.22" stroke="#38BDF8" stroke-width="3" stroke-dasharray="6,4"/>` : ""}
    <!-- 6 patas articuladas con efecto de suspensión elástica -->
    <path d="M -10 6 L -28 14 L -38 ${n(30 + antBob * 0.6)}" stroke="${S}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M -6 6 L -32 0 L -42 ${n(16 - antBob * 0.6)}" stroke="${S}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M -2 6 L -26 -12 L -34 ${n(4 + antBob * 0.5)}" stroke="${S}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M 6 6 L 24 14 L 34 ${n(30 - antBob * 0.6)}" stroke="${S}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M 10 6 L 30 0 L 40 ${n(16 + antBob * 0.6)}" stroke="${S}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M 12 6 L 26 -12 L 34 ${n(4 - antBob * 0.5)}" stroke="${S}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Abdomen (gáster) segmentado brillante -->
    <ellipse cx="-26" cy="-2" rx="18" ry="14" fill="#B91C1C" stroke="${S}" stroke-width="5"/>
    <path d="M -36 -2 A 8 10 0 0 1 -20 -10" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="-28" cy="-5" rx="5" ry="3" fill="#F87171" opacity="0.85"/>
    <!-- Pecíolo y Tórax -->
    <ellipse cx="-8" cy="2" rx="4" ry="5" fill="#7F1D1D" stroke="${S}" stroke-width="4"/>
    <ellipse cx="4" cy="0" rx="12" ry="10" fill="#DC2626" stroke="${S}" stroke-width="5"/>
    <path d="M 0 -6 A 8 6 0 0 1 10 -6" stroke="#FCA5A5" stroke-width="3" fill="none"/>
    <!-- Cabeza, ojo y mandíbulas doradas -->
    <circle cx="22" cy="-4" r="11" fill="#B91C1C" stroke="${S}" stroke-width="5"/>
    <ellipse cx="24" cy="-8" rx="5" ry="4" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
    <circle cx="25" cy="-8" r="2.5" fill="${S}"/>
    <path d="M 31 -2 L 38 1 L 33 6" stroke="${S}" stroke-width="4" fill="#F59E0B" stroke-linejoin="round"/>
    <!-- Antenas vivas -->
    <path d="M 24 -14 Q 28 -24 ${n(32 + antWiggle)} -28" stroke="${S}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="${n(32 + antWiggle)}" cy="-28" r="3" fill="#F59E0B" stroke="${S}" stroke-width="1.5"/>
    <path d="M 20 -14 Q 20 -25 ${n(18 - antWiggle)} -30" stroke="${S}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="${n(18 - antWiggle)}" cy="-30" r="3" fill="#F59E0B" stroke="${S}" stroke-width="1.5"/>
  </g>`;
};

const cubePhysics = (f: number, _stepProgress?: number, currentState?: string) => {
  const isCompare = currentState === "comparacion_escala" || (currentState === undefined && f >= 60);
  const rot = Math.sin(f * 0.14) * 3;
  const smallFloat = Math.sin(f * 0.22) * 4;
  return `<g transform="rotate(${n(rot)}) scale(1.45)">
    <!-- Cubo Grande (Mucha masa L3, cae pesado) -->
    <g transform="translate(-16, 6)">
      <polygon points="0,-28 26,-14 0,0 -26,-14" fill="#EF4444" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
      <polygon points="-26,-14 0,0 0,30 -26,16" fill="#DC2626" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
      <polygon points="0,0 26,-14 26,16 0,30" fill="#991B1B" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
      <path d="M 0,34 L 0,46 M -6,40 L 0,47 L 6,40" stroke="#EF4444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>
    <!-- Cubito Diminuto (Gran área relativa L2 vs masa mínima, flota en el aire) -->
    <g transform="translate(24, ${n(-12 + smallFloat)}) scale(${isCompare ? "1.12" : "1"})">
      <polygon points="0,-12 12,-6 0,0 -12,-6" fill="#38BDF8" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="-12,-6 0,0 0,13 -12,7" fill="#0284C7" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="0,0 12,-6 12,7 0,13" fill="#0369A1" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
      <!-- Líneas de sustentación de aire debajo del cubito -->
      <path d="M -14,18 Q 0,12 14,18" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/>
    </g>
  </g>`;
};

const terminalVelocityShield = (f: number, _stepProgress?: number, currentState?: string) => {
  const isSlow = currentState === "freno_aire" || (currentState === undefined && f >= 60);
  const windY = (f * 3.5) % 24;
  const airDrag = 1 + Math.sin(f * 0.2) * 0.05;
  return `<g transform="scale(${n(airDrag * 1.45)})">
    <!-- Cúpula de paracaídas aerodinámico -->
    <path d="M -42 6 C -42 -38 42 -38 42 6 C 22 0 0 4 -42 6 Z" fill="${isSlow ? "#22C55E" : "#FACC15"}" stroke="${S}" stroke-width="5.5" stroke-linejoin="round"/>
    <path d="M -28 -2 C -28 -24 28 -24 28 -2" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Cuerdas de suspensión hacia la hormiga -->
    <line x1="-32" y1="6" x2="-8" y2="28" stroke="${S}" stroke-width="3.5"/>
    <line x1="32" y1="6" x2="8" y2="28" stroke="${S}" stroke-width="3.5"/>
    <circle cx="0" cy="30" r="8" fill="#DC2626" stroke="${S}" stroke-width="3.5"/>
    <!-- Corrientes ascendentes de aire frenando la caída -->
    <path d="M -26 ${n(36 - (windY % 16))} L -26 16" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M 26 ${n(36 - (windY % 16))} L 26 16" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round"/>
  </g>`;
};

const honeyPot = (f: number, _stepProgress?: number, currentState?: string) => {
  const drip = (f * 1.4) % 30;
  const floatAnt = Math.sin(f * 0.16) * 3;
  return `<g transform="scale(1.45)">
    <!-- Frasco transparente de miel densa donde el aire actúa como colchón viscoso -->
    <path d="M -24 -22 L 24 -22 L 30 18 C 30 30 18 36 0 36 C -18 36 -30 30 -30 18 Z" fill="#F59E0B" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="0" cy="-22" rx="24" ry="7" fill="#FDE047" stroke="${S}" stroke-width="4"/>
    <path d="M -20 -18 Q -10 -8 0 -14 Q 10 -8 20 -18 Q 16 6 0 6 Q -16 6 -20 -18 Z" fill="#FEF08A" opacity="0.75"/>
    <!-- Silueta de hormiguita flotando suavemente dentro del fluido ámbar -->
    <g transform="translate(0, ${n(6 + floatAnt)})">
      <circle cx="-6" cy="0" r="5" fill="#7F1D1D" stroke="${S}" stroke-width="2.5"/>
      <circle cx="2" cy="0" r="4" fill="#991B1B" stroke="${S}" stroke-width="2.5"/>
      <circle cx="9" cy="-1" r="4" fill="#7F1D1D" stroke="${S}" stroke-width="2.5"/>
    </g>
    <circle cx="12" cy="${n(-4 + drip * 0.6)}" r="3.5" fill="#FEF08A" stroke="${S}" stroke-width="2"/>
  </g>`;
};

const marsHelmet = (f: number) => {
  const boilY = (f * 3) % 24;
  return `<g transform="scale(1.15)">
    <circle cx="0" cy="0" r="32" fill="#F8FAFC" stroke="${S}" stroke-width="6"/>
    <ellipse cx="0" cy="-2" rx="24" ry="18" fill="#F59E0B" stroke="${S}" stroke-width="4"/>
    <circle cx="-10" cy="${n(8 - boilY)}" r="3" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
    <circle cx="6" cy="${n(6 - ((boilY + 12) % 24))}" r="2.5" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
    <path d="M -14 -12 L -6 -4 L 4 -8" stroke="#DC2626" stroke-width="3" stroke-linecap="round" fill="none"/>
    <rect x="-38" y="-6" width="8" height="14" rx="2" fill="#0284C7" stroke="${S}" stroke-width="3"/>
    <rect x="30" y="-6" width="8" height="14" rx="2" fill="#0284C7" stroke="${S}" stroke-width="3"/>
  </g>`;
};

const iceCrystalHex = (f: number) => {
  const pulse = 1 + Math.sin(f / 6) * 0.05;
  const rot = f * 0.4;
  return `<g transform="rotate(${n(rot)}) scale(${n(pulse * 1.1)})">
    <polygon points="0,-36 31,-18 31,18 0,36 -31,18 -31,-18" fill="none" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="0,-24 21,-12 21,12 0,24 -21,12 -21,-12" fill="#BAE6FD" stroke="#0284C7" stroke-width="4" stroke-linejoin="round"/>
    <line x1="0" y1="0" x2="0" y2="-36" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="31" y2="-18" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="31" y2="18" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="0" y2="36" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="-31" y2="18" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="-31" y2="-18" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    <circle cx="0" cy="-36" r="6" fill="#EF4444" stroke="${S}" stroke-width="2"/>
    <circle cx="31" cy="-18" r="6" fill="#EF4444" stroke="${S}" stroke-width="2"/>
    <circle cx="31" cy="18" r="6" fill="#EF4444" stroke="${S}" stroke-width="2"/>
    <circle cx="0" cy="36" r="6" fill="#EF4444" stroke="${S}" stroke-width="2"/>
    <circle cx="-31" cy="18" r="6" fill="#EF4444" stroke="${S}" stroke-width="2"/>
    <circle cx="-31" cy="-18" r="6" fill="#EF4444" stroke="${S}" stroke-width="2"/>
    <circle cx="0" cy="0" r="7" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
  </g>`;
};

const bulletAnt = (f: number) => {
  const stingZap = Math.sin(f * 0.4) > 0 ? 1 : 0.3;
  return `<g transform="scale(1.15)">
    <path d="M -8 8 L -28 20 L -36 38" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M -4 8 L -34 4 L -44 18" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 0 8 L -28 -10 L -38 4" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 8 8 L 26 20 L 34 38" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 12 8 L 32 4 L 42 18" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 14 8 L 28 -10 L 36 4" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <ellipse cx="-28" cy="-4" rx="20" ry="15" fill="#18181B" stroke="${S}" stroke-width="5"/>
    <path d="M -44 -4 L -58 -2 L -48 -8 Z" fill="#F59E0B" stroke="${S}" stroke-width="3"/>
    <polygon points="-62,-8 -54,-14 -56,-8 -48,-12 -54,-4" fill="#FACC15" opacity="${n(stingZap)}"/>
    <ellipse cx="6" cy="0" rx="13" ry="11" fill="#27272A" stroke="${S}" stroke-width="5"/>
    <circle cx="26" cy="-4" r="12" fill="#18181B" stroke="${S}" stroke-width="5"/>
    <ellipse cx="28" cy="-8" rx="5" ry="4" fill="#EF4444" stroke="${S}" stroke-width="2"/>
    <circle cx="29" cy="-8" r="2" fill="${S}"/>
    <path d="M 36 -2 L 44 2 L 38 8" stroke="${S}" stroke-width="4" fill="#DC2626" stroke-linejoin="round"/>
  </g>`;
};

const chameleonHero = (f: number) => {
  // Ciclo cromático suave que transiciona entre verde esmeralda, cian, amarillo y rojo carmesí
  const hue = (150 + Math.sin(f / 22) * 140 + 360) % 360;
  const bodyColor = `hsl(${n(hue)}, 88%, 48%)`;
  const accentColor = `hsl(${n((hue + 35) % 360)}, 92%, 55%)`;
  const darkColor = `hsl(${n((hue - 24 + 360) % 360)}, 82%, 36%)`;

  // Movimiento ocular independiente en torreta de 360 grados
  const eyeAngle = (f * 4.5) % 360;
  const rad = (eyeAngle * Math.PI) / 180;
  const pupilX = 18 + Math.cos(rad) * 3.2;
  const pupilY = -12 + Math.sin(rad) * 3.2;

  // Lengua elástica veloz que dispara periódicamente cada ~60 frames
  const tonguePhase = f % 60;
  const isFlicking = tonguePhase >= 44 && tonguePhase <= 54;
  const tProgress = isFlicking ? Math.sin(((tonguePhase - 44) / 10) * Math.PI) : 0;
  const tLen = tProgress * 36;
  const tongueSvg = isFlicking
    ? `<path d="M 34 -8 Q ${n(34 + tLen * 0.5)} ${n(-12 + Math.sin(f) * 4)} ${n(34 + tLen)} -8" stroke="#F43F5E" stroke-width="3.5" stroke-linecap="round" fill="none"/>
       <circle cx="${n(34 + tLen)}" cy="-8" r="3.5" fill="#E11D48" stroke="${S}" stroke-width="2"/>
       <circle cx="${n(34 + tLen + 3)}" cy="-10" r="2" fill="${S}"/>
       <path d="M ${n(34 + tLen + 1)} -12 L ${n(34 + tLen + 5)} -8" stroke="#94A3B8" stroke-width="1.2"/>`
    : "";

  return `<g transform="scale(1.15)">
    <!-- Rama leñosa con hojas tropicales alineada al punto de agarre de la mano (y: 14) -->
    <rect x="-46" y="10" width="92" height="11" rx="4" fill="#78350F" stroke="${S}" stroke-width="4.5"/>
    <path d="M -42 13 L 42 13" stroke="#92400E" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M -34 10 Q -42 0 -36 -6 Q -28 0 -34 10" fill="#22C55E" stroke="${S}" stroke-width="3"/>
    <path d="M 36 10 Q 44 0 38 -6 Q 30 0 36 10" fill="#10B981" stroke="${S}" stroke-width="3"/>

    <!-- Cola prensil enrollada en espiral continua (característica única del camaleón) -->
    <path d="M -18 2 C -30 -4 -46 2 -44 18 C -42 32 -22 34 -18 20 C -16 10 -30 10 -32 18 C -33 22 -26 24 -24 20" fill="none" stroke="${S}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M -18 2 C -30 -4 -46 2 -44 18 C -42 32 -22 34 -18 20 C -16 10 -30 10 -32 18 C -33 22 -26 24 -24 20" fill="none" stroke="${bodyColor}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Espinas dorsales triangulares afiladas a lo largo de la columna vertebral -->
    <polygon points="-16,-15 -13,-22 -10,-17" fill="${accentColor}" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="-9,-21 -6,-28 -3,-23" fill="${accentColor}" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="-2,-24 1,-31 4,-25" fill="${accentColor}" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="5,-24 8,-30 11,-23" fill="${accentColor}" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="12,-20 15,-25 18,-18" fill="${accentColor}" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>

    <!-- Cuerpo comprimido lateralmente en forma de hoja -->
    <path d="M -20 8 C -22 -16 6 -28 20 -16 C 30 -6 24 14 -18 12 Z" fill="${bodyColor}" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>

    <!-- Patrones bandeados de interferencia fotónica iridiscente -->
    <path d="M -10 -16 L -14 8" stroke="${accentColor}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M -2 -22 L -6 8" stroke="${accentColor}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M 6 -20 L 2 8" stroke="${accentColor}" stroke-width="4.5" stroke-linecap="round"/>

    <!-- Casco o cresta occipital elevada (casque) en la parte superior de la cabeza -->
    <path d="M 8 -18 C 8 -34 22 -36 28 -20 C 29 -15 26 -14 20 -15 Z" fill="${darkColor}" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M 12 -28 C 16 -32 22 -30 24 -20" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.65" fill="none"/>

    <!-- Hocico reptiliano con línea de boca y orificio nasal -->
    <path d="M 16 -20 L 36 -8 L 28 4 L 14 0 Z" fill="${bodyColor}" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
    <line x1="28" y1="-4" x2="36" y2="-8" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="33" cy="-10" r="1.5" fill="${S}"/>

    <!-- Lengua que dispara hacia adelante -->
    ${tongueSvg}

    <!-- Ojo en torreta cónica prominente con visión 360 -->
    <circle cx="18" cy="-12" r="9.5" fill="${accentColor}" stroke="${S}" stroke-width="4"/>
    <circle cx="18" cy="-12" r="6.5" fill="${bodyColor}" stroke="${S}" stroke-width="2.5"/>
    <circle cx="${n(pupilX)}" cy="${n(pupilY)}" r="3.2" fill="${S}"/>
    <circle cx="${n(pupilX + 0.9)}" cy="${n(pupilY - 0.9)}" r="1.2" fill="#FFFFFF"/>

    <!-- Patas con pinzas cigodáctilas abrazando firmemente la rama -->
    <path d="M -10 6 L -14 13 M -10 6 L -8 13 M -16 15 Q -12 18 -6 15" stroke="${S}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <circle cx="-11" cy="9" r="4.5" fill="${darkColor}" stroke="${S}" stroke-width="2.5"/>
    <path d="M 12 4 L 8 13 M 12 4 L 14 13 M 6 15 Q 10 18 16 15" stroke="${S}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <circle cx="11" cy="8" r="4.5" fill="${darkColor}" stroke="${S}" stroke-width="2.5"/>
  </g>`;
};

const photonicCrystals = (f: number) => {
  // Expansión periódica de la red de nanocristales (tensión de la piel)
  const exp = 0.5 + 0.5 * Math.sin(f / 14);
  const dx = 11 + exp * 7.5; // Espaciamiento de 11px a 18.5px
  const distNm = Math.round(140 + exp * 80); // 140nm a 220nm

  // Cambio de longitud de onda reflejada: Azul (450nm) -> Verde -> Amarillo -> Rojo (650nm)
  const reflHue = 205 - exp * 200;
  const reflColor = `hsl(${n(reflHue)}, 95%, 55%)`;
  const reflText = exp > 0.5 ? "ROJO (650nm)" : "AZUL (450nm)";

  // Malla de nanocristales de guanina (prismas hexagonales/romboidales)
  const rows = [-14, -2, 10];
  const cols = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
  const crystals = rows
    .map((y, rIdx) =>
      cols
        .map((cIdx) => {
          const x = cIdx * dx + (rIdx % 2 === 1 ? dx * 0.5 : 0);
          return `<polygon points="${n(x)},${y - 4.5} ${n(x + 3.8)},${y} ${n(x)},${y + 4.5} ${n(x - 3.8)},${y}" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.8"/>`;
        })
        .join("")
    )
    .join("");

  return `<g transform="scale(1.15)">
    <!-- Tarjeta tecnológica con marco neo-brutalista -->
    <rect x="-48" y="-46" width="96" height="92" rx="8" fill="#0B1329" stroke="${S}" stroke-width="5"/>
    <rect x="-44" y="-42" width="88" height="84" rx="5" fill="#0F172A"/>

    <!-- Rótulo superior -->
    <rect x="-40" y="-39" width="80" height="14" rx="3" fill="#FFE600" stroke="${S}" stroke-width="3"/>
    <text x="0" y="-29" font-family="'Arial Black', sans-serif" font-weight="900" font-size="7" fill="${S}" text-anchor="middle">RED FOTÓNICA DE GUANINA</text>

    <!-- Rayo de luz solar incidente (blanco + halo amarillo) -->
    <line x1="-38" y1="-22" x2="-8" y2="-2" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="-38" y1="-22" x2="-8" y2="-2" stroke="#FEF08A" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <text x="-32" y="-12" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FEF08A">LUZ</text>

    <!-- Matriz de nanocristales activos -->
    ${crystals}

    <!-- Onda reflejada con longitud de onda variable según el espaciamiento -->
    <path d="M -8 -2 Q 4 ${n(-8 - Math.sin(f * 0.4) * 4)} 14 -2 Q 24 ${n(4 + Math.sin(f * 0.4) * 4)} 36 -16" fill="none" stroke="${reflColor}" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="36" cy="-16" r="${n(4 + Math.sin(f * 0.5) * 2)}" fill="${reflColor}" opacity="0.6"/>

    <!-- Display digital en tiempo real: Espaciamiento y longitud de onda -->
    <rect x="-42" y="24" width="84" height="15" rx="3" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>
    <text x="0" y="34.5" font-family="'Arial Black', sans-serif" font-weight="900" font-size="6.5" fill="${reflColor}" text-anchor="middle">d = ${distNm}nm → ${reflText}</text>
  </g>`;
};

const tardigradeHero = (f: number) => {
  const bob = Math.sin(f / 6) * 3;
  const legWiggle = Math.sin(f / 4) * 8;
  const glassGlow = 0.45 + 0.4 * Math.sin(f / 8);

  return `<g transform="translate(0, ${n(bob)}) scale(1.15)">
    <!-- Aura de biovidrio protector (criptobiosis vítrea anhidrobiótica) -->
    <ellipse cx="0" cy="0" rx="46" ry="34" fill="#38BDF8" fill-opacity="${n(glassGlow * 0.25)}" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="8 6"/>
    
    <!-- 4 pares de patas robustas (8 patas) con garras retráctiles triples -->
    ${[-26, -10, 8, 26]
      .map(
        (x, i) => `
      <g transform="translate(${x}, 16) rotate(${n((i % 2 === 0 ? 1 : -1) * legWiggle)})">
        <path d="M 0 0 L -2 12 Q 0 16 4 16 L 6 12 Z" fill="#F59E0B" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 0 14 L -4 20 M 3 15 L 2 22 M 6 14 L 8 20" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
      </g>`
      )
      .join("")}

    <!-- Cuerpo cilíndrico gordinflón con 4 pliegues segmentados tipo acordeón -->
    <path d="M -36 -4 C -36 -24 36 -24 36 -4 C 36 22 -36 22 -36 -4 Z" fill="#FBBF24" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M -18 -20 C -18 0 -18 10 -20 18" stroke="#D97706" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M 0 -22 C 0 0 0 10 -2 20" stroke="#D97706" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M 18 -20 C 18 0 18 10 16 18" stroke="#D97706" stroke-width="4" stroke-linecap="round" fill="none"/>

    <!-- Cabeza y cono bucal redondeado con estiletes telescópicos -->
    <circle cx="34" cy="-2" r="14" fill="#F59E0B" stroke="${S}" stroke-width="4.5"/>
    <ellipse cx="44" cy="-2" rx="4" ry="7" fill="#78350F" stroke="${S}" stroke-width="3"/>
    <circle cx="44" cy="-2" r="2.5" fill="#EF4444"/>
    <circle cx="33" cy="-7" r="2" fill="${S}"/>
    <circle cx="33" cy="3" r="2" fill="${S}"/>

    <!-- Destellos de resistencia cósmica extrema -->
    <polygon points="-42,-22 -38,-22 -36,-26 -38,-30 -42,-30 -44,-26" fill="#67E8F9" stroke="${S}" stroke-width="1.5"/>
    <polygon points="38,-28 42,-28 44,-32 42,-36 38,-36 36,-32" fill="#67E8F9" stroke="${S}" stroke-width="1.5"/>
  </g>`;
};

const pistolShrimpHero = (f: number) => {
  const snapCycle = f % 40;
  const isCocked = snapCycle < 28;
  const hammerAngle = isCocked ? -35 : 0;
  const hasFired = snapCycle >= 28 && snapCycle <= 36;
  const plasmaRad = hasFired ? (snapCycle - 28) * 4.5 : 0;

  return `<g transform="scale(1.15)">
    <!-- Cuerpo de camarón crustáceo curvado con caparazón y cola abanico -->
    <path d="M -42 12 Q -30 20 -16 16 Q 0 12 12 18" stroke="#F97316" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M -46 8 L -36 12 L -48 18" stroke="${S}" stroke-width="3.5" fill="#FB923C"/>
    <!-- Antenas sensoriales largas ondulando -->
    <path d="M 8 10 Q 22 -6 32 -18" stroke="${S}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M 12 12 Q 28 4 42 0" stroke="${S}" stroke-width="2.5" stroke-linecap="round" fill="none"/>

    <!-- Pinza izquierda normal pequeña -->
    <path d="M -4 18 L 8 26 L 14 22" stroke="${S}" stroke-width="3.5" fill="#F97316"/>

    <!-- MEGA PINZA DERECHA GIGANTE DE PISTOLA -->
    <!-- Base bulbosa de la pinza con resorte muscular -->
    <path d="M -12 6 C -12 -16 16 -24 24 -4 C 28 8 10 22 -10 16 Z" fill="#EF4444" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="6" cy="-2" rx="12" ry="7" fill="#DC2626"/>

    <!-- Dedo fijo inferior con cavidad acústica -->
    <path d="M 18 2 L 38 6 L 30 16 L 14 12 Z" fill="#B91C1C" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>

    <!-- Martillo percutor móvil superior con resorte elástico -->
    <g transform="translate(14, -8) rotate(${hammerAngle})">
      <path d="M 0 0 L 26 -12 L 28 4 L 0 6 Z" fill="#F97316" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
      <circle cx="8" cy="-2" r="3" fill="#FFE600"/>
    </g>

    <!-- Ojo en tallo bulboso -->
    <circle cx="4" cy="8" r="4.5" fill="#F8FAFC" stroke="${S}" stroke-width="2.5"/>
    <circle cx="5" cy="8" r="2.2" fill="${S}"/>

    <!-- Destello de cavitación y plasma a 4,700 K al cerrarse el martillo -->
    ${
      hasFired
        ? `
      <circle cx="44" cy="4" r="${n(8 + plasmaRad)}" fill="#FEF08A" stroke="#EF4444" stroke-width="3.5" opacity="0.9"/>
      <circle cx="44" cy="4" r="${n(4 + plasmaRad * 0.5)}" fill="#FFFFFF"/>
      <!-- Ondas de choque sónicas acústicas (218 dB) -->
      <path d="M 52 -10 A 18 18 0 0 1 52 18" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 60 -16 A 26 26 0 0 1 60 24" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" fill="none"/>
      <text x="44" y="-18" font-family="'Arial Black', sans-serif" font-weight="900" font-size="7.5" fill="#EF4444" text-anchor="middle">4,700°C</text>
      `
        : ""
    }
  </g>`;
};

const relativisticClock = (f: number) => {
  const rotFast = (f * 14) % 360;
  const rotSlow = (f * 2.2) % 360;

  return `<g transform="scale(1.15)">
    <!-- Base neo-brutalista con curvatura espacio-temporal de Einstein -->
    <rect x="-48" y="-44" width="96" height="88" rx="8" fill="#0B132B" stroke="${S}" stroke-width="5"/>
    
    <!-- Malla de gravedad curvada en el centro -->
    <path d="M -44 0 Q 0 28 44 0 M -44 -14 Q 0 16 44 -14 M -44 14 Q 0 38 44 14" stroke="#1E293B" stroke-width="2" fill="none"/>
    <line x1="0" y1="-44" x2="0" y2="44" stroke="${S}" stroke-width="3.5" stroke-dasharray="4 4"/>

    <!-- Reloj Izquierdo: Superficie (Gravedad menor -> Tiempo corre MÁS RÁPIDO) -->
    <g transform="translate(-24, -8)">
      <circle cx="0" cy="0" r="18" fill="#0284C7" stroke="${S}" stroke-width="4"/>
      <circle cx="0" cy="0" r="14" fill="#38BDF8"/>
      <!-- Manecilla rápida girando -->
      <g transform="rotate(${n(rotFast)})">
        <line x1="0" y1="0" x2="0" y2="-11" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
        <line x1="0" y1="0" x2="7" y2="0" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
      </g>
      <circle cx="0" cy="0" r="2.5" fill="${S}"/>
      <text x="0" y="27" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#38BDF8" text-anchor="middle">SUPERFICIE</text>
      <text x="0" y="34" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#BAE6FD" text-anchor="middle">+ RÁPIDO</text>
    </g>

    <!-- Reloj Derecho: Núcleo Terrestre (Pozo gravitatorio profundo -> Tiempo MÁS LENTO) -->
    <g transform="translate(24, -8)">
      <circle cx="0" cy="0" r="18" fill="#B45309" stroke="${S}" stroke-width="4"/>
      <circle cx="0" cy="0" r="14" fill="#F59E0B"/>
      <!-- Manecilla lenta -->
      <g transform="rotate(${n(rotSlow)})">
        <line x1="0" y1="0" x2="0" y2="-9" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
        <line x1="0" y1="0" x2="5" y2="0" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
      </g>
      <circle cx="0" cy="0" r="2.5" fill="${S}"/>
      <text x="0" y="27" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FBBF24" text-anchor="middle">NÚCLEO</text>
      <text x="0" y="34" font-family="'Arial Black', sans-serif" font-size="5.5" font-weight="900" fill="#FEF08A" text-anchor="middle">- 2.5 AÑOS</text>
    </g>

    <!-- Rótulo superior de relatividad general -->
    <rect x="-38" y="-40" width="76" height="13" rx="3" fill="#FFE600" stroke="${S}" stroke-width="2.5"/>
    <text x="0" y="-31" font-family="'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="${S}" text-anchor="middle">DILATACIÓN TEMPORAL</text>
  </g>`;
};

const myceliumNetwork = (f: number) => {
  const pulseNode1 = ((f * 2) % 60) / 60;
  const pulseNode2 = (((f * 2) + 30) % 60) / 60;

  return `<g transform="scale(1.15)">
    <!-- Corte transversal subterráneo neo-brutalista -->
    <rect x="-48" y="-44" width="96" height="88" rx="8" fill="#1C1917" stroke="${S}" stroke-width="5"/>
    <!-- Superficie del suelo con pasto -->
    <rect x="-44" y="-40" width="88" height="12" fill="#15803D" stroke="${S}" stroke-width="3"/>
    
    <!-- Tronco de árbol nodriza madre a la izquierda -->
    <path d="M -32 -28 L -30 -8 L -20 -8 L -18 -28 Z" fill="#78350F" stroke="${S}" stroke-width="3.5"/>
    <!-- Tronco de árbol joven a la derecha -->
    <path d="M 22 -28 L 24 -8 L 32 -8 L 30 -28 Z" fill="#92400E" stroke="${S}" stroke-width="3"/>

    <!-- Red subterránea hiperconectada de micelio fúngico e hifas -->
    <path d="M -25 -8 Q -16 6 -8 14 Q 4 18 24 -8" stroke="#F43F5E" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M -22 -4 Q -12 24 2 26 Q 16 24 26 -4" stroke="#34D399" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M -6 14 L 0 34 M 10 18 L 18 36 M -18 6 L -32 28" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3"/>

    <!-- Nodos sinápticos subterráneos con pulso de nutrientes (carbono, fósforo y alertas) -->
    <circle cx="-8" cy="14" r="5" fill="#FFE600" stroke="${S}" stroke-width="2"/>
    <circle cx="2" cy="26" r="4.5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
    <circle cx="-16" cy="6" r="4" fill="#34D399" stroke="${S}" stroke-width="1.8"/>

    <!-- Partículas de nutrientes viajando en tiempo real por el micelio -->
    <circle cx="${n(-25 + pulseNode1 * 49)}" cy="${n(-8 + Math.sin(pulseNode1 * Math.PI) * 24)}" r="3" fill="#FFFFFF" stroke="#F43F5E" stroke-width="1.5"/>
    <circle cx="${n(24 - pulseNode2 * 46)}" cy="${n(-4 + Math.sin(pulseNode2 * Math.PI) * 28)}" r="2.8" fill="#FDE047" stroke="#000000" stroke-width="1.2"/>

    <!-- Hongos visibles en superficie conectando la red -->
    <path d="M -4 -28 L -4 -40 M -1 -28 L -1 -38" stroke="#E2E8F0" stroke-width="2.5"/>
    <path d="M -8 -40 Q -4 -48 0 -40 Z" fill="#EF4444" stroke="${S}" stroke-width="2"/>
    <circle cx="-4" cy="-43" r="1.2" fill="#FFFFFF"/>

    <!-- Rótulo identificador -->
    <rect x="-36" y="24" width="72" height="14" rx="3" fill="#0F172A" stroke="${S}" stroke-width="2.5"/>
    <text x="0" y="34" font-family="'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#34D399" text-anchor="middle">WOOD WIDE WEB</text>
  </g>`;
};

const relativisticRocket = (f: number) => {
  const thrustFlicker = Math.sin(f * 2.5) * 4;
  const speedLines = [-20, 0, 20]
    .map((y, i) => {
      const xOffset = ((f * 16 + i * 28) % 90) - 45;
      return `<line x1="${n(xOffset)}" y1="${y}" x2="${n(xOffset + 18)}" y2="${y}" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" opacity="0.75"/>`;
    })
    .join("");

  return `<g transform="scale(1.15)">
    <!-- Fondo de espacio curvo con líneas de velocidad relativista -->
    ${speedLines}

    <!-- Fuego y plasma azul de fusión relativista a 0.99c -->
    <polygon points="-46,${n(-6 + thrustFlicker)} -46,${n(6 - thrustFlicker)} -22,0" fill="#38BDF8" stroke="${S}" stroke-width="3"/>
    <polygon points="-38,${n(-3 + thrustFlicker * 0.5)} -38,${n(3 - thrustFlicker * 0.5)} -22,0" fill="#FFFFFF"/>

    <!-- Fuselaje de la nave estelar comprimido por contracción de Lorentz -->
    <path d="M -22 -14 L 14 -14 L 38 0 L 14 14 L -22 14 Z" fill="#E2E8F0" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <!-- Franja aerodinámica vibrante -->
    <path d="M -16 -4 L 20 -4 L 28 0 L 20 4 L -16 4 Z" fill="#EF4444" stroke="${S}" stroke-width="2.5"/>

    <!-- Cabina con escudo de plasma frontal para absorber radiación cósmica -->
    <polygon points="10,-6 24,-6 32,0 24,6 10,6" fill="#38BDF8" stroke="${S}" stroke-width="3"/>
    <circle cx="18" cy="0" r="3" fill="#FFFFFF"/>

    <!-- Aletas estabilizadoras hiperespaciales -->
    <polygon points="-18,-14 -8,-24 4,-14" fill="#FACC15" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="-18,14 -8,24 4,14" fill="#FACC15" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>

    <!-- Medidor digital de factor Lorentz -->
    <rect x="-34" y="26" width="68" height="14" rx="3" fill="#0F172A" stroke="${S}" stroke-width="2.5"/>
    <text x="0" y="36" font-family="'Arial Black', sans-serif" font-size="6.8" font-weight="900" fill="#FACC15" text-anchor="middle">v = 0.99c | γ = 7.1x</text>
  </g>`;
};

const magmaBubblingCrust = (f: number) => {
  const bubCycle1 = f % 36;
  const bubScale1 = Math.min(1.2, bubCycle1 / 24);
  const bubPopped1 = bubCycle1 > 24;

  const bubCycle2 = (f + 18) % 36;
  const bubScale2 = Math.min(1.1, bubCycle2 / 24);
  const bubPopped2 = bubCycle2 > 24;

  return `<g transform="scale(1.1)">
    <!-- Base de roca basáltica neo-brutalista -->
    <polygon points="-46,12 -38,-16 10,-24 46,-10 40,24 -24,28" fill="#1C1917" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    
    <!-- Venas incandescentes de lava pulsante -->
    <path d="M -34 -4 Q -10 6 12 -6 Q 26 8 38 4" stroke="#F97316" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M -34 -4 Q -10 6 12 -6 Q 26 8 38 4" stroke="#FEF08A" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M -8 6 Q 6 18 18 24" stroke="#EF4444" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M -8 6 Q 6 18 18 24" stroke="#FEF08A" stroke-width="2" stroke-linecap="round" fill="none"/>

    <!-- Burbuja 1 de gas sulfuroso hirviendo -->
    ${
      bubPopped1
        ? `<g transform="translate(-14, 0)">
            <circle cx="-6" cy="-8" r="2.5" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
            <circle cx="8" cy="-10" r="3" fill="#F59E0B" stroke="${S}" stroke-width="1.5"/>
            <line x1="0" y1="-2" x2="0" y2="-12" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
          </g>`
        : `<g transform="translate(-14, 0) scale(${n(bubScale1)})">
            <ellipse cx="0" cy="0" rx="9" ry="7" fill="#F59E0B" stroke="${S}" stroke-width="3"/>
            <ellipse cx="-2.5" cy="-2" rx="3" ry="2" fill="#FEF08A"/>
          </g>`
    }

    <!-- Burbuja 2 de gas volcánico -->
    ${
      bubPopped2
        ? `<g transform="translate(20, -2)">
            <circle cx="-5" cy="-6" r="2.5" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
            <circle cx="6" cy="-8" r="2.5" fill="#F97316" stroke="${S}" stroke-width="1.5"/>
          </g>`
        : `<g transform="translate(20, -2) scale(${n(bubScale2)})">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#EA580C" stroke="${S}" stroke-width="2.5"/>
            <ellipse cx="-2" cy="-2" rx="2.5" ry="1.5" fill="#FEF08A"/>
          </g>`
    }

    <!-- Placa de temperatura extrema 1,200 °C -->
    <rect x="-38" y="-44" width="76" height="16" rx="4" fill="#DC2626" stroke="${S}" stroke-width="3"/>
    <text x="0" y="-32" font-family="'Arial Black', sans-serif" font-size="8.5" font-weight="900" fill="#FEF08A" text-anchor="middle">🔥 1,200 °C</text>
  </g>`;
};

const leidenfrostCushion = (f: number) => {
  const wave1 = Math.sin(f / 4) * 3;
  const wave2 = Math.cos(f / 4) * 3;
  const arrowFloat = Math.sin(f / 5) * 4;

  return `<g transform="scale(1.12)">
    <!-- Marco contenedor de infografía científica -->
    <rect x="-48" y="-46" width="96" height="92" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>

    <!-- Capa inferior: Mar de Lava a 1,200 °C -->
    <rect x="-44" y="14" width="88" height="26" fill="#EA580C" stroke="${S}" stroke-width="3"/>
    <path d="M -44 14 Q -22 ${n(10 + wave1)} 0 14 Q 22 ${n(18 - wave1)} 44 14" stroke="#FEF08A" stroke-width="4" fill="none"/>
    <text x="0" y="32" font-family="'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FEF08A" text-anchor="middle">LAVA 1,200 °C</text>

    <!-- Capa intermedia: Colchón de vapor Leidenfrost oscilante -->
    <path d="M -42 ${n(2 + wave1)} Q -21 ${n(-4 + wave2)} 0 ${n(2 + wave1)} Q 21 ${n(8 - wave2)} 42 ${n(2 + wave1)}" stroke="#38BDF8" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M -42 ${n(2 + wave1)} Q -21 ${n(-4 + wave2)} 0 ${n(2 + wave1)} Q 21 ${n(8 - wave2)} 42 ${n(2 + wave1)}" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none"/>

    <!-- Flechas térmicas de rechazo hacia arriba -->
    <path d="M -26 ${n(-4 + arrowFloat)} L -26 ${n(-12 + arrowFloat)} M -29 ${n(-9 + arrowFloat)} L -26 ${n(-13 + arrowFloat)} L -23 ${n(-9 + arrowFloat)}" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M 26 ${n(-4 + arrowFloat)} L 26 ${n(-12 + arrowFloat)} M 23 ${n(-9 + arrowFloat)} L 26 ${n(-13 + arrowFloat)} L 29 ${n(-9 + arrowFloat)}" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

    <!-- Capa superior: Bota / Tejido orgánico suspendido sin tocar la lava -->
    <g transform="translate(0, -18)">
      <!-- Bota aislada flotando en el vapor -->
      <path d="M -16 -12 L -6 -12 L -6 2 L 18 2 L 18 10 L -16 10 Z" fill="#F8FAFC" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
      <line x1="-12" y1="10" x2="16" y2="10" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
    </g>

    <!-- Etiqueta superior del fenómeno -->
    <rect x="-42" y="-42" width="84" height="13" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
    <text x="0" y="-33" font-family="'Arial Black', sans-serif" font-size="5.8" font-weight="900" fill="#FFFFFF" text-anchor="middle">EFECTO LEIDENFROST</text>
  </g>`;
};

const volcanicDensityScale = (f: number) => {
  const tilt = Math.sin(f / 14) * 6; // Grados de inclinación oscilante

  return `<g transform="scale(1.12)">
    <!-- Base de la balanza neo-brutalista -->
    <rect x="-46" y="32" width="92" height="12" rx="3" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
    <polygon points="0,32 -8,6 8,6" fill="#475569" stroke="${S}" stroke-width="3"/>

    <!-- Brazo oscilante de la balanza -->
    <g transform="rotate(${n(tilt)}, 0, 6)">
      <line x1="-38" y1="6" x2="38" y2="6" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="0" cy="6" r="4.5" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/>

      <!-- Cuerdas del plato izquierdo (Lava pesada) -->
      <line x1="-34" y1="6" x2="-44" y2="24" stroke="${S}" stroke-width="2"/>
      <line x1="-34" y1="6" x2="-24" y2="24" stroke="${S}" stroke-width="2"/>
      <line x1="-46" y1="24" x2="-22" y2="24" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Plato izquierdo: Bloque de roca basáltica 3.1 g/cm³ -->
      <g transform="translate(-34, 15)">
        <polygon points="-9,7 9,7 7,-3 -7,-3" fill="#1C1917" stroke="${S}" stroke-width="2.5"/>
        <path d="M -4 2 L 0 5 L 4 0" stroke="#F97316" stroke-width="1.8" fill="none"/>
      </g>

      <!-- Cuerdas del plato derecho (Humano liviano flotando) -->
      <line x1="34" y1="6" x2="24" y2="24" stroke="${S}" stroke-width="2"/>
      <line x1="34" y1="6" x2="44" y2="24" stroke="${S}" stroke-width="2"/>
      <line x1="22" y1="24" x2="46" y2="24" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Plato derecho: Silueta humana flotando 1.0 g/cm³ -->
      <g transform="translate(34, 13)">
        <circle cx="0" cy="-6" r="3" fill="#38BDF8" stroke="${S}" stroke-width="1.5"/>
        <line x1="0" y1="-3" x2="0" y2="5" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="-4" y1="0" x2="4" y2="0" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
        <line x1="0" y1="5" x2="-3" y2="9" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
        <line x1="0" y1="5" x2="3" y2="9" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
      </g>
    </g>

    <!-- Indicador de densidades comparativas -->
    <rect x="-48" y="-44" width="46" height="20" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>
    <text x="-25" y="-34" font-family="'Arial Black', sans-serif" font-size="5.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">LAVA ROCA</text>
    <text x="-25" y="-26" font-family="'Arial Black', sans-serif" font-size="6.8" font-weight="900" fill="#FEF08A" text-anchor="middle">3.1 g/cm³</text>

    <rect x="2" y="-44" width="46" height="20" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
    <text x="25" y="-34" font-family="'Arial Black', sans-serif" font-size="5.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">CUERPO HUMANO</text>
    <text x="25" y="-26" font-family="'Arial Black', sans-serif" font-size="6.8" font-weight="900" fill="#BAE6FD" text-anchor="middle">1.0 g/cm³</text>

    <!-- Veredicto: ¡3 VECES MÁS DENSO! -->
    <rect x="-38" y="-18" width="76" height="12" rx="3" fill="#FACC15" stroke="${S}" stroke-width="2"/>
    <text x="0" y="-9.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#000000" text-anchor="middle">¡LA LAVA ES 3x MÁS DENSA!</text>
  </g>`;
};

const panDeMuertoXrayFlicker = (f: number) => {
  const scanY = -24 + ((f * 2) % 52);
  const flicker = Math.sin(f * 0.9) > -0.2;
  const beamOpacity = 0.5 + Math.sin(f / 4) * 0.4;
  return `<g transform="scale(1.15)">
    <path d="M -38 20 A 38 28 0 0 1 38 20 Z" fill="#D97706" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <ellipse cx="0" cy="20" rx="38" ry="8" fill="#B45309" stroke="${S}" stroke-width="4"/>
    <path d="M -26 10 L 26 -6 M -26 -6 L 26 10" stroke="#FDE68A" stroke-width="6.5" stroke-linecap="round"/>
    <circle cx="0" cy="-12" r="8.5" fill="#D97706" stroke="${S}" stroke-width="5"/>
    <circle cx="-16" cy="4" r="1.8" fill="#FEF3C7"/>
    <circle cx="-4" cy="8" r="1.8" fill="#FEF3C7"/>
    <circle cx="10" cy="4" r="1.8" fill="#FEF3C7"/>
    <circle cx="20" cy="9" r="1.8" fill="#FEF3C7"/>

    ${flicker ? `
      <rect x="-30" y="-8" width="60" height="28" rx="5" fill="#0284C7" opacity="0.65" stroke="#38BDF8" stroke-width="3"/>
      <circle cx="0" cy="-2" r="5" fill="#FFFFFF" opacity="0.95"/>
      <circle cx="-2" cy="-2" r="1.2" fill="#0284C7"/>
      <circle cx="2" cy="-2" r="1.2" fill="#0284C7"/>
      <line x1="-12" y1="6" x2="12" y2="6" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.95"/>
      <line x1="-16" y1="12" x2="16" y2="12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.95"/>
      <line x1="0" y1="2" x2="0" y2="16" stroke="#FFFFFF" stroke-width="2.5" opacity="0.95"/>
      <line x1="-34" y1="${n(scanY)}" x2="34" y2="${n(scanY)}" stroke="#67E8F9" stroke-width="3" stroke-dasharray="5 3" opacity="${n(beamOpacity)}"/>
    ` : ""}

    <rect x="-32" y="28" width="64" height="12" rx="3" fill="#FFE600" stroke="${S}" stroke-width="2.5"/>
    <text x="0" y="37" font-family="'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#000000" text-anchor="middle">ESQUELETO OCULTO</text>
  </g>`;
};

const panBaseEngranaje = (f: number) => {
  const rot = (f * 1.6) % 360;
  const pulse = 1 + Math.sin(f / 8) * 0.05;
  return `<g transform="scale(${n(pulse * 1.15)})">
    <ellipse cx="0" cy="4" rx="42" ry="28" fill="#D97706" stroke="${S}" stroke-width="6"/>
    <ellipse cx="0" cy="2" rx="34" ry="21" fill="#F59E0B" stroke="${S}" stroke-width="4"/>

    <g transform="rotate(${n(rot)})">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const gx = Math.cos(rad) * 35;
        const gy = Math.sin(rad) * 23;
        return `<circle key="${deg}" cx="${n(gx)}" cy="${n(gy)}" r="3" fill="#FDE68A" stroke="${S}" stroke-width="1.8"/>`;
      }).join("")}
    </g>

    <path d="M -26 -16 A 32 18 0 0 1 28 -16" fill="none" stroke="#FDE047" stroke-width="5.5" stroke-linecap="round"/>
    <polygon points="30,-21 39,-14 28,-10" fill="#FDE047" stroke="${S}" stroke-width="2.5"/>
    <path d="M 28 20 A 32 18 0 0 1 -26 20" fill="none" stroke="#FDE047" stroke-width="5.5" stroke-linecap="round"/>
    <polygon points="-30,25 -39,18 -28,14" fill="#FDE047" stroke="${S}" stroke-width="2.5"/>

    <rect x="-38" y="-38" width="76" height="12" rx="3" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>
    <text x="0" y="-29.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFE600" text-anchor="middle">CICLO VIDA ⇄ MUERTE</text>
  </g>`;
};

const panCraneoMorph = (f: number) => {
  const bobY = Math.sin(f / 8) * 8;
  const isSkull = Math.sin(f / 16) > 0;
  return `<g transform="translate(0 ${n(bobY)}) scale(1.2)">
    ${isSkull ? `
      <path d="M -24 -10 A 24 24 0 1 1 24 -10 C 24 6 16 14 16 26 L -16 26 C -16 14 -24 6 -24 -10 Z" fill="#FFFFFF" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="-9" cy="-6" r="6" fill="#EC4899" stroke="${S}" stroke-width="2.5"/>
      <circle cx="9" cy="-6" r="6" fill="#06B6D4" stroke="${S}" stroke-width="2.5"/>
      <circle cx="0" cy="-20" r="4" fill="#FACC15" stroke="${S}" stroke-width="2"/>
      <line x1="-8" y1="18" x2="8" y2="18" stroke="${S}" stroke-width="4" stroke-linecap="round"/>
      <line x1="-4" y1="14" x2="-4" y2="22" stroke="${S}" stroke-width="2.5"/>
      <line x1="4" y1="14" x2="4" y2="22" stroke="${S}" stroke-width="2.5"/>
      <rect x="-24" y="32" width="48" height="12" rx="3" fill="#EC4899" stroke="${S}" stroke-width="2"/>
      <text x="0" y="40.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">CALAVERITA</text>
    ` : `
      <circle cx="0" cy="4" r="22" fill="#D97706" stroke="${S}" stroke-width="6"/>
      <circle cx="0" cy="2" r="17" fill="#F59E0B"/>
      <circle cx="-7" cy="-2" r="2.5" fill="#FEF3C7"/>
      <circle cx="6" cy="1" r="2" fill="#FEF3C7"/>
      <circle cx="-2" cy="10" r="2" fill="#FEF3C7"/>
      <rect x="-22" y="32" width="44" height="12" rx="3" fill="#D97706" stroke="${S}" stroke-width="2"/>
      <text x="0" y="40.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FEF08A" text-anchor="middle">CRÁNEO</text>
    `}
  </g>`;
};

const esqueletoCanillasMatching = (f: number) => {
  const snap = Math.min(1, ((f % 70) / 40));
  const dropCanilla = snap >= 1 ? 0 : (1 - snap) * -35;

  return `<g transform="scale(1.15)">
    <g transform="translate(0, 10)">
      <circle cx="-42" cy="0" r="12" fill="#FFFFFF" stroke="${S}" stroke-width="4" opacity="0.85"/>
      <circle cx="-44" cy="-2" r="2" fill="#000000"/>
      <line x1="-30" y1="0" x2="15" y2="0" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
      <line x1="-18" y1="-10" x2="-18" y2="10" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
      <line x1="-8" y1="-10" x2="-8" y2="10" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
      <line x1="2" y1="-8" x2="2" y2="8" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="15" cy="0" rx="6" ry="10" fill="none" stroke="${S}" stroke-width="3.5"/>
      <line x1="-18" y1="-6" x2="-2" y2="-22" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="-18" y1="6" x2="-2" y2="22" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="18" y1="-4" x2="42" y2="-18" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="18" y1="4" x2="42" y2="18" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/>
    </g>

    <g transform="translate(0, ${n(dropCanilla)})">
      <rect x="-18" y="-2" width="28" height="8" rx="4" fill="#FDE68A" stroke="${S}" stroke-width="3" transform="rotate(-38 -5 -14)"/>
      <rect x="-18" y="-6" width="28" height="8" rx="4" fill="#FDE68A" stroke="${S}" stroke-width="3" transform="rotate(38 -5 14)"/>
      <rect x="18" y="-2" width="28" height="8" rx="4" fill="#FDE68A" stroke="${S}" stroke-width="3" transform="rotate(-32 30 -11)"/>
      <rect x="18" y="-6" width="28" height="8" rx="4" fill="#FDE68A" stroke="${S}" stroke-width="3" transform="rotate(32 30 11)"/>
    </g>

    ${snap >= 1 ? `
      <rect x="-42" y="-40" width="84" height="12" rx="3" fill="#22C55E" stroke="${S}" stroke-width="2"/>
      <text x="0" y="-31.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">ENCAJE ANATÓMICO 100%</text>
    ` : ""}
  </g>`;
};

const brujulaPrehispanicaHero = (f: number) => {
  const rot = (f * 0.8) % 360;
  const rayPulsing = 0.6 + Math.sin(f / 8) * 0.35;
  return `<g transform="scale(1.2)">
    <line x1="0" y1="0" x2="0" y2="-55" stroke="#DC2626" stroke-width="5" stroke-linecap="round" opacity="${n(rayPulsing)}"/>
    <line x1="0" y1="0" x2="0" y2="55" stroke="#0284C7" stroke-width="5" stroke-linecap="round" opacity="${n(rayPulsing)}"/>
    <line x1="0" y1="0" x2="55" y2="0" stroke="#F59E0B" stroke-width="5" stroke-linecap="round" opacity="${n(rayPulsing)}"/>
    <line x1="0" y1="0" x2="-55" y2="0" stroke="#F8FAFC" stroke-width="5" stroke-linecap="round" opacity="${n(rayPulsing)}"/>

    <circle cx="0" cy="0" r="32" fill="#1E1035" stroke="${S}" stroke-width="5"/>
    <circle cx="0" cy="0" r="26" fill="none" stroke="#F59E0B" stroke-width="3" stroke-dasharray="6 4"/>
    <g transform="rotate(${n(rot)})">
      <circle cx="0" cy="0" r="18" fill="#311042" stroke="${S}" stroke-width="3"/>
      <line x1="-16" y1="0" x2="16" y2="0" stroke="#FDE047" stroke-width="3"/>
      <line x1="0" y1="-16" x2="0" y2="16" stroke="#FDE047" stroke-width="3"/>
    </g>

    <circle cx="0" cy="-26" r="4.5" fill="#DC2626" stroke="${S}" stroke-width="1.8"/>
    <circle cx="0" cy="26" r="4.5" fill="#0284C7" stroke="${S}" stroke-width="1.8"/>
    <circle cx="26" cy="0" r="4.5" fill="#F59E0B" stroke="${S}" stroke-width="1.8"/>
    <circle cx="-26" cy="0" r="4.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.8"/>
  </g>`;
};

const vaporAzaharBlossoms = (f: number) => {
  const w1 = Math.sin(f / 9) * 6;
  const w2 = Math.cos(f / 11) * 7;
  return `<g transform="scale(1.2)">
    <path d="M -16 28 Q ${n(-28 + w1)} 6 -12 -14 Q ${n(4 + w2)} -32 -6 -46" fill="none" stroke="#FDE047" stroke-width="5.5" stroke-linecap="round" opacity="0.85"/>
    <path d="M 10 32 Q ${n(24 + w2)} 10 10 -10 Q ${n(-2 + w1)} -28 12 -44" fill="none" stroke="#F59E0B" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>

    <g transform="translate(-16 -8) rotate(${n((f * 2) % 360)})">
      <circle cx="0" cy="0" r="7" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/>
      <circle cx="0" cy="0" r="3" fill="#FACC15"/>
    </g>
    <g transform="translate(14 -22) rotate(${n((f * -2.5) % 360)})">
      <circle cx="0" cy="0" r="7" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/>
      <circle cx="0" cy="0" r="3" fill="#FACC15"/>
    </g>
    <g transform="translate(0 -38) rotate(${n((f * 1.8) % 360)})">
      <circle cx="0" cy="0" r="7" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/>
      <circle cx="0" cy="0" r="3" fill="#FACC15"/>
    </g>

    <rect x="-28" y="32" width="56" height="12" rx="3" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
    <text x="0" y="40.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#000000" text-anchor="middle">AROMA DE AZAHAR</text>
  </g>`;
};

const chocolateBarroSteaming = (f: number) => {
  const steam1 = Math.sin(f / 7) * 4;
  const steam2 = Math.cos(f / 8) * 4;
  return `<g transform="scale(1.15)">
    <g transform="translate(-14, 8)">
      <path d="M 18 -6 L 28 -6 A 10 10 0 0 1 28 14 L 18 14" stroke="${S}" stroke-width="5" fill="none"/>
      <rect x="-20" y="-12" width="38" height="38" rx="6" fill="#C2410C" stroke="${S}" stroke-width="5.5"/>
      <rect x="-16" y="-10" width="30" height="9" rx="3" fill="#451A03" stroke="${S}" stroke-width="2.5"/>
      <circle cx="-6" cy="-5.5" r="2" fill="#D97706"/>
      <circle cx="4" cy="-5.5" r="2.5" fill="#D97706"/>
      <path d="M -6 -20 Q ${n(-2 + steam1)} -28 -6 -36 M 6 -20 Q ${n(10 + steam2)} -28 6 -36" stroke="#E5E7EB" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    </g>

    <g transform="translate(24, 10)">
      <path d="M -18 12 A 18 14 0 0 1 6 -4 C 2 -1 3 3 6 6 C 9 9 10 14 16 13 A 18 14 0 0 1 18 12 Z" fill="#D97706" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
      <circle cx="-2" cy="-6" r="4.5" fill="#D97706" stroke="${S}" stroke-width="3"/>
      <circle cx="10" cy="3" r="1.5" fill="#FEF3C7"/>
    </g>
  </g>`;
};

const calabazaANaboMorph = (f: number) => {
  const isTurnip = Math.sin(f / 18) > 0;
  const strobe = isTurnip && Math.sin(f / 3) > 0.4;
  return `<g transform="scale(1.15)">
    ${!isTurnip ? `
      <!-- Calabaza moderna feliz naranja -->
      <ellipse cx="0" cy="4" rx="42" ry="32" fill="#EA580C" stroke="${S}" stroke-width="6"/>
      <ellipse cx="-20" cy="4" rx="18" ry="30" fill="#F97316" stroke="${S}" stroke-width="4.5"/>
      <ellipse cx="20" cy="4" rx="18" ry="30" fill="#F97316" stroke="${S}" stroke-width="4.5"/>
      <rect x="-5" y="-34" width="10" height="18" rx="3" fill="#15803D" stroke="${S}" stroke-width="4"/>
      <!-- Ojos triangulares y sonrisa feliz iluminada -->
      <polygon points="-16,-4 -6,-4 -11,-16" fill="#FEF08A" stroke="${S}" stroke-width="2.5"/>
      <polygon points="16,-4 6,-4 11,-16" fill="#FEF08A" stroke="${S}" stroke-width="2.5"/>
      <path d="M -22 10 Q 0 28 22 10 Q 0 18 -22 10 Z" fill="#FEF08A" stroke="${S}" stroke-width="3"/>
      <rect x="-34" y="38" width="68" height="12" rx="3" fill="#EA580C" stroke="${S}" stroke-width="2"/>
      <text x="0" y="46.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">CALABAZA MODERNA</text>
    ` : `
      <!-- Nabo celta original deforme y siniestro -->
      <g transform="${strobe ? "translate(2 -1)" : ""}">
        <path d="M -28 -12 C -34 16 -16 38 0 46 C 16 38 34 16 28 -12 C 24 -32 -24 -32 -28 -12 Z" fill="#CBD5E1" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
        <path d="M -24 -24 Q 0 -36 24 -24" fill="#6B21A8" stroke="${S}" stroke-width="3"/>
        <!-- Raíces toscas -->
        <path d="M 0 46 L -6 56 M 0 46 L 4 58" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Mueca cadavérica y ojos hundidos -->
        <circle cx="-11" cy="-4" r="6" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>
        <circle cx="11" cy="-4" r="6" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>
        <circle cx="-11" cy="-4" r="2.5" fill="#FDE047"/>
        <circle cx="11" cy="-4" r="2.5" fill="#FDE047"/>
        <path d="M -16 16 L -10 24 L -4 16 L 2 24 L 8 16 L 14 24" stroke="${S}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <rect x="-34" y="42" width="68" height="12" rx="3" fill="#1E293B" stroke="${S}" stroke-width="2"/>
        <text x="0" y="50.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#EF4444" text-anchor="middle">NABO ORIGINAL 100%</text>
      </g>
    `}
  </g>`;
};

const diabloArbolCruces = (f: number) => {
  const devilWobble = Math.sin(f * 0.4) * 4;
  const crossPulse = 0.7 + Math.sin(f / 8) * 0.3;
  return `<g transform="scale(1.15)">
    <!-- Árbol medieval estilizado con copa y ramas -->
    <path d="M -18 42 L -12 -10 L -38 -34 L -22 -38 L -6 -18 L 8 -36 L 22 -32 L 6 -12 L 18 42 Z" fill="#3E1A08" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="-32" cy="-38" r="16" fill="#15803D" stroke="${S}" stroke-width="4"/>
    <circle cx="18" cy="-38" r="18" fill="#15803D" stroke="${S}" stroke-width="4"/>
    <circle cx="-4" cy="-46" r="20" fill="#166534" stroke="${S}" stroke-width="4"/>

    <!-- Cruces santas talladas resplandecientes en el tronco -->
    <g transform="translate(0, 14)">
      <line x1="0" y1="-14" x2="0" y2="14" stroke="#FDE047" stroke-width="5" stroke-linecap="round"/>
      <line x1="-8" y1="-4" x2="8" y2="-4" stroke="#FDE047" stroke-width="5" stroke-linecap="round"/>
      <circle cx="0" cy="-4" r="12" fill="none" stroke="#FACC15" stroke-width="2" stroke-dasharray="4 3" opacity="${n(crossPulse)}"/>
    </g>

    <!-- Diablo rojo miniatura atrapado arriba pataleando -->
    <g transform="translate(${n(-2 + devilWobble)}, -36) scale(0.7)">
      <circle cx="0" cy="0" r="14" fill="#DC2626" stroke="${S}" stroke-width="4"/>
      <!-- Cuernos rojos -->
      <polygon points="-8,-12 -14,-24 -4,-14" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>
      <polygon points="8,-12 14,-24 4,-14" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>
      <circle cx="-4" cy="-2" r="2.5" fill="#FEF08A"/>
      <circle cx="4" cy="-2" r="2.5" fill="#FEF08A"/>
      <!-- Boca furiosa -->
      <path d="M -6 6 Q 0 0 6 6" stroke="${S}" stroke-width="3" fill="none"/>
      <!-- Manos de queja -->
      <line x1="-12" y1="4" x2="-22" y2="-8" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
      <line x1="12" y1="4" x2="22" y2="-8" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
    </g>

    <rect x="-38" y="44" width="76" height="12" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2"/>
    <text x="0" y="52.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">¡DIABLO ATRAPADO!</text>
  </g>`;
};

const cieloInfiernoPuertas = (f: number) => {
  const dropY = Math.min(1, ((f % 60) / 35)) * 40;
  return `<g transform="scale(1.15)">
    <!-- Mitad Cielo Arriba -->
    <rect x="-46" y="-48" width="92" height="40" rx="4" fill="#38BDF8" stroke="${S}" stroke-width="3"/>
    <circle cx="-24" cy="-28" r="14" fill="#FFFFFF"/>
    <circle cx="24" cy="-28" r="14" fill="#FFFFFF"/>
    <rect x="-18" y="-42" width="36" height="30" rx="4" fill="#FEF08A" stroke="${S}" stroke-width="3"/>
    <!-- Candado gigante rojo -->
    <rect x="-12" y="-30" width="24" height="16" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>
    <text x="0" y="-19" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FFFFFF" text-anchor="middle">CERRADO</text>

    <!-- Alma de Jack cayendo al abismo -->
    <g transform="translate(0, ${n(-10 + dropY)})">
      <circle cx="0" cy="0" r="8" fill="#E0F2FE" stroke="${S}" stroke-width="2" opacity="0.9"/>
      <line x1="0" y1="8" x2="0" y2="18" stroke="${S}" stroke-width="2.5"/>
      <line x1="-6" y1="12" x2="6" y2="12" stroke="${S}" stroke-width="2"/>
    </g>

    <!-- Mitad Infierno Abajo -->
    <rect x="-46" y="8" width="92" height="40" rx="4" fill="#450A0A" stroke="${S}" stroke-width="3"/>
    ${[-30, -15, 0, 15, 30].map((gx) => `<line key="${gx}" x1="${gx}" y1="8" x2="${gx}" y2="48" stroke="${S}" stroke-width="3.5"/>`).join("")}
    <rect x="-34" y="36" width="68" height="12" rx="3" fill="#B91C1C" stroke="${S}" stroke-width="2"/>
    <text x="0" y="44.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">SIN LUGAR EN NINGUNO</text>
  </g>`;
};

const carbonInfiernoMalabares = (f: number) => {
  const jugX = Math.sin(f / 4) * 24;
  const jugY = -8 - Math.abs(Math.cos(f / 4)) * 26;
  const spark = (f * 3) % 20;
  return `<g transform="scale(1.2)">
    <!-- Manos de Jack abiertas listas para atrapar -->
    <g transform="translate(-24, 18)">
      <circle cx="0" cy="0" r="7" fill="#F8FAFC" stroke="${S}" stroke-width="3"/>
      <path d="M -4 -8 L -4 0 M 0 -9 L 0 0 M 4 -8 L 4 0" stroke="${S}" stroke-width="2.5"/>
    </g>
    <g transform="translate(24, 18)">
      <circle cx="0" cy="0" r="7" fill="#F8FAFC" stroke="${S}" stroke-width="3"/>
      <path d="M -4 -8 L -4 0 M 0 -9 L 0 0 M 4 -8 L 4 0" stroke="${S}" stroke-width="2.5"/>
    </g>

    <!-- Brasa incandescente ardiente del infierno saltando -->
    <g transform="translate(${n(jugX)}, ${n(jugY)})">
      <!-- Resplandor caliente -->
      <circle cx="0" cy="0" r="16" fill="#F97316" opacity="0.45"/>
      <circle cx="0" cy="0" r="10" fill="#DC2626" stroke="${S}" stroke-width="3.5"/>
      <circle cx="0" cy="0" r="6" fill="#FEF08A"/>
      <!-- Chispas desprendidas -->
      <circle cx="${n(Math.sin(f) * 12)}" cy="${n(-10 - spark)}" r="2" fill="#FDE047"/>
      <circle cx="${n(-Math.cos(f) * 12)}" cy="${n(-14 - spark)}" r="1.5" fill="#EF4444"/>
    </g>

    <!-- Ondas de calor -->
    <path d="M -16 6 Q -12 -2 -16 -10 M 16 6 Q 20 -2 16 -10" stroke="#F59E0B" stroke-width="2.5" fill="none" opacity="0.75"/>

    <rect x="-30" y="34" width="60" height="12" rx="3" fill="#EA580C" stroke="${S}" stroke-width="2"/>
    <text x="0" y="42.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">¡CARBÓN ARDIENTE!</text>
  </g>`;
};

const naboLinternaJack = (f: number) => {
  const sway = Math.sin(f / 12) * 8;
  const flame = Math.sin(f * 0.4) * 3;
  return `<g transform="translate(0 -15) rotate(${n(sway)} 0 -45) scale(1.15)">
    <!-- Cuerda rústica de la que cuelga la linterna -->
    <path d="M 0 -45 Q ${n(sway * 0.5)} -20 0 0" stroke="#78350F" stroke-width="4" fill="none" stroke-linecap="round"/>

    <!-- Cuerpo del nabo tallado tradicional -->
    <g transform="translate(0, 18)">
      <path d="M -26 -14 C -32 14 -14 36 0 44 C 14 36 32 14 26 -14 C 22 -32 -22 -32 -26 -14 Z" fill="#E2E8F0" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
      <!-- Corona violácea natural del tubérculo -->
      <path d="M -22 -22 Q 0 -32 22 -22" fill="#7E22CE" stroke="${S}" stroke-width="2.5"/>

      <!-- Resplandor ígneo desde el interior tallado -->
      <circle cx="-10" cy="-2" r="6" fill="#FACC15" stroke="${S}" stroke-width="2.5"/>
      <circle cx="10" cy="-2" r="6" fill="#FACC15" stroke="${S}" stroke-width="2.5"/>
      <circle cx="-10" cy="-2" r="3" fill="#DC2626"/>
      <circle cx="10" cy="-2" r="3" fill="#DC2626"/>

      <!-- Mueca grotesca con flama asomándose -->
      <path d="M -16 16 L -10 24 L -4 16 L 2 24 L 8 16 L 14 24" stroke="${S}" stroke-width="3.5" stroke-linecap="round" fill="#FEF08A"/>
      <ellipse cx="0" cy="18" rx="${n(5 + flame)}" ry="4" fill="#F97316"/>
    </g>

    <rect x="-34" y="66" width="68" height="12" rx="3" fill="#1E293B" stroke="${S}" stroke-width="2"/>
    <text x="0" y="74.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FDE047" text-anchor="middle">JACK OF THE LANTERN</text>
  </g>`;
};

const cabanaNabosProteccion = (f: number) => {
  const ghostFlee = Math.min(1, ((f % 80) / 45)) * -40;
  return `<g transform="scale(1.15)">
    <!-- Marco de ventana de piedra medieval -->
    <rect x="-42" y="-36" width="84" height="68" rx="6" fill="#1E293B" stroke="${S}" stroke-width="6"/>
    <rect x="-34" y="-28" width="68" height="52" rx="3" fill="#0F172A" stroke="${S}" stroke-width="4"/>
    <line x1="0" y1="-28" x2="0" y2="24" stroke="${S}" stroke-width="4"/>
    <line x1="-34" y1="-2" x2="34" y2="-2" stroke="${S}" stroke-width="4"/>

    <!-- 3 Nabos linterna en el alféizar resplandeciendo -->
    <g transform="translate(-20, 16) scale(0.65)">
      <path d="M -16 -12 C -20 8 -8 24 0 28 C 8 24 20 8 16 -12 Z" fill="#E2E8F0" stroke="${S}" stroke-width="4"/>
      <circle cx="-6" cy="-2" r="3" fill="#FACC15"/>
      <circle cx="6" cy="-2" r="3" fill="#FACC15"/>
      <path d="M -8 10 L 8 10" stroke="${S}" stroke-width="2.5"/>
    </g>
    <g transform="translate(0, 14) scale(0.75)">
      <path d="M -16 -12 C -20 8 -8 24 0 28 C 8 24 20 8 16 -12 Z" fill="#CBD5E1" stroke="${S}" stroke-width="4"/>
      <circle cx="-6" cy="-2" r="3" fill="#FACC15"/>
      <circle cx="6" cy="-2" r="3" fill="#FACC15"/>
      <path d="M -10 10 L 0 16 L 10 10" stroke="${S}" stroke-width="2.5" fill="none"/>
    </g>
    <g transform="translate(20, 16) scale(0.65)">
      <path d="M -16 -12 C -20 8 -8 24 0 28 C 8 24 20 8 16 -12 Z" fill="#E2E8F0" stroke="${S}" stroke-width="4"/>
      <circle cx="-6" cy="-2" r="3" fill="#FACC15"/>
      <circle cx="6" cy="-2" r="3" fill="#FACC15"/>
      <path d="M -8 10 L 8 10" stroke="${S}" stroke-width="2.5"/>
    </g>

    <!-- Fantasma de Jack huyendo asustado hacia atrás -->
    <g transform="translate(${n(ghostFlee)}, -28) scale(0.7)">
      <path d="M 0 -14 A 12 12 0 0 0 -12 0 Q -12 16 0 14 Q 12 16 12 0 A 12 12 0 0 0 0 -14 Z" fill="#E0F2FE" stroke="${S}" stroke-width="3" opacity="0.85"/>
      <circle cx="-4" cy="-2" r="2" fill="#000000"/>
      <circle cx="4" cy="-2" r="2" fill="#000000"/>
      <ellipse cx="0" cy="4" rx="2" ry="4" fill="#000000"/>
    </g>

    <rect x="-38" y="38" width="76" height="12" rx="3" fill="#15803D" stroke="${S}" stroke-width="2"/>
    <text x="0" y="46.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">RITUAL SAMHAIN</text>
  </g>`;
};

const naboDuroVsCalabaza = (f: number) => {
  const bounceKnife = Math.abs(Math.sin(f / 6)) * 6;
  return `<g transform="scale(1.15)">
    <!-- Mesa rústica moderna -->
    <rect x="-48" y="24" width="96" height="18" rx="3" fill="#78350F" stroke="${S}" stroke-width="4"/>

    <!-- LADO IZQUIERDO: Nabo durísimo con cuchillo doblado (¡CLANG!) -->
    <g transform="translate(-24, 8)">
      <path d="M -16 -10 C -20 8 -8 22 0 26 C 8 22 20 8 16 -10 Z" fill="#94A3B8" stroke="${S}" stroke-width="4"/>
      <!-- Cuchillo doblado rebotando -->
      <g transform="translate(0, ${n(-16 - bounceKnife)})">
        <path d="M 0 0 L 8 -12 L 14 -10 L 6 0 Z" fill="#CBD5E1" stroke="${S}" stroke-width="2.5"/>
        <rect x="8" y="-22" width="6" height="10" rx="1.5" fill="#1E293B" stroke="${S}" stroke-width="2"/>
      </g>
      <circle cx="0" cy="-14" r="5" fill="#FFE600" stroke="${S}" stroke-width="1.5"/>
      <text x="0" y="-12" font-size="4" font-weight="900" text-anchor="middle" fill="#000000">¡CLANG!</text>
    </g>

    <!-- LADO DERECHO: Calabaza grande, dócil y fácil de cortar -->
    <g transform="translate(24, 6)">
      <ellipse cx="0" cy="4" rx="20" ry="16" fill="#EA580C" stroke="${S}" stroke-width="4"/>
      <ellipse cx="-10" cy="4" rx="8" ry="15" fill="#F97316" stroke="${S}" stroke-width="2.5"/>
      <ellipse cx="10" cy="4" rx="8" ry="15" fill="#F97316" stroke="${S}" stroke-width="2.5"/>
      <polygon points="-6,-1 -2,-1 -4,-6" fill="#FEF08A"/>
      <polygon points="6,-1 2,-1 4,-6" fill="#FEF08A"/>
      <path d="M -8 6 Q 0 14 8 6 Z" fill="#FEF08A" stroke="${S}" stroke-width="2"/>
    </g>

    <rect x="-38" y="-34" width="76" height="12" rx="3" fill="#EA580C" stroke="${S}" stroke-width="2"/>
    <text x="0" y="-25.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">DURO NABO vs CALABAZA</text>
  </g>`;
};

const gotaRupertHero = (f: number) => {
  const shimmer = 0.6 + Math.sin(f / 10) * 0.35;
  const rayRot = (f * 1.5) % 360;
  return `<g transform="scale(1.2)">
    <ellipse cx="-16" cy="0" rx="28" ry="24" fill="#38BDF8" opacity="0.18" />
    <path d="M -32 0 C -32 -20 -10 -22 8 -6 C 22 6 36 2 44 -8 C 48 -14 50 -10 46 -4 C 36 8 20 16 0 16 C -20 16 -32 12 -32 0 Z" fill="#E0F2FE" fill-opacity="0.88" stroke="${S}" stroke-width="5" stroke-linejoin="round" />
    <path d="M -26 -2 C -26 -14 -12 -15 2 -4 C -8 4 -18 6 -26 -2 Z" fill="#FFFFFF" fill-opacity="${n(shimmer)}" />
    <path d="M 6 -2 C 16 6 28 4 36 -4" stroke="#BAE6FD" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <g transform="translate(-16, -6) rotate(${n(rayRot)})">
      <line x1="-8" y1="0" x2="8" y2="0" stroke="#FDE047" stroke-width="2.5" stroke-linecap="round" />
      <line x1="0" y1="-8" x2="0" y2="8" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
    </g>
    <circle cx="45" cy="-6" r="3" fill="#EF4444" stroke="${S}" stroke-width="1.5" />
    <rect x="-38" y="26" width="76" height="12" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2"/>
    <text x="0" y="34.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle">GOTA DE RUPERTO</text>
  </g>`;
};

const balaImpactoAplastada = (f: number) => {
  const sparkScale = 0.8 + Math.sin(f * 0.8) * 0.3;
  const shockRing = (f * 3) % 24;
  return `<g transform="scale(1.15)">
    <!-- Estelas de velocidad de la bala en vuelo supersónico -->
    <line x1="-70" y1="-5" x2="-54" y2="-5" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />
    <line x1="-76" y1="0" x2="-54" y2="0" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round" />
    <line x1="-70" y1="5" x2="-54" y2="5" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />

    <!-- Gota de Rupert inamovible (cabeza a la derecha recibiendo el impacto) -->
    <g transform="translate(6, 0)">
      <path d="M -4 0 C -4 -18 16 -22 32 -6 C 44 4 52 2 58 -6 C 54 8 40 18 22 18 C 6 18 -4 12 -4 0 Z" fill="#E0F2FE" stroke="${S}" stroke-width="5" stroke-linejoin="round" />
      <path d="M 0 -4 C 0 -12 12 -14 22 -4" fill="#FFFFFF" opacity="0.85" />
      <circle cx="58" cy="-6" r="2.5" fill="#EF4444" stroke="${S}" stroke-width="1.2" />
    </g>

    <!-- Bala metálica realista (proyectil cobrizo con estrías) -->
    <g transform="translate(-6, 0)">
      <!-- Cuerpo cilíndrico del proyectil de latón/cobre -->
      <rect x="-48" y="-7" width="26" height="14" rx="2" fill="#D97706" stroke="${S}" stroke-width="3.5" />
      <line x1="-36" y1="-7" x2="-36" y2="7" stroke="#78350F" stroke-width="2" />
      <line x1="-42" y1="-7" x2="-42" y2="7" stroke="#78350F" stroke-width="2" />
      
      <!-- Ojiva aerodinámica de la bala -->
      <path d="M -22 -7 C -14 -7 -6 -4 0 0 C -6 4 -14 7 -22 7 Z" fill="#F59E0B" stroke="${S}" stroke-width="3.5" />
      
      <!-- Núcleo de plomo aplastado y deformado contra el cristal (mushrooming) -->
      <path d="M 0 -11 C 2 -5 2 5 0 11 L -4 7 L -2 0 L -4 -7 Z" fill="#64748B" stroke="${S}" stroke-width="2.5" />
      
      <!-- Esquirlas y fragmentos de camisa de cobre saliendo disparados -->
      <polygon points="-8,-11 -2,-17 -6,-8" fill="#F59E0B" stroke="${S}" stroke-width="1.5" />
      <polygon points="-8,11 -2,17 -6,8" fill="#F59E0B" stroke="${S}" stroke-width="1.5" />
      <polygon points="0,-14 6,-18 2,-9" fill="#94A3B8" stroke="${S}" stroke-width="1.5" />
      <polygon points="0,14 6,18 2,9" fill="#94A3B8" stroke="${S}" stroke-width="1.5" />
    </g>

    <!-- Destello explosivo de choque y chispas al momento de la colisión -->
    <g transform="translate(-6, 0) scale(${n(sparkScale)})">
      <circle cx="0" cy="0" r="7" fill="#FEF08A" opacity="0.95" />
      <polygon points="0,-4 8,-16 2,-8 6,-24 -3,-10 -9,-16 -4,-4" fill="#FACC15" stroke="${S}" stroke-width="1.5" />
      <polygon points="0,4 8,16 2,8 6,24 -3,10 -9,16 -4,4" fill="#EF4444" stroke="${S}" stroke-width="1.5" />
      <circle cx="0" cy="0" r="${n(8 + shockRing)}" fill="none" stroke="#FBBF24" stroke-width="2.5" stroke-dasharray="4 4" opacity="${n(1 - shockRing / 24)}" />
    </g>

    <rect x="-42" y="32" width="84" height="12" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2"/>
    <text x="0" y="40.5" font-family="'Arial Black', sans-serif" font-size="5.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">¡BALA APLASTADA 100%!</text>
  </g>`;
};

const mazoDemolicionRebote = (f: number) => {
  const flexHandle = Math.sin(f * 0.7) * 7;
  const starPulse = 0.7 + Math.sin(f / 6) * 0.3;
  return `<g transform="scale(1.15)">
    <rect x="-44" y="24" width="88" height="12" rx="2" fill="#334155" stroke="${S}" stroke-width="4" />
    <g transform="translate(0, 16) scale(0.65)">
      <path d="M -24 0 C -24 -16 -6 -18 8 -4 C 18 4 28 2 34 -6 C 30 6 20 14 6 14 C -12 14 -24 10 -24 0 Z" fill="#E0F2FE" stroke="${S}" stroke-width="4" />
      <circle cx="-16" cy="-4" r="6" fill="#FACC15" opacity="${n(starPulse)}" />
      <line x1="-22" y1="-4" x2="-10" y2="-4" stroke="#FFFFFF" stroke-width="2" />
      <line x1="-16" y1="-10" x2="-16" y2="2" stroke="#FFFFFF" stroke-width="2" />
    </g>
    <g transform="translate(0, -6) rotate(-22)">
      <rect x="-18" y="-4" width="36" height="24" rx="4" fill="#64748B" stroke="${S}" stroke-width="4.5" />
      <line x1="-18" y1="2" x2="18" y2="2" stroke="#94A3B8" stroke-width="3" />
      <path d="M 0 -4 Q ${n(flexHandle)} -32 0 -58" stroke="#B45309" stroke-width="6" fill="none" stroke-linecap="round" />
    </g>
    <path d="M -26 12 Q -34 4 -28 -4 M 26 12 Q 34 4 28 -4" stroke="#38BDF8" stroke-width="3" fill="none" stroke-linecap="round" />
    <rect x="-40" y="-36" width="80" height="12" rx="3" fill="#1E293B" stroke="${S}" stroke-width="2"/>
    <text x="0" y="-27.5" font-family="'Arial Black', sans-serif" font-size="5.5" font-weight="900" fill="#FDE047" text-anchor="middle">REBOTE COMO TITANIO</text>
  </g>`;
};

const tanqueTempleVidrio = (f: number) => {
  const bubbleY1 = ((f * 1.5) % 40);
  const bubbleY2 = (((f + 15) * 1.8) % 40);
  const steamPuff = Math.sin(f / 8) * 4;
  return `<g transform="scale(1.15)">
    <rect x="-38" y="-14" width="76" height="54" rx="6" fill="#38BDF8" fill-opacity="0.35" stroke="${S}" stroke-width="4.5" />
    <path d="M -36 -4 Q -18 -8 0 -4 Q 18 0 36 -4" stroke="#0284C7" stroke-width="3" fill="none" />
    <circle cx="-16" cy="${n(32 - bubbleY1)}" r="2.5" fill="#BAE6FD" stroke="${S}" stroke-width="1.2" />
    <circle cx="12" cy="${n(30 - bubbleY2)}" r="3.5" fill="#BAE6FD" stroke="${S}" stroke-width="1.2" />
    <path d="M -8 -44 L -4 -12 M 8 -44 L 4 -12" stroke="#64748B" stroke-width="4.5" stroke-linecap="round" />
    <g transform="translate(0, 10)">
      <ellipse cx="0" cy="0" rx="14" ry="12" fill="#38BDF8" stroke="${S}" stroke-width="3.5" />
      <ellipse cx="0" cy="0" rx="8" ry="7" fill="#EF4444" />
      <ellipse cx="0" cy="0" rx="4" ry="3.5" fill="#FDE047" />
      <path d="M -18 0 L -13 0 M 18 0 L 13 0 M 0 -16 L 0 -11 M 0 16 L 0 11" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" />
    </g>
    <g transform="translate(0, -22)" opacity="0.85">
      <ellipse cx="${n(-10 + steamPuff)}" cy="0" rx="8" ry="5" fill="#FFFFFF" />
      <ellipse cx="${n(12 - steamPuff)}" cy="-4" rx="10" ry="6" fill="#FFFFFF" />
    </g>
    <rect x="-42" y="44" width="84" height="12" rx="3" fill="#0369A1" stroke="${S}" stroke-width="2"/>
    <text x="0" y="52.5" font-family="'Arial Black', sans-serif" font-size="5.2" font-weight="900" fill="#FFFFFF" text-anchor="middle">TEMPLE: AGUA + VIDRIO FUNDIDO</text>
  </g>`;
};

const corteMolecularTension = (f: number) => {
  const pulse = Math.sin(f / 8) * 2;
  const gridRot = (f * 0.4) % 360;
  return `<g transform="scale(1.15)">
    <circle cx="0" cy="0" r="34" fill="#0F172A" stroke="${S}" stroke-width="6" />
    <circle cx="0" cy="0" r="32" fill="none" stroke="#0284C7" stroke-width="12" />
    <circle cx="0" cy="0" r="32" fill="none" stroke="#38BDF8" stroke-width="2" stroke-dasharray="4 3" />
    <circle cx="0" cy="0" r="${n(18 + pulse)}" fill="#DC2626" stroke="${S}" stroke-width="3" />
    <circle cx="0" cy="0" r="${n(10 + pulse * 0.6)}" fill="#F97316" />
    <g transform="rotate(${n(gridRot)})">
      <line x1="-16" y1="0" x2="16" y2="0" stroke="#FEF08A" stroke-width="2.5" />
      <line x1="0" y1="-16" x2="0" y2="16" stroke="#FEF08A" stroke-width="2.5" />
      <circle cx="-12" cy="0" r="2.5" fill="#FFFFFF" />
      <circle cx="12" cy="0" r="2.5" fill="#FFFFFF" />
      <circle cx="0" cy="-12" r="2.5" fill="#FFFFFF" />
      <circle cx="0" cy="12" r="2.5" fill="#FFFFFF" />
    </g>
    <polygon points="0,-28 -4,-23 4,-23" fill="#38BDF8" />
    <polygon points="0,28 -4,23 4,23" fill="#38BDF8" />
    <polygon points="-28,0 -23,-4 -23,4" fill="#38BDF8" />
    <polygon points="28,0 23,-4 23,4" fill="#38BDF8" />
    <rect x="-44" y="38" width="88" height="12" rx="3" fill="#7C2D12" stroke="${S}" stroke-width="2"/>
    <text x="0" y="46.5" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FEF08A" text-anchor="middle">ESCUDO EXTERNO VS TENSIÓN NÚCLEO</text>
  </g>`;
};

const gotaFracturaRayos = (f: number) => {
  const flash = (f % 6 < 3);
  return `<g transform="scale(1.2)">
    <path d="M -32 0 C -32 -20 -10 -22 8 -6 C 22 6 36 2 40 -4 L 38 2 C 26 12 10 16 0 16 C -20 16 -32 12 -32 0 Z" fill="#E0F2FE" stroke="${S}" stroke-width="5" stroke-linejoin="round" />
    <g transform="translate(48, -10) rotate(25)">
      <path d="M 0 0 L 8 -6 L 4 4 Z" fill="#BAE6FD" stroke="${S}" stroke-width="2.5" />
      <text x="8" y="-8" font-size="6" font-weight="900" fill="#EF4444">¡SNAP!</text>
    </g>
    <path d="M 40 -4 L 32 0 L 26 -5 L 18 2 L 12 -4 L 4 4 L -6 -6 L -14 2 L -24 -2" stroke="${flash ? "#FFFFFF" : "#38BDF8"}" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M 26 -5 L 20 -12 M 12 -4 L 6 -14 M 4 4 L -2 12 M -6 -6 L -10 -16" stroke="#FEF08A" stroke-width="2" fill="none" stroke-linecap="round" />
    <circle cx="12" cy="-4" r="${n(8 + Math.sin(f) * 4)}" fill="#38BDF8" opacity="0.35" />
    <rect x="-42" y="24" width="84" height="12" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2"/>
    <text x="0" y="32.5" font-family="'Arial Black', sans-serif" font-size="5.2" font-weight="900" fill="#FFFFFF" text-anchor="middle">¡ONDA DE CHOQUE: 5,000 KM/H!</text>
  </g>`;
};

const pulverizacionVidrioNube = (f: number) => {
  const blastRad = Math.min(48, 18 + (f % 45) * 0.7);
  const blastAlpha = Math.max(0.4, 1 - (f % 45) * 0.015);
  return `<g transform="scale(1.2)">
    <circle cx="0" cy="0" r="${n(blastRad)}" fill="#F8FAFC" stroke="${S}" stroke-width="4.5" opacity="${n(blastAlpha)}" />
    <circle cx="-16" cy="-12" r="${n(blastRad * 0.75)}" fill="#E2E8F0" opacity="${n(blastAlpha * 0.9)}" />
    <circle cx="18" cy="8" r="${n(blastRad * 0.7)}" fill="#E2E8F0" opacity="${n(blastAlpha * 0.9)}" />
    <polygon points="-24,-20 -20,-24 -22,-18" fill="#38BDF8" stroke="${S}" stroke-width="1.5" />
    <polygon points="20,-22 24,-26 22,-18" fill="#38BDF8" stroke="${S}" stroke-width="1.5" />
    <polygon points="-22,18 -18,22 -20,16" fill="#38BDF8" stroke="${S}" stroke-width="1.5" />
    <polygon points="18,18 22,22 20,16" fill="#38BDF8" stroke="${S}" stroke-width="1.5" />
    <path d="M -30 -30 L -12 -12 M 30 -30 L 12 -12 M -30 30 L -12 12 M 30 30 L 12 12" stroke="#FACC15" stroke-width="3" stroke-linecap="round" />
    <rect x="-44" y="34" width="88" height="12" rx="3" fill="#000000" stroke="#FFFFFF" stroke-width="2"/>
    <text x="0" y="42.5" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FFFFFF" text-anchor="middle">¡PULVERIZACIÓN INSTANTÁNEA!</text>
  </g>`;
};

const vasoBurbujaEstroboscopica = (f: number) => {
  const flash = f % 12 < 4;
  const rayRot = (f * 2) % 360;
  return `<g transform="scale(1.15)">
    <rect x="-30" y="-30" width="60" height="64" rx="4" fill="#38BDF8" fill-opacity="0.25" stroke="${S}" stroke-width="4.5" />
    <path d="M -28 -14 Q 0 -18 28 -14" stroke="#0284C7" stroke-width="2.5" fill="none" />
    <line x1="-28" y1="-8" x2="-18" y2="-8" stroke="#0284C7" stroke-width="2" />
    <line x1="-28" y1="4" x2="-18" y2="4" stroke="#0284C7" stroke-width="2" />
    <line x1="-28" y1="16" x2="-18" y2="16" stroke="#0284C7" stroke-width="2" />
    <circle cx="0" cy="6" r="10" fill="#E0F2FE" stroke="${S}" stroke-width="3" />
    <circle cx="0" cy="6" r="6" fill="${flash ? "#FFFFFF" : "#38BDF8"}" />
    <g transform="translate(0, 6) rotate(${n(rayRot)})" opacity="${flash ? 1 : 0.4}">
      <line x1="-24" y1="0" x2="24" y2="0" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />
      <line x1="0" y1="-24" x2="0" y2="24" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />
      <line x1="-16" y1="-16" x2="16" y2="16" stroke="#FEF08A" stroke-width="2" stroke-linecap="round" />
      <line x1="-16" y1="16" x2="16" y2="-16" stroke="#FEF08A" stroke-width="2" stroke-linecap="round" />
    </g>
    <rect x="-38" y="38" width="76" height="12" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2"/>
    <text x="0" y="46.5" font-family="'Arial Black', sans-serif" font-size="5.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">SOL EN UN VASO</text>
  </g>`;
};

const peceraPaletasPingpong = (f: number) => {
  const paddleLeft = Math.sin(f * 0.4) * 8;
  const paddleRight = -Math.sin(f * 0.4) * 8;
  const bubbleY = Math.sin(f * 0.5) * 14;
  return `<g transform="scale(1.15)">
    <rect x="-42" y="-18" width="84" height="52" rx="5" fill="#38BDF8" fill-opacity="0.3" stroke="${S}" stroke-width="4.5" />
    <path d="M -40 -6 Q 0 -10 40 -6" stroke="#0284C7" stroke-width="2.5" fill="none" />
    <g transform="translate(0, ${n(4 + bubbleY)})">
      <circle cx="0" cy="0" r="9" fill="#E0F2FE" stroke="${S}" stroke-width="2.5" />
      <circle cx="-3" cy="-3" r="3" fill="#FFFFFF" />
      <path d="M 0 -12 L 0 -16 M -8 -10 L -12 -14 M 8 -10 L 12 -14" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" />
    </g>
    <g transform="translate(${n(-24 + paddleLeft)}, 4) rotate(-18)">
      <circle cx="0" cy="0" r="14" fill="#EF4444" stroke="${S}" stroke-width="3" />
      <rect x="-3" y="14" width="6" height="16" rx="2" fill="#D97706" stroke="${S}" stroke-width="2" />
    </g>
    <g transform="translate(${n(24 + paddleRight)}, 4) rotate(18)">
      <circle cx="0" cy="0" r="14" fill="#EF4444" stroke="${S}" stroke-width="3" />
      <rect x="-3" y="14" width="6" height="16" rx="2" fill="#D97706" stroke="${S}" stroke-width="2" />
    </g>
    <rect x="-42" y="38" width="84" height="12" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2"/>
    <text x="0" y="46.5" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FFFFFF" text-anchor="middle">FUERZA MECÁNICA: INÚTIL</text>
  </g>`;
};

const matrazTransductoresUltrasonido = (f: number) => {
  return `<g transform="scale(1.15)">
    <circle cx="0" cy="0" r="32" fill="#0284C7" fill-opacity="0.25" stroke="${S}" stroke-width="5" />
    <rect x="-10" y="-46" width="20" height="18" fill="#38BDF8" fill-opacity="0.25" stroke="${S}" stroke-width="4" />
    <line x1="-12" y1="-46" x2="12" y2="-46" stroke="${S}" stroke-width="4.5" />
    <rect x="-46" y="-12" width="16" height="24" rx="3" fill="#64748B" stroke="${S}" stroke-width="3.5" />
    <line x1="-54" y1="0" x2="-46" y2="0" stroke="#EF4444" stroke-width="4" />
    <rect x="30" y="-12" width="16" height="24" rx="3" fill="#64748B" stroke="${S}" stroke-width="3.5" />
    <line x1="46" y1="0" x2="54" y2="0" stroke="#38BDF8" stroke-width="4" />
    <path d="M -24 -16 Q -12 0 -24 16" fill="none" stroke="#2DD4BF" stroke-width="3" opacity="0.8" />
    <path d="M -14 -12 Q -4 0 -14 12" fill="none" stroke="#2DD4BF" stroke-width="3" opacity="0.9" />
    <path d="M 24 -16 Q 12 0 24 16" fill="none" stroke="#2DD4BF" stroke-width="3" opacity="0.8" />
    <path d="M 14 -12 Q 4 0 14 12" fill="none" stroke="#2DD4BF" stroke-width="3" opacity="0.9" />
    <circle cx="0" cy="0" r="7" fill="#E0F2FE" stroke="${S}" stroke-width="2.5" />
    <circle cx="0" cy="0" r="3" fill="#38BDF8" />
    <rect x="-44" y="38" width="88" height="12" rx="3" fill="#0D9488" stroke="${S}" stroke-width="2"/>
    <text x="0" y="46.5" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FFFFFF" text-anchor="middle">TRAMPA ULTRASÓNICA: 28 kHz</text>
  </g>`;
};

const burbujaColapsoHidrodinamico = (f: number) => {
  const cycle = f % 36;
  const rad = cycle < 28 ? 16 + (cycle / 28) * 16 : 32 - ((cycle - 28) / 8) * 26;
  return `<g transform="scale(1.15)">
    <circle cx="0" cy="0" r="44" fill="none" stroke="#0284C7" stroke-width="2" stroke-dasharray="6 4" opacity="0.5" />
    <circle cx="0" cy="0" r="${n(rad)}" fill="#BAE6FD" fill-opacity="0.4" stroke="${S}" stroke-width="4.5" />
    <circle cx="${n(-rad * 0.3)}" cy="${n(-rad * 0.3)}" r="${n(rad * 0.25)}" fill="#FFFFFF" opacity="0.9" />
    <g stroke="#0369A1" stroke-width="3.5" stroke-linecap="round">
      <line x1="0" y1="-46" x2="0" y2="-34" />
      <polygon points="0,-30 -4,-36 4,-36" fill="#0369A1" stroke="none" />
      <line x1="0" y1="46" x2="0" y2="34" />
      <polygon points="0,30 -4,36 4,36" fill="#0369A1" stroke="none" />
      <line x1="-46" y1="0" x2="-34" y2="0" />
      <polygon points="-30,0 -36,-4 -36,4" fill="#0369A1" stroke="none" />
      <line x1="46" y1="0" x2="34" y2="0" />
      <polygon points="30,0 36,-4 36,4" fill="#0369A1" stroke="none" />
    </g>
    <rect x="-44" y="44" width="88" height="12" rx="3" fill="#1D4ED8" stroke="${S}" stroke-width="2"/>
    <text x="0" y="52.5" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FFFFFF" text-anchor="middle">COLAPSO HIDRODINÁMICO</text>
  </g>`;
};

const termometro10000Grados = (f: number) => {
  const mercuryHeight = Math.min(68, 20 + (f % 45) * 1.5);
  return `<g transform="scale(1.15)">
    <g transform="translate(-20, 0)">
      <rect x="-6" y="-38" width="12" height="74" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4" />
      <circle cx="0" cy="38" r="14" fill="#DC2626" stroke="${S}" stroke-width="4" />
      <rect x="-3" y="${n(34 - mercuryHeight)}" width="6" height="${n(mercuryHeight)}" rx="2" fill="#EF4444" />
      <circle cx="0" cy="38" r="8" fill="#FACC15" />
      ${mercuryHeight > 60 ? `
        <polygon points="0,-42 6,-50 2,-44 8,-54 -2,-46" fill="#FDE047" stroke="${S}" stroke-width="1.5" />
      ` : ""}
    </g>
    <g transform="translate(22, 0)">
      <circle cx="-10" cy="-14" r="5" fill="#F97316" stroke="${S}" stroke-width="2" />
      <circle cx="12" cy="-6" r="6" fill="#EF4444" stroke="${S}" stroke-width="2" />
      <circle cx="4" cy="18" r="5" fill="#FACC15" stroke="${S}" stroke-width="2" />
      <circle cx="-8" cy="12" r="4" fill="#F97316" stroke="${S}" stroke-width="1.8" />
      <line x1="-10" y1="-14" x2="2" y2="-10" stroke="#FEF08A" stroke-width="2" />
      <line x1="12" y1="-6" x2="-2" y2="2" stroke="#FEF08A" stroke-width="2" />
      <text x="2" y="32" font-size="5" font-weight="900" fill="#EF4444" text-anchor="middle">COLISIÓN TÉRMICA</text>
    </g>
    <rect x="-44" y="44" width="88" height="12" rx="3" fill="#991B1B" stroke="${S}" stroke-width="2"/>
    <text x="0" y="52.5" font-family="'Arial Black', sans-serif" font-size="5.2" font-weight="900" fill="#FEF08A" text-anchor="middle">¡TEMPERATURA: 10,000 °C!</text>
  </g>`;
};

const plasmaFogonazoEstelar = (f: number) => {
  const flashScale = 1.0 + Math.sin(f * 0.8) * 0.25;
  const rayRot = (f * 3) % 360;
  return `<g transform="scale(1.2)">
    <circle cx="0" cy="0" r="38" fill="#C084FC" fill-opacity="0.3" />
    <circle cx="0" cy="0" r="24" fill="#38BDF8" fill-opacity="0.5" />
    <circle cx="0" cy="0" r="12" fill="#FFFFFF" stroke="${S}" stroke-width="3" />
    <g transform="rotate(${n(rayRot)}) scale(${n(flashScale)})">
      <polygon points="0,-48 4,-12 0,-8 -4,-12" fill="#FFFFFF" stroke="${S}" stroke-width="1.5" />
      <polygon points="0,48 4,12 0,8 -4,12" fill="#FFFFFF" stroke="${S}" stroke-width="1.5" />
      <polygon points="-48,0 -12,4 -8,0 -12,-4" fill="#FFFFFF" stroke="${S}" stroke-width="1.5" />
      <polygon points="48,0 12,4 8,0 12,-4" fill="#FFFFFF" stroke="${S}" stroke-width="1.5" />
      <line x1="-32" y1="-32" x2="32" y2="32" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />
      <line x1="-32" y1="32" x2="32" y2="-32" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" />
    </g>
    <rect x="-44" y="38" width="88" height="12" rx="3" fill="#6B21A8" stroke="${S}" stroke-width="2"/>
    <text x="0" y="46.5" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FDF4FF" text-anchor="middle">FOGONAZO DE PLASMA REAL</text>
  </g>`;
};

const matrazEstrellaMiniatura = (f: number) => {
  const glow = 0.6 + Math.sin(f / 8) * 0.4;
  return `<g transform="scale(1.15)">
    <rect x="-26" y="-32" width="52" height="66" rx="4" fill="#0284C7" fill-opacity="0.25" stroke="${S}" stroke-width="4.5" />
    <line x1="-24" y1="-16" x2="24" y2="-16" stroke="#38BDF8" stroke-width="2" />
    <circle cx="0" cy="8" r="18" fill="#38BDF8" opacity="${n(glow * 0.35)}" />
    <circle cx="0" cy="8" r="8" fill="#E0F2FE" stroke="${S}" stroke-width="2.5" />
    <circle cx="0" cy="8" r="4" fill="#FFFFFF" />
    <line x1="-12" y1="8" x2="12" y2="8" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
    <line x1="0" y1="-4" x2="0" y2="20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
    <rect x="-42" y="42" width="84" height="12" rx="3" fill="#0369A1" stroke="${S}" stroke-width="2"/>
    <text x="0" y="50.5" font-family="'Arial Black', sans-serif" font-size="5.2" font-weight="900" fill="#FFFFFF" text-anchor="middle">ESTRELLA EN MINIATURA</text>
  </g>`;
};

export const PROPS_LIBRARY: Record<string, PropDef> = {
  // ===========================================================================
  // 1. EDUCACIÓN Y CIENCIA
  // ===========================================================================
  book: {
    id: "book",
    name: "Libro cerrado",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-28" y="-36" width="56" height="72" rx="6" fill="#3B82F6" stroke="${S}" stroke-width="6"/><line x1="-16" y1="-36" x2="-16" y2="36" stroke="${S}" stroke-width="5"/><rect x="-8" y="-18" width="24" height="14" rx="2" fill="#FFFFFF" stroke="${S}" stroke-width="4"/>`,
    tags: ["libro", "lectura", "educacion", "estudio"],
  },
  open_book: {
    id: "open_book",
    name: "Libro abierto",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<path d="M 0 -24 Q -24 -32 -48 -22 L -48 26 Q -24 16 0 26 Q 24 16 48 26 L 48 -22 Q 24 -32 0 -24 Z" fill="#FFFFFF" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><line x1="0" y1="-24" x2="0" y2="26" stroke="${S}" stroke-width="5"/><path d="M -36 -10 L -12 -12 M -36 2 L -12 0 M 12 -12 L 36 -10 M 12 0 L 36 2" stroke="#6B7280" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["libro_abierto", "leyendo", "aprendiendo", "historia"],
  },
  notebook: {
    id: "notebook",
    name: "Cuaderno de notas",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<rect x="-26" y="-36" width="52" height="72" rx="5" fill="#FDE047" stroke="${S}" stroke-width="6"/><path d="M -32 -24 L -20 -24 M -32 -8 L -20 -8 M -32 8 L -20 8 M -32 24 L -20 24" stroke="${S}" stroke-width="5" stroke-linecap="round"/><path d="M -10 -12 L 14 -12 M -10 2 L 14 2 M -10 16 L 8 16" stroke="${S}" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["cuaderno", "notas", "apuntes", "escuela"],
  },
  pencil: {
    id: "pencil",
    name: "Lápiz",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<g transform="rotate(-35)"><rect x="-8" y="-36" width="16" height="52" fill="#F59E0B" stroke="${S}" stroke-width="5"/><rect x="-8" y="-48" width="16" height="12" rx="3" fill="#F472B6" stroke="${S}" stroke-width="5"/><polygon points="-8,16 8,16 0,36" fill="#FDE68A" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="32" r="3" fill="${S}"/></g>`,
    tags: ["lapiz", "dibujar", "escribir", "escuela"],
  },
  pen: {
    id: "pen",
    name: "Bolígrafo",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<g transform="rotate(-35)"><rect x="-6" y="-40" width="12" height="56" rx="4" fill="#2563EB" stroke="${S}" stroke-width="5"/><polygon points="-6,16 6,16 0,34" fill="#E5E7EB" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><path d="M 6 -32 L 14 -32 L 14 -8" stroke="${S}" stroke-width="4" stroke-linecap="round" fill="none"/></g>`,
    tags: ["boligrafo", "pluma", "escribir", "firma"],
  },
  chalkboard: {
    id: "chalkboard",
    name: "Pizarra educativa",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-52" y="-38" width="104" height="76" rx="6" fill="#065F46" stroke="#92400E" stroke-width="8"/><text x="-34" y="8" fill="#FFFFFF" font-size="26" font-weight="900" font-family="sans-serif">E=mc²</text>`,
    tags: ["pizarra", "clase", "profesor", "formula", "enseñar"],
  },
  marker: {
    id: "marker",
    name: "Marcador",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<g transform="rotate(-30)"><rect x="-9" y="-32" width="18" height="48" rx="3" fill="#FFFFFF" stroke="${S}" stroke-width="5"/><rect x="-9" y="-14" width="18" height="20" fill="#EF4444"/><polygon points="-6,16 6,16 3,28 -3,28" fill="#EF4444" stroke="${S}" stroke-width="4"/></g>`,
    tags: ["marcador", "plumon", "pizarra"],
  },
  ruler: {
    id: "ruler",
    name: "Regla de medir",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<g transform="rotate(-25)"><rect x="-12" y="-44" width="24" height="88" rx="3" fill="#FBBF24" stroke="${S}" stroke-width="5"/><path d="M -12 -28 L -2 -28 M -12 -14 L 2 -14 M -12 0 L -2 0 M -12 14 L 2 14 M -12 28 L -2 28" stroke="${S}" stroke-width="4" stroke-linecap="round"/></g>`,
    tags: ["regla", "medir", "geometria", "matematicas"],
  },
  lightbulb: {
    id: "lightbulb",
    name: "Bombilla encendida",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M 0 -42 C -22 -42 -34 -24 -22 -4 C -16 6 -14 14 -14 20 L 14 20 C 14 14 16 6 22 -4 C 34 -24 22 -42 0 -42 Z" fill="#FACC15" stroke="${S}" stroke-width="6"/><rect x="-11" y="20" width="22" height="12" rx="3" fill="#9CA3AF" stroke="${S}" stroke-width="5"/><path d="M 0 -56 L 0 -48 M -38 -32 L -30 -26 M 38 -32 L 30 -26" stroke="#F59E0B" stroke-width="5" stroke-linecap="round"/>`,
    tags: ["bombilla", "idea", "energia", "electricidad", "luz"],
  },
  flask: {
    id: "flask",
    name: "Matraz de laboratorio",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -10 -36 L -10 -12 L -34 30 C -37 36 -33 42 -26 42 L 26 42 C 33 42 37 36 34 30 L 10 -12 L 10 -36 Z" fill="#E0F2FE" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M -23 12 L 23 12 L 33 30 C 35 35 32 40 26 40 L -26 40 C -32 40 -35 35 -33 30 Z" fill="#10B981"/><line x1="-16" y1="-36" x2="16" y2="-36" stroke="${S}" stroke-width="6" stroke-linecap="round"/><circle cx="-6" cy="24" r="4" fill="#FFFFFF"/><circle cx="8" cy="18" r="3" fill="#FFFFFF"/>`,
    tags: ["matraz", "quimica", "ciencia", "experimento", "laboratorio"],
  },
  test_tube: {
    id: "test_tube",
    name: "Tubo de ensayo",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<g transform="rotate(15)"><path d="M -12 -38 L -12 24 A 12 12 0 0 0 12 24 L 12 -38 Z" fill="#F3E8FF" stroke="${S}" stroke-width="6"/><path d="M -10 0 L 10 0 L 10 24 A 10 10 0 0 1 -10 24 Z" fill="#A855F7"/><line x1="-17" y1="-38" x2="17" y2="-38" stroke="${S}" stroke-width="6" stroke-linecap="round"/></g>`,
    tags: ["tubo_ensayo", "quimica", "biologia", "muestra"],
  },
  microscope: {
    id: "microscope",
    name: "Microscopio",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -28 38 L 28 38 M 10 38 L 10 22 C 26 16 28 -10 10 -16" stroke="${S}" stroke-width="7" stroke-linecap="round" fill="none"/><rect x="-12" y="-38" width="14" height="36" rx="3" transform="rotate(-20)" fill="#60A5FA" stroke="${S}" stroke-width="5"/><line x1="-20" y1="12" x2="8" y2="12" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`,
    tags: ["microscopio", "bacterias", "celulas", "ciencia", "laboratorio"],
  },
  magnifier: {
    id: "magnifier",
    name: "Lupa de investigación",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="-8" cy="-10" r="24" fill="#BAE6FD" fill-opacity="0.7" stroke="${S}" stroke-width="7"/><line x1="10" y1="8" x2="34" y2="32" stroke="#92400E" stroke-width="10" stroke-linecap="round"/><path d="M -18 -20 A 12 12 0 0 1 -4 -22" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    tags: ["lupa", "investigar", "buscar", "pista", "detalle"],
  },
  atom: {
    id: "atom",
    name: "Átomo estilizado",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<ellipse cx="0" cy="0" rx="38" ry="14" transform="rotate(30)" stroke="#3B82F6" stroke-width="5" fill="none"/><ellipse cx="0" cy="0" rx="38" ry="14" transform="rotate(-30)" stroke="#3B82F6" stroke-width="5" fill="none"/><ellipse cx="0" cy="0" rx="38" ry="14" transform="rotate(90)" stroke="#3B82F6" stroke-width="5" fill="none"/><circle cx="0" cy="0" r="9" fill="#EF4444" stroke="${S}" stroke-width="4"/>`,
    tags: ["atomo", "fisica", "energia", "ciencia", "nuclear"],
  },
  molecule: {
    id: "molecule",
    name: "Molécula",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<line x1="-22" y1="18" x2="0" y2="-14" stroke="${S}" stroke-width="6"/><line x1="22" y1="18" x2="0" y2="-14" stroke="${S}" stroke-width="6"/><circle cx="0" cy="-14" r="14" fill="#EF4444" stroke="${S}" stroke-width="5"/><circle cx="-24" cy="20" r="10" fill="#3B82F6" stroke="${S}" stroke-width="5"/><circle cx="24" cy="20" r="10" fill="#3B82F6" stroke="${S}" stroke-width="5"/>`,
    tags: ["molecula", "agua", "quimica", "estructura"],
  },
  planet: {
    id: "planet",
    name: "Planeta con anillos",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="24" fill="#F59E0B" stroke="${S}" stroke-width="6"/><ellipse cx="0" cy="0" rx="44" ry="11" transform="rotate(-20)" stroke="#6366F1" stroke-width="6" fill="none"/>`,
    tags: ["planeta", "espacio", "astronomia", "universo", "saturno"],
  },
  globe: {
    id: "globe",
    name: "Globo terráqueo",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="-6" r="26" fill="#3B82F6" stroke="${S}" stroke-width="6"/><path d="M -14 -18 Q -4 -10 -10 4 Q -2 12 8 2 M 8 -20 Q 18 -10 12 6" stroke="#10B981" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M 0 20 L 0 38 M -18 38 L 18 38" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`,
    tags: ["globo", "tierra", "mundo", "geografia", "paises"],
  },
  telescope: {
    id: "telescope",
    name: "Telescopio",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<g transform="rotate(-25)"><polygon points="-34,-8 30,-16 30,16 -34,8" fill="#F59E0B" stroke="${S}" stroke-width="6" stroke-linejoin="round"/></g><path d="M 0 6 L -18 40 M 0 6 L 18 40 M 0 6 L 0 42" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`,
    tags: ["telescopio", "estrellas", "astronomia", "observar"],
  },
  thermometer: {
    id: "thermometer",
    name: "Termómetro",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -8 -36 A 8 8 0 0 1 8 -36 L 8 10 A 16 16 0 1 1 -8 10 Z" fill="#FFFFFF" stroke="${S}" stroke-width="6"/><circle cx="0" cy="22" r="10" fill="#EF4444"/><line x1="0" y1="-18" x2="0" y2="22" stroke="#EF4444" stroke-width="8" stroke-linecap="round"/>`,
    tags: ["termometro", "temperatura", "calor", "fiebre", "grados"],
  },
  magnet: {
    id: "magnet",
    name: "Imán en herradura",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -24 -28 L -24 6 A 24 24 0 0 0 24 6 L 24 -28 L 10 -28 L 10 6 A 10 10 0 0 1 -10 6 L -10 -28 Z" fill="#EF4444" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><rect x="-24" y="-28" width="14" height="12" fill="#E5E7EB" stroke="${S}" stroke-width="5"/><rect x="10" y="-28" width="14" height="12" fill="#E5E7EB" stroke="${S}" stroke-width="5"/>`,
    tags: ["iman", "magnetismo", "atraccion", "fisica"],
  },
  scale: {
    id: "scale",
    name: "Balanza de precisión",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -32 -12 L 32 -12 M 0 -24 L 0 36 M -20 36 L 20 36" stroke="${S}" stroke-width="6" stroke-linecap="round"/><path d="M -32 -12 L -40 12 L -24 12 Z M 32 -12 L 24 12 L 40 12 Z" fill="#FBBF24" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>`,
    tags: ["balanza", "peso", "justicia", "comparar", "medida"],
  },
  gear: {
    id: "gear",
    name: "Engranaje mecánico",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="24" fill="#9CA3AF" stroke="${S}" stroke-width="6"/><circle cx="0" cy="0" r="9" fill="#FFFFFF" stroke="${S}" stroke-width="5"/><path d="M 0 -34 L 0 -24 M 0 24 L 0 34 M -34 0 L -24 0 M 24 0 L 34 0 M -24 -24 L -17 -17 M 17 17 L 24 24 M 24 -24 L 17 -17 M -17 17 L -24 24" stroke="${S}" stroke-width="8" stroke-linecap="round"/>`,
    tags: ["engranaje", "ingenieria", "mecanica", "sistema", "proceso"],
  },

  // ===========================================================================
  // 2. TECNOLOGÍA
  // ===========================================================================
  smartphone: {
    id: "smartphone",
    name: "Teléfono móvil",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-20" y="-36" width="40" height="72" rx="8" fill="#1F2937" stroke="${S}" stroke-width="6"/><rect x="-15" y="-26" width="30" height="50" rx="3" fill="#38BDF8"/><circle cx="0" cy="30" r="3" fill="#FFFFFF"/>`,
    tags: ["telefono", "celular", "movil", "smartphone", "app"],
  },
  tablet: {
    id: "tablet",
    name: "Tableta digital",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-32" y="-40" width="64" height="80" rx="8" fill="#1F2937" stroke="${S}" stroke-width="6"/><rect x="-25" y="-30" width="50" height="60" rx="3" fill="#60A5FA"/>`,
    tags: ["tablet", "tableta", "pantalla", "digital"],
  },
  laptop: {
    id: "laptop",
    name: "Computadora portátil",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-34" y="-32" width="68" height="44" rx="5" fill="#374151" stroke="${S}" stroke-width="6"/><rect x="-28" y="-26" width="56" height="32" fill="#38BDF8"/><polygon points="-44,12 44,12 52,24 -52,24" fill="#9CA3AF" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["laptop", "portatil", "computadora", "programar", "trabajo"],
  },
  monitor: {
    id: "monitor",
    name: "Monitor de computadora",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-40" y="-34" width="80" height="52" rx="6" fill="#1F2937" stroke="${S}" stroke-width="6"/><rect x="-33" y="-27" width="66" height="38" fill="#34D399"/><path d="M 0 18 L 0 34 M -20 34 L 20 34" stroke="${S}" stroke-width="6" stroke-linecap="round"/>`,
    tags: ["monitor", "pantalla", "pc", "escritorio"],
  },
  keyboard: {
    id: "keyboard",
    name: "Teclado",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-42" y="-18" width="84" height="36" rx="5" fill="#E5E7EB" stroke="${S}" stroke-width="6"/><path d="M -30 -6 L -22 -6 M -12 -6 L -4 -6 M 6 -6 L 14 -6 M 24 -6 L 30 -6 M -24 6 L 24 6" stroke="${S}" stroke-width="5" stroke-linecap="round"/>`,
    tags: ["teclado", "escribir", "computadora", "codigo"],
  },
  mouse: {
    id: "mouse",
    name: "Ratón de computadora",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-28" width="36" height="56" rx="18" fill="#F3F4F6" stroke="${S}" stroke-width="6"/><line x1="0" y1="-28" x2="0" y2="-6" stroke="${S}" stroke-width="5"/>`,
    tags: ["raton", "mouse", "clic", "computadora"],
  },
  microchip: {
    id: "microchip",
    name: "Microchip / Procesador",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-24" width="48" height="48" rx="6" fill="#10B981" stroke="${S}" stroke-width="6"/><rect x="-12" y="-12" width="24" height="24" rx="2" fill="#FBBF24" stroke="${S}" stroke-width="4"/><path d="M -34 -12 L -24 -12 M -34 0 L -24 0 M -34 12 L -24 12 M 24 -12 L 34 -12 M 24 0 L 34 0 M 24 12 L 34 12 M -12 -34 L -12 -24 M 0 -34 L 0 -24 M 12 -34 L 12 -24 M -12 24 L -12 34 M 0 24 L 0 34 M 12 24 L 12 34" stroke="${S}" stroke-width="5" stroke-linecap="round"/>`,
    tags: ["chip", "microchip", "procesador", "ia", "electronica"],
  },
  mini_robot: {
    id: "mini_robot",
    name: "Robot pequeño",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="-42" x2="0" y2="-26" stroke="${S}" stroke-width="5"/><circle cx="0" cy="-44" r="6" fill="#EF4444" stroke="${S}" stroke-width="4"/><rect x="-26" y="-26" width="52" height="44" rx="8" fill="#93C5FD" stroke="${S}" stroke-width="6"/><circle cx="-11" cy="-8" r="6" fill="#FACC15" stroke="${S}" stroke-width="4"/><circle cx="11" cy="-8" r="6" fill="#FACC15" stroke="${S}" stroke-width="4"/><line x1="-12" y1="8" x2="12" y2="8" stroke="${S}" stroke-width="5" stroke-linecap="round"/>`,
    tags: ["robot", "inteligencia_artificial", "ia", "futuro", "bot"],
  },
  cable: {
    id: "cable",
    name: "Cable conector",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<path d="M -28 24 C -28 -20 28 20 28 -18" stroke="${S}" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="18" y="-34" width="20" height="16" rx="3" fill="#3B82F6" stroke="${S}" stroke-width="5"/><path d="M 24 -42 L 24 -34 M 32 -42 L 32 -34" stroke="${S}" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["cable", "usb", "enchufe", "conexion"],
  },
  battery: {
    id: "battery",
    name: "Batería con carga",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-22" y="-30" width="44" height="64" rx="6" fill="#FFFFFF" stroke="${S}" stroke-width="6"/><rect x="-10" y="-40" width="20" height="10" rx="2" fill="${S}"/><rect x="-15" y="-4" width="30" height="31" rx="2" fill="#22C55E"/><polygon points="2,-20 -8,-2 0,-2 -2,14 8,-4 0,-4" fill="#FACC15"/>`,
    tags: ["bateria", "pila", "energia", "carga"],
  },
  gamepad: {
    id: "gamepad",
    name: "Mando de videojuegos",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<path d="M -26 -18 L 26 -18 C 38 -18 44 10 32 24 C 24 32 16 14 10 14 L -10 14 C -16 14 -24 32 -32 24 C -44 10 -38 -18 -26 -18 Z" fill="#6366F1" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M -22 -4 L -10 -4 M -16 -10 L -16 2" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><circle cx="16" cy="-6" r="4" fill="#FACC15"/><circle cx="24" cy="0" r="4" fill="#EF4444"/>`,
    tags: ["videojuegos", "mando", "control", "consola", "gamer"],
  },
  camera: {
    id: "camera",
    name: "Cámara fotográfica",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-34" y="-20" width="68" height="48" rx="8" fill="#374151" stroke="${S}" stroke-width="6"/><polygon points="-14,-20 -8,-30 8,-30 14,-20" fill="#374151" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><circle cx="0" cy="4" r="14" fill="#60A5FA" stroke="#FFFFFF" stroke-width="5"/>`,
    tags: ["camara", "foto", "video", "fotografia"],
  },
  headphones: {
    id: "headphones",
    name: "Auriculares",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<path d="M -32 8 A 32 32 0 0 1 32 8" stroke="${S}" stroke-width="8" fill="none"/><rect x="-40" y="2" width="14" height="26" rx="6" fill="#EF4444" stroke="${S}" stroke-width="5"/><rect x="26" y="2" width="14" height="26" rx="6" fill="#EF4444" stroke="${S}" stroke-width="5"/>`,
    tags: ["auriculares", "musica", "audio", "sonido", "podcast"],
  },
  antenna: {
    id: "antenna",
    name: "Antena de señal",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<path d="M -18 36 L 0 -18 L 18 36 M -10 14 L 10 14" stroke="${S}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="0" cy="-22" r="7" fill="#EF4444" stroke="${S}" stroke-width="4"/><path d="M -18 -32 Q -28 -22 -18 -12 M 18 -32 Q 28 -22 18 -12" stroke="#3B82F6" stroke-width="5" stroke-linecap="round" fill="none"/>`,
    tags: ["antena", "señal", "radio", "wifi", "telecomunicaciones"],
  },
  router: {
    id: "router",
    name: "Router Wi-Fi",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<line x1="-20" y1="0" x2="-28" y2="-36" stroke="${S}" stroke-width="6" stroke-linecap="round"/><line x1="20" y1="0" x2="28" y2="-36" stroke="${S}" stroke-width="6" stroke-linecap="round"/><rect x="-36" y="0" width="72" height="32" rx="6" fill="#1E293B" stroke="${S}" stroke-width="6"/><circle cx="-22" cy="16" r="4" fill="#22C55E"/><circle cx="-10" cy="16" r="4" fill="#22C55E"/><circle cx="2" cy="16" r="4" fill="#EF4444"/><circle cx="14" cy="16" r="4" fill="#EF4444"/><path d="M 22 12 L 28 20 M 28 12 L 22 20" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>`,
    tags: ["router", "wifi", "internet", "red", "modem", "conexion"],
  },
  no_wifi: {
    id: "no_wifi",
    name: "Sin señal Wi-Fi",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="32" fill="#FEE2E2" stroke="${S}" stroke-width="6"/><path d="M -20 -10 Q 0 -26 20 -10 M -14 -2 Q 0 -14 14 -2 M -7 6 Q 0 0 7 6" stroke="#94A3B8" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="0" cy="14" r="3.5" fill="#94A3B8"/><line x1="-24" y1="-24" x2="24" y2="24" stroke="#EF4444" stroke-width="7" stroke-linecap="round"/>`,
    tags: ["no_wifi", "sin_internet", "desconectado", "corte", "offline"],
  },

  // ===========================================================================
  // 3. VIDA COTIDIANA
  // ===========================================================================
  mug: {
    id: "mug",
    name: "Taza caliente",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<path d="M 18 -12 L 28 -12 A 10 10 0 0 1 28 12 L 18 12" stroke="${S}" stroke-width="6" fill="none"/><rect x="-22" y="-20" width="40" height="46" rx="6" fill="#F97316" stroke="${S}" stroke-width="6"/><path d="M -10 -30 Q -6 -38 -10 -44 M 6 -30 Q 10 -38 6 -44" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    tags: ["taza", "cafe", "te", "bebida", "mañana"],
  },
  water_bottle: {
    id: "water_bottle",
    name: "Botella de agua",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<rect x="-16" y="-18" width="32" height="54" rx="6" fill="#38BDF8" stroke="${S}" stroke-width="6"/><path d="M -8 -18 L -8 -30 L 8 -30 L 8 -18" fill="#E0F2FE" stroke="${S}" stroke-width="5"/><rect x="-10" y="-38" width="20" height="8" rx="2" fill="#1D4ED8" stroke="${S}" stroke-width="4"/>`,
    tags: ["botella", "agua", "hidratacion", "plastico"],
  },
  glass: {
    id: "glass",
    name: "Vaso con agua",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<polygon points="-20,-28 20,-28 14,32 -14,32" fill="#E0F2FE" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><polygon points="-17,-4 17,-4 13,30 -13,30" fill="#38BDF8"/>`,
    tags: ["vaso", "agua", "liquido", "beber"],
  },
  plate: {
    id: "plate",
    name: "Plato",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<ellipse cx="0" cy="4" rx="38" ry="16" fill="#FFFFFF" stroke="${S}" stroke-width="6"/><ellipse cx="0" cy="4" rx="24" ry="8" fill="#F3F4F6" stroke="${S}" stroke-width="4"/>`,
    tags: ["plato", "comida", "cocina", "alimento"],
  },
  spoon: {
    id: "spoon",
    name: "Cuchara",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<g transform="rotate(-30)"><ellipse cx="0" cy="-24" rx="12" ry="16" fill="#D1D5DB" stroke="${S}" stroke-width="5"/><line x1="0" y1="-8" x2="0" y2="36" stroke="${S}" stroke-width="6" stroke-linecap="round"/></g>`,
    tags: ["cuchara", "comer", "cocina", "utensilio"],
  },
  box: {
    id: "box",
    name: "Caja de cartón",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<rect x="-34" y="-24" width="68" height="54" rx="4" fill="#D97706" stroke="${S}" stroke-width="6"/><line x1="-34" y1="-6" x2="34" y2="-6" stroke="${S}" stroke-width="5"/><rect x="-8" y="-24" width="16" height="26" fill="#FDE68A" stroke="${S}" stroke-width="4"/>`,
    tags: ["caja", "paquete", "envio", "mudanza", "guardar"],
  },
  backpack: {
    id: "backpack",
    name: "Mochila",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<path d="M -12 -36 A 12 12 0 0 1 12 -36" stroke="${S}" stroke-width="6" fill="none"/><rect x="-26" y="-28" width="52" height="60" rx="14" fill="#EF4444" stroke="${S}" stroke-width="6"/><rect x="-18" y="2" width="36" height="22" rx="6" fill="#FBBF24" stroke="${S}" stroke-width="5"/>`,
    tags: ["mochila", "escuela", "viaje", "equipaje"],
  },
  keys: {
    id: "keys",
    name: "Llaves",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<circle cx="-12" cy="-14" r="14" fill="none" stroke="#F59E0B" stroke-width="7"/><path d="M -2 -4 L 26 24 M 18 16 L 10 24 M 25 23 L 17 31" stroke="#F59E0B" stroke-width="7" stroke-linecap="round"/>`,
    tags: ["llaves", "abrir", "puerta", "seguridad", "acceso"],
  },
  clock: {
    id: "clock",
    name: "Reloj",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="30" fill="#FFFFFF" stroke="${S}" stroke-width="6"/><circle cx="0" cy="0" r="23" fill="none" stroke="#EF4444" stroke-width="3"/><path d="M 0 -16 L 0 0 L 12 8" stroke="${S}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    tags: ["reloj", "tiempo", "hora", "espera", "puntualidad"],
  },
  umbrella: {
    id: "umbrella",
    name: "Paraguas",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<path d="M -38 -4 A 38 34 0 0 1 38 -4 Z" fill="#8B5CF6" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M 0 -4 L 0 30 A 8 8 0 0 1 -16 30" stroke="${S}" stroke-width="6" stroke-linecap="round" fill="none"/>`,
    tags: ["paraguas", "lluvia", "clima", "proteccion"],
  },
  flashlight: {
    id: "flashlight",
    name: "Linterna encendida",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<polygon points="14,-12 48,-30 48,14 14,-4" fill="#FEF08A" opacity="0.85"/><rect x="-28" y="-14" width="32" height="16" rx="3" fill="#4B5563" stroke="${S}" stroke-width="5"/><polygon points="4,-14 16,-22 16,6 4,-2" fill="#F59E0B" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>`,
    tags: ["linterna", "luz", "oscuridad", "buscar", "misterio"],
  },
  suitcase: {
    id: "suitcase",
    name: "Maleta de viaje",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<path d="M -12 -22 L -12 -34 L 12 -34 L 12 -22" stroke="${S}" stroke-width="6" fill="none"/><rect x="-32" y="-22" width="64" height="50" rx="6" fill="#0EA5E9" stroke="${S}" stroke-width="6"/><line x1="-14" y1="-22" x2="-14" y2="28" stroke="#FDE047" stroke-width="5"/><line x1="14" y1="-22" x2="14" y2="28" stroke="#FDE047" stroke-width="5"/>`,
    tags: ["maleta", "viaje", "vacaciones", "turismo"],
  },
  gift: {
    id: "gift",
    name: "Caja de regalo",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<rect x="-28" y="-16" width="56" height="46" rx="4" fill="#F43F5E" stroke="${S}" stroke-width="6"/><rect x="-32" y="-26" width="64" height="12" rx="3" fill="#FB7185" stroke="${S}" stroke-width="6"/><line x1="0" y1="-26" x2="0" y2="30" stroke="#FACC15" stroke-width="8"/><path d="M 0 -26 C -20 -44 -26 -26 0 -26 C 26 -26 20 -44 0 -26" stroke="#FACC15" stroke-width="6" fill="none"/>`,
    tags: ["regalo", "sorpresa", "fiesta", "premio"],
  },
  shopping_bag: {
    id: "shopping_bag",
    name: "Bolsa de compras",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<path d="M -14 -16 A 14 16 0 0 1 14 -16" stroke="${S}" stroke-width="6" fill="none"/><polygon points="-26,-16 26,-16 30,32 -30,32" fill="#EC4899" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["bolsa", "compras", "tienda", "mercado"],
  },

  // ===========================================================================
  // 4. NATURALEZA Y CIENCIA ALIMENTARIA
  // ===========================================================================
  leaf: {
    id: "leaf",
    name: "Hoja verde",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M -24 24 C -28 -16 12 -32 30 -28 C 26 -10 10 28 -24 24 Z" fill="#22C55E" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M -28 28 L 16 -16" stroke="${S}" stroke-width="5" stroke-linecap="round"/>`,
    tags: ["hoja", "planta", "naturaleza", "ecologia", "fotosintesis"],
  },
  flower: {
    id: "flower",
    name: "Flor",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="0" x2="0" y2="38" stroke="#16A34A" stroke-width="7" stroke-linecap="round"/><circle cx="0" cy="-22" r="11" fill="#F472B6" stroke="${S}" stroke-width="4"/><circle cx="18" cy="-8" r="11" fill="#F472B6" stroke="${S}" stroke-width="4"/><circle cx="-18" cy="-8" r="11" fill="#F472B6" stroke="${S}" stroke-width="4"/><circle cx="11" cy="10" r="11" fill="#F472B6" stroke="${S}" stroke-width="4"/><circle cx="-11" cy="10" r="11" fill="#F472B6" stroke="${S}" stroke-width="4"/><circle cx="0" cy="-6" r="10" fill="#FACC15" stroke="${S}" stroke-width="4"/>`,
    tags: ["flor", "jardin", "botanica", "primavera"],
  },
  potted_plant: {
    id: "potted_plant",
    name: "Planta en maceta",
    family: "naturaleza_alimentos",
    defaultPlacement: "both",
    svg: `<polygon points="-24,4 24,4 18,36 -18,36" fill="#D97706" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M 0 4 L 0 -24 M 0 -10 C -22 -14 -24 -32 -4 -24 M 0 -16 C 22 -20 24 -38 4 -30" stroke="#16A34A" stroke-width="7" stroke-linecap="round" fill="#22C55E"/>`,
    tags: ["maceta", "planta", "crecimiento", "cultivo"],
  },
  apple: {
    id: "apple",
    name: "Manzana",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M 0 -16 C -18 -26 -32 -6 -24 18 C -18 32 -4 32 0 26 C 4 32 18 32 24 18 C 32 -6 18 -26 0 -16 Z" fill="#EF4444" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M 0 -16 L 4 -30" stroke="#78350F" stroke-width="6" stroke-linecap="round"/><path d="M 4 -26 Q 18 -32 16 -18 Q 6 -16 4 -26 Z" fill="#22C55E" stroke="${S}" stroke-width="4"/>`,
    tags: ["manzana", "fruta", "gravedad", "newton", "salud"],
  },
  banana: {
    id: "banana",
    name: "Plátano",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M -24 -26 C -30 14 4 36 32 20 C 12 18 -8 2 -14 -26 Z" fill="#FACC15" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["platano", "banana", "fruta", "potasio", "alimento"],
  },
  corn: {
    id: "corn",
    name: "Mazorca de maíz",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<ellipse cx="0" cy="-4" rx="16" ry="30" fill="#FACC15" stroke="${S}" stroke-width="6"/><path d="M -10 -14 L 10 -14 M -12 -2 L 12 -2 M -10 10 L 10 10 M 0 -28 L 0 18" stroke="#D97706" stroke-width="3"/><path d="M 0 28 C -24 22 -28 -4 -14 -10 C -14 10 -4 22 0 28 Z M 0 28 C 24 22 28 -4 14 -10 C 14 10 4 22 0 28 Z" fill="#22C55E" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>`,
    tags: ["maiz", "mazorca", "elote", "grano", "agricultura"],
  },
  popcorn: {
    id: "popcorn",
    name: "Cubo de palomitas de maíz",
    family: "naturaleza_alimentos",
    defaultPlacement: "both",
    svg: `<circle cx="-14" cy="-20" r="12" fill="#FEF08A" stroke="${S}" stroke-width="5"/><circle cx="14" cy="-20" r="12" fill="#FEF08A" stroke="${S}" stroke-width="5"/><circle cx="0" cy="-26" r="14" fill="#FEF08A" stroke="${S}" stroke-width="5"/><polygon points="-26,-12 26,-12 20,34 -20,34" fill="#FFFFFF" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><line x1="-10" y1="-10" x2="-8" y2="32" stroke="#EF4444" stroke-width="8"/><line x1="10" y1="-10" x2="8" y2="32" stroke="#EF4444" stroke-width="8"/>`,
    tags: ["palomitas", "maiz", "cine", "snack", "explosion"],
  },
  seed: {
    id: "seed",
    name: "Semilla / Grano",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M 0 -24 C 18 -8 18 22 0 26 C -18 22 -18 -8 0 -24 Z" fill="#D97706" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["semilla", "grano", "origen", "agricultura"],
  },
  rock: {
    id: "rock",
    name: "Piedra / Roca",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<polygon points="-28,16 -22,-14 4,-24 26,-10 30,18 6,26" fill="#9CA3AF" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["piedra", "roca", "mineral", "geologia"],
  },
  crystal: {
    id: "crystal",
    name: "Cristal / Mineral",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<polygon points="0,-36 22,-8 14,30 -14,30 -22,-8" fill="#67E8F9" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><line x1="0" y1="-36" x2="0" y2="30" stroke="${S}" stroke-width="4"/>`,
    tags: ["cristal", "diamante", "gema", "mineral"],
  },
  water_drop: {
    id: "water_drop",
    name: "Gota de agua",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M 0 -32 C 22 -4 24 28 0 28 C -24 28 -22 -4 0 -32 Z" fill="#38BDF8" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M -8 6 A 10 10 0 0 0 2 18" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    tags: ["gota", "agua", "humedad", "lluvia", "vapor"],
  },
  cloud: {
    id: "cloud",
    name: "Nube",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: `<path d="M -26 18 A 16 16 0 0 1 -22 -12 A 22 22 0 0 1 20 -14 A 16 16 0 0 1 26 18 Z" fill="#E0F2FE" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["nube", "clima", "vapor", "cielo"],
  },
  sun: {
    id: "sun",
    name: "Sol brillante",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="20" fill="#FACC15" stroke="${S}" stroke-width="6"/><path d="M 0 -34 L 0 -26 M 0 26 L 0 34 M -34 0 L -26 0 M 26 0 L 34 0 M -24 -24 L -18 -18 M 18 18 L 24 24 M 24 -24 L 18 -18 M -18 18 L -24 24" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>`,
    tags: ["sol", "calor", "dia", "energia_solar", "verano"],
  },
  moon: {
    id: "moon",
    name: "Luna creciente",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: `<path d="M 8 -28 A 28 28 0 1 0 28 16 A 22 22 0 1 1 8 -28 Z" fill="#FDE047" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["luna", "noche", "espacio", "dormir"],
  },
  flame: {
    id: "flame",
    name: "Llama de fuego",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M 0 -36 C 22 -12 30 28 0 32 C -30 28 -22 -12 0 -36 Z" fill="#EF4444" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M 0 -10 C 12 6 14 26 0 28 C -14 26 -12 6 0 -10 Z" fill="#FACC15"/>`,
    tags: ["fuego", "llama", "calor", "hervir", "temperatura"],
  },

  // ===========================================================================
  // 5. HISTORIA Y EXPLORACIÓN
  // ===========================================================================
  map: {
    id: "map",
    name: "Mapa de exploración",
    family: "historia_exploracion",
    defaultPlacement: "both",
    svg: `<polygon points="-36,-24 -12,-18 12,-26 36,-18 36,24 12,18 -12,26 -36,18" fill="#FEF3C7" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M -24 6 Q -6 -10 14 8" stroke="#EF4444" stroke-width="5" stroke-dasharray="6 6" fill="none"/><path d="M 12 2 L 22 12 M 22 2 L 12 12" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/>`,
    tags: ["mapa", "tesoro", "explorar", "geografia", "ruta"],
  },
  compass: {
    id: "compass",
    name: "Brújula",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="28" fill="#FEF3C7" stroke="${S}" stroke-width="6"/><polygon points="0,-20 8,0 0,6 -8,0" fill="#EF4444"/><polygon points="0,20 8,0 0,-6 -8,0" fill="#3B82F6"/>`,
    tags: ["brujula", "norte", "orientacion", "explorar"],
  },
  scroll: {
    id: "scroll",
    name: "Pergamino antiguo",
    family: "historia_exploracion",
    defaultPlacement: "both",
    svg: `<rect x="-24" y="-28" width="48" height="56" fill="#FDE68A" stroke="${S}" stroke-width="6"/><rect x="-30" y="-34" width="60" height="10" rx="5" fill="#D97706" stroke="${S}" stroke-width="5"/><rect x="-30" y="24" width="60" height="10" rx="5" fill="#D97706" stroke="${S}" stroke-width="5"/><path d="M -14 -12 L 14 -12 M -14 0 L 14 0 M -14 12 L 8 12" stroke="#92400E" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["pergamino", "historia", "antiguo", "leyenda", "documento"],
  },
  ancient_book: {
    id: "ancient_book",
    name: "Libro antiguo histórico",
    family: "historia_exploracion",
    defaultPlacement: "both",
    svg: `<rect x="-28" y="-36" width="56" height="72" rx="5" fill="#78350F" stroke="${S}" stroke-width="6"/><rect x="-18" y="-26" width="36" height="52" fill="none" stroke="#FBBF24" stroke-width="4"/><circle cx="0" cy="0" r="8" fill="#FBBF24"/>`,
    tags: ["libro_antiguo", "historia", "archivo", "sabiduria"],
  },
  fantasy_sword: {
    id: "fantasy_sword",
    name: "Espada de fantasía",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<g transform="rotate(-35)"><polygon points="-8,10 -8,-34 0,-46 8,-34 8,10" fill="#E5E7EB" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><rect x="-20" y="10" width="40" height="8" rx="3" fill="#F59E0B" stroke="${S}" stroke-width="5"/><rect x="-5" y="18" width="10" height="18" fill="#78350F" stroke="${S}" stroke-width="5"/></g>`,
    tags: ["espada", "historia", "edad_media", "aventura"],
  },
  shield: {
    id: "shield",
    name: "Escudo",
    family: "historia_exploracion",
    defaultPlacement: "left",
    svg: `<path d="M -28 -28 L 28 -28 L 28 -2 C 28 20 0 36 0 36 C 0 36 -28 20 -28 -2 Z" fill="#2563EB" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M 0 -22 L 0 28 M -22 -4 L 22 -4" stroke="#FACC15" stroke-width="6"/>`,
    tags: ["escudo", "defensa", "proteccion", "historia"],
  },
  torch: {
    id: "torch",
    name: "Antorcha encendida",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<polygon points="-8,-4 8,-4 5,36 -5,36" fill="#92400E" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><path d="M 0 -40 C 18 -22 20 -4 0 -4 C -20 -4 -18 -22 0 -40 Z" fill="#F97316" stroke="${S}" stroke-width="5"/>`,
    tags: ["antorcha", "cueva", "exploracion", "fuego", "descubrir"],
  },
  historic_helmet: {
    id: "historic_helmet",
    name: "Casco histórico estilizado",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<path d="M -28 20 A 28 28 0 0 1 28 20 Z" fill="#F59E0B" stroke="${S}" stroke-width="6"/><path d="M -20 -16 Q 0 -38 20 -16" stroke="#EF4444" stroke-width="10" stroke-linecap="round" fill="none"/>`,
    tags: ["casco", "romano", "espartano", "historia", "antiguedad"],
  },
  chest: {
    id: "chest",
    name: "Cofre del tesoro",
    family: "historia_exploracion",
    defaultPlacement: "both",
    svg: `<rect x="-32" y="-8" width="64" height="36" rx="3" fill="#92400E" stroke="${S}" stroke-width="6"/><path d="M -32 -8 A 32 20 0 0 1 32 -8 Z" fill="#B45309" stroke="${S}" stroke-width="6"/><rect x="-8" y="-14" width="16" height="16" rx="2" fill="#FACC15" stroke="${S}" stroke-width="5"/>`,
    tags: ["cofre", "tesoro", "riqueza", "secreto", "premio"],
  },
  flag: {
    id: "flag",
    name: "Bandera de conquista",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<line x1="-20" y1="-38" x2="-20" y2="38" stroke="${S}" stroke-width="6" stroke-linecap="round"/><polygon points="-20,-36 28,-22 -20,-8" fill="#EF4444" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["bandera", "meta", "logro", "pais", "territorio"],
  },
  binoculars: {
    id: "binoculars",
    name: "Binoculares",
    family: "historia_exploracion",
    defaultPlacement: "both",
    svg: `<rect x="-30" y="-18" width="22" height="36" rx="6" fill="#374151" stroke="${S}" stroke-width="6"/><rect x="8" y="-18" width="22" height="36" rx="6" fill="#374151" stroke="${S}" stroke-width="6"/><line x1="-8" y1="-4" x2="8" y2="-4" stroke="${S}" stroke-width="7"/><circle cx="-19" cy="12" r="7" fill="#38BDF8"/><circle cx="19" cy="12" r="7" fill="#38BDF8"/>`,
    tags: ["binoculares", "observar", "lejos", "explorador", "buscar"],
  },

  // ===========================================================================
  // 6. REACCIONES Y HUMOR
  // ===========================================================================
  question_mark: {
    id: "question_mark",
    name: "Signo de interrogación",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<text x="-18" y="24" fill="#F59E0B" stroke="${S}" stroke-width="3" font-size="76" font-weight="900" font-family="sans-serif">?</text>`,
    tags: ["interrogacion", "pregunta", "duda", "misterio"],
  },
  exclamation_mark: {
    id: "exclamation_mark",
    name: "Signo de exclamación",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<text x="-12" y="24" fill="#EF4444" stroke="${S}" stroke-width="3" font-size="76" font-weight="900" font-family="sans-serif">!</text>`,
    tags: ["exclamacion", "sorpresa", "alerta", "atencion"],
  },
  idea_bulb: {
    id: "idea_bulb",
    name: "Bombilla de idea brillante",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="-8" r="24" fill="#FDE047" stroke="${S}" stroke-width="6"/><rect x="-10" y="14" width="20" height="12" rx="3" fill="#9CA3AF" stroke="${S}" stroke-width="5"/><path d="M 0 -44 L 0 -36 M -34 -8 L -28 -8 M 28 -8 L 34 -8 M -26 -30 L -20 -24 M 26 -30 L 20 -24" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>`,
    tags: ["idea", "eureka", "genial", "pensamiento"],
  },
  heart: {
    id: "heart",
    name: "Corazón",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<path d="M 0 26 C -38 -2 -36 -30 -16 -30 C -4 -30 0 -18 0 -18 C 0 -18 4 -30 16 -30 C 36 -30 38 -2 0 26 Z" fill="#EF4444" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["corazon", "amor", "salud", "favorito", "like"],
  },
  star: {
    id: "star",
    name: "Estrella dorada",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<polygon points="0,-34 9,-11 34,-9 15,7 21,31 0,18 -21,31 -15,7 -34,-9 -9,-11" fill="#FACC15" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>`,
    tags: ["estrella", "exito", "calidad", "destacado"],
  },
  trophy: {
    id: "trophy",
    name: "Trofeo de campeón",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<path d="M -20 -28 L 20 -28 L 16 0 A 16 16 0 0 1 -16 0 Z" fill="#FACC15" stroke="${S}" stroke-width="6"/><path d="M -20 -22 L -30 -22 A 10 10 0 0 0 -18 -4 M 20 -22 L 30 -22 A 10 10 0 0 1 18 -4" stroke="${S}" stroke-width="5" fill="none"/><line x1="0" y1="14" x2="0" y2="30" stroke="${S}" stroke-width="6"/><rect x="-18" y="30" width="36" height="10" rx="2" fill="#92400E" stroke="${S}" stroke-width="5"/>`,
    tags: ["trofeo", "copa", "ganador", "victoria", "record"],
  },
  medal: {
    id: "medal",
    name: "Medalla de honor",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<polygon points="-16,-32 0,-6 16,-32" fill="#EF4444" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="10" r="20" fill="#FACC15" stroke="${S}" stroke-width="6"/><text x="-6" y="18" fill="${S}" font-size="22" font-weight="900" font-family="sans-serif">1</text>`,
    tags: ["medalla", "premio", "primer_lugar", "orgullo"],
  },
  megaphone: {
    id: "megaphone",
    name: "Megáfono",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<polygon points="-24,-8 22,-26 22,18 -24,0" fill="#EF4444" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><rect x="-20" y="0" width="10" height="20" rx="3" fill="#374151" stroke="${S}" stroke-width="5"/><path d="M 32 -16 L 42 -22 M 34 -4 L 44 -4 M 32 8 L 42 14" stroke="#F59E0B" stroke-width="5" stroke-linecap="round"/>`,
    tags: ["megafono", "anuncio", "gritar", "noticia", "importante"],
  },
  blank_sign: {
    id: "blank_sign",
    name: "Cartel de anuncio",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="0" x2="0" y2="42" stroke="#92400E" stroke-width="8" stroke-linecap="round"/><rect x="-38" y="-38" width="76" height="46" rx="5" fill="#FFFFFF" stroke="${S}" stroke-width="6"/>`,
    tags: ["cartel", "letrero", "aviso", "mensaje"],
  },
  hourglass: {
    id: "hourglass",
    name: "Reloj de arena",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<polygon points="-22,-30 22,-30 0,0 22,30 -22,30 0,0" fill="#E0F2FE" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><line x1="-26" y1="-30" x2="26" y2="-30" stroke="#92400E" stroke-width="7" stroke-linecap="round"/><line x1="-26" y1="30" x2="26" y2="30" stroke="#92400E" stroke-width="7" stroke-linecap="round"/>`,
    tags: ["reloj_arena", "tiempo", "historia", "espera"],
  },
  coins: {
    id: "coins",
    name: "Monedas de oro",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<circle cx="-10" cy="8" r="18" fill="#FACC15" stroke="${S}" stroke-width="5"/><circle cx="10" cy="-6" r="18" fill="#FDE047" stroke="${S}" stroke-width="6"/><text x="4" y="2" fill="${S}" font-size="22" font-weight="900" font-family="sans-serif">$</text>`,
    tags: ["monedas", "dinero", "economia", "riqueza", "precio"],
  },
  speech_bubble: {
    id: "speech_bubble",
    name: "Bocadillo de diálogo",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<path d="M -32 -24 L 32 -24 A 10 10 0 0 1 42 -14 L 42 10 A 10 10 0 0 1 32 20 L -6 20 L -22 34 L -18 20 L -32 20 A 10 10 0 0 1 -42 10 L -42 -14 A 10 10 0 0 1 -32 -24 Z" fill="#FFFFFF" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><circle cx="-14" cy="-2" r="4" fill="${S}"/><circle cx="0" cy="-2" r="4" fill="${S}"/><circle cx="14" cy="-2" r="4" fill="${S}"/>`,
    tags: ["bocadillo", "hablar", "dialogo", "mensaje"],
  },
  check_mark: {
    id: "check_mark",
    name: "Símbolo de aprobación (Check)",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="28" fill="#22C55E" stroke="${S}" stroke-width="6"/><path d="M -12 0 L -3 10 L 14 -10" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    tags: ["check", "correcto", "aprobado", "verdadero", "si"],
  },
  cross_mark: {
    id: "cross_mark",
    name: "Símbolo de negación (Cruz)",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="28" fill="#EF4444" stroke="${S}" stroke-width="6"/><path d="M -11 -11 L 11 11 M 11 -11 L -11 11" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>`,
    tags: ["cruz", "incorrecto", "falso", "error", "no"],
  },
  sandwich: {
    id: "sandwich",
    name: "Sándwich delicioso",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M -36 10 L 32 10 Q 36 10 36 16 L 34 24 Q 34 28 28 28 L -30 28 Q -36 28 -36 22 Z" fill="#D97706" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><rect x="-32" y="4" width="64" height="8" rx="3" fill="#BE185D" stroke="${S}" stroke-width="4"/><polygon points="-24,6 4,6 -6,18" fill="#FACC15" stroke="${S}" stroke-width="4" stroke-linejoin="round"/><polygon points="10,6 28,6 20,16" fill="#FACC15" stroke="${S}" stroke-width="4" stroke-linejoin="round"/><path d="M -34 2 Q -26 -6 -18 2 Q -10 -6 -2 2 Q 6 -6 14 2 Q 22 -6 32 2" stroke="#22C55E" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="-16" cy="-2" r="6" fill="#EF4444" stroke="${S}" stroke-width="4"/><circle cx="8" cy="-2" r="6" fill="#EF4444" stroke="${S}" stroke-width="4"/><path d="M -34 -6 Q 0 -22 34 -6 L 32 2 Q 32 5 28 5 L -28 5 Q -34 5 -34 2 Z" fill="#F59E0B" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-14" cy="-10" rx="2" ry="1" fill="#FEF08A"/><ellipse cx="6" cy="-12" rx="2" ry="1" fill="#FEF08A"/><ellipse cx="18" cy="-8" rx="2" ry="1" fill="#FEF08A"/>`,
    tags: ["sandwich", "comida", "almuerzo", "pan", "snack", "comer"],
  },
  vent_grille: {
    id: "vent_grille",
    name: "Rejilla de ventilación",
    family: "vida_cotidiana",
    defaultPlacement: "overhead",
    svg: `<rect x="-42" y="-36" width="84" height="72" rx="6" fill="#64748B" stroke="${S}" stroke-width="6"/><rect x="-32" y="-26" width="64" height="52" rx="3" fill="#0F172A" stroke="${S}" stroke-width="4"/><rect x="-28" y="-20" width="56" height="6" rx="2" fill="#94A3B8" stroke="${S}" stroke-width="3"/><rect x="-28" y="-9" width="56" height="6" rx="2" fill="#94A3B8" stroke="${S}" stroke-width="3"/><rect x="-28" y="2" width="56" height="6" rx="2" fill="#94A3B8" stroke="${S}" stroke-width="3"/><rect x="-28" y="13" width="56" height="6" rx="2" fill="#94A3B8" stroke="${S}" stroke-width="3"/><circle cx="-36" cy="-30" r="2.5" fill="#CBD5E1" stroke="${S}" stroke-width="2"/><circle cx="36" cy="-30" r="2.5" fill="#CBD5E1" stroke="${S}" stroke-width="2"/><circle cx="-36" cy="30" r="2.5" fill="#CBD5E1" stroke="${S}" stroke-width="2"/><circle cx="36" cy="30" r="2.5" fill="#CBD5E1" stroke="${S}" stroke-width="2"/>`,
    tags: ["rejilla", "ventilacion", "escape", "ducto", "techo"],
  },
  emergency_lever: {
    id: "emergency_lever",
    name: "Palanca de emergencia",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<rect x="-28" y="-38" width="56" height="76" rx="6" fill="#FACC15" stroke="${S}" stroke-width="6"/><path d="M -26 -30 L -12 -38 M -26 -16 L 4 -38 M -26 -2 L 20 -38 M -26 12 L 26 -24 M -20 26 L 26 -10 M -6 36 L 26 6" stroke="${S}" stroke-width="4" stroke-linecap="round"/><rect x="-18" y="-22" width="36" height="44" rx="4" fill="#334155" stroke="${S}" stroke-width="5"/><circle cx="0" cy="8" r="8" fill="#94A3B8" stroke="${S}" stroke-width="4"/><line x1="0" y1="8" x2="22" y2="-32" stroke="#EF4444" stroke-width="8" stroke-linecap="round"/><circle cx="22" cy="-32" r="10" fill="#DC2626" stroke="${S}" stroke-width="5"/><circle cx="20" cy="-34" r="3" fill="#FCA5A5"/>`,
    tags: ["palanca", "emergencia", "interruptor", "seguridad", "salida", "puerta"],
  },
  locked_door: {
    id: "locked_door",
    name: "Puerta bloqueada",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<rect x="-38" y="-48" width="76" height="96" rx="6" fill="#475569" stroke="${S}" stroke-width="6"/><rect x="-30" y="-40" width="60" height="80" rx="4" fill="#64748B" stroke="${S}" stroke-width="5"/><line x1="-30" y1="0" x2="30" y2="0" stroke="${S}" stroke-width="5"/><circle cx="-22" cy="-32" r="2.5" fill="#CBD5E1" stroke="${S}" stroke-width="2"/><circle cx="22" cy="-32" r="2.5" fill="#CBD5E1" stroke="${S}" stroke-width="2"/><circle cx="-22" cy="32" r="2.5" fill="#CBD5E1" stroke="${S}" stroke-width="2"/><circle cx="22" cy="32" r="2.5" fill="#CBD5E1" stroke="${S}" stroke-width="2"/><path d="M -10 6 L -10 -4 A 10 10 0 0 1 10 -4 L 10 6" fill="none" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/><rect x="-16" y="4" width="32" height="26" rx="4" fill="#EAB308" stroke="${S}" stroke-width="5"/><circle cx="0" cy="14" r="3" fill="${S}"/><polygon points="-2,15 2,15 3,22 -3,22" fill="${S}"/>`,
    tags: ["puerta", "bloqueada", "cerrada", "candado", "habitacion", "escape"],
  },
  water_puddle: {
    id: "water_puddle",
    name: "Charco de agua",
    family: "naturaleza_alimentos",
    defaultPlacement: "both",
    svg: `<ellipse cx="0" cy="8" rx="46" ry="20" fill="#38BDF8" stroke="${S}" stroke-width="6"/><ellipse cx="6" cy="4" rx="32" ry="12" fill="#7DD3FC" stroke="#0284C7" stroke-width="3"/><ellipse cx="14" cy="2" rx="16" ry="6" fill="#E0F2FE"/><circle cx="-32" cy="-14" r="5" fill="#38BDF8" stroke="${S}" stroke-width="3"/><circle cx="28" cy="-18" r="6" fill="#38BDF8" stroke="${S}" stroke-width="4"/><circle cx="38" cy="-4" r="4" fill="#38BDF8" stroke="${S}" stroke-width="3"/>`,
    tags: ["charco", "inundacion", "agua", "piso", "gotas"],
  },
  kidneys: {
    id: "kidneys",
    name: "Riñones humanos",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<path d="M -26 -26 C -44 -26 -48 8 -34 26 C -20 44 -10 28 -16 8 C -20 -6 -14 -18 -26 -26 Z" fill="#991B1B" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M 26 -26 C 44 -26 48 8 34 26 C 20 44 10 28 16 8 C 20 -6 14 -18 26 -26 Z" fill="#991B1B" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M -16 8 Q 0 18 0 38" stroke="#3B82F6" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M 16 8 Q 0 18 0 38" stroke="#EF4444" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="-28" cy="4" r="3" fill="#F87171"/><circle cx="28" cy="4" r="3" fill="#F87171"/>`,
    tags: ["riñones", "organo", "cuerpo", "filtro", "orina", "salud", "biologia"],
  },
  black_hole: {
    id: "black_hole",
    name: "Agujero Negro Cósmico",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<ellipse cx="0" cy="0" rx="48" ry="18" transform="rotate(-15)" fill="#F97316" stroke="${S}" stroke-width="6"/><ellipse cx="0" cy="0" rx="40" ry="12" transform="rotate(-15)" fill="#FDE047"/><circle cx="0" cy="0" r="24" fill="#000000" stroke="#FFFFFF" stroke-width="3"/><path d="M -34 -12 Q 0 -38 34 -12" stroke="#F59E0B" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="28" cy="-22" r="2.5" fill="#FFFFFF"/><circle cx="-32" cy="24" r="2" fill="#FFFFFF"/>`,
    tags: ["agujero_negro", "espacio", "gravedad", "singularidad", "cosmos"],
  },
  salt_crystal: {
    id: "salt_crystal",
    name: "Cristal de Sal Marina",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="0,-32 28,-16 28,18 0,32 -28,18 -28,-16" fill="#F8FAFC" stroke="${S}" stroke-width="6"/><line x1="0" y1="-32" x2="0" y2="32" stroke="${S}" stroke-width="5"/><line x1="-28" y1="-16" x2="0" y2="0" stroke="${S}" stroke-width="5"/><line x1="28" y1="-16" x2="0" y2="0" stroke="${S}" stroke-width="5"/><circle cx="-14" cy="8" r="6" fill="#38BDF8" stroke="${S}" stroke-width="3"/><circle cx="14" cy="8" r="7" fill="#22C55E" stroke="${S}" stroke-width="3"/><circle cx="0" cy="-14" r="5" fill="#38BDF8" stroke="${S}" stroke-width="3"/>`,
    tags: ["sal", "cristal", "quimica", "sodio", "cloro", "mar"],
  },
  shrinking_cell: {
    id: "shrinking_cell",
    name: "Célula Deshidratada",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M -26 -18 Q -34 4 -20 24 Q 4 34 24 20 Q 34 -4 20 -24 Q -4 -34 -26 -18 Z" fill="#C084FC" stroke="${S}" stroke-width="6"/><circle cx="0" cy="0" r="11" fill="#7E22CE" stroke="${S}" stroke-width="4"/><path d="M -9 -9 L -16 -16 M 9 -9 L 16 -16 M -9 9 L -16 16 M 9 9 L 16 16" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["celula", "osmosis", "deshidratacion", "biologia"],
  },
  spaceship: {
    id: "spaceship",
    name: "Nave Espacial Cósmica",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<path d="M 0 -36 Q 18 -10 18 22 L -18 22 Q -18 -10 0 -36 Z" fill="#F1F5F9" stroke="${S}" stroke-width="6"/><polygon points="-18,10 -32,28 -18,22" fill="#EF4444" stroke="${S}" stroke-width="5"/><polygon points="18,10 32,28 18,22" fill="#EF4444" stroke="${S}" stroke-width="5"/><circle cx="0" cy="-4" r="8" fill="#38BDF8" stroke="${S}" stroke-width="4"/><polygon points="-9,22 9,22 0,38" fill="#F59E0B" stroke="${S}" stroke-width="4"/><polygon points="-5,22 5,22 0,32" fill="#FEF08A"/>`,
    tags: ["nave", "cohete", "espacio", "astronauta", "cosmos"],
  },
  cosmic_hourglass: {
    id: "cosmic_hourglass",
    name: "Reloj de Arena Cósmico",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="-24,-32 24,-32 4,-2 24,28 -24,28 -4,-2" fill="#E2E8F0" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><line x1="-28" y1="-32" x2="28" y2="-32" stroke="${S}" stroke-width="6" stroke-linecap="round"/><line x1="-28" y1="28" x2="28" y2="28" stroke="${S}" stroke-width="6" stroke-linecap="round"/><polygon points="-16,-24 16,-24 0,-4" fill="#FACC15"/><polygon points="-18,24 18,24 0,8" fill="#FACC15"/><line x1="0" y1="-4" x2="0" y2="8" stroke="#F59E0B" stroke-width="3"/><circle cx="14" cy="-14" r="2" fill="#FFFFFF"/><circle cx="-12" cy="18" r="2" fill="#FFFFFF"/>`,
    tags: ["reloj_arena", "tiempo", "relatividad", "dilatacion"],
  },
  singularity: {
    id: "singularity",
    name: "Singularidad Espaciotemporal",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="34" fill="#0F172A" stroke="${S}" stroke-width="6"/><circle cx="0" cy="0" r="24" fill="#7C3AED" opacity="0.7"/><circle cx="0" cy="0" r="14" fill="#C084FC"/><circle cx="0" cy="0" r="5" fill="#FFFFFF"/><path d="M -28 -10 Q 0 -34 28 -10 Q 34 16 0 28 Q -30 20 -28 -10" stroke="#38BDF8" stroke-width="4" fill="none" opacity="0.9"/>`,
    tags: ["singularidad", "agujero_negro", "gravedad", "universo"],
  },
  dolphin: {
    id: "dolphin",
    name: "Delfín marino",
    family: "naturaleza_alimentos",
    defaultPlacement: "both",
    svg: `<g><ellipse cx="0" cy="24" rx="42" ry="9" fill="#0284C7" opacity="0.4"/><circle cx="-32" cy="18" r="3.5" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/><circle cx="32" cy="16" r="3" fill="#38BDF8" stroke="${S}" stroke-width="2"/><path d="M 0 6 C 4 16 8 22 16 20 C 14 14 8 10 2 6 Z" fill="#0284C7" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><path d="M 44 -2 C 40 -8 32 -18 16 -24 C 6 -28 -4 -28 -14 -24 L -18 -38 C -22 -38 -20 -24 -24 -20 C -34 -12 -42 0 -48 10 C -52 6 -56 2 -60 4 C -58 10 -52 14 -46 12 C -46 16 -52 22 -58 24 C -54 26 -48 22 -44 16 C -38 10 -28 4 -18 2 C -8 2 2 8 16 12 C 26 14 36 10 42 4 C 45 2 46 0 44 -2 Z" fill="#38BDF8" stroke="${S}" stroke-width="5.5" stroke-linejoin="round"/><path d="M -38 10 C -28 4 -18 2 -8 2 C 2 8 16 12 26 14 C 36 10 42 4 44 -2 C 40 4 32 8 20 8 C 4 8 -10 6 -24 8 C -32 10 -36 11 -38 10 Z" fill="#E0F2FE" stroke="${S}" stroke-width="3" stroke-linejoin="round"/><path d="M 6 4 C 10 18 16 26 26 22 C 22 14 16 8 8 3 Z" fill="#0284C7" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/><circle cx="28" cy="-8" r="3.5" fill="${S}"/><circle cx="29.2" cy="-9.2" r="1.3" fill="#FFFFFF"/><path d="M 38 2 Q 32 4 28 2" stroke="${S}" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M 8 -22 Q -4 -24 -12 -20" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/></g>`,
    tags: ["delfin", "mar", "cetaceo", "oceano", "animal"],
  },
  split_brain: {
    id: "split_brain",
    name: "Cerebro Unihemisférico",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g><path d="M -2 -34 C -16 -34 -28 -28 -34 -18 C -40 -8 -40 8 -36 20 C -32 30 -20 36 -2 36 Z" fill="#3B82F6" stroke="${S}" stroke-width="5.5" stroke-linejoin="round"/><path d="M -12 -24 C -22 -20 -24 -10 -16 -6 C -24 0 -26 12 -16 18 C -22 24 -14 30 -8 28" fill="none" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/><path d="M -22 2 Q -16 8 -10 2" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><line x1="-16" y1="5" x2="-16" y2="9" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><text x="-32" y="-12" fill="#FFFFFF" font-size="14" font-weight="900" font-family="'Arial Black', sans-serif">Zzz</text><path d="M 2 -34 C 16 -34 28 -28 34 -18 C 40 -8 40 8 36 20 C 32 30 20 36 2 36 Z" fill="#F59E0B" stroke="${S}" stroke-width="5.5" stroke-linejoin="round"/><path d="M 12 -24 C 22 -20 24 -10 16 -6 C 24 0 26 12 16 18 C 22 24 14 30 8 28" fill="none" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/><circle cx="18" cy="2" r="7" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><circle cx="19" cy="2" r="3.5" fill="${S}"/><circle cx="20" cy="1" r="1.2" fill="#FFFFFF"/><path d="M 28 -18 L 34 -24 M 32 -10 L 40 -12" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/><line x1="0" y1="-36" x2="0" y2="38" stroke="${S}" stroke-width="6" stroke-linecap="round"/></g>`,
    tags: ["cerebro", "sueno", "unihemisferico", "mente", "neurociencia"],
  },
  shark_fin: {
    id: "shark_fin",
    name: "Aleta de Tiburón",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<g><ellipse cx="0" cy="22" rx="44" ry="11" fill="#0284C7" stroke="${S}" stroke-width="5.5"/><path d="M -36 22 Q 0 14 36 22" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M -24 26 Q 0 20 24 26" stroke="#38BDF8" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M -22 22 C -18 6 -8 -16 6 -32 C 8 -30 6 -12 14 2 C 18 10 22 18 16 22 Z" fill="#475569" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><path d="M -16 20 C -12 6 -4 -10 4 -24" stroke="#64748B" stroke-width="3.5" stroke-linecap="round" fill="none"/></g>`,
    tags: ["tiburon", "aleta", "depredador", "peligro", "mar"],
  },
  sun_radiant: {
    id: "sun_radiant",
    name: "Sol Radiante",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="24" fill="#FACC15" stroke="${S}" stroke-width="6"/><line x1="0" y1="-32" x2="0" y2="-44" stroke="${S}" stroke-width="6" stroke-linecap="round"/><line x1="0" y1="32" x2="0" y2="44" stroke="${S}" stroke-width="6" stroke-linecap="round"/><line x1="-32" y1="0" x2="-44" y2="0" stroke="${S}" stroke-width="6" stroke-linecap="round"/><line x1="32" y1="0" x2="44" y2="0" stroke="${S}" stroke-width="6" stroke-linecap="round"/><line x1="-23" y1="-23" x2="-32" y2="-32" stroke="${S}" stroke-width="5" stroke-linecap="round"/><line x1="23" y1="23" x2="32" y2="32" stroke="${S}" stroke-width="5" stroke-linecap="round"/><line x1="23" y1="-23" x2="32" y2="-32" stroke="${S}" stroke-width="5" stroke-linecap="round"/><line x1="-23" y1="23" x2="-32" y2="32" stroke="${S}" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="0" r="16" fill="#F59E0B"/>`,
    tags: ["sol", "luz", "dia", "atardecer", "cielo", "calor"],
  },
  prism_spectrum: {
    id: "prism_spectrum",
    name: "Prisma de Luz",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="0,-32 30,24 -30,24" fill="#E0F2FE" stroke="${S}" stroke-width="6" stroke-linejoin="round"/><line x1="-42" y1="6" x2="-14" y2="6" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/><path d="M 14 6 L 36 -6" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/><path d="M 14 6 L 38 4" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><path d="M 14 6 L 40 14" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/><path d="M 14 6 L 38 24" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/><path d="M 14 6 L 34 32" stroke="#8B5CF6" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["prisma", "optica", "arcoiris", "luz", "espectro", "color"],
  },
  moon_cratered: {
    id: "moon_cratered",
    name: "Luna Llena con Cráteres",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="28" fill="#E2E8F0" stroke="${S}" stroke-width="6"/><circle cx="-8" cy="-10" r="6" fill="#CBD5E1" stroke="${S}" stroke-width="3"/><circle cx="10" cy="6" r="8" fill="#CBD5E1" stroke="${S}" stroke-width="3"/><circle cx="-6" cy="12" r="5" fill="#CBD5E1" stroke="${S}" stroke-width="3"/><circle cx="12" cy="-12" r="4" fill="#CBD5E1" stroke="${S}" stroke-width="2.5"/><circle cx="2" cy="-2" r="3" fill="#94A3B8"/>`,
    tags: ["luna", "luna_llena", "espacio", "astronomia", "crater"],
  },
  earth_axis: {
    id: "earth_axis",
    name: "Tierra con Eje de Inclinación",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g transform="rotate(23.5)"><circle cx="0" cy="0" r="26" fill="#38BDF8" stroke="${S}" stroke-width="6"/><path d="M -14 -12 Q -6 -4 -12 8 Q -4 16 6 8 M 6 -16 Q 16 -8 10 6" stroke="#22C55E" stroke-width="6" stroke-linecap="round" fill="none"/><line x1="0" y1="-38" x2="0" y2="38" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-38" r="3.5" fill="#EF4444"/><polygon points="-6,26 6,26 0,38" fill="#EF4444"/></g>`,
    tags: ["tierra", "eje", "inclinacion", "estaciones", "planeta", "clima"],
  },
  mirror_neurons: {
    id: "mirror_neurons",
    name: "Neuronas Espejo Sinápticas",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="-16" cy="-8" r="14" fill="#6366F1" stroke="${S}" stroke-width="5"/><circle cx="16" cy="8" r="14" fill="#EC4899" stroke="${S}" stroke-width="5"/><path d="M -16 -8 Q 0 0 16 8" stroke="#FACC15" stroke-width="6" stroke-linecap="round"/><polygon points="-2,-6 6,-2 -1,4 5,8" fill="#FFE600"/><circle cx="-16" cy="-8" r="6" fill="#A5B4FC"/><circle cx="16" cy="8" r="6" fill="#FBCFE8"/>`,
    tags: ["neuronas", "espejo", "empatia", "cerebro", "neurociencia", "sinapsis"],
  },
  brain_radiator: {
    id: "brain_radiator",
    name: "Cerebro con Termorregulación",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M -24 6 C -28 -14 0 -24 16 -12 C 28 -10 32 10 20 20 C 6 28 -20 24 -24 6 Z" fill="#F472B6" stroke="${S}" stroke-width="5.5"/><path d="M -10 -6 Q -4 4 6 -2 Q 14 6 12 14" stroke="#DB2777" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M -34 -14 Q -24 -26 -10 -20 M -38 0 Q -24 -6 -14 0 M -30 14 Q -18 8 -10 16" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" fill="none"/><polygon points="-12,-20 -8,-24 -14,-26" fill="#38BDF8"/><polygon points="-14,0 -10,-4 -16,-6" fill="#38BDF8"/><polygon points="-10,16 -6,12 -12,10" fill="#38BDF8"/>`,
    tags: ["cerebro", "temperatura", "enfriamiento", "radiador", "termoregulacion", "bostezo"],
  },
  temporal_lobe_glitch: {
    id: "temporal_lobe_glitch",
    name: "Desincronización Temporal Déjà Vu",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M -26 8 C -32 -16 2 -26 20 -14 C 32 -12 36 10 24 22 C 8 30 -22 26 -26 8 Z" fill="#6366F1" stroke="${S}" stroke-width="5.5"/><path d="M -16 -6 C -8 -16 6 -8 14 -14" stroke="#A5B4FC" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M -18 12 Q -2 4 14 16" stroke="#F43F5E" stroke-width="4" stroke-linecap="round" fill="none"/><polygon points="2,-8 8,-4 0,2 6,6 -4,8 0,1 -6,-3" fill="#FFE600" stroke="${S}" stroke-width="2.5"/><text x="-18" y="2" fill="#FFFFFF" font-size="10" font-weight="900" font-family="'Arial Black', sans-serif">TIME</text>`,
    tags: ["cerebro", "deja_vu", "tiempo", "memoria", "hipocampo", "glitch", "neurociencia"],
  },
  cat_falling_physics: {
    id: "cat_falling_physics",
    name: "Gato Girando en el Aire (Reflejo de Enderezamiento)",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g transform="scale(1.1)"><path d="M -28 -4 C -36 -18 -10 -28 4 -16 C 14 -8 24 -16 32 -4 C 36 10 20 22 4 16 C -12 24 -26 12 -28 -4 Z" fill="#F97316" stroke="${S}" stroke-width="5.5"/><polygon points="-26,-18 -32,-30 -18,-24" fill="#EA580C" stroke="${S}" stroke-width="4"/><polygon points="-10,-24 -6,-36 4,-26" fill="#EA580C" stroke="${S}" stroke-width="4"/><circle cx="-22" cy="-10" r="3.5" fill="#1E293B"/><circle cx="-6" cy="-10" r="3.5" fill="#1E293B"/><polygon points="-16,-6 -12,-6 -14,-2" fill="#FECDD3"/><path d="M -30 -6 L -40 -8 M -30 -2 L -40 -2 M -4 -6 L 6 -8 M -4 -2 L 6 -2" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/><path d="M -18 8 C -14 18 -6 18 -2 8" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M 12 14 C 20 24 28 20 30 8" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M 28 -2 Q 44 -14 42 -28" stroke="#EA580C" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M -34 16 A 24 24 0 0 1 -10 32" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" fill="none"/><polygon points="-6,32 -14,28 -14,36" fill="#38BDF8"/></g>`,
    tags: ["gato", "caida", "fisica", "giro", "reflejo", "felino", "inercia"],
  },
  vestibular_system: {
    id: "vestibular_system",
    name: "Sistema Vestibular y Conductos Semicirculares",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="-4" cy="8" r="12" fill="#F43F5E" stroke="${S}" stroke-width="5"/><path d="M -12 0 C -24 -24 4 -32 4 -8" stroke="#38BDF8" stroke-width="6.5" stroke-linecap="round" fill="none"/><path d="M 0 -8 C 24 -20 30 12 6 12" stroke="#A855F7" stroke-width="6.5" stroke-linecap="round" fill="none"/><circle cx="-4" cy="8" r="5" fill="#FFE600"/><path d="M 8 16 L 24 28" stroke="#10B981" stroke-width="5" stroke-linecap="round"/><circle cx="26" cy="30" r="3" fill="#10B981"/>`,
    tags: ["oido", "equilibrio", "vestibular", "gravedad", "aceleracion", "orientacion"],
  },
  histatin_saliva: {
    id: "histatin_saliva",
    name: "Histatinas y Saliva Cicatrizante",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M 0 -26 C 14 -10 24 8 20 22 C 16 34 -16 34 -20 22 C -24 8 -14 -10 0 -26 Z" fill="#38BDF8" stroke="${S}" stroke-width="5.5"/><circle cx="0" cy="14" r="8" fill="#FFFFFF"/><path d="M -6 4 Q 0 10 6 4" stroke="#0284C7" stroke-width="3" fill="none" stroke-linecap="round"/><polygon points="-12,-4 -8,-10 -4,-4" fill="#FFE600"/><polygon points="4,2 10,-2 8,6" fill="#FFE600"/><circle cx="-8" cy="18" r="3" fill="#38BDF8"/><circle cx="8" cy="18" r="3" fill="#38BDF8"/>`,
    tags: ["saliva", "histatinas", "boca", "cicatrizacion", "curacion", "peptido"],
  },
  oral_mucosa_vessels: {
    id: "oral_mucosa_vessels",
    name: "Mucosa Oral y Microvasos Sanguíneos",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-18" width="60" height="36" rx="10" fill="#FB7185" stroke="${S}" stroke-width="5"/><path d="M -26 -6 Q -12 6 0 -4 Q 14 -12 26 2" stroke="#DC2626" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M -24 8 Q -10 0 4 10 Q 16 6 24 12" stroke="#EF4444" stroke-width="4.5" stroke-linecap="round" fill="none"/><circle cx="-16" cy="-2" r="4" fill="#FFFFFF"/><circle cx="6" cy="-1" r="4" fill="#FFFFFF"/><circle cx="18" cy="4" r="4" fill="#FFFFFF"/>`,
    tags: ["mucosa", "vasos", "sangre", "oxigeno", "boca", "tejido", "celulas"],
  },
  anglerfish_abyssal: {
    id: "anglerfish_abyssal",
    name: "Pez Rape Abisal Bioluminiscente",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: anglerfishAbyssal(0),
    animatedSvg: anglerfishAbyssal,
    tags: ["pez", "abisal", "rape", "marianas", "profundo", "oceano", "bioluminiscente"],
  },
  hydrostatic_pressure_gauge: {
    id: "hydrostatic_pressure_gauge",
    name: "Medidor de Presión Abisal 1100 ATM",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="28" fill="#0F172A" stroke="${S}" stroke-width="6"/><circle cx="0" cy="0" r="22" fill="#1E293B"/><line x1="-16" y1="0" x2="-12" y2="0" stroke="#94A3B8" stroke-width="3"/><line x1="16" y1="0" x2="12" y2="0" stroke="#94A3B8" stroke-width="3"/><line x1="0" y1="-16" x2="0" y2="-12" stroke="#EF4444" stroke-width="4"/><line x1="0" y1="0" x2="10" y2="-12" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="0" r="4" fill="#EF4444"/><text x="-16" y="12" fill="#38BDF8" font-size="8" font-weight="900" font-family="'Arial Black', sans-serif">1100 ATM</text>`,
    tags: ["presion", "fosa", "marianas", "atmosferas", "profundidad", "medidor", "bar"],
  },
  hair_follicle_erector: {
    id: "hair_follicle_erector",
    name: "Folículo Piloso y Músculo Erector",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M -30 20 C -20 20 -10 14 0 4 C 10 14 20 20 30 20" stroke="#FB7185" stroke-width="6" fill="none" stroke-linecap="round"/><line x1="0" y1="4" x2="12" y2="-32" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/><path d="M 0 4 C 14 8 20 20 18 30" stroke="#EF4444" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="18" cy="30" r="4" fill="#DC2626"/><polygon points="0,4 -6,14 -2,22 4,12" fill="#F43F5E"/><circle cx="0" cy="4" r="3" fill="#FFE600"/>`,
    tags: ["piel", "foliculo", "vello", "musculo", "erector", "piloereccion", "gallina"],
  },
  thermal_fur_barrier: {
    id: "thermal_fur_barrier",
    name: "Barrera Térmica de Pelaje Erizado",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-26" y="10" width="52" height="14" rx="4" fill="#FB7185" stroke="${S}" stroke-width="4"/><line x1="-20" y1="10" x2="-22" y2="-18" stroke="#78350F" stroke-width="4.5" stroke-linecap="round"/><line x1="-10" y1="10" x2="-10" y2="-22" stroke="#78350F" stroke-width="4.5" stroke-linecap="round"/><line x1="0" y1="10" x2="2" y2="-24" stroke="#78350F" stroke-width="4.5" stroke-linecap="round"/><line x1="10" y1="10" x2="12" y2="-20" stroke="#78350F" stroke-width="4.5" stroke-linecap="round"/><line x1="20" y1="10" x2="24" y2="-16" stroke="#78350F" stroke-width="4.5" stroke-linecap="round"/><path d="M -24 -2 Q 0 -12 24 -2" stroke="#38BDF8" stroke-width="3" stroke-dasharray="4,3" fill="none"/><circle cx="0" cy="-6" r="3" fill="#FACC15"/>`,
    tags: ["pelaje", "calor", "aire", "abrigo", "aislante", "evolucion", "animal"],
  },
  lichtenberg_fractal_skin: {
    id: "lichtenberg_fractal_skin",
    name: "Figuras de Lichtenberg en la Piel",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g><path d="M 0 -30 L 2 -10 L -6 4 L 4 18 L 0 32" stroke="#DC2626" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M 2 -10 L 14 -18 M 2 -10 L 12 -4" stroke="#EF4444" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M -6 4 L -18 0 M -6 4 L -14 12" stroke="#EF4444" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M 4 18 L 16 22 M 4 18 L 10 28" stroke="#F87171" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="14" cy="-18" r="2" fill="#DC2626"/><circle cx="-18" cy="0" r="2" fill="#DC2626"/><circle cx="16" cy="22" r="2" fill="#DC2626"/></g>`,
    tags: ["rayo", "lichtenberg", "piel", "fractal", "electricidad", "cicatriz", "arbol"],
  },
  lightning_flashover: {
    id: "lightning_flashover",
    name: "Efecto Flashover de Descarga Superficial",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g><circle cx="0" cy="-18" r="10" fill="#FDE047" stroke="${S}" stroke-width="3"/><path d="M -12 -6 L -14 18 L -20 34 M 12 -6 L 14 18 L 20 34" stroke="#FFE600" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M -24 -28 L -18 -8 L -26 12 L -20 32" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round" fill="none"/><path d="M 24 -28 L 18 -8 L 26 12 L 20 32" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round" fill="none"/><polygon points="0,-32 6,-22 -2,-20 4,-12" fill="#FFE600"/></g>`,
    tags: ["rayo", "flashover", "electricidad", "impacto", "descarga", "corriente", "humano"],
  },
  depth_sonar_marker: {
    id: "depth_sonar_marker",
    name: "Sonda de Profundidad 0 a 11 km (marcador descendente)",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: depthSonarMarker(150),
    animatedSvg: depthSonarMarker,
    tags: ["profundidad", "fosa", "marianas", "oceano", "descenso", "sonda", "kilometros"],
  },
  pressure_gauge_bursting: {
    id: "pressure_gauge_bursting",
    name: "Manómetro al Límite (aguja vibrando, vidrio agrietado y fuga de vapor)",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: pressureGaugeBursting(0),
    animatedSvg: pressureGaugeBursting,
    tags: ["presion", "manometro", "atmosferas", "estallar", "medidor", "fosa", "limite"],
  },
  airliner_stack: {
    id: "airliner_stack",
    name: "Pila de Aviones Comerciales x50 aplastando un pecho",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: airlinerStack(0),
    animatedSvg: airlinerStack,
    tags: ["avion", "aviones", "peso", "toneladas", "aplastar", "presion", "pecho"],
  },
  lungs_compressing: {
    id: "lungs_compressing",
    name: "Pulmones Colapsando hasta el tamaño de una manzana",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: lungsCompressing(120),
    animatedSvg: lungsCompressing,
    tags: ["pulmones", "respirar", "colapso", "presion", "gas", "organo", "manzana"],
  },
  eardrum_rupture: {
    id: "eardrum_rupture",
    name: "Tímpano Rompiéndose por Presión de Agua",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: eardrumRupture(5),
    animatedSvg: eardrumRupture,
    tags: ["oido", "timpano", "presion", "agua", "senos", "dolor", "barotrauma"],
  },
  cell_water_pressure: {
    id: "cell_water_pressure",
    name: "Célula Comprimida con Moléculas de Agua Alteradas",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: cellWaterPressure(0),
    animatedSvg: cellWaterPressure,
    tags: ["celula", "agua", "h2o", "presion", "tejido", "biologia", "molecula"],
  },
  protein_deforming: {
    id: "protein_deforming",
    name: "Proteína Deformándose por Inserción de Agua",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: proteinDeforming(0),
    animatedSvg: proteinDeforming,
    tags: ["proteina", "agua", "molecula", "plegamiento", "celula", "bioquimica", "deformar"],
  },
  snailfish_gelatinous: {
    id: "snailfish_gelatinous",
    name: "Pez Caracol Gelatinoso de las Marianas",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: snailfishGelatinous(0),
    animatedSvg: snailfishGelatinous,
    tags: ["pez", "caracol", "gelatinoso", "cartilago", "abisal", "marianas", "oceano"],
  },
  tmao_molecule_shield: {
    id: "tmao_molecule_shield",
    name: "Molécula de Trimetilamina (TMAO) como Escudo Molecular",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: tmaoMoleculeShield(0),
    animatedSvg: tmaoMoleculeShield,
    tags: ["trimetilamina", "tmao", "molecula", "escudo", "proteina", "quimica", "abisal"],
  },
  bathyscaphe_explorer: {
    id: "bathyscaphe_explorer",
    name: "Batiscafo Explorador con Foco y Hélice",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: bathyscapheExplorer(0),
    animatedSvg: bathyscapheExplorer,
    tags: ["batiscafo", "submarino", "explorar", "oceano", "abismo", "trieste", "profundidad"],
  },
  water_glass: {
    id: "water_glass",
    name: "Vaso de Agua Cristalina con Hielo",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: waterGlass(0),
    animatedSvg: waterGlass,
    tags: ["vaso", "agua", "beber", "h2o", "cristal", "sed", "hielo", "mar"],
  },
  glass_water: {
    id: "glass_water",
    name: "Vaso de Agua Cristalina con Hielo",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: waterGlass(0),
    animatedSvg: waterGlass,
    tags: ["vaso", "agua", "beber", "h2o", "cristal", "sed", "hielo", "mar"],
  },
  life_buoy: {
    id: "life_buoy",
    name: "Salvavidas Náutico",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: lifeBuoy(0),
    animatedSvg: lifeBuoy,
    tags: ["salvavidas", "naufrago", "mar", "oceano", "rescate", "barco"],
  },
  lifebuoy: {
    id: "lifebuoy",
    name: "Salvavidas Náutico",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: lifeBuoy(0),
    animatedSvg: lifeBuoy,
    tags: ["salvavidas", "naufrago", "mar", "oceano", "rescate", "barco"],
  },
  cosmic_lock: {
    id: "cosmic_lock",
    name: "Candado Cósmico del Horizonte de Sucesos",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: cosmicLock(0),
    animatedSvg: cosmicLock,
    tags: ["candado", "bloqueo", "lock", "horizonte", "seguridad", "agujero_negro"],
  },
  padlock: {
    id: "padlock",
    name: "Candado Cósmico del Horizonte de Sucesos",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: cosmicLock(0),
    animatedSvg: cosmicLock,
    tags: ["candado", "bloqueo", "lock", "horizonte", "seguridad", "agujero_negro"],
  },
  bionic_ant: {
    id: "bionic_ant",
    name: "Hormiga Heroica Neo-Brutalista",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: bionicAnt(0),
    animatedSvg: bionicAnt,
    tags: ["hormiga", "ant", "insecto", "quitina", "resistencia", "caida", "bicho"],
  },
  ant_hero: {
    id: "ant_hero",
    name: "Hormiga Heroica Neo-Brutalista",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: bionicAnt(0),
    animatedSvg: bionicAnt,
    tags: ["hormiga", "ant", "insecto", "quitina", "resistencia", "caida", "bicho"],
  },
  cube_physics: {
    id: "cube_physics",
    name: "Cubo Ley Cuadrado-Cúbica (Área vs Masa)",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: cubePhysics(0),
    animatedSvg: cubePhysics,
    tags: ["cubo", "fisica", "ley", "escala", "volumen", "area", "haldane", "masa"],
  },
  terminal_velocity_shield: {
    id: "terminal_velocity_shield",
    name: "Escudo de Velocidad Terminal 6.4 km/h",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: terminalVelocityShield(0),
    animatedSvg: terminalVelocityShield,
    tags: ["velocidad", "terminal", "paracaidas", "aire", "resistencia", "freno", "caida"],
  },
  honey_pot: {
    id: "honey_pot",
    name: "Vasija de Miel Dorada Inmortal",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: honeyPot(0),
    animatedSvg: honeyPot,
    tags: ["miel", "vasija", "egipto", "antiguo", "alimento", "inmortal", "dulce"],
  },
  mars_helmet: {
    id: "mars_helmet",
    name: "Casco de Astronauta en Marte (Ebullición Saliva)",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: marsHelmet(0),
    animatedSvg: marsHelmet,
    tags: ["casco", "marte", "astronauta", "presion", "ebullicion", "armstrong", "vacio"],
  },
  ice_crystal_hex: {
    id: "ice_crystal_hex",
    name: "Red Hexagonal de Hielo Flotante",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: iceCrystalHex(0),
    animatedSvg: iceCrystalHex,
    tags: ["hielo", "cristal", "hexagonal", "agua", "flotar", "densidad", "molecula"],
  },
  bullet_ant: {
    id: "bullet_ant",
    name: "Hormiga Bala y Neurotoxina (Dolor 4.0+)",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: bulletAnt(0),
    animatedSvg: bulletAnt,
    tags: ["hormiga", "bala", "dolor", "schmidt", "aguijon", "veneno", "neurotoxina"],
  },
  chameleon_hero: {
    id: "chameleon_hero",
    name: "Camaleón y Cristales Fotónicos",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: chameleonHero(0),
    animatedSvg: chameleonHero,
    tags: ["camaleon", "color", "cristales", "fotonica", "reptil", "nanocristales"],
  },
  photonic_crystals: {
    id: "photonic_crystals",
    name: "Red de Nanocristales Fotónicos de Guanina",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: photonicCrystals(0),
    animatedSvg: photonicCrystals,
    tags: ["cristales", "fotonica", "guanina", "nanocristales", "iridoforo", "optica", "color", "longitud_onda"],
  },
  tardigrade_hero: {
    id: "tardigrade_hero",
    name: "Tardígrado y Criptobiosis Inmortal",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: tardigradeHero(0),
    animatedSvg: tardigradeHero,
    tags: ["tardigrado", "oso_agua", "criptobiosis", "biovidrio", "inmortal", "vacio", "radiacion"],
  },
  pistol_shrimp_hero: {
    id: "pistol_shrimp_hero",
    name: "Camarón Pistola y Burbuja de Plasma (4,700°C)",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: pistolShrimpHero(0),
    animatedSvg: pistolShrimpHero,
    tags: ["camaron_pistola", "cavitacion", "plasma", "sonoluminiscencia", "onda_choque", "calor_solar"],
  },
  relativistic_clock: {
    id: "relativistic_clock",
    name: "Reloj Relativista: Núcleo vs Superficie",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: relativisticClock(0),
    animatedSvg: relativisticClock,
    tags: ["reloj", "relatividad", "tiempo", "gravedad", "dilatacion", "einstein", "nucleo_tierra"],
  },
  mycelium_network: {
    id: "mycelium_network",
    name: "Red de Micelio Fúngico (Wood Wide Web)",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: myceliumNetwork(0),
    animatedSvg: myceliumNetwork,
    tags: ["micelio", "bosque", "arboles", "wood_wide_web", "hongos", "raices", "comunicacion"],
  },
  relativistic_rocket: {
    id: "relativistic_rocket",
    name: "Nave Relativista a 0.99c (Contracción de Lorentz)",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: relativisticRocket(0),
    animatedSvg: relativisticRocket,
    tags: ["cohete", "nave", "espacio", "relatividad", "lorentz", "velocidad_luz", "gemelos"],
  },
  magma_bubbling_crust: {
    id: "magma_bubbling_crust",
    name: "Corteza Basáltica con Magma Hirviendo y Burbujas a 1,200 °C",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: magmaBubblingCrust(0),
    animatedSvg: magmaBubblingCrust,
    tags: ["lava", "magma", "volcan", "caldera", "basalto", "calor", "temperatura"],
  },
  leidenfrost_cushion: {
    id: "leidenfrost_cushion",
    name: "Efecto Leidenfrost: Colchón de Vapor Hirviente Protector",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: leidenfrostCushion(0),
    animatedSvg: leidenfrostCushion,
    tags: ["leidenfrost", "vapor", "termodinamica", "aislamiento", "volcan", "fisica", "ebullicion"],
  },
  volcanic_density_scale: {
    id: "volcanic_density_scale",
    name: "Balanza de Densidad: Roca Fundida (3.1 g/cm³) vs Cuerpo Humano (1.0 g/cm³)",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: volcanicDensityScale(0),
    animatedSvg: volcanicDensityScale,
    tags: ["balanza", "densidad", "lava", "flotar", "humano", "comparacion", "volcan"],
  },
  pan_de_muerto_xray_flicker: {
    id: "pan_de_muerto_xray_flicker",
    name: "Pan de Muerto con Escáner de Rayos X y Esqueleto Oculto",
    family: "naturaleza_alimentos",
    defaultPlacement: "both",
    svg: panDeMuertoXrayFlicker(0),
    animatedSvg: panDeMuertoXrayFlicker,
    tags: ["pan_de_muerto", "rayos_x", "esqueleto", "craneo", "dia_de_muertos"],
  },
  pan_base_engranaje: {
    id: "pan_base_engranaje",
    name: "Base Redonda de Pan Girando como Engranaje con Flechas de Ciclo Continuo",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: panBaseEngranaje(0),
    animatedSvg: panBaseEngranaje,
    tags: ["pan_de_muerto", "engranaje", "ciclo_vida", "eterno", "sin_fin", "rotacion"],
  },
  pan_craneo_morph: {
    id: "pan_craneo_morph",
    name: "Esfera de Pan Flotante con Transición a Calaverita de Azúcar",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: panCraneoMorph(0),
    animatedSvg: panCraneoMorph,
    tags: ["craneo", "calaverita", "azucar", "esfera", "pan_de_muerto", "ofrenda"],
  },
  esqueleto_canillas_matching: {
    id: "esqueleto_canillas_matching",
    name: "Esqueleto Stickman Acostado con Canillas Encajando en Extremidades",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: esqueletoCanillasMatching(0),
    animatedSvg: esqueletoCanillasMatching,
    tags: ["canillas", "huesos", "femur", "humero", "esqueleto", "anatomia", "pan_de_muerto"],
  },
  brujula_prehispanica_hero: {
    id: "brujula_prehispanica_hero",
    name: "Brújula Prehispánica Mesoamericana con Cuatro Rumbos y Haces de Luz",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: brujulaPrehispanicaHero(0),
    animatedSvg: brujulaPrehispanicaHero,
    tags: ["brujula", "prehispanica", "cuatro_rumbos", "dioses", "mexica", "cosmogonia"],
  },
  vapor_azahar_blossoms: {
    id: "vapor_azahar_blossoms",
    name: "Vaho Aromático de Flor de Azahar con Flores Girando en el Vapor",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: vaporAzaharBlossoms(0),
    animatedSvg: vaporAzaharBlossoms,
    tags: ["azahar", "aroma", "vaho", "olor", "difuntos", "altar", "naranjo"],
  },
  chocolate_barro_steaming: {
    id: "chocolate_barro_steaming",
    name: "Taza de Barro Humeante con Chocolate Caliente y Pan con Mordida",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: chocolateBarroSteaming(0),
    animatedSvg: chocolateBarroSteaming,
    tags: ["chocolate", "barro", "taza", "pan_con_mordida", "mordida", "ofrenda", "comida"],
  },
  eye_patch: {
    id: "eye_patch",
    name: "Parche en el ojo de bribón medieval",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<path d="M -54 -36 L -24 -20 M -54 12 L -24 -4 M -12 -16 L 50 -26" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="-24" cy="-11" rx="16" ry="14" fill="#18181B" stroke="${S}" stroke-width="4.5"/><ellipse cx="-24" cy="-11" rx="11" ry="9" fill="#27272A" stroke="#3F3F46" stroke-width="1.5"/><circle cx="-21" cy="-14" r="2" fill="#71717A"/>`,
    tags: ["parche", "jack", "ojo", "pirata", "medieval"],
  },
  trident: {
    id: "trident",
    name: "Tridente del Diablo",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="-30" x2="0" y2="45" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/><path d="M -16 -10 L -16 -30 M 16 -10 L 16 -30 M -16 -10 Q 0 -4 16 -10" stroke="#DC2626" stroke-width="4.5" fill="none" stroke-linecap="round"/>`,
    tags: ["tridente", "diablo", "demonio", "infierno", "furia"],
  },
  calabaza_a_nabo_morph: {
    id: "calabaza_a_nabo_morph",
    name: "Mutación de Calabaza a Nabo Tradicional Histórico",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: calabazaANaboMorph(0),
    animatedSvg: calabazaANaboMorph,
    tags: ["calabaza", "nabo", "mutacion", "rayo", "pesadilla", "halloween"],
  },
  diablo_arbol_cruces: {
    id: "diablo_arbol_cruces",
    name: "Diablo Atrapado en Árbol con Cruces Talladas por Jack",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: diabloArbolCruces(0),
    animatedSvg: diabloArbolCruces,
    tags: ["diablo", "arbol", "cruces", "jack", "engano", "celta", "leyenda"],
  },
  cielo_infierno_puertas: {
    id: "cielo_infierno_puertas",
    name: "Puertas del Cielo Rechazado y Rejas del Infierno",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: cieloInfiernoPuertas(0),
    animatedSvg: cieloInfiernoPuertas,
    tags: ["cielo", "infierno", "candado", "rechazado", "puertas", "alma", "limbo"],
  },
  carbon_infierno_malabares: {
    id: "carbon_infierno_malabares",
    name: "Brasa Ardiente del Infierno con Malabares de Calor",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: carbonInfiernoMalabares(0),
    animatedSvg: carbonInfiernoMalabares,
    tags: ["carbon", "infierno", "brasa", "fuego", "quemar", "malabares", "luz"],
  },
  nabo_linterna_jack: {
    id: "nabo_linterna_jack",
    name: "Nabo Linterna Original de Jack con Luz Interior",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: naboLinternaJack(0),
    animatedSvg: naboLinternaJack,
    tags: ["nabo", "linterna", "jack_o_lantern", "brasa", "celta", "samhain"],
  },
  cabana_nabos_proteccion: {
    id: "cabana_nabos_proteccion",
    name: "Ventana con Nabos Aterradores Ahuyentando el Espíritu Errante",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: cabanaNabosProteccion(0),
    animatedSvg: cabanaNabosProteccion,
    tags: ["cabana", "nabos", "ritual", "samhain", "proteccion", "espiritu", "fantasma"],
  },
  nabo_duro_vs_calabaza: {
    id: "nabo_duro_vs_calabaza",
    name: "Cuchillo Doblado en Nabo Duro vs Calabaza Dócil",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: naboDuroVsCalabaza(0),
    animatedSvg: naboDuroVsCalabaza,
    tags: ["nabo_duro", "calabaza", "cuchillo_doblado", "america", "comparacion"],
  },
  gota_rupert_hero: {
    id: "gota_rupert_hero",
    name: "Gota de Prince Rupert de Cristal Indestructible",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: gotaRupertHero(0),
    animatedSvg: gotaRupertHero,
    tags: ["gota_rupert", "vidrio", "cristal", "paradoja", "ciencia", "resistencia"],
  },
  bala_impacto_aplastada: {
    id: "bala_impacto_aplastada",
    name: "Bala de Pistola Aplastada contra la Gota de Rupert",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: balaImpactoAplastada(0),
    animatedSvg: balaImpactoAplastada,
    tags: ["bala", "impacto", "blindaje", "choque", "bala_aplastada", "gota_rupert"],
  },
  mazo_demolicion_rebote: {
    id: "mazo_demolicion_rebote",
    name: "Mazo de Demolición Rebotando como Titanio",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: mazoDemolicionRebote(0),
    animatedSvg: mazoDemolicionRebote,
    tags: ["mazo", "martillo", "rebote", "golpe", "titanio", "fuerza"],
  },
  tanque_temple_vidrio: {
    id: "tanque_temple_vidrio",
    name: "Tanque de Temple con Vidrio Fundido en Agua Helada",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: tanqueTempleVidrio(0),
    animatedSvg: tanqueTempleVidrio,
    tags: ["tanque", "temple", "vidrio_fundido", "agua_helada", "termodinamica", "choque_termico"],
  },
  corte_molecular_tension: {
    id: "corte_molecular_tension",
    name: "Corte Molecular: Compresión Exterior vs Tensión Núcleo",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: corteMolecularTension(0),
    animatedSvg: corteMolecularTension,
    tags: ["corte_molecular", "tension", "compresion", "malla", "red_cristalina", "fisica"],
  },
  gota_fractura_rayos: {
    id: "gota_fractura_rayos",
    name: "Gota con Cola Rota y Fractura Lumínica a 5,000 km/h",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: gotaFracturaRayos(0),
    animatedSvg: gotaFracturaRayos,
    tags: ["fractura", "rayos", "onda_choque", "cola_rota", "ultrasonico", "5000_kmh"],
  },
  pulverizacion_vidrio_nube: {
    id: "pulverizacion_vidrio_nube",
    name: "Explosión Volumétrica y Pulverización Catastrófica de Vidrio",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: pulverizacionVidrioNube(0),
    animatedSvg: pulverizacionVidrioNube,
    tags: ["pulverizacion", "explosion", "polvo_vidrio", "catastrofico", "nube", "shockwave"],
  },
  vaso_burbuja_estroboscopica: {
    id: "vaso_burbuja_estroboscopica",
    name: "Vaso de Precipitados con Burbuja y Destello Solar",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: vasoBurbujaEstroboscopica(0),
    animatedSvg: vasoBurbujaEstroboscopica,
    tags: ["vaso", "burbuja", "sonoluminiscencia", "destello", "agua", "luz"],
  },
  pecera_paletas_pingpong: {
    id: "pecera_paletas_pingpong",
    name: "Pecera con Paletas de Ping Pong Intentando Atrapar Burbuja",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: peceraPaletasPingpong(0),
    animatedSvg: peceraPaletasPingpong,
    tags: ["pecera", "paletas", "ping_pong", "burbuja_esquiva", "humor", "agua"],
  },
  matraz_transductores_ultrasonido: {
    id: "matraz_transductores_ultrasonido",
    name: "Matraz Esférico con Transductores de Ultrasonido y Trampa Acústica",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: matrazTransductoresUltrasonido(0),
    animatedSvg: matrazTransductoresUltrasonido,
    tags: ["matraz", "transductores", "ultrasonido", "trampa_acustica", "levitacion", "ondas"],
  },
  burbuja_colapso_hidrodinamico: {
    id: "burbuja_colapso_hidrodinamico",
    name: "Burbuja en Colapso Hidrodinámico y Ondas de Choque",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: burbujaColapsoHidrodinamico(0),
    animatedSvg: burbujaColapsoHidrodinamico,
    tags: ["burbuja", "cavitacion", "colapso", "hidrodinamica", "ondas_choque"],
  },
  termometro_10000_grados: {
    id: "termometro_10000_grados",
    name: "Termómetro Sobrecargado a 10,000 °C y Colisión Cuántica",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: termometro10000Grados(0),
    animatedSvg: termometro10000Grados,
    tags: ["termometro", "10000_grados", "temperatura_solar", "calor", "energia", "moleculas"],
  },
  plasma_fogonazo_estelar: {
    id: "plasma_fogonazo_estelar",
    name: "Fogonazo de Plasma Estelar Azul-Violeta",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: plasmaFogonazoEstelar(0),
    animatedSvg: plasmaFogonazoEstelar,
    tags: ["plasma", "fogonazo", "estelar", "fotones", "luz", "cuantico"],
  },
  matraz_estrella_miniatura: {
    id: "matraz_estrella_miniatura",
    name: "Matraz con Estrella Azul en Miniatura Palpitando en Agua",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: matrazEstrellaMiniatura(0),
    animatedSvg: matrazEstrellaMiniatura,
    tags: ["estrella_miniatura", "matraz", "luz_azul", "luciernaga", "cierre"],
  },
  welding_mask: {
    id: "welding_mask",
    name: "Careta de Soldador Protectora",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<path d="M -76 -20 C -76 -74 -50 -84 0 -84 C 50 -84 76 -74 76 -20 L 78 36 C 78 68 54 88 26 90 L -26 90 C -54 88 -78 68 -78 36 Z" fill="#0F172A" stroke="${S}" stroke-width="6" stroke-linejoin="round" /><path d="M -64 -18 C -64 -64 -40 -72 0 -72 C 40 -72 64 -64 64 -18 L 66 30 C 66 58 44 76 20 78 L -20 78 C -44 76 -66 58 -66 30 Z" fill="#1E293B" stroke="#334155" stroke-width="2" /><rect x="-44" y="-24" width="88" height="28" rx="4" fill="#020617" stroke="${S}" stroke-width="4"/><rect x="-38" y="-19" width="76" height="18" rx="2" fill="#064E3B" stroke="#059669" stroke-width="2"/><line x1="-30" y1="-14" x2="28" y2="-14" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/><line x1="-24" y1="-9" x2="16" y2="-9" stroke="#6EE7B7" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><circle cx="-75" cy="4" r="6" fill="#475569" stroke="${S}" stroke-width="2.5"/><circle cx="75" cy="4" r="6" fill="#475569" stroke="${S}" stroke-width="2.5"/><circle cx="-75" cy="4" r="2.5" fill="#94A3B8"/><circle cx="75" cy="4" r="2.5" fill="#94A3B8"/><line x1="-16" y1="56" x2="16" y2="56" stroke="#334155" stroke-width="3" stroke-linecap="round"/><line x1="-22" y1="64" x2="22" y2="64" stroke="#334155" stroke-width="3" stroke-linecap="round"/><line x1="-16" y1="72" x2="16" y2="72" stroke="#334155" stroke-width="3" stroke-linecap="round"/>`,
    tags: ["careta", "soldador", "proteccion", "mascara", "laboratorio"],
  },
  earmuffs_polar: {
    id: "earmuffs_polar",
    name: "Orejeras Térmicas Polares",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<path d="M -68 15 C -68 -54 68 -54 68 15" fill="none" stroke="#0F172A" stroke-width="7" stroke-linecap="round"/><ellipse cx="-68" cy="15" rx="14" ry="22" fill="#EF4444" stroke="${S}" stroke-width="5"/><ellipse cx="-68" cy="15" rx="8" ry="14" fill="#FCA5A5"/><ellipse cx="68" cy="15" rx="14" ry="22" fill="#EF4444" stroke="${S}" stroke-width="5"/><ellipse cx="68" cy="15" rx="8" ry="14" fill="#FCA5A5"/>`,
    tags: ["orejeras", "antartida", "frio", "polar", "abrigo"],
  },
  bufanda_polar_viento: {
    id: "bufanda_polar_viento",
    name: "Bufanda Polar Ondeando al Viento",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<rect x="-42" y="-14" width="84" height="26" rx="12" fill="#EF4444" stroke="${S}" stroke-width="6"/><path d="M 15 2 Q 55 -5 95 10 Q 75 35 30 24 Z" fill="#DC2626" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><path d="M 10 8 Q 50 20 85 35 Q 65 55 20 38 Z" fill="#EF4444" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><line x1="-20" y1="-14" x2="-20" y2="12" stroke="#FACC15" stroke-width="6"/><line x1="5" y1="-14" x2="5" y2="12" stroke="#FACC15" stroke-width="6"/>`,
    tags: ["bufanda", "viento", "polar", "rojo", "antartida"],
  },
  trozo_hielo_antartico: {
    id: "trozo_hielo_antartico",
    name: "Trozo de Hielo Glacial Rugoso",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="-28,-22 0,-34 32,-18 38,15 8,32 -26,24 -36,-5" fill="#E0F2FE" stroke="${S}" stroke-width="5"/><polygon points="-28,-22 0,-10 32,-18" fill="#BAE6FD" stroke="${S}" stroke-width="3"/><polygon points="-28,-22 0,-10 -26,24" fill="#7DD3FC" stroke="${S}" stroke-width="3"/><polygon points="0,-10 32,-18 38,15 8,32" fill="#38BDF8" stroke="${S}" stroke-width="3"/><polygon points="-26,24 0,-10 8,32" fill="#0284C7" stroke="${S}" stroke-width="3"/><circle cx="-10" cy="-14" r="3" fill="#FFFFFF"/>`,
    tags: ["hielo", "glaciar", "antartida", "cristal", "piedra"],
  },
  cinta_metrica_90m: {
    id: "cinta_metrica_90m",
    name: "Cinta Métrica Infinita 90 Metros",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-30" y="-30" width="60" height="60" rx="14" fill="#FACC15" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="18" fill="#1E293B" stroke="${S}" stroke-width="4"/><circle cx="0" cy="0" r="6" fill="#FACC15"/><path d="M 28 10 Q 42 40 12 70 Q -18 100 4 130" fill="none" stroke="#FEF08A" stroke-width="12" stroke-linecap="round"/><text x="-6" y="85" fill="#000000" font-size="12" font-family="'Courier New', monospace" font-weight="bold">90m</text>`,
    tags: ["cinta_metrica", "90m", "medicion", "profundidad", "glaciar"],
  },
  cubeta_hielo_rocas: {
    id: "cubeta_hielo_rocas",
    name: "Cubeta con Hielo y Rocas Antárticas",
    family: "vida_cotidiana",
    defaultPlacement: "left",
    svg: `<polygon points="-28,-18 28,-18 20,32 -20,32" fill="#94A3B8" stroke="${S}" stroke-width="5"/><ellipse cx="0" cy="-18" rx="28" ry="8" fill="#CBD5E1" stroke="${S}" stroke-width="5"/><polygon points="-18,-22 -8,-34 2,-22" fill="#38BDF8" stroke="${S}" stroke-width="3"/><polygon points="4,-22 16,-32 24,-20" fill="#E0F2FE" stroke="${S}" stroke-width="3"/><polygon points="-8,-20 6,-28 14,-20" fill="#475569" stroke="${S}" stroke-width="3"/><path d="M -28 -18 C -28 -40 28 -40 28 -18" fill="none" stroke="${S}" stroke-width="4"/>`,
    tags: ["cubeta", "hielo", "piedras", "experimento", "balde"],
  },
  holograma_nave_espacial: {
    id: "holograma_nave_espacial",
    name: "Holograma Nave Espacial con Láser",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<polygon points="0,-36 26,18 0,6 -26,18" fill="#064E3B" stroke="#22C55E" stroke-width="4.5"/><polygon points="0,-24 14,12 0,4 -14,12" fill="#10B981"/><circle cx="0" cy="-4" r="5" fill="#86EFAC"/><line x1="-16" y1="-10" x2="-16" y2="-52" stroke="#4ADE80" stroke-width="4" stroke-linecap="round"/><line x1="16" y1="-10" x2="16" y2="-52" stroke="#4ADE80" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["holograma", "nave_espacial", "laser", "star_wars", "scifi"],
  },
  diagrama_oido_dispersion: {
    id: "diagrama_oido_dispersion",
    name: "Diagrama Oído y Recepción Acústica",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M 0 -28 C 18 -28 32 -14 28 8 C 24 24 12 30 2 34 C -4 36 -12 32 -10 24 C -8 18 -2 16 0 12 C 4 8 8 2 6 -6 C 4 -14 -4 -18 -12 -16" fill="none" stroke="${S}" stroke-width="6" stroke-linecap="round"/><path d="M -22 -14 Q -16 -20 -10 -14" stroke="#C084FC" stroke-width="4" fill="none"/><path d="M -40 -14 Q -32 -24 -24 -14" stroke="#F87171" stroke-width="5" fill="none"/>`,
    tags: ["oido", "diagrama", "ondas", "frecuencia", "percepcion"],
  },
  mochila_expedicion_polar: {
    id: "mochila_expedicion_polar",
    name: "Mochila de Expedición Polar",
    family: "historia_exploracion",
    defaultPlacement: "left",
    svg: `<rect x="-24" y="-32" width="48" height="64" rx="8" fill="#1E3A8A" stroke="${S}" stroke-width="5.5"/><rect x="-18" y="-24" width="36" height="22" rx="4" fill="#3B82F6" stroke="${S}" stroke-width="3.5"/><rect x="-18" y="4" width="36" height="22" rx="4" fill="#1D4ED8" stroke="${S}" stroke-width="3.5"/><line x1="-24" y1="-8" x2="24" y2="-8" stroke="#FACC15" stroke-width="4"/><ellipse cx="0" cy="-32" rx="18" ry="6" fill="#60A5FA" stroke="${S}" stroke-width="3"/>`,
    tags: ["mochila", "expedicion", "polar", "antartida", "viaje"],
  },
  barquito_papel: {
    id: "barquito_papel",
    name: "Barquito de Papel Plegado",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<polygon points="-32,16 32,16 22,32 -22,32" fill="#FFFFFF" stroke="${S}" stroke-width="4.5"/><polygon points="0,-28 0,14 -24,14" fill="#F1F5F9" stroke="${S}" stroke-width="4"/><polygon points="4,-24 4,14 26,14" fill="#E2E8F0" stroke="${S}" stroke-width="4"/>`,
    tags: ["barquito", "papel", "origami", "estanque", "agua"],
  },
  bate_fotones: {
    id: "bate_fotones",
    name: "Bate de Béisbol Fotónico",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -18 34 L -12 40 L 22 -26 L 16 -32 Z" fill="#D97706" stroke="${S}" stroke-width="4.5"/><ellipse cx="26" cy="-30" rx="9" ry="5" transform="rotate(-45 26 -30)" fill="#F59E0B" stroke="${S}" stroke-width="3"/><rect x="-24" y="28" width="12" height="16" rx="3" transform="rotate(-45 -24 28)" fill="#EF4444" stroke="${S}" stroke-width="3"/>`,
    tags: ["bate", "beisbol", "impulso", "momento", "foton"],
  },
  esfera_foton_dorada: {
    id: "esfera_foton_dorada",
    name: "Esfera de Fotón Solar Radiante",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="26" fill="#FEF08A" opacity="0.3"/><circle cx="0" cy="0" r="18" fill="#FACC15" stroke="${S}" stroke-width="4"/><circle cx="-5" cy="-5" r="5" fill="#FFFFFF"/><path d="M -30 0 L -18 0 M -26 -16 L -14 -8 M -26 16 L -14 8" stroke="#FDE047" stroke-width="3.5" stroke-linecap="round"/>`,
    tags: ["foton", "luz", "particula", "energia", "sol"],
  },
  capsula_espacial_modulo: {
    id: "capsula_espacial_modulo",
    name: "Cápsula Espacial Modular",
    family: "tecnologia",
    defaultPlacement: "left",
    svg: `<rect x="-32" y="-32" width="64" height="64" rx="16" fill="#1E293B" stroke="${S}" stroke-width="5.5"/><circle cx="0" cy="0" r="20" fill="#0284C7" stroke="#38BDF8" stroke-width="3.5"/><circle cx="-6" cy="-6" r="6" fill="#FFFFFF" opacity="0.8"/><rect x="-16" y="32" width="32" height="12" rx="4" fill="#F59E0B" stroke="${S}" stroke-width="3"/>`,
    tags: ["capsula", "nave", "espacial", "astronauta", "cosmos"],
  },
  vela_solar_mylar: {
    id: "vela_solar_mylar",
    name: "Vela Solar Reflectante Mylar",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<polygon points="0,-36 36,0 0,36 -36,0" fill="#FEF08A" stroke="#EAB308" stroke-width="4"/><line x1="-36" y1="0" x2="36" y2="0" stroke="${S}" stroke-width="2"/><line x1="0" y1="-36" x2="0" y2="36" stroke="${S}" stroke-width="2"/><circle cx="0" cy="0" r="8" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>`,
    tags: ["vela_solar", "mylar", "espejo", "propulsion", "fotones"],
  },
  diagrama_empuje_2x: {
    id: "diagrama_empuje_2x",
    name: "Insignia Doble Empuje 2X",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-42" y="-22" width="84" height="44" rx="10" fill="#020617" stroke="#22C55E" stroke-width="4"/><text x="0" y="8" text-anchor="middle" fill="#4ADE80" font-size="18" font-family="'Courier New', monospace" font-weight="bold">2X PUSH</text>`,
    tags: ["diagrama", "empuje", "rebote", "2x", "fisica"],
  },
  velocimetro_cosmico: {
    id: "velocimetro_cosmico",
    name: "Velocímetro Digital Cósmico",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-45" y="-24" width="90" height="48" rx="8" fill="#020617" stroke="#38BDF8" stroke-width="4"/><text x="0" y="-3" text-anchor="middle" fill="#38BDF8" font-size="11" font-family="'Courier New', monospace" font-weight="bold">50,000 KM/H</text><text x="0" y="16" text-anchor="middle" fill="#FACC15" font-size="12" font-family="'Courier New', monospace" font-weight="bold">WARP DRIVE</text>`,
    tags: ["velocimetro", "aceleracion", "warp", "hud", "cosmos"],
  },
  gafas_aviador_futuristas: {
    id: "gafas_aviador_futuristas",
    name: "Gafas de Aviador Futuristas",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-38" y="-22" width="32" height="22" rx="6" fill="#F59E0B" stroke="${S}" stroke-width="4"/><line x1="-34" y1="-16" x2="-14" y2="-16" stroke="#FEF08A" stroke-width="2"/><rect x="6" y="-22" width="32" height="22" rx="6" fill="#F59E0B" stroke="${S}" stroke-width="4"/><line x1="10" y1="-16" x2="30" y2="-16" stroke="#FEF08A" stroke-width="2"/><line x1="-6" y1="-11" x2="6" y2="-11" stroke="${S}" stroke-width="5"/><path d="M -38 -11 L -66 -11 M 38 -11 L 66 -11" stroke="#334155" stroke-width="6"/>`,
    tags: ["gafas", "aviador", "futurista", "proteccion", "accesorios"],
  },
  bufanda_surf_estelar: {
    id: "bufanda_surf_estelar",
    name: "Bufanda Cósmica de Surf Estelar",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<rect x="-38" y="-12" width="76" height="24" rx="10" fill="#0284C7" stroke="${S}" stroke-width="5.5"/><path d="M 16 0 Q 55 -15 90 5 Q 65 25 24 16 Z" fill="#38BDF8" stroke="${S}" stroke-width="4.5"/><path d="M 8 6 Q 45 22 75 40 Q 55 58 14 36 Z" fill="#FACC15" stroke="${S}" stroke-width="4.5"/><line x1="-18" y1="-12" x2="-18" y2="12" stroke="#FACC15" stroke-width="5"/><line x1="6" y1="-12" x2="6" y2="12" stroke="#FACC15" stroke-width="5"/>`,
    tags: ["bufanda", "surf", "estelar", "cosmica", "vuelo"],
  },
  vaso_espacial_vacio: {
    id: "vaso_espacial_vacio",
    name: "Vaso de Vidrio Boca Abajo",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<polygon points="-22,-28 22,-28 16,28 -16,28" fill="#E0F2FE" fill-opacity="0.35" stroke="${S}" stroke-width="4.5"/><ellipse cx="0" cy="-28" rx="22" ry="7" fill="#BAE6FD" fill-opacity="0.5" stroke="${S}" stroke-width="4"/><line x1="-12" y1="-18" x2="8" y2="20" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`,
    tags: ["vaso", "vidrio", "espacio", "agua", "vacio"],
  },
  bolsa_agua_astronauta: {
    id: "bolsa_agua_astronauta",
    name: "Bolsa de Hidratación Espacial",
    family: "tecnologia",
    defaultPlacement: "left",
    svg: `<rect x="-24" y="-28" width="48" height="56" rx="8" fill="#E2E8F0" stroke="${S}" stroke-width="4.5"/><rect x="-18" y="-20" width="36" height="40" rx="4" fill="#0284C7" stroke="${S}" stroke-width="3"/><rect x="-8" y="-36" width="16" height="10" rx="3" fill="#64748B" stroke="${S}" stroke-width="3"/><line x1="0" y1="-36" x2="0" y2="-48" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>`,
    tags: ["bolsa_agua", "nasa", "astronauta", "bebida", "espacio"],
  },
  esfera_agua_flotante: {
    id: "esfera_agua_flotante",
    name: "Esfera de Agua Flotante en Microgravedad",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="38" fill="#38BDF8" fill-opacity="0.65" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="32" fill="#7DD3FC" fill-opacity="0.45"/><ellipse cx="-14" cy="-16" rx="14" ry="7" transform="rotate(-30 -14 -16)" fill="#FFFFFF" opacity="0.8"/><circle cx="18" cy="18" r="6" fill="#FFFFFF" opacity="0.5"/>`,
    tags: ["esfera_agua", "gota", "flotante", "tension_superficial", "microgravedad"],
  },
  pececito_hule_dorado: {
    id: "pececito_hule_dorado",
    name: "Pececito de Hule Dorado",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<ellipse cx="0" cy="0" rx="30" ry="18" fill="#F59E0B" stroke="${S}" stroke-width="4"/><polygon points="-26,0 -44,-16 -44,16" fill="#FACC15" stroke="${S}" stroke-width="3.5"/><polygon points="-6,-16 12,-24 8,-16" fill="#FACC15" stroke="${S}" stroke-width="2.5"/><circle cx="15" cy="-4" r="6" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/><circle cx="17" cy="-4" r="3" fill="#000000"/><circle cx="30" cy="-6" r="4" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5"/>`,
    tags: ["pececito", "pez", "hule", "dorado", "juguete"],
  },
  popote_astronauta_largo: {
    id: "popote_astronauta_largo",
    name: "Popote de Astronauta con Adhesión",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<line x1="-30" y1="35" x2="30" y2="-35" stroke="#E2E8F0" stroke-width="8" stroke-linecap="round"/><line x1="-30" y1="35" x2="30" y2="-35" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/><circle cx="26" cy="-30" r="12" fill="#38BDF8" stroke="${S}" stroke-width="3"/>`,
    tags: ["popote", "tubo", "succion", "adhesion", "astronauta"],
  },
  mascara_agua_facial: {
    id: "mascara_agua_facial",
    name: "Máscara de Agua Adherida al Rostro",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="82" fill="#38BDF8" fill-opacity="0.55" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="76" fill="#7DD3FC" fill-opacity="0.35"/><ellipse cx="-35" cy="-35" rx="30" ry="16" transform="rotate(-30 -35 -35)" fill="#FFFFFF" opacity="0.6"/><ellipse cx="25" cy="40" rx="20" ry="10" transform="rotate(20 25 40)" fill="#FFFFFF" opacity="0.4"/><circle cx="-25" cy="18" r="7" fill="#E0F2FE" stroke="${S}" stroke-width="2"/><circle cx="32" cy="-14" r="9" fill="#E0F2FE" stroke="${S}" stroke-width="2"/><g transform="translate(15, -15)"><ellipse cx="0" cy="0" rx="18" ry="11" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/><polygon points="-16,0 -26,-9 -26,9" fill="#FACC15" stroke="${S}" stroke-width="2"/><circle cx="9" cy="-2" r="3" fill="#FFFFFF"/><circle cx="10" cy="-2" r="1.5" fill="#000000"/></g>`,
    tags: ["mascara_agua", "adhesion", "casco_agua", "asfixia", "astronauta"],
  },
  toalla_espacial_microfibra: {
    id: "toalla_espacial_microfibra",
    name: "Toalla Absorbente de Microfibra",
    family: "vida_cotidiana",
    defaultPlacement: "left",
    svg: `<rect x="-28" y="-20" width="56" height="40" rx="6" fill="#0284C7" stroke="${S}" stroke-width="4.5"/><path d="M -22 -10 L 22 -10 M -22 0 L 22 0 M -22 10 L 22 10" stroke="#38BDF8" stroke-width="3" stroke-linecap="round"/><rect x="-8" y="-26" width="16" height="8" rx="2" fill="#FACC15" stroke="${S}" stroke-width="2.5"/>`,
    tags: ["toalla", "microfibra", "secado", "limpieza", "higiene"],
  },
  compas_cientifico: {
    id: "compas_cientifico",
    name: "Compás de Dibujo Científico",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M 0 -32 L -18 28 M 0 -32 L 18 28" stroke="${S}" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-32" r="6" fill="#FACC15" stroke="${S}" stroke-width="3"/><line x1="-10" y1="4" x2="10" y2="4" stroke="${S}" stroke-width="3"/>`,
    tags: ["compas", "geometria", "circulo", "dibujo", "ciencia"],
  },
  baston_trekking_montana: {
    id: "baston_trekking_montana",
    name: "Bastón de Trekking de Alta Montaña",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="-38" x2="0" y2="42" stroke="#475569" stroke-width="5" stroke-linecap="round"/><rect x="-5" y="-38" width="10" height="20" rx="4" fill="#0F172A" stroke="${S}" stroke-width="2.5"/><path d="M 0 -22 Q -12 -18 -8 -8 Q -4 -12 0 -18" fill="#F97316" stroke="${S}" stroke-width="2"/><circle cx="0" cy="30" r="10" fill="#E2E8F0" stroke="${S}" stroke-width="2.5"/><line x1="0" y1="30" x2="0" y2="46" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["baston", "trekking", "senderismo", "montana", "nieve"],
  },
  gafas_ventisca_oscuras: {
    id: "gafas_ventisca_oscuras",
    name: "Gafas de Glaciar y Ventisca",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<rect x="-34" y="-18" width="28" height="18" rx="5" fill="#0F172A" stroke="${S}" stroke-width="4"/><line x1="-30" y1="-13" x2="-14" y2="-13" stroke="#38BDF8" stroke-width="2"/><rect x="6" y="-18" width="28" height="18" rx="5" fill="#0F172A" stroke="${S}" stroke-width="4"/><line x1="10" y1="-13" x2="26" y2="-13" stroke="#38BDF8" stroke-width="2"/><line x1="-6" y1="-9" x2="6" y2="-9" stroke="${S}" stroke-width="4.5"/><path d="M -34 -9 L -52 -9 M 34 -9 L 52 -9" stroke="#78350F" stroke-width="4"/>`,
    tags: ["gafas", "glaciar", "ventisca", "nieve", "proteccion"],
  },
  mochila_expedicion_montana: {
    id: "mochila_expedicion_montana",
    name: "Mochila de Expedición Andina",
    family: "historia_exploracion",
    defaultPlacement: "left",
    svg: `<rect x="-24" y="-32" width="48" height="64" rx="10" fill="#EA580C" stroke="${S}" stroke-width="5"/><rect x="-18" y="-24" width="36" height="20" rx="5" fill="#0284C7" stroke="${S}" stroke-width="3"/><rect x="-18" y="2" width="36" height="22" rx="5" fill="#C2410C" stroke="${S}" stroke-width="3"/><rect x="-28" y="30" width="56" height="10" rx="4" fill="#0284C7" stroke="${S}" stroke-width="3"/><line x1="-12" y1="-32" x2="-12" y2="30" stroke="#FDE047" stroke-width="3.5"/><line x1="12" y1="-32" x2="12" y2="30" stroke="#FDE047" stroke-width="3.5"/>`,
    tags: ["mochila", "expedicion", "trekking", "montanismo", "andes"],
  },
  estaca_penitente_hielo: {
    id: "estaca_penitente_hielo",
    name: "Cuchilla de Hielo Penitente",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<polygon points="0,-48 18,36 -18,36" fill="#E0F2FE" stroke="${S}" stroke-width="4.5"/><polygon points="0,-48 8,36 -18,36" fill="#BAE6FD" stroke="none"/><line x1="0" y1="-48" x2="2" y2="36" stroke="#0284C7" stroke-width="2.5"/><line x1="-8" y1="-10" x2="-4" y2="36" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="0" cy="36" rx="22" ry="7" fill="#64748B" stroke="${S}" stroke-width="3.5"/>`,
    tags: ["penitente", "hielo", "cuchilla", "estaca", "sublimacion"],
  },
  fosforo_encendido_sublimacion: {
    id: "fosforo_encendido_sublimacion",
    name: "Fósforo con Sublimación de Vapor",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<line x1="-22" y1="26" x2="16" y2="-12" stroke="#D97706" stroke-width="5" stroke-linecap="round"/><circle cx="16" cy="-12" r="5" fill="#991B1B" stroke="${S}" stroke-width="2"/><path d="M 16 -12 Q 22 -26 28 -34 Q 30 -18 20 -10 Z" fill="#FACC15" stroke="#EA580C" stroke-width="2.5"/><path d="M 18 -14 Q 22 -24 24 -28 Q 25 -18 20 -12 Z" fill="#FFFFFF" opacity="0.8"/><path d="M 32 -36 Q 38 -48 30 -58 Q 24 -68 34 -78" fill="none" stroke="#E2E8F0" stroke-width="3.5" stroke-dasharray="4 3" opacity="0.75"/>`,
    tags: ["fosforo", "fuego", "llama", "vapor", "sublimacion"],
  },
  puntero_divulgador: {
    id: "puntero_divulgador",
    name: "Puntero Telescópico de Divulgador",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<line x1="-24" y1="28" x2="24" y2="-28" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/><line x1="-24" y1="28" x2="-8" y2="10" stroke="#0F172A" stroke-width="7" stroke-linecap="round"/><circle cx="26" cy="-30" r="5" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>`,
    tags: ["puntero", "vara", "explicacion", "profesor", "ciencia"],
  },
  bola_nieve_polvorienta: {
    id: "bola_nieve_polvorienta",
    name: "Bola de Nieve Seca que se Desintegra",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="22" fill="#F8FAFC" stroke="${S}" stroke-width="4"/><circle cx="-6" cy="-5" r="4" fill="#E2E8F0"/><circle cx="7" cy="6" r="5" fill="#E2E8F0"/><circle cx="28" cy="-14" r="3.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/><circle cx="34" cy="2" r="2.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/><circle cx="-26" cy="-18" r="3" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/><path d="M 0 -22 Q 15 -35 8 -48" fill="none" stroke="#E2E8F0" stroke-width="3" stroke-dasharray="3 3"/>`,
    tags: ["bola_nieve", "nieve_seca", "polvo", "sublimacion", "desintegrar"],
  },
  mascara_antigas_industrial: {
    id: "mascara_antigas_industrial",
    name: "Máscara Antigás Industrial con Doble Filtro",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<g><line x1="-28" y1="2" x2="-52" y2="-12" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/><line x1="28" y1="2" x2="52" y2="-12" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/><line x1="-36" y1="36" x2="-54" y2="40" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/><line x1="36" y1="36" x2="54" y2="40" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/><path d="M -20 -8 Q 0 -14 20 -8 L 38 18 Q 44 42 0 54 Q -44 42 -38 18 Z" fill="#1E293B" stroke="${S}" stroke-width="5" stroke-linejoin="round"/><path d="M -16 -4 Q 0 -9 16 -4 L 32 18 Q 36 38 0 48 Q -36 38 -32 18 Z" fill="#0F172A"/><path d="M -14 -6 Q 0 -11 14 -6" fill="none" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/><circle cx="0" cy="30" r="16" fill="#334155" stroke="${S}" stroke-width="3.5"/><circle cx="0" cy="30" r="11" fill="#0F172A"/><line x1="-9" y1="30" x2="9" y2="30" stroke="#64748B" stroke-width="2.5" stroke-linecap="round"/><line x1="0" y1="21" x2="0" y2="39" stroke="#64748B" stroke-width="2.5" stroke-linecap="round"/><g transform="translate(-36, 26)"><ellipse cx="0" cy="0" rx="18" ry="18" fill="#FACC15" stroke="${S}" stroke-width="4"/><ellipse cx="0" cy="0" rx="12" ry="12" fill="#CA8A04" stroke="${S}" stroke-width="2.5"/><circle cx="0" cy="0" r="6" fill="#0F172A"/><line x1="-14" y1="0" x2="-7" y2="0" stroke="#0F172A" stroke-width="2.5"/><line x1="7" y1="0" x2="14" y2="0" stroke="#0F172A" stroke-width="2.5"/></g><g transform="translate(36, 26)"><ellipse cx="0" cy="0" rx="18" ry="18" fill="#FACC15" stroke="${S}" stroke-width="4"/><ellipse cx="0" cy="0" rx="12" ry="12" fill="#CA8A04" stroke="${S}" stroke-width="2.5"/><circle cx="0" cy="0" r="6" fill="#0F172A"/><line x1="-14" y1="0" x2="-7" y2="0" stroke="#0F172A" stroke-width="2.5"/><line x1="7" y1="0" x2="14" y2="0" stroke="#0F172A" stroke-width="2.5"/></g></g>`,
    tags: ["mascara", "antigas", "respirador", "quimico", "proteccion"],
  },
  gorra_detective_explorador: {
    id: "gorra_detective_explorador",
    name: "Gorra de Detective Deerstalker",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<path d="M -34 -20 Q 0 -54 34 -20 Q 44 -12 40 -6 Q 0 -12 -40 -6 Q -44 -12 -34 -20 Z" fill="#78350F" stroke="${S}" stroke-width="4.5"/><path d="M -22 -32 Q 0 -48 22 -32 L 20 -20 Q 0 -28 -20 -20 Z" fill="#92400E" stroke="${S}" stroke-width="2.5"/><circle cx="0" cy="-48" r="5" fill="#F59E0B" stroke="${S}" stroke-width="2"/><path d="M -8 -48 Q 0 -58 8 -48" stroke="#F59E0B" stroke-width="3" fill="none"/>`,
    tags: ["gorra", "sombrero", "detective", "sherlock", "explorador"],
  },
  frasco_muestra_cristal: {
    id: "frasco_muestra_cristal",
    name: "Frasco de Cristal para Muestras",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<rect x="-18" y="-22" width="36" height="48" rx="7" fill="#E0F2FE" fill-opacity="0.45" stroke="${S}" stroke-width="4"/><rect x="-12" y="-28" width="24" height="8" rx="3" fill="#94A3B8" stroke="${S}" stroke-width="3"/><rect x="-14" y="6" width="28" height="16" rx="4" fill="#38BDF8" fill-opacity="0.8"/><circle cx="-4" cy="12" r="3" fill="#FFFFFF" opacity="0.8"/><line x1="-10" y1="-14" x2="4" y2="10" stroke="#FFFFFF" stroke-width="2.5" opacity="0.6"/>`,
    tags: ["frasco", "cristal", "vidrio", "muestra", "quimica"],
  },
  cuchara_larga_muestreo: {
    id: "cuchara_larga_muestreo",
    name: "Cuchara Larga de Muestreo Químico",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<line x1="-32" y1="34" x2="22" y2="-20" stroke="#94A3B8" stroke-width="5" stroke-linecap="round"/><ellipse cx="26" cy="-24" rx="10" ry="6" transform="rotate(-40 26 -24)" fill="#CBD5E1" stroke="${S}" stroke-width="3"/><circle cx="28" cy="-24" r="4" fill="#38BDF8" opacity="0.8"/>`,
    tags: ["cuchara", "espatula", "laboratorio", "muestreo", "metal"],
  },
  escudo_acrilico_proteccion: {
    id: "escudo_acrilico_proteccion",
    name: "Escudo Facial de Acrílico Protector",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<rect x="-26" y="-36" width="52" height="72" rx="10" fill="#BAE6FD" fill-opacity="0.4" stroke="${S}" stroke-width="4.5"/><rect x="-22" y="-32" width="44" height="10" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2.5"/><line x1="-16" y1="-18" x2="16" y2="24" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.7"/><rect x="-10" y="26" width="20" height="6" rx="2" fill="#0284C7"/>`,
    tags: ["escudo", "acrilico", "proteccion", "careta", "seguridad"],
  },
  roca_azufre_amarillo_solido: {
    id: "roca_azufre_amarillo_solido",
    name: "Roca de Azufre Amarillo Sólido",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="-24,18 -12,-20 16,-24 28,6 18,24 -8,26" fill="#FACC15" stroke="${S}" stroke-width="4" stroke-linejoin="round"/><polygon points="-6,-18 14,-20 18,-6 -2,-4" fill="#FEF08A" stroke="${S}" stroke-width="2.5"/><polygon points="-16,4 4,6 2,20 -14,18" fill="#EAB308" stroke="${S}" stroke-width="2.5"/><circle cx="10" cy="14" r="3" fill="#CA8A04"/>`,
    tags: ["roca", "azufre", "mineral", "amarillo", "volcan"],
  },
  bacteria_mascota_verde: {
    id: "bacteria_mascota_verde",
    name: "Bacteria Ideonella Sakaiensis Mascota",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M -35 15 C -45 -10 -25 -38 0 -38 C 25 -38 45 -10 35 15 C 28 35 -28 35 -35 15 Z" fill="#4ADE80" stroke="${S}" stroke-width="4.5"/><ellipse cx="-12" cy="-22" rx="14" ry="7" fill="#86EFAC" opacity="0.6"/><circle cx="-12" cy="-10" r="10" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><circle cx="-10" cy="-10" r="5" fill="#0F172A"/><circle cx="12" cy="-10" r="10" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><circle cx="10" cy="-10" r="5" fill="#0F172A"/><path d="M -8 10 Q 0 18 8 10" fill="none" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="0" cy="14" rx="5" ry="3" fill="#F43F5E"/>`,
    tags: ["bacteria", "microbio", "ideonella", "mascota", "verde"],
  },
  botella_pet_arrugada: {
    id: "botella_pet_arrugada",
    name: "Botella de Plástico PET Arrugada",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<rect x="-14" y="-30" width="28" height="60" rx="8" fill="#E0F2FE" fill-opacity="0.55" stroke="${S}" stroke-width="4"/><rect x="-8" y="-38" width="16" height="8" rx="2" fill="#0284C7" stroke="${S}" stroke-width="2.5"/><line x1="-10" y1="-10" x2="8" y2="-4" stroke="${S}" stroke-width="3" stroke-linecap="round"/><line x1="8" y1="-4" x2="-6" y2="8" stroke="${S}" stroke-width="3" stroke-linecap="round"/><rect x="-12" y="14" width="24" height="12" fill="#38BDF8" opacity="0.8"/>`,
    tags: ["botella", "plastico", "pet", "reciclaje", "basura"],
  },
  placa_petri_cultivo: {
    id: "placa_petri_cultivo",
    name: "Placa de Petri con Cultivo Bacteriano",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<ellipse cx="0" cy="0" rx="34" ry="24" fill="#E0F2FE" fill-opacity="0.3" stroke="${S}" stroke-width="4"/><ellipse cx="0" cy="0" rx="28" ry="18" fill="#FEF08A" fill-opacity="0.75" stroke="${S}" stroke-width="2"/><circle cx="-10" cy="-4" r="5" fill="#22C55E" stroke="${S}" stroke-width="2"/><circle cx="8" cy="4" r="6" fill="#16A34A" stroke="${S}" stroke-width="2"/><circle cx="12" cy="-6" r="4" fill="#4ADE80" stroke="${S}" stroke-width="2"/><circle cx="-6" cy="6" r="4.5" fill="#4ADE80" stroke="${S}" stroke-width="2"/>`,
    tags: ["petri", "cultivo", "bacteria", "laboratorio", "agar"],
  },
  tijeras_moleculares_petasa: {
    id: "tijeras_moleculares_petasa",
    name: "Enzima PETasa Tijeras Moleculares",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g transform="rotate(-30)"><circle cx="-16" cy="22" r="10" fill="none" stroke="#A855F7" stroke-width="4"/><circle cx="16" cy="22" r="10" fill="none" stroke="#A855F7" stroke-width="4"/><line x1="-12" y1="14" x2="14" y2="-22" stroke="#A855F7" stroke-width="5" stroke-linecap="round"/><line x1="12" y1="14" x2="-14" y2="-22" stroke="#A855F7" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="0" r="4" fill="#FACC15" stroke="${S}" stroke-width="2"/><polygon points="0,-28 4,-20 12,-20 6,-14 8,-6 0,-10 -8,-6 -6,-14 -12,-20 -4,-20" fill="#FDE047"/></g>`,
    tags: ["petasa", "enzima", "tijeras", "molecular", "biologia"],
  },
  tijeras_moleculares_mhetasa: {
    id: "tijeras_moleculares_mhetasa",
    name: "Enzima MHETasa Tijeras Nutrientes",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g transform="rotate(30)"><circle cx="-16" cy="22" r="10" fill="none" stroke="#FB923C" stroke-width="4"/><circle cx="16" cy="22" r="10" fill="none" stroke="#FB923C" stroke-width="4"/><line x1="-12" y1="14" x2="14" y2="-22" stroke="#FB923C" stroke-width="5" stroke-linecap="round"/><line x1="12" y1="14" x2="-14" y2="-22" stroke="#FB923C" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="0" r="4" fill="#FACC15" stroke="${S}" stroke-width="2"/><circle cx="18" cy="-24" r="5" fill="#FDE047" stroke="${S}" stroke-width="2"/><circle cx="-18" cy="-24" r="5" fill="#FDE047" stroke="${S}" stroke-width="2"/></g>`,
    tags: ["mhetasa", "enzima", "nutrientes", "molecular", "tijeras"],
  },
  manzana_fresca_rechazada: {
    id: "manzana_fresca_rechazada",
    name: "Manzana Fresca",
    family: "vida_cotidiana",
    defaultPlacement: "left",
    svg: `<path d="M 0 -12 C -24 -22 -26 14 -8 24 C -2 26 2 26 8 24 C 26 14 24 -22 0 -12 Z" fill="#EF4444" stroke="${S}" stroke-width="4"/><path d="M 0 -12 Q 4 -22 10 -24" fill="none" stroke="#78350F" stroke-width="3.5" stroke-linecap="round"/><path d="M 4 -18 Q 14 -24 16 -16 Q 10 -12 4 -18 Z" fill="#22C55E" stroke="${S}" stroke-width="2"/>`,
    tags: ["manzana", "fruta", "comida", "roja", "fresca"],
  },
  correa_paseo_mascota: {
    id: "correa_paseo_mascota",
    name: "Correa de Paseo Canino Adaptada",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<path d="M -20 28 Q 0 0 20 -28" fill="none" stroke="#DC2626" stroke-width="6" stroke-linecap="round"/><rect x="16" y="-36" width="10" height="14" rx="4" fill="#991B1B" stroke="${S}" stroke-width="2.5"/><circle cx="-20" cy="28" r="6" fill="#FACC15" stroke="${S}" stroke-width="2"/>`,
    tags: ["correa", "paseo", "mascota", "perro", "pechera"],
  },
  rueda_auto_deportivo_girando: {
    id: "rueda_auto_deportivo_girando",
    name: "Rueda de Auto Deportivo en Rotación Inversa",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="42" fill="#1E293B" stroke="${S}" stroke-width="6"/><circle cx="0" cy="0" r="30" fill="#E2E8F0" stroke="${S}" stroke-width="4"/><g>${[0, 60, 120, 180, 240, 300].map(a => `<line x1="0" y1="0" x2="${(Math.cos(a*Math.PI/180)*28).toFixed(1)}" y2="${(Math.sin(a*Math.PI/180)*28).toFixed(1)}" stroke="${S}" stroke-width="4"/>`).join("")}</g><circle cx="0" cy="0" r="10" fill="#EF4444" stroke="${S}" stroke-width="3"/><circle cx="0" cy="0" r="4" fill="#FDE047"/>`,
    animatedSvg: (f: number) => {
      // Rotación en reversa aparente (efecto estroboscópico)
      const rotRev = -(f * 2.8) % 360;
      const spokes = [0, 60, 120, 180, 240, 300].map(a => {
        const rad = (a * Math.PI) / 180;
        const x2 = (Math.cos(rad) * 28).toFixed(1);
        const y2 = (Math.sin(rad) * 28).toFixed(1);
        return `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/><circle cx="${(Math.cos(rad)*20).toFixed(1)}" cy="${(Math.sin(rad)*20).toFixed(1)}" r="2.5" fill="#EF4444"/>`;
      }).join("");
      return `<circle cx="0" cy="0" r="44" fill="#0F172A" stroke="${S}" stroke-width="6"/><circle cx="0" cy="0" r="32" fill="#E2E8F0" stroke="${S}" stroke-width="4.5"/><g transform="rotate(${rotRev.toFixed(1)})">${spokes}<circle cx="0" cy="0" r="11" fill="#EF4444" stroke="${S}" stroke-width="3"/><circle cx="0" cy="0" r="4" fill="#FDE047"/></g><path d="M -30 -38 Q 0 -46 30 -38" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.6"/>`;
    },
    tags: ["rueda", "llanta", "auto", "deportivo", "estroboscopico", "rotacion"],
  },
  tira_pelicula_celuloide: {
    id: "tira_pelicula_celuloide",
    name: "Tira de Película Cinematográfica Celuloide",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-46" y="-20" width="92" height="40" rx="4" fill="#0F172A" stroke="${S}" stroke-width="4"/><rect x="-38" y="-12" width="22" height="24" rx="2" fill="#38BDF8" fill-opacity="0.8" stroke="${S}" stroke-width="2"/><rect x="-11" y="-12" width="22" height="24" rx="2" fill="#FDE047" fill-opacity="0.8" stroke="${S}" stroke-width="2"/><rect x="16" y="-12" width="22" height="24" rx="2" fill="#38BDF8" fill-opacity="0.8" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const shiftX = -((f * 2) % 32);
      return `<g transform="translate(${shiftX.toFixed(1)} 0)"><rect x="-60" y="-22" width="120" height="44" rx="5" fill="#0F172A" stroke="${S}" stroke-width="4"/><g fill="#FFFFFF">${[-48, -32, -16, 0, 16, 32, 48].map(px => `<rect x="${px - 4}" y="-19" width="8" height="5" rx="1"/><rect x="${px - 4}" y="14" width="8" height="5" rx="1"/>`).join("")}</g><g>${[-40, -8, 24].map((fx, i) => `<rect x="${fx}" y="-11" width="24" height="22" rx="2" fill="${i % 2 === 0 ? "#38BDF8" : "#FDE047"}" stroke="${S}" stroke-width="2"/><text x="${fx + 12}" y="4" text-anchor="middle" font-size="9" font-weight="900" font-family="'Arial Black', sans-serif" fill="${S}">${(f + i) % 60}</text>`).join("")}</g></g>`;
    },
    tags: ["pelicula", "celuloide", "cine", "fotogramas", "frames"],
  },
  reloj_estroboscopico_circular: {
    id: "reloj_estroboscopico_circular",
    name: "Reloj Estroboscópico de Ilusión Visual",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="40" fill="#FEF08A" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="32" fill="#FFFFFF" stroke="${S}" stroke-width="2"/><text x="0" y="-18" text-anchor="middle" font-size="12" font-weight="900" font-family="'Arial Black', sans-serif" fill="#EF4444">12</text><text x="-16" y="-10" text-anchor="middle" font-size="11" font-weight="900" font-family="'Arial Black', sans-serif" fill="#F59E0B">11</text><text x="-20" y="8" text-anchor="middle" font-size="11" font-weight="900" font-family="'Arial Black', sans-serif" fill="#EAB308">10</text><line x1="0" y1="0" x2="0" y2="-26" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="0" r="4" fill="${S}"/>`,
    animatedSvg: (f: number) => {
      // Salto cíclico entre las 12 (0°), las 11 (-30°) y las 10 (-60°)
      const step = Math.floor((f / 15) % 3);
      const angles = [0, -30, -60];
      const ang = angles[step];
      const rad = (ang * Math.PI) / 180;
      const hx = (Math.sin(rad) * 26).toFixed(1);
      const hy = (-Math.cos(rad) * 26).toFixed(1);
      return `<circle cx="0" cy="0" r="42" fill="#FEF08A" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="34" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/><text x="0" y="-20" text-anchor="middle" font-size="13" font-weight="900" font-family="'Arial Black', sans-serif" fill="${step === 0 ? "#DC2626" : S}">12</text><text x="-18" y="-12" text-anchor="middle" font-size="12" font-weight="900" font-family="'Arial Black', sans-serif" fill="${step === 1 ? "#DC2626" : S}">11</text><text x="-24" y="8" text-anchor="middle" font-size="12" font-weight="900" font-family="'Arial Black', sans-serif" fill="${step === 2 ? "#DC2626" : S}">10</text><line x1="0" y1="0" x2="${hx}" y2="${hy}" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="0" r="5" fill="${S}"/><path d="M 0 -28 A 28 28 0 0 0 -24 6" fill="none" stroke="#DC2626" stroke-width="3" stroke-dasharray="4 3"/>`;
    },
    tags: ["reloj", "estroboscopico", "esfera", "manecilla", "angulo"],
  },
  puntero_docente_laser: {
    id: "puntero_docente_laser",
    name: "Puntero Telescópico con Marcador Rojo",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<line x1="-20" y1="28" x2="24" y2="-28" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/><rect x="-24" y="22" width="10" height="14" rx="3" fill="#1E293B" stroke="${S}" stroke-width="2.5"/><circle cx="24" cy="-28" r="5" fill="#EF4444" stroke="${S}" stroke-width="2"/><line x1="24" y1="-28" x2="36" y2="-42" stroke="#EF4444" stroke-width="2.5" stroke-dasharray="3 3"/>`,
    tags: ["puntero", "vara", "docente", "laser", "explicacion"],
  },
  helicoptero_rotor_animado: {
    id: "helicoptero_rotor_animado",
    name: "Helicóptero de Rescate con Rotor Dinámico",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-34" y="-8" width="58" height="26" rx="12" fill="#F59E0B" stroke="${S}" stroke-width="4.5"/><polygon points="24,-2 46,2 46,8 24,6" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/><rect x="42" y="-12" width="6" height="24" rx="2" fill="#EF4444" stroke="${S}" stroke-width="2"/><path d="M -30 -4 Q -16 -8 -12 8 L -30 8 Z" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/><line x1="-10" y1="-8" x2="-10" y2="-18" stroke="${S}" stroke-width="4"/><line x1="-48" y1="-18" x2="28" y2="-18" stroke="${S}" stroke-width="5" stroke-linecap="round"/><line x1="-26" y1="22" x2="16" y2="22" stroke="${S}" stroke-width="4" stroke-linecap="round"/><line x1="-20" y1="18" x2="-20" y2="22" stroke="${S}" stroke-width="3"/><line x1="10" y1="18" x2="10" y2="22" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      // Rotación de aspas: fase de aceleración y luego reversa estroboscópica aparente
      const bladeRot = (f * 32) % 360;
      const bladeScaleX = Math.cos((bladeRot * Math.PI) / 180);
      return `<rect x="-34" y="-4" width="60" height="26" rx="12" fill="#F59E0B" stroke="${S}" stroke-width="4.5"/><polygon points="26,0 48,4 48,10 26,8" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/><rect x="44" y="-10" width="6" height="22" rx="2" fill="#EF4444" stroke="${S}" stroke-width="2.5"/><path d="M -30 0 Q -16 -6 -12 8 L -30 8 Z" fill="#38BDF8" stroke="${S}" stroke-width="3"/><line x1="-8" y1="-4" x2="-8" y2="-16" stroke="${S}" stroke-width="5"/><g transform="translate(-8, -16) scale(${bladeScaleX.toFixed(2)}, 1)"><line x1="-50" y1="0" x2="50" y2="0" stroke="#0F172A" stroke-width="6" stroke-linecap="round"/><circle cx="0" cy="0" r="4.5" fill="#EF4444"/></g><line x1="-26" y1="24" x2="18" y2="24" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/><line x1="-18" y1="20" x2="-18" y2="24" stroke="${S}" stroke-width="3.5"/><line x1="10" y1="20" x2="10" y2="24" stroke="${S}" stroke-width="3.5"/>`;
    },
    tags: ["helicoptero", "rotor", "aspas", "aeronautica", "vuelo"],
  },
  camara_tripode_visor_lcd: {
    id: "camara_tripode_visor_lcd",
    name: "Cámara Digital Profesional en Trípode",
    family: "tecnologia",
    defaultPlacement: "left",
    svg: `<rect x="-24" y="-20" width="44" height="28" rx="6" fill="#1E293B" stroke="${S}" stroke-width="4.5"/><rect x="20" y="-16" width="12" height="20" rx="3" fill="#0F172A" stroke="${S}" stroke-width="3"/><rect x="-42" y="-18" width="18" height="24" rx="3" fill="#22C55E" stroke="${S}" stroke-width="3"/><line x1="-2" y1="8" x2="-2" y2="18" stroke="${S}" stroke-width="5"/><line x1="-2" y1="18" x2="-22" y2="44" stroke="${S}" stroke-width="4" stroke-linecap="round"/><line x1="-2" y1="18" x2="18" y2="44" stroke="${S}" stroke-width="4" stroke-linecap="round"/><line x1="-2" y1="18" x2="-2" y2="44" stroke="${S}" stroke-width="4" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const recBlink = Math.sin(f / 4) > 0;
      return `<rect x="-24" y="-20" width="44" height="28" rx="6" fill="#1E293B" stroke="${S}" stroke-width="4.5"/><rect x="20" y="-16" width="12" height="20" rx="3" fill="#0F172A" stroke="${S}" stroke-width="3"/><rect x="-44" y="-18" width="20" height="24" rx="3" fill="#020617" stroke="${S}" stroke-width="3"/><rect x="-42" y="-16" width="16" height="20" fill="#22C55E" opacity="0.85"/><circle cx="-2" cy="-6" r="3" fill="${recBlink ? "#EF4444" : "#7F1D1D"}"/><line x1="-2" y1="8" x2="-2" y2="18" stroke="${S}" stroke-width="5"/><line x1="-2" y1="18" x2="-24" y2="44" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/><line x1="-2" y1="18" x2="20" y2="44" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/><line x1="-2" y1="18" x2="-2" y2="44" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/>`;
    },
    tags: ["camara", "tripode", "shutter", "lcd", "obturador", "60fps"],
  },
  ventilador_pedestal_aspas: {
    id: "ventilador_pedestal_aspas",
    name: "Ventilador de Pedestal con Aspas Rápidas",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="-16" r="30" fill="none" stroke="${S}" stroke-width="5"/><circle cx="0" cy="-16" r="24" fill="#E0F2FE" fill-opacity="0.3" stroke="${S}" stroke-width="2"/><g transform="translate(0, -16)">${[0, 120, 240].map(a => `<ellipse cx="${(Math.cos(a*Math.PI/180)*14).toFixed(1)}" cy="${(Math.sin(a*Math.PI/180)*14).toFixed(1)}" rx="12" ry="6" transform="rotate(${a})" fill="#38BDF8" stroke="${S}" stroke-width="2"/>`).join("")}</g><circle cx="0" cy="-16" r="5" fill="#EF4444" stroke="${S}" stroke-width="2"/><line x1="0" y1="14" x2="0" y2="44" stroke="${S}" stroke-width="6"/><ellipse cx="0" cy="44" rx="20" ry="6" fill="#64748B" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      // Rotación rápida de aspas (estroboscópico a 24 deg/frame)
      const fanRot = (f * 24) % 360;
      return `<circle cx="0" cy="-16" r="32" fill="none" stroke="${S}" stroke-width="5"/><circle cx="0" cy="-16" r="26" fill="#E0F2FE" fill-opacity="0.4" stroke="${S}" stroke-width="2"/><g transform="translate(0, -16) rotate(${fanRot})">${[0, 120, 240].map(a => {
        const rad = (a * Math.PI) / 180;
        const bx = (Math.cos(rad) * 14).toFixed(1);
        const by = (Math.sin(rad) * 14).toFixed(1);
        return `<ellipse cx="${bx}" cy="${by}" rx="13" ry="6.5" transform="rotate(${a} ${bx} ${by})" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>`;
      }).join("")}<circle cx="0" cy="0" r="5.5" fill="#EF4444" stroke="${S}" stroke-width="2.5"/></g><line x1="0" y1="16" x2="0" y2="44" stroke="${S}" stroke-width="6.5"/><ellipse cx="0" cy="44" rx="22" ry="7" fill="#475569" stroke="${S}" stroke-width="3.5"/>`;
    },
    tags: ["ventilador", "pedestal", "aspas", "aire", "estroboscopico"],
  },
  stickman_ojos_mareo_espiral: {
    id: "stickman_ojos_mareo_espiral",
    name: "Ojos en Espiral de Mareo con Estrellitas",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<g transform="translate(-16, -10)"><circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/><path d="M 0 0 Q 6 -6 8 0 Q 10 8 0 8 Q -10 8 -8 -4 Q -6 -12 4 -10" fill="none" stroke="${S}" stroke-width="2.5"/></g><g transform="translate(16, -10)"><circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/><path d="M 0 0 Q -6 -6 -8 0 Q -10 8 0 8 Q 10 8 8 -4 Q 6 -12 -4 -10" fill="none" stroke="${S}" stroke-width="2.5"/></g><polygon points="0,-32 4,-24 12,-24 6,-18 8,-10 0,-14 -8,-10 -6,-18 -12,-24 -4,-24" fill="#FDE047" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const rotL = (f * 10) % 360;
      const rotR = (-f * 10) % 360;
      const starRot = (f * 6) % 360;
      return `<g transform="translate(-16, -8)"><circle cx="0" cy="0" r="15" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/><g transform="rotate(${rotL})"><path d="M 0 0 Q 5 -5 6 0 Q 8 6 0 7 Q -8 7 -6 -3 Q -4 -9 3 -8" fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round"/></g></g><g transform="translate(16, -8)"><circle cx="0" cy="0" r="15" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/><g transform="rotate(${rotR})"><path d="M 0 0 Q -5 -5 -6 0 Q -8 6 0 7 Q 8 7 6 -3 Q 4 -9 -3 -8" fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round"/></g></g><g transform="translate(0, -36) rotate(${starRot})">${[0, 120, 240].map(a => {
        const rad = (a * Math.PI) / 180;
        const sx = (Math.cos(rad) * 24).toFixed(1);
        const sy = (Math.sin(rad) * 10).toFixed(1);
        return `<polygon points="${sx},${(Number(sy)-8).toFixed(1)} ${(Number(sx)+3).toFixed(1)},${(Number(sy)-2).toFixed(1)} ${(Number(sx)+8).toFixed(1)},${(Number(sy)-2).toFixed(1)} ${(Number(sx)+4).toFixed(1)},${(Number(sy)+2).toFixed(1)} ${(Number(sx)+6).toFixed(1)},${(Number(sy)+8).toFixed(1)} ${sx},${(Number(sy)+4).toFixed(1)} ${(Number(sx)-6).toFixed(1)},${(Number(sy)+8).toFixed(1)} ${(Number(sx)-4).toFixed(1)},${(Number(sy)+2).toFixed(1)} ${(Number(sx)-8).toFixed(1)},${(Number(sy)-2).toFixed(1)} ${(Number(sx)-3).toFixed(1)},${(Number(sy)-2).toFixed(1)}" fill="#FDE047" stroke="${S}" stroke-width="2"/>`;
      }).join("")}</g>`;
    },
    tags: ["ojos", "mareo", "espiral", "estrellas", "caricatura", "humor"],
  },
  pajaro_petrificado_caliza: {
    id: "pajaro_petrificado_caliza",
    name: "Pájaro Petrificado en Caliza y Sal",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<path d="M -24 16 C -34 6 -28 -14 -12 -18 C 8 -22 28 -8 32 8 C 34 18 20 28 6 28 C -10 28 -18 22 -24 16 Z" fill="#94A3B8" stroke="${S}" stroke-width="4.5"/><polygon points="28,2 44,8 26,14" fill="#64748B" stroke="${S}" stroke-width="2.5"/><circle cx="18" cy="-2" r="5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/><circle cx="18" cy="-2" r="2.5" fill="#0F172A"/><path d="M -18 8 Q -6 18 10 12" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" fill="none"/><line x1="-8" y1="28" x2="-8" y2="38" stroke="${S}" stroke-width="4"/><line x1="8" y1="28" x2="8" y2="38" stroke="${S}" stroke-width="4"/><rect x="-30" y="34" width="60" height="10" rx="3" fill="#78350F" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const glint = Math.sin(f / 6) > 0.6 ? 0.9 : 0.3;
      return `<path d="M -24 16 C -34 6 -28 -14 -12 -18 C 8 -22 28 -8 32 8 C 34 18 20 28 6 28 C -10 28 -18 22 -24 16 Z" fill="#94A3B8" stroke="${S}" stroke-width="4.5"/><polygon points="28,2 44,8 26,14" fill="#64748B" stroke="${S}" stroke-width="2.5"/><circle cx="18" cy="-2" r="5.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/><circle cx="18" cy="-2" r="2.5" fill="#0F172A"/><polygon points="12,-10 16,-14 20,-10 16,-6" fill="#FDE047" opacity="${glint}"/><path d="M -18 8 Q -6 18 10 12" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" fill="none"/><line x1="-8" y1="28" x2="-8" y2="38" stroke="${S}" stroke-width="4"/><line x1="8" y1="28" x2="8" y2="38" stroke="${S}" stroke-width="4"/><rect x="-32" y="34" width="64" height="12" rx="4" fill="#78350F" stroke="${S}" stroke-width="3.5"/><circle cx="2" cy="18" r="3" fill="#E2E8F0"/><circle cx="-12" cy="6" r="2.5" fill="#E2E8F0"/>`;
    },
    tags: ["pajaro", "petrificado", "caliza", "sal", "estatua", "natron"],
  },
  tira_ph_morado_caustico: {
    id: "tira_ph_morado_caustico",
    name: "Tira de pH Cáustico con Termómetro",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-10" y="-36" width="20" height="72" rx="4" fill="#FEF08A" stroke="${S}" stroke-width="4"/><rect x="-10" y="8" width="20" height="28" rx="2" fill="#A855F7" stroke="${S}" stroke-width="2.5"/><text x="0" y="26" text-anchor="middle" font-size="9" font-weight="900" font-family="'Arial Black', sans-serif" fill="#FFFFFF">12</text><line x1="-16" y1="-42" x2="-6" y2="-32" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/><line x1="16" y1="-42" x2="6" y2="-32" stroke="#94A3B8" stroke-width="4" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const pulseHiss = Math.sin(f * 2) * 2;
      return `<g transform="translate(0 ${pulseHiss})"><rect x="-12" y="-36" width="24" height="72" rx="4" fill="#FEF08A" stroke="${S}" stroke-width="4.5"/><rect x="-12" y="6" width="24" height="30" rx="3" fill="#9333EA" stroke="${S}" stroke-width="3"/><text x="0" y="25" text-anchor="middle" font-size="11" font-weight="900" font-family="'Arial Black', sans-serif" fill="#FFFFFF">pH 12</text><circle cx="16" cy="22" r="5" fill="#EF4444" stroke="${S}" stroke-width="2"/><text x="28" y="26" font-size="9" font-weight="900" font-family="'Arial Black', sans-serif" fill="#EF4444">60°C</text></g>`;
    },
    tags: ["ph", "alcalino", "laboratorio", "quimica", "termometro"],
  },
  sarcofago_egipcio_natron: {
    id: "sarcofago_egipcio_natron",
    name: "Sarcófago Egipcio con Sal de Natrón",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<path d="M -22 -34 L 22 -34 L 26 -14 L 16 34 L -16 34 L -26 -14 Z" fill="#FACC15" stroke="${S}" stroke-width="4.5"/><circle cx="0" cy="-22" r="10" fill="#FDE047" stroke="${S}" stroke-width="2.5"/><rect x="-18" y="-34" width="36" height="8" fill="#1D4ED8"/><line x1="-16" y1="-8" x2="16" y2="-8" stroke="#1D4ED8" stroke-width="4"/><line x1="-12" y1="8" x2="12" y2="8" stroke="#1D4ED8" stroke-width="4"/><circle cx="-4" cy="-22" r="2" fill="${S}"/><circle cx="4" cy="-22" r="2" fill="${S}"/><path d="M -3 -16 Q 0 -13 3 -16" stroke="${S}" stroke-width="2" fill="none"/>`,
    animatedSvg: (f: number) => {
      const wink = Math.sin(f / 8) > 0.5;
      return `<path d="M -24 -36 L 24 -36 L 28 -14 L 18 36 L -18 36 L -28 -14 Z" fill="#FACC15" stroke="${S}" stroke-width="4.5"/><circle cx="0" cy="-22" r="11" fill="#FDE047" stroke="${S}" stroke-width="2.5"/><rect x="-20" y="-36" width="40" height="8" fill="#1D4ED8"/><line x1="-18" y1="-8" x2="18" y2="-8" stroke="#1D4ED8" stroke-width="4.5"/><line x1="-14" y1="8" x2="14" y2="8" stroke="#1D4ED8" stroke-width="4.5"/><circle cx="-5" cy="-22" r="2" fill="${S}"/>${wink ? `<line x1="3" y1="-22" x2="7" y2="-22" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>` : `<circle cx="5" cy="-22" r="2" fill="${S}"/>`}<path d="M -3 -15 Q 0 -11 3 -15" stroke="${S}" stroke-width="2.5" fill="none"/><g transform="translate(0, 22)"><circle cx="-6" cy="0" r="3.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/><circle cx="6" cy="0" r="3.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/><circle cx="0" cy="-4" r="3.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/></g>`;
    },
    tags: ["sarcofago", "momia", "egipto", "natron", "faraon"],
  },
  silueta_ave_impacto_agua: {
    id: "silueta_ave_impacto_agua",
    name: "Ave en Choque contra Espejo de Agua",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g transform="rotate(45)"><path d="M 0 -24 L 8 0 L 28 8 L 8 16 L 0 32 L -8 16 L -28 8 L -8 0 Z" fill="#1E293B" stroke="${S}" stroke-width="4"/><circle cx="0" cy="0" r="16" fill="none" stroke="#EF4444" stroke-width="3" stroke-dasharray="4 3"/></g>`,
    animatedSvg: (f: number) => {
      const dropY = Math.sin(f / 4) * 4;
      return `<g transform="translate(0 ${dropY}) rotate(35)"><path d="M 0 -24 L 8 0 L 28 8 L 8 16 L 0 32 L -8 16 L -28 8 L -8 0 Z" fill="#0F172A" stroke="${S}" stroke-width="4.5"/><circle cx="0" cy="0" r="18" fill="none" stroke="#DC2626" stroke-width="4" stroke-dasharray="6 4"/><text x="14" y="-12" font-size="9" font-weight="900" font-family="'Arial Black', sans-serif" fill="#38BDF8">H₂O</text></g>`;
    },
    tags: ["ave", "impacto", "choque", "deshidratacion", "agua"],
  },
  lupa_inspeccion_fosil: {
    id: "lupa_inspeccion_fosil",
    name: "Lupa de Explorador Fósil",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="-4" cy="-4" r="26" fill="#BAE6FD" fill-opacity="0.5" stroke="${S}" stroke-width="5"/><circle cx="-4" cy="-4" r="20" fill="none" stroke="#FDE047" stroke-width="3"/><line x1="14" y1="14" x2="34" y2="34" stroke="#78350F" stroke-width="8" stroke-linecap="round"/><line x1="14" y1="14" x2="34" y2="34" stroke="${S}" stroke-width="3" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const glintX = Math.sin(f / 5) * 6;
      return `<circle cx="-4" cy="-4" r="28" fill="#BAE6FD" fill-opacity="0.6" stroke="${S}" stroke-width="5.5"/><circle cx="-4" cy="-4" r="22" fill="none" stroke="#FACC15" stroke-width="3.5"/><polygon points="-12,-12 -8,-4 -4,-12 -8,-16" fill="#FFFFFF" opacity="0.8" transform="translate(${glintX} 0)"/><line x1="16" y1="16" x2="36" y2="36" stroke="#92400E" stroke-width="9" stroke-linecap="round"/><line x1="16" y1="16" x2="36" y2="36" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>`;
    },
    tags: ["lupa", "inspeccion", "fosil", "aumento", "cristal"],
  },
  flamenco_rosado_elegante: {
    id: "flamenco_rosado_elegante",
    name: "Flamenco Rosado Inmune al Natrón",
    family: "naturaleza_alimentos",
    defaultPlacement: "left",
    svg: `<ellipse cx="0" cy="-6" rx="28" ry="18" fill="#FB7185" stroke="${S}" stroke-width="4.5"/><path d="M 18 -12 Q 32 -32 20 -52 Q 12 -64 24 -72" fill="none" stroke="#FB7185" stroke-width="9" stroke-linecap="round"/><circle cx="26" cy="-72" r="10" fill="#FB7185" stroke="${S}" stroke-width="3"/><path d="M 32 -74 Q 44 -74 40 -60" fill="none" stroke="#000000" stroke-width="5.5" stroke-linecap="round"/><circle cx="28" cy="-74" r="2" fill="#000000"/><line x1="-6" y1="12" x2="-6" y2="44" stroke="${S}" stroke-width="4"/><line x1="8" y1="12" x2="8" y2="44" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const neckBob = Math.sin(f / 8) * 4;
      return `<ellipse cx="0" cy="-6" rx="30" ry="19" fill="#FB7185" stroke="${S}" stroke-width="5"/><path d="M 20 -12 Q 34 -32 22 -52 Q ${14 + neckBob} -64 ${26 + neckBob} -72" fill="none" stroke="#FB7185" stroke-width="10" stroke-linecap="round"/><circle cx="${28 + neckBob}" cy="-72" r="11" fill="#FB7185" stroke="${S}" stroke-width="3"/><path d="M ${34 + neckBob} -74 Q ${46 + neckBob} -74 ${42 + neckBob} -60" fill="none" stroke="#000000" stroke-width="6" stroke-linecap="round"/><circle cx="${30 + neckBob}" cy="-74" r="2.5" fill="#000000"/><line x1="-6" y1="12" x2="-6" y2="46" stroke="${S}" stroke-width="4.5"/><line x1="8" y1="12" x2="8" y2="46" stroke="${S}" stroke-width="4.5"/><ellipse cx="1" cy="46" rx="16" ry="4" fill="#38BDF8" opacity="0.6"/>`;
    },
    tags: ["flamenco", "ave", "rosado", "natron", "inmune", "tanzania"],
  },
  botas_hule_amarillas: {
    id: "botas_hule_amarillas",
    name: "Botas de Hule Amarillas de Expedición",
    family: "vida_cotidiana",
    defaultPlacement: "overhead",
    svg: `<path d="M -16 -24 L -4 -24 L -4 14 L 14 14 L 14 26 L -16 26 Z" fill="#FACC15" stroke="${S}" stroke-width="4" stroke-linejoin="round"/><rect x="-18" y="22" width="34" height="6" rx="2" fill="#0F172A"/>`,
    tags: ["botas", "hule", "amarillo", "expedicion", "impermeable"],
  },
  vortice_ant_mill_anillo: {
    id: "vortice_ant_mill_anillo",
    name: "Vórtice Circular de Hormigas (Ant Mill)",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="38" fill="none" stroke="${S}" stroke-width="12" stroke-dasharray="14 10"/><circle cx="0" cy="0" r="24" fill="none" stroke="${S}" stroke-width="8" stroke-dasharray="10 8"/><circle cx="0" cy="0" r="12" fill="#1C1917"/>`,
    animatedSvg: (f: number) => {
      const rot = (f * 3.6) % 360;
      return `<g transform="rotate(${rot.toFixed(1)})"><circle cx="0" cy="0" r="40" fill="none" stroke="#0F172A" stroke-width="14" stroke-dasharray="16 12"/><circle cx="0" cy="0" r="26" fill="none" stroke="#1E293B" stroke-width="10" stroke-dasharray="12 8"/><circle cx="0" cy="0" r="12" fill="#052E16"/><circle cx="28" cy="0" r="3" fill="#FDE047"/><circle cx="-28" cy="0" r="3" fill="#FDE047"/></g>`;
    },
    tags: ["vortice", "hormigas", "ant_mill", "molino", "espiral"],
  },
  ramita_bloqueo_hormigas: {
    id: "ramita_bloqueo_hormigas",
    name: "Ramita de Bloqueo con Hormigas Trepadoras",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="-38" x2="0" y2="38" stroke="#78350F" stroke-width="7" stroke-linecap="round"/><line x1="0" y1="-10" x2="16" y2="-22" stroke="#78350F" stroke-width="5" stroke-linecap="round"/><circle cx="4" cy="-8" r="4.5" fill="#0F172A"/><circle cx="-4" cy="14" r="4.5" fill="#0F172A"/><circle cx="8" cy="-16" r="4" fill="#0F172A"/>`,
    animatedSvg: (f: number) => {
      const crawlY = ((f * 1.5) % 36) - 18;
      return `<line x1="0" y1="-40" x2="0" y2="40" stroke="#78350F" stroke-width="8" stroke-linecap="round"/><line x1="0" y1="-12" x2="18" y2="-24" stroke="#78350F" stroke-width="5" stroke-linecap="round"/><circle cx="4" cy="${crawlY.toFixed(1)}" r="5" fill="#0F172A" stroke="${S}" stroke-width="1.5"/><circle cx="-4" cy="${(-crawlY).toFixed(1)}" r="5" fill="#0F172A" stroke="${S}" stroke-width="1.5"/>`;
    },
    tags: ["ramita", "madera", "hormiga", "trepar", "bloqueo"],
  },
  lampara_tactica_explorador: {
    id: "lampara_tactica_explorador",
    name: "Lámpara Táctica Militar de Exploración",
    family: "tecnologia",
    defaultPlacement: "left",
    svg: `<rect x="-18" y="-12" width="36" height="24" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/><polygon points="18,-18 34,-24 34,24 18,18" fill="#0F172A" stroke="${S}" stroke-width="3"/><polygon points="34,-18 52,-32 52,32 34,18" fill="#FEF08A" opacity="0.6"/>`,
    animatedSvg: (f: number) => {
      const glint = Math.sin(f / 4) > 0.5 ? 0.75 : 0.5;
      return `<rect x="-18" y="-12" width="36" height="24" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4.5"/><polygon points="18,-18 34,-24 34,24 18,18" fill="#0F172A" stroke="${S}" stroke-width="3.5"/><polygon points="34,-18 54,-34 54,34 34,18" fill="#FEF08A" opacity="${glint}"/><line x1="34" y1="0" x2="52" y2="0" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>`;
    },
    tags: ["lampara", "linterna", "tactica", "luz", "explorador"],
  },
  hormiga_legionaria_cabeza_macro: {
    id: "hormiga_legionaria_cabeza_macro",
    name: "Cabeza Macro de Hormiga Legionaria",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M -24 10 C -34 -14 -18 -32 0 -32 C 18 -32 34 -14 24 10 C 18 24 -18 24 -24 10 Z" fill="#78350F" stroke="${S}" stroke-width="4.5"/><path d="M -16 16 Q -26 34 -10 38" fill="none" stroke="#FDE047" stroke-width="4.5" stroke-linecap="round"/><path d="M 16 16 Q 26 34 10 38" fill="none" stroke="#FDE047" stroke-width="4.5" stroke-linecap="round"/><circle cx="-14" cy="-8" r="3" fill="#000000"/><circle cx="14" cy="-8" r="3" fill="#000000"/><path d="M -10 -28 Q -24 -46 -36 -40" fill="none" stroke="${S}" stroke-width="4" stroke-linecap="round"/><path d="M 10 -28 Q 24 -46 36 -40" fill="none" stroke="${S}" stroke-width="4" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const wiggleAntenna = Math.sin(f / 5) * 6;
      return `<path d="M -24 10 C -34 -14 -18 -32 0 -32 C 18 -32 34 -14 24 10 C 18 24 -18 24 -24 10 Z" fill="#78350F" stroke="${S}" stroke-width="4.5"/><path d="M -16 16 Q -28 34 -10 38" fill="none" stroke="#FDE047" stroke-width="5" stroke-linecap="round"/><path d="M 16 16 Q 28 34 10 38" fill="none" stroke="#FDE047" stroke-width="5" stroke-linecap="round"/><circle cx="-14" cy="-8" r="3.5" fill="#000000"/><circle cx="14" cy="-8" r="3.5" fill="#000000"/><path d="M -10 -28 Q ${-24 + wiggleAntenna} -46 ${-38 + wiggleAntenna} -40" fill="none" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/><path d="M 10 -28 Q ${24 - wiggleAntenna} -46 ${38 - wiggleAntenna} -40" fill="none" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/>`;
    },
    tags: ["hormiga", "cabeza", "mandibula", "antenas", "macro", "ciega"],
  },
  estela_feromona_vector_verde: {
    id: "estela_feromona_vector_verde",
    name: "Estela Química de Feromona Neón",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M -40 0 Q -20 -24 0 0 Q 20 24 40 0" fill="none" stroke="#22C55E" stroke-width="8" stroke-linecap="round"/><circle cx="-20" cy="-12" r="4" fill="#86EFAC"/><circle cx="20" cy="12" r="4" fill="#86EFAC"/>`,
    animatedSvg: (f: number) => {
      const pulse = 0.7 + 0.3 * Math.sin(f / 4);
      return `<path d="M -44 0 Q -22 -26 0 0 Q 22 26 44 0" fill="none" stroke="#22C55E" stroke-width="10" stroke-linecap="round" opacity="${pulse.toFixed(2)}"/><path d="M -44 0 Q -22 -26 0 0 Q 22 26 44 0" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><circle cx="-22" cy="-13" r="5" fill="#FDE047"/><circle cx="22" cy="13" r="5" fill="#FDE047"/>`;
    },
    tags: ["feromona", "quimica", "estela", "rastro", "verde", "neon"],
  },
  atomizador_spray_jabon: {
    id: "atomizador_spray_jabon",
    name: "Atomizador de Agua y Jabón",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<rect x="-14" y="-10" width="28" height="48" rx="8" fill="#38BDF8" stroke="${S}" stroke-width="4"/><path d="M -6 -10 L -6 -24 L 14 -24 L 14 -16 L 4 -16 L 4 -10 Z" fill="#0284C7" stroke="${S}" stroke-width="3"/><circle cx="22" cy="-20" r="4" fill="#FFFFFF" stroke="${S}" stroke-width="2"/><circle cx="30" cy="-26" r="6" fill="#E0F2FE" opacity="0.8"/>`,
    animatedSvg: (f: number) => {
      const sprayPuff = (f * 3) % 24;
      return `<rect x="-14" y="-8" width="28" height="48" rx="8" fill="#38BDF8" stroke="${S}" stroke-width="4.5"/><path d="M -6 -8 L -6 -24 L 14 -24 L 14 -16 L 4 -16 L 4 -8 Z" fill="#0284C7" stroke="${S}" stroke-width="3.5"/><circle cx="${22 + sprayPuff}" cy="-22" r="4" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/><circle cx="${30 + sprayPuff}" cy="-28" r="6" fill="#E0F2FE" opacity="0.85"/><circle cx="${26 + sprayPuff}" cy="-16" r="5" fill="#F8FAFC" opacity="0.85"/>`;
    },
    tags: ["atomizador", "spray", "jabon", "burbujas", "espuma", "corte"],
  },
  megacristal_selenita_columna: {
    id: "megacristal_selenita_columna",
    name: "Columna Monumental de Selenita",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<polygon points="-16,-46 16,-46 24,46 -24,46" fill="#F8FAFC" stroke="${S}" stroke-width="4.5"/><polygon points="-16,-46 0,-46 4,46 -24,46" fill="#FFFFFF" opacity="0.9"/><line x1="0" y1="-46" x2="4" y2="46" stroke="${S}" stroke-width="3"/><polygon points="0,-20 18,-15 12,15 0,10" fill="#E2E8F0" opacity="0.6"/>`,
    animatedSvg: (f: number) => {
      const glint = 0.5 + 0.5 * Math.sin(f / 8);
      return `<polygon points="-16,-46 16,-46 24,46 -24,46" fill="#F8FAFC" stroke="${S}" stroke-width="4.5"/><polygon points="-16,-46 0,-46 4,46 -24,46" fill="#FFFFFF" opacity="0.95"/><line x1="0" y1="-46" x2="4" y2="46" stroke="${S}" stroke-width="3"/><polygon points="0,-20 18,-15 12,15 0,10" fill="#E2E8F0" opacity="0.7"/><circle cx="6" cy="${(-25 + (f * 2) % 60).toFixed(1)}" r="4" fill="#FFFFFF" opacity="${glint.toFixed(2)}"/>`;
    },
    tags: ["cristal", "selenita", "viga", "naica", "colosal", "mineral", "yeso"],
  },
  casco_minero_linterna: {
    id: "casco_minero_linterna",
    name: "Casco Minero con Linterna Frontal",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<ellipse cx="0" cy="-6" rx="26" ry="16" fill="#FACC15" stroke="${S}" stroke-width="4"/><rect x="-30" y="4" width="60" height="8" rx="4" fill="#EAB308" stroke="${S}" stroke-width="3"/><rect x="18" y="-12" width="12" height="14" rx="3" fill="#1E293B" stroke="${S}" stroke-width="3"/><polygon points="30,-14 65,-28 65,6 30,-6" fill="#FEF08A" opacity="0.65"/>`,
    animatedSvg: (f: number) => {
      const beamFlicker = 0.6 + 0.3 * Math.sin(f / 5);
      return `<ellipse cx="0" cy="-6" rx="26" ry="16" fill="#FACC15" stroke="${S}" stroke-width="4.5"/><rect x="-30" y="4" width="60" height="8" rx="4" fill="#EAB308" stroke="${S}" stroke-width="3.5"/><rect x="18" y="-12" width="12" height="14" rx="3" fill="#1E293B" stroke="${S}" stroke-width="3.5"/><polygon points="30,-14 70,-30 70,8 30,-6" fill="#FEF08A" opacity="${beamFlicker.toFixed(2)}"/><circle cx="28" cy="-5" r="3.5" fill="#FFFFFF"/>`;
    },
    tags: ["casco", "minero", "linterna", "mina", "naica", "seguridad", "luz"],
  },
  diagrama_pulmones_condensacion: {
    id: "diagrama_pulmones_condensacion",
    name: "Diagrama Biológico Pulmones con Condensación",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-4" y="-46" width="8" height="20" rx="3" fill="#F43F5E" stroke="${S}" stroke-width="3"/><path d="M -4 -26 C -26 -22 -32 -2 -22 18 C -14 26 -4 14 -4 0 Z" fill="#E11D48" stroke="${S}" stroke-width="4"/><path d="M 4 -26 C 26 -22 32 -2 22 18 C 14 26 4 14 4 0 Z" fill="#E11D48" stroke="${S}" stroke-width="4"/><circle cx="-14" cy="4" r="5" fill="#38BDF8" stroke="${S}" stroke-width="2"/><circle cx="14" cy="6" r="5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const dropY = ((f * 3) % 24) - 10;
      return `<rect x="-4" y="-46" width="8" height="20" rx="3" fill="#F43F5E" stroke="${S}" stroke-width="3.5"/><path d="M -4 -26 C -26 -22 -32 -2 -22 18 C -14 26 -4 14 -4 0 Z" fill="#E11D48" stroke="${S}" stroke-width="4"/><path d="M 4 -26 C 26 -22 32 -2 22 18 C 14 26 4 14 4 0 Z" fill="#E11D48" stroke="${S}" stroke-width="4"/><path d="M -20 10 Q -12 6 -6 12 Q -12 24 -20 18 Z" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/><path d="M 6 12 Q 12 6 20 10 Q 20 18 12 24 Z" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/><circle cx="-14" cy="${dropY.toFixed(1)}" r="4.5" fill="#38BDF8" stroke="${S}" stroke-width="1.5"/><circle cx="14" cy="${(dropY * 0.8).toFixed(1)}" r="4.5" fill="#38BDF8" stroke="${S}" stroke-width="1.5"/>`;
    },
    tags: ["pulmones", "condensacion", "organo", "respirar", "agua", "ahogo", "alveolos"],
  },
  lata_refresco_condensando: {
    id: "lata_refresco_condensando",
    name: "Lata Helada con Condensación",
    family: "vida_cotidiana",
    defaultPlacement: "left",
    svg: `<rect x="-18" y="-28" width="36" height="56" rx="8" fill="#0284C7" stroke="${S}" stroke-width="4"/><ellipse cx="0" cy="-28" rx="18" ry="6" fill="#38BDF8" stroke="${S}" stroke-width="3"/><ellipse cx="0" cy="28" rx="18" ry="6" fill="#0369A1" stroke="${S}" stroke-width="3"/><circle cx="-8" cy="-6" r="3.5" fill="#E0F2FE" stroke="${S}" stroke-width="1.5"/><circle cx="6" cy="8" r="4" fill="#E0F2FE" stroke="${S}" stroke-width="1.5"/>`,
    animatedSvg: (f: number) => {
      const dropSlide = ((f * 2) % 30) - 15;
      return `<rect x="-18" y="-28" width="36" height="56" rx="8" fill="#0284C7" stroke="${S}" stroke-width="4.5"/><ellipse cx="0" cy="-28" rx="18" ry="6" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/><ellipse cx="0" cy="28" rx="18" ry="6" fill="#0369A1" stroke="${S}" stroke-width="3.5"/><circle cx="-8" cy="${dropSlide.toFixed(1)}" r="4" fill="#E0F2FE" stroke="${S}" stroke-width="1.5"/><circle cx="7" cy="${(dropSlide * 1.2).toFixed(1)}" r="4" fill="#E0F2FE" stroke="${S}" stroke-width="1.5"/><line x1="-8" y1="-22" x2="-8" y2="18" stroke="#38BDF8" stroke-width="2" stroke-dasharray="3 3"/>`;
    },
    tags: ["lata", "refresco", "fria", "condensacion", "gotas", "hielo"],
  },
  medidores_58c_humedad_sobrecarga: {
    id: "medidores_58c_humedad_sobrecarga",
    name: "Medidor Dual 58°C y 95% Humedad Sobrecarga",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-38" y="-20" width="76" height="40" rx="8" fill="#1E293B" stroke="${S}" stroke-width="4"/><circle cx="-18" cy="0" r="14" fill="#F8FAFC" stroke="${S}" stroke-width="3"/><line x1="-18" y1="0" x2="-8" y2="-8" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="0" r="14" fill="#F8FAFC" stroke="${S}" stroke-width="3"/><line x1="18" y1="0" x2="28" y2="-6" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="-14" r="3" fill="#EF4444"/>`,
    animatedSvg: (f: number) => {
      const needleWiggle = Math.sin(f / 2) * 3;
      const redFlash = f % 16 < 8 ? "#EF4444" : "#7F1D1D";
      return `<rect x="-38" y="-20" width="76" height="40" rx="8" fill="#1E293B" stroke="${S}" stroke-width="4.5"/><circle cx="-18" cy="0" r="14" fill="#F8FAFC" stroke="${S}" stroke-width="3"/><line x1="-18" y1="0" x2="${(-8 + needleWiggle).toFixed(1)}" y2="-8" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/><circle cx="18" cy="0" r="14" fill="#F8FAFC" stroke="${S}" stroke-width="3"/><line x1="18" y1="0" x2="${(28 - needleWiggle).toFixed(1)}" y2="-6" stroke="#0284C7" stroke-width="3.5" stroke-linecap="round"/><circle cx="0" cy="-13" r="4" fill="${redFlash}" stroke="${S}" stroke-width="1.5"/>`;
    },
    tags: ["medidor", "termometro", "higrometro", "calor", "humedad", "naica", "58c"],
  },
  traje_termico_naica_tolomea: {
    id: "traje_termico_naica_tolomea",
    name: "Mochila Criogénica Traje Tolomea Naica",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-24" y="-30" width="48" height="60" rx="10" fill="#0284C7" stroke="${S}" stroke-width="4.5"/><rect x="-18" y="-22" width="36" height="18" rx="4" fill="#E0F2FE" stroke="${S}" stroke-width="3"/><path d="M -16 6 L 16 6 L 16 14 L -16 14 L -16 22 L 16 22" fill="none" stroke="#67E8F9" stroke-width="4" stroke-linecap="round"/><path d="M 24 -10 C 38 -10 38 18 24 24" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const mistFlow = Math.sin(f / 6) * 4;
      return `<rect x="-24" y="-30" width="48" height="60" rx="10" fill="#0284C7" stroke="${S}" stroke-width="4.5"/><rect x="-18" y="-22" width="36" height="18" rx="4" fill="#E0F2FE" stroke="${S}" stroke-width="3"/><path d="M -16 6 L 16 6 L 16 14 L -16 14 L -16 22 L 16 22" fill="none" stroke="#67E8F9" stroke-width="4.5" stroke-linecap="round"/><path d="M 24 -10 C 40 -10 40 18 24 24" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/><circle cx="${(36 + mistFlow).toFixed(1)}" cy="4" r="5" fill="#BAE6FD" opacity="0.8"/>`;
    },
    tags: ["traje", "tolomea", "hielo", "refrigerado", "criogenico", "oxigeno", "respirador"],
  },
  compuerta_acero_mina_sellada: {
    id: "compuerta_acero_mina_sellada",
    name: "Compuerta de Acero Mina Sellada",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="38" fill="#475569" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="24" fill="#1E293B" stroke="${S}" stroke-width="4"/><circle cx="0" cy="0" r="10" fill="#CBD5E1" stroke="${S}" stroke-width="3"/><line x1="-22" y1="0" x2="22" y2="0" stroke="${S}" stroke-width="4"/><line x1="0" y1="-22" x2="0" y2="22" stroke="${S}" stroke-width="4"/><circle cx="0" cy="-30" r="4" fill="#22C55E"/>`,
    animatedSvg: (f: number) => {
      const rotWheel = (f * 4) % 360;
      return `<circle cx="0" cy="0" r="38" fill="#475569" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="24" fill="#1E293B" stroke="${S}" stroke-width="4"/><g transform="rotate(${rotWheel} 0 0)"><circle cx="0" cy="0" r="10" fill="#CBD5E1" stroke="${S}" stroke-width="3.5"/><line x1="-22" y1="0" x2="22" y2="0" stroke="${S}" stroke-width="4"/><line x1="0" y1="-22" x2="0" y2="22" stroke="${S}" stroke-width="4"/></g><circle cx="0" cy="-30" r="4.5" fill="#22C55E" stroke="${S}" stroke-width="1.5"/>`;
    },
    tags: ["compuerta", "acero", "mina", "escotilla", "sellada", "seguridad", "rueda"],
  },
  billiard_cue_ball: {
    id: "billiard_cue_ball",
    name: "Taco de Billar y Bola de Marfil",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<line x1="-45" y1="35" x2="15" y2="-15" stroke="#92400E" stroke-width="6" stroke-linecap="round"/><line x1="15" y1="-15" x2="22" y2="-21" stroke="#FEF3C7" stroke-width="6" stroke-linecap="round"/><circle cx="34" cy="-31" r="14" fill="#F8FAFC" stroke="${S}" stroke-width="4.5"/><circle cx="30" cy="-35" r="4" fill="#FFFFFF"/>`,
    animatedSvg: (f: number) => {
      const hit = Math.sin(f / 3) * 6;
      return `<g transform="translate(${hit.toFixed(1)} ${(-hit).toFixed(1)})"><line x1="-45" y1="35" x2="15" y2="-15" stroke="#92400E" stroke-width="6.5" stroke-linecap="round"/><line x1="15" y1="-15" x2="22" y2="-21" stroke="#FEF3C7" stroke-width="6.5" stroke-linecap="round"/></g><circle cx="34" cy="-31" r="14" fill="#F8FAFC" stroke="${S}" stroke-width="4.5"/><circle cx="30" cy="-35" r="4" fill="#FFFFFF"/>`;
    },
    tags: ["billar", "taco", "bola", "marfil", "celuloide", "juego", "victoriano"],
  },
  elephant_tusk_cut: {
    id: "elephant_tusk_cut",
    name: "Colmillo de Elefante con Cortes",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<path d="M -35 35 Q -10 10 15 -35 Q 22 -38 25 -32 Q 5 20 -25 42 Z" fill="#FEF3C7" stroke="${S}" stroke-width="4.5"/><line x1="-15" y1="20" x2="-2" y2="28" stroke="#EF4444" stroke-width="3" stroke-dasharray="3 3"/><line x1="-2" y1="2" x2="10" y2="10" stroke="#EF4444" stroke-width="3" stroke-dasharray="3 3"/><circle cx="28" cy="-10" r="7" fill="#F8FAFC" stroke="${S}" stroke-width="2.5"/><circle cx="35" cy="8" r="7" fill="#F8FAFC" stroke="${S}" stroke-width="2.5"/><text x="-38" y="-15" font-size="9" font-weight="900" fill="#EF4444">4 BOLAS</text>`,
    animatedSvg: (f: number) => {
      const pulse = 0.9 + Math.sin(f / 4) * 0.1;
      return `<path d="M -35 35 Q -10 10 15 -35 Q 22 -38 25 -32 Q 5 20 -25 42 Z" fill="#FEF3C7" stroke="${S}" stroke-width="4.5"/><line x1="-15" y1="20" x2="-2" y2="28" stroke="#EF4444" stroke-width="3.5" stroke-dasharray="3 3"/><line x1="-2" y1="2" x2="10" y2="10" stroke="#EF4444" stroke-width="3.5" stroke-dasharray="3 3"/><g transform="scale(${pulse.toFixed(2)})"><circle cx="28" cy="-10" r="7.5" fill="#F8FAFC" stroke="${S}" stroke-width="2.5"/><circle cx="35" cy="8" r="7.5" fill="#F8FAFC" stroke="${S}" stroke-width="2.5"/></g><text x="-38" y="-15" font-size="9" font-weight="900" fill="#EF4444" stroke="${S}" stroke-width="1.5" paint-order="stroke">4 BOLAS</text>`;
    },
    tags: ["colmillo", "marfil", "elefante", "caza", "billar", "escasez"],
  },
  celluloid_press: {
    id: "celluloid_press",
    name: "Prensa Térmica de Celuloide Hyatt",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-34" y="-44" width="68" height="88" rx="6" fill="#334155" stroke="${S}" stroke-width="4.5"/><circle cx="0" cy="-46" r="18" fill="#64748B" stroke="${S}" stroke-width="4"/><line x1="-14" y1="-46" x2="14" y2="-46" stroke="${S}" stroke-width="4"/><rect x="-20" y="-12" width="40" height="34" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/><circle cx="0" cy="6" r="8" fill="#FDE047"/>`,
    animatedSvg: (f: number, progress = 0, state = "prensando") => {
      const p = Math.min(1, Math.max(0, progress));
      // Estado 1: Espera abierta
      if (state === "espera") {
        return `<g>
          <rect x="-38" y="-42" width="76" height="88" rx="6" fill="#334155" stroke="${S}" stroke-width="4.5"/>
          <rect x="-26" y="-20" width="52" height="44" rx="3" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
          <rect x="-22" y="-18" width="44" height="10" fill="#64748B" stroke="${S}" stroke-width="3"/>
          <line x1="0" y1="-42" x2="0" y2="-18" stroke="#94A3B8" stroke-width="6"/>
          <circle cx="0" cy="-46" r="18" fill="#64748B" stroke="${S}" stroke-width="4"/>
          <line x1="-14" y1="-46" x2="14" y2="-46" stroke="${S}" stroke-width="4"/>
          <rect x="-30" y="28" width="60" height="12" rx="3" fill="#475569" stroke="${S}" stroke-width="3"/>
          <text x="0" y="-26" text-anchor="middle" font-size="7.5" font-weight="900" fill="#F8FAFC">PRENSA HYATT</text>
        </g>`;
      }
      // Estado 2: Carga de masa de alcanfor + piroxilina y encendido térmico
      if (state === "carga_calor") {
        const dropY = -12 + p * 16;
        const glow = 0.5 + 0.5 * Math.sin(f / 3);
        return `<g>
          <rect x="-38" y="-42" width="76" height="88" rx="6" fill="#334155" stroke="${S}" stroke-width="4.5"/>
          <rect x="-26" y="-20" width="52" height="44" rx="3" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
          <!-- Masa de alcanfor + nitrocelulosa entrando en la cámara -->
          <ellipse cx="0" cy="${dropY.toFixed(1)}" rx="16" ry="11" fill="#FDE047" stroke="${S}" stroke-width="3"/>
          <!-- Resistencias térmicas encendidas abajo -->
          <rect x="-24" y="18" width="48" height="6" rx="2" fill="#EF4444" opacity="${glow.toFixed(2)}"/>
          <rect x="-22" y="-18" width="44" height="10" fill="#64748B" stroke="${S}" stroke-width="3"/>
          <g transform="rotate(${(f * 4) % 360} 0 -46)">
            <circle cx="0" cy="-46" r="18" fill="#64748B" stroke="${S}" stroke-width="4"/>
            <line x1="-14" y1="-46" x2="14" y2="-46" stroke="${S}" stroke-width="4"/>
          </g>
          <text x="0" y="38" text-anchor="middle" font-size="7.5" font-weight="900" fill="#FDE047">CALOR + PRESIÓN</text>
        </g>`;
      }
      // Estado 3: Prensado mecánico activo (pistón baja y comprime la masa con vapor)
      if (state === "prensando") {
        const pistonY = -18 + p * 22;
        const massH = Math.max(8, 24 - p * 14);
        const massY = 22 - massH;
        const steamX = 42 + (f % 14);
        return `<g>
          <rect x="-38" y="-42" width="76" height="88" rx="6" fill="#334155" stroke="${S}" stroke-width="4.5"/>
          <rect x="-26" y="-20" width="52" height="44" rx="3" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
          <!-- Tornillo y pistón bajando bajo presión -->
          <line x1="0" y1="-42" x2="0" y2="${pistonY.toFixed(1)}" stroke="#CBD5E1" stroke-width="7"/>
          <rect x="-23" y="${pistonY.toFixed(1)}" width="46" height="10" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
          <!-- Masa comprimida transformándose en marfil sintético -->
          <rect x="-21" y="${massY.toFixed(1)}" width="42" height="${massH.toFixed(1)}" rx="4" fill="#FEF9C3" stroke="${S}" stroke-width="3"/>
          <rect x="-24" y="19" width="48" height="5" rx="2" fill="#EF4444"/>
          <g transform="rotate(${(f * 14) % 360} 0 -46)">
            <circle cx="0" cy="-46" r="18" fill="#F59E0B" stroke="${S}" stroke-width="4"/>
            <line x1="-14" y1="-46" x2="14" y2="-46" stroke="${S}" stroke-width="4"/>
            <line x1="0" y1="-60" x2="0" y2="-32" stroke="${S}" stroke-width="4"/>
          </g>
          <!-- Chorros laterales de vapor contenido -->
          <circle cx="${steamX}" cy="0" r="6" fill="#F8FAFC" opacity="0.75"/>
          <circle cx="${-steamX}" cy="-6" r="5" fill="#F8FAFC" opacity="0.75"/>
          <text x="0" y="38" text-anchor="middle" font-size="7.5" font-weight="900" fill="#38BDF8">PRENSANDO PASTA</text>
        </g>`;
      }
      // Estado 4: Extrusión del bloque/bola sólida de celuloide color marfil
      const outX = p * 26;
      const shine = Math.sin(f / 4) * 3;
      return `<g>
        <rect x="-38" y="-42" width="76" height="88" rx="6" fill="#334155" stroke="${S}" stroke-width="4.5"/>
        <rect x="-26" y="-20" width="52" height="44" rx="3" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
        <line x1="0" y1="-42" x2="0" y2="2" stroke="#CBD5E1" stroke-width="7"/>
        <rect x="-23" y="2" width="46" height="10" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
        <circle cx="0" cy="-46" r="18" fill="#10B981" stroke="${S}" stroke-width="4"/>
        <!-- Bandeja de salida y cilindro/esfera de celuloide recién moldeado -->
        <path d="M -52 34 L 40 34" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
        <rect x="${(-18 - outX * 0.5).toFixed(1)}" y="14" width="24" height="16" rx="4" fill="#FEFCE8" stroke="${S}" stroke-width="3.5"/>
        <circle cx="${(-24 - outX).toFixed(1)}" cy="20" r="13" fill="#FEF9C3" stroke="${S}" stroke-width="4"/>
        <circle cx="${(-28 - outX).toFixed(1)}" cy="15" r="4" fill="#FFFFFF"/>
        <path d="M ${(-24 - outX).toFixed(1)} ${(2 + shine).toFixed(1)} L ${(-24 - outX).toFixed(1)} ${(-6 + shine).toFixed(1)}" stroke="#FFE600" stroke-width="3" stroke-linecap="round"/>
        <text x="0" y="45" text-anchor="middle" font-size="8" font-weight="900" fill="#FFE600" stroke="${S}" stroke-width="2" paint-order="stroke">¡CELULOIDE SÓLIDO!</text>
      </g>`;
    },
    tags: ["prensa", "celuloide", "hyatt", "quimica", "termoplastico", "inventor"],
  },
  mesa_quimica_celuloide: {
    id: "mesa_quimica_celuloide",
    name: "Estación Química de Nitrocelulosa y Alcanfor",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<rect x="-42" y="16" width="84" height="12" rx="3" fill="#78350F" stroke="${S}" stroke-width="4"/><rect x="-24" y="-26" width="48" height="42" rx="4" fill="#E0F2FE" stroke="${S}" stroke-width="4"/><rect x="-20" y="-8" width="40" height="22" fill="#84CC16"/>`,
    animatedSvg: (f: number, progress = 0, state = "algodon_acido") => {
      const p = Math.min(1, Math.max(0, progress));
      // Fase 1: Algodón sumergiéndose en ácido nítrico y sulfúrico -> gel burbujeante
      if (state === "algodon_acido") {
        const cottonY = -34 + p * 26;
        const cottonColor = p > 0.55 ? "#FDE047" : "#FFFFFF";
        const b1 = ((f * 2) % 18);
        return `<g>
          <rect x="-46" y="18" width="92" height="12" rx="3" fill="#78350F" stroke="${S}" stroke-width="4"/>
          <!-- Cuba de vidrio con ácido nítrico -->
          <rect x="-28" y="-28" width="56" height="46" rx="5" fill="#E0F2FE" fill-opacity="0.85" stroke="${S}" stroke-width="4"/>
          <rect x="-24" y="-6" width="48" height="22" rx="2" fill="#84CC16" stroke="${S}" stroke-width="2.5"/>
          <!-- Copo de algodón sumergiéndose y reaccionando -->
          <g transform="translate(0, ${cottonY.toFixed(1)})">
            <circle cx="-7" cy="0" r="9" fill="${cottonColor}" stroke="${S}" stroke-width="3"/>
            <circle cx="7" cy="2" r="8" fill="${cottonColor}" stroke="${S}" stroke-width="3"/>
            <circle cx="0" cy="-6" r="8" fill="${cottonColor}" stroke="${S}" stroke-width="3"/>
          </g>
          <!-- Burbujas y vapores ácidos -->
          <circle cx="-10" cy="${(8 - b1).toFixed(1)}" r="3.5" fill="#ECFCCB" stroke="${S}" stroke-width="1.5"/>
          <circle cx="11" cy="${(12 - b1 * 0.8).toFixed(1)}" r="4" fill="#ECFCCB" stroke="${S}" stroke-width="1.5"/>
          <text x="0" y="40" text-anchor="middle" font-size="7.5" font-weight="900" fill="#BEF264" stroke="${S}" stroke-width="2" paint-order="stroke">ALGODÓN + ÁCIDO NÍTRICO</text>
        </g>`;
      }
      // Fase 2: Al secarse se encoge y se quiebra en una costra frágil (fracaso de Parkes)
      if (state === "costra_fragil") {
        const shrink = 1 - p * 0.25;
        return `<g>
          <rect x="-46" y="18" width="92" height="12" rx="3" fill="#78350F" stroke="${S}" stroke-width="4"/>
          <rect x="-28" y="-28" width="56" height="46" rx="5" fill="#1E293B" fill-opacity="0.5" stroke="${S}" stroke-width="4"/>
          <g transform="translate(0, 4) scale(${shrink.toFixed(2)})">
            <polygon points="-22,10 -16,-8 4,-12 22,-4 18,12 -6,14" fill="#D97706" stroke="${S}" stroke-width="3.5"/>
            <!-- Grietas de fragilidad -->
            <path d="M -8 -8 L 0 2 L -6 11 M 6 -6 L 2 4 L 12 10" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round"/>
          </g>
          <text x="0" y="40" text-anchor="middle" font-size="7.5" font-weight="900" fill="#F87171" stroke="${S}" stroke-width="2" paint-order="stroke">COSTRA SECA Y QUEBRADIZA</text>
        </g>`;
      }
      // Fase 3: Hyatt añade cristales de alcanfor -> masa dorada maleable
      const crystalY = -36 + ((f * 2.5) % 28);
      return `<g>
        <rect x="-46" y="18" width="92" height="12" rx="3" fill="#78350F" stroke="${S}" stroke-width="4"/>
        <rect x="-28" y="-28" width="56" height="46" rx="5" fill="#E0F2FE" fill-opacity="0.85" stroke="${S}" stroke-width="4"/>
        <!-- Cristales blancos de alcanfor cayendo -->
        <rect x="-8" y="${crystalY.toFixed(1)}" width="7" height="7" transform="rotate(25 -5 ${crystalY.toFixed(1)})" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
        <rect x="8" y="${(crystalY - 8).toFixed(1)}" width="6" height="6" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
        <!-- Masa cálida y maleable -->
        <path d="M -20 12 Q -10 ${(-4 - Math.sin(f / 3) * 4).toFixed(1)} 0 2 Q 12 ${(-6 + Math.sin(f / 3) * 4).toFixed(1)} 20 12 Z" fill="#FDE047" stroke="${S}" stroke-width="3.5"/>
        <text x="0" y="40" text-anchor="middle" font-size="7.5" font-weight="900" fill="#FDE047" stroke="${S}" stroke-width="2" paint-order="stroke">+ ALCANFOR = MASA MALEABLE</text>
      </g>`;
    },
    tags: ["quimica", "algodon", "acido", "alcanfor", "celuloide", "parkes", "hyatt"],
  },
  celluloid_ivory_ball: {
    id: "celluloid_ivory_ball",
    name: "Bola de Celuloide Marfil Sintético",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="22" fill="#FEF9C3" stroke="${S}" stroke-width="5"/><circle cx="-7" cy="-8" r="6" fill="#FFFFFF"/><path d="M 18 -24 L 26 -32 M 24 -12 L 34 -14" stroke="#FFE600" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["celuloide", "bola", "marfil", "billar", "sintetico"],
  },
  paperclip_polymer_chain: {
    id: "paperclip_polymer_chain",
    name: "Demostrador Interactivo Monómero a Polímero",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-42" y="-12" width="26" height="24" rx="8" fill="none" stroke="#94A3B8" stroke-width="5"/><rect x="-22" y="-12" width="26" height="24" rx="8" fill="none" stroke="#38BDF8" stroke-width="5"/><rect x="-2" y="-12" width="26" height="24" rx="8" fill="none" stroke="#FBBF24" stroke-width="5"/><rect x="18" y="-12" width="26" height="24" rx="8" fill="none" stroke="#10B981" stroke-width="5"/>`,
    animatedSvg: (f: number, progress = 0, state = "ensamblaje_progresivo") => {
      const p = Math.min(1, Math.max(0, progress));
      const clipColors = [
        "#38BDF8",
        "#FBBF24",
        "#10B981",
        "#F43F5E",
        "#A855F7",
        "#38BDF8",
        "#FBBF24",
        "#10B981",
      ];

      // FASE 1: Un solo clip solitario (monómero) que cae sobre la mesa sin fuerza ni estructura
      if (state === "monomero_suelto") {
        const dropProgress = Math.min(1, p * 1.6);
        const clipY = -22 + dropProgress * 30 - Math.abs(Math.sin(dropProgress * Math.PI * 2)) * (1 - dropProgress) * 12;
        const clipRot = dropProgress * 18;
        return `<g>
          <!-- Mesa de prueba molecular -->
          <rect x="-75" y="18" width="150" height="8" rx="3" fill="#334155" stroke="${S}" stroke-width="3.5"/>
          <!-- Único clip aislado (Monómero) -->
          <g transform="translate(0, ${clipY.toFixed(1)}) rotate(${clipRot.toFixed(1)})">
            <rect x="-18" y="-9" width="36" height="18" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="5"/>
            <rect x="-10" y="-4" width="20" height="8" rx="4" fill="none" stroke="#E2E8F0" stroke-width="2.5"/>
          </g>
          <rect x="-62" y="-44" width="124" height="18" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
          <text x="0" y="-32" text-anchor="middle" font-size="8.5" font-weight="900" fill="#38BDF8">MONÓMERO: 1 ESLABÓN SUELTO</text>
          <text x="0" y="38" text-anchor="middle" font-size="7.5" font-weight="900" fill="#94A3B8">SIN FUERZA NI ESTRUCTURA</text>
        </g>`;
      }

      // FASE 2: Ensamblaje progresivo eslabón por eslabón ("unes ese clip con otro, y con otro...")
      if (state === "ensamblaje_progresivo") {
        const totalClips = 8;
        const activeCount = Math.max(1, Math.min(totalClips, Math.ceil(p * totalClips)));
        let clipsMarkup = "";
        for (let i = 0; i < activeCount; i++) {
          const baseX = -70 + i * 18;
          const isNewest = i === activeCount - 1 && p < 0.96;
          const localFrac = (p * totalClips) - Math.floor(p * totalClips);
          const flyOffsetX = isNewest ? (1 - localFrac) * 24 : 0;
          const flyOffsetY = isNewest ? -(1 - localFrac) * 18 : Math.sin((f + i * 5) / 5) * 2;
          const col = clipColors[i % clipColors.length];
          clipsMarkup += `<g transform="translate(${(baseX + flyOffsetX).toFixed(1)}, ${flyOffsetY.toFixed(1)})">
            <rect x="-12" y="-9" width="24" height="18" rx="7" fill="#0F172A" fill-opacity="0.75" stroke="${col}" stroke-width="4.5"/>
            <circle cx="-6" cy="0" r="2.5" fill="#FFFFFF"/>
          </g>`;
          if (isNewest) {
            clipsMarkup += `<circle cx="${baseX - 8}" cy="0" r="7" fill="#FFE600" opacity="0.85"/>`;
          }
        }
        const displayedCount = p > 0.85 ? "10.000" : String(activeCount);
        return `<g>
          ${clipsMarkup}
          <rect x="-68" y="-42" width="136" height="18" rx="4" fill="#0F172A" stroke="#FFE600" stroke-width="2.5"/>
          <text x="0" y="-30" text-anchor="middle" font-size="8" font-weight="900" fill="#FFE600">UNIENDO CLIPS: ${displayedCount} ESLABONES</text>
          <text x="0" y="32" text-anchor="middle" font-size="7.5" font-weight="900" fill="#E2E8F0">CADENA DE CARBONO [-C-C-C-]n</text>
        </g>`;
      }

      // FASE 3: Prueba de tensión y resistencia ("cuerda flexible, resistente y capaz de soportar peso")
      const stretch = 1 + Math.min(0.16, p * 0.16) + Math.sin(f / 3) * 0.02;
      let tautClips = "";
      for (let i = 0; i < 8; i++) {
        const cx = (-68 + i * 18.5) * stretch;
        const sagY = Math.sin((i / 7) * Math.PI) * 5;
        const col = clipColors[i % clipColors.length];
        tautClips += `<g transform="translate(${cx.toFixed(1)}, ${sagY.toFixed(1)})">
          <rect x="-12" y="-8" width="24" height="16" rx="6" fill="#0F172A" stroke="${col}" stroke-width="4.5"/>
        </g>`;
      }
      return `<g>
        <!-- Flechas de tensión en ambos extremos -->
        <path d="M -88 0 L -74 0 M -82 -6 L -88 0 L -82 6" stroke="#FFE600" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 74 0 L 88 0 M 82 -6 L 88 0 L 82 6" stroke="#FFE600" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${tautClips}
        <!-- Pesa suspendida del centro demostrando resistencia estructural -->
        <line x1="0" y1="6" x2="0" y2="20" stroke="#FFE600" stroke-width="3.5"/>
        <polygon points="-14,20 14,20 18,36 -18,36" fill="#475569" stroke="${S}" stroke-width="3.5"/>
        <text x="0" y="31" text-anchor="middle" font-size="6.5" font-weight="900" fill="#FFFFFF">100 KG</text>
        <rect x="-68" y="-42" width="136" height="18" rx="4" fill="#065F46" stroke="#10B981" stroke-width="2.5"/>
        <text x="0" y="-30" text-anchor="middle" font-size="8" font-weight="900" fill="#FFFFFF">POLÍMERO: CADENA RESISTENTE</text>
      </g>`;
    },
    tags: ["polimero", "monomero", "clips", "cadena", "carbono", "quimica", "molecula"],
  },
  phenol_formaldehyde_bottles: {
    id: "phenol_formaldehyde_bottles",
    name: "Botellas de Fenol y Formaldehído",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-28" y="-15" width="24" height="42" rx="4" fill="#78350F" stroke="${S}" stroke-width="4"/><rect x="-22" y="-24" width="12" height="9" fill="#D97706" stroke="${S}" stroke-width="3"/><rect x="4" y="-18" width="24" height="45" rx="4" fill="#047857" stroke="${S}" stroke-width="4"/><rect x="10" y="-27" width="12" height="9" fill="#10B981" stroke="${S}" stroke-width="3"/><circle cx="-16" cy="4" r="5" fill="#EF4444"/><circle cx="16" cy="2" r="5" fill="#EF4444"/>`,
    animatedSvg: (f: number) => {
      const bubble = Math.sin(f / 3) * 3;
      return `<rect x="-28" y="-15" width="24" height="42" rx="4" fill="#78350F" stroke="${S}" stroke-width="4"/><rect x="-22" y="-24" width="12" height="9" fill="#D97706" stroke="${S}" stroke-width="3"/><rect x="4" y="-18" width="24" height="45" rx="4" fill="#047857" stroke="${S}" stroke-width="4"/><rect x="10" y="-27" width="12" height="9" fill="#10B981" stroke="${S}" stroke-width="3"/><circle cx="-16" cy="4" r="5" fill="#EF4444"/><circle cx="16" cy="2" r="5" fill="#EF4444"/><circle cx="${(-16 + bubble).toFixed(1)}" cy="-32" r="3" fill="#A7F3D0" opacity="0.7"/><circle cx="${(16 - bubble).toFixed(1)}" cy="-36" r="3.5" fill="#FDE68A" opacity="0.7"/>`;
    },
    tags: ["quimica", "veneno", "fenol", "formaldehido", "baquelita", "alquimia", "reactivos"],
  },
  bakelizer_autoclave: {
    id: "bakelizer_autoclave",
    name: "Autoclave Bakelizador Monumental",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-32" y="-36" width="64" height="74" rx="14" fill="#1E293B" stroke="${S}" stroke-width="5"/><circle cx="0" cy="-2" r="18" fill="#475569" stroke="${S}" stroke-width="3.5"/><circle cx="0" cy="-34" r="10" fill="#F8FAFC" stroke="${S}" stroke-width="3"/><line x1="0" y1="-34" x2="6" y2="-38" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/><rect x="-22" y="26" width="44" height="10" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/>`,
    animatedSvg: (f: number, progress = 0, state = "calor_presion_150c") => {
      const p = Math.min(1, Math.max(0, progress));

      // FASE 1: Carga de fenol+formaldehído y sellado hermético de la escotilla
      if (state === "carga_sellado") {
        const wheelRot = p * 240;
        const hatchShift = (1 - p) * 14;
        return `<g>
          <!-- Cuerpo acorazado del Bakelizador -->
          <rect x="-36" y="-34" width="72" height="72" rx="16" fill="#334155" stroke="${S}" stroke-width="5"/>
          <!-- Interior visible antes de cerrar del todo -->
          <circle cx="0" cy="-2" r="20" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
          <path d="M -16 4 Q 0 ${(-2 + Math.sin(f / 3) * 3).toFixed(1)} 16 4 L 16 16 L -16 16 Z" fill="#D97706"/>
          <!-- Puerta circular y volante cerrándose -->
          <g transform="translate(${hatchShift.toFixed(1)}, 0)">
            <circle cx="0" cy="-2" r="20" fill="#64748B" fill-opacity="${(0.35 + p * 0.65).toFixed(2)}" stroke="${S}" stroke-width="4"/>
            <g transform="rotate(${wheelRot.toFixed(1)} 0 -2)">
              <line x1="-13" y1="-2" x2="13" y2="-2" stroke="#F8FAFC" stroke-width="4"/>
              <line x1="0" y1="-15" x2="0" y2="11" stroke="#F8FAFC" stroke-width="4"/>
              <circle cx="0" cy="-2" r="6" fill="#EF4444" stroke="${S}" stroke-width="2.5"/>
            </g>
          </g>
          <!-- Manómetro superior en cero -->
          <circle cx="0" cy="-38" r="11" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/>
          <line x1="0" y1="-38" x2="-7" y2="-34" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>
          <text x="0" y="49" text-anchor="middle" font-size="7.5" font-weight="900" fill="#FDE047" stroke="${S}" stroke-width="2" paint-order="stroke">SELLANDO ESCOTILLA</text>
        </g>`;
      }

      // FASE 2: Calentamiento a 150 °C y subida de presión en el manómetro
      if (state === "calor_presion_150c") {
        const needleAngle = -120 + p * 195 + Math.sin(f * 1.5) * 4;
        const rad = (needleAngle * Math.PI) / 180;
        const nx = Math.cos(rad) * 8;
        const ny = -38 + Math.sin(rad) * 8;
        const flameH = 8 + Math.sin(f * 2) * 3;
        return `<g>
          <rect x="-36" y="-34" width="72" height="72" rx="16" fill="#334155" stroke="${S}" stroke-width="5"/>
          <!-- Quemador inferior encendido a 150 °C -->
          <rect x="-28" y="28" width="56" height="10" rx="3" fill="#EF4444" stroke="${S}" stroke-width="3"/>
          <polygon points="-18,28 -12,${(28 - flameH).toFixed(1)} -6,28 0,${(26 - flameH).toFixed(1)} 6,28 12,${(28 - flameH).toFixed(1)} 18,28" fill="#FACC15"/>
          <!-- Visor mostrando líquido hirviendo a presión sin escapar -->
          <circle cx="0" cy="-2" r="20" fill="#1E293B" stroke="${S}" stroke-width="4"/>
          <path d="M -17 2 Q 0 ${(-5 + Math.sin(f * 1.5) * 4).toFixed(1)} 17 2 L 17 15 L -17 15 Z" fill="#F59E0B"/>
          <circle cx="-6" cy="6" r="3" fill="#FEF08A"/>
          <circle cx="7" cy="3" r="3.5" fill="#FEF08A"/>
          <!-- Manómetro subiendo a zona roja -->
          <circle cx="0" cy="-38" r="12" fill="#FEF2F2" stroke="${S}" stroke-width="3.5"/>
          <line x1="0" y1="-38" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
          <text x="0" y="50" text-anchor="middle" font-size="8" font-weight="900" fill="#EF4444" stroke="${S}" stroke-width="2" paint-order="stroke">150 °C + ALTA PRESIÓN</text>
        </g>`;
      }

      // FASE 3: Reticulación molecular 3D en el visor ("red rígida como una jaula de acero microscópica")
      if (state === "reticulacion_3d") {
        const linkOpacity = Math.min(1, p * 1.3);
        return `<g>
          <rect x="-36" y="-34" width="72" height="72" rx="16" fill="#1E293B" stroke="${S}" stroke-width="5"/>
          <!-- Visor ampliado con jaula molecular 3D termoestable formándose -->
          <circle cx="0" cy="-2" r="23" fill="#0F172A" stroke="#38BDF8" stroke-width="4"/>
          <!-- Cadenas horizontales -->
          <line x1="-16" y1="-10" x2="16" y2="-10" stroke="#38BDF8" stroke-width="3"/>
          <line x1="-18" y1="0" x2="18" y2="0" stroke="#38BDF8" stroke-width="3"/>
          <line x1="-16" y1="10" x2="16" y2="10" stroke="#38BDF8" stroke-width="3"/>
          <!-- Puentes cruzados 3D que bloquean la red -->
          <g opacity="${linkOpacity.toFixed(2)}">
            <line x1="-10" y1="-12" x2="-10" y2="12" stroke="#FFE600" stroke-width="3"/>
            <line x1="0" y1="-14" x2="0" y2="14" stroke="#FFE600" stroke-width="3"/>
            <line x1="10" y1="-12" x2="10" y2="12" stroke="#FFE600" stroke-width="3"/>
            <line x1="-12" y1="-10" x2="12" y2="10" stroke="#F43F5E" stroke-width="2.5"/>
            <line x1="12" y1="-10" x2="-12" y2="10" stroke="#F43F5E" stroke-width="2.5"/>
            <circle cx="-10" cy="0" r="3" fill="#FFE600"/>
            <circle cx="0" cy="0" r="3.5" fill="#FFE600"/>
            <circle cx="10" cy="0" r="3" fill="#FFE600"/>
          </g>
          <circle cx="0" cy="-38" r="11" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/>
          <line x1="0" y1="-38" x2="7" y2="-42" stroke="#EF4444" stroke-width="3"/>
          <text x="0" y="50" text-anchor="middle" font-size="7.5" font-weight="900" fill="#38BDF8" stroke="${S}" stroke-width="2" paint-order="stroke">RED 3D TERMOESTABLE</text>
        </g>`;
      }

      // FASE 4: Apertura de la escotilla y extracción del bloque oscuro y brillante de Baquelita
      const blockRise = p * 14;
      return `<g>
        <rect x="-36" y="-34" width="72" height="72" rx="16" fill="#334155" stroke="${S}" stroke-width="5"/>
        <!-- Escotilla abierta hacia la derecha -->
        <circle cx="28" cy="-2" r="16" fill="#64748B" stroke="${S}" stroke-width="3.5"/>
        <circle cx="0" cy="-2" r="20" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
        <!-- Bloque sólido oscuro y brillante de Baquelita emergiendo -->
        <g transform="translate(0, ${(-blockRise * 0.4).toFixed(1)})">
          <rect x="-15" y="-12" width="30" height="22" rx="4" fill="#27120B" stroke="#F59E0B" stroke-width="3.5"/>
          <line x1="-10" y1="-7" x2="-2" y2="-7" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
          <path d="M 0 -22 L 0 -30 M -16 -18 L -22 -24 M 16 -18 L 22 -24" stroke="#FFE600" stroke-width="3" stroke-linecap="round"/>
        </g>
        <text x="0" y="50" text-anchor="middle" font-size="8" font-weight="900" fill="#FFE600" stroke="${S}" stroke-width="2" paint-order="stroke">¡NACE LA BAQUELITA!</text>
      </g>`;
    },
    tags: ["bakelizador", "autoclave", "baquelita", "baekeland", "reactor", "presion", "vapor"],
  },
  bakelite_molded_block: {
    id: "bakelite_molded_block",
    name: "Bloque Sólido de Baquelita Moldeada",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-18" width="48" height="36" rx="6" fill="#27120B" stroke="${S}" stroke-width="5"/><rect x="-18" y="-12" width="36" height="24" rx="3" fill="#451A03" stroke="#F59E0B" stroke-width="2.5"/><line x1="-12" y1="-6" x2="4" y2="-6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><path d="M 0 -26 L 0 -36 M -22 -22 L -30 -30 M 22 -22 L 30 -30" stroke="#FFE600" stroke-width="4" stroke-linecap="round"/>`,
    tags: ["baquelita", "bloque", "termoestable", "resina", "aislante", "baekeland"],
  },
  vintage_bakelite_telephone: {
    id: "vintage_bakelite_telephone",
    name: "Teléfono Vintage de Baquelita",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-10" width="48" height="34" rx="8" fill="#0F172A" stroke="${S}" stroke-width="4.5"/><circle cx="0" cy="7" r="10" fill="#E2E8F0" stroke="${S}" stroke-width="3"/><circle cx="0" cy="7" r="3" fill="#0F172A"/><path d="M -30 -22 C -18 -15 18 -15 30 -22 C 34 -25 34 -15 28 -12 C 16 -16 -16 -16 -28 -12 C -34 -15 -34 -25 -30 -22 Z" fill="#0F172A" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const ring = f % 12 < 6 ? Math.sin(f * 2) * 2 : 0;
      return `<rect x="-24" y="-10" width="48" height="34" rx="8" fill="#0F172A" stroke="${S}" stroke-width="4.5"/><circle cx="0" cy="7" r="10" fill="#E2E8F0" stroke="${S}" stroke-width="3"/><circle cx="0" cy="7" r="3" fill="#0F172A"/><g transform="translate(${ring.toFixed(1)} 0)"><path d="M -30 -22 C -18 -15 18 -15 30 -22 C 34 -25 34 -15 28 -12 C 16 -16 -16 -16 -28 -12 C -34 -15 -34 -25 -30 -22 Z" fill="#0F172A" stroke="${S}" stroke-width="4"/></g>`;
    },
    tags: ["telefono", "baquelita", "disco", "vintage", "retro", "diseno", "comunicacion"],
  },
  hammer_test_indestructible: {
    id: "hammer_test_indestructible",
    name: "Prueba de Mazo Baquelita Indestructible",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<rect x="-20" y="8" width="40" height="24" rx="4" fill="#0F172A" stroke="${S}" stroke-width="4.5"/><line x1="-15" y1="-30" x2="10" y2="2" stroke="#78350F" stroke-width="6" stroke-linecap="round"/><rect x="4" y="-3" width="16" height="12" rx="2" fill="#92400E" stroke="${S}" stroke-width="3"/><path d="M 0 5 L -10 -5 M 5 3 L 15 -7" stroke="#FFE600" stroke-width="3" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const bounce = Math.abs(Math.sin(f / 3)) * 8;
      return `<rect x="-20" y="8" width="40" height="24" rx="4" fill="#0F172A" stroke="${S}" stroke-width="4.5"/><g transform="translate(0 ${(-bounce).toFixed(1)})"><line x1="-15" y1="-30" x2="10" y2="2" stroke="#78350F" stroke-width="6" stroke-linecap="round"/><rect x="4" y="-3" width="16" height="12" rx="2" fill="#92400E" stroke="${S}" stroke-width="3"/></g><path d="M 0 5 L -10 -5 M 5 3 L 15 -7" stroke="#FFE600" stroke-width="3.5" stroke-linecap="round"/>`;
    },
    tags: ["mazo", "prueba", "resistencia", "baquelita", "indestructible", "impacto"],
  },
  plastiglomerate_rock: {
    id: "plastiglomerate_rock",
    name: "Roca de Plastiglomerado Fósil",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<path d="M -30 20 L -25 -10 L 0 -25 L 28 -15 L 32 15 L 10 28 L -20 26 Z" fill="#334155" stroke="${S}" stroke-width="4.5"/><circle cx="-8" cy="-5" r="7" fill="#EF4444" stroke="${S}" stroke-width="2"/><circle cx="12" cy="5" r="6" fill="#38BDF8" stroke="${S}" stroke-width="2"/><rect x="-18" y="8" width="10" height="6" fill="#FBBF24" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const shine = (f * 3) % 40;
      return `<path d="M -30 20 L -25 -10 L 0 -25 L 28 -15 L 32 15 L 10 28 L -20 26 Z" fill="#334155" stroke="${S}" stroke-width="4.5"/><circle cx="-8" cy="-5" r="7" fill="#EF4444" stroke="${S}" stroke-width="2.5"/><circle cx="12" cy="5" r="6" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/><rect x="-18" y="8" width="10" height="6" fill="#FBBF24" stroke="${S}" stroke-width="2.5"/><line x1="${(-25 + shine).toFixed(1)}" y1="-20" x2="${(-15 + shine).toFixed(1)}" y2="-10" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`;
    },
    tags: ["plastiglomerado", "roca", "fosil", "antropoceno", "geologia", "microplasticos"],
  },
  galileo_cube_scale: {
    id: "galileo_cube_scale",
    name: "Cubo de Escala de Galileo (Ley Cuadrado-Cúbica)",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="-20,-5 0,-18 20,-5 0,8" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/><polygon points="-20,-5 0,8 0,32 -20,19" fill="#0284C7" stroke="${S}" stroke-width="3.5"/><polygon points="0,8 20,-5 20,19 0,32" fill="#0369A1" stroke="${S}" stroke-width="3.5"/><text x="0" y="-24" text-anchor="middle" font-size="8" font-weight="900" fill="#FFE600" stroke="${S}" stroke-width="2" paint-order="stroke">L = 1</text>`,
    animatedSvg: (f: number, progress = 0, state = "cubo_base_1x") => {
      // FASE 1: Cubo 1x (Base estable)
      if (state === "cubo_base_1x") {
        return `<g>
          <polygon points="-16,-6 0,-17 16,-6 0,5" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/>
          <polygon points="-16,-6 0,5 0,26 -16,15" fill="#0284C7" stroke="${S}" stroke-width="3.5"/>
          <polygon points="0,5 16,-6 16,15 0,26" fill="#0369A1" stroke="${S}" stroke-width="3.5"/>
          <rect x="-38" y="-46" width="76" height="20" rx="5" fill="#0F172A" stroke="${S}" stroke-width="3"/>
          <text x="0" y="-38" text-anchor="middle" font-size="7" font-weight="900" fill="#38BDF8">ÁREA BASE = 1</text>
          <text x="0" y="-29" text-anchor="middle" font-size="7" font-weight="900" fill="#4ADE80">PESO = 1 (ESTABLE)</text>
          <path d="M 0 32 L 0 42" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
        </g>`;
      }

      // FASE 2: Duplicación 2x (8 bloques, doble de tensión en la base)
      if (state === "duplicacion_2x") {
        const shake = Math.sin(f * 0.25) * 1.0;
        return `<g transform="translate(${shake.toFixed(1)} 0)">
          <polygon points="-28,-14 0,-30 28,-14 0,2" fill="#FBBF24" stroke="${S}" stroke-width="4"/>
          <line x1="-14" y1="-22" x2="14" y2="-6" stroke="${S}" stroke-width="2.5"/>
          <line x1="14" y1="-22" x2="-14" y2="-6" stroke="${S}" stroke-width="2.5"/>
          <polygon points="-28,-14 0,2 0,36 -28,20" fill="#D97706" stroke="${S}" stroke-width="4"/>
          <line x1="-28" y1="3" x2="0" y2="19" stroke="${S}" stroke-width="2.5"/>
          <line x1="-14" y1="-6" x2="-14" y2="28" stroke="${S}" stroke-width="2.5"/>
          <polygon points="0,2 28,-14 28,20 0,36" fill="#B45309" stroke="${S}" stroke-width="4"/>
          <line x1="0" y1="19" x2="28" y2="3" stroke="${S}" stroke-width="2.5"/>
          <line x1="14" y1="-6" x2="14" y2="28" stroke="${S}" stroke-width="2.5"/>
          <rect x="-44" y="-50" width="88" height="22" rx="5" fill="#7C2D12" stroke="${S}" stroke-width="3"/>
          <text x="0" y="-42" text-anchor="middle" font-size="7" font-weight="900" fill="#FDE047">ÁREA ×4 | PESO ×8</text>
          <text x="0" y="-32" text-anchor="middle" font-size="7.5" font-weight="900" fill="#EF4444">TENSIÓN BASE ×2</text>
          <path d="M -18 42 L -18 36 M 18 42 L 18 36" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
        </g>`;
      }

      // FASE 3: Colapso por escala límite (base aplastada y fracturada)
      const crumble = Math.sin(f * 0.32) * 1.4;
      return `<g transform="translate(${crumble.toFixed(1)} 0)">
        <polygon points="-32,-8 0,-26 32,-8 4,8" fill="#EF4444" stroke="${S}" stroke-width="4"/>
        <polygon points="-32,-8 4,8 -2,38 -34,22" fill="#B91C1C" stroke="${S}" stroke-width="4"/>
        <polygon points="4,8 32,-8 28,24 -2,38" fill="#991B1B" stroke="${S}" stroke-width="4"/>
        <path d="M -12 8 L -4 18 L -14 24 L -6 34" stroke="#FFE600" stroke-width="3.5" fill="none"/>
        <path d="M 12 10 L 8 20 L 16 26 L 10 36" stroke="#FFE600" stroke-width="3.5" fill="none"/>
        <rect x="-38" y="28" width="8" height="8" rx="2" fill="#7F1D1D" stroke="${S}" stroke-width="2"/>
        <rect x="30" y="24" width="7" height="7" rx="2" fill="#7F1D1D" stroke="${S}" stroke-width="2"/>
        <rect x="-48" y="-48" width="96" height="20" rx="5" fill="#450A0A" stroke="#EF4444" stroke-width="3"/>
        <text x="0" y="-35" text-anchor="middle" font-size="8" font-weight="900" fill="#FFE600" stroke="${S}" stroke-width="1.5">¡COLAPSO GEOMÉTRICO!</text>
      </g>`;
    },
    tags: ["galileo", "ley_cuadrado_cubica", "escala", "volumen", "area", "colapso", "fisica", "cubo"],
  },
  torre_bloques_colapso: {
    id: "torre_bloques_colapso",
    name: "Torre de Bloques Colapsable",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="22" width="36" height="18" rx="3" fill="#64748B" stroke="${S}" stroke-width="4"/><rect x="-16" y="2" width="32" height="18" rx="3" fill="#94A3B8" stroke="${S}" stroke-width="4"/><rect x="-14" y="-18" width="28" height="18" rx="3" fill="#CBD5E1" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "base_solida") => {
      // FASE 1: Base sólida y segura
      if (state === "base_solida") {
        return `<g>
          <rect x="-28" y="36" width="56" height="8" rx="2" fill="#334155" stroke="${S}" stroke-width="3.5"/>
          <rect x="-22" y="18" width="44" height="18" rx="3" fill="#0284C7" stroke="${S}" stroke-width="4"/>
          <text x="0" y="30" text-anchor="middle" font-size="7.5" font-weight="900" fill="#F0F9FF">CIMIENTO</text>
          <rect x="-18" y="-2" width="36" height="18" rx="3" fill="#38BDF8" stroke="${S}" stroke-width="4"/>
          <rect x="-14" y="-22" width="28" height="18" rx="3" fill="#7DD3FC" stroke="${S}" stroke-width="4"/>
          <circle cx="0" cy="-34" r="8" fill="#22C55E" stroke="${S}" stroke-width="3"/>
          <path d="M -4 -34 L -1 -31 L 4 -37" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>`;
      }

      // FASE 2: Torre creciendo (6 bloques, ligera vibración y flechas de compresión)
      if (state === "torre_creciendo") {
        const lean = Math.sin(f * 0.2) * 1.2;
        return `<g>
          <rect x="-26" y="38" width="52" height="6" fill="#334155" stroke="${S}" stroke-width="3"/>
          <rect x="-20" y="24" width="40" height="14" fill="#0284C7" stroke="${S}" stroke-width="3.5"/>
          <rect x="-18" y="10" width="36" height="14" fill="#0369A1" stroke="${S}" stroke-width="3.5"/>
          <rect x="-16" y="-4" width="32" height="14" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/>
          <g transform="rotate(${lean.toFixed(1)} 0 -4)">
            <rect x="-14" y="-18" width="28" height="14" fill="#7DD3FC" stroke="${S}" stroke-width="3.5"/>
            <rect x="-12" y="-32" width="24" height="14" fill="#BAE6FD" stroke="${S}" stroke-width="3.5"/>
            <rect x="-10" y="-46" width="20" height="14" fill="#E0F2FE" stroke="${S}" stroke-width="3.5"/>
          </g>
          <path d="M 0 -50 L 0 -44 M -4 -46 L 0 -42 L 4 -46" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
        </g>`;
      }

      // FASE 3: Estrés crítico (la base cede por fatiga y agrietamiento)
      if (state === "estres_critico") {
        const shake = Math.sin(f * 0.3) * 1.6;
        const tilt = 4.5 + Math.sin(f * 0.22) * 1.5;
        return `<g transform="translate(${shake.toFixed(1)} 0)">
          <rect x="-26" y="38" width="52" height="8" fill="#475569" stroke="${S}" stroke-width="3.5"/>
          <rect x="-20" y="22" width="40" height="16" fill="#DC2626" stroke="${S}" stroke-width="4"/>
          <path d="M -8 22 L -2 30 L -12 34 L -6 38" stroke="#FFE600" stroke-width="3" fill="none"/>
          <path d="M 8 24 L 14 30 L 6 38" stroke="#FFE600" stroke-width="3" fill="none"/>
          <g transform="rotate(${tilt.toFixed(1)} 0 22)">
            <rect x="-18" y="6" width="36" height="16" fill="#F97316" stroke="${S}" stroke-width="3.5"/>
            <rect x="-16" y="-10" width="32" height="16" fill="#FBBF24" stroke="${S}" stroke-width="3.5"/>
            <rect x="-14" y="-26" width="28" height="16" fill="#FEF08A" stroke="${S}" stroke-width="3.5"/>
            <rect x="-12" y="-42" width="24" height="16" fill="#FEF9C3" stroke="${S}" stroke-width="3.5"/>
          </g>
          <rect x="-36" y="-48" width="72" height="16" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="2.5"/>
          <text x="0" y="-37" text-anchor="middle" font-size="7" font-weight="900" fill="#FFE600">¡TENSIÓN CRÍTICA!</text>
        </g>`;
      }

      // FASE 4: Desmoronamiento total (los bloques caen y se dispersan)
      const fall = Math.min(1, Math.max(0, progress));
      const fallY = fall * 45;
      const rotL = fall * -40;
      const rotR = fall * 55;
      return `<g>
        <rect x="-26" y="38" width="52" height="8" fill="#334155" stroke="${S}" stroke-width="3.5"/>
        <path d="M 0 38 L 4 46" stroke="#FFE600" stroke-width="2.5"/>
        <polygon points="-24,36 -2,38 2,42 -22,44" fill="#991B1B" stroke="${S}" stroke-width="3"/>
        <polygon points="4,38 24,35 22,43 2,42" fill="#7F1D1D" stroke="${S}" stroke-width="3"/>
        <g transform="translate(${-fallY * 0.7} ${fallY * 0.8}) rotate(${rotL.toFixed(1)})">
          <rect x="-15" y="-10" width="30" height="14" fill="#EA580C" stroke="${S}" stroke-width="3.5"/>
        </g>
        <g transform="translate(${fallY * 0.8} ${fallY * 0.9}) rotate(${rotR.toFixed(1)})">
          <rect x="-14" y="-8" width="28" height="14" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
        </g>
        <g transform="translate(${fallY * 0.2} ${fallY * 1.1}) rotate(${(rotR * 0.5).toFixed(1)})">
          <rect x="-12" y="-6" width="24" height="12" fill="#EAB308" stroke="${S}" stroke-width="3"/>
        </g>
        <circle cx="-16" cy="30" r="6" fill="#CBD5E1" opacity="0.6"/>
        <circle cx="18" cy="32" r="7" fill="#CBD5E1" opacity="0.6"/>
        <circle cx="0" cy="20" r="8" fill="#CBD5E1" opacity="0.8"/>
      </g>`;
    },
    tags: ["torre", "bloques", "colapso", "derrame", "desmoronamiento", "gravedad", "peso", "ingenieria"],
  },
  puente_resonancia_tacoma: {
    id: "puente_resonancia_tacoma",
    name: "Puente Colgante en Resonancia Armónica",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<line x1="-48" y1="12" x2="48" y2="12" stroke="#1E293B" stroke-width="5"/><line x1="-32" y1="-30" x2="-32" y2="30" stroke="#0F172A" stroke-width="6"/><line x1="32" y1="-30" x2="32" y2="30" stroke="#0F172A" stroke-width="6"/><path d="M -48 0 Q -32 -26 0 -4 Q 32 -26 48 0" stroke="#DC2626" stroke-width="3.5" fill="none"/>`,
    animatedSvg: (f: number, progress = 0, state = "viento_vortices") => {
      // FASE 1: Viento y vórtices alternantes de Von Kármán
      if (state === "viento_vortices") {
        const wave = (f * 0.65) % 30;
        return `<g>
          <line x1="-36" y1="-36" x2="-36" y2="36" stroke="${S}" stroke-width="6"/>
          <line x1="36" y1="-36" x2="36" y2="36" stroke="${S}" stroke-width="6"/>
          <path d="M -50 -10 Q -36 -32 0 -2 Q 36 -32 50 -10" stroke="#EF4444" stroke-width="4" fill="none"/>
          <rect x="-48" y="8" width="96" height="10" rx="2" fill="#334155" stroke="${S}" stroke-width="3.5"/>
          <g transform="translate(${(-30 + wave).toFixed(1)} -12)">
            <path d="M 0 0 C 8 -10 16 2 24 -6" stroke="#38BDF8" stroke-width="3" fill="none" stroke-linecap="round"/>
          </g>
          <g transform="translate(${(-20 + wave).toFixed(1)} 24)">
            <path d="M 0 0 C 8 10 16 -2 24 6" stroke="#38BDF8" stroke-width="3" fill="none" stroke-linecap="round"/>
          </g>
          <text x="0" y="-38" text-anchor="middle" font-size="7.5" font-weight="900" fill="#38BDF8" stroke="${S}" stroke-width="2" paint-order="stroke">VÓRTICES DE VON KÁRMÁN</text>
        </g>`;
      }

      // FASE 2: Oscilación torsional violenta en resonancia
      if (state === "torsion_armonica") {
        const twist = Math.sin(f * 0.14) * 16;
        const waveY = Math.sin(f * 0.14) * 6;
        return `<g>
          <line x1="-36" y1="-36" x2="-36" y2="36" stroke="${S}" stroke-width="6"/>
          <line x1="36" y1="-36" x2="36" y2="36" stroke="${S}" stroke-width="6"/>
          <path d="M -50 -10 Q -36 -32 0 ${(-2 + waveY).toFixed(1)} Q 36 -32 50 -10" stroke="#EF4444" stroke-width="4" fill="none"/>
          <g transform="translate(0 12) rotate(${twist.toFixed(1)})">
            <polygon points="-46,-6 46,6 46,14 -46,2" fill="#E11D48" stroke="${S}" stroke-width="4"/>
            <line x1="-40" y1="-2" x2="40" y2="10" stroke="#FFE600" stroke-width="2.5" stroke-dasharray="6 4"/>
          </g>
          <line x1="-18" y1="-14" x2="${(-18 - waveY).toFixed(1)}" y2="12" stroke="#EF4444" stroke-width="2.5"/>
          <line x1="18" y1="-14" x2="${(18 + waveY).toFixed(1)}" y2="12" stroke="#EF4444" stroke-width="2.5"/>
          <text x="0" y="-40" text-anchor="middle" font-size="8" font-weight="900" fill="#EF4444" stroke="${S}" stroke-width="2" paint-order="stroke">RESONANCIA TORSIONAL</text>
        </g>`;
      }

      // FASE 3: Rotura de cables y caída del tramo central
      const fall = Math.min(1, Math.max(0, progress));
      const fallDrop = fall * 42;
      return `<g>
        <line x1="-36" y1="-36" x2="-36" y2="36" stroke="${S}" stroke-width="6"/>
        <line x1="36" y1="-36" x2="36" y2="36" stroke="${S}" stroke-width="6"/>
        <path d="M -50 -10 L -36 -32 L -20 -15 M -18 -8 L -14 6" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
        <path d="M 50 -10 L 36 -32 L 20 -15 M 18 -8 L 14 6" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
        <polygon points="-48,8 -24,8 -20,16 -48,16" fill="#334155" stroke="${S}" stroke-width="3.5"/>
        <polygon points="48,8 24,8 20,16 48,16" fill="#334155" stroke="${S}" stroke-width="3.5"/>
        <g transform="translate(0 ${(12 + fallDrop).toFixed(1)}) rotate(${(fall * 35).toFixed(1)})">
          <polygon points="-20,-4 20,4 18,12 -22,4" fill="#991B1B" stroke="${S}" stroke-width="4"/>
          <circle cx="-10" cy="-8" r="2.5" fill="#FFE600"/>
          <circle cx="12" cy="14" r="3" fill="#FFE600"/>
        </g>
        <rect x="-42" y="-48" width="84" height="18" rx="4" fill="#450A0A" stroke="#EF4444" stroke-width="2.5"/>
        <text x="0" y="-36" text-anchor="middle" font-size="7.5" font-weight="900" fill="#FFE600">¡COLAPSO ESTRUCTURAL!</text>
      </g>`;
    },
    tags: ["puente", "tacoma_narrows", "resonancia", "vortices", "viento", "colapso", "armonico", "cables"],
  },
  prensa_pandeo_euler: {
    id: "prensa_pandeo_euler",
    name: "Prensa de Pandeo de Euler",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-30" y="-42" width="60" height="14" rx="3" fill="#1E293B" stroke="${S}" stroke-width="4"/><rect x="-30" y="28" width="60" height="14" rx="3" fill="#1E293B" stroke="${S}" stroke-width="4"/><line x1="0" y1="-28" x2="0" y2="28" stroke="#38BDF8" stroke-width="6"/>`,
    animatedSvg: (f: number, progress = 0, state = "columna_intacta") => {
      // FASE 1: Columna intacta bajo carga axial inicial
      if (state === "columna_intacta") {
        return `<g>
          <rect x="-32" y="-44" width="64" height="14" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>
          <rect x="-32" y="30" width="64" height="14" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>
          <line x1="-24" y1="-30" x2="-24" y2="30" stroke="#64748B" stroke-width="5"/>
          <line x1="24" y1="-30" x2="24" y2="30" stroke="#64748B" stroke-width="5"/>
          <rect x="-14" y="-30" width="28" height="10" fill="#F59E0B" stroke="${S}" stroke-width="3"/>
          <line x1="0" y1="-20" x2="0" y2="30" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
          <circle cx="36" cy="-28" r="10" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
          <line x1="36" y1="-28" x2="31" y2="-32" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
          <text x="0" y="41" text-anchor="middle" font-size="7" font-weight="900" fill="#38BDF8">CARGA AXIAL NORMAL</text>
        </g>`;
      }

      // FASE 2: Pandeo lateral de Euler (la columna se arquea sin aplastamiento)
      if (state === "pandeo_lateral") {
        const bow = 16 + Math.sin(f * 0.24) * 2.2;
        return `<g>
          <rect x="-32" y="-44" width="64" height="14" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>
          <rect x="-32" y="30" width="64" height="14" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>
          <line x1="-24" y1="-30" x2="-24" y2="30" stroke="#64748B" stroke-width="5"/>
          <line x1="24" y1="-30" x2="24" y2="30" stroke="#64748B" stroke-width="5"/>
          <rect x="-14" y="-26" width="28" height="10" fill="#DC2626" stroke="${S}" stroke-width="3"/>
          <path d="M 0 -16 Q ${bow.toFixed(1)} 7 0 30" stroke="#EF4444" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M 6 7 L ${(bow + 8).toFixed(1)} 7 M ${(bow + 4).toFixed(1)} 3 L ${(bow + 8).toFixed(1)} 7 L ${(bow + 4).toFixed(1)} 11" stroke="#FFE600" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <circle cx="36" cy="-28" r="10" fill="#FEF2F2" stroke="${S}" stroke-width="3"/>
          <line x1="36" y1="-28" x2="42" y2="-24" stroke="#DC2626" stroke-width="3" stroke-linecap="round"/>
          <text x="0" y="41" text-anchor="middle" font-size="7" font-weight="900" fill="#EF4444">¡PANDEO DE EULER!</text>
        </g>`;
      }

      // FASE 3: Fractura plástica y estallido
      return `<g>
        <rect x="-32" y="-44" width="64" height="14" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>
        <rect x="-32" y="30" width="64" height="14" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>
        <line x1="-24" y1="-30" x2="-24" y2="30" stroke="#64748B" stroke-width="5"/>
        <line x1="24" y1="-30" x2="24" y2="30" stroke="#64748B" stroke-width="5"/>
        <rect x="-14" y="-22" width="28" height="10" fill="#991B1B" stroke="${S}" stroke-width="3"/>
        <line x1="0" y1="-12" x2="16" y2="6" stroke="#991B1B" stroke-width="6" stroke-linecap="round"/>
        <line x1="16" y1="8" x2="0" y2="30" stroke="#991B1B" stroke-width="6" stroke-linecap="round"/>
        <polygon points="16,7 22,2 20,9 26,8 19,13 23,17 15,12" fill="#FFE600" stroke="${S}" stroke-width="1.5"/>
        <text x="0" y="41" text-anchor="middle" font-size="7" font-weight="900" fill="#FFE600">FRACTURA POR INESTABILIDAD</text>
      </g>`;
    },
    tags: ["prensa", "pandeo", "euler", "compresion", "columna", "esbeltez", "rotura", "acero"],
  },
  amortiguador_masa_tmd: {
    id: "amortiguador_masa_tmd",
    name: "Amortiguador de Masa Sintonizada (Taipei 101)",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-32" y="-40" width="64" height="80" rx="8" fill="#0F172A" stroke="${S}" stroke-width="4"/><circle cx="0" cy="4" r="18" fill="#FACC15" stroke="${S}" stroke-width="4.5"/><line x1="-8" y1="-40" x2="-6" y2="-10" stroke="#94A3B8" stroke-width="3"/><line x1="8" y1="-40" x2="6" y2="-10" stroke="#94A3B8" stroke-width="3"/>`,
    animatedSvg: (f: number, progress = 0, state = "pendulo_en_contrafase") => {
      // FASE 1: Edificio oscilando sin control
      if (state === "edificio_oscilante") {
        const buildingSway = Math.sin(f * 0.12) * 9;
        return `<g transform="rotate(${buildingSway.toFixed(1)} 0 40)">
          <rect x="-28" y="-42" width="56" height="82" rx="6" fill="#1E293B" stroke="${S}" stroke-width="4.5"/>
          <line x1="-24" y1="-36" x2="24" y2="0" stroke="#334155" stroke-width="3"/>
          <line x1="24" y1="-36" x2="-24" y2="0" stroke="#334155" stroke-width="3"/>
          <line x1="-24" y1="0" x2="24" y2="36" stroke="#334155" stroke-width="3"/>
          <line x1="24" y1="0" x2="-24" y2="36" stroke="#334155" stroke-width="3"/>
          <path d="M -48 -20 Q -36 -28 -24 -20" stroke="#38BDF8" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M -44 10 Q -32 2 -20 10" stroke="#38BDF8" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <text x="0" y="-47" text-anchor="middle" font-size="7" font-weight="900" fill="#EF4444">VIENTO HURACANADO</text>
        </g>`;
      }

      // FASE 2: Péndulo en contrafase absorbiendo la energía (TMD activo)
      if (state === "pendulo_en_contrafase") {
        const sway = Math.sin(f * 0.12) * 6;
        const ballShift = -Math.sin(f * 0.12) * 13;
        return `<g transform="rotate(${sway.toFixed(1)} 0 40)">
          <rect x="-30" y="-44" width="60" height="84" rx="8" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>
          <line x1="-12" y1="-44" x2="${(ballShift * 0.6 - 4).toFixed(1)}" y2="-8" stroke="#E2E8F0" stroke-width="3"/>
          <line x1="12" y1="-44" x2="${(ballShift * 0.6 + 4).toFixed(1)}" y2="-8" stroke="#E2E8F0" stroke-width="3"/>
          <g transform="translate(${ballShift.toFixed(1)} 4)">
            <circle cx="0" cy="0" r="16" fill="#FACC15" stroke="${S}" stroke-width="4.5"/>
            <path d="M -8 -8 A 12 12 0 0 1 6 -11" stroke="#FEF08A" stroke-width="3" stroke-linecap="round" fill="none"/>
            <text x="0" y="3" text-anchor="middle" font-size="6.5" font-weight="900" fill="#713F12">660 t</text>
          </g>
          <line x1="-24" y1="28" x2="${(ballShift - 6).toFixed(1)}" y2="16" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/>
          <line x1="24" y1="28" x2="${(ballShift + 6).toFixed(1)}" y2="16" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/>
          <rect x="-36" y="-54" width="72" height="15" rx="3" fill="#0369A1" stroke="${S}" stroke-width="2"/>
          <text x="0" y="-44" text-anchor="middle" font-size="6.5" font-weight="900" fill="#FDE047">CONTRAFASE ARMÓNICA</text>
        </g>`;
      }

      // FASE 3: Estabilización armónica (40% menos oscilación)
      const calmSway = Math.sin(f * 0.1) * 2;
      return `<g transform="rotate(${calmSway.toFixed(1)} 0 40)">
        <rect x="-30" y="-44" width="60" height="84" rx="8" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>
        <line x1="-10" y1="-44" x2="-4" y2="-8" stroke="#E2E8F0" stroke-width="3"/>
        <line x1="10" y1="-44" x2="4" y2="-8" stroke="#E2E8F0" stroke-width="3"/>
        <circle cx="0" cy="4" r="16" fill="#FACC15" stroke="${S}" stroke-width="4.5"/>
        <circle cx="0" cy="4" r="${(20 + (f % 16)).toFixed(1)}" stroke="#38BDF8" stroke-width="2" fill="none" opacity="${(1 - (f % 16) / 16).toFixed(2)}"/>
        <line x1="-24" y1="28" x2="-6" y2="16" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/>
        <line x1="24" y1="28" x2="6" y2="16" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/>
        <rect x="-44" y="-54" width="88" height="16" rx="4" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="7" font-weight="900" fill="#A7F3D0">-40% DE OSCILACIÓN</text>
      </g>`;
    },
    tags: ["amortiguador", "pendulo", "tmd", "taipei_101", "rascacielos", "viento", "sismo", "resonancia"],
  },
  puente_piedra_escala: {
    id: "puente_piedra_escala",
    name: "Puente de Piedra: Escala 1x vs 2x",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -44 26 L -44 -6 L 44 -6 L 44 26 L 24 26 A 24 22 0 0 0 -24 26 Z" fill="#64748B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "puente_1x_carreta") => {
      if (state === "puente_1x_carreta") {
        const cartX = -22 + ((f * 0.55) % 44);
        return `<g>
          <rect x="-46" y="24" width="92" height="12" fill="#0284C7"/>
          <path d="M -36 24 L -36 0 L 36 0 L 36 24 L 18 24 A 18 16 0 0 0 -18 24 Z" fill="#94A3B8" stroke="${S}" stroke-width="4"/>
          <g transform="translate(${cartX.toFixed(1)}, -10)">
            <rect x="-10" y="-6" width="20" height="8" rx="2" fill="#D97706" stroke="${S}" stroke-width="2.5"/>
            <circle cx="-6" cy="4" r="4" fill="#1E293B" stroke="${S}" stroke-width="2"/>
            <circle cx="6" cy="4" r="4" fill="#1E293B" stroke="${S}" stroke-width="2"/>
          </g>
          <rect x="-40" y="-36" width="80" height="16" rx="4" fill="#065F46" stroke="${S}" stroke-width="2.5"/>
          <text x="0" y="-25" text-anchor="middle" font-size="6.8" font-weight="900" fill="#A7F3D0">PUENTE 1X: ESTABLE</text>
        </g>`;
      }
      if (state === "puente_2x_gigante") {
        const tremor = Math.sin(f * 0.26) * 1.1;
        return `<g transform="translate(${tremor.toFixed(1)}, 0)">
          <rect x="-54" y="28" width="108" height="12" fill="#0284C7"/>
          <path d="M -50 28 L -50 -16 L 50 -16 L 50 28 L 28 28 A 28 26 0 0 0 -28 28 Z" fill="#64748B" stroke="${S}" stroke-width="4.5"/>
          <path d="M -4 2 L 2 -8 L -2 -16" stroke="#EF4444" stroke-width="3" fill="none"/>
          <path d="M 0 -30 L 0 -18 M -5 -22 L 0 -17 L 5 -22" stroke="#EF4444" stroke-width="3.5" fill="none"/>
          <rect x="-46" y="-48" width="92" height="17" rx="4" fill="#7C2D12" stroke="#EF4444" stroke-width="2.5"/>
          <text x="0" y="-37" text-anchor="middle" font-size="6.8" font-weight="900" fill="#FDE047">ESCALA 2X: PESO ×8</text>
        </g>`;
      }
      const drop = Math.min(1, progress) * 26;
      return `<g>
        <rect x="-54" y="28" width="108" height="12" fill="#0284C7"/>
        <polygon points="-50,28 -50,-10 -24,-6 -28,28" fill="#475569" stroke="${S}" stroke-width="4"/>
        <polygon points="50,28 50,-10 24,-6 28,28" fill="#475569" stroke="${S}" stroke-width="4"/>
        <g transform="translate(0, ${drop.toFixed(1)}) rotate(${(progress * 18).toFixed(1)})">
          <rect x="-22" y="-12" width="44" height="18" rx="3" fill="#DC2626" stroke="${S}" stroke-width="3.5"/>
          <path d="M -8 -12 L 4 6" stroke="#FFE600" stroke-width="3"/>
        </g>
        <rect x="-48" y="-46" width="96" height="17" rx="4" fill="#450A0A" stroke="#EF4444" stroke-width="2.5"/>
        <text x="0" y="-35" text-anchor="middle" font-size="6.8" font-weight="900" fill="#FFE600">¡DERRUMBE POR PROPIO PESO!</text>
      </g>`;
    },
    tags: ["puente", "piedra", "escala", "colapso", "carreta"],
  },
  galeon_venecia_galileo: {
    id: "galeon_venecia_galileo",
    name: "Galeón del Arsenal de Venecia (Galileo 1638)",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<path d="M -40 4 L 40 4 L 26 26 L -26 26 Z" fill="#92400E" stroke="${S}" stroke-width="4"/><line x1="0" y1="-34" x2="0" y2="4" stroke="#78350F" stroke-width="5"/>`,
    animatedSvg: (f: number, progress = 0, state = "barco_normal_estable") => {
      const bob = Math.sin(f / 8) * 2;
      if (state === "barco_normal_estable") {
        return `<g transform="translate(0, ${bob.toFixed(1)})">
          <rect x="-48" y="20" width="96" height="14" fill="#0284C7"/>
          <path d="M -32 6 L 32 6 L 22 24 L -22 24 Z" fill="#B45309" stroke="${S}" stroke-width="4"/>
          <line x1="0" y1="-26" x2="0" y2="6" stroke="#78350F" stroke-width="4.5"/>
          <polygon points="0,-24 22,-10 0,-2" fill="#F8FAFC" stroke="${S}" stroke-width="3"/>
          <rect x="-42" y="-44" width="84" height="15" rx="4" fill="#065F46" stroke="${S}" stroke-width="2.5"/>
          <text x="0" y="-34" text-anchor="middle" font-size="6.5" font-weight="900" fill="#A7F3D0">NAVE NORMAL: CASCO ÍNTEGRO</text>
        </g>`;
      }
      if (state === "galeon_gigante_fractura") {
        const split = 6 + Math.min(1, progress) * 10;
        return `<g>
          <rect x="-54" y="24" width="108" height="14" fill="#0284C7"/>
          <g transform="translate(-4, 0) rotate(${(-split).toFixed(1)} -10 18)">
            <path d="M -48 0 L 0 0 L -2 24 L -34 24 Z" fill="#92400E" stroke="${S}" stroke-width="4"/>
            <line x1="-18" y1="-32" x2="-18" y2="0" stroke="#78350F" stroke-width="4.5"/>
          </g>
          <g transform="translate(4, 0) rotate(${split.toFixed(1)} 10 18)">
            <path d="M 0 0 L 48 0 L 34 24 L 2 24 Z" fill="#92400E" stroke="${S}" stroke-width="4"/>
            <line x1="18" y1="-32" x2="18" y2="0" stroke="#78350F" stroke-width="4.5"/>
          </g>
          <path d="M 0 -4 L -5 10 L 5 18 L 0 28" stroke="#FFE600" stroke-width="3.5" fill="none"/>
          <rect x="-48" y="-48" width="96" height="16" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="2.5"/>
          <text x="0" y="-37" text-anchor="middle" font-size="6.5" font-weight="900" fill="#FFE600">BUQUE GIGANTE: QUILLA PARTIDA</text>
        </g>`;
      }
      return `<g>
        <rect x="-46" y="-28" width="92" height="62" rx="6" fill="#0F172A" stroke="#38BDF8" stroke-width="3.5"/>
        <text x="0" y="-12" text-anchor="middle" font-size="8" font-weight="900" fill="#38BDF8">ÁREA ∝ L² (×4)</text>
        <text x="0" y="6" text-anchor="middle" font-size="8.5" font-weight="900" fill="#EF4444">PESO ∝ L³ (×8)</text>
        <text x="0" y="22" text-anchor="middle" font-size="7" font-weight="900" fill="#FFE600">GALILEO GALILEI (1638)</text>
      </g>`;
    },
    tags: ["galileo", "venecia", "barco", "galeon", "arsenal", "1638"],
  },
  biomecanica_femur_escala: {
    id: "biomecanica_femur_escala",
    name: "Biomecánica: Lagartija 10x vs Fémur de Elefante",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-36" y="-30" width="72" height="60" rx="6" fill="#1E293B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "lagartija_1x_agil") => {
      if (state === "lagartija_1x_agil") {
        return `<g>
          <ellipse cx="0" cy="6" rx="22" ry="9" fill="#22C55E" stroke="${S}" stroke-width="3.5"/>
          <circle cx="24" cy="2" r="7" fill="#22C55E" stroke="${S}" stroke-width="3.5"/>
          <path d="M -20 6 Q -38 2 -44 -8" stroke="#22C55E" stroke-width="5" fill="none" stroke-linecap="round"/>
          <line x1="-12" y1="14" x2="-16" y2="26" stroke="#15803D" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="12" y1="14" x2="16" y2="26" stroke="#15803D" stroke-width="3.5" stroke-linecap="round"/>
          <rect x="-44" y="-42" width="88" height="16" rx="4" fill="#065F46" stroke="${S}" stroke-width="2.5"/>
          <text x="0" y="-31" text-anchor="middle" font-size="6.8" font-weight="900" fill="#A7F3D0">ESCALA 1X: HUESOS LIGEROS</text>
        </g>`;
      }
      if (state === "monstruo_10x_femur_roto") {
        const shake = Math.sin(f * 0.28) * 1.4;
        return `<g transform="translate(${shake.toFixed(1)}, 0)">
          <ellipse cx="0" cy="-4" rx="38" ry="18" fill="#DC2626" stroke="${S}" stroke-width="4"/>
          <circle cx="38" cy="-12" r="13" fill="#DC2626" stroke="${S}" stroke-width="4"/>
          <!-- Fémures quebrándose -->
          <path d="M -18 12 L -24 22 L -14 32" stroke="#FEF08A" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M 18 12 L 24 22 L 14 32" stroke="#FEF08A" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M -28 20 L -10 24 M 10 24 L 28 20" stroke="#EF4444" stroke-width="3.5"/>
          <rect x="-48" y="-48" width="96" height="17" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="2.5"/>
          <text x="0" y="-37" text-anchor="middle" font-size="6.5" font-weight="900" fill="#FFE600">ESCALA 10X: MASA ×1000 (FRACTURA)</text>
        </g>`;
      }
      return `<g>
        <!-- Comparativa Pata de Elefante (Columna Dórica) vs Pata de Hormiga -->
        <rect x="-38" y="-18" width="30" height="46" rx="4" fill="#94A3B8" stroke="${S}" stroke-width="4"/>
        <rect x="-42" y="-24" width="38" height="8" rx="2" fill="#CBD5E1" stroke="${S}" stroke-width="3.5"/>
        <text x="-23" y="38" text-anchor="middle" font-size="6" font-weight="900" fill="#F8FAFC">ELEFANTE</text>
        <line x1="24" y1="-10" x2="28" y2="8" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
        <line x1="28" y1="8" x2="20" y2="28" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/>
        <text x="24" y="38" text-anchor="middle" font-size="6" font-weight="900" fill="#FDE047">HORMIGA</text>
        <rect x="-46" y="-48" width="92" height="16" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
        <text x="0" y="-37" text-anchor="middle" font-size="6.5" font-weight="900" fill="#38BDF8">COLUMNAS DÓRICAS VS HILOS</text>
      </g>`;
    },
    tags: ["godzilla", "lagartija", "femur", "elefante", "hormiga", "biomecanica"],
  },
  piramide_vs_nucleo_rascacielos: {
    id: "piramide_vs_nucleo_rascacielos",
    name: "Casa Inflada vs Pirámide vs Rascacielos de Núcleo Hueco",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<polygon points="0,-32 -36,28 36,28" fill="#F59E0B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "casa_inflada_aplastada") => {
      if (state === "casa_inflada_aplastada") {
        const crush = Math.sin(f * 0.26) * 1.1;
        return `<g transform="translate(${crush.toFixed(1)}, 0)">
          <polygon points="0,-38 -36,-14 36,-14" fill="#DC2626" stroke="${S}" stroke-width="4"/>
          <rect x="-28" y="-14" width="56" height="42" fill="#FCA5A5" stroke="${S}" stroke-width="4"/>
          <path d="M -20 28 L -12 12 L -4 28 M 10 28 L 18 14 L 24 28" stroke="#EF4444" stroke-width="3.5" fill="none"/>
          <rect x="-48" y="-54" width="96" height="15" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-44" text-anchor="middle" font-size="6.3" font-weight="900" fill="#FFE600">CASA INFLADA 300 M: COLAPSA</text>
        </g>`;
      }
      if (state === "piramide_base_ancha") {
        return `<g>
          <polygon points="0,-28 -46,28 46,28" fill="#D97706" stroke="${S}" stroke-width="4.5"/>
          <line x1="0" y1="-28" x2="12" y2="28" stroke="${S}" stroke-width="3"/>
          <rect x="-46" y="-48" width="92" height="15" rx="4" fill="#78350F" stroke="#F59E0B" stroke-width="2"/>
          <text x="0" y="-38" text-anchor="middle" font-size="6.5" font-weight="900" fill="#FEF08A">PIRÁMIDE: BASE COLOSAL MACIZA</text>
        </g>`;
      }
      return `<g>
        <rect x="-24" y="-36" width="48" height="68" rx="3" fill="#1E293B" stroke="#38BDF8" stroke-width="4"/>
        <!-- Núcleo central reforzado y geometría hueca -->
        <rect x="-8" y="-34" width="16" height="64" fill="#F59E0B" stroke="${S}" stroke-width="3"/>
        <line x1="-24" y1="-14" x2="24" y2="-14" stroke="#38BDF8" stroke-width="2.5"/>
        <line x1="-24" y1="8" x2="24" y2="8" stroke="#38BDF8" stroke-width="2.5"/>
        <rect x="-48" y="-54" width="96" height="15" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
        <text x="0" y="-44" text-anchor="middle" font-size="6.5" font-weight="900" fill="#38BDF8">NÚCLEO HUECO HIPERCONCENTRADO</text>
      </g>`;
    },
    tags: ["piramide", "rascacielos", "nucleo", "columnas", "acero"],
  },
  cercha_tubular_antipandeo: {
    id: "cercha_tubular_antipandeo",
    name: "Cercha Diagonal y Tubo Estructural Anti-Pandeo",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-36" width="48" height="72" fill="none" stroke="#38BDF8" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "columna_esbelta_cede") => {
      if (state === "columna_esbelta_cede") {
        const bend = 18 + Math.sin(f * 0.22) * 2.5;
        return `<g>
          <path d="M 0 -34 Q ${bend.toFixed(1)} 0 0 34" stroke="#EF4444" stroke-width="6" fill="none" stroke-linecap="round"/>
          <rect x="-46" y="-50" width="92" height="15" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-40" text-anchor="middle" font-size="6.5" font-weight="900" fill="#FFE600">ALTURA ×2 → RESISTENCIA 1/4</text>
        </g>`;
      }
      return `<g>
        <rect x="-26" y="-36" width="52" height="70" rx="3" fill="#0F172A" stroke="#38BDF8" stroke-width="4.5"/>
        <!-- Celosía diagonal triangulada (Cercha) -->
        <line x1="-26" y1="-36" x2="26" y2="-12" stroke="#FACC15" stroke-width="4"/>
        <line x1="26" y1="-12" x2="-26" y2="12" stroke="#FACC15" stroke-width="4"/>
        <line x1="-26" y1="12" x2="26" y2="34" stroke="#FACC15" stroke-width="4"/>
        <line x1="26" y1="-36" x2="-26" y2="-12" stroke="#38BDF8" stroke-width="3"/>
        <line x1="-26" y1="-12" x2="26" y2="12" stroke="#38BDF8" stroke-width="3"/>
        <rect x="-48" y="-54" width="96" height="15" rx="4" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-44" text-anchor="middle" font-size="6.5" font-weight="900" fill="#A7F3D0">CERCHA TRIANGULADA ANTIPANDEO</text>
      </g>`;
    },
    tags: ["cercha", "celosia", "euler", "pandeo", "tubo_estructural"],
  },
  onda_resonancia_fatiga: {
    id: "onda_resonancia_fatiga",
    name: "Onda de Resonancia Armónica y Fatiga del Acero",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -40 0 Q -20 -30 0 0 T 40 0" stroke="#EF4444" stroke-width="5" fill="none"/>`,
    animatedSvg: (f: number, progress = 0, state = "frecuencia_natural") => {
      const phase = f * 0.14;
      if (state === "frecuencia_natural") {
        const amp = 10 + progress * 22;
        return `<g>
          <rect x="-48" y="-32" width="96" height="64" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="3.5"/>
          <path d="M -40 0 Q -20 ${(-amp * Math.sin(phase)).toFixed(1)} 0 0 T 40 0" stroke="#38BDF8" stroke-width="4.5" fill="none"/>
          <text x="0" y="-39" text-anchor="middle" font-size="6.8" font-weight="900" fill="#38BDF8">SINCRONÍA CON FRECUENCIA NATURAL</text>
        </g>`;
      }
      const bigAmp = 28 * Math.sin(phase);
      return `<g>
        <rect x="-48" y="-32" width="96" height="64" rx="8" fill="#1E293B" stroke="#EF4444" stroke-width="4"/>
        <path d="M -40 0 Q -20 ${(-bigAmp).toFixed(1)} 0 0 T 40 0" stroke="#EF4444" stroke-width="5.5" fill="none"/>
        <!-- Grieta propagándose en viga de acero -->
        <path d="M -6 32 L 2 14 L -4 4 L 6 -12" stroke="#FFE600" stroke-width="3.5" fill="none"/>
        <text x="0" y="-39" text-anchor="middle" font-size="6.8" font-weight="900" fill="#FFE600">FATIGA CRÍTICA EN EL ACERO</text>
      </g>`;
    },
    tags: ["resonancia", "onda", "frecuencia", "fatiga", "acero"],
  },
  rascacielos_espiral_viento: {
    id: "rascacielos_espiral_viento",
    name: "Burj Khalifa Escalonado y Torre de Shanghái en Espiral (120°)",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<polygon points="0,-46 -18,34 18,34" fill="#38BDF8" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "burj_khalifa_escalonado") => {
      const flow = (f * 0.75) % 24;
      if (state === "burj_khalifa_escalonado") {
        return `<g>
          <!-- Silueta escalonada del Burj Khalifa -->
          <rect x="-24" y="12" width="48" height="24" fill="#0284C7" stroke="${S}" stroke-width="3.5"/>
          <rect x="-18" y="-8" width="36" height="20" fill="#0369A1" stroke="${S}" stroke-width="3.5"/>
          <rect x="-11" y="-26" width="22" height="18" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/>
          <polygon points="0,-46 -5,-26 5,-26" fill="#E0F2FE" stroke="${S}" stroke-width="3"/>
          <path d="M ${(-42 + flow).toFixed(1)} -14 Q -26 -22 -14 -14" stroke="#7DD3FC" stroke-width="3" fill="none"/>
          <path d="M ${(16 + flow * 0.6).toFixed(1)} 4 Q 30 12 42 4" stroke="#7DD3FC" stroke-width="3" fill="none"/>
          <rect x="-48" y="-58" width="96" height="15" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
          <text x="0" y="-48" text-anchor="middle" font-size="6.4" font-weight="900" fill="#38BDF8">BURJ KHALIFA: RETRANQUEO EN ESPIRAL</text>
        </g>`;
      }
      // Torre de Shanghái con torsión de 120 grados
      return `<g>
        <path d="M -22 34 C -26 10 -10 -15 -16 -38 L 16 -38 C 22 -15 6 10 22 34 Z" fill="#06B6D4" stroke="${S}" stroke-width="4"/>
        <path d="M -18 34 C -4 10 8 -14 12 -38" stroke="#FEF08A" stroke-width="3.5" fill="none" stroke-dasharray="6 4"/>
        <rect x="-48" y="-54" width="96" height="15" rx="4" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-44" text-anchor="middle" font-size="6.4" font-weight="900" fill="#A7F3D0">TORRE SHANGHÁI: GIRO 120° (-24% VIENTO)</text>
      </g>`;
    },
    tags: ["burj_khalifa", "shanghai_tower", "espiral", "aerodinamica", "viento"],
  },
  torre_abertura_viento: {
    id: "torre_abertura_viento",
    name: "Centro Financiero de Shanghái (Abertura Trapezoidal Antiviento)",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-40" width="48" height="76" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "abertura_trapezoidal_flujo") => {
      const windX = -38 + ((f * 0.85) % 76);
      if (state === "efecto_vela_bloqueado") {
        const push = Math.sin(f * 0.22) * 2.5;
        return `<g transform="rotate(${push.toFixed(1)} 0 36)">
          <rect x="-24" y="-38" width="48" height="74" fill="#DC2626" stroke="${S}" stroke-width="4"/>
          <path d="M -48 -18 L -28 -18 M -48 0 L -28 0" stroke="#FFE600" stroke-width="4" stroke-linecap="round"/>
          <rect x="-48" y="-54" width="96" height="15" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-44" text-anchor="middle" font-size="6.4" font-weight="900" fill="#FFE600">MURO CIEGO: EFECTO VELA PELIGROSO</text>
        </g>`;
      }
      return `<g>
        <!-- Torre SWFC con abertura trapezoidal superior -->
        <path d="M -24 36 L -20 -40 L 20 -40 L 24 36 Z" fill="#0284C7" stroke="${S}" stroke-width="4.5"/>
        <polygon points="-13,-32 13,-32 10,-14 -10,-14" fill="#090D16" stroke="#38BDF8" stroke-width="3.5"/>
        <!-- Flujo de viento atravesando limpiamente la abertura -->
        <line x1="${windX.toFixed(1)}" y1="-23" x2="${(windX + 24).toFixed(1)}" y2="-23" stroke="#FFE600" stroke-width="4" stroke-linecap="round"/>
        <rect x="-48" y="-56" width="96" height="15" rx="4" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-46" text-anchor="middle" font-size="6.4" font-weight="900" fill="#A7F3D0">ABERTURA A 500 M: VIENTO PASANTE</text>
      </g>`;
    },
    tags: ["shanghai", "swfc", "abridor_botellas", "abertura", "viento", "rascacielos"],
  },
  pistones_hidraulicos_tmd: {
    id: "pistones_hidraulicos_tmd",
    name: "Pistones Hidráulicos de Disipación Térmica (Taipei 101)",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="-4" r="18" fill="#FACC15" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "compresion_hidraulica_calor") => {
      const shift = Math.sin(f * 0.14) * 10;
      if (state === "compresion_hidraulica_calor") {
        return `<g>
          <rect x="-42" y="-36" width="84" height="68" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="3.5"/>
          <circle cx="${shift.toFixed(1)}" cy="-6" r="16" fill="#FACC15" stroke="${S}" stroke-width="4"/>
          <!-- Cilindros hidráulicos laterales brillando en rojo/naranja al disipar calor -->
          <rect x="-38" y="10" width="24" height="10" rx="3" fill="#EF4444" stroke="${S}" stroke-width="3"/>
          <rect x="14" y="10" width="24" height="10" rx="3" fill="#EF4444" stroke="${S}" stroke-width="3"/>
          <line x1="-14" y1="15" x2="${shift.toFixed(1)}" y2="6" stroke="#FFE600" stroke-width="4"/>
          <line x1="14" y1="15" x2="${shift.toFixed(1)}" y2="6" stroke="#FFE600" stroke-width="4"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.5" font-weight="900" fill="#F97316">ENERGÍA MECÁNICA → CALOR INOCUO</text>
        </g>`;
      }
      return `<g>
        <rect x="-42" y="-36" width="84" height="68" rx="8" fill="#0F172A" stroke="#10B981" stroke-width="4"/>
        <circle cx="0" cy="-6" r="16" fill="#FACC15" stroke="${S}" stroke-width="4"/>
        <rect x="-36" y="10" width="22" height="10" rx="3" fill="#10B981" stroke="${S}" stroke-width="3"/>
        <rect x="14" y="10" width="22" height="10" rx="3" fill="#10B981" stroke="${S}" stroke-width="3"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.8" font-weight="900" fill="#4ADE80">ESTABILIDAD TOTAL (-40% BALANCEO)</text>
      </g>`;
    },
    tags: ["pistones", "hidraulico", "calor", "amortiguador", "taipei_101"],
  },
  cable_longitud_rotura_5km: {
    id: "cable_longitud_rotura_5km",
    name: "Longitud de Rotura del Acero (5 km) vs Nanotubos",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="-38" x2="0" y2="38" stroke="#94A3B8" stroke-width="8"/>`,
    animatedSvg: (f: number, progress = 0, state = "cable_acero_colgando") => {
      if (state === "cable_acero_colgando") {
        return `<g>
          <rect x="-36" y="-42" width="72" height="10" rx="3" fill="#334155" stroke="${S}" stroke-width="3.5"/>
          <line x1="0" y1="-32" x2="0" y2="32" stroke="#94A3B8" stroke-width="9"/>
          <text x="26" y="0" font-size="7.5" font-weight="900" fill="#38BDF8">5.0 km</text>
          <rect x="-48" y="-58" width="96" height="14" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
          <text x="0" y="-48" text-anchor="middle" font-size="6.4" font-weight="900" fill="#38BDF8">CABLE DE ACERO BAJO SU PROPIO PESO</text>
        </g>`;
      }
      const snapDrop = Math.min(1, progress) * 18;
      return `<g>
        <rect x="-36" y="-42" width="72" height="10" rx="3" fill="#334155" stroke="${S}" stroke-width="3.5"/>
        <!-- Cable de acero roto a los 5 km a la izquierda y fibra de carbono intacta a la derecha -->
        <line x1="-16" y1="-32" x2="-16" y2="-6" stroke="#EF4444" stroke-width="8"/>
        <line x1="-16" y1="${(6 + snapDrop).toFixed(1)}" x2="-16" y2="${(30 + snapDrop).toFixed(1)}" stroke="#EF4444" stroke-width="8"/>
        <path d="M -24 0 L -8 0" stroke="#FFE600" stroke-width="3.5"/>
        <line x1="18" y1="-32" x2="18" y2="32" stroke="#22D3EE" stroke-width="6" stroke-dasharray="4 2"/>
        <rect x="-48" y="-58" width="96" height="14" rx="4" fill="#450A0A" stroke="#EF4444" stroke-width="2"/>
        <text x="0" y="-48" text-anchor="middle" font-size="6.4" font-weight="900" fill="#FFE600">LÍMITE DE ROTURA: ACERO 5 KM</text>
      </g>`;
    },
    tags: ["cable", "acero", "longitud_rotura", "5km", "titanio", "nanotubos"],
  },
  evolucion_geometria_estructural: {
    id: "evolucion_geometria_estructural",
    name: "Síntesis: De la Fuerza Bruta a la Geometría Inteligente",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="0,-38 -28,32 28,32" fill="#38BDF8" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "ingenieria_inteligente_triunfo") => {
      const pulse = 1 + Math.sin(f / 8) * 0.04;
      if (state === "fuerza_bruta_colapso") {
        return `<g>
          <rect x="-32" y="-22" width="64" height="54" fill="#DC2626" stroke="${S}" stroke-width="4"/>
          <path d="M -18 -22 L 8 32 M 18 -10 L -12 32" stroke="#FFE600" stroke-width="3.5"/>
          <text x="0" y="-30" text-anchor="middle" font-size="7" font-weight="900" fill="#EF4444">FUERZA BRUTA = COLAPSO</text>
        </g>`;
      }
      return `<g transform="scale(${pulse.toFixed(3)})">
        <polygon points="0,-42 -26,32 26,32" fill="#0284C7" stroke="${S}" stroke-width="4.5"/>
        <line x1="-14" y1="-4" x2="14" y2="-4" stroke="#FFE600" stroke-width="3.5"/>
        <line x1="-20" y1="14" x2="20" y2="14" stroke="#FFE600" stroke-width="3.5"/>
        <circle cx="0" cy="-16" r="7" fill="#FACC15" stroke="${S}" stroke-width="3"/>
        <rect x="-48" y="-58" width="96" height="15" rx="4" fill="#065F46" stroke="#10B981" stroke-width="2.5"/>
        <text x="0" y="-47" text-anchor="middle" font-size="6.6" font-weight="900" fill="#FEF08A">GEOMETRÍA + FÍSICA = ETERNIDAD</text>
      </g>`;
    },
    tags: ["geometria", "ingenieria", "sintesis", "triunfo", "estructuras"],
  },

  // ===========================================================================
  // DOCUMENTAL: CONTAMINACIÓN LUMÍNICA GLOBAL Y RECUPERACIÓN DE LA OSCURIDAD
  // ===========================================================================

  cielo_milkyway_revelacion: {
    id: "cielo_milkyway_revelacion",
    name: "Revelación de la Vía Láctea en el Apagón de Los Ángeles 1994",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-45" y="-45" width="90" height="90" rx="10" fill="#0B132B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "via_lactea_resplandeciente") => {
      const pulse = 1 + Math.sin(f * 0.16) * 0.03;
      if (state === "bruma_anaranjada_ciega") {
        return `<g>
          <rect x="-46" y="-42" width="92" height="84" rx="8" fill="#451A03" stroke="${S}" stroke-width="4"/>
          <ellipse cx="0" cy="10" rx="38" ry="24" fill="#D97706" opacity="0.6"/>
          <circle cx="-16" cy="-12" r="14" fill="#F59E0B" opacity="0.45"/>
          <text x="0" y="-24" text-anchor="middle" font-size="6.8" font-weight="900" fill="#FDE047">CIELO SATURADO: BORTLE 9</text>
          <text x="0" y="28" text-anchor="middle" font-size="6" font-weight="900" fill="#EF4444">0 ESTRELLAS VISIBLES</text>
          <line x1="-32" y1="36" x2="32" y2="36" stroke="#EF4444" stroke-width="3"/>
        </g>`;
      }
      if (state === "apagon_repentino_corte") {
        const flicker = Math.sin(f * 0.22) > 0 ? 0.9 : 0.4;
        return `<g>
          <rect x="-46" y="-42" width="92" height="84" rx="8" fill="#020617" stroke="#38BDF8" stroke-width="4"/>
          <polygon points="-8,-18 12,-18 -2,0 10,0 -6,22 0,4 -10,4" fill="#FFE600" stroke="${S}" stroke-width="2.5" opacity="${flicker}"/>
          <text x="0" y="-26" text-anchor="middle" font-size="6.5" font-weight="900" fill="#FFE600">TERREMOTO 1994: APAGÓN TOTAL</text>
          <text x="0" y="32" text-anchor="middle" font-size="5.8" font-weight="900" fill="#38BDF8">RED ELÉCTRICA CAÍDA</text>
        </g>`;
      }
      // via_lactea_resplandeciente
      return `<g transform="scale(${pulse.toFixed(3)})">
        <rect x="-46" y="-42" width="92" height="84" rx="8" fill="#02040A" stroke="#38BDF8" stroke-width="4.5"/>
        {/* Banda de la Vía Láctea */}
        <ellipse cx="0" cy="0" rx="42" ry="14" transform="rotate(-30 0 0)" fill="#6366F1" opacity="0.7"/>
        <ellipse cx="0" cy="0" rx="36" ry="8" transform="rotate(-30 0 0)" fill="#A855F7" opacity="0.6"/>
        <ellipse cx="0" cy="0" rx="20" ry="4" transform="rotate(-30 0 0)" fill="#E0F2FE" opacity="0.8"/>
        {/* Estrellas nítidas */}
        <circle cx="-28" cy="-24" r="1.8" fill="#FFE600"/>
        <circle cx="26" cy="22" r="1.8" fill="#FFE600"/>
        <circle cx="-22" cy="18" r="1.4" fill="#FFFFFF"/>
        <circle cx="28" cy="-18" r="1.6" fill="#FFFFFF"/>
        <circle cx="0" cy="-28" r="2.0" fill="#38BDF8"/>
        <rect x="-44" y="-56" width="88" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-47" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FEF08A">VÍA LÁCTEA A SIMPLE VISTA</text>
      </g>`;
    },
    tags: ["cielo", "milkyway", "via_lactea", "apagon", "los_angeles", "estrellas"],
  },

  esfera_tierra_luces_nocturnas: {
    id: "esfera_tierra_luces_nocturnas",
    name: "La Tierra Vista de Noche: Expansión de la Red Lumínica",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="38" fill="#0369A1" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "europa_america_saturada") => {
      const rot = Math.sin(f * 0.14) * 2;
      if (state === "red_luces_continentes") {
        return `<g transform="rotate(${rot.toFixed(1)} 0 0)">
          <circle cx="0" cy="0" r="38" fill="#0A1128" stroke="${S}" stroke-width="4.5"/>
          {/* Siluetas de continentes con telarañas de luz */}
          <path d="M -24 -20 Q -10 -28 6 -18 Q 18 -12 24 2 Q 16 18 -4 20 Q -20 18 -28 -2 Z" fill="#1E293B" stroke="#334155" stroke-width="2"/>
          <circle cx="-12" cy="-14" r="3" fill="#FFE600"/>
          <circle cx="4" cy="-8" r="2.5" fill="#FFE600"/>
          <circle cx="14" cy="4" r="3" fill="#FFE600"/>
          <line x1="-12" y1="-14" x2="4" y2="-8" stroke="#F59E0B" stroke-width="1.8"/>
          <line x1="4" y1="-8" x2="14" y2="4" stroke="#F59E0B" stroke-width="1.8"/>
          <rect x="-44" y="-56" width="88" height="13" rx="3" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
          <text x="0" y="-47" text-anchor="middle" font-size="6.2" font-weight="900" fill="#38BDF8">RED GLOBAL DE SATÉLITES</text>
        </g>`;
      }
      if (state === "europa_america_saturada") {
        return `<g>
          <circle cx="0" cy="0" r="38" fill="#050C1A" stroke="#EF4444" stroke-width="4"/>
          {/* Mancha desbordada de luz urbana */}
          <circle cx="-6" cy="-4" r="24" fill="#D97706" opacity="0.65"/>
          <circle cx="-6" cy="-4" r="14" fill="#FDE047" opacity="0.9"/>
          <circle cx="-6" cy="-4" r="6" fill="#FFFFFF"/>
          <rect x="-46" y="-56" width="92" height="14" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-47" text-anchor="middle" font-size="6.3" font-weight="900" fill="#FFE600">80% DE HUMANOS BAJO RESPLANDOR</text>
          <text x="0" y="30" text-anchor="middle" font-size="6" font-weight="900" fill="#EF4444">99% EN EUROPA Y EE.UU.</text>
        </g>`;
      }
      // tierra_oscuridad_amenazada
      return `<g>
        <circle cx="0" cy="0" r="38" fill="#0B132B" stroke="#10B981" stroke-width="4"/>
        <path d="M -38 0 A 38 38 0 0 1 38 0 Z" fill="#F59E0B" opacity="0.5"/>
        <path d="M -38 0 A 38 38 0 0 0 38 0 Z" fill="#020617"/>
        <line x1="-38" y1="0" x2="38" y2="0" stroke="#FFE600" stroke-width="3"/>
        <rect x="-46" y="-56" width="92" height="14" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-47" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FEF08A">EXPANSIÓN LUMÍNICA: +2% ANUAL</text>
      </g>`;
    },
    tags: ["tierra", "planeta", "luces", "satelite", "continentes", "saturacion"],
  },

  evolucion_farola_electrica: {
    id: "evolucion_farola_electrica",
    name: "Evolución de la Iluminación Urbana: Gas vs Globo vs Blindada",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="36" x2="0" y2="-20" stroke="#475569" stroke-width="6"/>`,
    animatedSvg: (f: number, progress = 0, state = "farola_blindada_cero_polucion") => {
      const flicker = Math.sin(f * 0.18) * 1.5;
      if (state === "farola_gas_victoriana_1880") {
        return `<g>
          <line x1="0" y1="36" x2="0" y2="-12" stroke="#334155" stroke-width="7" stroke-linecap="round"/>
          <polygon points="-14,-12 14,-12 9,-32 -9,-32" fill="#1E293B" stroke="${S}" stroke-width="3"/>
          {/* Llama tenue de gas */}
          <ellipse cx="0" cy="${(-22 + flicker).toFixed(1)}" rx="4" ry="7" fill="#F59E0B" stroke="#FFE600" stroke-width="1.5"/>
          <rect x="-44" y="-54" width="88" height="13" rx="3" fill="#1E293B" stroke="#94A3B8" stroke-width="2"/>
          <text x="0" y="-45" text-anchor="middle" font-size="6.2" font-weight="900" fill="#E2E8F0">1880: FAROLA DE GAS (TENUE)</text>
        </g>`;
      }
      if (state === "farola_mercurio_globo_360") {
        return `<g>
          <line x1="0" y1="36" x2="0" y2="-8" stroke="#475569" stroke-width="7" stroke-linecap="round"/>
          <rect x="-8" y="-12" width="16" height="6" fill="#1E293B" stroke="${S}" stroke-width="2"/>
          {/* Globo difusor sin blindaje disparando luz en 360 grados */}
          <circle cx="0" cy="-22" r="16" fill="#FDE047" opacity="0.35"/>
          <circle cx="0" cy="-22" r="10" fill="#FFFFFF" stroke="#F59E0B" stroke-width="3"/>
          {/* Rayos de luz fugándose hacia el cielo */}
          <line x1="-14" y1="-32" x2="-22" y2="-40" stroke="#EF4444" stroke-width="3"/>
          <line x1="0" y1="-36" x2="0" y2="-44" stroke="#EF4444" stroke-width="3.5"/>
          <line x1="14" y1="-32" x2="22" y2="-40" stroke="#EF4444" stroke-width="3"/>
          <rect x="-46" y="-56" width="92" height="14" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-47" text-anchor="middle" font-size="6.3" font-weight="900" fill="#FFE600">GLOBO NOCTURNO: 60% FUGA ARRIBA</text>
        </g>`;
      }
      // farola_blindada_cero_polucion
      return `<g>
        <line x1="0" y1="36" x2="0" y2="-10" stroke="#334155" stroke-width="7" stroke-linecap="round"/>
        {/* Carcasa superior blindada plana (Full Cut-off) */}
        <path d="M -22 -14 L 22 -14 L 16 -24 L -16 -24 Z" fill="#0F172A" stroke="#38BDF8" stroke-width="3.5"/>
        <line x1="-20" y1="-14" x2="20" y2="-14" stroke="#FFE600" stroke-width="4"/>
        {/* Haz de luz 100% dirigido hacia el suelo */}
        <polygon points="-18,-14 18,-14 32,36 -32,36" fill="#FDE047" opacity="0.35"/>
        <rect x="-46" y="-56" width="92" height="14" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-47" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">FULL CUT-OFF: 0% LUZ AL CIELO</text>
      </g>`;
    },
    tags: ["farola", "alumbrado", "gas", "mercurio", "blindaje", "full_cutoff"],
  },

  medidor_escala_bortle: {
    id: "medidor_escala_bortle",
    name: "Fotómetro y Medidor de la Escala Bortle (SQM 1 al 9)",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-30" y="-42" width="60" height="84" rx="8" fill="#1E293B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "bortle_1_verde_pristino") => {
      const pulse = 1 + Math.sin(f * 0.15) * 0.02;
      if (state === "bortle_9_rojo_critico") {
        return `<g transform="scale(${pulse.toFixed(3)})">
          <rect x="-32" y="-44" width="64" height="88" rx="8" fill="#0F172A" stroke="#EF4444" stroke-width="4.5"/>
          <rect x="-24" y="-36" width="48" height="26" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-24" text-anchor="middle" font-size="10" font-weight="900" fill="#FFE600">CLASE 9</text>
          <text x="0" y="-14" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FCA5A5">17.5 MAG/ARCSEC²</text>
          {/* Barra de alerta */}
          <rect x="-24" y="0" width="48" height="10" rx="3" fill="#DC2626"/>
          <text x="0" y="24" text-anchor="middle" font-size="6" font-weight="900" fill="#EF4444">CENTRO METROPOLITANO</text>
          <text x="0" y="34" text-anchor="middle" font-size="5.5" font-weight="900" fill="#94A3B8">SOLO LUNA Y PLANETAS</text>
        </g>`;
      }
      if (state === "bortle_5_amarillo_suburbano") {
        return `<g>
          <rect x="-32" y="-44" width="64" height="88" rx="8" fill="#0F172A" stroke="#F59E0B" stroke-width="4.5"/>
          <rect x="-24" y="-36" width="48" height="26" rx="4" fill="#78350F" stroke="#F59E0B" stroke-width="2"/>
          <text x="0" y="-24" text-anchor="middle" font-size="10" font-weight="900" fill="#FEF08A">CLASE 5</text>
          <text x="0" y="-14" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FDE68A">20.2 MAG/ARCSEC²</text>
          <rect x="-24" y="0" width="28" height="10" rx="3" fill="#F59E0B"/>
          <text x="0" y="24" text-anchor="middle" font-size="6" font-weight="900" fill="#F59E0B">SUBURBIO RESIDENCIAL</text>
          <text x="0" y="34" text-anchor="middle" font-size="5.5" font-weight="900" fill="#CBD5E1">VÍA LÁCTEA MUY DÉBIL</text>
        </g>`;
      }
      // bortle_1_verde_pristino
      return `<g transform="scale(${pulse.toFixed(3)})">
        <rect x="-32" y="-44" width="64" height="88" rx="8" fill="#0F172A" stroke="#10B981" stroke-width="4.5"/>
        <rect x="-24" y="-36" width="48" height="26" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-24" text-anchor="middle" font-size="10" font-weight="900" fill="#A7F3D0">CLASE 1</text>
        <text x="0" y="-14" text-anchor="middle" font-size="6.2" font-weight="900" fill="#6EE7B7">22.0 MAG/ARCSEC²</text>
        <rect x="-24" y="0" width="48" height="10" rx="3" fill="#10B981"/>
        <text x="0" y="24" text-anchor="middle" font-size="6" font-weight="900" fill="#4ADE80">CIELO OSCURO PRÍSTINO</text>
        <text x="0" y="34" text-anchor="middle" font-size="5.5" font-weight="900" fill="#E2E8F0">SOMBRAS DE LA VÍA LÁCTEA</text>
      </g>`;
    },
    tags: ["bortle", "sqm", "fotometro", "escala", "brillo", "astronomia"],
  },

  tortuga_marina_desorientada: {
    id: "tortuga_marina_desorientada",
    name: "Cría de Tortuga Marina Desorientada por Luces Costeras",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<ellipse cx="0" cy="0" rx="20" ry="14" fill="#15803D" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, progress = 0, state = "desorientada_hacia_farolas") => {
      const crawl = Math.sin(f * 0.24) * 3;
      if (state === "cria_naciendo_arena") {
        return `<g>
          {/* Nido en la arena */}
          <ellipse cx="0" cy="18" rx="32" ry="12" fill="#78350F" stroke="${S}" stroke-width="3"/>
          <ellipse cx="0" cy="14" rx="22" ry="8" fill="#D97706"/>
          {/* Caparazón asomando */}
          <ellipse cx="0" cy="4" rx="14" ry="10" fill="#15803D" stroke="${S}" stroke-width="3"/>
          <circle cx="0" cy="-6" r="6" fill="#166534" stroke="${S}" stroke-width="2.5"/>
          <rect x="-44" y="-48" width="88" height="13" rx="3" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          <text x="0" y="-39" text-anchor="middle" font-size="6.2" font-weight="900" fill="#38BDF8">ECLOSIÓN BAJO LA ARENA</text>
        </g>`;
      }
      if (state === "desorientada_hacia_farolas") {
        return `<g transform="translate(${crawl.toFixed(1)} 0)">
          {/* Tortuga girada hacia la derecha (hacia las luces mortales de los hoteles) */}
          <ellipse cx="-6" cy="4" rx="16" ry="11" fill="#15803D" stroke="${S}" stroke-width="3"/>
          <circle cx="10" cy="4" r="6" fill="#166534" stroke="${S}" stroke-width="2.5"/>
          <path d="M 0 -8 L 8 -16 M 0 16 L 8 24" stroke="#166534" stroke-width="4" stroke-linecap="round"/>
          {/* Faro / reflector atrayéndola */}
          <circle cx="34" cy="-20" r="10" fill="#FDE047" opacity="0.6"/>
          <line x1="14" y1="4" x2="30" y2="-14" stroke="#EF4444" stroke-width="2.5" stroke-dasharray="3 3"/>
          <rect x="-48" y="-52" width="96" height="14" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">TRAMPA MORTAL: RUMBO AL ASFALTO</text>
        </g>`;
      }
      // salvada_rumbo_oceano
      return `<g transform="translate(${(-crawl).toFixed(1)} 0)">
        {/* Tortuga orientada hacia la izquierda (hacia el brillo de la luna en las olas) */}
        <ellipse cx="6" cy="4" rx="16" ry="11" fill="#15803D" stroke="${S}" stroke-width="3"/>
        <circle cx="-10" cy="4" r="6" fill="#166534" stroke="${S}" stroke-width="2.5"/>
        <path d="M 0 -8 L -8 -16 M 0 16 L -8 24" stroke="#166534" stroke-width="4" stroke-linecap="round"/>
        {/* Olas marinas salvadoras */}
        <path d="M -36 -12 Q -26 -18 -16 -12" fill="none" stroke="#38BDF8" stroke-width="3.5"/>
        <path d="M -36 18 Q -26 12 -16 18" fill="none" stroke="#38BDF8" stroke-width="3.5"/>
        <rect x="-46" y="-52" width="92" height="14" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">ORIENTACIÓN NATURAL: OCÉANO</text>
      </g>`;
    },
    tags: ["tortuga", "caretta", "marina", "costa", "desorientacion", "cria"],
  },

  aves_migratorias_rascacielos: {
    id: "aves_migratorias_rascacielos",
    name: "Aves Migratorias Atrapadas en el Cono de Luz de Rascacielos",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<polygon points="0,-20 18,10 -18,10" fill="#38BDF8" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, progress = 0, state = "atrapadas_espiral_luz") => {
      const circleAngle = (f * 0.22) % (Math.PI * 2);
      const bx = Math.cos(circleAngle) * 22;
      const by = Math.sin(circleAngle) * 14;
      if (state === "vuelo_migratorio_estelar") {
        return `<g>
          {/* Bandada volando en V bajo las estrellas */}
          <polygon points="-24,-8 -16,-2 -24,4" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
          <polygon points="0,-18 8,-12 0,-6" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
          <polygon points="24,-8 32,-2 24,4" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
          <circle cx="-18" cy="-30" r="1.5" fill="#FFE600"/>
          <circle cx="18" cy="-30" r="1.5" fill="#FFE600"/>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#38BDF8">NAVEGACIÓN ESTELAR Y MAGNÉTICA</text>
        </g>`;
      }
      if (state === "atrapadas_espiral_luz") {
        return `<g>
          {/* Silueta de rascacielos de cristal emitiendo haz deslumbrante */}
          <rect x="-12" y="-18" width="24" height="52" fill="#1E293B" stroke="${S}" stroke-width="3"/>
          <circle cx="0" cy="-22" r="28" fill="#FDE047" opacity="0.35"/>
          {/* Ave volando en círculos concéntricos agotadores */}
          <ellipse cx="0" cy="-6" rx="26" ry="16" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="4 3"/>
          <polygon points="${(bx - 4).toFixed(1)},${(by - 6).toFixed(1)} ${(bx + 6).toFixed(1)},${(by - 6).toFixed(1)} ${bx.toFixed(1)},${(by - 12).toFixed(1)}" fill="#EF4444" stroke="${S}" stroke-width="2"/>
          <rect x="-48" y="-54" width="96" height="14" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-45" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">ATRAPADAS EN EL CONO DE LUZ</text>
        </g>`;
      }
      // torre_apagada_vuelo_libre
      return `<g>
        <rect x="-12" y="-14" width="24" height="48" fill="#0F172A" stroke="#334155" stroke-width="3"/>
        {/* Luces apagadas, vuelo libre seguro */}
        <polygon points="-18,-26 -10,-20 -18,-14" fill="#22C55E" stroke="${S}" stroke-width="2.5"/>
        <polygon points="12,-28 20,-22 12,-16" fill="#22C55E" stroke="${S}" stroke-width="2.5"/>
        <rect x="-46" y="-54" width="92" height="14" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-45" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">LUCES APAGADAS: PASO SEGURO</text>
      </g>`;
    },
    tags: ["aves", "migracion", "rascacielos", "chicago", "colision", "espiral"],
  },

  espectro_led_azul_460nm: {
    id: "espectro_led_azul_460nm",
    name: "Espectro Óptico: El Pico Azul Letal del LED Blanco (460 nm)",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -30 20 L -10 -20 L 10 15 L 30 20" stroke="#0284C7" stroke-width="4" fill="none"/>`,
    animatedSvg: (f: number, progress = 0, state = "pico_azul_led_frio_460nm") => {
      const spikePulse = 1 + Math.sin(f * 0.16) * 0.04;
      if (state === "pico_azul_led_frio_460nm") {
        return `<g>
          {/* Ejes espectrales */}
          <rect x="-40" y="-34" width="80" height="66" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4"/>
          <line x1="-32" y1="22" x2="32" y2="22" stroke="#475569" stroke-width="2"/>
          {/* Curva espectral de LED blanco frío con pico agudo en 460 nm */}
          <path d="M -30 20 Q -24 18 -18 6 L -10 ${(-24 * spikePulse).toFixed(1)} L -4 6 Q 6 12 18 10 Q 26 12 30 20" fill="none" stroke="#38BDF8" stroke-width="4.5"/>
          {/* Marcador rojo sobre el pico de 460 nm */}
          <circle cx="-10" cy={(-24 * spikePulse).toFixed(1)} r="4" fill="#EF4444"/>
          <text x="-10" y="-28" text-anchor="middle" font-size="6.5" font-weight="900" fill="#FFE600">460 NM</text>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">PICO AZUL: SUPRESIÓN BIOLÓGICA</text>
        </g>`;
      }
      if (state === "comparacion_sodio_calido") {
        return `<g>
          <rect x="-40" y="-34" width="80" height="66" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4"/>
          {/* Curva de sodio cálido (pico en 590 nm, amarillo/naranja inocuo) */}
          <path d="M -30 20 L 0 20 Q 8 6 14 -16 Q 20 6 26 20 L 30 20" fill="none" stroke="#F59E0B" stroke-width="4.5"/>
          <text x="14" y="-22" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FDE047">590 NM (SODIO)</text>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#1E293B" stroke="#F59E0B" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FDE047">SODIO 2000K: CERO DAÑO AZUL</text>
        </g>`;
      }
      // filtro_ambar_circadiano
      return `<g>
        <rect x="-40" y="-34" width="80" height="66" rx="6" fill="#0F172A" stroke="#10B981" stroke-width="4"/>
        <path d="M -30 20 L -6 20 Q 4 10 12 -12 Q 20 10 28 20" fill="none" stroke="#10B981" stroke-width="4.5"/>
        <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">LED ÁMBAR 2200K PROTEGIDO</text>
      </g>`;
    },
    tags: ["espectro", "led", "azul", "460nm", "longitud_onda", "nanometros"],
  },

  glandula_pineal_melatonina: {
    id: "glandula_pineal_melatonina",
    name: "Glándula Pineal y Síntesis Circadiana de Melatonina",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="28" fill="#818CF8" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "luz_azul_bloqueo_total") => {
      const dropY = ((f * 0.8) % 24);
      if (state === "melatonina_fluyendo_noche") {
        return `<g>
          {/* Silueta cerebral estilizada en corte sagital */}
          <ellipse cx="0" cy="-6" rx="34" ry="24" fill="#1E1B4B" stroke="#6366F1" stroke-width="3.5"/>
          {/* Glándula pineal brillando en púrpura/cian */}
          <circle cx="2" cy="-4" r="8" fill="#A855F7" stroke="#000" stroke-width="2.5"/>
          {/* Gotas de melatonina descendiendo hacia el torrente */}
          <circle cx="2" cy="${(8 + dropY).toFixed(1)}" r="3.5" fill="#38BDF8"/>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#A7F3D0">OSCURIDAD: MELATONINA 100%</text>
        </g>`;
      }
      if (state === "luz_azul_bloqueo_total") {
        return `<g>
          <ellipse cx="0" cy="-6" rx="34" ry="24" fill="#1E1B4B" stroke="#EF4444" stroke-width="3.5"/>
          {/* Haz de luz azul impactando desde la derecha */}
          <line x1="36" y1="-4" x2="6" y2="-4" stroke="#38BDF8" stroke-width="4.5"/>
          <circle cx="2" cy="-4" r="8" fill="#7F1D1D" stroke="#EF4444" stroke-width="2.5"/>
          {/* Cruz de bloqueo total */}
          <line x1="-3" y1="-9" x2="7" y2="1" stroke="#EF4444" stroke-width="3"/>
          <line x1="7" y1="-9" x2="-3" y2="1" stroke="#EF4444" stroke-width="3"/>
          <rect x="-48" y="-54" width="96" height="14" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-45" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">LUZ NOCTURNA: MELATONINA 0%</text>
        </g>`;
      }
      // reloj_biologico_restaurado
      return `<g>
        <circle cx="0" cy="-2" r="28" fill="#0F172A" stroke="#10B981" stroke-width="4"/>
        {/* Esfera de reloj circadiano */}
        <circle cx="0" cy="-2" r="20" fill="none" stroke="#334155" stroke-width="2.5"/>
        <line x1="0" y1="-2" x2="0" y2="-14" stroke="#FFE600" stroke-width="3"/>
        <line x1="0" y1="-2" x2="10" y2="-2" stroke="#10B981" stroke-width="3"/>
        <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">RITMO CIRCADIANO SALUDABLE</text>
      </g>`;
    },
    tags: ["melatonina", "pineal", "cerebro", "circadiano", "insomnio", "salud"],
  },

  resplandor_atmosferico_rayleigh: {
    id: "resplandor_atmosferico_rayleigh",
    name: "Física del Skyglow: Dispersión de Rayleigh en la Atmósfera",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -30 20 Q 0 -20 30 20" stroke="#F59E0B" stroke-width="4" fill="none"/>`,
    animatedSvg: (f: number, progress = 0, state = "cupula_300km_alcance") => {
      const scatter = Math.sin(f * 0.18) * 12;
      if (state === "dispersion_rayleigh_haz") {
        return `<g>
          {/* Haz de luz subiendo y dispersándose en moléculas de aire */}
          <line x1="0" y1="28" x2="0" y2="-2" stroke="#FDE047" stroke-width="6"/>
          {/* Moléculas N2 / O2 dispersando fotones */}
          <circle cx="-16" cy="-14" r="5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
          <circle cx="18" cy="-18" r="5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
          <line x1="0" y1="-2" x2="-16" y2="-14" stroke="#FFE600" stroke-width="2.5" stroke-dasharray="3 2"/>
          <line x1="0" y1="-2" x2="18" y2="-18" stroke="#FFE600" stroke-width="2.5" stroke-dasharray="3 2"/>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#38BDF8">DISPERSIÓN RAYLEIGH (1/λ⁴)</text>
        </g>`;
      }
      if (state === "cupula_300km_alcance") {
        return `<g>
          {/* Cúpula gigante cubriendo 300 km */}
          <path d="M -38 24 Q 0 -32 38 24" fill="#D97706" opacity="0.45" stroke="#F59E0B" stroke-width="3"/>
          <circle cx="-30" cy="24" r="4" fill="#EF4444"/>
          <text x="-30" y="32" font-size="5" font-weight="900" fill="#FFFFFF">CIUDAD</text>
          <line x1="-30" y1="20" x2="28" y2="20" stroke="#FFE600" stroke-width="2.5" stroke-dasharray="4 2"/>
          <text x="0" y="16" text-anchor="middle" font-size="7" font-weight="900" fill="#FFE600">300 KM</text>
          <rect x="-48" y="-54" width="96" height="14" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-45" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">CÚPULA LUMINOSA A 300 KM</text>
        </g>`;
      }
      // blindaje_corte_total
      return `<g>
        <path d="M -24 -10 L 24 -10 L 0 24 Z" fill="#FDE047" opacity="0.35"/>
        <rect x="-26" y="-18" width="52" height="8" rx="2" fill="#0F172A" stroke="#10B981" stroke-width="3"/>
        <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">LUZ RETENIDA EN SUPERFICIE</text>
      </g>`;
    },
    tags: ["rayleigh", "dispersion", "skyglow", "atmosfera", "cupula", "fotones"],
  },

  telescopio_cegado_polucion: {
    id: "telescopio_cegado_polucion",
    name: "Telescopio Astronómico Cegado por Contaminación Lumínica",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-30" y="-12" width="60" height="24" rx="6" transform="rotate(-30 0 0)" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "sensor_ccd_saturado_ruido") => {
      const shake = Math.sin(f * 0.16) * 1.5;
      if (state === "telescopio_cegado_resplandor") {
        return `<g transform="rotate(-32 0 10)">
          <rect x="-28" y="-10" width="56" height="20" rx="4" fill="#0369A1" stroke="${S}" stroke-width="4"/>
          {/* Lente frontal cegada por resplandor anaranjado */}
          <ellipse cx="28" cy="0" rx="4" ry="10" fill="#F59E0B" stroke="#EF4444" stroke-width="2"/>
          <line x1="32" y1="-8" x2="48" y2="-16" stroke="#FDE047" stroke-width="3"/>
          <line x1="32" y1="8" x2="48" y2="16" stroke="#FDE047" stroke-width="3"/>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">OBSERVATORIO HISTÓRICO CIEGO</text>
        </g>`;
      }
      if (state === "sensor_ccd_saturado_ruido") {
        return `<g>
          {/* Detector CCD saturado en blanco/amarillo por ruido de fotones */}
          <rect x="-32" y="-32" width="64" height="64" rx="6" fill="#FDE047" stroke="#EF4444" stroke-width="4.5"/>
          <text x="0" y="-8" text-anchor="middle" font-size="8" font-weight="900" fill="#7F1D1D">SENSOR CCD</text>
          <text x="0" y="6" text-anchor="middle" font-size="6.5" font-weight="900" fill="#991B1B">SATURADO</text>
          <text x="0" y="20" text-anchor="middle" font-size="5.5" font-weight="900" fill="#000000">SEÑAL / RUIDO = 0</text>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">RUIDO DE FONDO INASUMIBLE</text>
        </g>`;
      }
      // telescopio_remoto_cumbre
      return `<g transform="rotate(-30 0 10)">
        <rect x="-28" y="-10" width="56" height="20" rx="4" fill="#0F172A" stroke="#38BDF8" stroke-width="4"/>
        <ellipse cx="28" cy="0" rx="4" ry="10" fill="#38BDF8"/>
        {/* Fotón cósmico nítido */}
        <circle cx="40" cy="0" r="3" fill="#FFE600"/>
        <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">FOTONES DE HACE 13.000 M DE AÑOS</text>
      </g>`;
    },
    tags: ["telescopio", "observatorio", "ccd", "sensor", "astronomia", "ruido"],
  },

  maqueta_control_iluminacion: {
    id: "maqueta_control_iluminacion",
    name: "Maqueta Urbana de Iluminación y Gestión de Red",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<polygon points="0,-24 32,0 0,24 -32,0" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "desperdicio_lumenes_cielo") => {
      const pulse = 1 + Math.sin(f * 0.16) * 0.03;
      if (state === "maqueta_ciudades_encendidas") {
        return `<g>
          <polygon points="0,-20 36,-2 0,16 -36,-2" fill="#1E293B" stroke="#38BDF8" stroke-width="3.5"/>
          {/* Mini edificios iluminados */}
          <rect x="-18" y="-16" width="10" height="22" fill="#0F172A" stroke="#000" stroke-width="2"/>
          <circle cx="-13" cy="-18" r="3" fill="#FDE047"/>
          <rect x="8" y="-22" width="12" height="28" fill="#0F172A" stroke="#000" stroke-width="2"/>
          <circle cx="14" cy="-24" r="3" fill="#EF4444"/>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#38BDF8">RED URBANA ENERGIZADA</text>
        </g>`;
      }
      if (state === "desperdicio_lumenes_cielo") {
        return `<g>
          <polygon points="0,-20 36,-2 0,16 -36,-2" fill="#1E293B" stroke="#EF4444" stroke-width="3.5"/>
          {/* Fuga masiva de lúmenes hacia arriba */}
          <polygon points="-24,-2 -6,-2 -15,-34" fill="#FDE047" opacity="0.6"/>
          <polygon points="6,-2 24,-2 15,-34" fill="#FDE047" opacity="0.6"/>
          <rect x="-48" y="-54" width="96" height="14" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-45" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">50% LÚMENES DESPERDICIADOS</text>
        </g>`;
      }
      // red_optimizada_eficiente
      return `<g transform="scale(${pulse.toFixed(3)})">
        <polygon points="0,-20 36,-2 0,16 -36,-2" fill="#0F172A" stroke="#10B981" stroke-width="4"/>
        <line x1="-20" y1="-2" x2="20" y2="-2" stroke="#10B981" stroke-width="3" stroke-dasharray="4 2"/>
        <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">-70% CONSUMO Y CIELO LIMPIO</text>
      </g>`;
    },
    tags: ["maqueta", "control", "red", "desperdicio", "lumenes", "eficiencia"],
  },

  luminaria_full_cutoff: {
    id: "luminaria_full_cutoff",
    name: "Luminaria Full Cut-Off con Control Óptico Estricto",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<path d="M -24 -6 L 24 -6 L 16 -18 L -16 -18 Z" fill="#1E293B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "diseno_full_cutoff_plano") => {
      if (state === "luminaria_globo_fuga_arriba") {
        return `<g>
          <circle cx="0" cy="-6" r="18" fill="#FDE047" opacity="0.4"/>
          <circle cx="0" cy="-6" r="10" fill="#FFFFFF" stroke="#000" stroke-width="3"/>
          <line x1="-24" y1="-20" x2="-32" y2="-30" stroke="#EF4444" stroke-width="3"/>
          <line x1="24" y1="-20" x2="32" y2="-30" stroke="#EF4444" stroke-width="3"/>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FFE600">SIN BLINDAJE: POLUCIÓN MÁXIMA</text>
        </g>`;
      }
      if (state === "diseno_full_cutoff_plano") {
        return `<g>
          {/* Carcasa superior opaca y vidrio plano inferior */}
          <path d="M -26 -6 L 26 -6 L 18 -20 L -18 -20 Z" fill="#0F172A" stroke="#38BDF8" stroke-width="3.5"/>
          <line x1="-24" y1="-6" x2="24" y2="-6" stroke="#FFE600" stroke-width="3.5"/>
          {/* Cono fotométrico estricto por debajo de la horizontal */}
          <polygon points="-24,-6 24,-6 34,32 -34,32" fill="#FDE047" opacity="0.35"/>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">FULL CUT-OFF: 0 CD A 90° O MÁS</text>
        </g>`;
      }
      // sensor_movimiento_atenuacion
      return `<g>
        <path d="M -26 -6 L 26 -6 L 18 -20 L -18 -20 Z" fill="#0F172A" stroke="#10B981" stroke-width="3.5"/>
        <line x1="-24" y1="-6" x2="24" y2="-6" stroke="#10B981" stroke-width="3"/>
        <polygon points="-16,-6 16,-6 22,24 -22,24" fill="#A7F3D0" opacity="0.4"/>
        <circle cx="0" cy="-6" r="3" fill="#10B981"/>
        <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#FEF08A">SENSOR ACTIVO: ATENUACIÓN 20%</text>
      </g>`;
    },
    tags: ["luminaria", "optica", "full_cutoff", "blindaje", "candela", "sensor"],
  },

  observatorio_atacama_cupula: {
    id: "observatorio_atacama_cupula",
    name: "Observatorio de Alta Montaña en Atacama con Láser Guía",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -26 14 A 26 26 0 0 1 26 14 Z" fill="#E2E8F0" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "laser_estrella_guia") => {
      const laserTwinkle = 0.8 + Math.sin(f * 0.18) * 0.2;
      if (state === "cupula_atacama_abierta") {
        return `<g>
          <rect x="-24" y="10" width="48" height="24" fill="#CBD5E1" stroke="${S}" stroke-width="3"/>
          <path d="M -26 10 A 26 26 0 0 1 26 10 Z" fill="#E2E8F0" stroke="${S}" stroke-width="3.5"/>
          <rect x="-6" y="-16" width="12" height="26" fill="#020617"/>
          <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
          <text x="0" y="-43" text-anchor="middle" font-size="6.2" font-weight="900" fill="#38BDF8">CÚPULA EN EL DESIERTO DE ATACAMA</text>
        </g>`;
      }
      if (state === "laser_estrella_guia") {
        return `<g>
          <rect x="-24" y="10" width="48" height="24" fill="#CBD5E1" stroke="${S}" stroke-width="3"/>
          <path d="M -26 10 A 26 26 0 0 1 26 10 Z" fill="#E2E8F0" stroke="${S}" stroke-width="3.5"/>
          <rect x="-6" y="-16" width="12" height="26" fill="#020617"/>
          {/* Haz láser naranja disparado a la capa de sodio mesosférica a 90 km */}
          <line x1="0" y1="-10" x2="0" y2="-52" stroke="#F97316" stroke-width="4" opacity="${laserTwinkle}"/>
          <circle cx="0" cy="-52" r="3.5" fill="#FFE600"/>
          <rect x="-48" y="-56" width="96" height="14" rx="3" fill="#7C2D12" stroke="#F97316" stroke-width="2"/>
          <text x="0" y="-47" text-anchor="middle" font-size="6.2" font-weight="900" fill="#FEF08A">LÁSER GUÍA: SODIO A 90 KM</text>
        </g>`;
      }
      // cielo_profundo_cosmos
      return `<g>
        <circle cx="0" cy="-6" r="28" fill="#020617" stroke="#38BDF8" stroke-width="4"/>
        <ellipse cx="0" cy="-6" rx="20" ry="7" transform="rotate(-25 0 -6)" fill="#818CF8" opacity="0.8"/>
        <circle cx="0" cy="-6" r="4" fill="#FFFFFF"/>
        <rect x="-46" y="-52" width="92" height="13" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-43" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">GALAXIA EN RESOLUCIÓN PRÍSTINA</text>
      </g>`;
    },
    tags: ["atacama", "laser", "optica_adaptativa", "cupula", "vlt", "estrellas"],
  },

  interruptor_maestro_apagon: {
    id: "interruptor_maestro_apagon",
    name: "Interruptor Maestro de Corte Eléctrico Industrial (El Gran Apagón)",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-36" width="48" height="72" rx="6" fill="#1E293B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, progress = 0, state = "sistema_apagado_estrellas") => {
      const pulse = 1 + Math.sin(f * 0.16) * 0.03;
      if (state === "interruptor_conectado_alerta") {
        return `<g>
          <rect x="-26" y="-38" width="52" height="76" rx="6" fill="#1E293B" stroke="#EF4444" stroke-width="4"/>
          {/* Cuchillas en contacto arriba (cerrado ON) */}
          <rect x="-14" y="-30" width="28" height="12" fill="#F59E0B" stroke="#000" stroke-width="2"/>
          <line x1="0" y1="-24" x2="0" y2="10" stroke="#DC2626" stroke-width="7" stroke-linecap="round"/>
          <circle cx="0" cy="10" r="7" fill="#EF4444"/>
          <circle cx="16" cy="-28" r="4" fill="#EF4444"/>
          <rect x="-46" y="-54" width="92" height="14" rx="3" fill="#7F1D1D" stroke="#EF4444" stroke-width="2"/>
          <text x="0" y="-45" text-anchor="middle" font-size="6.3" font-weight="900" fill="#FFE600">CIRCUITO CONECTADO: ALERTA</text>
        </g>`;
      }
      if (state === "palanca_bajando_corte") {
        const pullAngle = 20 + Math.sin(f * 0.20) * 15;
        return `<g>
          <rect x="-26" y="-38" width="52" height="76" rx="6" fill="#1E293B" stroke="#FFE600" stroke-width="4"/>
          <line x1="0" y1="-20" x2="${(Math.sin(pullAngle * Math.PI / 180) * 32).toFixed(1)}" y2="${(Math.cos(pullAngle * Math.PI / 180) * 32).toFixed(1)}" stroke="#F59E0B" stroke-width="7" stroke-linecap="round"/>
          {/* Chispas de desconexión */}
          <line x1="-8" y1="-26" x2="-14" y2="-32" stroke="#FFE600" stroke-width="3"/>
          <line x1="8" y1="-26" x2="14" y2="-32" stroke="#38BDF8" stroke-width="3"/>
          <rect x="-46" y="-54" width="92" height="14" rx="3" fill="#78350F" stroke="#F59E0B" stroke-width="2"/>
          <text x="0" y="-45" text-anchor="middle" font-size="6.3" font-weight="900" fill="#FDE047">DESCONECTANDO REFLECTORES</text>
        </g>`;
      }
      // sistema_apagado_estrellas
      return `<g transform="scale(${pulse.toFixed(3)})">
        <rect x="-26" y="-38" width="52" height="76" rx="6" fill="#0F172A" stroke="#10B981" stroke-width="4.5"/>
        <line x1="0" y1="-20" x2="16" y2="24" stroke="#10B981" stroke-width="7" stroke-linecap="round"/>
        <circle cx="16" cy="24" r="7" fill="#22C55E"/>
        <circle cx="16" cy="-28" r="4" fill="#22C55E"/>
        {/* Estrellas nítidas que aparecen */}
        <circle cx="-14" cy="-14" r="2" fill="#FFE600"/>
        <circle cx="-16" cy="12" r="1.8" fill="#38BDF8"/>
        <circle cx="-6" cy="22" r="1.5" fill="#FFFFFF"/>
        <rect x="-46" y="-54" width="92" height="14" rx="3" fill="#065F46" stroke="#10B981" stroke-width="2"/>
        <text x="0" y="-45" text-anchor="middle" font-size="6.3" font-weight="900" fill="#A7F3D0">APAGADO: LA NOCHE VUELVE</text>
      </g>`;
    },
    tags: ["interruptor", "palanca", "apagon", "desconexion", "estrellas", "corte"],
  },
  numeros_flotantes_glitch: {
    id: "numeros_flotantes_glitch",
    name: "Números Flotantes con Glitch y Desintegración",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g><rect x="-38" y="-22" width="22" height="30" rx="4" fill="#0284C7" stroke="${S}" stroke-width="2.5"/><text x="-27" y="-2" font-size="20" font-weight="900" fill="#F8FAFC" text-anchor="middle">1</text><rect x="-12" y="-22" width="22" height="30" rx="4" fill="#0284C7" stroke="${S}" stroke-width="2.5"/><text x="-1" y="-2" font-size="20" font-weight="900" fill="#F8FAFC" text-anchor="middle">2</text><rect x="14" y="-22" width="22" height="30" rx="4" fill="#0284C7" stroke="${S}" stroke-width="2.5"/><text x="25" y="-2" font-size="20" font-weight="900" fill="#F8FAFC" text-anchor="middle">3</text><rect x="40" y="-22" width="22" height="30" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="2.5" stroke-dasharray="4 2"/><text x="51" y="-2" font-size="20" font-weight="900" fill="#FCA5A5" text-anchor="middle">4</text></g>`,
    animatedSvg: (f: number) => {
      const shake = (f % 6 < 3 ? 2 : -2);
      const ashY = (f * 2.5) % 24;
      return `<g>
        <rect x="-38" y="-22" width="22" height="30" rx="4" fill="#0284C7" stroke="${S}" stroke-width="3"/>
        <text x="-27" y="-2" font-size="20" font-weight="900" fill="#F8FAFC" text-anchor="middle">1</text>
        <rect x="-12" y="-22" width="22" height="30" rx="4" fill="#0284C7" stroke="${S}" stroke-width="3"/>
        <text x="-1" y="-2" font-size="20" font-weight="900" fill="#F8FAFC" text-anchor="middle">2</text>
        <rect x="14" y="-22" width="22" height="30" rx="4" fill="#0284C7" stroke="${S}" stroke-width="3"/>
        <text x="25" y="-2" font-size="20" font-weight="900" fill="#F8FAFC" text-anchor="middle">3</text>
        <g transform="translate(${shake}, 0)">
          <rect x="40" y="-22" width="22" height="30" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="3" stroke-dasharray="5 3"/>
          <text x="51" y="-2" font-size="20" font-weight="900" fill="#F87171" text-anchor="middle">4</text>
          <line x1="38" y1="-7" x2="64" y2="-7" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="51" cy="${-22 - ashY}" r="2" fill="#EF4444" opacity="0.8"/>
          <circle cx="58" cy="${-22 - ashY * 0.8}" r="1.5" fill="#FCA5A5" opacity="0.7"/>
        </g>
      </g>`;
    },
    tags: ["numeros", "conteo", "glitch", "estatica", "anumerico", "piraha"],
  },
  canasta_peces_piraha: {
    id: "canasta_peces_piraha",
    name: "Canasta de Corteza con Peces Amazónicos",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M -26 -6 L 26 -6 L 20 28 L -20 28 Z" fill="#78350F" stroke="${S}" stroke-width="4"/><path d="M -24 4 L 24 4" stroke="#451A03" stroke-width="2"/><path d="M -22 16 L 22 16" stroke="#451A03" stroke-width="2"/><ellipse cx="-8" cy="-10" rx="14" ry="7" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/><ellipse cx="10" cy="-8" rx="14" ry="7" fill="#0284C7" stroke="${S}" stroke-width="2.5"/><polygon points="4,-10 10,-14 10,-6" fill="#0369A1"/><polygon points="22,-8 28,-12 28,-4" fill="#0284C7"/>`,
    animatedSvg: (f: number) => {
      const flop = Math.sin(f / 4) * 3;
      return `<path d="M -26 -6 L 26 -6 L 20 28 L -20 28 Z" fill="#78350F" stroke="${S}" stroke-width="4"/><path d="M -24 4 L 24 4" stroke="#451A03" stroke-width="2.5"/><path d="M -22 16 L 22 16" stroke="#451A03" stroke-width="2.5"/><g transform="rotate(${flop.toFixed(1)} -8 -10)"><ellipse cx="-8" cy="-10" rx="14" ry="7" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/><circle cx="-16" cy="-11" r="1.5" fill="#000000"/><polygon points="4,-10 12,-15 12,-5" fill="#0369A1"/></g><g transform="rotate(${(-flop).toFixed(1)} 10 -8)"><ellipse cx="10" cy="-8" rx="14" ry="7" fill="#0284C7" stroke="${S}" stroke-width="2.5"/><circle cx="2" cy="-9" r="1.5" fill="#000000"/><polygon points="22,-8 30,-13 30,-3" fill="#0369A1"/></g>`;
    },
    tags: ["canasta", "peces", "piraha", "amazonas", "hoi", "poco", "corteza"],
  },
  libreta_antropologo_campo: {
    id: "libreta_antropologo_campo",
    name: "Libreta de Antropólogo de Campo",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<rect x="-24" y="-30" width="48" height="60" rx="6" fill="#FEF08A" stroke="${S}" stroke-width="4"/><line x1="-16" y1="-18" x2="16" y2="-18" stroke="#334155" stroke-width="2.5"/><line x1="-16" y1="-8" x2="12" y2="-8" stroke="#334155" stroke-width="2.5"/><line x1="-16" y1="2" x2="16" y2="2" stroke="#334155" stroke-width="2.5"/><line x1="-16" y1="12" x2="8" y2="12" stroke="#334155" stroke-width="2.5"/><rect x="22" y="-20" width="6" height="36" rx="2" fill="#F59E0B" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const penJiggle = Math.sin(f / 3) * 2;
      return `<rect x="-24" y="-30" width="48" height="60" rx="6" fill="#FEF08A" stroke="${S}" stroke-width="4"/><line x1="-16" y1="-18" x2="16" y2="-18" stroke="#334155" stroke-width="3"/><line x1="-16" y1="-8" x2="14" y2="-8" stroke="#334155" stroke-width="3"/><line x1="-16" y1="2" x2="16" y2="2" stroke="#334155" stroke-width="3"/><line x1="-16" y1="12" x2="10" y2="12" stroke="#334155" stroke-width="3"/><g transform="translate(0, ${penJiggle.toFixed(1)})"><rect x="22" y="-20" width="6" height="36" rx="2" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/><polygon points="22,16 28,16 25,24" fill="#000000"/></g>`;
    },
    tags: ["libreta", "antropologo", "campo", "apuntes", "linguistica", "everett"],
  },
  mesa_prueba_fichas_madera: {
    id: "mesa_prueba_fichas_madera",
    name: "Fichas de Prueba de Correspondencia Uno a Uno",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-42" y="-12" width="84" height="24" rx="6" fill="#D97706" stroke="${S}" stroke-width="3.5"/><circle cx="-28" cy="0" r="8" fill="#FDE047" stroke="${S}" stroke-width="2"/><circle cx="-10" cy="0" r="8" fill="#FDE047" stroke="${S}" stroke-width="2"/><circle cx="8" cy="0" r="8" fill="#FDE047" stroke="${S}" stroke-width="2"/><circle cx="26" cy="0" r="8" fill="#FDE047" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const popGlint = 0.6 + 0.4 * Math.sin(f / 6);
      return `<rect x="-42" y="-12" width="84" height="24" rx="6" fill="#D97706" stroke="${S}" stroke-width="3.5"/><circle cx="-28" cy="0" r="8" fill="#FDE047" stroke="${S}" stroke-width="2"/><circle cx="-10" cy="0" r="8" fill="#FDE047" stroke="${S}" stroke-width="2"/><circle cx="8" cy="0" r="8" fill="#FDE047" stroke="${S}" stroke-width="2"/><circle cx="26" cy="0" r="8" fill="#FDE047" stroke="${S}" stroke-width="2"/><circle cx="${(-28 + ((f * 3) % 60)).toFixed(1)}" cy="0" r="3" fill="#FFFFFF" opacity="${popGlint.toFixed(2)}"/>`;
    },
    tags: ["fichas", "madera", "experimento", "test", "correspondencia", "conteo"],
  },
  caja_fuerte_memoria_trabajo: {
    id: "caja_fuerte_memoria_trabajo",
    name: "Caja Fuerte de Memoria de Trabajo con Nube Escurridiza",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-24" width="60" height="48" rx="8" fill="#0F172A" stroke="${S}" stroke-width="4"/><rect x="-24" y="-18" width="48" height="36" rx="4" fill="#1E1B4B"/><circle cx="0" cy="0" r="10" fill="#A855F7" stroke="${S}" stroke-width="2"/><line x1="0" y1="-8" x2="0" y2="8" stroke="#FFFFFF" stroke-width="2"/><line x1="-8" y1="0" x2="8" y2="0" stroke="#FFFFFF" stroke-width="2"/><ellipse cx="26" cy="-16" rx="14" ry="8" fill="#FB7185" opacity="0.8"/>`,
    animatedSvg: (f: number) => {
      const cloudWobble = Math.sin(f / 4) * 4;
      return `<rect x="-30" y="-24" width="60" height="48" rx="8" fill="#0F172A" stroke="${S}" stroke-width="4.5"/><rect x="-24" y="-18" width="48" height="36" rx="4" fill="#1E1B4B"/><circle cx="0" cy="0" r="10" fill="#A855F7" stroke="${S}" stroke-width="2.5"/><line x1="0" y1="-8" x2="0" y2="8" stroke="#FFFFFF" stroke-width="2.5"/><line x1="-8" y1="0" x2="8" y2="0" stroke="#FFFFFF" stroke-width="2.5"/><g transform="translate(${cloudWobble.toFixed(1)}, 0)"><ellipse cx="28" cy="-18" rx="16" ry="9" fill="#FB7185" opacity="0.85"/><text x="28" y="-14" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">?</text></g>`;
    },
    tags: ["memoria", "trabajo", "caja_fuerte", "cerebro", "vapor", "simbolo"],
  },
  bandejas_moras_ans: {
    id: "bandejas_moras_ans",
    name: "Bandejas Comparativas de Moras ANS",
    family: "naturaleza_alimentos",
    defaultPlacement: "both",
    svg: `<ellipse cx="-20" cy="4" rx="18" ry="10" fill="#78350F" stroke="${S}" stroke-width="3"/><circle cx="-25" cy="0" r="4" fill="#7E22CE"/><circle cx="-18" cy="-2" r="4.5" fill="#9333EA"/><circle cx="-14" cy="2" r="4" fill="#A855F7"/><ellipse cx="20" cy="4" rx="18" ry="10" fill="#78350F" stroke="${S}" stroke-width="3"/><circle cx="15" cy="0" r="4" fill="#7E22CE"/><circle cx="22" cy="-2" r="4.5" fill="#9333EA"/><circle cx="25" cy="2" r="4" fill="#A855F7"/>`,
    animatedSvg: (f: number) => {
      const pulse = 1 + 0.08 * Math.sin(f / 5);
      return `<g transform="scale(${pulse.toFixed(3)})"><ellipse cx="-20" cy="4" rx="18" ry="10" fill="#78350F" stroke="${S}" stroke-width="3"/><circle cx="-25" cy="0" r="4" fill="#7E22CE"/><circle cx="-18" cy="-2" r="4.5" fill="#9333EA"/><circle cx="-14" cy="2" r="4" fill="#A855F7"/><circle cx="-21" cy="3" r="3.5" fill="#C084FC"/><ellipse cx="20" cy="4" rx="18" ry="10" fill="#78350F" stroke="${S}" stroke-width="3"/><circle cx="15" cy="0" r="4" fill="#7E22CE"/><circle cx="22" cy="-2" r="4.5" fill="#9333EA"/><circle cx="25" cy="2" r="4" fill="#A855F7"/><circle cx="18" cy="3" r="3.5" fill="#C084FC"/></g>`;
    },
    tags: ["bandejas", "moras", "ans", "aproximacion", "chimpance", "paloma", "bebe"],
  },
  engranaje_linguistico_dorado: {
    id: "engranaje_linguistico_dorado",
    name: "Engranaje Lingüístico Dorado de Hack Mental",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="22" fill="#F59E0B" stroke="${S}" stroke-width="4"/><circle cx="0" cy="0" r="8" fill="#FEF08A" stroke="${S}" stroke-width="3"/><polygon points="-4,-28 4,-28 3,-22 -3,-22" fill="#D97706"/><polygon points="-4,28 4,28 3,22 -3,22" fill="#D97706"/><polygon points="-28,-4 -28,4 -22,3 -22,-3" fill="#D97706"/><polygon points="28,-4 28,4 22,3 22,-3" fill="#D97706"/>`,
    animatedSvg: (f: number) => {
      const rot = (f * 4) % 360;
      return `<g transform="rotate(${rot} 0 0)"><circle cx="0" cy="0" r="22" fill="#F59E0B" stroke="${S}" stroke-width="4"/><circle cx="0" cy="0" r="8" fill="#FEF08A" stroke="${S}" stroke-width="3"/>${[0, 60, 120, 180, 240, 300].map(a => `<rect x="-4" y="-30" width="8" height="10" rx="2" fill="#D97706" stroke="${S}" stroke-width="2" transform="rotate(${a})"/>`).join("")}</g>`;
    },
    tags: ["engranaje", "dorado", "relojería", "tecnologia", "palabra", "hack", "mente"],
  },
  geometria_abstracta_innombrable: {
    id: "geometria_abstracta_innombrable",
    name: "Geometría Multidimensional Abstracta Innombrable",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<polygon points="0,-26 22,-6 14,24 -14,24 -22,-6" fill="#C084FC" stroke="${S}" stroke-width="3.5"/><line x1="0" y1="-26" x2="14" y2="24" stroke="#FFFFFF" stroke-width="2"/><line x1="0" y1="-26" x2="-14" y2="24" stroke="#FFFFFF" stroke-width="2"/><line x1="22" y1="-6" x2="-22" y2="-6" stroke="#FFFFFF" stroke-width="2"/><circle cx="0" cy="0" r="5" fill="#38BDF8"/>`,
    animatedSvg: (f: number) => {
      const spin = (f * 2) % 360;
      const glow = 0.7 + 0.3 * Math.sin(f / 6);
      return `<g transform="rotate(${spin} 0 0) scale(${glow.toFixed(3)})"><polygon points="0,-26 22,-6 14,24 -14,24 -22,-6" fill="#C084FC" stroke="${S}" stroke-width="4"/><line x1="0" y1="-26" x2="14" y2="24" stroke="#FFFFFF" stroke-width="2.5"/><line x1="0" y1="-26" x2="-14" y2="24" stroke="#FFFFFF" stroke-width="2.5"/><line x1="22" y1="-6" x2="-22" y2="-6" stroke="#FFFFFF" stroke-width="2.5"/><circle cx="0" cy="0" r="6" fill="#38BDF8"/></g>`;
    },
    tags: ["geometria", "abstracta", "tesseract", "innombrable", "cosmos", "filosofia"],
  },
  canica_solar_incandescente: {
    id: "canica_solar_incandescente",
    name: "Canica Solar Incandescente 2 cm",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="22" fill="#FDE047" stroke="${S}" stroke-width="4"/><circle cx="0" cy="0" r="16" fill="#F59E0B"/><circle cx="-6" cy="-6" r="6" fill="#FFFFFF" opacity="0.9"/><circle cx="6" cy="6" r="4" fill="#FEF08A"/>`,
    animatedSvg: (f: number) => {
      const glow = 1 + 0.08 * Math.sin(f / 5);
      const flare = Math.sin(f / 3) * 3;
      return `<g transform="scale(${glow.toFixed(3)})">
        <circle cx="0" cy="0" r="26" fill="#FEF08A" opacity="0.4"/>
        <circle cx="0" cy="0" r="22" fill="#FDE047" stroke="${S}" stroke-width="4.5"/>
        <circle cx="0" cy="0" r="16" fill="#F59E0B"/>
        <circle cx="-6" cy="-6" r="6" fill="#FFFFFF" opacity="0.95"/>
        <circle cx="${(6 + flare).toFixed(1)}" cy="${(6 - flare).toFixed(1)}" r="4.5" fill="#FEF08A"/>
      </g>`;
    },
    tags: ["canica", "solar", "sol", "escala", "dorada", "vidrio", "luz"],
  },
  lamina_escolar_sistema_solar: {
    id: "lamina_escolar_sistema_solar",
    name: "Lámina Escolar Arrugada Sistema Solar",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<polygon points="-26,-30 26,-26 22,30 -28,26" fill="#F8FAFC" stroke="${S}" stroke-width="4"/><circle cx="-12" cy="0" r="8" fill="#F59E0B"/><circle cx="2" cy="0" r="4" fill="#38BDF8"/><circle cx="12" cy="0" r="6" fill="#D97706"/><line x1="-20" y1="-10" x2="20" y2="10" stroke="#EF4444" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const crumple = (f * 2) % 10 < 5 ? 1 : 0.96;
      return `<g transform="scale(${crumple})">
        <polygon points="-26,-30 26,-26 22,30 -28,26" fill="#F8FAFC" stroke="${S}" stroke-width="4.5"/>
        <circle cx="-12" cy="0" r="8" fill="#F59E0B"/>
        <circle cx="2" cy="0" r="4" fill="#38BDF8"/>
        <circle cx="12" cy="0" r="6" fill="#D97706"/>
        <line x1="-22" y1="-14" x2="22" y2="14" stroke="#EF4444" stroke-width="4"/>
        <line x1="-22" y1="14" x2="22" y2="-14" stroke="#EF4444" stroke-width="4"/>
      </g>`;
    },
    tags: ["lamina", "escolar", "falso", "arrugado", "planetas", "papel"],
  },
  cinta_metrica_extendida: {
    id: "cinta_metrica_extendida",
    name: "Cinta Métrica Retráctil 2.15 Metros",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-18" y="-14" width="36" height="28" rx="6" fill="#EF4444" stroke="${S}" stroke-width="4"/><circle cx="0" cy="0" r="6" fill="#1E293B"/><rect x="18" y="-4" width="34" height="8" rx="2" fill="#FACC15" stroke="${S}" stroke-width="2"/><line x1="26" y1="-4" x2="26" y2="4" stroke="#000000" stroke-width="2"/><line x1="36" y1="-4" x2="36" y2="4" stroke="#000000" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const ext = 30 + Math.sin(f / 4) * 8;
      return `<rect x="-18" y="-14" width="36" height="28" rx="6" fill="#EF4444" stroke="${S}" stroke-width="4.5"/>
        <circle cx="0" cy="0" r="6" fill="#1E293B"/>
        <rect x="18" y="-5" width="${ext.toFixed(1)}" height="10" rx="2" fill="#FACC15" stroke="${S}" stroke-width="2.5"/>
        <line x1="28" y1="-5" x2="28" y2="5" stroke="#000000" stroke-width="2.5"/>
        <line x1="38" y1="-5" x2="38" y2="5" stroke="#000000" stroke-width="2.5"/>`;
    },
    tags: ["cinta", "metrica", "medir", "distancia", "metros", "escala"],
  },
  lupa_inspeccion_tierra_mota: {
    id: "lupa_inspeccion_tierra_mota",
    name: "Lupa de Inspección con Mota de la Tierra",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="-4" cy="-6" r="24" fill="#E0F2FE" stroke="${S}" stroke-width="4"/><circle cx="-4" cy="-6" r="2" fill="#38BDF8"/><line x1="13" y1="11" x2="32" y2="30" stroke="#78350F" stroke-width="7" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const pulse = 1 + 0.05 * Math.sin(f / 4);
      return `<circle cx="-4" cy="-6" r="24" fill="#E0F2FE" stroke="${S}" stroke-width="4.5"/>
        <circle cx="-4" cy="-6" r="20" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4 4"/>
        <g transform="scale(${pulse.toFixed(3)})"><circle cx="-4" cy="-6" r="3" fill="#0284C7"/><circle cx="-4" cy="-6" r="1.5" fill="#22C55E"/></g>
        <line x1="13" y1="11" x2="34" y2="32" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>`;
    },
    tags: ["lupa", "mota", "tierra", "macro", "polvo", "microscopico"],
  },
  planetas_semilla_alfiler: {
    id: "planetas_semilla_alfiler",
    name: "Planetas a Escala Semilla y Alfiler",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<ellipse cx="-12" cy="0" rx="6" ry="10" fill="#D97706" stroke="${S}" stroke-width="2.5"/><line x1="12" y1="-14" x2="12" y2="14" stroke="#64748B" stroke-width="2.5"/><circle cx="12" cy="-14" r="4" fill="#0284C7" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const floatY = Math.sin(f / 5) * 3;
      return `<g transform="translate(0, ${floatY.toFixed(1)})">
        <ellipse cx="-12" cy="0" rx="6" ry="10" fill="#D97706" stroke="${S}" stroke-width="3"/>
        <line x1="12" y1="-14" x2="12" y2="14" stroke="#64748B" stroke-width="3"/>
        <circle cx="12" cy="-14" r="4.5" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
      </g>`;
    },
    tags: ["planetas", "semilla", "alfiler", "jupiter", "neptuno", "escala"],
  },
  binoculares_radar_vacio: {
    id: "binoculares_radar_vacio",
    name: "Binoculares de Escaneo Cósmico Vacío",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-12" width="20" height="24" rx="4" fill="#1E293B" stroke="${S}" stroke-width="3.5"/><rect x="4" y="-12" width="20" height="24" rx="4" fill="#1E293B" stroke="${S}" stroke-width="3.5"/><rect x="-4" y="-6" width="8" height="12" rx="2" fill="#64748B"/><circle cx="-14" cy="0" r="6" fill="#38BDF8"/><circle cx="14" cy="0" r="6" fill="#38BDF8"/>`,
    animatedSvg: (f: number) => {
      const scanGlint = 0.5 + 0.5 * Math.sin(f / 4);
      return `<rect x="-24" y="-12" width="20" height="24" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/>
        <rect x="4" y="-12" width="20" height="24" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/>
        <rect x="-4" y="-6" width="8" height="12" rx="2" fill="#64748B"/>
        <circle cx="-14" cy="0" r="6" fill="#38BDF8" opacity="${scanGlint.toFixed(2)}"/>
        <circle cx="14" cy="0" r="6" fill="#38BDF8" opacity="${scanGlint.toFixed(2)}"/>`;
    },
    tags: ["binoculares", "radar", "vacio", "exploracion", "interespacial", "optico"],
  },
  mapa_carretera_570km: {
    id: "mapa_carretera_570km",
    name: "Tablet GPS Ruta Carretera 570 KM",
    family: "tecnologia",
    defaultPlacement: "left",
    svg: `<rect x="-26" y="-20" width="52" height="40" rx="6" fill="#0F172A" stroke="${S}" stroke-width="3.5"/><rect x="-22" y="-16" width="44" height="32" rx="4" fill="#1E293B"/><path d="M -16 10 Q 0 -10 16 -6" fill="none" stroke="#EF4444" stroke-width="3"/><circle cx="16" cy="-6" r="3" fill="#FEF08A"/>`,
    animatedSvg: (f: number) => {
      const blink = (f % 12 < 6);
      return `<rect x="-26" y="-20" width="52" height="40" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4"/>
        <rect x="-22" y="-16" width="44" height="32" rx="4" fill="#1E293B"/>
        <path d="M -16 10 Q 0 -10 16 -6" fill="none" stroke="#EF4444" stroke-width="3.5"/>
        <circle cx="-16" cy="10" r="3" fill="#F59E0B"/>
        <circle cx="16" cy="-6" r="3.5" fill="${blink ? '#22C55E' : '#EF4444'}"/>`;
    },
    tags: ["mapa", "carretera", "570km", "gps", "proxima", "distancia", "auto"],
  },
  auto_viaje_interestelar: {
    id: "auto_viaje_interestelar",
    name: "Vehículo de Viaje Interestelar por Autopista",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<path d="M -26 8 L -20 -4 L -4 -12 L 14 -12 L 24 -4 L 28 8 Z" fill="#EF4444" stroke="${S}" stroke-width="3.5"/><polygon points="-16 -4 -4 -10 12 -10 18 -4" fill="#38BDF8"/><circle cx="-14" cy="8" r="7" fill="#1E293B" stroke="${S}" stroke-width="2.5"/><circle cx="16" cy="8" r="7" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>`,
    animatedSvg: (f: number) => {
      const wobble = Math.sin(f / 2) * 1.5;
      return `<g transform="translate(0, ${wobble.toFixed(1)})">
        <path d="M -26 8 L -20 -4 L -4 -12 L 14 -12 L 24 -4 L 28 8 Z" fill="#EF4444" stroke="${S}" stroke-width="4"/>
        <polygon points="-16 -4 -4 -10 12 -10 18 -4" fill="#38BDF8"/>
        <circle cx="-14" cy="8" r="7" fill="#1E293B" stroke="${S}" stroke-width="3"/>
        <circle cx="16" cy="8" r="7" fill="#1E293B" stroke="${S}" stroke-width="3"/>
        <polygon points="28 2 34 0 34 6 28 4" fill="#FEF08A" opacity="0.8"/>
      </g>`;
    },
    tags: ["auto", "coche", "autopista", "viaje", "carretera", "570km"],
  },
  // ==========================================
  // PROPS: EL DEMONIO DE MAXWELL Y EL PRINCIPIO DE LANDAUER
  // ==========================================
  taza_cafe_vapor_termodinamico: {
    id: "taza_cafe_vapor_termodinamico",
    name: "Taza de Café con Vapor Termodinámico",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<ellipse cx="0" cy="18" rx="26" ry="7" fill="#CBD5E1" stroke="${S}" stroke-width="3"/><rect x="-18" y="-14" width="36" height="28" rx="6" fill="#F8FAFC" stroke="${S}" stroke-width="4"/><path d="M 18 -8 Q 28 -8 28 2 Q 28 10 18 10" fill="none" stroke="${S}" stroke-width="4"/><ellipse cx="0" cy="-14" rx="18" ry="6" fill="#78350F" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const s1 = Math.sin(f / 4) * 4;
      const s2 = Math.cos(f / 5) * 5;
      return `<ellipse cx="0" cy="18" rx="26" ry="7" fill="#CBD5E1" stroke="${S}" stroke-width="3.5"/>
        <rect x="-18" y="-14" width="36" height="28" rx="6" fill="#F8FAFC" stroke="${S}" stroke-width="4"/>
        <path d="M 18 -8 Q 28 -8 28 2 Q 28 10 18 10" fill="none" stroke="${S}" stroke-width="4"/>
        <ellipse cx="0" cy="-14" rx="18" ry="6" fill="#78350F" stroke="${S}" stroke-width="3.5"/>
        <path d="M -8 -18 Q ${-12 + s1} -28 ${-6 + s1} -38" fill="none" stroke="#94A3B8" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
        <path d="M 4 -18 Q ${8 + s2} -30 ${2 + s2} -42" fill="none" stroke="#94A3B8" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`;
    },
    tags: ["cafe", "taza", "vapor", "calor", "termodinamica", "entropia"],
  },
  sello_segunda_ley_prohibido: {
    id: "sello_segunda_ley_prohibido",
    name: "Sello Oficial Segunda Ley Termodinámica",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-18" width="60" height="36" rx="6" fill="#DC2626" stroke="${S}" stroke-width="4"/><rect x="-4" y="-36" width="8" height="20" rx="3" fill="#78350F" stroke="${S}" stroke-width="3"/><circle cx="0" cy="-36" r="8" fill="#B45309" stroke="${S}" stroke-width="3"/><text x="-24" y="-2" fill="#FFFFFF" font-size="8" font-weight="900" font-family="'Arial Black'">2ª LEY</text><text x="-24" y="10" fill="#FEF08A" font-size="7" font-weight="900" font-family="'Arial Black'">PROHIBIDO</text>`,
    animatedSvg: (f: number) => {
      const stampPulse = 1.0 + Math.sin(f / 4) * 0.05;
      return `<g transform="scale(${stampPulse.toFixed(3)})">
        <rect x="-32" y="-20" width="64" height="40" rx="6" fill="#DC2626" stroke="${S}" stroke-width="4.5"/>
        <rect x="-5" y="-38" width="10" height="20" rx="3" fill="#78350F" stroke="${S}" stroke-width="3.5"/>
        <circle cx="0" cy="-38" r="9" fill="#B45309" stroke="${S}" stroke-width="3.5"/>
        <text x="-26" y="-3" fill="#FFFFFF" font-size="9" font-weight="900" font-family="'Arial Black'">2ª LEY</text>
        <text x="-26" y="11" fill="#FEF08A" font-size="8" font-weight="900" font-family="'Arial Black'">PROHIBIDO</text>
      </g>`;
    },
    tags: ["sello", "segunda_ley", "termodinamica", "prohibido", "clausius", "fisica"],
  },
  cuernos_demonio_utileria: {
    id: "cuernos_demonio_utileria",
    name: "Cuernos y Tridente de Demonio Maxwell",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<path d="M -18 -8 Q -24 -24 -32 -26 Q -22 -16 -12 -12" fill="#DC2626" stroke="${S}" stroke-width="3.5"/><path d="M 18 -8 Q 24 -24 32 -26 Q 22 -16 12 -12" fill="#DC2626" stroke="${S}" stroke-width="3.5"/><ellipse cx="0" cy="-6" rx="22" ry="4" fill="none" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const glow = Math.sin(f / 6) * 3;
      return `<path d="M -18 -8 Q -24 ${-24 + glow} -32 -26 Q -22 -16 -12 -12" fill="#DC2626" stroke="${S}" stroke-width="4"/>
        <path d="M 18 -8 Q 24 ${-24 - glow} 32 -26 Q 22 -16 12 -12" fill="#DC2626" stroke="${S}" stroke-width="4"/>
        <ellipse cx="0" cy="-6" rx="22" ry="4" fill="none" stroke="${S}" stroke-width="3.5"/>
        <circle cx="-28" cy="-24" r="2" fill="#FEF08A"/>
        <circle cx="28" cy="-24" r="2" fill="#FEF08A"/>`;
    },
    tags: ["cuernos", "demonio", "maxwell", "utileria", "rojo", "disfraz"],
  },
  caja_gas_maxwell_particulas: {
    id: "caja_gas_maxwell_particulas",
    name: "Caja de Gas de Maxwell con Partículas",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-36" y="-24" width="72" height="48" rx="4" fill="#F8FAFC" fill-opacity="0.8" stroke="${S}" stroke-width="4"/><line x1="0" y1="-24" x2="0" y2="24" stroke="${S}" stroke-width="4"/><rect x="-4" y="-8" width="8" height="16" fill="#64748B" stroke="${S}" stroke-width="2"/><circle cx="-20" cy="-8" r="4" fill="#EF4444"/><circle cx="20" cy="8" r="4" fill="#3B82F6"/>`,
    animatedSvg: (f: number) => {
      const rx1 = -24 + Math.sin(f * 0.25) * 8;
      const ry1 = -6 + Math.cos(f * 0.3) * 12;
      const bx1 = 20 + Math.cos(f * 0.15) * 8;
      const by1 = 6 + Math.sin(f * 0.18) * 10;
      const gateOpen = Math.sin(f * 0.2) > 0.4 ? -14 : -4;
      return `<rect x="-38" y="-26" width="76" height="52" rx="5" fill="#0F172A" fill-opacity="0.85" stroke="${S}" stroke-width="4.5"/>
        <line x1="0" y1="-26" x2="0" y2="26" stroke="${S}" stroke-width="4.5"/>
        <rect x="-3" y="${gateOpen}" width="6" height="16" fill="#FACC15" stroke="${S}" stroke-width="2"/>
        <circle cx="${rx1.toFixed(1)}" cy="${ry1.toFixed(1)}" r="4.5" fill="#EF4444" stroke="#000000" stroke-width="1.5"/>
        <circle cx="${bx1.toFixed(1)}" cy="${by1.toFixed(1)}" r="4.5" fill="#38BDF8" stroke="#000000" stroke-width="1.5"/>`;
    },
    tags: ["caja", "gas", "maxwell", "particulas", "moleculas", "compuerta"],
  },
  palanca_compuerta_maxwell: {
    id: "palanca_compuerta_maxwell",
    name: "Palanca Mecánica de la Compuerta",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-14" y="10" width="28" height="14" rx="3" fill="#334155" stroke="${S}" stroke-width="3.5"/><line x1="0" y1="10" x2="0" y2="-22" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/><circle cx="0" cy="-22" r="7" fill="#DC2626" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const leverAngle = Math.sin(f * 0.3) * 22;
      return `<rect x="-16" y="10" width="32" height="14" rx="3" fill="#334155" stroke="${S}" stroke-width="4"/>
        <g transform="rotate(${leverAngle.toFixed(1)} 0 10)">
          <line x1="0" y1="10" x2="0" y2="-24" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round"/>
          <circle cx="0" cy="-24" r="8" fill="#DC2626" stroke="${S}" stroke-width="3.5"/>
        </g>`;
    },
    tags: ["palanca", "mecanismo", "compuerta", "demonio", "control", "rapidez"],
  },
  termometros_contraste_maxwell: {
    id: "termometros_contraste_maxwell",
    name: "Termómetros en Contraste Calor vs Frío",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<g transform="translate(-16, 0)"><rect x="-5" y="-24" width="10" height="34" rx="4" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><rect x="-3" y="-12" width="6" height="22" rx="2" fill="#EF4444"/><circle cx="0" cy="14" r="8" fill="#EF4444" stroke="${S}" stroke-width="3"/></g>
      <g transform="translate(16, 0)"><rect x="-5" y="-24" width="10" height="34" rx="4" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><rect x="-3" y="2" width="6" height="8" rx="2" fill="#38BDF8"/><circle cx="0" cy="14" r="8" fill="#38BDF8" stroke="${S}" stroke-width="3"/></g>`,
    animatedSvg: (f: number) => {
      const bubble = Math.sin(f / 3) * 2;
      return `<g transform="translate(-18, 0)">
        <rect x="-6" y="-26" width="12" height="38" rx="5" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/>
        <rect x="-4" y="${-22 + bubble}" width="8" height="${32 - bubble}" rx="2" fill="#EF4444"/>
        <circle cx="0" cy="16" r="9" fill="#EF4444" stroke="${S}" stroke-width="3.5"/>
        <text x="-4" y="-30" fill="#EF4444" font-size="9" font-weight="900">100°</text>
      </g>
      <g transform="translate(18, 0)">
        <rect x="-6" y="-26" width="12" height="38" rx="5" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/>
        <rect x="-4" y="6" width="8" height="6" rx="2" fill="#38BDF8"/>
        <circle cx="0" cy="16" r="9" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/>
        <text x="-2" y="-30" fill="#38BDF8" font-size="9" font-weight="900">0°</text>
      </g>`;
    },
    tags: ["termometro", "calor", "frio", "gradiente", "maxwell", "100grados"],
  },
  memoria_saturada_bits_landauer: {
    id: "memoria_saturada_bits_landauer",
    name: "Memoria Saturada y Bits de Información",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-20" width="60" height="40" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4"/><rect x="-24" y="-14" width="48" height="12" rx="3" fill="#DC2626"/><text x="-20" y="-5" fill="#FFFFFF" font-size="7" font-weight="900">FULL 100%</text><text x="-24" y="10" fill="#22C55E" font-size="9" font-weight="900" font-family="monospace">1011001</text>`,
    animatedSvg: (f: number) => {
      const alertBlink = (f % 8 < 4);
      return `<rect x="-32" y="-22" width="64" height="44" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>
        <rect x="-26" y="-16" width="52" height="14" rx="3" fill="${alertBlink ? '#DC2626' : '#991B1B'}"/>
        <text x="-22" y="-6" fill="#FFFFFF" font-size="8" font-weight="900">FULL 100%</text>
        <text x="-26" y="12" fill="#22C55E" font-size="10" font-weight="900" font-family="monospace">${(f % 2 === 0) ? '1011001' : '0110110'}</text>`;
    },
    tags: ["memoria", "bits", "landauer", "storage", "sobrecarga", "computacion"],
  },
  goma_borrar_landauer_chispas: {
    id: "goma_borrar_landauer_chispas",
    name: "Goma de Borrar Térmica de Landauer",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="-24,-14 16,-14 24,14 -16,14" fill="#3B82F6" stroke="${S}" stroke-width="4"/><polygon points="-24,-14 -4,-14 4,14 -16,14" fill="#EF4444" stroke="${S}" stroke-width="3"/><text x="-12" y="4" fill="#FFFFFF" font-size="7" font-weight="900">ERASE</text>`,
    animatedSvg: (f: number) => {
      const scrub = Math.sin(f * 0.4) * 6;
      return `<g transform="translate(${scrub.toFixed(1)}, 0)">
        <polygon points="-26,-16 18,-16 26,16 -18,16" fill="#3B82F6" stroke="${S}" stroke-width="4.5"/>
        <polygon points="-26,-16 -4,-16 4,16 -18,16" fill="#EF4444" stroke="${S}" stroke-width="3.5"/>
        <text x="-12" y="4" fill="#FFFFFF" font-size="8" font-weight="900">DELETE</text>
        <circle cx="24" cy="14" r="2.5" fill="#F59E0B"/>
        <circle cx="28" cy="10" r="1.5" fill="#FEF08A"/>
        <circle cx="20" cy="18" r="2" fill="#EF4444"/>
      </g>`;
    },
    tags: ["goma", "borrar", "landauer", "chispas", "calor", "delete", "entropia"],
  },
  teclado_tecla_delete_fuego: {
    id: "teclado_tecla_delete_fuego",
    name: "Teclado con Tecla Delete en Llamas",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-26" y="-16" width="52" height="32" rx="5" fill="#1E293B" stroke="${S}" stroke-width="4"/><rect x="-18" y="-10" width="36" height="20" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2.5"/><text x="-14" y="4" fill="#FFFFFF" font-size="8" font-weight="900">DELETE</text>`,
    animatedSvg: (f: number) => {
      const flameWobble = Math.sin(f / 2) * 3;
      return `<rect x="-28" y="-18" width="56" height="36" rx="6" fill="#1E293B" stroke="${S}" stroke-width="4.5"/>
        <rect x="-20" y="-12" width="40" height="24" rx="4" fill="#DC2626" stroke="${S}" stroke-width="3"/>
        <text x="-16" y="4" fill="#FFFFFF" font-size="9" font-weight="900">DELETE</text>
        <path d="M 6 -12 Q ${10 + flameWobble} -28 16 -16 Q ${12 - flameWobble} -22 6 -12 Z" fill="#F59E0B"/>
        <circle cx="12" cy="-20" r="2" fill="#FEF08A"/>`;
    },
    tags: ["teclado", "delete", "fuego", "landauer", "tecla", "entropia", "informacion"],
  },
  // ==========================================
  // PROPS: POR QUÉ EL TIEMPO VUELA CUANDO CRECES
  // ==========================================
  barquito_papel_charco: {
    id: "barquito_papel_charco",
    name: "Barquito de Papel en Charco Dorado",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<ellipse cx="0" cy="14" rx="32" ry="8" fill="#38BDF8" fill-opacity="0.4" stroke="${S}" stroke-width="3"/><polygon points="-24,10 24,10 16,18 -16,18" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/><polygon points="-12,10 0,-14 0,10" fill="#F1F5F9" stroke="${S}" stroke-width="3"/><polygon points="0,10 0,-14 14,10" fill="#E2E8F0" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const bob = Math.sin(f / 4) * 3;
      const tilt = Math.sin(f / 5) * 5;
      return `<ellipse cx="0" cy="16" rx="34" ry="9" fill="#38BDF8" fill-opacity="0.45" stroke="${S}" stroke-width="3.5"/>
        <g transform="translate(0, ${bob.toFixed(1)}) rotate(${tilt.toFixed(1)} 0 10)">
          <polygon points="-26,10 26,10 18,18 -18,18" fill="#F8FAFC" stroke="${S}" stroke-width="4"/>
          <polygon points="-14,10 0,-16 0,10" fill="#F1F5F9" stroke="${S}" stroke-width="3.5"/>
          <polygon points="0,10 0,-16 16,10" fill="#E2E8F0" stroke="${S}" stroke-width="3.5"/>
          <circle cx="18" cy="12" r="2" fill="#38BDF8"/>
        </g>`;
    },
    tags: ["barquito", "papel", "charco", "infancia", "juego", "verano", "origami"],
  },
  calendario_ventisca_reloj_aspas: {
    id: "calendario_ventisca_reloj_aspas",
    name: "Calendario en Ventisca y Reloj Acelerado",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-20" width="34" height="40" rx="4" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/><rect x="-24" y="-20" width="34" height="12" fill="#DC2626"/><circle cx="20" cy="0" r="18" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/><line x1="20" y1="0" x2="20" y2="-12" stroke="${S}" stroke-width="3"/><line x1="20" y1="0" x2="30" y2="0" stroke="#DC2626" stroke-width="2.5"/>`,
    animatedSvg: (f: number) => {
      const handRot = (f * 18) % 360;
      const sheetFly = (f * 8) % 60;
      return `<rect x="-26" y="-22" width="36" height="44" rx="4" fill="#F8FAFC" stroke="${S}" stroke-width="4"/>
        <rect x="-26" y="-22" width="36" height="14" fill="#DC2626"/>
        <text x="-20" y="-12" fill="#FFFFFF" font-size="8" font-weight="900">2026</text>
        <g transform="translate(${-sheetFly}, ${-sheetFly * 0.5}) rotate(${-sheetFly * 2})">
          <rect x="-10" y="-8" width="16" height="14" rx="2" fill="#FEF08A" stroke="${S}" stroke-width="2" opacity="0.8"/>
        </g>
        <g transform="translate(22, 0)">
          <circle cx="0" cy="0" r="20" fill="#F8FAFC" stroke="${S}" stroke-width="4"/>
          <circle cx="0" cy="0" r="3" fill="#000000"/>
          <g transform="rotate(${handRot})">
            <line x1="0" y1="0" x2="0" y2="-15" stroke="#000000" stroke-width="3.5" stroke-linecap="round"/>
          </g>
          <g transform="rotate(${handRot * 12})">
            <line x1="0" y1="0" x2="16" y2="0" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        </g>`;
    },
    tags: ["calendario", "reloj", "huracan", "tiempo", "aceleracion", "edad", "viento"],
  },
  pastel_cinco_rebanadas_20pct: {
    id: "pastel_cinco_rebanadas_20pct",
    name: "Pastel Circular de 5 Años con 20% Gigante",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="28" fill="#F8FAFC" stroke="${S}" stroke-width="4"/><path d="M 0,0 L 28,0 A 28,28 0 0,1 8,26 Z" fill="#F59E0B" stroke="${S}" stroke-width="3"/><text x="4" y="16" fill="#000000" font-size="9" font-weight="900">20%</text>`,
    animatedSvg: (f: number) => {
      const slicePop = 1.0 + Math.sin(f / 4) * 0.06;
      return `<circle cx="0" cy="0" r="30" fill="#E2E8F0" stroke="${S}" stroke-width="4.5"/>
        <line x1="0" y1="0" x2="0" y2="-30" stroke="${S}" stroke-width="3"/>
        <line x1="0" y1="0" x2="28" y2="-10" stroke="${S}" stroke-width="3"/>
        <line x1="0" y1="0" x2="18" y2="24" stroke="${S}" stroke-width="3"/>
        <line x1="0" y1="0" x2="-18" y2="24" stroke="${S}" stroke-width="3"/>
        <line x1="0" y1="0" x2="-28" y2="-10" stroke="${S}" stroke-width="3"/>
        <g transform="scale(${slicePop.toFixed(3)})">
          <path d="M 0,0 L 28,-10 A 30,30 0 0,1 18,24 Z" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
          <circle cx="16" cy="6" r="3" fill="#FEF08A"/>
          <text x="6" y="10" fill="#020617" font-size="11" font-weight="900" fontFamily="'Arial Black'">20%</text>
        </g>`;
    },
    tags: ["pastel", "proporcion", "20porciento", "5anos", "infancia", "fraccion", "tiempo"],
  },
  reloj_arena_lento_granos_oro: {
    id: "reloj_arena_lento_granos_oro",
    name: "Reloj de Arena Lento con Granos de Oro",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="-18,-26 18,-26 4,-2 18,22 -18,22 -4,-2" fill="#E0F2FE" stroke="${S}" stroke-width="4"/><line x1="-22" y1="-26" x2="22" y2="-26" stroke="${S}" stroke-width="4.5"/><line x1="-22" y1="22" x2="22" y2="22" stroke="${S}" stroke-width="4.5"/><polygon points="-12,-20 12,-20 0,-4" fill="#FACC15"/><circle cx="0" cy="8" r="2.5" fill="#F59E0B"/><polygon points="-14,20 14,20 0,14" fill="#FACC15"/>`,
    animatedSvg: (f: number) => {
      const dropY = (f * 2) % 18;
      return `<polygon points="-20,-28 20,-28 5,-2 20,24 -20,24 -5,-2" fill="#E0F2FE" fill-opacity="0.8" stroke="${S}" stroke-width="4.5"/>
        <line x1="-24" y1="-28" x2="24" y2="-28" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
        <line x1="-24" y1="24" x2="24" y2="24" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
        <polygon points="-14,-22 14,-22 0,-4" fill="#FACC15"/>
        <circle cx="0" cy="${-2 + dropY}" r="3" fill="#D97706" stroke="#000000" stroke-width="1"/>
        <polygon points="-16,22 16,22 0,10" fill="#FACC15"/>
        <circle cx="-6" cy="18" r="1.5" fill="#FEF08A"/>
        <circle cx="6" cy="18" r="1.5" fill="#FEF08A"/>`;
    },
    tags: ["reloj_arena", "lento", "grano_a_grano", "oro", "infancia", "eterno", "tiempo"],
  },
  pastel_cincuenta_rebanadas_2pct: {
    id: "pastel_cincuenta_rebanadas_2pct",
    name: "Pastel de 50 Rodajas Finas con 2% Insignificante",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="30" fill="#94A3B8" stroke="${S}" stroke-width="4"/><line x1="0" y1="0" x2="4" y2="-30" stroke="#DC2626" stroke-width="3"/><text x="8" y="-12" fill="#DC2626" font-size="9" font-weight="900">2%</text>`,
    animatedSvg: (f: number) => {
      const wobble = Math.sin(f / 3) * 2;
      const degs = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345];
      const lines = degs.map((d) => `<line x1="0" y1="0" x2="${(Math.cos(d * Math.PI / 180) * 32).toFixed(1)}" y2="${(Math.sin(d * Math.PI / 180) * 32).toFixed(1)}" stroke="#64748B" stroke-width="1.5"/>`).join("");
      return `<circle cx="0" cy="0" r="32" fill="#CBD5E1" stroke="${S}" stroke-width="4.5"/>
        ${lines}
        <g transform="translate(${wobble.toFixed(1)}, -4)">
          <polygon points="0,0 4,-32 1,-32" fill="#EF4444" stroke="#000000" stroke-width="2"/>
          <rect x="8" y="-24" width="28" height="14" rx="3" fill="#020617" stroke="#EF4444" stroke-width="1.5"/>
          <text x="12" y="-14" fill="#FEF08A" font-size="8" font-weight="900">2%</text>
        </g>`;
    },
    tags: ["pastel", "50anos", "2porciento", "rebanada_fina", "adultez", "fideo", "proporcion"],
  },
  reloj_arena_chorro_acelerado: {
    id: "reloj_arena_chorro_acelerado",
    name: "Reloj de Arena Acelerado Chorro Líquido",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<g transform="rotate(18 0 0)"><polygon points="-18,-26 18,-26 4,-2 18,22 -18,22 -4,-2" fill="#E0F2FE" stroke="${S}" stroke-width="4"/><line x1="0" y1="-2" x2="0" y2="20" stroke="#F59E0B" stroke-width="6"/></g>`,
    animatedSvg: (f: number) => {
      const streamPulse = 5 + Math.sin(f * 0.8) * 2;
      return `<g transform="rotate(22 0 0)">
        <polygon points="-20,-28 20,-28 5,-2 20,24 -20,24 -5,-2" fill="#E0F2FE" fill-opacity="0.8" stroke="${S}" stroke-width="4.5"/>
        <line x1="-24" y1="-28" x2="24" y2="-28" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
        <line x1="-24" y1="24" x2="24" y2="24" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>
        <polygon points="-8,-24 8,-24 0,-8" fill="#FACC15"/>
        <line x1="0" y1="-8" x2="0" y2="22" stroke="#D97706" stroke-width="${streamPulse.toFixed(1)}" stroke-linecap="round"/>
        <polygon points="-18,22 18,22 0,6" fill="#FACC15"/>
      </g>`;
    },
    tags: ["reloj_arena", "rapido", "chorro", "acelerado", "adultez", "fuga", "tiempo"],
  },
  archivador_sello_repetido_mental: {
    id: "archivador_sello_repetido_mental",
    name: "Sello Mental de Rutina REPETIDO y Carpetas",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="6" width="48" height="18" rx="4" fill="#3B82F6" stroke="${S}" stroke-width="3.5"/><rect x="-18" y="-12" width="36" height="16" rx="4" fill="#DC2626" stroke="${S}" stroke-width="3.5"/><text x="-14" y="-1" fill="#FFFFFF" font-size="7" font-weight="900">REPETIDO</text>`,
    animatedSvg: (f: number) => {
      const stampSplat = (f % 10 < 5) ? -4 : 6;
      return `<g>
        <rect x="-26" y="8" width="52" height="16" rx="3" fill="#E2E8F0" stroke="${S}" stroke-width="4"/>
        <rect x="-20" y="11" width="40" height="4" fill="#94A3B8"/>
        <g transform="translate(0, ${stampSplat})">
          <rect x="-6" y="-30" width="12" height="18" rx="4" fill="#78350F" stroke="${S}" stroke-width="3"/>
          <rect x="-22" y="-12" width="44" height="20" rx="4" fill="#DC2626" stroke="${S}" stroke-width="4"/>
          <text x="-18" y="2" fill="#FEF08A" font-size="8" font-weight="900" fontFamily="'Arial Black'">REPETIDO</text>
        </g>
      </g>`;
    },
    tags: ["sello", "repetido", "rutina", "archivador", "compresion", "cerebro", "memoria"],
  },
  helado_mariposa_recuerdo_4k: {
    id: "helado_mariposa_recuerdo_4k",
    name: "Helado Brillante y Mariposa Recuerdo 4K",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: `<polygon points="-10,6 10,6 0,26" fill="#D97706" stroke="${S}" stroke-width="3"/><circle cx="0" cy="0" r="12" fill="#F43F5E" stroke="${S}" stroke-width="3"/><circle cx="0" cy="-12" r="10" fill="#FEF08A" stroke="${S}" stroke-width="3"/><circle cx="18" cy="-18" r="6" fill="#38BDF8"/>`,
    animatedSvg: (f: number) => {
      const flap = Math.sin(f * 0.4) * 8;
      return `<polygon points="-12,6 12,6 0,28" fill="#D97706" stroke="${S}" stroke-width="3.5"/>
        <line x1="-6" y1="12" x2="6" y2="12" stroke="#78350F" stroke-width="2"/>
        <line x1="-3" y1="20" x2="3" y2="20" stroke="#78350F" stroke-width="2"/>
        <circle cx="0" cy="0" r="14" fill="#F43F5E" stroke="${S}" stroke-width="3.5"/>
        <circle cx="0" cy="-14" r="11" fill="#FEF08A" stroke="${S}" stroke-width="3.5"/>
        <circle cx="-4" cy="-16" r="2" fill="#EF4444"/>
        <circle cx="4" cy="-12" r="2" fill="#3B82F6"/>
        <g transform="translate(24, -20)">
          <path d="M 0,0 Q ${8 + flap},-8 14,-4 Q 10,4 0,0" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
          <path d="M 0,0 Q ${-8 - flap},-8 -14,-4 Q -10,4 0,0" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#000000" stroke-width="2"/>
        </g>`;
    },
    tags: ["helado", "mariposa", "recuerdo", "4k", "infancia", "primera_vez", "asombro"],
  },
  rueda_hamster_oficina_cubiculos: {
    id: "rueda_hamster_oficina_cubiculos",
    name: "Rueda de Hámster de Oficina Rutinaria",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="30" fill="none" stroke="${S}" stroke-width="5"/><circle cx="0" cy="0" r="22" fill="none" stroke="#94A3B8" stroke-width="3" stroke-dasharray="8 6"/><rect x="-10" y="8" width="20" height="10" rx="2" fill="#334155"/>`,
    animatedSvg: (f: number) => {
      const rotWheel = (f * 6) % 360;
      return `<g transform="rotate(${rotWheel} 0 0)">
        <circle cx="0" cy="0" r="34" fill="none" stroke="${S}" stroke-width="6"/>
        <circle cx="0" cy="0" r="26" fill="none" stroke="#64748B" stroke-width="4" stroke-dasharray="10 8"/>
        <line x1="-34" y1="0" x2="34" y2="0" stroke="${S}" stroke-width="3"/>
        <line x1="0" y1="-34" x2="0" y2="34" stroke="${S}" stroke-width="3"/>
        <rect x="-8" y="-30" width="16" height="8" rx="2" fill="#38BDF8"/>
        <rect x="-8" y="22" width="16" height="8" rx="2" fill="#38BDF8"/>
      </g>`;
    },
    tags: ["rueda", "hamster", "oficina", "rutina", "bucle", "infinito", "trabajo"],
  },
  mochila_guitarra_mapa_aventura: {
    id: "mochila_guitarra_mapa_aventura",
    name: "Mochila de Explorador, Guitarra y Mapa",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<rect x="-18" y="-16" width="36" height="34" rx="8" fill="#15803D" stroke="${S}" stroke-width="4"/><path d="M 12,-28 L 22,-8 L 18,2 Z" fill="#D97706" stroke="${S}" stroke-width="3"/><rect x="-24" y="6" width="16" height="10" rx="3" fill="#FEF08A" stroke="${S}" stroke-width="2.5"/>`,
    animatedSvg: (f: number) => {
      const bounce = Math.sin(f / 3) * 2;
      return `<g transform="translate(0, ${bounce.toFixed(1)})">
        <rect x="-20" y="-18" width="40" height="38" rx="9" fill="#15803D" stroke="${S}" stroke-width="4.5"/>
        <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#166534" stroke="${S}" stroke-width="3"/>
        <line x1="-8" y1="-18" x2="-8" y2="20" stroke="#FACC15" stroke-width="3"/>
        <line x1="8" y1="-18" x2="8" y2="20" stroke="#FACC15" stroke-width="3"/>
        <g transform="translate(14, -14) rotate(25)">
          <path d="M -6,0 Q -10,-10 -6,-16 L -2,-16 Q 2,-10 -2,0 Z" fill="#B45309" stroke="${S}" stroke-width="2.5"/>
          <line x1="-4" y1="-16" x2="-4" y2="-28" stroke="#78350F" stroke-width="4"/>
          <circle cx="-4" cy="-28" r="4" fill="#D97706"/>
        </g>
        <rect x="-26" y="8" width="18" height="10" rx="3" fill="#FEF08A" stroke="${S}" stroke-width="3"/>
      </g>`;
    },
    tags: ["mochila", "guitarra", "mapa", "aventura", "explorador", "viaje", "antidoto"],
  },
  // ==========================================
  // PROPS: LA PARADOJA DE FERMI Y EL GRAN SILENCIO
  // ==========================================
  vaso_antena_cuerda_espacio: {
    id: "vaso_antena_cuerda_espacio",
    name: "Vaso de Cartón con Cuerda Radiotelescopio Casero",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="-10,-18 10,-18 16,18 -16,18" fill="#F8FAFC" stroke="${S}" stroke-width="4"/><ellipse cx="0" cy="-18" rx="10" ry="4" fill="#E2E8F0" stroke="${S}" stroke-width="3"/><line x1="0" y1="18" x2="24" y2="34" stroke="#DC2626" stroke-width="3" stroke-linecap="round"/><circle cx="24" cy="34" r="3" fill="#DC2626"/>`,
    animatedSvg: (f: number) => {
      const jiggle = Math.sin(f / 3) * 2;
      return `<g transform="translate(${jiggle.toFixed(1)}, 0)">
        <polygon points="-12,-20 12,-20 18,20 -18,20" fill="#F8FAFC" stroke="${S}" stroke-width="4.5"/>
        <ellipse cx="0" cy="-20" rx="12" ry="5" fill="#E2E8F0" stroke="${S}" stroke-width="3.5"/>
        <line x1="0" y1="20" x2="28" y2="38" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="28" cy="38" r="3.5" fill="#DC2626"/>
        <path d="M -8,-28 Q 0,-34 8,-28" fill="none" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
      </g>`;
    },
    tags: ["vaso", "antena", "cuerda", "fermi", "silencio", "espacio", "escucha"],
  },
  holograma_via_lactea_colonizacion: {
    id: "holograma_via_lactea_colonizacion",
    name: "Holograma 3D de la Vía Láctea y Colonización",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<ellipse cx="0" cy="0" rx="34" ry="16" fill="#0F172A" stroke="#22C55E" stroke-width="3"/><circle cx="0" cy="0" r="8" fill="#FEF08A"/><circle cx="-18" cy="-4" r="3" fill="#22C55E"/><circle cx="18" cy="4" r="3" fill="#22C55E"/><path d="M -18,-4 Q 0,8 18,4" fill="none" stroke="#22C55E" stroke-width="2" stroke-dasharray="4 3"/>`,
    animatedSvg: (f: number) => {
      const rot = (f * 3) % 360;
      const pulse = 1.0 + Math.sin(f / 4) * 0.05;
      return `<g transform="scale(${pulse.toFixed(3)})">
        <ellipse cx="0" cy="0" rx="36" ry="18" fill="#020617" fill-opacity="0.85" stroke="#22C55E" stroke-width="3.5"/>
        <circle cx="0" cy="0" r="9" fill="#FEF08A" stroke="#F59E0B" stroke-width="2"/>
        <g transform="rotate(${rot.toFixed(1)} 0 0)">
          <ellipse cx="0" cy="0" rx="28" ry="10" fill="none" stroke="#38BDF8" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
          <circle cx="-16" cy="-4" r="3.5" fill="#22C55E" stroke="#000000" stroke-width="1.5"/>
          <circle cx="16" cy="4" r="3.5" fill="#22C55E" stroke="#000000" stroke-width="1.5"/>
          <circle cx="0" cy="-8" r="3" fill="#38BDF8"/>
        </g>
      </g>`;
    },
    tags: ["holograma", "via_lactea", "galaxia", "colonizacion", "fermi", "estrellas"],
  },
  puntero_cientifico_fermi: {
    id: "puntero_cientifico_fermi",
    name: "Puntero Telescópico de Presentación Científica",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<line x1="-16" y1="18" x2="22" y2="-22" stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round"/><circle cx="22" cy="-22" r="5" fill="#22C55E" stroke="${S}" stroke-width="2"/><rect x="-20" y="14" width="8" height="12" rx="2" fill="#78350F" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const glint = (f % 10 < 5);
      return `<line x1="-18" y1="20" x2="26" y2="-24" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round"/>
        <rect x="-22" y="16" width="8" height="12" rx="2" fill="#78350F" stroke="${S}" stroke-width="2.5"/>
        <circle cx="26" cy="-24" r="6" fill="${glint ? '#4ADE80' : '#16A34A'}" stroke="${S}" stroke-width="2.5"/>`;
    },
    tags: ["puntero", "conferencia", "fermi", "ciencia", "presentacion", "explicacion"],
  },
  auriculares_seti_dial: {
    id: "auriculares_seti_dial",
    name: "Auriculares Profesionales y Dial de Radio SETI",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<path d="M -18,6 A 18,18 0 0,1 18,6" fill="none" stroke="${S}" stroke-width="5" stroke-linecap="round"/><rect x="-24" y="0" width="8" height="16" rx="4" fill="#1E293B" stroke="${S}" stroke-width="3"/><rect x="16" y="0" width="8" height="16" rx="4" fill="#1E293B" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const pulseEar = Math.sin(f / 4) * 1.5;
      return `<g transform="translate(0, ${pulseEar.toFixed(1)})">
        <path d="M -20,8 A 20,20 0 0,1 20,8" fill="none" stroke="${S}" stroke-width="5.5" stroke-linecap="round"/>
        <rect x="-26" y="2" width="10" height="18" rx="4" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
        <rect x="16" y="2" width="10" height="18" rx="4" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
        <circle cx="21" cy="11" r="2" fill="#38BDF8"/>
      </g>`;
    },
    tags: ["auriculares", "seti", "radio", "escucha", "antena", "frecuencia", "dial"],
  },
  muro_gran_filtro_obsidiana: {
    id: "muro_gran_filtro_obsidiana",
    name: "Muro del Gran Filtro de Obsidiana con Picos",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-18" y="-30" width="36" height="60" rx="4" fill="#0F172A" stroke="${S}" stroke-width="4.5"/><polygon points="-18,-30 -12,-38 -6,-30 0,-38 6,-30 12,-38 18,-30" fill="#000000" stroke="${S}" stroke-width="3"/><text x="-12" y="4" fill="#EF4444" font-size="8" font-weight="900">FILTER</text>`,
    animatedSvg: (f: number) => {
      const glowWarn = Math.sin(f / 4) * 0.3 + 0.7;
      return `<rect x="-20" y="-32" width="40" height="64" rx="5" fill="#020617" stroke="#EF4444" stroke-width="4.5"/>
        <polygon points="-20,-32 -14,-42 -7,-32 0,-42 7,-32 14,-42 20,-32" fill="#000000" stroke="#EF4444" stroke-width="3.5"/>
        <text x="-14" y="6" fill="#FEF08A" font-size="9" font-weight="900" fontFamily="'Arial Black'" opacity="${glowWarn.toFixed(2)}">FILTER</text>
        <line x1="-16" y1="16" x2="16" y2="16" stroke="#EF4444" stroke-width="2"/>`;
    },
    tags: ["gran_filtro", "muro", "obsidiana", "extincion", "barrera", "cosmos", "peligro"],
  },
  holograma_amenazas_futuro: {
    id: "holograma_amenazas_futuro",
    name: "Holograma de Amenazas Tecnológicas Futuras",
    family: "tecnologia",
    defaultPlacement: "left",
    svg: `<rect x="-26" y="-18" width="52" height="36" rx="6" fill="#0F172A" stroke="#EF4444" stroke-width="3.5"/><polygon points="-12,10 0,-12 12,10" fill="#DC2626"/><circle cx="0" cy="2" r="3" fill="#FEF08A"/>`,
    animatedSvg: (f: number) => {
      const warnBlink = (f % 8 < 4);
      return `<rect x="-28" y="-20" width="56" height="40" rx="6" fill="#020617" stroke="${warnBlink ? '#EF4444' : '#7F1D1D'}" stroke-width="4"/>
        <polygon points="-14,12 0,-14 14,12" fill="#DC2626" stroke="#000000" stroke-width="2.5"/>
        <text x="-6" y="8" fill="#FEF08A" font-size="12" font-weight="900" fontFamily="'Arial Black'">!</text>
        <circle cx="18" cy="-12" r="3" fill="#EF4444"/>`;
    },
    tags: ["amenaza", "futuro", "ia", "nuclear", "peligro", "advertencia", "holograma"],
  },
  linterna_bosque_haz_revelador: {
    id: "linterna_bosque_haz_revelador",
    name: "Linterna de Campo con Haz de Luz Revelador",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-6" width="28" height="12" rx="3" fill="#334155" stroke="${S}" stroke-width="3"/><polygon points="10,-10 18,-6 18,6 10,10" fill="#64748B" stroke="${S}" stroke-width="3"/><polygon points="18,-14 44,-24 44,24 18,14" fill="#FEF08A" fill-opacity="0.5"/>`,
    animatedSvg: (f: number) => {
      const beamWobble = Math.sin(f / 3) * 3;
      return `<g>
        <rect x="-20" y="-7" width="30" height="14" rx="3" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
        <polygon points="10,-11 20,-7 20,7 10,11" fill="#475569" stroke="${S}" stroke-width="3.5"/>
        <polygon points="20,-14 52,${-28 + beamWobble} 52,${28 + beamWobble} 20,14" fill="#FEF08A" fill-opacity="0.6"/>
        <circle cx="36" cy="${beamWobble}" r="2" fill="#FFFFFF"/>
      </g>`;
    },
    tags: ["linterna", "bosque_oscuro", "luz", "haz", "revelador", "cazador", "sigilo"],
  },
  palido_punto_azul_esfera: {
    id: "palido_punto_azul_esfera",
    name: "Pálido Punto Azul Planeta Tierra en Manos",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="24" fill="#0284C7" stroke="${S}" stroke-width="4"/><path d="M -12,-8 Q 0,-18 12,-6 Q 8,8 -6,14 Z" fill="#22C55E"/><path d="M -18,4 Q 0,-6 18,6" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.8"/>`,
    animatedSvg: (f: number) => {
      const spin = (f * 1.5) % 360;
      const glow = Math.sin(f / 4) * 2;
      return `<g>
        <circle cx="0" cy="0" r="${26 + glow}" fill="#38BDF8" fill-opacity="0.3"/>
        <circle cx="0" cy="0" r="24" fill="#0284C7" stroke="${S}" stroke-width="4"/>
        <g transform="rotate(${spin.toFixed(1)} 0 0)">
          <path d="M -12,-8 Q 0,-18 12,-6 Q 8,8 -6,14 Z" fill="#22C55E"/>
          <circle cx="8" cy="10" r="5" fill="#16A34A"/>
          <path d="M -18,2 Q 0,-8 18,2" fill="none" stroke="#FFFFFF" stroke-width="3.5" opacity="0.85" stroke-linecap="round"/>
        </g>
      </g>`;
    },
    tags: ["tierra", "palido_punto_azul", "planeta", "hogar", "sagan", "fermi", "cosmos"],
  },
  telegrafo_morse_chispas: {
    id: "telegrafo_morse_chispas",
    name: "Manipulador de Telégrafo Morse con Arcos Eléctricos y Fuego",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-30" y="8" width="60" height="16" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/><rect x="-24" y="-8" width="48" height="10" rx="3" fill="#D97706" stroke="${S}" stroke-width="3"/><circle cx="16" cy="-14" r="7" fill="#B45309" stroke="${S}" stroke-width="3"/><path d="M -18,-18 L -10,-8 L -4,-22 L 4,-8 L 12,-20" fill="none" stroke="#00F0FF" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const keyBounce = Math.sin(f * 0.9) * 4;
      const sparkShow = (f % 6 < 3);
      const sparkX = Math.sin(f * 1.7) * 8;
      const sparkY = Math.cos(f * 1.3) * 6;
      return `<g>
        <rect x="-32" y="6" width="64" height="18" rx="4" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>
        <rect x="-26" y="${-6 + keyBounce}" width="52" height="10" rx="3" fill="#D97706" stroke="${S}" stroke-width="3.5"/>
        <circle cx="18" cy="${-12 + keyBounce}" r="7.5" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
        <path d="M -26,10 Q -40,14 -46,24" fill="none" stroke="#EF4444" stroke-width="4"/>
        ${sparkShow ? `
          <g transform="translate(${sparkX}, ${sparkY})">
            <path d="M -16,-12 L -6,2 L 2,-18 L 10,0 L 22,-14" fill="none" stroke="#00F0FF" stroke-width="4.5" stroke-linecap="round"/>
            <circle cx="2" cy="-18" r="4" fill="#FFFFFF"/>
            <circle cx="-16" cy="-12" r="3" fill="#FEF08A"/>
            <path d="M -24,4 Q -32,-4 -28,-14 Q -22,-4 -18,2" fill="#F97316" stroke="#EF4444" stroke-width="2"/>
          </g>
        ` : ''}
      </g>`;
    },
    tags: ["telegrafo", "morse", "chispas", "carrington", "1859", "electricidad", "fuego"],
  },
  periodico_victoriano_auroras: {
    id: "periodico_victoriano_auroras",
    name: "Periódico Histórico de 1859 Iluminado por Auroras",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-26" y="-32" width="52" height="64" rx="4" fill="#F8FAFC" stroke="${S}" stroke-width="4"/><line x1="-20" y1="-22" x2="20" y2="-22" stroke="${S}" stroke-width="4"/><line x1="-20" y1="-12" x2="-2" y2="-12" stroke="${S}" stroke-width="2.5"/><line x1="-20" y1="-4" x2="-2" y2="-4" stroke="${S}" stroke-width="2.5"/><line x1="2" y1="-12" x2="20" y2="-12" stroke="${S}" stroke-width="2.5"/><line x1="2" y1="-4" x2="20" y2="-4" stroke="${S}" stroke-width="2.5"/>`,
    animatedSvg: (f: number) => {
      const auroraHue = Math.sin(f * 0.1) * 30 + 140; // Oscila entre verde esmeralda y cian
      const flutter = Math.sin(f * 0.15) * 2;
      return `<g transform="rotate(${flutter.toFixed(1)} 0 0)">
        <rect x="-28" y="-34" width="56" height="68" rx="4" fill="#FEF9C3" stroke="${S}" stroke-width="4.5"/>
        <rect x="-24" y="-28" width="48" height="8" fill="#020617"/>
        <text x="-20" y="-22" fill="#FEF08A" font-size="6" font-weight="900" fontFamily="'Arial Black'">DAILY NEWS 1859</text>
        <line x1="-22" y1="-14" x2="-4" y2="-14" stroke="#334155" stroke-width="2.5"/>
        <line x1="-22" y1="-8" x2="-4" y2="-8" stroke="#334155" stroke-width="2.5"/>
        <line x1="-22" y1="-2" x2="-4" y2="-2" stroke="#334155" stroke-width="2.5"/>
        <line x1="-22" y1="4" x2="-4" y2="4" stroke="#334155" stroke-width="2.5"/>
        <line x1="2" y1="-14" x2="22" y2="-14" stroke="#334155" stroke-width="2.5"/>
        <line x1="2" y1="-8" x2="22" y2="-8" stroke="#334155" stroke-width="2.5"/>
        <line x1="2" y1="-2" x2="22" y2="-2" stroke="#334155" stroke-width="2.5"/>
        <line x1="2" y1="4" x2="22" y2="4" stroke="#334155" stroke-width="2.5"/>
        <rect x="-28" y="-34" width="56" height="68" rx="4" fill="hsl(${auroraHue}, 80%, 60%)" fill-opacity="0.22"/>
      </g>`;
    },
    tags: ["periodico", "1859", "aurora", "caribe", "lectura", "carrington", "prensa"],
  },
  telescopio_laton_pantalla_proyeccion: {
    id: "telescopio_laton_pantalla_proyeccion",
    name: "Telescopio Victoriano con Pantalla Solar de Carrington",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<rect x="-35" y="-12" width="55" height="16" rx="4" fill="#D97706" stroke="${S}" stroke-width="4"/><polygon points="20,-18 36,-12 36,4 20,10" fill="#B45309" stroke="${S}" stroke-width="3"/><rect x="40" y="-30" width="30" height="30" rx="3" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><circle cx="55" cy="-15" r="10" fill="#F59E0B"/>`,
    animatedSvg: (f: number) => {
      const flareFlash = Math.sin(f * 0.45) > 0.1;
      return `<g>
        <line x1="-15" y1="4" x2="-35" y2="42" stroke="#451A03" stroke-width="5"/>
        <line x1="0" y1="4" x2="20" y2="42" stroke="#451A03" stroke-width="5"/>
        <rect x="-36" y="-14" width="60" height="18" rx="4" fill="#D97706" stroke="${S}" stroke-width="4.5"/>
        <rect x="-18" y="-16" width="8" height="22" fill="#FDE047" stroke="${S}" stroke-width="3"/>
        <rect x="24" y="-22" width="12" height="34" rx="2" fill="#78350F" stroke="${S}" stroke-width="3"/>
        <!-- Pantalla de proyección -->
        <line x1="24" y1="-8" x2="52" y2="-12" stroke="#64748B" stroke-width="3.5"/>
        <rect x="48" y="-36" width="36" height="36" rx="4" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/>
        <circle cx="66" cy="-18" r="12" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
        <circle cx="63" cy="-20" r="2.5" fill="#451A03"/>
        <circle cx="69" cy="-16" r="2" fill="#451A03"/>
        ${flareFlash ? `
          <circle cx="64" cy="-20" r="4.5" fill="#FFFFFF"/>
          <circle cx="70" cy="-16" r="3.5" fill="#FFFFFF"/>
          <line x1="58" y1="-20" x2="76" y2="-18" stroke="#FEF08A" stroke-width="2"/>
        ` : ''}
      </g>`;
    },
    tags: ["telescopio", "carrington", "pantalla", "manchas_solares", "fulguracion", "astronomia"],
  },
  capsula_espacial_radar: {
    id: "capsula_espacial_radar",
    name: "Cápsula de Observación con Radar de Alerta Solar",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="26" fill="#1E293B" stroke="${S}" stroke-width="4.5"/><path d="M -18,0 A 18 18 0 0 1 18 0 Z" fill="#38BDF8" fill-opacity="0.7"/><line x1="0" y1="0" x2="14" y2="-12" stroke="#EF4444" stroke-width="3.5"/>`,
    animatedSvg: (f: number) => {
      const needleAngle = Math.min(65, Math.sin(f * 0.2) * 40 + 25);
      const dangerBlink = (f % 8 < 4);
      return `<g>
        <circle cx="0" cy="0" r="28" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>
        <path d="M -20,0 A 20 20 0 0 1 20 0 Z" fill="#0284C7" fill-opacity="0.5" stroke="${S}" stroke-width="2.5"/>
        <rect x="-18" y="4" width="36" height="18" rx="3" fill="#020617" stroke="${dangerBlink ? '#EF4444' : '#1E293B'}" stroke-width="3"/>
        <text x="-12" y="16" fill="${dangerBlink ? '#EF4444' : '#64748B'}" font-size="9" font-weight="900" fontFamily="'Arial Black'">CME!</text>
        <!-- Aguja de radar que sube al rojo -->
        <g transform="translate(0, 0) rotate(${needleAngle.toFixed(1)} 0 0)">
          <line x1="0" y1="0" x2="0" y2="-16" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="0" cy="0" r="3" fill="#FEF08A"/>
        </g>
      </g>`;
    },
    tags: ["capsula", "radar", "cme", "espacio", "alerta", "velocidad", "plasma"],
  },
  poste_telegrafo_moderno_combo: {
    id: "poste_telegrafo_moderno_combo",
    name: "Doble Tecnología: Poste de Telégrafo a Torre de Alta Tensión",
    family: "herramientas_objetos",
    defaultPlacement: "overhead",
    svg: `<line x1="-24" y1="-30" x2="-24" y2="30" stroke="#78350F" stroke-width="6"/><line x1="-34" y1="-18" x2="-14" y2="-18" stroke="#78350F" stroke-width="5"/><line x1="24" y1="-30" x2="16" y2="30" stroke="#0284C7" stroke-width="5"/><line x1="24" y1="-30" x2="32" y2="30" stroke="#0284C7" stroke-width="5"/><line x1="12" y1="-10" x2="36" y2="-10" stroke="#0284C7" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const arcPulse = Math.sin(f * 0.4) > 0.2;
      return `<g>
        <!-- Poste 1859 madera -->
        <line x1="-24" y1="-32" x2="-24" y2="32" stroke="#451A03" stroke-width="7"/>
        <line x1="-36" y1="-20" x2="-12" y2="-20" stroke="#451A03" stroke-width="6"/>
        <circle cx="-32" cy="-24" r="3" fill="#E2E8F0"/>
        <circle cx="-16" cy="-24" r="3" fill="#E2E8F0"/>
        <!-- Torre moderna acero -->
        <path d="M 14,32 L 24,-32 L 34,32" fill="none" stroke="#0284C7" stroke-width="5"/>
        <line x1="12" y1="-8" x2="36" y2="-8" stroke="#38BDF8" stroke-width="4"/>
        <line x1="16" y1="12" x2="32" y2="12" stroke="#38BDF8" stroke-width="4"/>
        <!-- Cable conector con arco -->
        <path d="M -16,-20 Q 4,-12 24,-8" fill="none" stroke="#F59E0B" stroke-width="3"/>
        ${arcPulse ? `<circle cx="4" cy="-12" r="4" fill="#00F0FF"/>` : ''}
      </g>`;
    },
    tags: ["poste", "torre", "cables", "red", "transicion", "tecnologia", "1859"],
  },
  subestacion_transformador_fuego: {
    id: "subestacion_transformador_fuego",
    name: "Transformador de Subestación Estallando en Llamas",
    family: "herramientas_objetos",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-18" width="48" height="36" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/><polygon points="0,-12 -8,2 2,2 -4,12 8,-2 0,-2" fill="#F59E0B"/><line x1="-28" y1="-8" x2="-28" y2="12" stroke="${S}" stroke-width="4"/><line x1="28" y1="-8" x2="28" y2="12" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const fireWobble = Math.sin(f * 0.6) * 5;
      const arcShow = (f % 5 < 3);
      return `<g>
        <rect x="-26" y="-16" width="52" height="34" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4.5"/>
        <!-- Aletas de refrigeración -->
        <line x1="-20" y1="-10" x2="-20" y2="12" stroke="#475569" stroke-width="3"/>
        <line x1="-12" y1="-10" x2="-12" y2="12" stroke="#475569" stroke-width="3"/>
        <line x1="12" y1="-10" x2="12" y2="12" stroke="#475569" stroke-width="3"/>
        <line x1="20" y1="-10" x2="20" y2="12" stroke="#475569" stroke-width="3"/>
        <!-- Símbolo de alto voltaje -->
        <polygon points="0,-10 -6,1 1,1 -3,10 6,-1 0,-1" fill="#FEF08A" stroke="#000000" stroke-width="2"/>
        <!-- Llamas y arcos de sobretensión -->
        <path d="M ${-10 + fireWobble},-16 Q 0,-38 ${12 + fireWobble},-22 Q 4,-16 0,-16 Z" fill="#EF4444" stroke="#F59E0B" stroke-width="2.5"/>
        <path d="M ${-4 + fireWobble},-18 Q 4,-32 ${8 + fireWobble},-20 Z" fill="#FEF08A"/>
        ${arcShow ? `<path d="M -18,-24 L -8,-14 L 0,-28 L 12,-18" fill="none" stroke="#00F0FF" stroke-width="3.5" stroke-linecap="round"/>` : ''}
      </g>`;
    },
    tags: ["transformador", "subestacion", "fuego", "blackout", "explosion", "alto_voltaje"],
  },
  telefono_muerto_sin_senal: {
    id: "telefono_muerto_sin_senal",
    name: "Smartphone Muerto con Alerta Sin Señal",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-14" y="-24" width="28" height="48" rx="5" fill="#0F172A" stroke="${S}" stroke-width="3.5"/><rect x="-11" y="-20" width="22" height="40" rx="3" fill="#000000"/><text x="-9" y="4" fill="#EF4444" font-size="6" font-weight="900">NO SIGNAL</text>`,
    animatedSvg: (f: number) => {
      const redBlink = (f % 10 < 5);
      return `<g>
        <rect x="-16" y="-26" width="32" height="52" rx="6" fill="#020617" stroke="${S}" stroke-width="4"/>
        <rect x="-12" y="-22" width="24" height="44" rx="4" fill="#000000"/>
        <g opacity="${redBlink ? 1.0 : 0.2}">
          <circle cx="0" cy="-6" r="6" fill="#EF4444"/>
          <line x1="0" y1="-8" x2="0" y2="-5" stroke="#FFFFFF" stroke-width="2"/>
          <circle cx="0" cy="-3" r="0.8" fill="#FFFFFF"/>
          <text x="-11" y="8" fill="#EF4444" font-size="5" font-weight="900" fontFamily="'Arial Black'">NO SIGNAL</text>
        </g>
      </g>`;
    },
    tags: ["celular", "smartphone", "sin_senal", "blackout", "telefono", "pantalla", "apagon"],
  },
  vela_fosforo_resplandor: {
    id: "vela_fosforo_resplandor",
    name: "Vela Encendida y Fósforo en Penumbra",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-6" y="-4" width="12" height="24" rx="2" fill="#F8FAFC" stroke="${S}" stroke-width="3"/><line x1="0" y1="-4" x2="0" y2="-9" stroke="#000000" stroke-width="2"/><path d="M -4,-9 Q 0,-20 4,-9 Q 2,-6 0,-6 Q -2,-6 -4,-9 Z" fill="#F59E0B"/><circle cx="0" cy="-9" r="2" fill="#FEF08A"/>`,
    animatedSvg: (f: number) => {
      const flameWobbleX = Math.sin(f * 0.45) * 2;
      const flameHeight = Math.cos(f * 0.35) * 2 + 14;
      return `<g>
        <!-- Cuerpo de la vela con cera derritiéndose -->
        <rect x="-7" y="-2" width="14" height="26" rx="2.5" fill="#FEF9C3" stroke="${S}" stroke-width="3.5"/>
        <path d="M -7,4 Q -4,8 -4,2" fill="#FEF9C3" stroke="${S}" stroke-width="1.5"/>
        <!-- Mecha negra -->
        <line x1="0" y1="-2" x2="0" y2="-8" stroke="#000000" stroke-width="2.5"/>
        <!-- Llama animada bailando -->
        <path d="M -5,-8 Q ${flameWobbleX},${-8 - flameHeight} 5,-8 Q 2,-4 0,-4 Q -2,-4 -5,-8 Z" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
        <path d="M -2.5,-8 Q ${flameWobbleX * 0.6},${-8 - flameHeight * 0.65} 2.5,-8 Q 1,-5 0,-5 Q -1,-5 -2.5,-8 Z" fill="#FEF08A"/>
        <!-- Resplandor circular tenue -->
        <circle cx="0" cy="-10" r="18" fill="#FDE047" fill-opacity="0.25"/>
      </g>`;
    },
    tags: ["vela", "fosforo", "llama", "fuego", "penumbra", "apagon", "calidez", "cierre"],
  },
  proyector_cine_holografico: {
    id: "proyector_cine_holografico",
    name: "Proyector de Cine de Recuerdos Incómodos",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<rect x="-18" y="-8" width="36" height="24" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/><circle cx="-10" cy="-18" r="10" fill="#64748B" stroke="${S}" stroke-width="3"/><circle cx="10" cy="-18" r="10" fill="#64748B" stroke="${S}" stroke-width="3"/><polygon points="18,-2 32,-10 32,6 18,-2" fill="#FDE047" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const reelRot = (f * 8) % 360;
      const beamFlicker = 0.75 + 0.25 * Math.sin(f * 0.8);
      const bobY = Math.sin(f * 0.15) * 3;
      return `<g transform="translate(0, ${bobY})">
        <!-- Bobinas giratorias clásicas -->
        <g transform="translate(-12, -20) rotate(${reelRot})">
          <circle cx="0" cy="0" r="11" fill="#475569" stroke="${S}" stroke-width="3.5"/>
          <circle cx="0" cy="0" r="4" fill="#E2E8F0" stroke="${S}" stroke-width="2"/>
          <line x1="-11" y1="0" x2="11" y2="0" stroke="${S}" stroke-width="2"/>
          <line x1="0" y1="-11" x2="0" y2="11" stroke="${S}" stroke-width="2"/>
        </g>
        <g transform="translate(12, -20) rotate(${-reelRot})">
          <circle cx="0" cy="0" r="11" fill="#475569" stroke="${S}" stroke-width="3.5"/>
          <circle cx="0" cy="0" r="4" fill="#E2E8F0" stroke="${S}" stroke-width="2"/>
          <line x1="-11" y1="0" x2="11" y2="0" stroke="${S}" stroke-width="2"/>
          <line x1="0" y1="-11" x2="0" y2="11" stroke="${S}" stroke-width="2"/>
        </g>
        <!-- Cuerpo del proyector estilo neo-brutalista -->
        <rect x="-20" y="-8" width="40" height="26" rx="5" fill="#1E293B" stroke="${S}" stroke-width="4.5"/>
        <circle cx="-6" cy="4" r="5" fill="#0EA5E9" stroke="${S}" stroke-width="2"/>
        <line x1="4" y1="-2" x2="14" y2="-2" stroke="#64748B" stroke-width="3"/>
        <line x1="4" y1="4" x2="14" y2="4" stroke="#64748B" stroke-width="3"/>
        <line x1="4" y1="10" x2="14" y2="10" stroke="#64748B" stroke-width="3"/>
        <!-- Lente frontal y haz cónico de luz de cine -->
        <polygon points="20,-3 26,-6 26,9 20,6" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/>
        <polygon points="26,-5 58,-24 58,26 26,7" fill="#FEF08A" fill-opacity="${beamFlicker * 0.35}"/>
        <!-- Partículas de polvo en el haz -->
        <circle cx="34" cy="-2" r="1.5" fill="#FFFFFF" opacity="${beamFlicker}"/>
        <circle cx="44" cy="6" r="2" fill="#FFFFFF" opacity="${beamFlicker * 0.8}"/>
        <circle cx="50" cy="-8" r="1.2" fill="#FFFFFF" opacity="${beamFlicker * 0.9}"/>
      </g>`;
    },
    tags: ["proyector", "cine", "recuerdos", "verguenza", "pelicula", "holograma"],
  },
  consola_cerebral_guardia: {
    id: "consola_cerebral_guardia",
    name: "Consola de Guardia Prefrontal Durmiente",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-16" width="48" height="32" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/><rect x="-18" y="-12" width="28" height="18" rx="2" fill="#0F172A"/><text x="-14" y="0" fill="#EF4444" font-size="6" font-weight="900">OFF</text><rect x="14" y="-4" width="8" height="12" fill="#F59E0B"/>`,
    animatedSvg: (f: number) => {
      const zPhase = (f * 0.1) % (Math.PI * 2);
      const zOffset = Math.sin(zPhase) * 4;
      const blink = Math.sin(f * 0.25) > 0;
      return `<g>
        <!-- Escritorio metálico base -->
        <rect x="-28" y="10" width="56" height="16" rx="3" fill="#1E293B" stroke="${S}" stroke-width="4"/>
        <line x1="-22" y1="18" x2="22" y2="18" stroke="#475569" stroke-width="2.5"/>
        <!-- Monitor CRT prefrontal -->
        <rect x="-26" y="-20" width="34" height="28" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>
        <rect x="-22" y="-16" width="26" height="20" rx="3" fill="#020617"/>
        <!-- Texto dormido en pantalla -->
        <text x="-18" y="-4" fill="#38BDF8" font-size="5" font-weight="900" font-family="'Arial Black'">FILTRO</text>
        <text x="-18" y="2" fill="${blink ? '#EF4444' : '#64748B'}" font-size="4.5" font-weight="900" font-family="'Arial Black'">OFFLINE</text>
        <!-- Taza de café humeante abandonada -->
        <g transform="translate(16, 2)">
          <rect x="-6" y="-2" width="12" height="14" rx="2" fill="#F8FAFC" stroke="${S}" stroke-width="2.5"/>
          <path d="M 6,1 C 10,1 10,9 6,9" fill="none" stroke="${S}" stroke-width="2"/>
          <!-- Humito de café frío -->
          <path d="M -2,-4 Q 0,-8 -2,-12" fill="none" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
        </g>
        <!-- Letras Zzz flotantes del guardia dormido -->
        <text x="8" y="${-10 + zOffset}" fill="#A855F7" font-size="8" font-weight="900" font-family="'Arial Black'" stroke="${S}" stroke-width="1.5" paint-order="stroke">Z</text>
        <text x="18" y="${-18 + zOffset * 0.7}" fill="#C084FC" font-size="6" font-weight="900" font-family="'Arial Black'" stroke="${S}" stroke-width="1.2" paint-order="stroke">z</text>
      </g>`;
    },
    tags: ["corteza", "prefrontal", "consola", "terminal", "cerebro", "sueno", "guardia"],
  },
  amigdala_criatura_megafono: {
    id: "amigdala_criatura_megafono",
    name: "Amígdala Emocional con Megáfono y Palanca",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<path d="M -16,4 C -16,-14 0,-18 16,-10 C 22,0 18,16 2,16 C -12,16 -16,12 -16,4 Z" fill="#EF4444" stroke="${S}" stroke-width="4"/><circle cx="-2" cy="-4" r="3" fill="#FFFFFF"/><circle cx="8" cy="-2" r="3" fill="#FFFFFF"/><polygon points="14,-2 26,-8 26,6 14,2" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/>`,
    animatedSvg: (f: number) => {
      const shakeX = Math.sin(f * 0.8) * 2;
      const sirenPulse = Math.sin(f * 0.5) > 0;
      const waveExpand = (f * 0.4) % 12;
      return `<g transform="translate(${shakeX}, 0)">
        <!-- Sirena roja giratoria en la cabeza -->
        <rect x="-4" y="-22" width="8" height="5" fill="#334155" stroke="${S}" stroke-width="2"/>
        <path d="M -5,-22 Q 0,-30 5,-22 Z" fill="${sirenPulse ? '#EF4444' : '#F59E0B'}" stroke="${S}" stroke-width="2"/>
        <circle cx="0" cy="-24" r="10" fill="#EF4444" fill-opacity="${sirenPulse ? 0.4 : 0.05}"/>
        <!-- Cuerpo almendrado de la amígdala con contorno grueso -->
        <path d="M -18,2 C -18,-16 2,-20 18,-10 C 24,2 18,18 0,18 C -14,18 -18,12 -18,2 Z" fill="#E11D48" stroke="${S}" stroke-width="4.5"/>
        <!-- Ojos enloquecidos de pánico nocturno -->
        <circle cx="-4" cy="-4" r="5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
        <circle cx="-3" cy="-4" r="2.2" fill="#000000"/>
        <circle cx="8" cy="-2" r="5.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
        <circle cx="9" cy="-2" r="2.5" fill="#000000"/>
        <!-- Boca gritando -->
        <ellipse cx="2" cy="8" rx="6" ry="4" fill="#881337" stroke="${S}" stroke-width="2"/>
        <!-- Megáfono estridente en la mano -->
        <g transform="translate(14, 2)">
          <polygon points="0,-4 16,-12 16,10 0,4" fill="#FACC15" stroke="${S}" stroke-width="3"/>
          <line x1="0" y1="4" x2="-4" y2="12" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>
          <!-- Ondas de choque sónicas -->
          <path d="M ${18 + waveExpand},-10 Q ${23 + waveExpand},0 ${18 + waveExpand},10" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" opacity="${1 - waveExpand / 12}"/>
          <path d="M ${24 + waveExpand},-14 Q ${31 + waveExpand},0 ${24 + waveExpand},14" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" opacity="${Math.max(0, 1 - waveExpand / 10)}"/>
        </g>
      </g>`;
    },
    tags: ["amigdala", "megafono", "alarma", "cerebro", "panico", "alerta", "miedo"],
  },
  engranajes_oxidados_ansiedad: {
    id: "engranajes_oxidados_ansiedad",
    name: "Engranajes Oxidados de Sobrepensamiento Nocturno",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="-8" cy="-4" r="14" fill="#B45309" stroke="${S}" stroke-width="4"/><circle cx="12" cy="8" r="10" fill="#78350F" stroke="${S}" stroke-width="3.5"/>`,
    animatedSvg: (f: number) => {
      const rot1 = (f * 3.5) % 360;
      const rot2 = (-f * 4.8) % 360;
      const sparkPop = (f % 8 < 3);
      const thoughtFloat = Math.sin(f * 0.12) * 4;
      return `<g>
        <!-- Engranaje mayor oxidado -->
        <g transform="translate(-10, 0) rotate(${rot1})">
          <circle cx="0" cy="0" r="16" fill="#D97706" stroke="${S}" stroke-width="4.5"/>
          <circle cx="0" cy="0" r="5" fill="#FEF3C7" stroke="${S}" stroke-width="2.5"/>
          ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="-3" y="-20" width="6" height="5" rx="1" fill="#B45309" stroke="${S}" stroke-width="2" transform="rotate(${a})"/>`).join("")}
        </g>
        <!-- Engranaje menor acoplado -->
        <g transform="translate(14, 8) rotate(${rot2})">
          <circle cx="0" cy="0" r="12" fill="#92400E" stroke="${S}" stroke-width="4"/>
          <circle cx="0" cy="0" r="4" fill="#FEF3C7" stroke="${S}" stroke-width="2"/>
          ${[0, 60, 120, 180, 240, 300].map(a => `<rect x="-2.5" y="-15" width="5" height="4" rx="1" fill="#78350F" stroke="${S}" stroke-width="2" transform="rotate(${a})"/>`).join("")}
        </g>
        <!-- Chispas de fricción mental -->
        ${sparkPop ? `<polygon points="2,4 6,1 4,6 9,5 5,8" fill="#FACC15" stroke="${S}" stroke-width="1.5"/>` : ''}
        <!-- Globo de texto de sobrepensamiento: ¿Y SI...? -->
        <g transform="translate(0, ${-22 + thoughtFloat})">
          <rect x="-22" y="-10" width="44" height="18" rx="6" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/>
          <polygon points="-4,8 0,14 4,8" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <text x="0" y="2" text-anchor="middle" fill="#DC2626" font-size="7.5" font-weight="900" font-family="'Arial Black'">¿Y SI...?</text>
        </g>
      </g>`;
    },
    tags: ["engranajes", "ansiedad", "rumiacion", "sobrepensar", "chispas", "noche"],
  },
  lanza_cueva_prehistorica: {
    id: "lanza_cueva_prehistorica",
    name: "Lanza Primitiva de Piedra y Fuego Ancestral",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<line x1="-12" y1="28" x2="16" y2="-22" stroke="#78350F" stroke-width="5" stroke-linecap="round"/><polygon points="16,-22 24,-32 10,-26" fill="#334155" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const emberPulse = Math.sin(f * 0.4) * 2;
      return `<g>
        <!-- Asta de madera rústica tallada -->
        <line x1="-16" y1="30" x2="16" y2="-22" stroke="#5C2B10" stroke-width="6.5" stroke-linecap="round"/>
        <line x1="-14" y1="26" x2="14" y2="-18" stroke="#9A3412" stroke-width="3" stroke-linecap="round"/>
        <!-- Amarre de tendones/cuero -->
        <rect x="8" y="-22" width="10" height="8" rx="2" fill="#D97706" stroke="${S}" stroke-width="2" transform="rotate(-35 13 -18)"/>
        <!-- Punta de lanza de obsidiana/pedernal afilada -->
        <polygon points="16,-22 28,-36 9,-29" fill="#1E293B" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <line x1="14" y1="-24" x2="23" y2="-32" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
        <!-- Plumas o tiras que cuelgan mecidas por la brisa de la cueva -->
        <path d="M 10,-14 Q ${6 + emberPulse},-6 4,-2" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
        <path d="M 8,-12 Q ${3 + emberPulse},-4 1,2" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
      </g>`;
    },
    tags: ["lanza", "prehistoria", "caverna", "tigre", "evolucion", "depredador"],
  },
  facturas_celular_visto: {
    id: "facturas_celular_visto",
    name: "Pila de Facturas y Notificaciones sin Responder",
    family: "vida_cotidiana",
    defaultPlacement: "overhead",
    svg: `<rect x="-18" y="-12" width="24" height="28" rx="2" fill="#F8FAFC" stroke="${S}" stroke-width="3"/><rect x="2" y="-18" width="18" height="32" rx="4" fill="#0F172A" stroke="${S}" stroke-width="3"/><text x="4" y="-4" fill="#38BDF8" font-size="7">✓✓</text>`,
    animatedSvg: (f: number) => {
      const floatY = Math.sin(f * 0.16) * 3;
      const alertShake = Math.sin(f * 0.9) * 1.5;
      return `<g transform="translate(0, ${floatY})">
        <!-- Factura en papel doblado con símbolo de vencimiento -->
        <g transform="translate(-14, 2) rotate(-8)">
          <rect x="-12" y="-16" width="24" height="30" rx="3" fill="#FEF2F2" stroke="${S}" stroke-width="3.5"/>
          <line x1="-8" y1="-10" x2="8" y2="-10" stroke="#DC2626" stroke-width="2.5"/>
          <line x1="-8" y1="-4" x2="4" y2="-4" stroke="#94A3B8" stroke-width="2"/>
          <line x1="-8" y1="2" x2="6" y2="2" stroke="#94A3B8" stroke-width="2"/>
          <text x="-6" y="10" fill="#EF4444" font-size="6.5" font-weight="900" font-family="'Arial Black'">$$$</text>
        </g>
        <!-- Celular con pantalla encendida a las 3 AM -->
        <g transform="translate(14, -2) rotate(10) translate(${alertShake}, 0)">
          <rect x="-11" y="-20" width="22" height="38" rx="5" fill="#0F172A" stroke="${S}" stroke-width="4"/>
          <rect x="-8" y="-16" width="16" height="30" rx="3" fill="#020617"/>
          <!-- Hora 03:00 -->
          <text x="0" y="-10" text-anchor="middle" fill="#94A3B8" font-size="4" font-weight="900">03:00</text>
          <!-- Mensaje con Doble Check Azul "Visto" -->
          <rect x="-7" y="-6" width="14" height="12" rx="2" fill="#1E293B"/>
          <text x="-4" y="2" fill="#38BDF8" font-size="6" font-weight="900">✓✓</text>
          <!-- Burbuja de alerta roja -->
          <circle cx="8" cy="-18" r="4.5" fill="#EF4444" stroke="${S}" stroke-width="1.8"/>
          <text x="8" y="-16" text-anchor="middle" fill="#FFFFFF" font-size="5" font-weight="900">!</text>
        </g>
      </g>`;
    },
    tags: ["facturas", "celular", "visto", "deudas", "notificaciones", "ansiedad", "cama"],
  },
  lampara_noche_interruptor: {
    id: "lampara_noche_interruptor",
    name: "Lámpara de Noche con Halo Tranquilizador",
    family: "vida_cotidiana",
    defaultPlacement: "left",
    svg: `<path d="M -12,-8 L 12,-8 L 8,8 L -8,8 Z" fill="#FDE047" stroke="${S}" stroke-width="3.5"/><line x1="0" y1="8" x2="0" y2="24" stroke="${S}" stroke-width="4"/><rect x="-10" y="24" width="20" height="6" rx="2" fill="#475569" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const warmPulse = 0.8 + 0.2 * Math.sin(f * 0.12);
      const zzzY = (f * 0.12) % 20;
      return `<g>
        <!-- Halo luminoso cálido relajante -->
        <circle cx="0" cy="0" r="32" fill="#FEF08A" fill-opacity="${warmPulse * 0.22}"/>
        <circle cx="0" cy="0" r="20" fill="#FDE047" fill-opacity="${warmPulse * 0.3}"/>
        <!-- Pantalla de la lámpara neo-brutalista -->
        <polygon points="-16,-6 16,-6 11,10 -11,10" fill="#FEF08A" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
        <line x1="-12" y1="-2" x2="12" y2="-2" stroke="#F59E0B" stroke-width="2.5"/>
        <!-- Pie y base de madera -->
        <line x1="0" y1="10" x2="0" y2="26" stroke="#78350F" stroke-width="4.5"/>
        <rect x="-12" y="26" width="24" height="6" rx="2.5" fill="#451A03" stroke="${S}" stroke-width="3.5"/>
        <!-- Cordón o interruptor sutil -->
        <line x1="6" y1="10" x2="6" y2="17" stroke="${S}" stroke-width="2"/>
        <circle cx="6" cy="18" r="2" fill="#E2E8F0" stroke="${S}" stroke-width="1.5"/>
        <!-- Suave Zzz de descanso plácido -->
        <text x="14" y="${-10 - zzzY}" fill="#38BDF8" font-size="7" font-weight="900" font-family="'Arial Black'" stroke="${S}" stroke-width="1.2" paint-order="stroke" opacity="${1 - zzzY / 20}">z</text>
      </g>`;
    },
    tags: ["lampara", "noche", "luz", "calma", "sueno", "descanso", "paz"],
  },
  celda_prision_mandela: {
    id: "celda_prision_mandela",
    name: "Celda de Prisión con Silueta que se Desvanece",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-30" width="48" height="60" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/><line x1="-16" y1="-30" x2="-16" y2="30" stroke="#000000" stroke-width="3"/><line x1="-8" y1="-30" x2="-8" y2="30" stroke="#000000" stroke-width="3"/><line x1="0" y1="-30" x2="0" y2="30" stroke="#000000" stroke-width="3"/><line x1="8" y1="-30" x2="8" y2="30" stroke="#000000" stroke-width="3"/><line x1="16" y1="-30" x2="16" y2="30" stroke="#000000" stroke-width="3"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isDissolving = currentState === "desvanecida" || (currentState === undefined && f >= 75);
      const dissolve = isDissolving ? (stepProgress !== undefined ? Math.min(1, stepProgress * 1.4) : Math.min(1.0, Math.max(0.0, (f - 75) / 30))) : 0;
      const barsAlpha = Math.max(0.22, 1.0 - dissolve * 0.72);
      return `<g transform="scale(1.5)">
        <!-- Marco de celda penitenciaria -->
        <rect x="-28" y="-32" width="56" height="64" rx="5" fill="#1E293B" fill-opacity="${(barsAlpha * 0.35).toFixed(2)}" stroke="${S}" stroke-width="4.5" opacity="${barsAlpha.toFixed(2)}"/>
        <!-- Silueta humana tras los barrotes -->
        <g opacity="${(barsAlpha * 0.85).toFixed(2)}">
          <circle cx="0" cy="-10" r="10" fill="#64748B" stroke="${S}" stroke-width="3"/>
          <path d="M -15,24 C -15,4 15,4 15,24 Z" fill="#64748B" stroke="${S}" stroke-width="3"/>
        </g>
        <!-- Barrotes verticales de hierro -->
        <g opacity="${barsAlpha.toFixed(2)}">
          <line x1="-20" y1="-32" x2="-20" y2="32" stroke="${S}" stroke-width="4"/>
          <line x1="-10" y1="-32" x2="-10" y2="32" stroke="${S}" stroke-width="4"/>
          <line x1="0" y1="-32" x2="0" y2="32" stroke="${S}" stroke-width="4"/>
          <line x1="10" y1="-32" x2="10" y2="32" stroke="${S}" stroke-width="4"/>
          <line x1="20" y1="-32" x2="20" y2="32" stroke="${S}" stroke-width="4"/>
          <line x1="-28" y1="0" x2="28" y2="0" stroke="${S}" stroke-width="3.5"/>
        </g>
        <!-- Aspa roja y partículas de desvanecimiento cuando se revela el error -->
        ${isDissolving ? `<g>
          <circle cx="-22" cy="-18" r="4" fill="#94A3B8" stroke="${S}" stroke-width="2"/>
          <circle cx="24" cy="14" r="5" fill="#94A3B8" stroke="${S}" stroke-width="2"/>
          <line x1="-22" y1="-22" x2="22" y2="22" stroke="#EF4444" stroke-width="7" stroke-linecap="round"/>
          <line x1="-22" y1="-22" x2="22" y2="22" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="22" y1="-22" x2="-22" y2="22" stroke="#EF4444" stroke-width="7" stroke-linecap="round"/>
          <line x1="22" y1="-22" x2="-22" y2="22" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["celda", "prision", "mandela", "desvanecer", "recuerdo", "error", "historia"],
  },
  linea_tiempo_mandela_tv: {
    id: "linea_tiempo_mandela_tv",
    name: "Televisión Antigua con Estática y Gran Cruz Roja",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-18" width="48" height="36" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/><rect x="-18" y="-12" width="28" height="24" rx="2" fill="#64748B"/><line x1="-10" y1="-28" x2="-2" y2="-18" stroke="${S}" stroke-width="3"/><line x1="10" y1="-28" x2="2" y2="-18" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isDebunked = currentState === "desmentido" || (currentState === undefined && f >= 90);
      const staticGlitch = (f % 6 < 3);
      return `<g transform="scale(1.55)">
        <!-- Antena de cuernos -->
        <line x1="-12" y1="-30" x2="-4" y2="-18" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="12" y1="-30" x2="4" y2="-18" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="-12" cy="-30" r="3" fill="#EF4444" stroke="${S}" stroke-width="1.5"/>
        <circle cx="12" cy="-30" r="3" fill="#EF4444" stroke="${S}" stroke-width="1.5"/>
        <!-- Gabinete retro de TV -->
        <rect x="-28" y="-18" width="56" height="40" rx="6" fill="#334155" stroke="${S}" stroke-width="4.5"/>
        <!-- Pantalla CRT con silueta de noticiero falso -->
        <rect x="-22" y="-13" width="32" height="30" rx="3" fill="#020617" stroke="${S}" stroke-width="2.5"/>
        <g opacity="0.75">
          <ellipse cx="-6" cy="6" rx="8" ry="5" fill="${staticGlitch ? '#E2E8F0' : '#94A3B8'}"/>
          <circle cx="-6" cy="-3" r="5" fill="${staticGlitch ? '#E2E8F0' : '#94A3B8'}"/>
        </g>
        <!-- Controles laterales de sintonizador -->
        <circle cx="18" cy="-5" r="4" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
        <circle cx="18" cy="5" r="4" fill="#64748B" stroke="${S}" stroke-width="2"/>
        <!-- Gran Cruz Roja de Desmentido 'X' -->
        ${isDebunked ? `<g transform="translate(-6, 2)">
          <line x1="-13" y1="-13" x2="13" y2="13" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
          <line x1="13" y1="-13" x2="-13" y2="13" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["tv", "television", "estatica", "noticia_falsa", "mandela", "pantalla", "cruz_roja"],
  },
  red_pensamientos_fiona_siluetas: {
    id: "red_pensamientos_fiona_siluetas",
    name: "Red de Pensamientos Compartidos de Fiona Broome",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="-14" cy="0" r="14" fill="#F43F5E" stroke="${S}" stroke-width="3"/><circle cx="16" cy="-10" r="10" fill="#E2E8F0" stroke="${S}" stroke-width="2.5"/><circle cx="18" cy="12" r="8" fill="#E2E8F0" stroke="${S}" stroke-width="2.5"/><path d="M 0,0 L 8,-6 M 0,0 L 10,8" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const wave = Math.sin(f * 0.2) * 2.5;
      const isPropagated = currentState === "contagio_global" || (currentState === undefined && f >= 70);
      return `<g transform="scale(1.5)">
        <!-- Silueta de Fiona Broome -->
        <g transform="translate(-18, 12)">
          <circle cx="0" cy="-14" r="9" fill="#F43F5E" stroke="${S}" stroke-width="3"/>
          <path d="M -10,-18 Q 0,-26 8,-16 Q 10,-8 6,-4" fill="#9F1239"/>
          <path d="M -12,12 C -12,-2 12,-2 12,12 Z" fill="#BE123C" stroke="${S}" stroke-width="3"/>
        </g>
        <!-- Nube de pensamiento principal con celda dentro -->
        <g transform="translate(6, ${(-14 + wave).toFixed(1)})">
          <rect x="-14" y="-12" width="28" height="24" rx="8" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/>
          <line x1="-7" y1="-8" x2="-7" y2="8" stroke="#000000" stroke-width="2.5"/>
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#000000" stroke-width="2.5"/>
          <line x1="7" y1="-8" x2="7" y2="8" stroke="#000000" stroke-width="2.5"/>
        </g>
        <!-- Nodos satélites conectados a otras mentes -->
        <g transform="translate(24, 16) scale(${isPropagated ? 1.2 : 0.95})">
          <circle cx="0" cy="0" r="9" fill="#FFE600" stroke="${S}" stroke-width="3"/>
          <circle cx="0" cy="0" r="3.5" fill="#EF4444"/>
        </g>
        <!-- Líneas punteadas de conexión neural -->
        <line x1="-12" y1="-6" x2="-2" y2="-12" stroke="${S}" stroke-width="2.5" stroke-dasharray="3 2"/>
        <line x1="16" y1="-4" x2="22" y2="10" stroke="#F43F5E" stroke-width="3" stroke-dasharray="3 2"/>
      </g>`;
    },
    tags: ["pensamiento", "fiona", "red", "contagio", "memoria", "siluetas", "nube"],
  },
  caballete_monopoly_pikachu: {
    id: "caballete_monopoly_pikachu",
    name: "Caballete Artístico con Monóculo y Cola de Pikachu Borrándose",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-20" width="48" height="38" rx="3" fill="#FEF9C3" stroke="${S}" stroke-width="3.5"/><circle cx="-8" cy="-4" r="8" fill="#FFFFFF" stroke="${S}" stroke-width="2"/><circle cx="12" cy="-4" r="4" fill="#FFE600"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isErased = currentState === "borrado_realidad" || (currentState === undefined && f >= 80);
      const monocleOpacity = isErased ? 0.15 : 1;
      const eraserWobble = Math.sin(f * 0.28) * 3;
      return `<g transform="scale(1.5)">
        <!-- Lienzo sobre caballete -->
        <rect x="-26" y="-24" width="52" height="46" rx="4" fill="#FFFFFF" stroke="${S}" stroke-width="4"/>
        <line x1="0" y1="-24" x2="0" y2="22" stroke="#CBD5E1" stroke-width="2.5"/>
        <!-- Lado Izquierdo: Señor Monopoly con Chistera -->
        <g transform="translate(-13, -2)">
          <rect x="-8" y="-18" width="16" height="10" fill="#0F172A" stroke="${S}" stroke-width="2"/>
          <line x1="-11" y1="-8" x2="11" y2="-8" stroke="${S}" stroke-width="2.5"/>
          <circle cx="0" cy="-1" r="6.5" fill="#FFE4E6" stroke="${S}" stroke-width="2"/>
          <path d="M -5,1 Q 0,-1 5,1 Q 0,4 -5,1 Z" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
          <g opacity="${monocleOpacity}">
            <circle cx="3" cy="-3" r="3.5" fill="#FEF08A" stroke="#D97706" stroke-width="1.8"/>
          </g>
        </g>
        <!-- Lado Derecho: Cola de Pikachu en Zigzag -->
        <g transform="translate(13, 0)">
          <path d="M -6,14 L -1,8 L 3,11 L 8,4 L 12,6 L 6,18 Z" fill="#FFE600" stroke="${S}" stroke-width="2"/>
          <g opacity="${monocleOpacity}">
            <polygon points="8,4 12,6 10,0 7,2" fill="#000000"/>
          </g>
        </g>
        <!-- Goma de borrar bicolor activa -->
        <g transform="translate(${eraserWobble.toFixed(1)}, 14) rotate(-15)">
          <rect x="-8" y="-5" width="16" height="10" rx="2" fill="#F43F5E" stroke="${S}" stroke-width="2.5"/>
          <rect x="0" y="-5" width="8" height="10" rx="1" fill="#3B82F6" stroke="${S}" stroke-width="2.5"/>
        </g>
      </g>`;
    },
    tags: ["monopoly", "pikachu", "caballete", "monoculo", "cola", "dibujo", "goma", "borrar"],
  },
  experimento_loftus_choque_autos: {
    id: "experimento_loftus_choque_autos",
    name: "Choque de Autos del Experimento de Elizabeth Loftus",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-14" width="22" height="12" rx="3" fill="#3B82F6" stroke="${S}" stroke-width="3"/><rect x="2" y="-14" width="22" height="12" rx="3" fill="#EF4444" stroke="${S}" stroke-width="3"/><polygon points="2,-16 6,-8 0,-6" fill="#FACC15"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isSmashed = currentState === "estrellaron_vidrios" || (currentState === undefined && f >= 85);
      const shakeGlass = Math.sin(f * 0.28) * 2.5;
      return `<g transform="scale(1.5)">
        <!-- Auto Azul -->
        <g transform="translate(-14, -8)">
          <rect x="-13" y="-6" width="26" height="14" rx="4" fill="#3B82F6" stroke="${S}" stroke-width="3.5"/>
          <rect x="-7" y="-12" width="15" height="7" rx="2" fill="#93C5FD" stroke="${S}" stroke-width="2.5"/>
          <circle cx="-7" cy="8" r="4" fill="#0F172A" stroke="${S}" stroke-width="1.5"/>
          <circle cx="7" cy="8" r="4" fill="#0F172A" stroke="${S}" stroke-width="1.5"/>
        </g>
        <!-- Auto Rojo -->
        <g transform="translate(14, 8)">
          <rect x="-13" y="-6" width="26" height="14" rx="4" fill="#EF4444" stroke="${S}" stroke-width="3.5"/>
          <rect x="-8" y="-12" width="15" height="7" rx="2" fill="#FCA5A5" stroke="${S}" stroke-width="2.5"/>
          <circle cx="-7" cy="8" r="4" fill="#0F172A" stroke="${S}" stroke-width="1.5"/>
          <circle cx="7" cy="8" r="4" fill="#0F172A" stroke="${S}" stroke-width="1.5"/>
          ${isSmashed ? `<g transform="translate(-18, -10) translate(${shakeGlass.toFixed(1)}, 0)">
            <circle cx="0" cy="0" r="11" fill="#FEF08A" fill-opacity="0.35" stroke="#DC2626" stroke-width="2.5" stroke-dasharray="3 2"/>
            <polygon points="-5,-2 0,-8 4,-3" fill="#67E8F9" stroke="${S}" stroke-width="1.8"/>
            <polygon points="2,3 7,-2 5,6" fill="#67E8F9" stroke="${S}" stroke-width="1.8"/>
          </g>` : ""}
        </g>
      </g>`;
    },
    tags: ["autos", "choque", "loftus", "experimento", "velocidad", "cristales", "psicologia"],
  },
  vhs_rompecabezas_cajon_memoria: {
    id: "vhs_rompecabezas_cajon_memoria",
    name: "VHS Roto y Rompecabezas de Memoria Reconstructiva",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-12" width="24" height="18" rx="2" fill="#0F172A" stroke="${S}" stroke-width="3"/><rect x="4" y="-14" width="20" height="20" rx="3" fill="#10B981" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isRebuilt = currentState === "rellenando_hueco" || (currentState === undefined && f >= 75);
      const piecePush = isRebuilt ? Math.sin(f * 0.24) * 2 : 5;
      return `<g transform="scale(1.5)">
        <!-- Videocasete VHS antiguo tachado -->
        <g transform="translate(-15, 2)">
          <rect x="-13" y="-16" width="26" height="30" rx="3" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
          <circle cx="-5" cy="-4" r="4.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <circle cx="5" cy="-4" r="4.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <line x1="-11" y1="-14" x2="11" y2="12" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
        </g>
        <!-- Rompecabezas reconstruido con pieza intrusa -->
        <g transform="translate(15, -2)">
          <rect x="-11" y="-14" width="24" height="24" rx="3" fill="#10B981" stroke="${S}" stroke-width="3.5"/>
          <line x1="1" y1="-14" x2="1" y2="10" stroke="${S}" stroke-width="2.5"/>
          <line x1="-11" y1="-2" x2="13" y2="-2" stroke="${S}" stroke-width="2.5"/>
          <g transform="translate(${piecePush.toFixed(1)}, 0)">
            <rect x="2" y="-1" width="11" height="11" rx="2" fill="#F43F5E" stroke="${S}" stroke-width="2.5"/>
          </g>
        </g>
      </g>`;
    },
    tags: ["vhs", "rompecabezas", "puzzle", "cajon", "memoria", "reconstruccion", "cerebro"],
  },
  multitud_piezas_falsas_lupa: {
    id: "multitud_piezas_falsas_lupa",
    name: "Lupa Examinando Piezas Falsas de la Multitud",
    family: "herramientas_objetos",
    defaultPlacement: "overhead",
    svg: `<circle cx="-4" cy="-4" r="14" fill="#E0F2FE" stroke="${S}" stroke-width="4"/><line x1="6" y1="6" x2="20" y2="20" stroke="#78350F" stroke-width="5" stroke-linecap="round"/><text x="-4" y="2" text-anchor="middle" fill="#EF4444" font-size="12" font-weight="900">X</text>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const wobble = Math.sin(f * 0.16) * 2.5;
      const isDebunked = currentState === "desmentido_lupa" || (currentState === undefined && f >= 70);
      return `<g transform="translate(0, ${wobble.toFixed(1)}) scale(1.5)">
        <!-- Pieza de rompecabezas flotante bajo examen -->
        <rect x="-15" y="-15" width="26" height="26" rx="4" fill="#F59E0B" stroke="${S}" stroke-width="4"/>
        <circle cx="-2" cy="-15" r="4" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/>
        <!-- Lupa con lente de cristal -->
        <circle cx="2" cy="0" r="19" fill="#38BDF8" fill-opacity="0.28" stroke="#D97706" stroke-width="4.5"/>
        <line x1="15" y1="14" x2="29" y2="28" stroke="#92400E" stroke-width="6.5" stroke-linecap="round"/>
        <!-- Gran X roja sobre la pieza equivocada -->
        ${isDebunked ? `<g>
          <line x1="-8" y1="-8" x2="8" y2="8" stroke="#DC2626" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="8" y1="-8" x2="-8" y2="8" stroke="#DC2626" stroke-width="5.5" stroke-linecap="round"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["lupa", "multitud", "pieza", "error", "falso", "examen", "cruz_roja"],
  },
  nube_sombrero_rebobinado_vhs: {
    id: "nube_sombrero_rebobinado_vhs",
    name: "Nube de Pensamiento con Sombrero en Duda y Bucle",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<path d="M -16,4 C -22,4 -22,-8 -14,-8 C -14,-16 0,-18 6,-10 C 14,-16 24,-6 20,4 Z" fill="#FFFFFF" stroke="${S}" stroke-width="3"/><rect x="-8" y="-4" width="16" height="8" rx="2" fill="#0F172A"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const floatY = Math.sin(f * 0.18) * 2.5;
      const rotLoop = (f * 3) % 360;
      return `<g transform="translate(0, ${floatY.toFixed(1)}) scale(1.5)">
        <!-- Nube de pensamiento neo-brutalista -->
        <path
          d="M -22,6 C -30,6 -30,-8 -18,-8 C -18,-20 2,-22 10,-12 C 22,-20 34,-6 28,6 C 34,18 16,24 6,18 C -2,24 -18,22 -22,6 Z"
          fill="#FFFFFF"
          stroke="${S}"
          stroke-width="4"
        />
        <!-- Sombrero de copa dentro de la nube -->
        <g transform="translate(-3, -4)">
          <rect x="-9" y="-13" width="18" height="13" rx="2" fill="#0F172A" stroke="${S}" stroke-width="2.5"/>
          <rect x="-8" y="-4" width="16" height="3" fill="#EF4444"/>
          <ellipse cx="0" cy="0" rx="14" ry="3" fill="#0F172A" stroke="${S}" stroke-width="2.5"/>
        </g>
        <!-- Flecha circular giratoria de rebobinado -->
        <g transform="translate(14, 10) rotate(${rotLoop})">
          <circle cx="0" cy="0" r="7" fill="#FFE600" stroke="${S}" stroke-width="2.5"/>
          <path d="M -3,0 L 2,-3 L 2,3 Z" fill="#000000"/>
        </g>
      </g>`;
    },
    tags: ["sombrero", "nube", "duda", "pregunta", "bucle", "cierre", "cabeza"],
  },
  mascara_buceo: {
    id: "mascara_buceo",
    name: "Máscara de Buceo y Snorkel",
    family: "historia_exploracion",
    defaultPlacement: "overhead",
    svg: `<ellipse cx="0" cy="0" rx="22" ry="14" fill="#38BDF8" fill-opacity="0.75" stroke="${S}" stroke-width="3.5"/><path d="M 16,0 C 26,-6 26,-24 22,-30" fill="none" stroke="#F97316" stroke-width="4.5" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const bubbleY = (f * 1.5) % 36;
      return `<g>
        <!-- Gafas de buceo con lente cian translúcido -->
        <ellipse cx="0" cy="0" rx="24" ry="15" fill="#38BDF8" fill-opacity="0.8" stroke="${S}" stroke-width="4"/>
        <path d="M -16,-6 Q -8,-11 4,-6" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.9"/>
        <!-- Correa de silicona negra -->
        <path d="M -24,0 C -34,-2 -34,-8 -24,-10" fill="none" stroke="${S}" stroke-width="3.5"/>
        <path d="M 24,0 C 34,-2 34,-8 24,-10" fill="none" stroke="${S}" stroke-width="3.5"/>
        <!-- Tubo de snorkel naranja -->
        <path d="M 18,2 C 28,-4 30,-22 26,-36" fill="none" stroke="#F97316" stroke-width="5" stroke-linecap="round"/>
        <circle cx="26" cy="-38" r="3" fill="#EF4444" stroke="${S}" stroke-width="1.5"/>
        <!-- Burbujas saliendo del snorkel -->
        <circle cx="${26 + Math.sin(f * 0.2) * 3}" cy="${-40 - bubbleY}" r="${2 + (bubbleY % 4)}" fill="#E0F2FE" stroke="${S}" stroke-width="1.2" opacity="0.85"/>
      </g>`;
    },
    tags: ["buceo", "snorkel", "mascara", "submarino", "mar", "agua"],
  },
  lupa_gigante_arqueologia: {
    id: "lupa_gigante_arqueologia",
    name: "Lupa Gigante de Investigación Científica",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="-8" r="22" fill="#E0F2FE" stroke="#F59E0B" stroke-width="5"/><line x1="14" y1="6" x2="30" y2="24" stroke="#78350F" stroke-width="6" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const shimmer = Math.sin(f * 0.15) * 6;
      return `<g>
        <!-- Mango de madera noble -->
        <line x1="14" y1="8" x2="32" y2="26" stroke="#78350F" stroke-width="7" stroke-linecap="round"/>
        <line x1="12" y1="6" x2="16" y2="10" stroke="#F59E0B" stroke-width="6"/>
        <!-- Marco circular dorado -->
        <circle cx="0" cy="-8" r="23" fill="#E0F2FE" fill-opacity="0.85" stroke="#F59E0B" stroke-width="5"/>
        <circle cx="0" cy="-8" r="21" fill="none" stroke="${S}" stroke-width="2"/>
        <!-- Reflejo diagonal de luz en el cristal -->
        <path d="M ${-12 + shimmer},-18 Q ${shimmer},-8 ${12 + shimmer},2" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
      </g>`;
    },
    tags: ["lupa", "investigacion", "ciencia", "arqueologia", "microscopio", "aumento"],
  },
  bloques_comparativa_hormigon: {
    id: "bloques_comparativa_hormigon",
    name: "Muestras de Hormigón Moderno vs Romano",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-30" y="-12" width="26" height="24" rx="4" fill="#94A3B8" stroke="${S}" stroke-width="3"/><rect x="6" y="-12" width="26" height="24" rx="4" fill="#D97706" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const healFlash = Math.sin(f * 0.25) > 0.5 ? 1 : 0;
      return `<g>
        <!-- Bloque Moderno (Izquierda, agrietado con óxido) -->
        <rect x="-32" y="-14" width="28" height="28" rx="4" fill="#94A3B8" stroke="${S}" stroke-width="3.5"/>
        <path d="M -24,-14 L -18,-2 L -22,8 L -16,14" fill="none" stroke="#EA580C" stroke-width="2.5"/>
        <!-- Bloque Romano (Derecha, autorreparado con destello dorado) -->
        <rect x="6" y="-14" width="28" height="28" rx="4" fill="#D97706" stroke="${S}" stroke-width="3.5"/>
        <circle cx="14" cy="-4" r="3.5" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
        <circle cx="24" cy="6" r="3" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
        ${healFlash ? `<polygon points="20,-16 22,-10 28,-8 22,-6 20,0 18,-6 12,-8 18,-10" fill="#22C55E"/>` : ""}
      </g>`;
    },
    tags: ["bloques", "hormigon", "romano", "moderno", "comparativa", "materiales"],
  },
  perro_xoloitzcuintle: {
    id: "perro_xoloitzcuintle",
    name: "Perro Xoloitzcuintle Guía del Mictlán",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<path d="M -30,12 C -40,4 -36,-12 -20,-12 C -8,-12 0,-4 8,6 L 24,0 L 36,-14 L 42,-4 L 32,12 L 26,24 Z" fill="#334155" stroke="${S}" stroke-width="5"/><ellipse cx="-10" cy="2" rx="14" ry="7" fill="#FDE047"/>`,
    animatedSvg: (f: number, _progress = 0, state?: string) => {
      const isSitting = state === "sentado";
      const isPetting = state === "acariciar";
      const tailAngle = Math.sin(f * (isPetting ? 0.6 : 0.35)) * (isPetting ? 28 : 18);
      const breathe = Math.sin(f * 0.18) * 2;
      const leg1 = isSitting ? 0 : Math.sin(f * 0.4) * 12;
      const eyeBlink = !isPetting && (f % 65 < 4) ? 0.2 : 4;
      const headTilt = isSitting ? -16 : isPetting ? -8 : 0;

      return `<g transform="translate(0, ${n(breathe * 0.6)})">
        <!-- Resplandor áurico sagrado de la mancha del lomo -->
        <ellipse cx="-8" cy="2" rx="26" ry="14" fill="#FDE047" opacity="0.3" filter="blur(4px)"/>

        <!-- Cola con meneo amigable -->
        <g transform="translate(-32, 2) rotate(${n(tailAngle)})">
          <path d="M 0,0 C -12,-8 -22,-20 -18,-32 C -15,-20 -6,-8 0,0" fill="#334155" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/>
        </g>

        <!-- Patas traseras (animadas o sentadas) -->
        ${isSitting ? `
          <path d="M -28,14 C -38,26 -30,38 -12,38 L 4,38" stroke="${S}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
        ` : `
          <path d="M -26,14 L ${n(-26 + leg1)},36 L ${n(-18 + leg1)},37" stroke="${S}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
          <path d="M -14,14 L ${n(-14 - leg1)},36 L ${n(-6 - leg1)},37" stroke="${S}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
        `}

        <!-- Cuerpo musculoso y estilizado de perro xoloitzcuintle -->
        <ellipse cx="-4" cy="10" rx="30" ry="18" fill="#334155" stroke="${S}" stroke-width="5.5"/>

        <!-- Mancha clara sagrada en el lomo (el xoloitzcuintle que ayuda a cruzar las almas) -->
        <path d="M -18,0 C -10,-4 6,-4 14,0 C 10,8 -2,10 -14,6 Z" fill="#FDE047" stroke="${S}" stroke-width="3"/>

        <!-- Patas delanteras -->
        ${isSitting ? `
          <path d="M 16,14 L 16,38 L 26,38" stroke="${S}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
          <path d="M 24,14 L 24,38 L 34,38" stroke="${S}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
        ` : `
          <path d="M 12,14 L ${n(12 - leg1)},36 L ${n(20 - leg1)},37" stroke="${S}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
          <path d="M 24,14 L ${n(24 + leg1)},36 L ${n(32 + leg1)},37" stroke="${S}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
        `}

        <!-- Cuello y pecho vigoroso -->
        <path d="M 10,4 L 22,-14 L 34,-10 L 22,14 Z" fill="#334155" stroke="${S}" stroke-width="4.5"/>

        <!-- Cabeza con hocico noble y giro expresivo -->
        <g transform="translate(26, -14) rotate(${n(headTilt)})">
          <ellipse cx="0" cy="0" rx="14" ry="11" fill="#334155" stroke="${S}" stroke-width="5"/>
          <!-- Hocico y boca -->
          <path d="M 8,-4 L 24,2 L 12,8 Z" fill="#1E293B" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
          <circle cx="23" cy="2" r="3" fill="#000000"/>
          ${isPetting ? `
            <!-- Lengüita feliz jadeando al ser acariciado -->
            <path d="M 14,8 C 16,14 10,16 8,10 Z" fill="#F43F5E"/>
          ` : ''}

          <!-- Orejas puntiagudas mexicas -->
          <polygon points="-6,-6 -2,-28 6,-8" fill="#334155" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
          <polygon points="-3,-8 -1,-22 4,-10" fill="#FDE047" opacity="0.75"/>
          <polygon points="-12,-4 -10,-24 -4,-6" fill="#1E293B" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>

          <!-- Ojo alegre y vivaz -->
          ${isPetting ? `
            <path d="M 0,-2 Q 4,-6 8,-2" fill="none" stroke="#FEF08A" stroke-width="3" stroke-linecap="round"/>
          ` : `
            <ellipse cx="4" cy="-2" rx="3.5" ry="${n(eyeBlink)}" fill="#FEF08A"/>
            <circle cx="4" cy="-2" r="1.8" fill="#000000"/>
          `}
        </g>
      </g>`;
    },
    tags: ["perro", "xoloitzcuintle", "mictlan", "guia", "mexica", "mascota", "ofrenda"],
  },
  altar_tres_niveles_vela: {
    id: "altar_tres_niveles_vela",
    name: "Altar Tradicional de Tres Niveles con Vela",
    family: "historia_exploracion",
    defaultPlacement: "left",
    svg: `<rect x="-30" y="8" width="60" height="16" fill="#7E22CE" stroke="${S}" stroke-width="3.5"/><rect x="-22" y="-4" width="44" height="12" fill="#EA580C" stroke="${S}" stroke-width="3.5"/><rect x="-14" y="-16" width="28" height="12" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>`,
    animatedSvg: (f: number) => {
      const flameWobble = Math.sin(f * 0.4) * 2.5;
      const flameHeight = 12 + Math.sin(f * 0.25) * 2;
      return `<g>
        <!-- Nivel 3 (base amplia morada con papel picado) -->
        <rect x="-34" y="6" width="68" height="18" rx="2" fill="#6B21A8" stroke="${S}" stroke-width="4"/>
        <path d="M -32,24 L -28,18 L -24,24 L -20,18 L -16,24 L -12,18 L -8,24 L -4,18 L 0,24 L 4,18 L 8,24 L 12,18 L 16,24 L 20,18 L 24,24 L 28,18 L 32,24" fill="#F43F5E" stroke="${S}" stroke-width="2"/>
        <!-- Nivel 2 (intermedio naranja) -->
        <rect x="-25" y="-6" width="50" height="13" rx="2" fill="#EA580C" stroke="${S}" stroke-width="3.5"/>
        <circle cx="-16" cy="0" r="4.5" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
        <circle cx="16" cy="0" r="4.5" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
        <!-- Nivel 1 (cúspide amarilla) -->
        <rect x="-16" y="-18" width="32" height="12" rx="2" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
        <!-- Vela blanca central en la cúspide -->
        <rect x="-4" y="-30" width="8" height="13" rx="1.5" fill="#F8FAFC" stroke="${S}" stroke-width="2.5"/>
        <line x1="0" y1="-30" x2="0" y2="-34" stroke="${S}" stroke-width="2"/>
        <!-- Llama animada de la vela -->
        <path d="M 0,-34 C ${-4 + flameWobble},${-34 - flameHeight*0.6} ${flameWobble},${-34 - flameHeight} ${flameWobble},${-34 - flameHeight} C ${flameWobble},${-34 - flameHeight} ${4 + flameWobble},${-34 - flameHeight*0.6} 0,-34 Z" fill="#F59E0B" stroke="#EA580C" stroke-width="1.5"/>
        <ellipse cx="${flameWobble * 0.5}" cy="${-38}" rx="2" ry="3.5" fill="#FEF08A"/>
        <!-- Flores de cempasúchil decorando los costados -->
        <circle cx="-28" cy="10" r="4.5" fill="#F97316" stroke="${S}" stroke-width="2"/>
        <circle cx="28" cy="10" r="4.5" fill="#F97316" stroke="${S}" stroke-width="2"/>
      </g>`;
    },
    tags: ["altar", "ofrenda", "vela", "dia_de_muertos", "mexica", "cempasuchil"],
  },
  codice_mexica_abierto: {
    id: "codice_mexica_abierto",
    name: "Códice Mexica Abierto en Acordeón",
    family: "historia_exploracion",
    defaultPlacement: "both",
    svg: `<path d="M -30,-14 L -10,-10 L 10,-14 L 30,-10 L 30,14 L 10,10 L -10,14 L -30,10 Z" fill="#FEF3C7" stroke="${S}" stroke-width="3.5"/>`,
    animatedSvg: (f: number) => {
      const flap = Math.sin(f * 0.18) * 2;
      return `<g>
        <!-- Hojas de papel amate plegadas en acordeón -->
        <!-- Hoja 1 -->
        <polygon points="-32,${-14 + flap} -12,${-10 - flap} -12,${12 - flap} -32,${8 + flap}" fill="#FDE68A" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <!-- Glifo Sol Tonatiuh rojo -->
        <circle cx="-22" cy="0" r="5" fill="#DC2626" stroke="${S}" stroke-width="2"/>
        <line x1="-22" y1="-8" x2="-22" y2="-6" stroke="${S}" stroke-width="2"/>
        <line x1="-22" y1="6" x2="-22" y2="8" stroke="${S}" stroke-width="2"/>
        <!-- Hoja 2 (central) -->
        <polygon points="-12,${-10 - flap} 8,${-14 + flap} 8,${8 + flap} -12,${12 - flap}" fill="#FEF3C7" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <!-- Glifo Agua / Chalchiuhtlicue azul -->
        <path d="M -4,-4 Q -2,4 0,0 Q 2,-4 4,2" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="5" r="2" fill="#0284C7"/>
        <!-- Hoja 3 -->
        <polygon points="8,${-14 + flap} 28,${-10 - flap} 28,${12 - flap} 8,${8 + flap}" fill="#FDE68A" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <!-- Glifo Cráneo / Mictlán negro -->
        <ellipse cx="18" cy="-1" rx="4.5" ry="4" fill="#334155" stroke="${S}" stroke-width="1.8"/>
        <rect x="16" y="3" width="4" height="2" fill="#E2E8F0"/>
      </g>`;
    },
    tags: ["codice", "mexica", "sahagun", "manuscrito", "historia", "jeroglifico", "amate"],
  },
  cuenco_agua_petalos: {
    id: "cuenco_agua_petalos",
    name: "Cuenco de Barro con Agua y Pétalos de Cempasúchil",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<path d="M -22,-2 C -20,16 20,16 22,-2 Z" fill="#C2410C" stroke="${S}" stroke-width="3.5"/><ellipse cx="0" cy="-2" rx="22" ry="7" fill="#38BDF8" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const ripple = Math.sin(f * 0.2) * 1.5;
      const petalaX = Math.sin(f * 0.12) * 2;
      return `<g>
        <!-- Cuerpo de barro cocido terracota -->
        <path d="M -24,-2 C -22,18 22,18 24,-2 Z" fill="#C2410C" stroke="${S}" stroke-width="4"/>
        <ellipse cx="0" cy="15" rx="10" ry="3" fill="#9A3412" stroke="${S}" stroke-width="2"/>
        <!-- Superficie de agua cristalina azul con reflejos -->
        <ellipse cx="0" cy="-2" rx="23" ry="7.5" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/>
        <ellipse cx="0" cy="-2" rx="${17 + ripple}" ry="${5 + ripple*0.4}" fill="none" stroke="#E0F2FE" stroke-width="1.8" opacity="0.8"/>
        <!-- Pétalos dorados de cempasúchil flotando en el agua -->
        <g transform="translate(${-6 + petalaX}, -2)">
          <ellipse cx="0" cy="0" rx="3.5" ry="2" fill="#F97316" stroke="${S}" stroke-width="1.2"/>
          <circle cx="0" cy="0" r="1.2" fill="#FDE047"/>
        </g>
        <g transform="translate(${8 - petalaX}, -1)">
          <ellipse cx="0" cy="0" rx="4" ry="2.2" fill="#EA580C" stroke="${S}" stroke-width="1.2"/>
          <circle cx="0" cy="0" r="1.5" fill="#FACC15"/>
        </g>
        <g transform="translate(${petalaX * 0.5}, 1)">
          <ellipse cx="0" cy="0" rx="3" ry="1.8" fill="#F59E0B" stroke="${S}" stroke-width="1"/>
        </g>
      </g>`;
    },
    tags: ["cuenco", "agua", "barro", "petalos", "cempasuchil", "ofrenda", "sed", "viaje"],
  },
  telefono_dopamina_dorado: {
    id: "telefono_dopamina_dorado",
    name: "Smartphone con Resplandor Dorado de Dopamina y Scroll",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-16" y="-28" width="32" height="56" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4"/><rect x="-12" y="-22" width="24" height="44" rx="3" fill="#FDE047"/><polygon points="0,-6 -6,4 6,4" fill="#EA580C"/>`,
    animatedSvg: (f: number) => {
      const scrollY = (f * 3.5) % 36;
      const pulseGlow = 0.5 + Math.sin(f * 0.25) * 0.35;
      const heartY = 14 - ((f * 1.5) % 24);
      return `<g>
        <!-- Resplandor dorado hipnótico de dopamina -->
        <rect x="-24" y="-36" width="48" height="72" rx="12" fill="#FDE047" opacity="${n(pulseGlow * 0.45)}" filter="blur(6px)"/>
        <!-- Cuerpo del smartphone negro medianoche -->
        <rect x="-18" y="-30" width="36" height="60" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>
        <!-- Pantalla táctil luminosa vertical -->
        <rect x="-14" y="-24" width="28" height="48" rx="3" fill="#1E293B"/>
        <!-- Tarjetas de videos cortos haciendo scroll rápido -->
        <g clip-path="url(#phoneClip)">
          <rect x="-12" y="${-20 + scrollY}" width="24" height="18" rx="2" fill="#E11D48"/>
          <rect x="-12" y="${2 + scrollY}" width="24" height="18" rx="2" fill="#7C3AED"/>
          <rect x="-12" y="${24 + scrollY}" width="24" height="18" rx="2" fill="#059669"/>
          <rect x="-12" y="${-42 + scrollY}" width="24" height="18" rx="2" fill="#2563EB"/>
        </g>
        <!-- Corazón rojo flotando de 'Me gusta' -->
        <path d="M 0,${n(heartY)} C -2,${n(heartY - 4)} -6,${n(heartY - 2)} -6,${n(heartY + 2)} C -6,${n(heartY + 6)} 0,${n(heartY + 10)} 0,${n(heartY + 10)} C 0,${n(heartY + 10)} 6,${n(heartY + 6)} 6,${n(heartY + 2)} C 6,${n(heartY - 2)} 2,${n(heartY - 4)} 0,${n(heartY)} Z" fill="#F43F5E" stroke="#000000" stroke-width="1.2"/>
        <!-- Flecha de swipe continuo hacia arriba -->
        <polygon points="0,-16 -4,-10 4,-10" fill="#FEF08A"/>
        <line x1="0" y1="-10" x2="0" y2="-4" stroke="#FEF08A" stroke-width="2"/>
      </g>`;
    },
    tags: ["telefono", "celular", "smartphone", "dopamina", "scroll", "tiktok", "procrastinacion"],
  },
  laptop_escritorio_documento: {
    id: "laptop_escritorio_documento",
    name: "Laptop con Documento en Blanco y Entrega 11:59 PM",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-30" y="-18" width="60" height="36" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/><polygon points="-38,20 38,20 32,14 -32,14" fill="#94A3B8" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const cursorBlink = f % 20 < 10;
      return `<g>
        <!-- Base del teclado -->
        <polygon points="-42,22 42,22 36,12 -36,12" fill="#64748B" stroke="${S}" stroke-width="4"/>
        <rect x="-12" y="15" width="24" height="5" rx="1.5" fill="#475569" stroke="${S}" stroke-width="1.5"/>
        <!-- Pantalla de la laptop -->
        <rect x="-32" y="-24" width="64" height="36" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4.5"/>
        <!-- Documento de texto blanco en pantalla -->
        <rect x="-26" y="-20" width="52" height="28" fill="#F8FAFC" stroke="${S}" stroke-width="1.5"/>
        <!-- Header rojo: Entrega 11:59 PM -->
        <rect x="-24" y="-18" width="48" height="6" fill="#EF4444" rx="1"/>
        <text x="0" y="-13.5" text-anchor="middle" fill="#FFFFFF" font-size="4" font-weight="900" font-family="'Arial Black'">ENTREGA: 11:59 PM</text>
        <!-- Línea de título y cursor parpadeante -->
        <line x1="-22" y1="-7" x2="-8" y2="-7" stroke="#94A3B8" stroke-width="2"/>
        ${cursorBlink ? `<line x1="-6" y1="-10" x2="-6" y2="-4" stroke="#000000" stroke-width="2.5"/>` : ""}
      </g>`;
    },
    tags: ["laptop", "computadora", "trabajo", "documento", "blanco", "urgencia", "escritorio"],
  },
  pizarron_metas_30dias: {
    id: "pizarron_metas_30dias",
    name: "Pizarrón Blanco con Plan de Vida y Carga al 15%",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-34" y="-24" width="68" height="42" rx="4" fill="#F8FAFC" stroke="${S}" stroke-width="4.5"/><line x1="-24" y1="18" x2="-30" y2="38" stroke="${S}" stroke-width="4"/><line x1="24" y1="18" x2="30" y2="38" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const loadW = 10 + Math.min(24, Math.floor(f * 0.08));
      return `<g>
        <!-- Patas de soporte metálicas -->
        <line x1="-26" y1="14" x2="-34" y2="40" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
        <line x1="26" y1="14" x2="34" y2="40" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
        <!-- Marco de acrílico blanco -->
        <rect x="-36" y="-26" width="72" height="44" rx="4" fill="#F8FAFC" stroke="${S}" stroke-width="5"/>
        <!-- Gráfico de barras ascendente (1 a 5) -->
        <rect x="-28" y="0" width="6" height="8" fill="#3B82F6" stroke="${S}" stroke-width="1.5"/>
        <rect x="-20" y="-4" width="6" height="12" fill="#3B82F6" stroke="${S}" stroke-width="1.5"/>
        <rect x="-12" y="-10" width="6" height="18" fill="#10B981" stroke="${S}" stroke-width="1.5"/>
        <!-- Casa con techo verde -->
        <polygon points="12,-16 26,-4 26,6 12,6 Z" fill="#FEF08A" stroke="${S}" stroke-width="2"/>
        <polygon points="6,-4 19,-16 32,-4" fill="#EF4444" stroke="${S}" stroke-width="2"/>
        <!-- Barra de carga lenta: 'Calculando... 15%' -->
        <rect x="-30" y="9" width="60" height="6" rx="2" fill="#E2E8F0" stroke="${S}" stroke-width="1.5"/>
        <rect x="-29" y="10" width="${loadW}" height="4" rx="1" fill="#2563EB"/>
      </g>`;
    },
    tags: ["pizarron", "metas", "planificacion", "corteza", "racional", "lento", "futuro"],
  },
  mazo_cavernicola_dopamina: {
    id: "mazo_cavernicola_dopamina",
    name: "Mazo de Cavernícola con Dona y Chispas de Dopamina",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<line x1="-16" y1="20" x2="16" y2="-12" stroke="#78350F" stroke-width="6"/><ellipse cx="20" cy="-16" rx="16" ry="12" fill="#64748B" stroke="${S}" stroke-width="4"/><circle cx="-16" cy="-12" r="12" fill="#EC4899"/>`,
    animatedSvg: (f: number) => {
      const sparkRot = (f * 5) % 360;
      return `<g>
        <!-- Mazo rústico prehistórico con roca atada -->
        <line x1="-18" y1="24" x2="18" y2="-14" stroke="#78350F" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="22" cy="-18" rx="18" ry="14" fill="#64748B" stroke="${S}" stroke-width="5"/>
        <line x1="12" y1="-14" x2="28" y2="-22" stroke="#FEF08A" stroke-width="2.5"/>
        <!-- Dona glaseada rosa apetitosa en la mano izquierda -->
        <g transform="translate(-18, -10)">
          <circle cx="0" cy="0" r="14" fill="#D97706" stroke="${S}" stroke-width="3"/>
          <circle cx="0" cy="0" r="11" fill="#F43F5E"/>
          <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <circle cx="-5" cy="-5" r="1.5" fill="#FEF08A"/>
          <circle cx="5" cy="-4" r="1.5" fill="#38BDF8"/>
          <circle cx="0" cy="6" r="1.5" fill="#22C55E"/>
        </g>
        <!-- Chispas fosforescentes de dopamina -->
        <g transform="translate(0, -22) rotate(${sparkRot})">
          <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="#FDE047"/>
        </g>
      </g>`;
    },
    tags: ["mazo", "garrote", "cavernicola", "dona", "dopamina", "placer", "impulso"],
  },
  pila_carpetas_oficina_gigante: {
    id: "pila_carpetas_oficina_gigante",
    name: "Pila Monumental de Carpetas de Trabajo Inacabadas",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<rect x="-24" y="14" width="48" height="12" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/><rect x="-22" y="0" width="44" height="12" fill="#3B82F6" stroke="${S}" stroke-width="3.5"/><rect x="-26" y="-14" width="52" height="12" fill="#EF4444" stroke="${S}" stroke-width="3.5"/>`,
    animatedSvg: (f: number) => {
      const wobble = Math.sin(f * 0.25) * 2;
      return `<g transform="translate(0, ${n(wobble)})">
        <!-- Carpeta 4 (base) -->
        <rect x="-28" y="16" width="56" height="13" rx="2" fill="#D97706" stroke="${S}" stroke-width="4"/>
        <rect x="-18" y="18" width="16" height="7" fill="#FFFFFF"/>
        <!-- Carpeta 3 -->
        <rect x="-26" y="2" width="52" height="13" rx="2" fill="#2563EB" stroke="${S}" stroke-width="4"/>
        <text x="-6" y="10" fill="#FFFFFF" font-size="5" font-weight="900">REPORTE</text>
        <!-- Carpeta 2 -->
        <rect x="-24" y="-12" width="48" height="13" rx="2" fill="#059669" stroke="${S}" stroke-width="4"/>
        <!-- Carpeta 1 (tope roja URGENTE) -->
        <rect x="-28" y="-26" width="56" height="13" rx="2" fill="#DC2626" stroke="${S}" stroke-width="4"/>
        <text x="0" y="-18" text-anchor="middle" fill="#FEF08A" font-size="5.5" font-weight="900" font-family="'Arial Black'">URGENTE</text>
      </g>`;
    },
    tags: ["carpetas", "trabajo", "archivos", "papeles", "marron", "tarea", "pendiente"],
  },
  sofa_relax_palomitas: {
    id: "sofa_relax_palomitas",
    name: "Sillón Inflable, Palomitas y Gafas de Sol",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<ellipse cx="0" cy="12" rx="34" ry="18" fill="#06B6D4" stroke="${S}" stroke-width="4"/><polygon points="16,-6 26,-6 28,14 14,14" fill="#EF4444" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      const popcornPop = Math.sin(f * 0.3) * 6;
      return `<g>
        <!-- Sillón inflable redondeado turquesa -->
        <ellipse cx="0" cy="14" rx="38" ry="18" fill="#06B6D4" stroke="${S}" stroke-width="5"/>
        <ellipse cx="0" cy="4" rx="26" ry="12" fill="#22D3EE" stroke="${S}" stroke-width="3"/>
        <!-- Bote de palomitas a rayas rojas y blancas -->
        <g transform="translate(18, -4)">
          <polygon points="-8,-10 8,-10 6,10 -6,10" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
          <line x1="-3" y1="-10" x2="-2" y2="10" stroke="#EF4444" stroke-width="3"/>
          <line x1="3" y1="-10" x2="2" y2="10" stroke="#EF4444" stroke-width="3"/>
          <!-- Palomitas doradas saliendo -->
          <circle cx="-4" cy="-14" r="3" fill="#FEF08A"/>
          <circle cx="2" cy="-15" r="3.5" fill="#FDE047"/>
          <circle cx="0" cy="${n(-20 - popcornPop)}" r="2.5" fill="#FEF08A"/>
        </g>
        <!-- Gafas de sol oscuras -->
        <g transform="translate(-16, -6)">
          <rect x="-8" y="-4" width="7" height="6" rx="1.5" fill="#000000" stroke="${S}" stroke-width="1.5"/>
          <rect x="1" y="-4" width="7" height="6" rx="1.5" fill="#000000" stroke="${S}" stroke-width="1.5"/>
          <line x1="-1" y1="-2" x2="1" y2="-2" stroke="#000000" stroke-width="2"/>
        </g>
      </g>`;
    },
    tags: ["sofa", "palomitas", "relax", "gafas", "comodidad", "presente", "chill"],
  },
  tazas_cafe_estres_apiladas: {
    id: "tazas_cafe_estres_apiladas",
    name: "Tazas de Café Apiladas y Reloj Bomba 3:42 AM",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<polygon points="-10,-8 10,-8 8,14 -8,14" fill="#F8FAFC" stroke="${S}" stroke-width="3"/><rect x="14" y="-12" width="24" height="16" rx="3" fill="#0F172A"/>`,
    animatedSvg: (f: number) => {
      const steamY = (f * 1.8) % 18;
      const bombSpark = f % 6 < 3;
      return `<g>
        <!-- Taza 1 (abajo) -->
        <polygon points="-12,4 12,4 9,24 -9,24" fill="#E2E8F0" stroke="${S}" stroke-width="3.5"/>
        <rect x="-10" y="10" width="20" height="6" fill="#78350F"/>
        <!-- Taza 2 (apilada) -->
        <polygon points="-11,-12 11,-12 8,4 -8,4" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/>
        <!-- Taza 3 (tope) -->
        <polygon points="-9,-26 9,-26 7,-12 -7,-12" fill="#E2E8F0" stroke="${S}" stroke-width="3"/>
        <!-- Vapor de café caliente -->
        <path d="M 0,-28 Q 4,${n(-36 - steamY)} 0,${n(-44 - steamY)}" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
        <!-- Reloj digital con mecha: 03:42 AM -->
        <g transform="translate(24, 0)">
          <rect x="-14" y="-12" width="28" height="20" rx="3" fill="#0F172A" stroke="${S}" stroke-width="3"/>
          <text x="0" y="2" text-anchor="middle" fill="#EF4444" font-size="6" font-weight="900" font-family="'Arial Black'">03:42</text>
          <!-- Mecha encendida en la esquina superior -->
          <path d="M 10,-12 Q 14,-20 8,-24" fill="none" stroke="#F59E0B" stroke-width="2"/>
          <circle cx="8" cy="-24" r="${bombSpark ? 3 : 1.5}" fill="#FEF08A"/>
        </g>
      </g>`;
    },
    tags: ["cafe", "tazas", "madrugada", "estres", "panico", "reloj", "bomba", "futuro"],
  },
  caja_fuerte_candado_telefono: {
    id: "caja_fuerte_candado_telefono",
    name: "Caja de Seguridad con Candado Cerrado",
    family: "herramientas_objetos",
    defaultPlacement: "left",
    svg: `<rect x="-24" y="-14" width="48" height="34" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/><circle cx="0" cy="3" r="5" fill="#F59E0B"/>`,
    animatedSvg: (f: number) => {
      const lockClick = Math.sin(f * 0.2) > 0.8;
      return `<g>
        <!-- Caja metálica blindada -->
        <rect x="-26" y="-12" width="52" height="34" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4.5"/>
        <line x1="-24" y1="-2" x2="24" y2="-2" stroke="#475569" stroke-width="2"/>
        <!-- Candado de latón cerrado al frente -->
        <g transform="translate(0, 4)">
          <rect x="-8" y="-2" width="16" height="14" rx="2" fill="#F59E0B" stroke="${S}" stroke-width="3"/>
          <!-- Grillete del candado cerrado -->
          <path d="M -5,-2 L -5,-10 A 5,5 0 0,1 5,-10 L 5,-2" fill="none" stroke="#94A3B8" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="0" cy="4" r="2" fill="#000000"/>
        </g>
        <!-- Etiqueta: '5 MIN' -->
        <rect x="-18" y="-9" width="36" height="6" rx="1.5" fill="#22C55E"/>
        <text x="0" y="-4.5" text-anchor="middle" fill="#FFFFFF" font-size="4.5" font-weight="900" font-family="'Arial Black'">BLOQUEADO 5M</text>
      </g>`;
    },
    tags: ["caja", "candado", "bloqueo", "friccion", "telefono", "concentracion", "seguridad"],
  },
  reloj_arena_cinco_minutos: {
    id: "reloj_arena_cinco_minutos",
    name: "Reloj de Arena Azul de 5 Minutos",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -16,-20 L 16,-20 L 2,0 L 16,20 L -16,20 L -2,0 Z" fill="#E0F2FE" stroke="${S}" stroke-width="3.5"/><rect x="-18" y="-24" width="36" height="6" fill="#78350F"/><rect x="-18" y="20" width="36" height="6" fill="#78350F"/>`,
    animatedSvg: (f: number) => {
      const sandTrickle = (f * 2) % 10;
      return `<g>
        <!-- Bases de madera noble -->
        <rect x="-20" y="-24" width="40" height="7" rx="2" fill="#78350F" stroke="${S}" stroke-width="3.5"/>
        <rect x="-20" y="19" width="40" height="7" rx="2" fill="#78350F" stroke="${S}" stroke-width="3.5"/>
        <!-- Columnas laterales de latón -->
        <line x1="-16" y1="-18" x2="-16" y2="20" stroke="#F59E0B" stroke-width="3"/>
        <line x1="16" y1="-18" x2="16" y2="20" stroke="#F59E0B" stroke-width="3"/>
        <!-- Bulbo de cristal con arena azul -->
        <path d="M -14,-17 L 14,-17 L 3,0 L 14,18 L -14,18 L -3,0 Z" fill="#E0F2FE" fill-opacity="0.85" stroke="${S}" stroke-width="3.5"/>
        <!-- Arena superior decreciendo -->
        <polygon points="-11,-16 11,-16 2,-2 -2,-2" fill="#0284C7"/>
        <!-- Hilo fino de arena cayendo -->
        <line x1="0" y1="-2" x2="0" y2="12" stroke="#0284C7" stroke-width="2" stroke-dasharray="2 1"/>
        <!-- Arena acumulada abajo -->
        <polygon points="-11,17 11,17 7,10 -7,10" fill="#0284C7"/>
        <!-- Etiqueta dorada: 5 MIN -->
        <rect x="-12" y="27" width="24" height="7" rx="1.5" fill="#F59E0B" stroke="${S}" stroke-width="1.5"/>
        <text x="0" y="32.5" text-anchor="middle" fill="#FFFFFF" font-size="5" font-weight="900" font-family="'Arial Black'">5 MIN</text>
      </g>`;
    },
    tags: ["reloj", "arena", "5_minutos", "regla", "tiempo", "concentracion", "inicio"],
  },
  capsula_placebo_roja_blanca: {
    id: "capsula_placebo_roja_blanca",
    name: "Cápsula Placebo Bicolor Roja y Blanca",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<g transform="rotate(-30)"><rect x="-14" y="-30" width="28" height="30" rx="14" fill="#EF4444" stroke="${S}" stroke-width="4"/><rect x="-14" y="0" width="28" height="30" rx="14" fill="#FFFFFF" stroke="${S}" stroke-width="4"/><line x1="-14" y1="0" x2="14" y2="0" stroke="${S}" stroke-width="3.5"/></g>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isActive = currentState === "activacion_neural" || (currentState === undefined && f >= 75);
      const bob = Math.sin(f * 0.16) * 3;
      const glow = 0.75 + Math.sin(f * 0.22) * 0.25;
      const splitOffset = isActive ? 4 + Math.sin(f * 0.2) * 1.5 : 0;
      return `<g transform="translate(0, ${bob.toFixed(1)}) scale(1.65)">
        <!-- Aura resplandeciente de alivio -->
        <circle cx="0" cy="0" r="${isActive ? 38 : 30}" fill="${isActive ? "#FACC15" : "#38BDF8"}" fill-opacity="${(glow * 0.3).toFixed(2)}"/>
        <!-- Cápsula inclinada -->
        <g transform="rotate(-28)">
          <!-- Mitad superior roja brillante -->
          <path d="M -15,${(-splitOffset).toFixed(1)} L -15,${(-15 - splitOffset).toFixed(1)} A 15,15 0 0,1 15,${(-15 - splitOffset).toFixed(1)} L 15,${(-splitOffset).toFixed(1)} Z" fill="#EF4444" stroke="${S}" stroke-width="4"/>
          <path d="M -9,${(-20 - splitOffset).toFixed(1)} A 9,9 0 0,1 3,${(-25 - splitOffset).toFixed(1)}" fill="none" stroke="#FCA5A5" stroke-width="3" stroke-linecap="round"/>
          <!-- Mitad inferior blanca clínica -->
          <path d="M -15,${splitOffset.toFixed(1)} L -15,${(15 + splitOffset).toFixed(1)} A 15,15 0 0,0 15,${(15 + splitOffset).toFixed(1)} L 15,${splitOffset.toFixed(1)} Z" fill="#FFFFFF" stroke="${S}" stroke-width="4"/>
          <!-- Destellos dorados saliendo del interior cuando se activa -->
          ${isActive ? `<circle cx="0" cy="0" r="6" fill="#FFE600" stroke="${S}" stroke-width="2.5"/>` : `<line x1="-15" y1="0" x2="15" y2="0" stroke="${S}" stroke-width="3.5"/>`}
        </g>
        <!-- Chispas bioeléctricas alrededor -->
        <circle cx="${(22 + Math.cos(f * 0.2) * 4).toFixed(1)}" cy="${(-18 + Math.sin(f * 0.2) * 4).toFixed(1)}" r="3.5" fill="#FFE600" stroke="${S}" stroke-width="2"/>
        <circle cx="${(-20 + Math.sin(f * 0.25) * 4).toFixed(1)}" cy="${(16 + Math.cos(f * 0.25) * 4).toFixed(1)}" r="3" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
      </g>`;
    },
    tags: ["capsula", "pastilla", "placebo", "medicina", "cura", "farmacia", "alivio", "roja_blanca"],
  },
  vaso_agua_fresca: {
    id: "vaso_agua_fresca",
    name: "Vaso de Agua Fresca Transparente",
    family: "vida_cotidiana",
    defaultPlacement: "left",
    svg: `<path d="M -14,-22 L 14,-22 L 10,24 L -10,24 Z" fill="#E0F2FE" stroke="${S}" stroke-width="3.5"/><path d="M -12,-8 L 12,-8 L 9,22 L -9,22 Z" fill="#38BDF8"/>`,
    animatedSvg: (f: number) => {
      const wave = Math.sin(f * 0.2) * 2;
      const b1 = (-16 + (f * 1.5) % 30);
      return `<g>
        <path d="M -16,-24 L 16,-24 L 11,26 L -11,26 Z" fill="#F0F9FF" fill-opacity="0.5" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
        <path d="M -14,${(-8 + wave).toFixed(1)} Q 0,${(-6 - wave).toFixed(1)} 14,${(-8 + wave).toFixed(1)} L 10,24 L -10,24 Z" fill="#38BDF8" fill-opacity="0.85"/>
        <circle cx="-3" cy="${b1.toFixed(1)}" r="2" fill="#FFFFFF" fill-opacity="0.8"/>
        <circle cx="4" cy="${((-b1 + 6) % 28).toFixed(1)}" r="1.5" fill="#FFFFFF" fill-opacity="0.8"/>
        <line x1="-12" y1="-20" x2="-8" y2="20" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.9"/>
      </g>`;
    },
    tags: ["vaso", "agua", "beber", "tragar", "pastilla", "cristal", "clinico"],
  },
  frasco_azucar_100_glucosa: {
    id: "frasco_azucar_100_glucosa",
    name: "Frasco Clínico de Terrones de Azúcar y Cápsulas Placebo",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-30" width="48" height="60" rx="8" fill="#FFFFFF" stroke="${S}" stroke-width="4"/><rect x="-18" y="-12" width="36" height="30" fill="#FFE600" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isRevealed = currentState === "revelado_azucar" || (currentState === undefined && f >= 60);
      const shake = Math.sin(f * 0.18) * 2;
      return `<g transform="translate(0, ${shake.toFixed(1)}) scale(1.55)">
        <!-- Cuerpo del frasco farmacéutico -->
        <rect x="-26" y="-32" width="52" height="66" rx="9" fill="#F8FAFC" stroke="${S}" stroke-width="4.5"/>
        <!-- Tapa rosca de seguridad médica -->
        <rect x="-18" y="-42" width="36" height="12" rx="3" fill="#0EA5E9" stroke="${S}" stroke-width="3.5"/>
        <line x1="-10" y1="-42" x2="-10" y2="-30" stroke="${S}" stroke-width="2.5"/>
        <line x1="0" y1="-42" x2="0" y2="-30" stroke="${S}" stroke-width="2.5"/>
        <line x1="10" y1="-42" x2="10" y2="-30" stroke="${S}" stroke-width="2.5"/>
        <!-- Etiqueta visual con terrones de azúcar cristalinos -->
        <rect x="-21" y="-18" width="42" height="34" rx="4" fill="${isRevealed ? "#FFE600" : "#E0F2FE"}" stroke="${S}" stroke-width="3.5"/>
        <!-- Tres cubos de azúcar neo-brutalistas en lugar de texto pequeño -->
        <rect x="-14" y="-8" width="12" height="12" rx="2" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
        <rect x="2" y="-6" width="12" height="12" rx="2" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
        <rect x="-6" y="-15" width="12" height="12" rx="2" fill="#F8FAFC" stroke="${S}" stroke-width="3"/>
        <!-- Cruz médica superior -->
        <path d="M -4,-26 H 4 M 0,-30 V -22" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
      </g>`;
    },
    tags: ["frasco", "azucar", "glucosa", "placebo", "100%", "medicina", "engaño", "revelacion"],
  },
  caja_placebo_etiqueta_abierta: {
    id: "caja_placebo_etiqueta_abierta",
    name: "Blíster Transparente de Placebo Abierto con Cubos de Azúcar",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-28" y="-20" width="56" height="40" rx="6" fill="#ECFDF5" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isGlow = currentState === "efecto_activo" || (currentState === undefined && f >= 60);
      const pulse = 1 + Math.sin(f * 0.16) * 0.04;
      return `<g transform="scale(${(pulse * 1.55).toFixed(3)})">
        <!-- Caja clínica abierta transparente -->
        <rect x="-30" y="-22" width="60" height="44" rx="7" fill="#ECFDF5" stroke="${S}" stroke-width="4.5"/>
        <rect x="-26" y="-18" width="52" height="10" rx="3" fill="#10B981" stroke="${S}" stroke-width="2.5"/>
        <!-- Blíster mostrando cápsulas mitad rojas y mitad terrón de azúcar visible -->
        <g transform="translate(-12, 4)">
          <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
          <circle cx="-3" cy="-2" r="1.5" fill="#94A3B8"/>
          <circle cx="3" cy="3" r="1.5" fill="#94A3B8"/>
        </g>
        <g transform="translate(12, 4)">
          <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
          <path d="M -5,1 L -1,5 L 6,-4" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        ${isGlow ? `<circle cx="0" cy="0" r="34" fill="none" stroke="#FACC15" stroke-width="3.5" stroke-dasharray="6,5"/>` : ""}
      </g>`;
    },
    tags: ["caja", "placebo_abierto", "honesto", "azucar", "etiqueta_abierta", "experimento", "harvard"],
  },
  candado_dorado_receptor_dolor: {
    id: "candado_dorado_receptor_dolor",
    name: "Candado Dorado Bloqueando Receptor de Dolor",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M -16,14 L 0,-8 L 16,14 Z" fill="#991B1B" stroke="${S}" stroke-width="3"/><rect x="-10" y="-4" width="20" height="18" rx="3" fill="#F59E0B" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      return `<g>
        <path d="M -18,-18 L -6,-2 L -6,22 M 18,-18 L 6,-2 L 6,22" fill="none" stroke="#991B1B" stroke-width="6" stroke-linecap="round"/>
        <g transform="translate(0, -6)">
          <path d="M -7,0 L -7,-10 A 7,7 0 0,1 7,-10 L 7,0" fill="none" stroke="#FDE047" stroke-width="4.5" stroke-linecap="round"/>
          <rect x="-12" y="0" width="24" height="20" rx="4" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
          <circle cx="0" cy="8" r="3" fill="#78350F"/>
          <polygon points="0,8 -1.5,14 1.5,14" fill="#78350F"/>
        </g>
      </g>`;
    },
    tags: ["candado", "receptor", "dolor", "bloqueo", "endorfina", "opioide", "celular", "farmacia_interna"],
  },
  esferas_endorfinas_flotantes: {
    id: "esferas_endorfinas_flotantes",
    name: "Moléculas Doradas de Endorfinas y Opioides Naturales",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="-12" cy="0" r="10" fill="#FACC15" stroke="${S}" stroke-width="3"/><circle cx="12" cy="-4" r="12" fill="#FACC15" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const o1 = Math.sin(f * 0.18) * 3.5;
      const o2 = Math.cos(f * 0.16) * 3.5;
      return `<g transform="scale(1.65)">
        <!-- Enlaces químicos brillantes entre las esferas de endorfinas -->
        <line x1="${(0 + o1).toFixed(1)}" y1="${(-4 + o2).toFixed(1)}" x2="${(-20 - o2).toFixed(1)}" y2="${(12 + o1).toFixed(1)}" stroke="#FEF08A" stroke-width="4"/>
        <line x1="${(0 + o1).toFixed(1)}" y1="${(-4 + o2).toFixed(1)}" x2="${(22 + o2).toFixed(1)}" y2="${(-16 - o1).toFixed(1)}" stroke="#FEF08A" stroke-width="4"/>
        <!-- Esfera 1 (Principal dorada con escudo médico) -->
        <g transform="translate(${(0 + o1).toFixed(1)}, ${(-4 + o2).toFixed(1)})">
          <circle cx="0" cy="0" r="16" fill="#FACC15" stroke="${S}" stroke-width="4"/>
          <circle cx="-5" cy="-5" r="5" fill="#FEF08A"/>
          <path d="M -5,0 H 5 M 0,-5 V 5" stroke="#78350F" stroke-width="3.5" stroke-linecap="round"/>
        </g>
        <!-- Esfera 2 (Izquierda inferior) -->
        <g transform="translate(${(-20 - o2).toFixed(1)}, ${(12 + o1).toFixed(1)})">
          <circle cx="0" cy="0" r="11" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
          <circle cx="-3" cy="-3" r="3.5" fill="#FEF08A"/>
        </g>
        <!-- Esfera 3 (Derecha superior) -->
        <g transform="translate(${(22 + o2).toFixed(1)}, ${(-16 - o1).toFixed(1)})">
          <circle cx="0" cy="0" r="10" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/>
          <circle cx="-3" cy="-3" r="3" fill="#E0F2FE"/>
        </g>
      </g>`;
    },
    tags: ["endorfinas", "opioides", "dopamina", "neuroquimica", "cerebro", "oro", "moleculas", "alivio"],
  },
  manivela_valvula_farmacia_interna: {
    id: "manivela_valvula_farmacia_interna",
    name: "Válvula Dorada de Liberación de Endorfinas",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="18" fill="none" stroke="#F59E0B" stroke-width="6"/><circle cx="0" cy="0" r="5" fill="#1E293B"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isOpen = currentState === "abierta_liberando" || (currentState === undefined && f >= 60);
      const rot = (f * (isOpen ? 5.5 : 2.5)) % 360;
      return `<g transform="scale(1.55)">
        <!-- Tubería dorada industrial detrás -->
        <rect x="-30" y="-6" width="60" height="12" rx="3" fill="#B45309" stroke="${S}" stroke-width="3.5"/>
        <!-- Rueda / Manivela giratoria -->
        <g transform="rotate(${rot.toFixed(1)} 0 0)">
          <circle cx="0" cy="0" r="22" fill="none" stroke="#F59E0B" stroke-width="6"/>
          <circle cx="0" cy="0" r="22" fill="none" stroke="${S}" stroke-width="2"/>
          <line x1="-22" y1="0" x2="22" y2="0" stroke="#F59E0B" stroke-width="5"/>
          <line x1="0" y1="-22" x2="0" y2="22" stroke="#F59E0B" stroke-width="5"/>
          <circle cx="0" cy="0" r="7" fill="#78350F" stroke="${S}" stroke-width="3"/>
          <circle cx="0" cy="0" r="3" fill="#FDE68A"/>
        </g>
        <!-- Manómetro superior de presión analgésica -->
        <g transform="translate(0, -28)">
          <circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/>
          <line x1="0" y1="0" x2="${isOpen ? 7 : -6}" y2="-5" stroke="${isOpen ? "#22C55E" : "#EF4444"}" stroke-width="3" stroke-linecap="round"/>
        </g>
      </g>`;
    },
    tags: ["valvula", "manivela", "farmacia_interna", "control", "abrir", "flujo", "tronco_encefalico"],
  },
  rayo_dolor_cabeza: {
    id: "rayo_dolor_cabeza",
    name: "Rayo de Dolor que se Transforma en Alivio",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<polygon points="-12,-20 6,-6 -2,-4 14,16 -4,2 2,0" fill="#EF4444" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isRelief = currentState === "alivio_azul" || (currentState === undefined && f >= 90);
      const flash = Math.sin(f * 0.28) > 0;
      const throb = 1 + Math.sin(f * 0.22) * 0.12;
      return `<g transform="scale(${(throb * 1.55).toFixed(2)})">
        <circle cx="0" cy="0" r="${(18 + Math.sin(f * 0.22) * 4).toFixed(1)}" fill="none" stroke="${isRelief ? "#22C55E" : "#DC2626"}" stroke-width="3" stroke-dasharray="4 3"/>
        <polygon points="-8,-24 8,-6 -2,-4 16,18 -4,2 4,0" fill="${isRelief ? "#38BDF8" : (flash ? "#EF4444" : "#FFE600")}" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
      </g>`;
    },
    tags: ["dolor", "cabeza", "jaqueca", "migraña", "rayo", "pulsante", "sintoma"],
  },
  monitor_presion_arterial_hud: {
    id: "monitor_presion_arterial_hud",
    name: "Monitor Clínico de Ritmo Cardíaco y Presión Estable",
    family: "tecnologia",
    defaultPlacement: "left",
    svg: `<rect x="-28" y="-18" width="56" height="36" rx="5" fill="#0F172A" stroke="${S}" stroke-width="4"/><polyline points="-22,0 -10,0 -6,-10 0,10 6,-4 10,0 22,0" fill="none" stroke="#22C55E" stroke-width="3"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const pulse = 1 + Math.sin(f * 0.22) * 0.08;
      return `<g transform="scale(1.6)">
        <!-- Pantalla médica oscura -->
        <rect x="-30" y="-20" width="60" height="40" rx="6" fill="#090D16" stroke="${S}" stroke-width="4.5"/>
        <!-- Trazado ECG verde brillante -->
        <polyline points="-24,4 -12,4 -8,-8 -2,12 4,-6 10,4 24,4" fill="none" stroke="#22C55E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Corazón verde pulsante en esquina -->
        <g transform="translate(-18, -10) scale(${pulse.toFixed(2)})">
          <circle cx="0" cy="0" r="5" fill="#22C55E"/>
        </g>
        <!-- Barra de presión arterial estable -->
        <rect x="-6" y="-13" width="28" height="6" rx="3" fill="#38BDF8"/>
      </g>`;
    },
    tags: ["monitor", "presion_arterial", "ecg", "cardiaco", "estable", "clinica", "salud"],
  },
  vaso_cafe_carton_salpicadura: {
    id: "vaso_cafe_carton_salpicadura",
    name: "Vaso de Café con Salpicadura de Gota",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<path d="M -12,-20 L 12,-20 L 9,22 L -9,22 Z" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/><rect x="-11" y="-6" width="22" height="16" fill="#D97706"/><circle cx="16" cy="-14" r="4" fill="#78350F"/>`,
    animatedSvg: (f: number) => {
      const wobble = Math.sin(f * 0.25) * 6;
      const dripY = -18 - Math.abs(Math.sin(f * 0.2)) * 12;
      return `<g transform="rotate(${wobble.toFixed(1)} 0 20)">
        <!-- Vaso de cartón blanco -->
        <path d="M -14,-22 L 14,-22 L 10,24 L -10,24 Z" fill="#FFFFFF" stroke="${S}" stroke-width="4"/>
        <!-- Faja aislante marrón -->
        <path d="M -13,-6 L 13,-6 L 11,12 L -11,12 Z" fill="#B45309" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="5" text-anchor="middle" fill="#FEF3C7" font-size="5" font-weight="900">CAFÉ</text>
        <!-- Tapa de plástico blanco -->
        <rect x="-16" y="-28" width="32" height="7" rx="2" fill="#F1F5F9" stroke="${S}" stroke-width="3"/>
        <rect x="8" y="-31" width="5" height="4" fill="#000000"/>
        <!-- Gotas de café salpicando en el aire -->
        <circle cx="16" cy="${dripY.toFixed(1)}" r="4.5" fill="#78350F" stroke="${S}" stroke-width="2"/>
        <circle cx="22" cy="${(dripY + 8).toFixed(1)}" r="2.5" fill="#78350F"/>
        <!-- Gota cayendo hacia la camisa -->
        <circle cx="-16" cy="${(-dripY * 0.8).toFixed(1)}" r="3" fill="#78350F" stroke="${S}" stroke-width="1.5"/>
      </g>`;
    },
    tags: ["cafe", "vaso", "tropiezo", "salpicadura", "mancha", "accidente", "descuido"],
  },
  casco_minero_linterna_foco: {
    id: "casco_minero_linterna_foco",
    name: "Casco con Reflector Gigante Integrado",
    family: "herramientas_objetos",
    defaultPlacement: "overhead",
    svg: `<path d="M -22,0 A 22,20 0 0,1 22,0 Z" fill="#FACC15" stroke="${S}" stroke-width="4"/><circle cx="0" cy="-12" r="10" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const beamGlow = 0.6 + Math.sin(f * 0.2) * 0.35;
      return `<g>
        <!-- Casco amarillo de seguridad -->
        <path d="M -24,4 A 24,20 0 0,1 24,4 Z" fill="#FACC15" stroke="${S}" stroke-width="4"/>
        <rect x="-28" y="2" width="56" height="6" rx="2" fill="#EAB308" stroke="${S}" stroke-width="3"/>
        <!-- Lámpara / Reflector frontal montado -->
        <rect x="-10" y="-18" width="20" height="16" rx="3" fill="#334155" stroke="${S}" stroke-width="3"/>
        <circle cx="0" cy="-10" r="8" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/>
        <circle cx="0" cy="-10" r="4" fill="#FEF08A"/>
        <!-- Haz de luz propio apuntando hacia abajo -->
        <polygon points="-8,-4 8,-4 36,44 -36,44" fill="#FEF08A" opacity="${beamGlow.toFixed(2)}" />
        <text x="0" y="28" text-anchor="middle" fill="#000000" font-size="4.5" font-weight="900">¡TU FOCO!</text>
      </g>`;
    },
    tags: ["casco", "linterna", "foco", "reflector", "cabeza", "egocentrismo", "percepcion"],
  },
  camiseta_barry_manilow_amarilla: {
    id: "camiseta_barry_manilow_amarilla",
    name: "Camiseta Amarilla Kitsch de Barry Manilow",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<g>
      <!-- Camiseta amarilla vistiendo el torso del Stickman -->
      <path d="M -18,0 L -52,6 L -70,46 L -48,52 L -44,138 L 44,138 L 48,52 L 70,46 L 52,6 L 18,0 Z" fill="#FDE047" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
      <!-- Cuello redondo acanalado -->
      <path d="M -18,0 Q 0,16 18,0" fill="#FEF08A" stroke="${S}" stroke-width="3.5"/>
      <!-- Sombra de costura lateral -->
      <path d="M -40,60 L -36,134" stroke="#EAB308" stroke-width="3" stroke-linecap="round"/>
      <!-- Estampado retro de Barry Manilow -->
      <text x="0" y="38" text-anchor="middle" fill="#DC2626" font-size="9" font-weight="900" font-family="'Arial Black', sans-serif" stroke="#FFFFFF" stroke-width="0.8">BARRY MANILOW</text>
      <!-- Marco del retrato estilo disco de vinilo/poster 70s -->
      <rect x="-22" y="44" width="44" height="46" rx="6" fill="#F43F5E" stroke="${S}" stroke-width="2.5"/>
      <!-- Melena setentera rubia abultada -->
      <path d="M -18,66 Q -20,48 0,47 Q 20,48 18,66 Q 14,53 0,52 Q -14,53 -18,66 Z" fill="#FBBF24" stroke="${S}" stroke-width="1.8"/>
      <!-- Rostro sonriente -->
      <circle cx="0" cy="66" r="12" fill="#FED7AA" stroke="${S}" stroke-width="1.8"/>
      <!-- Mechones rubios con volumen -->
      <path d="M -14,60 Q -17,52 -6,50 Q 0,49 6,50 Q 17,52 14,60 Q 10,54 0,53 Q -10,54 -14,60 Z" fill="#FDE047"/>
      <!-- Ojos sonrientes -->
      <path d="M -6,64 Q -4,61 -2,64" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M 2,64 Q 4,61 6,64" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Sonrisa gigante con dientes brillantes -->
      <path d="M -7,71 Q 0,80 7,71 Z" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
      <line x1="0" y1="72" x2="0" y2="76" stroke="#E2E8F0" stroke-width="1"/>
      <!-- Destello popstar -->
      <polygon points="14,50 15,53 18,54 15,55 14,58 13,55 10,54 13,53" fill="#FFFFFF"/>
      <text x="-14" y="56" fill="#FFFFFF" font-size="7" font-weight="900">♪</text>
      <!-- Texto inferior del éxito musical -->
      <text x="0" y="104" text-anchor="middle" fill="#000000" font-size="7.5" font-weight="900" font-family="'Arial Black', sans-serif">«MANDY»</text>
      <text x="0" y="116" text-anchor="middle" fill="#991B1B" font-size="6" font-weight="900">COPACABANA</text>
    </g>`,
    animatedSvg: (f: number) => {
      const breath = Math.sin(f * 0.15) * 1.5;
      const wink = Math.floor(f / 25) % 2 === 0;
      return `<g transform="translate(0, ${breath.toFixed(1)})">
        <!-- Camiseta amarilla estridente cubriendo el torso -->
        <path d="M -18,0 L -52,6 L -70,46 L -48,52 L -44,138 L 44,138 L 48,52 L 70,46 L 52,6 L 18,0 Z" fill="#FDE047" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Cuello acanalado -->
        <path d="M -18,0 Q 0,16 18,0" fill="#FEF08A" stroke="${S}" stroke-width="3.5"/>
        <!-- Arrugas de tela sutiles -->
        <path d="M -40,62 L -36,132" stroke="#EAB308" stroke-width="3" stroke-linecap="round"/>
        <path d="M 40,62 L 36,132" stroke="#EAB308" stroke-width="3" stroke-linecap="round"/>
        <!-- Título del cantante -->
        <text x="0" y="38" text-anchor="middle" fill="#DC2626" font-size="9" font-weight="900" font-family="'Arial Black', sans-serif" stroke="#FFFFFF" stroke-width="0.8">BARRY MANILOW</text>
        <!-- Marco del retrato retro -->
        <rect x="-22" y="44" width="44" height="46" rx="6" fill="#F43F5E" stroke="${S}" stroke-width="2.5"/>
        <!-- Cabellera voluminosa setentera rubia -->
        <path d="M -18,66 Q -20,48 0,47 Q 20,48 18,66 Q 14,53 0,52 Q -14,53 -18,66 Z" fill="#FBBF24" stroke="${S}" stroke-width="1.8"/>
        <!-- Rostro sonriente de Barry Manilow -->
        <circle cx="0" cy="66" r="12" fill="#FED7AA" stroke="${S}" stroke-width="1.8"/>
        <path d="M -14,60 Q -17,52 -6,50 Q 0,49 6,50 Q 17,52 14,60 Q 10,54 0,53 Q -10,54 -14,60 Z" fill="#FDE047"/>
        <!-- Ojos sonrientes/guiño cómico -->
        <path d="M -6,64 Q -4,61 -2,64" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/>
        ${wink
          ? `<path d="M 2,64 Q 4,61 6,64" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/>`
          : `<line x1="2" y1="64" x2="6" y2="64" stroke="${S}" stroke-width="2" stroke-linecap="round"/>`}
        <!-- Sonrisa radiante con dientes -->
        <path d="M -7,71 Q 0,80 7,71 Z" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
        <line x1="0" y1="72" x2="0" y2="76" stroke="#E2E8F0" stroke-width="1"/>
        <!-- Destello brillante de estrella de pop -->
        <polygon points="14,50 15,53 18,54 15,55 14,58 13,55 10,54 13,53" fill="#FFFFFF"/>
        <text x="-14" y="56" fill="#FFFFFF" font-size="7" font-weight="900">♪</text>
        <!-- Canciones icónicas de los 70 -->
        <text x="0" y="104" text-anchor="middle" fill="#000000" font-size="7.5" font-weight="900" font-family="'Arial Black', sans-serif">«MANDY»</text>
        <text x="0" y="116" text-anchor="middle" fill="#991B1B" font-size="6" font-weight="900">COPACABANA</text>
      </g>`;
    },
    tags: ["camiseta", "amarilla", "barry_manilow", "vergonzosa", "kitsch", "experimento", "cornell"],
  },
  carpeta_escolar_universidad: {
    id: "carpeta_escolar_universidad",
    name: "Carpeta Manila de Estudiante Universitario",
    family: "educacion_ciencia",
    defaultPlacement: "left",
    svg: `<rect x="-20" y="-16" width="40" height="32" rx="3" fill="#FBBF24" stroke="${S}" stroke-width="3.5"/><polygon points="-20,-16 -10,-16 -6,-11 20,-11 20,16 -20,16" fill="#F59E0B"/>`,
    animatedSvg: (f: number) => {
      const shake = Math.sin(f * 0.3) * 1.5;
      return `<g transform="rotate(${shake.toFixed(1)} 0 16)">
        <!-- Carpeta de cartón manila clásica -->
        <rect x="-22" y="-18" width="44" height="36" rx="3" fill="#FBBF24" stroke="${S}" stroke-width="4"/>
        <!-- Pestaña superior de archivador -->
        <polygon points="-22,-18 -10,-18 -6,-12 22,-12 22,18 -22,18" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
        <!-- Hojas blancas asomando -->
        <line x1="-16" y1="-8" x2="16" y2="-8" stroke="#FFFFFF" stroke-width="2"/>
        <line x1="-16" y1="-2" x2="12" y2="-2" stroke="#FFFFFF" stroke-width="2"/>
        <!-- Sello universitario Cornell -->
        <circle cx="10" cy="6" r="6" fill="#DC2626"/>
        <text x="10" y="8" text-anchor="middle" fill="#FFFFFF" font-size="4" font-weight="900">U</text>
      </g>`;
    },
    tags: ["carpeta", "universidad", "cornell", "tapar", "pecho", "estudiante", "manila"],
  },
  grafico_pastel_50_vs_23: {
    id: "grafico_pastel_50_vs_23",
    name: "Gráfica Comparativa 50% Paranoia vs 23% Realidad",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="-14" cy="0" r="14" fill="#EF4444" stroke="${S}" stroke-width="3"/><circle cx="14" cy="0" r="14" fill="#22C55E" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const pulse = 1 + Math.sin(f * 0.15) * 0.04;
      return `<g transform="scale(${pulse.toFixed(3)})">
        <!-- Gráfico izquierdo: 50% PENSADO (Rojo) -->
        <g transform="translate(-20, 0)">
          <circle cx="0" cy="0" r="16" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
          <!-- Mitad roja (50%) -->
          <path d="M 0,-16 A 16,16 0 0,1 0,16 Z" fill="#EF4444"/>
          <text x="0" y="4" text-anchor="middle" fill="#FFFFFF" font-size="6.5" font-weight="900" font-family="'Arial Black'">50%</text>
          <text x="0" y="24" text-anchor="middle" fill="#EF4444" font-size="5" font-weight="900">CREÍAN</text>
        </g>
        <!-- Gráfico derecho: 23% REAL (Verde) -->
        <g transform="translate(20, 0)">
          <circle cx="0" cy="0" r="16" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
          <!-- Rebanada verde del 23% -->
          <path d="M 0,-16 A 16,16 0 0,1 15,-5 L 0,0 Z" fill="#22C55E"/>
          <text x="0" y="4" text-anchor="middle" fill="#FFFFFF" font-size="6.5" font-weight="900" font-family="'Arial Black'">23%</text>
          <text x="0" y="24" text-anchor="middle" fill="#22C55E" font-size="5" font-weight="900">REAL</text>
        </g>
      </g>`;
    },
    tags: ["grafico", "pastel", "50%", "23%", "estadistica", "cornell", "gilovich", "realidad"],
  },
  lentes_3d_cine_palomitas: {
    id: "lentes_3d_cine_palomitas",
    name: "Lentes 3D Retro y Bote de Palomitas",
    family: "vida_cotidiana",
    defaultPlacement: "left",
    svg: `<rect x="-18" y="-10" width="16" height="12" fill="#EF4444" stroke="${S}" stroke-width="3"/><rect x="2" y="-10" width="16" height="12" fill="#0EA5E9" stroke="${S}" stroke-width="3"/><path d="M -12,4 L 12,4 L 9,24 L -9,24 Z" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const crunch = Math.sin(f * 0.2) > 0.7;
      return `<g>
        <!-- Bote de palomitas a rayas rojas y blancas -->
        <g transform="translate(0, 8)">
          <path d="M -14,-4 L 14,-4 L 10,22 L -10,22 Z" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/>
          <line x1="-5" y1="-4" x2="-3" y2="22" stroke="#EF4444" stroke-width="4"/>
          <line x1="5" y1="-4" x2="3" y2="22" stroke="#EF4444" stroke-width="4"/>
          <!-- Palomitas doradas arriba -->
          <circle cx="-6" cy="-8" r="4.5" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
          <circle cx="0" cy="-10" r="5" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
          <circle cx="6" cy="-8" r="4.5" fill="#FEF08A" stroke="${S}" stroke-width="1.5"/>
        </g>
        <!-- Gafas 3D anaglifo (Rojo / Cyan) -->
        <g transform="translate(0, -18)">
          <rect x="-18" y="-7" width="16" height="14" rx="2" fill="#EF4444" stroke="${S}" stroke-width="3"/>
          <rect x="2" y="-7" width="16" height="14" rx="2" fill="#06B6D4" stroke="${S}" stroke-width="3"/>
          <line x1="-2" y1="0" x2="2" y2="0" stroke="${S}" stroke-width="3.5"/>
          <line x1="-22" y1="-2" x2="-18" y2="-2" stroke="${S}" stroke-width="3"/>
          <line x1="18" y1="-2" x2="22" y2="-2" stroke="${S}" stroke-width="3"/>
        </g>
      </g>`;
    },
    tags: ["cine", "lentes_3d", "palomitas", "protagonista", "pelicula", "propia_vida", "butaca"],
  },
  nube_inseguridad_grano: {
    id: "nube_inseguridad_grano",
    name: "Bocadillo de Pensamiento: Preocupación Cotidiana",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<ellipse cx="0" cy="0" rx="22" ry="16" fill="#FFFFFF" stroke="${S}" stroke-width="3.5"/><circle cx="0" cy="0" r="6" fill="#EF4444"/>`,
    animatedSvg: (f: number) => {
      const floatY = Math.sin(f * 0.18) * 3;
      return `<g transform="translate(0, ${floatY.toFixed(1)})">
        <!-- Nube de pensamiento estilo historieta -->
        <ellipse cx="0" cy="-6" rx="26" ry="18" fill="#FFFFFF" stroke="${S}" stroke-width="4"/>
        <circle cx="-16" cy="-16" r="9" fill="#FFFFFF"/>
        <circle cx="16" cy="-16" r="9" fill="#FFFFFF"/>
        <circle cx="0" cy="18" r="4" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/>
        <circle cx="-6" cy="28" r="2.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
        <!-- Contenido cómico: grano rojo en la nariz con alerta -->
        <circle cx="0" cy="-8" r="7" fill="#EF4444" stroke="${S}" stroke-width="2"/>
        <circle cx="-2" cy="-10" r="2" fill="#FEF08A"/>
        <text x="0" y="3" text-anchor="middle" fill="#DC2626" font-size="5" font-weight="900" font-family="'Arial Black'">¡MI GRANO!</text>
      </g>`;
    },
    tags: ["pensamiento", "inseguridad", "grano", "drama", "multitud", "absorto", "preocupacion"],
  },
  interruptor_palanca_industrial: {
    id: "interruptor_palanca_industrial",
    name: "Interruptor Eléctrico de Palanca Industrial",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-14" y="-20" width="28" height="40" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/><line x1="0" y1="0" x2="16" y2="16" stroke="#EF4444" stroke-width="5"/>`,
    animatedSvg: (f: number) => {
      const clickState = Math.sin(f * 0.2) > 0;
      return `<g>
        <!-- Caja metálica industrial de pared -->
        <rect x="-16" y="-22" width="32" height="44" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/>
        <circle cx="0" cy="-14" r="3" fill="#DC2626"/>
        <circle cx="0" cy="14" r="3" fill="#22C55E"/>
        <!-- Ranura central -->
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#000000" stroke-width="4"/>
        <!-- Palanca roja girada a posición OFF (abajo) -->
        <line x1="0" y1="0" x2="18" y2="16" stroke="#DC2626" stroke-width="6" stroke-linecap="round"/>
        <circle cx="18" cy="16" r="6" fill="#EF4444" stroke="${S}" stroke-width="2.5"/>
        <!-- Rótulo OFF -->
        <text x="-8" y="2" text-anchor="middle" fill="#FFFFFF" font-size="4.5" font-weight="900">OFF</text>
      </g>`;
    },
    tags: ["interruptor", "palanca", "apagar", "foco", "libertad", "clac", "off"],
  },
  gallina_sostenida_giroscopica: {
    id: "gallina_sostenida_giroscopica",
    name: "Gallina con Estabilizador Giroscópico Activo",
    family: "naturaleza_alimentos",
    defaultPlacement: "both",
    svg: `<ellipse cx="0" cy="8" rx="20" ry="16" fill="#F59E0B" stroke="${S}" stroke-width="4"/><circle cx="-14" cy="-8" r="10" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/><polygon points="-24,-8 -18,-5 -18,-11" fill="#FDE047" stroke="${S}" stroke-width="2.5"/><polygon points="-16,-18 -12,-16 -14,-12" fill="#EF4444" stroke="${S}" stroke-width="2"/>`,
    animatedSvg: (f: number) => {
      // El cuerpo oscila en X e Y simulando que Stickman lo mueve
      const bodyBobY = Math.sin(f * 0.22) * 5;
      const bodySwayX = Math.cos(f * 0.18) * 6;
      const bodyRot = Math.sin(f * 0.18) * 8;
      // Pero la cabeza se mantiene perfectamente compensada en la coordenada fija
      const compHeadX = -bodySwayX * 0.85;
      const compHeadY = -bodyBobY * 0.85;
      return `<g transform="scale(2.4) translate(12, 2)">
        <!-- Retícula HUD de calibración óptica fija en el centro de la cabeza -->
        <circle cx="-14" cy="-10" r="18" fill="none" stroke="#06B6D4" stroke-width="2" stroke-dasharray="4 3" opacity="0.85"/>
        <line x1="-36" y1="-10" x2="8" y2="-10" stroke="#06B6D4" stroke-width="1.8" opacity="0.75"/>
        <line x1="-14" y1="-32" x2="-14" y2="12" stroke="#06B6D4" stroke-width="1.8" opacity="0.75"/>
        <text x="12" y="-24" fill="#06B6D4" font-size="5" font-weight="900" font-family="'Arial Black'">GYRO: LOCK</text>
        
        <!-- Cuerpo de la gallina que se bambolea -->
        <g transform="translate(${bodySwayX.toFixed(1)}, ${bodyBobY.toFixed(1)}) rotate(${bodyRot.toFixed(1)})">
          <!-- Patas de gallina -->
          <line x1="-6" y1="20" x2="-10" y2="30" stroke="${S}" stroke-width="3.5"/>
          <line x1="-10" y1="30" x2="-16" y2="30" stroke="${S}" stroke-width="3"/>
          <line x1="8" y1="20" x2="10" y2="30" stroke="${S}" stroke-width="3.5"/>
          <line x1="10" y1="30" x2="16" y2="30" stroke="${S}" stroke-width="3"/>
          <!-- Cola con plumas blancas y rojas -->
          <path d="M 16 0 C 26 -10, 30 8, 18 16 Z" fill="#EF4444" stroke="${S}" stroke-width="3"/>
          <!-- Torso gordo y esponjoso -->
          <ellipse cx="0" cy="10" rx="22" ry="17" fill="#F59E0B" stroke="${S}" stroke-width="4"/>
          <!-- Ala que aletea levemente -->
          <path d="M -8 8 C -2 0, 14 2, 12 18 C 4 20, -6 18, -8 8 Z" fill="#D97706" stroke="${S}" stroke-width="3.5"/>
        </g>

        <!-- Cuello elástico que conecta el cuerpo móvil a la cabeza quieta -->
        <path d="M ${(-4 + bodySwayX * 0.5).toFixed(1)} ${(2 + bodyBobY * 0.5).toFixed(1)} Q -8 -4, ${(-14 + compHeadX * 0.2).toFixed(1)} ${(-8 + compHeadY * 0.2).toFixed(1)}" fill="none" stroke="#F59E0B" stroke-width="9" stroke-linecap="round"/>

        <!-- Cabeza perfectamente estabilizada con compensación giroscópica -->
        <g transform="translate(${compHeadX.toFixed(1)}, ${compHeadY.toFixed(1)})">
          <circle cx="-14" cy="-10" r="11" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
          <!-- Pico amarillo brillante -->
          <polygon points="-25,-10 -18,-7 -18,-13" fill="#FDE047" stroke="${S}" stroke-width="2.5"/>
          <!-- Ojo circular ultra enfocado -->
          <circle cx="-15" cy="-12" r="3.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <circle cx="-16" cy="-12" r="1.5" fill="#000000"/>
          <!-- Cresta roja llamativa -->
          <path d="M -18 -20 C -22 -15, -12 -17, -10 -22 C -6 -18, -4 -21, -8 -15 Z" fill="#EF4444" stroke="${S}" stroke-width="2.5"/>
          <!-- Barbilla roja -->
          <ellipse cx="-18" cy="-5" rx="2.5" ry="4" fill="#EF4444" stroke="${S}" stroke-width="2"/>
        </g>
      </g>`;
    },
    tags: ["gallina", "giroscopio", "cabeza", "estabilizador", "ave", "steadycam", "experimento"],
  },
  globo_ocular_aviar_plano_lupa: {
    id: "globo_ocular_aviar_plano_lupa",
    name: "Comparativa Anatómica: Ojo Humano vs Ojo Plano Aviar",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="-18" cy="0" r="16" fill="#FFFFFF" stroke="${S}" stroke-width="4"/><ellipse cx="18" cy="0" rx="18" ry="11" fill="#FEF08A" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const rotHumano = Math.sin(f * 0.15) * 25;
      return `<g>
        <!-- Lado izquierdo: Ojo humano esférico que gira libremente -->
        <g transform="translate(-24, 0)">
          <circle cx="0" cy="0" r="18" fill="#FFFFFF" stroke="${S}" stroke-width="4"/>
          <!-- Iris y pupila girando con flechas de rotación -->
          <g transform="rotate(${rotHumano.toFixed(1)})">
            <circle cx="5" cy="0" r="8" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
            <circle cx="6" cy="0" r="4" fill="#000000"/>
          </g>
          <path d="M -12 -22 A 16 16 0 0 1 12 -22" fill="none" stroke="#22C55E" stroke-width="3" stroke-dasharray="3 2"/>
          <text x="0" y="30" text-anchor="middle" fill="#0284C7" font-size="5" font-weight="900" font-family="'Arial Black'">HUMANO: MÓVIL</text>
        </g>
        
        <!-- Símbolo VS central -->
        <rect x="-8" y="-8" width="16" height="16" rx="4" fill="#DC2626" stroke="${S}" stroke-width="3"/>
        <text x="0" y="3" text-anchor="middle" fill="#FFFFFF" font-size="6" font-weight="900" font-family="'Arial Black'">VS</text>

        <!-- Lado derecho: Ojo aviar plano y bloqueado en cráneo óseo -->
        <g transform="translate(24, 0)">
          <!-- Anillo óseo esclerótico rígido -->
          <ellipse cx="0" cy="0" rx="20" ry="13" fill="#CBD5E1" stroke="${S}" stroke-width="4"/>
          <!-- Globo ocular tubular/plano con fijación -->
          <ellipse cx="0" cy="0" rx="16" ry="9" fill="#FEF08A" stroke="${S}" stroke-width="3"/>
          <circle cx="2" cy="0" r="6" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
          <circle cx="2" cy="0" r="3" fill="#000000"/>
          <!-- Candado rojo de bloqueo -->
          <rect x="-4" y="-22" width="8" height="7" rx="1.5" fill="#EF4444" stroke="${S}" stroke-width="2"/>
          <path d="M -2 -22 L -2 -25 A 2 2 0 0 1 2 -25 L 2 -22" fill="none" stroke="${S}" stroke-width="2"/>
          <text x="0" y="30" text-anchor="middle" fill="#DC2626" font-size="5" font-weight="900" font-family="'Arial Black'">AVE: RÍGIDO</text>
        </g>
      </g>`;
    },
    tags: ["ojo", "anatomia", "humano", "ave", "plano", "rigido", "comparativa"],
  },
  vision_borrosa_semillas_maiz: {
    id: "vision_borrosa_semillas_maiz",
    name: "Suelo con Semillas de Maíz y Líneas de Desenfoque Cinético",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<ellipse cx="0" cy="0" rx="22" ry="14" fill="#FEF08A" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const blurShift = Math.sin(f * 0.28) * 8;
      return `<g transform="translate(${blurShift.toFixed(1)}, 0)">
        <!-- Líneas de motion blur rojas y amarillas -->
        <line x1="-35" y1="-12" x2="35" y2="-12" stroke="#EF4444" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
        <line x1="-40" y1="0" x2="40" y2="0" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
        <line x1="-30" y1="12" x2="30" y2="12" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>

        <!-- Tres granos de maíz dorados en el suelo -->
        <g transform="translate(-16, 2) rotate(15)">
          <path d="M 0 -7 C 5 -7, 6 7, 0 7 C -6 7, -5 -7, 0 -7 Z" fill="#FDE047" stroke="${S}" stroke-width="3"/>
          <circle cx="-1" cy="-2" r="1.5" fill="#FFFFFF"/>
        </g>
        <g transform="translate(0, -4) rotate(-20)">
          <path d="M 0 -8 C 6 -8, 7 8, 0 8 C -7 8, -6 -8, 0 -8 Z" fill="#F59E0B" stroke="${S}" stroke-width="3"/>
          <circle cx="-1" cy="-2" r="1.5" fill="#FFFFFF"/>
        </g>
        <g transform="translate(18, 5) rotate(35)">
          <path d="M 0 -7 C 5 -7, 6 7, 0 7 C -6 7, -5 -7, 0 -7 Z" fill="#FDE047" stroke="${S}" stroke-width="3"/>
          <circle cx="-1" cy="-2" r="1.5" fill="#FFFFFF"/>
        </g>
        <!-- Señal de ceguera / borrón -->
        <text x="0" y="24" text-anchor="middle" fill="#DC2626" font-size="5" font-weight="900" font-family="'Arial Black'">MOTION BLUR</text>
      </g>`;
    },
    tags: ["semillas", "maiz", "desenfoque", "ceguera", "suelo", "motion_blur"],
  },
  diagrama_14_vertebras_resorte: {
    id: "diagrama_14_vertebras_resorte",
    name: "Diagrama Biomecánico de 14 Vértebras Cervicales Articuladas",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-16" y="-25" width="32" height="50" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const springPhase = Math.sin(f * 0.2);
      return `<g>
        <!-- Marco de plano técnico azul oscuro -->
        <rect x="-28" y="-32" width="56" height="64" rx="5" fill="#0F172A" stroke="${S}" stroke-width="4"/>
        <line x1="-28" y1="-20" x2="28" y2="-20" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="0" y="-24" text-anchor="middle" fill="#38BDF8" font-size="4.5" font-weight="900" font-family="'Arial Black'">14 VÉRTEBRAS CERVICALES</text>

        <!-- Columna de 14 anillos/discos articulados actuando como resorte hidráulico -->
        ${Array.from({ length: 14 }).map((_, i) => {
          const y = -14 + i * 3.2 + springPhase * Math.sin(i * 0.4) * 1.5;
          const isEven = i % 2 === 0;
          return `<g transform="translate(0, ${y.toFixed(1)})">
            <rect x="-14" y="-1.2" width="28" height="2.4" rx="1.2" fill="${isEven ? "#F59E0B" : "#10B981"}" stroke="${S}" stroke-width="1.2"/>
            <circle cx="-10" cy="0" r="0.8" fill="#FFFFFF"/>
            <circle cx="10" cy="0" r="0.8" fill="#FFFFFF"/>
          </g>`;
        }).join("")}

        <!-- Puntero comparativo: 2X que jirafa -->
        <rect x="-24" y="20" width="48" height="9" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2"/>
        <text x="0" y="26.5" text-anchor="middle" fill="#FFFFFF" font-size="4" font-weight="900" font-family="'Arial Black'">¡2x MÁS QUE UNA JIRAFA (7)!</text>
      </g>`;
    },
    tags: ["vertebras", "cuello", "jirafa", "resorte", "hidraulico", "biomecanica", "diagrama"],
  },
  steadycam_gimbal_cine_auto: {
    id: "steadycam_gimbal_cine_auto",
    name: "Estabilizador Gimbal de Cine y Suspensión Activa de Auto",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-15" y="-15" width="30" height="30" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const humAngle = Math.sin(f * 0.16) * 12;
      return `<g>
        <!-- Soporte cardánico de 3 ejes girando -->
        <g transform="rotate(${humAngle.toFixed(1)})">
          <circle cx="0" cy="0" r="22" fill="none" stroke="#64748B" stroke-width="4"/>
          <ellipse cx="0" cy="0" rx="20" ry="14" fill="none" stroke="#0284C7" stroke-width="3"/>
          <!-- Cámara cinematográfica profesional centrada -->
          <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#0F172A" stroke="${S}" stroke-width="3"/>
          <rect x="7" y="-5" width="7" height="10" rx="1" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
          <circle cx="-2" cy="0" r="4" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
        </g>
        <!-- Servomotores brushless rotulados -->
        <circle cx="0" cy="-22" r="3.5" fill="#22C55E" stroke="${S}" stroke-width="2"/>
        <circle cx="22" cy="0" r="3.5" fill="#22C55E" stroke="${S}" stroke-width="2"/>
        <text x="0" y="32" text-anchor="middle" fill="#0284C7" font-size="5" font-weight="900" font-family="'Arial Black'">3-AXIS GIMBAL PRO</text>
      </g>`;
    },
    tags: ["steadycam", "gimbal", "camara", "suspension", "cine", "auto", "tecnologia"],
  },
  gallina_campeona_trofeo: {
    id: "gallina_campeona_trofeo",
    name: "Gallina Campeona con Trofeo y Gafas de Sol",
    family: "reacciones_humor",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="18" fill="#F59E0B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const bounceY = Math.abs(Math.sin(f * 0.25)) * -6;
      return `<g transform="translate(0, ${bounceY.toFixed(1)})">
        <!-- Copa de trofeo de oro brillante -->
        <path d="M -16 6 L -16 -6 C -16 -12, 16 -12, 16 -6 L 16 6 C 16 16, -16 16, -16 6 Z" fill="#FDE047" stroke="${S}" stroke-width="3.5"/>
        <rect x="-6" y="16" width="12" height="6" fill="#D97706" stroke="${S}" stroke-width="2.5"/>
        <rect x="-12" y="22" width="24" height="6" rx="2" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>
        
        <!-- Cabeza de gallina asomándose con gafas negras -->
        <circle cx="0" cy="-14" r="10" fill="#F59E0B" stroke="${S}" stroke-width="3"/>
        <polygon points="-10,-13 -4,-11 -4,-15" fill="#FDE047" stroke="${S}" stroke-width="2"/>
        <!-- Gafas de sol oscuras de crack -->
        <rect x="-7" y="-17" width="14" height="6" rx="1.5" fill="#0F172A" stroke="${S}" stroke-width="2"/>
        <line x1="0" y1="-14" x2="0" y2="-17" stroke="#FFFFFF" stroke-width="1.5"/>
        <!-- Medalla número 1 -->
        <text x="0" y="8" text-anchor="middle" fill="#000000" font-size="7" font-weight="900" font-family="'Arial Black'">#1</text>
      </g>`;
    },
    tags: ["gallina", "trofeo", "campeona", "gafas", "oro", "exito", "humor"],
  },
  gallina_cabeceo_thrust_hold: {
    id: "gallina_cabeceo_thrust_hold",
    name: "Mecánica de Caminata: Fase Empuje y Congelamiento",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<ellipse cx="0" cy="0" rx="22" ry="16" fill="#F59E0B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      // Ciclo de cabeceo de 2 fases: 0..0.4 thrust (empuje rápido), 0.4..1.0 hold (cabeza quieta en el espacio)
      const cycle = (f % 30) / 30;
      const isHold = cycle >= 0.35;
      const headX = isHold ? 8 : -14 + (cycle / 0.35) * 22;
      return `<g>
        <!-- Gráfico superior de fases de cabeceo -->
        <rect x="-30" y="-32" width="60" height="14" rx="3" fill="${isHold ? "#22C55E" : "#3B82F6"}" stroke="${S}" stroke-width="2"/>
        <text x="0" y="-23" text-anchor="middle" fill="#FFFFFF" font-size="5" font-weight="900" font-family="'Arial Black'">
          ${isHold ? "FASE 2: HOLD (0 KM/H)" : "FASE 1: THRUST"}
        </text>

        <!-- Cuerpo avanzando -->
        <g transform="translate(0, 4)">
          <ellipse cx="0" cy="0" rx="18" ry="14" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
          <line x1="-6" y1="12" x2="-8" y2="24" stroke="${S}" stroke-width="3"/>
          <line x1="6" y1="12" x2="8" y2="24" stroke="${S}" stroke-width="3"/>
        </g>

        <!-- Cabeza con posición desacoplada -->
        <g transform="translate(${headX.toFixed(1)}, -8)">
          <circle cx="0" cy="0" r="9" fill="#F59E0B" stroke="${S}" stroke-width="3"/>
          <polygon points="7,-1 13,2 7,5" fill="#FDE047" stroke="${S}" stroke-width="2"/>
          <circle cx="3" cy="-2" r="2.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
          <circle cx="3.5" cy="-2" r="1" fill="#000000"/>
          <path d="M -3 -8 C -5 -5, 2 -6, 4 -9" fill="#EF4444" stroke="${S}" stroke-width="2"/>
          {/* Mira láser de fijación retinal en fase HOLD */}
          ${isHold ? `<circle cx="3" cy="-2" r="14" fill="none" stroke="#22C55E" stroke-width="2" stroke-dasharray="3 2"/><line x1="3" y1="-20" x2="3" y2="16" stroke="#22C55E" stroke-width="1.5"/>` : ""}
        </g>
      </g>`;
    },
    tags: ["cabeceo", "thrust", "hold", "caminar", "fijacion", "retina", "gallina"],
  },
  puntero_laser_verde: {
    id: "puntero_laser_verde",
    name: "Puntero Láser Verde de Presentación",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-4" y="-12" width="8" height="24" rx="2" fill="#1E293B" stroke="${S}" stroke-width="2.5"/><line x1="0" y1="-12" x2="30" y2="-40" stroke="#22C55E" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const pulse = Math.sin(f * 0.3) * 0.3 + 0.7;
      return `<g>
        <rect x="-4" y="-14" width="8" height="28" rx="2" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>
        <circle cx="0" cy="-6" r="2" fill="#22C55E"/>
        <line x1="0" y1="-14" x2="45" y2="-50" stroke="#10B981" stroke-width="3" opacity="${pulse.toFixed(2)}"/>
        <circle cx="45" cy="-50" r="5" fill="#86EFAC" stroke="#000000" stroke-width="1.5"/>
      </g>`;
    },
    tags: ["puntero", "laser", "verde", "presentacion", "profesor", "apuntar"],
  },
  tiburon_frustrado_balanza: {
    id: "tiburon_frustrado_balanza",
    name: "Balanza Sensorial: Tiburón vs Olfato Humano",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-3" y="-20" width="6" height="40" fill="#1E293B" stroke="${S}" stroke-width="2"/><line x1="-30" y1="-15" x2="30" y2="-5" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const isHumanWin = currentState === "gana_nariz" || (currentState === undefined && f >= 60);
      const balanceTilt = (isHumanWin ? 14 : 6) + Math.sin(f * 0.18) * 3;
      return `<g transform="scale(1.65)">
        <!-- Pedestal central de la balanza -->
        <polygon points="0,-14 -14,26 14,26" fill="#334155" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="0" cy="-14" r="5" fill="#F59E0B" stroke="${S}" stroke-width="3"/>

        <!-- Barra oscilante inclinada hacia la nariz humana ganadora -->
        <g transform="rotate(${balanceTilt.toFixed(1)})">
          <line x1="-36" y1="-14" x2="36" y2="-14" stroke="${S}" stroke-width="4.5" stroke-linecap="round"/>

          <!-- Platillo Izquierdo: Tiburón con gota de sangre -->
          <g transform="translate(-36, -14)">
            <line x1="0" y1="0" x2="-9" y2="18" stroke="${S}" stroke-width="2.5"/>
            <line x1="0" y1="0" x2="9" y2="18" stroke="${S}" stroke-width="2.5"/>
            <path d="M -15,18 L 15,18 L 11,24 L -11,24 Z" fill="#64748B" stroke="${S}" stroke-width="3"/>
            <path d="M -10,14 C -14,6 0,2 8,10 C 12,12 10,16 -10,14 Z" fill="#94A3B8" stroke="${S}" stroke-width="2.5"/>
            <path d="M 0,2 C 3,6 3,10 0,12 C -3,10 -3,6 0,2 Z" fill="#EF4444" stroke="${S}" stroke-width="2"/>
          </g>

          <!-- Platillo Derecho: Nariz humana + gota de lluvia + corona dorada -->
          <g transform="translate(36, -14)">
            <line x1="0" y1="0" x2="-9" y2="22" stroke="${S}" stroke-width="2.5"/>
            <line x1="0" y1="0" x2="9" y2="22" stroke="${S}" stroke-width="2.5"/>
            <path d="M -15,22 L 15,22 L 11,28 L -11,28 Z" fill="#0284C7" stroke="${S}" stroke-width="3"/>
            <path d="M -5,6 C 2,12 8,14 5,19 C 3,21 -3,21 -5,19" fill="#FED7AA" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
            <path d="M 6,6 C 9,10 9,14 6,16 C 3,14 3,10 6,6 Z" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
            ${isHumanWin ? `<circle cx="0" cy="-6" r="5" fill="#FACC15" stroke="${S}" stroke-width="2"/>` : ""}
          </g>
        </g>
      </g>`;
    },
    tags: ["tiburon", "olfato", "balanza", "sangre", "geosmina", "nariz", "comparativa"],
  },
  piscina_olimpica_micro_gota: {
    id: "piscina_olimpica_micro_gota",
    name: "Cucharadita de Geosmina sobre Piscina Olímpica",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-14" width="48" height="28" rx="4" fill="#0284C7" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const isDiluted = currentState === "onda_expansion" || (currentState === undefined && f >= 60);
      const dropBob = Math.sin(f * 0.22) * 3;
      const rippleR = isDiluted ? 8 + ((f * 0.8) % 18) : 6;
      return `<g transform="scale(1.65)">
        <!-- Piscina olímpica vista en perspectiva -->
        <rect x="-32" y="-12" width="64" height="34" rx="5" fill="#0284C7" stroke="${S}" stroke-width="4"/>
        <line x1="-26" y1="-2" x2="26" y2="-2" stroke="#7DD3FC" stroke-width="2.5" stroke-dasharray="5 3"/>
        <line x1="-26" y1="9" x2="26" y2="9" stroke="#7DD3FC" stroke-width="2.5" stroke-dasharray="5 3"/>
        <!-- Onda dorada de geosmina expandiéndose en el agua -->
        <ellipse cx="0" cy="4" rx="${rippleR.toFixed(1)}" ry="${(rippleR * 0.5).toFixed(1)}" fill="none" stroke="#FACC15" stroke-width="3"/>
        <!-- Cucharita metálica arriba dejando caer una micro-gota dorada -->
        <g transform="translate(0, ${(-22 + dropBob).toFixed(1)})">
          <path d="M -22,-6 L -4,-6 C -2,-2 6,-2 8,-6 C 8,0 -2,2 -4,-2 L -22,-2 Z" fill="#E2E8F0" stroke="${S}" stroke-width="2.5"/>
          <path d="M 3,-1 C 7,5 8,11 3,13 C -2,11 -1,5 3,-1 Z" fill="#FACC15" stroke="${S}" stroke-width="2.5"/>
        </g>
      </g>`;
    },
    tags: ["piscina", "gota", "geosmina", "concentracion", "partes_por_billon", "escala"],
  },
  bacteria_streptomyces_geosmina: {
    id: "bacteria_streptomyces_geosmina",
    name: "Bacteria Streptomyces liberando Moléculas de Geosmina",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="18" fill="#15803D" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const isSpore = currentState === "liberando_geosmina" || (currentState === undefined && f >= 60);
      const sporePulse = Math.sin(f * 0.22) * 3;
      return `<g transform="scale(1.65)">
        <!-- Terrón de suelo húmedo -->
        <ellipse cx="0" cy="10" rx="28" ry="15" fill="#451A03" stroke="${S}" stroke-width="4"/>
        <!-- Red de filamentos verdes de Streptomyces -->
        <g stroke="#10B981" stroke-width="4" stroke-linecap="round" fill="none">
          <path d="M -16,8 Q -8,-6 0,2 Q 8,8 16,-2"/>
          <path d="M -4,2 Q -2,-12 6,-14 Q 12,-8 18,-8"/>
          <path d="M -10,6 Q -16,-4 -18,-12"/>
        </g>
        <!-- Moléculas aromáticas de geosmina flotando hacia arriba -->
        <g transform="translate(0, ${(-10 + sporePulse).toFixed(1)})">
          <circle cx="-10" cy="-8" r="${isSpore ? 4.5 : 3}" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
          <circle cx="8" cy="-12" r="${isSpore ? 5 : 3.5}" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
          <circle cx="0" cy="-20" r="${isSpore ? 5.5 : 4}" fill="#FACC15" stroke="${S}" stroke-width="2.5"/>
        </g>
      </g>`;
    },
    tags: ["bacteria", "streptomyces", "geosmina", "esporas", "suelo", "olor", "microscopio"],
  },
  gota_lluvia_macro_aerosol: {
    id: "gota_lluvia_macro_aerosol",
    name: "Gota de Lluvia atrapando Burbujas y Disparando Aerosoles",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M 0,-14 C 10,-2 12,10 0,12 C -12,10 -10,-2 0,-14 Z" fill="#38BDF8" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const phase = (f % 36) / 36;
      const bubbleRise = phase * 22;
      return `<g transform="scale(1.65)">
        <!-- Suelo poroso -->
        <rect x="-30" y="8" width="60" height="16" rx="4" fill="#78350F" stroke="${S}" stroke-width="4"/>
        <circle cx="-16" cy="16" r="3" fill="#451A03"/>
        <circle cx="12" cy="15" r="3.5" fill="#451A03"/>
        <!-- Menisco de la gota al impactar -->
        <ellipse cx="0" cy="7" rx="23" ry="8" fill="#38BDF8" stroke="${S}" stroke-width="3.5"/>
        <!-- Burbujas efervescentes subiendo como champán -->
        <g transform="translate(0, -${bubbleRise.toFixed(1)})">
          <circle cx="-12" cy="-2" r="4" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/>
          <circle cx="-3" cy="-9" r="3.5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
          <circle cx="9" cy="-4" r="4.5" fill="#FACC15" stroke="${S}" stroke-width="2.5"/>
          <circle cx="16" cy="-11" r="3" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
        </g>
      </g>`;
    },
    tags: ["aerosol", "mit", "gota", "burbujas", "impacto", "champan", "fisica"],
  },
  mapa_sabana_oasis_ancestro: {
    id: "mapa_sabana_oasis_ancestro",
    name: "Brújula Ancestral hacia la Tormenta y el Oasis",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-14" width="36" height="28" rx="3" fill="#D97706" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const pulseOasis = Math.sin(f * 0.2) * 2;
      return `<g transform="scale(1.65)">
        <rect x="-28" y="-18" width="56" height="38" rx="5" fill="#FDE68A" stroke="${S}" stroke-width="4"/>
        <!-- Ruta punteada desde tierra seca hasta nube de lluvia y oasis -->
        <path d="M -18,10 Q -4,4 8,-4" fill="none" stroke="#B45309" stroke-width="3.5" stroke-dasharray="4 3" stroke-linecap="round"/>
        <g transform="translate(14, -5)">
          <ellipse cx="0" cy="0" rx="10" ry="6" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
          <line x1="-4" y1="6" x2="-5" y2="11" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="3" y1="6" x2="2" y2="11" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <circle cx="-16" cy="-7" r="${(5 + pulseOasis * 0.5).toFixed(1)}" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/>
      </g>`;
    },
    tags: ["mapa", "ancestro", "sabana", "oasis", "agua", "supervivencia", "evolucion"],
  },
  paraguas_arcoiris_fresco: {
    id: "paraguas_arcoiris_fresco",
    name: "Paraguas Amarillo con Gotas Frescas y Espiral ADN",
    family: "vida_cotidiana",
    defaultPlacement: "overhead",
    svg: `<path d="M -22,0 C -22,-14 22,-14 22,0 Z" fill="#FDE047" stroke="${S}" stroke-width="3.5"/><line x1="0" y1="0" x2="0" y2="24" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const umbrellaTilt = Math.sin(f * 0.16) * 4;
      return `<g transform="rotate(${umbrellaTilt.toFixed(1)}) scale(1.65)">
        <path d="M -26,-2 A 28 28 0 0 1 26,-2" fill="none" stroke="#EF4444" stroke-width="3"/>
        <path d="M -23,-2 A 25 25 0 0 1 23,-2" fill="none" stroke="#F59E0B" stroke-width="3"/>
        <path d="M -20,-2 A 22 22 0 0 1 20,-2" fill="none" stroke="#22C55E" stroke-width="3"/>
        <path d="M -24,2 C -24,-16 24,-16 24,2 C 16,-1 8,2 0,-1 C -8,2 -16,-1 -24,2 Z" fill="#FDE047" stroke="${S}" stroke-width="4"/>
        <line x1="0" y1="-2" x2="0" y2="20" stroke="${S}" stroke-width="4"/>
        <path d="M 0,20 C 0,26 -8,26 -8,20" fill="none" stroke="${S}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="-16" cy="-10" r="3" fill="#38BDF8" stroke="${S}" stroke-width="1.5"/>
        <circle cx="15" cy="-12" r="3.5" fill="#38BDF8" stroke="${S}" stroke-width="1.5"/>
      </g>`;
    },
    tags: ["paraguas", "lluvia", "arcoiris", "frescura", "petricor", "vida", "alegria"],
  },
  roca_petricor_aceite_dorado: {
    id: "roca_petricor_aceite_dorado",
    name: "Roca Mineral con Aceites Vegetales e Ícor Dorado",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<polygon points="-24,14 -18,-12 8,-18 24,-6 20,16" fill="#64748B" stroke="${S}" stroke-width="4.5"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const glow = (0.75 + Math.sin(f * 0.16) * 0.25).toFixed(2);
      const dropY = Math.sin(f * 0.14) * 3.5;
      return `<g transform="scale(1.75)">
        <!-- Roca porosa gris neo-brutalista -->
        <polygon points="-24,14 -18,-12 8,-18 24,-6 20,16" fill="#64748B" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Grietas minerales con aceite vegetal dorado -->
        <path d="M -14,-8 L -4,2 L -8,12" fill="none" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 4,-12 L 6,0 L 14,8" fill="none" stroke="#FBBF24" stroke-width="4" stroke-linecap="round"/>
        <!-- Gotas de Ícor (fluido dorado divino) -->
        <circle cx="6" cy="${dropY.toFixed(1)}" r="5" fill="#FDE047" stroke="${S}" stroke-width="2.5" opacity="${glow}"/>
        <circle cx="-5" cy="${(dropY + 4).toFixed(1)}" r="3.5" fill="#FDE047" stroke="${S}" stroke-width="2" opacity="${glow}"/>
      </g>`;
    },
    tags: ["roca", "petricor", "aceite", "oro", "quimica", "mitologia", "icor"],
  },
  mesa_experimento_mano_goma: {
    id: "mesa_experimento_mano_goma",
    name: "Mano de Goma Anatómica con Aura Neural",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-25" y="-15" width="50" height="30" rx="6" fill="#F87171" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const isAdopting = currentState === "adoptada" || f > 120;
      const pulse = (0.65 + Math.sin(f * 0.16) * 0.35).toFixed(2);
      const fingerTwitch = isAdopting ? Math.sin(f * 0.22) * 3.5 : 0;
      return `<g transform="scale(1.85)">
        <!-- Aura de adopción somatosensorial cian cuando el cerebro la integra -->
        ${isAdopting ? `<ellipse cx="0" cy="-4" rx="${34 + Math.sin(f * 0.18) * 4}" ry="${26 + Math.cos(f * 0.18) * 3}" fill="#38BDF8" opacity="0.28" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="5,4"/>` : ""}
        <!-- Sombra sobre la mesa clínica -->
        <ellipse cx="2" cy="18" rx="30" ry="7" fill="#0F172A" opacity="0.35"/>
        <!-- Muñeca de látex con borde de corte de molde -->
        <path d="M -28,6 L -12,4 L -12,16 L -28,18 Z" fill="#FB7185" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
        <ellipse cx="-28" cy="12" rx="4" ry="7" fill="#BE123C" stroke="${S}" stroke-width="3.5"/>
        <!-- Dorso y palma de la mano de goma sobre la mesa -->
        <path d="M -14,2 C -6,-8 8,-8 16,-2 L 18,14 C 8,17 -6,17 -14,15 Z" fill="#FDA4AF" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
        <!-- Dedos articulados de caucho -->
        <path d="M -6,-4 L -12,-14 C -14,-17 -9,-20 -6,-16 L 0,-5" fill="#FDA4AF" stroke="${S}" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 12,-4 L 30,${(-8 + fingerTwitch).toFixed(1)} C 34,-8 34,-3 29,-2 L 14,1" fill="#FDA4AF" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 15,0 L 34,${(-1 + fingerTwitch * 0.8).toFixed(1)} C 38,-1 38,4 33,5 L 15,5" fill="#FDA4AF" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 15,5 L 31,${(6 + fingerTwitch * 0.5).toFixed(1)} C 35,6 35,11 30,11 L 14,10" fill="#FDA4AF" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 12,10 L 25,13 C 28,13 28,17 24,17 L 10,15" fill="#FDA4AF" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
        <!-- Brillo especular de plástico/caucho -->
        <path d="M -6,1 Q 4,-3 12,0" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
        <!-- Nodos sinápticos encendiéndose sobre el plástico cuando se adopta -->
        ${isAdopting ? `<g opacity="${pulse}">
          <circle cx="4" cy="4" r="4" fill="#FFE600" stroke="${S}" stroke-width="2"/>
          <circle cx="26" cy="-4" r="3.5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
          <circle cx="29" cy="2" r="3.5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
          <line x1="4" y1="4" x2="26" y2="-4" stroke="#FFE600" stroke-width="2"/>
          <line x1="4" y1="4" x2="29" y2="2" stroke="#38BDF8" stroke-width="2"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["mano", "goma", "experimento", "neurociencia", "ilusion", "mesa"],
  },

  pinceles_gemelos_tactiles: {
    id: "pinceles_gemelos_tactiles",
    name: "Dos Pinceles en Sincronía Táctil",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<line x1="-15" y1="-20" x2="-15" y2="15" stroke="#92400E" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const sweep = Math.sin(f * 0.20) * 14;
      const bristleBend = Math.cos(f * 0.20) * 5;
      const sparkAlpha = (0.5 + Math.abs(Math.cos(f * 0.20)) * 0.5).toFixed(2);
      return `<g transform="scale(1.85)">
        <!-- Barra superior de acoplamiento mecánico para mostrar sincronía 1:1 -->
        <line x1="${-28 + sweep}" y1="-30" x2="${28 + sweep}" y2="-30" stroke="#38BDF8" stroke-width="3" stroke-dasharray="4,3"/>
        <!-- Pincel Izquierdo (acariciando mano real oculta) -->
        <g transform="translate(${-28 + sweep}, -8) rotate(-14)">
          <path d="M -3,-26 L 3,-26 L 4,4 L -4,4 Z" fill="#D97706" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="-4.5" y="4" width="9" height="7" rx="1" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
          <path d="M -4.5,11 Q ${-4 + bristleBend},22 ${bristleBend},25 Q ${4 + bristleBend},22 4.5,11 Z" fill="#FDE047" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        </g>
        <!-- Pincel Derecho (acariciando mano de goma visible) -->
        <g transform="translate(${28 + sweep}, -8) rotate(-14)">
          <path d="M -3,-26 L 3,-26 L 4,4 L -4,4 Z" fill="#D97706" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="-4.5" y="4" width="9" height="7" rx="1" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
          <path d="M -4.5,11 Q ${-4 + bristleBend},22 ${bristleBend},25 Q ${4 + bristleBend},22 4.5,11 Z" fill="#FDE047" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        </g>
        <!-- Ondas táctiles concéntricas idénticas en ambos puntos de contacto -->
        <g opacity="${sparkAlpha}">
          <ellipse cx="${-24 + sweep}" cy="18" rx="11" ry="4" fill="none" stroke="#22C55E" stroke-width="2.5"/>
          <ellipse cx="${32 + sweep}" cy="18" rx="11" ry="4" fill="none" stroke="#38BDF8" stroke-width="2.5"/>
          <circle cx="${-24 + sweep}" cy="16" r="3" fill="#FFE600" stroke="${S}" stroke-width="1.5"/>
          <circle cx="${32 + sweep}" cy="16" r="3" fill="#FFE600" stroke="${S}" stroke-width="1.5"/>
        </g>
      </g>`;
    },
    tags: ["pinceles", "sincronia", "tacto", "estimulo", "pinceladas", "gemelos"],
  },

  cerebro_corteza_somatosensorial: {
    id: "cerebro_corteza_somatosensorial",
    name: "Cerebro con Corteza Somatosensorial y Reescritura Neural",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M -22,0 C -22,-18 22,-18 22,0 C 22,18 -22,18 -22,0 Z" fill="#F472B6" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, _stepProgress?: number, currentState?: string) => {
      const isRewriting = currentState === "reescribiendo" || f > 120;
      const synPulse = (0.65 + Math.sin(f * 0.24) * 0.35).toFixed(2);
      const signalPos = (f * 2.2) % 36;
      return `<g transform="scale(1.9)">
        <!-- Halo eléctrico de actividad cortical -->
        <circle cx="0" cy="-2" r="32" fill="${isRewriting ? "#38BDF8" : "#EC4899"}" opacity="0.18"/>
        <!-- Hemisferio cerebral con circunvoluciones detalladas -->
        <path d="M -28,2 C -30,-18 -12,-26 2,-22 C 16,-26 30,-14 28,4 C 28,18 12,22 2,16 C -10,22 -26,16 -28,2 Z" fill="#F472B6" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Surcos cerebrales -->
        <path d="M -18,-4 Q -8,-12 0,-4 Q 10,-12 18,-2" fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
        <path d="M -14,7 Q -4,1 8,9" fill="none" stroke="${S}" stroke-width="3" stroke-linecap="round"/>
        <!-- Franja de la Corteza Somatosensorial Primaria (iluminada) -->
        <path d="M -2,-21 C 4,-10 4,4 0,15" fill="none" stroke="${isRewriting ? "#38BDF8" : "#FFE600"}" stroke-width="7" stroke-linecap="round" opacity="${synPulse}"/>
        <path d="M -2,-21 C 4,-10 4,4 0,15" fill="none" stroke="${S}" stroke-width="2" stroke-dasharray="3,3"/>
        <!-- Nodos sinápticos y puente de reescritura -->
        <circle cx="-12" cy="-8" r="4" fill="#22C55E" stroke="${S}" stroke-width="2"/>
        <circle cx="12" cy="-6" r="5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
        <circle cx="${-12 + (signalPos / 36) * 24}" cy="-7" r="3.5" fill="#FFE600" stroke="${S}" stroke-width="1.5"/>
        <line x1="-12" y1="-8" x2="12" y2="-6" stroke="#FFE600" stroke-width="2.5" stroke-dasharray="3,2"/>
      </g>`;
    },
    tags: ["cerebro", "corteza", "somatosensorial", "homunculo", "sinapsis", "neurociencia"],
  },

  martillo_amenaza_impacto: {
    id: "martillo_amenaza_impacto",
    name: "Martillo de Impacto con Golpe Descendente",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-12" width="36" height="20" rx="3" fill="#334155" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isStrike = currentState === "impacto" || (currentState === undefined && f >= 108);
      const p = stepProgress !== undefined ? stepProgress : Math.min(1, Math.max(0, (f - 108) / 12));
      const angle = isStrike ? (24 - Math.min(1, p * 4.5) * 96) : (26 + Math.sin(f * 0.28) * 5);
      const showShockwave = isStrike && p > 0.12;
      const ringR = showShockwave ? 12 + ((f * 4) % 28) : 0;
      return `<g transform="scale(1.95)">
        <!-- Onda de choque en el punto donde golpea la mano de goma -->
        ${showShockwave ? `<g transform="translate(-26, 22)">
          <ellipse cx="0" cy="0" rx="${ringR}" ry="${(ringR * 0.45).toFixed(1)}" fill="none" stroke="#EF4444" stroke-width="4"/>
          <polygon points="0,-6 4,-18 10,-4 22,-8 8,2 14,12 0,4 -12,12 -6,0 -18,-8 -4,-4" fill="#FFE600" stroke="${S}" stroke-width="2.5"/>
        </g>` : ""}
        <!-- Martillo articulado desde el mango inferior -->
        <g transform="translate(12, 18) rotate(${angle.toFixed(1)})">
          <rect x="-5" y="-44" width="10" height="48" rx="4" fill="#B45309" stroke="${S}" stroke-width="4"/>
          <rect x="-6" y="-10" width="12" height="16" rx="3" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
          <rect x="-28" y="-62" width="56" height="24" rx="5" fill="#334155" stroke="${S}" stroke-width="4.5"/>
          <rect x="-18" y="-58" width="9" height="16" fill="#FBBF24"/>
          <rect x="9" y="-58" width="9" height="16" fill="#FBBF24"/>
          <rect x="-31" y="-60" width="6" height="20" rx="2" fill="#EF4444" stroke="${S}" stroke-width="3"/>
        </g>
      </g>`;
    },
    tags: ["martillo", "impacto", "peligro", "golpe", "panico", "amenaza"],
  },

  monitor_fisiologico_sudor_miedo: {
    id: "monitor_fisiologico_sudor_miedo",
    name: "Sensor Galvánico y Corazón Adrenalina",
    family: "tecnologia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-22" width="60" height="44" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const heartScale = (1 + Math.sin(f * 0.30) * 0.14).toFixed(2);
      const dropY = (f * 1.4) % 18;
      return `<g transform="scale(1.85)">
        <rect x="-34" y="-24" width="68" height="46" rx="8" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>
        <rect x="-28" y="-18" width="56" height="34" rx="4" fill="#022C22" stroke="${S}" stroke-width="2.5"/>
        <path d="M -25,4 L -14,4 L -10,-12 L -5,11 L -1,-6 L 3,4 L 24,4" fill="none" stroke="#22C55E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <g transform="translate(-22, -18) scale(${heartScale})">
          <path d="M 0,4 C -6,-2 -10,-8 -5,-12 C -1,-15 0,-10 0,-8 C 0,-10 1,-15 5,-12 C 10,-8 6,-2 0,4 Z" fill="#EF4444" stroke="${S}" stroke-width="2.5" stroke-linejoin="round"/>
        </g>
        <path d="M 24,${(-10 + dropY).toFixed(1)} C 21,${(-4 + dropY).toFixed(1)} 20,${(1 + dropY).toFixed(1)} 24,${(3 + dropY).toFixed(1)} C 28,${(1 + dropY).toFixed(1)} 27,${(-4 + dropY).toFixed(1)} 24,${(-10 + dropY).toFixed(1)} Z" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
      </g>`;
    },
    tags: ["monitor", "cardiaco", "panico", "galvanica", "estres", "fisiologia"],
  },

  espejo_realidad_truco_mental: {
    id: "espejo_realidad_truco_mental",
    name: "Proyector Neural de Mapa Corporal Maleable",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="20" fill="#38BDF8" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const pulse = (0.75 + Math.sin(f * 0.16) * 0.25).toFixed(2);
      const orbitAngle = (f * 3) % 360;
      return `<g transform="scale(1.85)">
        <ellipse cx="0" cy="18" rx="26" ry="8" fill="#1E293B" stroke="${S}" stroke-width="4"/>
        <ellipse cx="0" cy="18" rx="18" ry="4" fill="#38BDF8" opacity="${pulse}"/>
        <polygon points="-18,18 -28,-22 28,-22 18,18" fill="#38BDF8" opacity="0.22"/>
        <g transform="translate(0, ${(-4 + Math.sin(f * 0.15) * 3).toFixed(1)})">
          <rect x="-10" y="-6" width="20" height="15" rx="4" fill="#FFE600" stroke="${S}" stroke-width="3.5"/>
          <line x1="-6" y1="-6" x2="-8" y2="-18" stroke="#FFE600" stroke-width="5" stroke-linecap="round"/>
          <line x1="-6" y1="-6" x2="-8" y2="-18" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="0" y1="-6" x2="0" y2="-20" stroke="#FFE600" stroke-width="5" stroke-linecap="round"/>
          <line x1="0" y1="-6" x2="0" y2="-20" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="6" y1="-6" x2="8" y2="-17" stroke="#FFE600" stroke-width="5" stroke-linecap="round"/>
          <line x1="6" y1="-6" x2="8" y2="-17" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="0" cy="1" r="4" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
        </g>
        <g transform="rotate(${orbitAngle})">
          <circle cx="24" cy="0" r="4" fill="#EC4899" stroke="${S}" stroke-width="2"/>
        </g>
      </g>`;
    },
    tags: ["espejo", "percepcion", "realidad", "ilusion", "truco", "neurociencia"],
  },
  brazo_venas_azules_diagrama: {
    id: "brazo_venas_azules_diagrama",
    name: "Antebrazo con Venas Superficiales Azules y Corte Anatómico",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-12" width="60" height="24" rx="10" fill="#FED7AA" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isRevealed = currentState === "cuestionado" || (currentState === undefined && f >= 75);
      const pulse = (0.75 + Math.sin(f * 0.18) * 0.25).toFixed(2);
      const lensX = isRevealed ? 6 + Math.sin(f * 0.14) * 6 : -14;
      const veinColor = isRevealed ? "#991B1B" : "#0284C7";
      const subVeinColor = isRevealed ? "#DC2626" : "#38BDF8";
      return `<g transform="scale(1.85)">
        <!-- Contorno volumétrico de antebrazo y muñeca con pliegues neo-brutalistas -->
        <path d="M -38,-15 C -12,-19 16,-17 38,-12 L 38,13 C 16,17 -12,19 -38,15 Z" fill="#FED7AA" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -36,8 C -10,12 16,10 36,7" fill="none" stroke="#FDBA74" stroke-width="4" stroke-linecap="round"/>
        <!-- Red de venas vista a través de la piel -->
        <path d="M -32,-1 Q -10,-7 8,-2 Q 22,-8 34,-4" fill="none" stroke="#0284C7" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 4,-2 Q 16,6 30,5" fill="none" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M -24,5 Q -6,2 10,6" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
        <!-- Lupa / Ventana de corte histológico que revela la sangre roja real adentro -->
        <g transform="translate(${lensX.toFixed(1)}, -1)">
          <circle cx="0" cy="0" r="14" fill="${isRevealed ? "#FEE2E2" : "#E0F2FE"}" stroke="${S}" stroke-width="4"/>
          <path d="M -11,-1 Q 0,-5 11,-1" fill="none" stroke="${veinColor}" stroke-width="5.5" stroke-linecap="round"/>
          <circle cx="-4" cy="-2" r="2.8" fill="${subVeinColor}" opacity="${pulse}"/>
          <circle cx="4" cy="-1" r="2.8" fill="${subVeinColor}" opacity="${pulse}"/>
          <line x1="10" y1="10" x2="19" y2="19" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
        </g>
      </g>`;
    },
    tags: ["brazo", "venas", "azul", "sangre", "anatomia", "piel"],
  },

  tubos_ensayo_sangre_rojo_oscuro: {
    id: "tubos_ensayo_sangre_rojo_oscuro",
    name: "Tubos Vacutainer de Sangre Arterial Escarlata y Venosa Granate",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-18" width="16" height="36" rx="4" fill="#EF4444" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isComp = currentState === "comparacion_rojos" || (currentState === undefined && f >= 75);
      const bubble = Math.sin(f * 0.2) * 3.5;
      const glowScale = isComp ? (1.06 + Math.sin(f * 0.22) * 0.05).toFixed(2) : "1";
      return `<g transform="scale(1.85)">
        <!-- Gradilla metálica de laboratorio -->
        <rect x="-36" y="15" width="72" height="11" rx="3" fill="#64748B" stroke="${S}" stroke-width="4"/>
        <rect x="-32" y="-6" width="64" height="5" rx="2" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
        <!-- Tubo Arterial (Izquierda: Rojo Escarlata brillante rico en O2) -->
        <g transform="translate(-16, 0) scale(${glowScale})">
          <rect x="-10" y="-22" width="20" height="38" rx="6" fill="#FEE2E2" stroke="${S}" stroke-width="4"/>
          <path d="M -8,-10 L 8,-10 L 8,12 C 8,14 -8,14 -8,12 Z" fill="#EF4444" stroke="${S}" stroke-width="2.5"/>
          <rect x="-11" y="-27" width="22" height="7" rx="2" fill="#DC2626" stroke="${S}" stroke-width="3.5"/>
          <circle cx="-3" cy="${(-2 + bubble).toFixed(1)}" r="2.5" fill="#FECACA"/>
          <circle cx="3" cy="${(5 - bubble).toFixed(1)}" r="2" fill="#FFFFFF" opacity="0.85"/>
        </g>
        <!-- Tubo Venoso (Derecha: Rojo Vino/Granate oscuro - ¡Jamás azul!) -->
        <g transform="translate(16, 0) scale(${glowScale})">
          <rect x="-10" y="-22" width="20" height="38" rx="6" fill="#FCE7F3" stroke="${S}" stroke-width="4"/>
          <path d="M -8,-10 L 8,-10 L 8,12 C 8,14 -8,14 -8,12 Z" fill="#881337" stroke="${S}" stroke-width="2.5"/>
          <rect x="-11" y="-27" width="22" height="7" rx="2" fill="#4C0519" stroke="${S}" stroke-width="3.5"/>
          <circle cx="2" cy="${(-1 - bubble).toFixed(1)}" r="2.3" fill="#F43F5E" opacity="0.75"/>
          <circle cx="-3" cy="${(6 + bubble * 0.6).toFixed(1)}" r="1.8" fill="#FB7185" opacity="0.65"/>
        </g>
        <!-- Símbolo prohibido sobre gota azul arriba -->
        ${isComp ? `<g transform="translate(0, -34)">
          <path d="M 0,-9 C 5,-2 6,4 0,7 C -6,4 -5,-2 0,-9 Z" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
          <circle cx="0" cy="-1" r="10" fill="none" stroke="#EF4444" stroke-width="3.5"/>
          <line x1="-7" y1="-8" x2="7" y2="6" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["tubos", "sangre", "rojo", "venosa", "arterial", "oxigeno", "laboratorio"],
  },

  prisma_optico_piel_fotones: {
    id: "prisma_optico_piel_fotones",
    name: "Corte Óptico de Piel con Absorción Roja y Rebote Azul",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-15" width="60" height="30" fill="#FED7AA" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isBounce = currentState === "rebote_azul" || (currentState === undefined && f >= 75);
      const redRay = Math.sin(f * 0.18) * 3.5;
      const blueRay = Math.sin(f * 0.24) * 5;
      return `<g transform="scale(1.85)">
        <!-- Capas de tejido cutáneo (Epidermis + Dermis) -->
        <rect x="-34" y="-6" width="68" height="12" rx="2" fill="#FED7AA" stroke="${S}" stroke-width="4"/>
        <rect x="-34" y="6" width="68" height="18" rx="2" fill="#FDBA74" stroke="${S}" stroke-width="4"/>
        <!-- Vena profunda rojo granate -->
        <ellipse cx="0" cy="15" rx="18" ry="6.5" fill="#881337" stroke="${S}" stroke-width="3.5"/>
        <ellipse cx="-4" cy="14" rx="8" ry="2.5" fill="#BE123C"/>
        <!-- Onda roja larga: penetra profundo hasta la vena y se absorbe -->
        <path d="M -20,-28 L -8,${(12 + redRay).toFixed(1)}" fill="none" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/>
        <circle cx="-8" cy="${(12 + redRay).toFixed(1)}" r="4" fill="#FFE600" stroke="${S}" stroke-width="2"/>
        <!-- Onda azul corta: choca en la epidermis/dermis y rebota hacia el ojo -->
        <path d="M 10,-28 L 6,-1 L ${(22 + (isBounce ? 4 : 0)).toFixed(1)},${(-24 + blueRay).toFixed(1)}" fill="none" stroke="#0284C7" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${(22 + (isBounce ? 4 : 0)).toFixed(1)}" cy="${(-24 + blueRay).toFixed(1)}" r="4.5" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
      </g>`;
    },
    tags: ["optica", "dispersion", "fotones", "luz", "rojo", "azul", "piel"],
  },

  molecula_hemoglobina_hierro: {
    id: "molecula_hemoglobina_hierro",
    name: "Complejo Hemo de Hemoglobina con Núcleo de Hierro Fe y Fotones Rojos",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<circle cx="0" cy="0" r="22" fill="#DC2626" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isReflect = currentState === "reflejo_rojo" || (currentState === undefined && f >= 75);
      const pulse = (0.85 + Math.sin(f * 0.2) * 0.15).toFixed(2);
      const rayLen = isReflect ? 10 + Math.sin(f * 0.25) * 4 : 4;
      return `<g transform="scale(1.85)">
        <!-- Enlaces químicos de coordinación -->
        <line x1="-16" y1="-14" x2="16" y2="14" stroke="${S}" stroke-width="5"/>
        <line x1="16" y1="-14" x2="-16" y2="14" stroke="${S}" stroke-width="5"/>
        <!-- 4 subunidades globina / anillos de porfirina rojos -->
        <circle cx="-17" cy="-15" r="10.5" fill="#EF4444" stroke="${S}" stroke-width="3.5" opacity="${pulse}"/>
        <circle cx="17" cy="-15" r="10.5" fill="#DC2626" stroke="${S}" stroke-width="3.5" opacity="${pulse}"/>
        <circle cx="-17" cy="15" r="10.5" fill="#991B1B" stroke="${S}" stroke-width="3.5" opacity="${pulse}"/>
        <circle cx="17" cy="15" r="10.5" fill="#B91C1C" stroke="${S}" stroke-width="3.5" opacity="${pulse}"/>
        <!-- Átomo central de Hierro (Fe) -->
        <circle cx="0" cy="0" r="15" fill="#F59E0B" stroke="${S}" stroke-width="4"/>
        <text x="0" y="5" font-family="'Impact', 'Arial Black', sans-serif" font-size="11" font-weight="900" fill="#000" text-anchor="middle">Fe</text>
        <!-- Destellos de reflexión de luz roja pura -->
        ${isReflect ? `<g stroke="#EF4444" stroke-width="3.5" stroke-linecap="round">
          <line x1="0" y1="-22" x2="0" y2="${(-22 - rayLen).toFixed(1)}"/>
          <line x1="24" y1="0" x2="${(24 + rayLen).toFixed(1)}" y2="0"/>
          <line x1="-24" y1="0" x2="${(-24 - rayLen).toFixed(1)}" y2="0"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["hemoglobina", "hierro", "molecula", "sangre", "quimica", "oxigeno"],
  },

  pizarron_mito_escolar_tachado: {
    id: "pizarron_mito_escolar_tachado",
    name: "Diagrama de Sangre Azul Tachado con Sello de Ilusión Óptica",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-20" width="60" height="40" rx="4" fill="#064E3B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isCrossed = currentState === "mito_tachado" || (currentState === undefined && f >= 60);
      const scaleX = isCrossed ? (1 + Math.sin(f * 0.24) * 0.06).toFixed(2) : "0.85";
      return `<g transform="scale(1.8)">
        <!-- Marco de madera del pizarrón -->
        <rect x="-34" y="-24" width="68" height="48" rx="6" fill="#78350F" stroke="${S}" stroke-width="4.5"/>
        <rect x="-29" y="-19" width="58" height="38" rx="3" fill="#064E3B" stroke="${S}" stroke-width="3"/>
        <!-- Gota azul falsa a la izquierda vs Gota roja real a la derecha -->
        <path d="M -13,-10 C -6,0 -6,10 -13,13 C -20,10 -20,0 -13,-10 Z" fill="#38BDF8" stroke="${S}" stroke-width="3"/>
        <path d="M 14,-10 C 21,0 21,10 14,13 C 7,10 7,0 14,-10 Z" fill="#EF4444" stroke="${S}" stroke-width="3"/>
        <!-- Palomita verde en la gota roja -->
        <path d="M 8,14 L 13,18 L 22,8" fill="none" stroke="#22C55E" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Gran X roja tachando la gota azul -->
        <g transform="translate(-13, 2) scale(${scaleX})">
          <line x1="-11" y1="-11" x2="11" y2="11" stroke="#EF4444" stroke-width="5.5" stroke-linecap="round"/>
          <line x1="11" y1="-11" x2="-11" y2="11" stroke="#EF4444" stroke-width="5.5" stroke-linecap="round"/>
        </g>
      </g>`;
    },
    tags: ["pizarron", "mito", "falso", "escuela", "sangre_azul", "desmentido"],
  },

  linterna_transiluminacion_roja: {
    id: "linterna_transiluminacion_roja",
    name: "Linterna Potente Transiluminando Dedos en Rojo Carmesí",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="18" fill="#EF4444" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isLit = currentState === "transiluminacion_roja" || (currentState === undefined && f >= 50);
      const glowRadius = isLit ? (22 + Math.sin(f * 0.22) * 3.5).toFixed(1) : "16";
      const rayOp = isLit ? (0.75 + Math.sin(f * 0.25) * 0.25).toFixed(2) : "0.35";
      return `<g transform="scale(1.85)">
        <!-- Halo de transiluminación roja pura atravesando la carne y capilares -->
        <circle cx="0" cy="-6" r="${glowRadius}" fill="#EF4444" stroke="${S}" stroke-width="4" opacity="${rayOp}"/>
        <circle cx="0" cy="-6" r="13" fill="#FB7185" opacity="0.9"/>
        <!-- Dos dedos juntos sobre el lente brillando en rojo vivo -->
        <rect x="-13" y="-22" width="12" height="24" rx="6" fill="${isLit ? "#EF4444" : "#FDBA74"}" stroke="${S}" stroke-width="3.5"/>
        <rect x="1" y="-24" width="12" height="26" rx="6" fill="${isLit ? "#DC2626" : "#FDBA74"}" stroke="${S}" stroke-width="3.5"/>
        <!-- Red capilar interna iluminada -->
        ${isLit ? `<path d="M -7,-18 Q -5,-10 -8,-4 M 7,-20 Q 5,-10 8,-4" fill="none" stroke="#FEF08A" stroke-width="2" stroke-linecap="round"/>` : ""}
        <!-- Cuerpo metálico de la linterna táctica debajo -->
        <path d="M -14,2 L 14,2 L 10,12 L -10,12 Z" fill="#475569" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
        <rect x="-9" y="12" width="18" height="22" rx="3" fill="#1E293B" stroke="${S}" stroke-width="4"/>
        <circle cx="0" cy="21" r="3.5" fill="${isLit ? "#22C55E" : "#EF4444"}" stroke="${S}" stroke-width="2"/>
      </g>`;
    },
    tags: ["linterna", "transiluminacion", "dedos", "rojo", "experimento", "luz"],
  },
  chile_habanero_fuego_vivo: {
    id: "chile_habanero_fuego_vivo",
    name: "Chile Habanero Rojo con Llamas de Fuego Activo",
    family: "naturaleza_alimentos",
    defaultPlacement: "right",
    svg: `<path d="M -12,-16 C -20,0 -8,18 0,24 C 8,18 20,0 12,-16 Z" fill="#EF4444" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isCombustion = currentState === "combustion" || (currentState === undefined && f >= 75);
      const flameScale = (isCombustion ? 1.18 : 0.92) + Math.sin(f * 0.28) * 0.14;
      const dropY = (f * 1.4) % 18;
      return `<g transform="scale(1.85)">
        <!-- Aura de calor y llamas traseras animadas -->
        <g transform="scale(${flameScale.toFixed(2)})">
          <path d="M -24,-8 Q -32,-34 -14,-38 Q 0,-48 10,-32 Q 26,-40 24,-12 Z" fill="#FFE600" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M -16,-6 Q -22,-26 -8,-30 Q 2,-38 8,-24 Q 18,-30 18,-8 Z" fill="#F97316" stroke="${S}" stroke-width="2.5" stroke-linejoin="round"/>
        </g>
        <!-- Cuerpo voluminoso del chile habanero con pliegues neo-brutalistas -->
        <path d="M -16,-14 C -24,2 -14,22 0,30 C 14,22 24,2 16,-14 C 10,-18 -10,-18 -16,-14 Z" fill="#EF4444" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -6,-12 Q -10,4 -4,20" fill="none" stroke="#991B1B" stroke-width="3" stroke-linecap="round"/>
        <path d="M 6,-12 Q 10,4 4,20" fill="none" stroke="#991B1B" stroke-width="3" stroke-linecap="round"/>
        <path d="M -10,-8 Q -13,4 -8,14" fill="none" stroke="#FCA5A5" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Cáliz y tallo verde curvo -->
        <path d="M -10,-14 Q 0,-20 10,-14 L 6,-10 Q 0,-13 -6,-10 Z" fill="#16A34A" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M 0,-16 Q 4,-30 16,-26" fill="none" stroke="#16A34A" stroke-width="6" stroke-linecap="round"/>
        <path d="M 0,-16 Q 4,-30 16,-26" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Gotas de aceite de capsaicina rezumando -->
        ${isCombustion ? `<g>
          <circle cx="-18" cy="${(-2 + dropY).toFixed(1)}" r="3.5" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
          <circle cx="19" cy="${(4 + ((dropY + 9) % 18)).toFixed(1)}" r="3" fill="#EF4444" stroke="${S}" stroke-width="2"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["chile", "habanero", "picante", "fuego", "capsaicina", "comida"],
  },

  termometro_lengua_cero_cambio: {
    id: "termometro_lengua_cero_cambio",
    name: "Termómetro Clínico Digital Marcando 36.5 Grados",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-30" y="-12" width="60" height="24" rx="6" fill="#F8FAFC" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isVerified = currentState === "verificado_normal" || (currentState === undefined && f >= 90);
      const pulse = (0.7 + Math.sin(f * 0.18) * 0.3).toFixed(2);
      return `<g transform="scale(1.85)">
        <!-- Punta metálica sensor a la izquierda con ondas de escaneo -->
        <rect x="-42" y="-5" width="12" height="10" rx="3" fill="#94A3B8" stroke="${S}" stroke-width="3.5"/>
        <path d="M -46,-10 Q -52,0 -46,10" fill="none" stroke="#22C55E" stroke-width="3" stroke-linecap="round" opacity="${pulse}"/>
        <!-- Carcasa del termómetro clínico digital -->
        <path d="M -32,-16 L 26,-18 C 34,-18 38,-12 38,0 C 38,12 34,18 26,18 L -32,16 Z" fill="#F8FAFC" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
        <rect x="24" y="-10" width="8" height="20" rx="2" fill="#3B82F6" stroke="${S}" stroke-width="2.5"/>
        <!-- Pantalla LCD retroiluminada en verde esmeralda -->
        <rect x="-24" y="-10" width="44" height="20" rx="3" fill="${isVerified ? "#064E3B" : "#1E293B"}" stroke="${S}" stroke-width="3"/>
        <text x="-2" y="5" font-family="'Impact', 'Arial Black', sans-serif" font-size="12.5" font-weight="900" fill="#4ADE80" text-anchor="middle">36.5°C</text>
        <!-- Insignia superior de check médico sin daño térmico -->
        ${isVerified ? `<g transform="translate(0, -26)">
          <circle cx="0" cy="0" r="10" fill="#22C55E" stroke="${S}" stroke-width="3"/>
          <path d="M -4,0 L -1,3 L 5,-3" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["termometro", "temperatura", "normal", "falso_fuego", "quimica", "boca"],
  },

  receptor_trpv1_candado_termico: {
    id: "receptor_trpv1_candado_termico",
    name: "Receptor Térmico TRPV1 con Compuerta de Calor",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<rect x="-24" y="-20" width="48" height="40" rx="8" fill="#8B5CF6" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isHacked = currentState === "abierto_alarma" || (currentState === undefined && f >= 85);
      const gateShift = isHacked ? 9 + Math.sin(f * 0.25) * 2 : 2;
      const ionY = -22 + ((f * 2.2) % 42);
      return `<g transform="scale(1.85)">
        <!-- Bicapa lipídica de la membrana nerviosa -->
        <rect x="-36" y="4" width="72" height="18" rx="4" fill="#F472B6" stroke="${S}" stroke-width="4"/>
        <line x1="-32" y1="13" x2="32" y2="13" stroke="#BE185D" stroke-width="2.5" stroke-dasharray="4,4"/>
        <!-- Compuertas proteicas izquierda y derecha del canal TRPV1 -->
        <g transform="translate(${(-gateShift).toFixed(1)}, 0)">
          <rect x="-18" y="-16" width="15" height="36" rx="6" fill="#7C3AED" stroke="${S}" stroke-width="4"/>
          <rect x="-14" y="-11" width="5" height="18" rx="2" fill="#C4B5FD"/>
        </g>
        <g transform="translate(${gateShift.toFixed(1)}, 0)">
          <rect x="3" y="-16" width="15" height="36" rx="6" fill="#7C3AED" stroke="${S}" stroke-width="4"/>
          <rect x="7" y="-11" width="5" height="18" rx="2" fill="#C4B5FD"/>
        </g>
        <!-- Molécula llave de capsaicina acoplada y flujo de iones Ca2+ -->
        <polygon points="0,-16 -7,-28 0,-24 7,-28" fill="#EF4444" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        ${isHacked ? `<g>
          <circle cx="0" cy="${ionY.toFixed(1)}" r="4.5" fill="#FFE600" stroke="${S}" stroke-width="2"/>
          <circle cx="0" cy="${((ionY + 18) % 42 - 22).toFixed(1)}" r="4" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["receptor", "trpv1", "calor", "canal_ionico", "neurona", "biologia"],
  },

  vaso_agua_esparce_aceite: {
    id: "vaso_agua_esparce_aceite",
    name: "Vaso de Agua Esparciendo Gotas de Aceite Picante",
    family: "vida_cotidiana",
    defaultPlacement: "overhead",
    svg: `<path d="M -16,-22 L -12,20 L 12,20 L 16,-22 Z" fill="#38BDF8" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isRepelled = currentState === "esparciendo_error" || (currentState === undefined && f >= 80);
      const spreadX = isRepelled ? 11 + Math.sin(f * 0.26) * 4 : 4 + Math.sin(f * 0.16) * 2;
      const ripple = Math.sin(f * 0.22) * 2.5;
      return `<g transform="scale(1.85)">
        <!-- Vaso de cristal con agua helada -->
        <polygon points="-20,-22 -15,24 15,24 20,-22" fill="#E0F2FE" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
        <polygon points="-18,-8 -13,21 13,21 18,-8" fill="#38BDF8" opacity="0.75"/>
        <path d="M -18,-8 Q -9,${-11 + ripple} 0,-8 T 18,-8" fill="none" stroke="#0284C7" stroke-width="3.5"/>
        <!-- Gotas de aceite de capsaicina insolubles repeliéndose hacia los bordes -->
        <circle cx="${(-spreadX).toFixed(1)}" cy="${(-8 + ripple).toFixed(1)}" r="5.5" fill="#EF4444" stroke="${S}" stroke-width="2.5"/>
        <circle cx="${spreadX.toFixed(1)}" cy="${(-7 - ripple).toFixed(1)}" r="6" fill="#F97316" stroke="${S}" stroke-width="2.5"/>
        <circle cx="0" cy="${(-12 + ripple * 0.6).toFixed(1)}" r="4.5" fill="#EF4444" stroke="${S}" stroke-width="2.5"/>
        <!-- Aspa roja de error químico -->
        ${isRepelled ? `<g>
          <line x1="-22" y1="-16" x2="22" y2="18" stroke="#EF4444" stroke-width="7" stroke-linecap="round"/>
          <line x1="-22" y1="-16" x2="22" y2="18" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="22" y1="-16" x2="-22" y2="18" stroke="#EF4444" stroke-width="7" stroke-linecap="round"/>
          <line x1="22" y1="-16" x2="-22" y2="18" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>
        </g>` : ""}
      </g>`;
    },
    tags: ["vaso", "agua", "aceite", "empeora", "error", "capsaicina"],
  },

  brik_leche_caseina_detergente: {
    id: "brik_leche_caseina_detergente",
    name: "Envase de Leche Entera con Proteína Caseína Salvadora",
    family: "naturaleza_alimentos",
    defaultPlacement: "overhead",
    svg: `<rect x="-18" y="-20" width="36" height="40" rx="3" fill="#F8FAFC" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isTrapping = currentState === "encapsulando_capsaicina" || (currentState === undefined && f >= 80);
      const rotMicelle = (f * 2.5) % 360;
      const orbitR = isTrapping ? 9 : 15;
      return `<g transform="scale(1.85)">
        <!-- Envase Brik de leche a la izquierda inclinado vertiendo caseína -->
        <g transform="translate(-14, 2) rotate(14)">
          <polygon points="-13,-12 -8,-22 8,-22 13,-12 13,20 -13,20" fill="#FFFFFF" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
          <rect x="-13" y="-2" width="26" height="16" fill="#2563EB" stroke="${S}" stroke-width="3"/>
          <path d="M -8,-22 L 0,-12 L 8,-22" fill="none" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        </g>
        <!-- Micela de caseína actuando como detergente sobre la gota roja de capsaicina -->
        <g transform="translate(15, -2)">
          <circle cx="0" cy="0" r="14" fill="#DBEAFE" stroke="#2563EB" stroke-width="3" stroke-dasharray="5,3"/>
          <circle cx="0" cy="0" r="6.5" fill="#EF4444" stroke="${S}" stroke-width="2.5"/>
          <g transform="rotate(${rotMicelle})">
            <circle cx="${orbitR}" cy="0" r="3.5" fill="#FFE600" stroke="${S}" stroke-width="2"/>
            <circle cx="${-orbitR}" cy="0" r="3.5" fill="#FFE600" stroke="${S}" stroke-width="2"/>
            <circle cx="0" cy="${orbitR}" r="3.5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
            <circle cx="0" cy="${-orbitR}" r="3.5" fill="#38BDF8" stroke="${S}" stroke-width="2"/>
          </g>
        </g>
      </g>`;
    },
    tags: ["leche", "caseina", "detergente", "micela", "alivio", "proteina"],
  },

  vaso_leche_alivio_fresco: {
    id: "vaso_leche_alivio_fresco",
    name: "Vaso de Leche Fría con Hielo y Alivio Total",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<polygon points="-16,-22 -12,22 12,22 16,-22" fill="#F8FAFC" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const sparkle = (0.65 + Math.sin(f * 0.22) * 0.35).toFixed(2);
      const bob = (Math.sin(f * 0.16) * 2.5).toFixed(1);
      return `<g transform="scale(1.85)">
        <!-- Aura circular refrescante -->
        <circle cx="0" cy="0" r="28" fill="#6EE7B7" opacity="0.25"/>
        <!-- Pajita rayada -->
        <line x1="6" y1="-30" x2="-4" y2="12" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/>
        <line x1="6" y1="-30" x2="-4" y2="12" stroke="${S}" stroke-width="2" stroke-linecap="round"/>
        <!-- Vaso de leche cremosa fría -->
        <polygon points="-18,-20 -13,24 13,24 18,-20" fill="#FFFFFF" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
        <polygon points="-16,-10 -12,21 12,21 16,-10" fill="#F1F5F9"/>
        <!-- Cubitos de hielo flotando -->
        <g transform="translate(0, ${bob})">
          <rect x="-10" y="-13" width="9" height="9" rx="2" fill="#BAE6FD" stroke="${S}" stroke-width="2.5" transform="rotate(-10 -5 -8)"/>
          <rect x="2" y="-11" width="9" height="9" rx="2" fill="#BAE6FD" stroke="${S}" stroke-width="2.5" transform="rotate(12 6 -6)"/>
        </g>
        <!-- Destellos estelares de frescura -->
        <polygon points="22,-18 24,-12 30,-10 24,-8 22,-2 20,-8 14,-10 20,-12" fill="#FFE600" stroke="${S}" stroke-width="2" opacity="${sparkle}"/>
        <polygon points="-22,-6 -20,-2 -16,0 -20,2 -22,6 -24,2 -28,0 -24,-2" fill="#38BDF8" stroke="${S}" stroke-width="1.8" opacity="${sparkle}"/>
      </g>`;
    },
    tags: ["vaso", "leche", "fria", "hielo", "alivio", "frescura", "picante"],
  },

  // =========================================================================
  // PROPS: TU MEMORIA TE MIENTE (FALSOS RECUERDOS Y RECONSOLIDACIÓN)
  // =========================================================================

  libreta_policia_boligrafo: {
    id: "libreta_policia_boligrafo",
    name: "Libreta de Detective con Placa y Bolígrafo",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-25" width="36" height="50" rx="4" fill="#0F172A" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const penBob = (Math.sin(f * 0.25) * 3).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Libreta azul marino oscuro -->
        <rect x="-18" y="-26" width="36" height="52" rx="4" fill="#0F172A" stroke="${S}" stroke-width="4"/>
        <!-- Espiral metálico superior -->
        ${[-12, -6, 0, 6, 12].map(sx => `<circle cx="${sx}" cy="-26" r="3" fill="#94A3B8" stroke="${S}" stroke-width="1.5"/>`).join("")}
        <!-- Hoja interior amarilla con líneas de anotación -->
        <rect x="-14" y="-20" width="28" height="42" rx="2" fill="#FEF3C7" stroke="${S}" stroke-width="2"/>
        <line x1="-10" y1="-12" x2="6" y2="-12" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
        <line x1="-10" y1="-4" x2="8" y2="-4" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
        <line x1="-10" y1="4" x2="4" y2="4" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
        <line x1="-10" y1="12" x2="9" y2="12" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
        <!-- Placa dorada miniatura de detective -->
        <polygon points="12,-16 16,-10 12,-4 8,-10" fill="#FACC15" stroke="${S}" stroke-width="1.5"/>
        <!-- Bolígrafo oscilando tomando notas -->
        <g transform="translate(14, ${penBob}) rotate(-28)">
          <rect x="-2.5" y="-18" width="5" height="24" rx="2" fill="#E2E8F0" stroke="${S}" stroke-width="2"/>
          <polygon points="-2.5,6 2.5,6 0,14" fill="#1E293B" stroke="${S}" stroke-width="1.5"/>
          <circle cx="0" cy="14" r="1.5" fill="#3B82F6"/>
        </g>
        <rect x="-24" y="30" width="48" height="11" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="38" font-family="'Impact', 'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FFF" text-anchor="middle">NOTAS: CHOQUE</text>
      </g>`;
    },
    tags: ["policia", "detective", "libreta", "boligrafo", "anotacion", "investigacion", "choque"],
  },

  gorra_detective_policia: {
    id: "gorra_detective_policia",
    name: "Gorra de Detective con Placa Dorada",
    family: "vida_cotidiana",
    defaultPlacement: "overhead",
    svg: `<path d="M -30,0 C -30,-22 30,-22 30,0 Z" fill="#0F172A" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const glint = (0.7 + Math.sin(f * 0.18) * 0.3).toFixed(2);
      return `<g transform="scale(1.85) translate(0, -6)">
        <!-- Copa de la gorra -->
        <path d="M -28,-2 C -32,-24 32,-24 28,-2 Z" fill="#0F172A" stroke="${S}" stroke-width="4"/>
        <path d="M -24,-2 C -28,-20 28,-20 24,-2 Z" fill="#1E293B"/>
        <!-- Visera rígida delantera -->
        <path d="M -28,-2 Q 0,8 34,-2 Q 0,-4 -28,-2 Z" fill="#020617" stroke="${S}" stroke-width="3.5"/>
        <!-- Cinta y cordón dorado -->
        <rect x="-26" y="-6" width="52" height="4" rx="2" fill="#FACC15" stroke="${S}" stroke-width="1.5"/>
        <!-- Escudo / Placa dorada frontal -->
        <polygon points="0,-20 8,-12 0,-4 -8,-12" fill="#F59E0B" stroke="${S}" stroke-width="2" opacity="${glint}"/>
        <circle cx="0" cy="-12" r="2.5" fill="#FEF08A"/>
      </g>`;
    },
    tags: ["gorra", "detective", "policia", "placa", "sombrero", "investigador"],
  },

  proyeccion_cristales_rotos_falsos: {
    id: "proyeccion_cristales_rotos_falsos",
    name: "Nube de Cristales Rotos Falsos Holográficos",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<polygon points="-10,-10 10,-15 15,10 -8,12" fill="#38BDF8" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const pulse = (0.75 + Math.sin(f * 0.3) * 0.25).toFixed(2);
      const bob1 = (Math.sin(f * 0.15) * 4).toFixed(1);
      const bob2 = (Math.cos(f * 0.18) * 4).toFixed(1);
      const bob3 = (Math.sin(f * 0.22 + 1) * 5).toFixed(1);
      return `<g transform="scale(1.7)">
        <!-- Resplandor de advertencia roja (ilusión) -->
        <circle cx="0" cy="0" r="32" fill="#EF4444" opacity="0.18"/>
        <!-- Cristales afilados cayendo en cámara lenta -->
        <polygon points="-22,${-14 + Number(bob1)} -10,${-28 + Number(bob1)} -4,${-12 + Number(bob1)} -16,${-4 + Number(bob1)}" fill="#38BDF8" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="12,${-24 + Number(bob2)} 26,${-16 + Number(bob2)} 18,${-4 + Number(bob2)} 6,${-14 + Number(bob2)}" fill="#BAE6FD" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="-8,${8 + Number(bob3)} 6,${2 + Number(bob3)} 14,${18 + Number(bob3)} -4,${22 + Number(bob3)}" fill="#0284C7" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="-20,${12 + Number(bob2)} -8,${22 + Number(bob2)} -14,${28 + Number(bob2)}" fill="#E0F2FE" stroke="${S}" stroke-width="2.5"/>
        <polygon points="16,${10 + Number(bob1)} 28,${16 + Number(bob1)} 20,${26 + Number(bob1)}" fill="#67E8F9" stroke="${S}" stroke-width="2.5"/>
        <!-- Destellos brillantes -->
        <polygon points="0,-18 2,-12 8,-10 2,-8 0,-2 -2,-8 -8,-10 -2,-12" fill="#FFFFFF" opacity="${pulse}"/>
        <!-- Cartel de advertencia: JAMÁS EXISTIÓ -->
        <rect x="-30" y="32" width="60" height="13" rx="4" fill="#DC2626" stroke="${S}" stroke-width="3"/>
        <text x="0" y="41" font-family="'Impact', 'Arial Black', sans-serif" font-size="7.5" font-weight="900" fill="#FEF08A" text-anchor="middle">¡VIDRIO FALSO!</text>
      </g>`;
    },
    tags: ["cristales", "vidrio", "rotos", "holograma", "falso", "choque", "memoria"],
  },

  casete_vhs_dorado_recuerdo: {
    id: "casete_vhs_dorado_recuerdo",
    name: "Casete VHS Dorado Recuerdo Original",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-16" width="48" height="32" rx="3" fill="#D97706" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const rot = (f * 4) % 360;
      const glow = (0.75 + Math.sin(f * 0.2) * 0.25).toFixed(2);
      return `<g transform="scale(1.8)">
        <!-- Carcasa dorada metalizada -->
        <rect x="-26" y="-17" width="52" height="34" rx="4" fill="#D97706" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
        <rect x="-23" y="-14" width="46" height="28" rx="2" fill="#F59E0B"/>
        <!-- Ventanilla acrílica central -->
        <rect x="-18" y="-7" width="36" height="14" rx="2" fill="#0F172A" stroke="${S}" stroke-width="2.5"/>
        <!-- Dos carretes circulares giratorios -->
        <g transform="translate(-8, 0) rotate(${rot})">
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#000" stroke-width="1.5"/>
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#000" stroke-width="1.5"/>
        </g>
        <g transform="translate(8, 0) rotate(${rot})">
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
          <line x1="-5" y1="0" x2="5" y2="0" stroke="#000" stroke-width="1.5"/>
          <line x1="0" y1="-5" x2="0" y2="5" stroke="#000" stroke-width="1.5"/>
        </g>
        <!-- Cinta magnética visible entre carretes -->
        <rect x="-3" y="-2" width="6" height="4" fill="#1C1917"/>
        <!-- Etiqueta adhesiva manuscrita -->
        <rect x="-20" y="-14" width="40" height="6" fill="#F8FAFC" stroke="${S}" stroke-width="1.5"/>
        <text x="0" y="-9.5" font-family="'Arial Black', sans-serif" font-size="4" font-weight="900" fill="#DC2626" text-anchor="middle">RECUERDO ORIGINAL</text>
        <!-- Rótulo inferior VHS -->
        <rect x="-26" y="21" width="52" height="11" rx="3" fill="#020617" stroke="${S}" stroke-width="2.5" opacity="${glow}"/>
        <text x="0" y="29" font-family="'Impact', 'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FDE047" text-anchor="middle">★ CINTA VHS 1974 ★</text>
      </g>`;
    },
    tags: ["vhs", "cinta", "casete", "dorado", "recuerdo", "memoria", "original", "archivo"],
  },

  hoja_manuscrito_lapiz_goma: {
    id: "hoja_manuscrito_lapiz_goma",
    name: "Hoja de Memoria con Lápiz y Goma Borrando",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-24" width="36" height="48" rx="3" fill="#FEF3C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const eraserX = (Math.sin(f * 0.35) * 6).toFixed(1);
      const shavings = (Math.sin(f * 0.4) * 3).toFixed(1);
      return `<g transform="scale(1.8)">
        <!-- Hoja de papel pergamino antigua -->
        <rect x="-19" y="-25" width="38" height="50" rx="3" fill="#FEF3C7" stroke="${S}" stroke-width="4"/>
        <!-- Esquina doblada -->
        <polygon points="12,-25 19,-18 12,-18" fill="#FDE68A" stroke="${S}" stroke-width="2"/>
        <!-- Líneas manuscritas con tachón borrado -->
        <line x1="-13" y1="-15" x2="11" y2="-15" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
        <line x1="-13" y1="-8" x2="6" y2="-8" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
        <!-- Zona borrada con virutas -->
        <rect x="-13" y="-3" width="22" height="6" rx="2" fill="#FFFFFF" opacity="0.8"/>
        <line x1="-13" y1="0" x2="9" y2="0" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="3 3"/>
        <line x1="-13" y1="8" x2="12" y2="8" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="-13" y1="16" x2="4" y2="16" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
        <!-- Virutas de goma flotando -->
        <circle cx="${-6 + Number(shavings)}" cy="2" r="1.5" fill="#F43F5E"/>
        <circle cx="${2 - Number(shavings)}" cy="3" r="1.2" fill="#F43F5E"/>
        <circle cx="${8 + Number(shavings)}" cy="1" r="1.5" fill="#3B82F6"/>
        <!-- Lápiz grafito con goma borrando con frenesí -->
        <g transform="translate(${eraserX}, 0) rotate(35)">
          <rect x="-3" y="-22" width="6" height="20" rx="1" fill="#FACC15" stroke="${S}" stroke-width="2"/>
          <polygon points="-3,-2 3,-2 0,6" fill="#FED7AA" stroke="${S}" stroke-width="1.5"/>
          <polygon points="-1,4 1,4 0,6" fill="#0F172A"/>
          <!-- Goma rosa superior -->
          <rect x="-3" y="-26" width="6" height="5" rx="1.5" fill="#F43F5E" stroke="${S}" stroke-width="1.5"/>
          <rect x="-3" y="-22" width="6" height="2" fill="#94A3B8"/>
        </g>
        <!-- Rótulo inferior REESCRIBIENDO -->
        <rect x="-24" y="29" width="48" height="11" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="37" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#FFF" text-anchor="middle">REESCRIBIENDO...</text>
      </g>`;
    },
    tags: ["papel", "hoja", "lapiz", "goma", "borrar", "reescribir", "hipocampo", "memoria"],
  },

  sello_tinta_reconsolidado: {
    id: "sello_tinta_reconsolidado",
    name: "Sello de Tinta Roja RECONSOLIDADO",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-16" y="-12" width="32" height="24" rx="3" fill="#DC2626" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const stampBob = Math.abs(Math.sin(f * 0.28) * 5).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Mango de madera del sello -->
        <g transform="translate(0, ${-stampBob})">
          <ellipse cx="0" cy="-24" rx="7" ry="9" fill="#92400E" stroke="${S}" stroke-width="3"/>
          <path d="M -5,-16 L -3,-6 L 3,-6 L 5,-16 Z" fill="#B45309" stroke="${S}" stroke-width="2.5"/>
          <!-- Base metálica y almohadilla -->
          <rect x="-16" y="-6" width="32" height="6" rx="2" fill="#E2E8F0" stroke="${S}" stroke-width="2.5"/>
          <rect x="-17" y="0" width="34" height="4" rx="1" fill="#DC2626" stroke="${S}" stroke-width="1.5"/>
        </g>
        <!-- Huella estampada en papel abajo -->
        <g transform="translate(0, 16) rotate(-4)">
          <rect x="-26" y="-8" width="52" height="16" rx="3" fill="#FEE2E2" stroke="#DC2626" stroke-width="3" stroke-dasharray="1 0"/>
          <rect x="-23" y="-6" width="46" height="12" rx="1.5" fill="none" stroke="#DC2626" stroke-width="1.5"/>
          <text x="0" y="2.5" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#DC2626" text-anchor="middle">★ RECONSOLIDADO ★</text>
        </g>
      </g>`;
    },
    tags: ["sello", "tinta", "reconsolidado", "estampa", "documento", "hipocampo", "edicion"],
  },

  tarjetas_loftus_contactaron_estrellaron: {
    id: "tarjetas_loftus_contactaron_estrellaron",
    name: "Tarjetas Comparativas Loftus: Contactaron vs Se Estrellaron",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-14" width="44" height="28" rx="3" fill="#EF4444" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const redPulse = (1.0 + Math.sin(f * 0.25) * 0.08).toFixed(2);
      return `<g transform="scale(1.7)">
        <!-- Tarjeta verde: CONTACTARON (Baja velocidad) -->
        <g transform="translate(-14, 4) rotate(-10)">
          <rect x="-18" y="-15" width="36" height="30" rx="3" fill="#DCFCE7" stroke="${S}" stroke-width="3"/>
          <rect x="-16" y="-13" width="32" height="8" rx="2" fill="#22C55E"/>
          <text x="0" y="-7.5" font-family="'Arial Black', sans-serif" font-size="4.2" font-weight="900" fill="#FFFFFF" text-anchor="middle">CONTACTARON</text>
          <text x="0" y="4" font-family="'Impact', sans-serif" font-size="8.5" font-weight="900" fill="#15803D" text-anchor="middle">50 km/h</text>
          <text x="0" y="11" font-family="'Arial', sans-serif" font-size="4" font-weight="900" fill="#166534" text-anchor="middle">0% Vidrios rotos</text>
        </g>
        <!-- Tarjeta roja gigante dominante: SE ESTRELLARON (Alta velocidad e implanta vidrios) -->
        <g transform="translate(14, -2) rotate(8) scale(${redPulse})">
          <rect x="-20" y="-18" width="40" height="36" rx="4" fill="#FEE2E2" stroke="#000000" stroke-width="4"/>
          <rect x="-18" y="-16" width="36" height="10" rx="2" fill="#DC2626"/>
          <text x="0" y="-9" font-family="'Arial Black', sans-serif" font-size="4.5" font-weight="900" fill="#FEF08A" text-anchor="middle">¡SE ESTRELLARON!</text>
          <text x="0" y="4" font-family="'Impact', sans-serif" font-size="10" font-weight="900" fill="#B91C1C" text-anchor="middle">65 km/h</text>
          <rect x="-16" y="8" width="32" height="7" rx="2" fill="#DC2626"/>
          <text x="0" y="13.5" font-family="'Impact', sans-serif" font-size="4.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">¡JURAN VER VIDRIOS!</text>
        </g>
      </g>`;
    },
    tags: ["tarjetas", "loftus", "experimento", "contactaron", "estrellaron", "velocidad", "sesgo"],
  },

  rompecabezas_madera_plastilina: {
    id: "rompecabezas_madera_plastilina",
    name: "Rompecabezas con Parche de Plastilina y Pincel",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-18" width="36" height="36" rx="4" fill="#B45309" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const squish = (Math.sin(f * 0.28) * 1.5).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Tablero de madera del rompecabezas -->
        <rect x="-22" y="-20" width="44" height="40" rx="4" fill="#B45309" stroke="${S}" stroke-width="4"/>
        <rect x="-18" y="-16" width="36" height="32" rx="2" fill="#D97706"/>
        <!-- Pieza faltante triangular / hueco negro -->
        <polygon points="-6,-6 10,-6 2,10" fill="#451A03" stroke="${S}" stroke-width="2"/>
        <!-- Parche de plastilina blanca moldeándose para encajar -->
        <g transform="translate(0, ${squish})">
          <polygon points="-5,-5 9,-5 2,9" fill="#F8FAFC" stroke="${S}" stroke-width="2.5"/>
          <!-- Mancha de acuarela fresca simulando el dibujo original -->
          <circle cx="2" cy="0" r="3.5" fill="#38BDF8"/>
          <!-- Huella dactilar presionando -->
          <ellipse cx="2" cy="0" rx="2.5" ry="1.5" fill="none" stroke="#94A3B8" stroke-width="1"/>
        </g>
        <!-- Pincel fino con cerdas húmedas -->
        <g transform="translate(14, -8) rotate(40)">
          <rect x="-1.5" y="-16" width="3" height="20" rx="1" fill="#78350F" stroke="${S}" stroke-width="1.5"/>
          <rect x="-2" y="4" width="4" height="4" fill="#94A3B8"/>
          <polygon points="-2,8 2,8 0,14" fill="#0284C7" stroke="${S}" stroke-width="1"/>
        </g>
        <!-- Rótulo inferior CONFABULACIÓN -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#FFF" text-anchor="middle">RELLENO AUTOMÁTICO</text>
      </g>`;
    },
    tags: ["rompecabezas", "plastilina", "pincel", "confabulacion", "relleno", "memoria", "truco"],
  },

  album_fotos_familiar_cuero: {
    id: "album_fotos_familiar_cuero",
    name: "Álbum de Fotos con Perro Verde y Recuerdos",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<rect x="-24" y="-18" width="48" height="36" rx="4" fill="#78350F" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const pageTurn = (Math.sin(f * 0.12) * 2).toFixed(1);
      return `<g transform="scale(1.8)">
        <!-- Cubierta de cuero marrón oscuro abierta -->
        <rect x="-28" y="-20" width="56" height="40" rx="4" fill="#451A03" stroke="${S}" stroke-width="4"/>
        <!-- Páginas interiores de papel crema -->
        <rect x="-25" y="-17" width="24" height="34" rx="2" fill="#FEF3C7" stroke="${S}" stroke-width="2"/>
        <rect x="1" y="-17" width="24" height="34" rx="2" fill="#FEF3C7" stroke="${S}" stroke-width="2"/>
        <!-- Lomo central encuadernado -->
        <line x1="0" y1="-19" x2="0" y2="19" stroke="${S}" stroke-width="3"/>
        <!-- Foto izquierda: Stickman niño sonriente -->
        <g transform="translate(-13, 0)">
          <rect x="-9" y="-12" width="18" height="22" rx="1.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
          <circle cx="0" cy="-4" r="4.5" fill="#FED7AA" stroke="${S}" stroke-width="1.5"/>
          <path d="M -3,-3 Q 0,-1 3,-3" fill="none" stroke="${S}" stroke-width="1.2"/>
          <rect x="-4" y="1" width="8" height="6" fill="#3B82F6" stroke="${S}" stroke-width="1.2"/>
        </g>
        <!-- Foto derecha: ¡El perro verde absurdo inventado por la memoria! -->
        <g transform="translate(13, ${pageTurn})">
          <rect x="-9" y="-12" width="18" height="22" rx="1.5" fill="#FFFFFF" stroke="${S}" stroke-width="1.5"/>
          <!-- Perro verde caricaturesco -->
          <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#22C55E" stroke="${S}" stroke-width="1.5"/>
          <circle cx="5" cy="-3" r="3.5" fill="#22C55E" stroke="${S}" stroke-width="1.5"/>
          <!-- Oreja caída -->
          <path d="M 4,-5 C 7,-7 8,-2 6,-1 Z" fill="#15803D" stroke="${S}" stroke-width="1"/>
          <!-- Ojo y hocico -->
          <circle cx="6" cy="-4" r="0.8" fill="#000"/>
          <circle cx="8" cy="-2.5" r="1" fill="#000"/>
          <!-- Patas y cola feliz -->
          <line x1="-3" y1="4" x2="-3" y2="7" stroke="${S}" stroke-width="1.5" stroke-linecap="round"/>
          <line x1="3" y1="4" x2="3" y2="7" stroke="${S}" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M -6,-1 Q -9,-5 -8,-8" fill="none" stroke="${S}" stroke-width="1.5" stroke-linecap="round"/>
          <!-- Etiqueta manuscrita cómica -->
          <text x="0" y="8" font-family="'Arial Black', sans-serif" font-size="2.8" font-weight="900" fill="#15803D" text-anchor="middle">¿PERRO VERDE?</text>
        </g>
        <!-- Rótulo inferior ÁLBUM MENTAL -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="#D97706" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FFF" text-anchor="middle">ÁLBUM DE RECUERDOS</text>
      </g>`;
    },
    tags: ["album", "fotos", "perro", "verde", "recuerdos", "infancia", "familia", "memoria"],
  },

  cartel_prision_eterna_roto: {
    id: "cartel_prision_eterna_roto",
    name: "Cartel de Prisión Eterna Quebrado con Radiación",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-18" width="48" height="36" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const crackOffset = (Math.sin(f * 0.25) * 1.5).toFixed(1);
      const dripY = ((f * 1.8) % 30).toFixed(1);
      const glowPulse = (0.7 + Math.sin(f * 0.2) * 0.3).toFixed(2);
      return `<g transform="scale(1.7)">
        <!-- Poste de soporte de hierro -->
        <rect x="-3" y="10" width="6" height="42" fill="#1E293B" stroke="${S}" stroke-width="3"/>
        
        <!-- Mitad izquierda del cartel rota -->
        <g transform="translate(-1, 0) rotate(-4)">
          <path d="M -30,-22 L -2,-22 L -6,-2 L 2,4 L -4,14 L -30,14 Z" fill="#EF4444" stroke="${S}" stroke-width="3.5"/>
          <text x="-16" y="-6" font-family="'Impact', 'Arial Black', sans-serif" font-size="8" font-weight="900" fill="#FFF">PRI-</text>
          <text x="-16" y="4" font-family="'Impact', 'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FEF08A">SIÓN</text>
        </g>

        <!-- Mitad derecha del cartel rota y desplazada -->
        <g transform="translate(${crackOffset}, ${crackOffset}) rotate(6)">
          <path d="M -2,-22 L 30,-22 L 30,14 L -4,14 L 2,4 L -6,-2 Z" fill="#DC2626" stroke="${S}" stroke-width="3.5"/>
          <text x="5" y="-6" font-family="'Impact', 'Arial Black', sans-serif" font-size="8" font-weight="900" fill="#FFF">ETER-</text>
          <text x="6" y="4" font-family="'Impact', 'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FEF08A">NA</text>
        </g>

        <!-- Rayo de fractura brillante y gotas luminosas escapando -->
        <path d="M -2,-22 L -6,-2 L 2,4 L -4,14" fill="none" stroke="#38BDF8" stroke-width="3"/>
        <circle cx="0" cy="${dripY}" r="3.5" fill="#38BDF8" opacity="${glowPulse}"/>
        <circle cx="5" cy="${(parseFloat(dripY) + 8) % 30}" r="2" fill="#FDE047" opacity="${glowPulse}"/>
        
        <!-- Placa inferior de estado -->
        <rect x="-28" y="22" width="56" height="11" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="30.5" font-family="'Impact', 'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFF" text-anchor="middle">¡TIENE FUGA CUÁNTICA!</text>
      </g>`;
    },
    tags: ["cartel", "prision", "eterna", "roto", "agujero", "negro", "fuga", "hawking", "radiacion"],
  },

  lupa_cuantica_particulas: {
    id: "lupa_cuantica_particulas",
    name: "Lupa Cuántica con Par Partícula-Antipartícula",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="-6" r="20" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const angle = (f * 0.15);
      const orbX = (Math.cos(angle) * 12).toFixed(1);
      const orbY = (Math.sin(angle) * 7).toFixed(1);
      const negX = (-parseFloat(orbX)).toFixed(1);
      const negY = (-parseFloat(orbY)).toFixed(1);
      const pulse = (1 + Math.sin(f * 0.3) * 0.15).toFixed(2);
      return `<g transform="scale(1.75)">
        <!-- Mango metálico resistente -->
        <g transform="translate(18, 18) rotate(45)">
          <rect x="-4" y="0" width="8" height="26" rx="3" fill="#475569" stroke="${S}" stroke-width="3"/>
          <rect x="-3" y="16" width="6" height="8" rx="2" fill="#F59E0B"/>
        </g>
        <!-- Aro exterior de la lupa neo-brutalista -->
        <circle cx="0" cy="-4" r="26" fill="#0F172A" stroke="${S}" stroke-width="4.5"/>
        <circle cx="0" cy="-4" r="22" fill="#0369A1" fill-opacity="0.25" stroke="#38BDF8" stroke-width="2"/>
        
        <!-- Línea del Horizonte de Sucesos cortando el lente -->
        <line x1="-22" y1="-4" x2="22" y2="-4" stroke="#000" stroke-width="3.5" stroke-dasharray="3 2"/>
        <text x="0" y="-8" font-family="'Arial Black', sans-serif" font-size="3" font-weight="900" fill="#94A3B8" text-anchor="middle">HORIZONTE</text>
        
        <!-- Partícula Virtual (+) que escapa al exterior (roja) -->
        <g transform="translate(${orbX}, ${parseFloat(orbY) - 10}) scale(${pulse})">
          <circle cx="0" cy="0" r="5" fill="#EF4444" stroke="${S}" stroke-width="1.8"/>
          <text x="0" y="2.5" font-family="'Arial Black', sans-serif" font-size="5" font-weight="900" fill="#FFF" text-anchor="middle">+</text>
          <!-- Flecha de escape hacia arriba -->
          <line x1="0" y1="-6" x2="0" y2="-12" stroke="#FDE047" stroke-width="2"/>
          <polygon points="-2,-10 2,-10 0,-14" fill="#FDE047"/>
        </g>

        <!-- Antipartícula (-) que cae al abismo (azul/negra) -->
        <g transform="translate(${negX}, ${parseFloat(negY) + 4}) scale(${pulse})">
          <circle cx="0" cy="0" r="5" fill="#3B82F6" stroke="${S}" stroke-width="1.8"/>
          <text x="0" y="2.5" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFF" text-anchor="middle">-</text>
          <!-- Flecha de absorción hacia abajo -->
          <line x1="0" y1="6" x2="0" y2="12" stroke="#38BDF8" stroke-width="2"/>
          <polygon points="-2,10 2,10 0,14" fill="#38BDF8"/>
        </g>

        <!-- Destellos cuánticos -->
        <circle cx="0" cy="-4" r="1.5" fill="#FFF"/>

        <!-- Rótulo inferior -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="#7C3AED" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">PAR VIRTUAL CUÁNTICO</text>
      </g>`;
    },
    tags: ["lupa", "cuantica", "particula", "antiparticula", "par", "vacio", "hawking", "horizonte"],
  },

  libro_historia_universo_fuego: {
    id: "libro_historia_universo_fuego",
    name: "Libro Quemándose con Cenizas y Bits Flotantes",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-16" width="44" height="32" rx="3" fill="#B45309" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const flameH1 = (14 + Math.sin(f * 0.4) * 4).toFixed(1);
      const flameH2 = (18 + Math.cos(f * 0.35) * 5).toFixed(1);
      const smokeY = ((f * 1.5) % 35).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Lomo y tapas del libro quemado -->
        <rect x="-26" y="-14" width="52" height="36" rx="4" fill="#451A03" stroke="${S}" stroke-width="3.5"/>
        <!-- Páginas abiertas ardiendo -->
        <rect x="-23" y="-11" width="22" height="30" rx="2" fill="#FEF3C7" stroke="${S}" stroke-width="1.8"/>
        <rect x="1" y="-11" width="22" height="30" rx="2" fill="#FCD34D" stroke="${S}" stroke-width="1.8"/>
        
        <!-- Texto quemándose visible en páginas -->
        <line x1="-20" y1="-5" x2="-5" y2="-5" stroke="#78350F" stroke-width="1.5"/>
        <line x1="-20" y1="0" x2="-8" y2="0" stroke="#78350F" stroke-width="1.5"/>
        <line x1="-20" y1="5" x2="-6" y2="5" stroke="#78350F" stroke-width="1.5"/>
        <line x1="-20" y1="10" x2="-10" y2="10" stroke="#78350F" stroke-width="1.5"/>

        <line x1="4" y1="-5" x2="19" y2="-5" stroke="#78350F" stroke-width="1.5"/>
        <line x1="4" y1="0" x2="16" y2="0" stroke="#78350F" stroke-width="1.5"/>
        <line x1="4" y1="5" x2="18" y2="5" stroke="#78350F" stroke-width="1.5"/>

        <!-- Fuego animado en el borde superior -->
        <g transform="translate(-10, -12)">
          <path d="M -6,0 Q -8,-${flameH1} 0,-${parseFloat(flameH1) + 4} Q 8,-${flameH1} 6,0 Z" fill="#EF4444"/>
          <path d="M -4,0 Q -5,-${flameH1} 0,-${flameH1} Q 5,-${flameH1} 4,0 Z" fill="#F59E0B"/>
          <path d="M -2,0 Q 0,-${(parseFloat(flameH1) * 0.6).toFixed(1)} 0,-${(parseFloat(flameH1) * 0.7).toFixed(1)} Q 2,-${(parseFloat(flameH1) * 0.6).toFixed(1)} 2,0 Z" fill="#FEF08A"/>
        </g>
        <g transform="translate(8, -12)">
          <path d="M -7,0 Q -9,-${flameH2} 0,-${parseFloat(flameH2) + 5} Q 9,-${flameH2} 7,0 Z" fill="#DC2626"/>
          <path d="M -4,0 Q -6,-${flameH2} 0,-${flameH2} Q 6,-${flameH2} 4,0 Z" fill="#FACC15"/>
        </g>

        <!-- Cenizas y bits flotando en el humo -->
        <g transform="translate(0, -${smokeY})">
          <circle cx="-6" cy="-8" r="1.8" fill="#475569"/>
          <circle cx="8" cy="-14" r="2.2" fill="#334155"/>
          <text x="-12" y="-10" font-family="'Courier New', monospace" font-size="4" font-weight="900" fill="#38BDF8">01</text>
          <text x="10" y="-6" font-family="'Courier New', monospace" font-size="4" font-weight="900" fill="#F59E0B">10</text>
        </g>

        <!-- Rótulo inferior de física cuántica -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#D97706" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#FFF" text-anchor="middle">¿CENIZA CON INFORMACIÓN?</text>
      </g>`;
    },
    tags: ["libro", "fuego", "cenizas", "informacion", "bits", "humo", "cuantica", "quemar"],
  },

  escaner_cuantico_holograma: {
    id: "escaner_cuantico_holograma",
    name: "Escáner Cuántico Reconstruyendo Letras Holográficas",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-16" y="-20" width="32" height="40" rx="4" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const scanBeamY = ((f * 2) % 36).toFixed(1);
      const letterFloat = (Math.sin(f * 0.25) * 2).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Dispositivo de mano futurista -->
        <rect x="-18" y="-26" width="36" height="18" rx="4" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
        <rect x="-14" y="-22" width="28" height="10" rx="2" fill="#1E293B"/>
        <!-- Lente emisor láser -->
        <rect x="-12" y="-8" width="24" height="4" rx="2" fill="#38BDF8"/>
        
        <!-- Cono del haz láser de reconstrucción -->
        <polygon points="-12,-4 12,-4 26,30 -26,30" fill="#0284C7" fill-opacity="0.22" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 3"/>
        
        <!-- Línea de escaneo láser móvil -->
        <line x1="-20" y1="${parseFloat(scanBeamY) - 4}" x2="20" y2="${parseFloat(scanBeamY) - 4}" stroke="#FDE047" stroke-width="2.5"/>

        <!-- Letras holográficas reconstruyéndose en el haz -->
        <g transform="translate(0, ${letterFloat})">
          <text x="-12" y="14" font-family="'Impact', 'Arial Black', sans-serif" font-size="10" font-weight="900" fill="#FACC15" stroke="${S}" stroke-width="0.8">A</text>
          <text x="-2" y="12" font-family="'Impact', 'Arial Black', sans-serif" font-size="11" font-weight="900" fill="#38BDF8" stroke="${S}" stroke-width="0.8">B</text>
          <text x="9" y="15" font-family="'Impact', 'Arial Black', sans-serif" font-size="10" font-weight="900" fill="#4ADE80" stroke="${S}" stroke-width="0.8">C</text>
          
          <!-- Matriz de píxeles/datos flotantes -->
          <circle cx="-16" cy="20" r="1.5" fill="#38BDF8"/>
          <circle cx="16" cy="22" r="1.5" fill="#FACC15"/>
          <line x1="-12" y1="20" x2="12" y2="20" stroke="#38BDF8" stroke-width="1" stroke-dasharray="2 2"/>
        </g>

        <!-- Rótulo inferior RECONSTRUCCIÓN 100% -->
        <rect x="-26" y="26" width="52" height="11" rx="3" fill="#059669" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="34" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">LEYES CUÁNTICAS OK</text>
      </g>`;
    },
    tags: ["escaner", "cuantico", "holograma", "letras", "reconstruccion", "laser", "futurista", "datos"],
  },

  escaner_error_realidad_rota: {
    id: "escaner_error_realidad_rota",
    name: "Escáner en Alarma ERROR 404 Información Destruida",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-22" width="36" height="44" rx="4" fill="#DC2626" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const shake = (Math.sin(f * 0.8) * 2).toFixed(1);
      const blink = (f % 10 < 5) ? "#EF4444" : "#7F1D1D";
      const glitchX = (f % 6 === 0) ? 3 : 0;
      return `<g transform="scale(1.75) translate(${shake}, 0)">
        <!-- Cuerpo del escáner en sobrecalentamiento -->
        <rect x="-20" y="-24" width="40" height="46" rx="4" fill="#18181B" stroke="${S}" stroke-width="3.5"/>
        <!-- Pantalla roja parpadeante de alerta -->
        <rect x="-16" y="-20" width="32" height="26" rx="3" fill="${blink}" stroke="#F87171" stroke-width="2"/>
        
        <!-- Texto de Error Glitch -->
        <g transform="translate(${glitchX}, 0)">
          <text x="0" y="-10" font-family="'Impact', 'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FFF" text-anchor="middle">¡ERROR 404!</text>
          <text x="0" y="-2" font-family="'Courier New', monospace" font-size="4" font-weight="900" fill="#FEF08A" text-anchor="middle">DATOS BORRADOS</text>
        </g>

        <!-- Símbolo de física rota: átomo roto con tachón -->
        <g transform="translate(0, 12)">
          <circle cx="0" cy="0" r="7" fill="none" stroke="#DC2626" stroke-width="2" stroke-dasharray="3 2"/>
          <line x1="-6" y1="-6" x2="6" y2="6" stroke="#EF4444" stroke-width="2.5"/>
          <line x1="6" y1="-6" x2="-6" y2="6" stroke="#EF4444" stroke-width="2.5"/>
        </g>

        <!-- Chispas y humo negro saliendo del escáner -->
        <path d="M 16,-16 L 22,-22 M -16,-16 L -22,-20" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>
        <circle cx="18" cy="-24" r="2" fill="#71717A"/>

        <!-- Rótulo inferior de paradoja -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFF" text-anchor="middle">¡PARADOJA FATAL!</text>
      </g>`;
    },
    tags: ["escaner", "error", "404", "alarma", "glitch", "paradoja", "cuantica", "informacion", "rota"],
  },

  interfaz_piel_holografica_bits: {
    id: "interfaz_piel_holografica_bits",
    name: "Piel Holográfica con Bits de Planck en Superficie 2D",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-24" y="-18" width="48" height="36" rx="4" fill="#065F46" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const bitPulse = (0.7 + Math.sin(f * 0.25) * 0.3).toFixed(2);
      const waveOffset = (Math.sin(f * 0.18) * 1.5).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Malla curva del horizonte de sucesos (2D) -->
        <rect x="-28" y="-22" width="56" height="42" rx="5" fill="#022C22" stroke="${S}" stroke-width="3.5"/>
        <rect x="-25" y="-19" width="50" height="36" rx="3" fill="#064E3B" stroke="#10B981" stroke-width="1.8"/>

        <!-- Líneas de cuadrícula de escala de Planck -->
        <line x1="-25" y1="-7" x2="25" y2="-7" stroke="#059669" stroke-width="1"/>
        <line x1="-25" y1="5" x2="25" y2="5" stroke="#059669" stroke-width="1"/>
        <line x1="-9" y1="-19" x2="-9" y2="17" stroke="#059669" stroke-width="1"/>
        <line x1="8" y1="-19" x2="8" y2="17" stroke="#059669" stroke-width="1"/>

        <!-- Matriz de bits binarios fluorescentes 1 y 0 -->
        <g opacity="${bitPulse}" transform="translate(0, ${waveOffset})">
          <text x="-18" y="-11" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#34D399">1</text>
          <text x="0" y="-11" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#6EE7B7">0</text>
          <text x="17" y="-11" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#34D399">1</text>

          <text x="-18" y="0" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#6EE7B7">0</text>
          <text x="0" y="0" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#FDE047">1</text>
          <text x="17" y="0" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#6EE7B7">0</text>

          <text x="-18" y="12" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#34D399">1</text>
          <text x="0" y="12" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#34D399">1</text>
          <text x="17" y="12" font-family="'Courier New', monospace" font-size="6.5" font-weight="900" fill="#FDE047">1</text>
        </g>

        <!-- Efecto holograma proyector hacia el observador -->
        <ellipse cx="0" cy="-21" rx="16" ry="3" fill="#10B981" opacity="0.6"/>
        
        <!-- Rótulo inferior PRINCIPIO HOLOGRÁFICO -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#047857" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">ÁREA 2D = DATOS 3D</text>
      </g>`;
    },
    tags: ["holograma", "piel", "bits", "planck", "superficie", "matriz", "binario", "horizonte", "datos"],
  },

  particula_luz_memoria_cosmica: {
    id: "particula_luz_memoria_cosmica",
    name: "Fotón de Hawking con Micro-Holograma Salvado",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<circle cx="0" cy="0" r="18" fill="#FACC15" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const photonPulse = (1 + Math.sin(f * 0.25) * 0.12).toFixed(2);
      const ringScale = (12 + Math.sin(f * 0.3) * 3).toFixed(1);
      const holoBookY = (Math.sin(f * 0.2) * 2).toFixed(1);
      return `<g transform="scale(1.8)">
        <!-- Anillos de ondas electromagnéticas concéntricas -->
        <circle cx="0" cy="0" r="${parseFloat(ringScale) + 6}" fill="none" stroke="#38BDF8" stroke-width="1.8" stroke-dasharray="4 3" opacity="0.6"/>
        <circle cx="0" cy="0" r="${ringScale}" fill="none" stroke="#FDE047" stroke-width="2" opacity="0.8"/>

        <!-- Núcleo de radiación cuántica brillante -->
        <g transform="scale(${photonPulse})">
          <circle cx="0" cy="0" r="10" fill="#FDE047" stroke="${S}" stroke-width="2.5"/>
          <circle cx="0" cy="0" r="6" fill="#FFFFFF"/>
        </g>

        <!-- Rayos de luz estelar -->
        <line x1="-15" y1="0" x2="15" y2="0" stroke="#FACC15" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="0" y1="-15" x2="0" y2="15" stroke="#FACC15" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Micro-holograma del libro flotando sobre el fotón -->
        <g transform="translate(0, ${parseFloat(holoBookY) - 18})">
          <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#38BDF8" fill-opacity="0.85" stroke="#FFFFFF" stroke-width="1.5"/>
          <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#FFFFFF" stroke-width="1"/>
          <line x1="-5" y1="1" x2="3" y2="1" stroke="#FFFFFF" stroke-width="1"/>
          <!-- Rayos proyectores del fotón al libro -->
          <polygon points="-8,-6 8,-6 2,12 -2,12" fill="#38BDF8" fill-opacity="0.25"/>
        </g>

        <!-- Rótulo inferior INFORMACIÓN SALVADA -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="#2563EB" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">¡NADA SE DESTRUYE!</text>
      </g>`;
    },
    tags: ["particula", "foton", "luz", "hawking", "memoria", "cosmica", "salvada", "holograma", "cuantica"],
  },

  mochila_sonriente_pareidolia: {
    id: "mochila_sonriente_pareidolia",
    name: "Mochila Escolar con Sonrisa y Ojos Pareidólicos",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-20" width="44" height="40" rx="8" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const grinBob = (Math.sin(f * 0.25) * 1.5).toFixed(1);
      const eyeBlink = (f % 45 === 0) ? 0.3 : 1;
      return `<g transform="scale(1.75)">
        <!-- Cuerpo principal de la mochila turquesa -->
        <rect x="-24" y="-24" width="48" height="48" rx="10" fill="#0284C7" stroke="${S}" stroke-width="3.5"/>
        <path d="M -22,-14 C -12,-26 12,-26 22,-14" fill="none" stroke="#38BDF8" stroke-width="3"/>
        
        <!-- Bolsillo superior con tiradores de cremallera redondos (ojos pareidólicos saltones) -->
        <rect x="-18" y="-20" width="36" height="14" rx="4" fill="#0369A1" stroke="${S}" stroke-width="2"/>
        <!-- Ojo izquierdo pareidólico -->
        <g transform="translate(-8, -13) scale(1, ${eyeBlink})">
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <circle cx="1" cy="0" r="2.2" fill="#000000"/>
        </g>
        <!-- Ojo derecho pareidólico -->
        <g transform="translate(8, -13) scale(1, ${eyeBlink})">
          <circle cx="0" cy="0" r="5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <circle cx="1" cy="0" r="2.2" fill="#000000"/>
        </g>

        <!-- Bolsillo frontal con cremallera abierta curva (boca sonriente marcada) -->
        <g transform="translate(0, ${grinBob})">
          <path d="M -18,2 C -10,18 10,18 18,2" fill="#FDE047" stroke="${S}" stroke-width="3.5"/>
          <!-- Dientes simulados por los dientes de la cremallera metálica -->
          <path d="M -15,4 C -8,14 8,14 15,4" fill="none" stroke="${S}" stroke-width="2" stroke-dasharray="2.5 2"/>
        </g>

        <!-- Correas acolchadas a los lados -->
        <path d="M -24,-10 C -30,-4 -30,14 -24,20" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
        <path d="M 24,-10 C 30,-4 30,14 24,20" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>

        <!-- Rótulo inferior PAREIDOLIA FACIAL -->
        <rect x="-26" y="26" width="52" height="11" rx="3" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="34.5" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#FFF" text-anchor="middle">PAREIDOLIA FACIAL</text>
      </g>`;
    },
    tags: ["mochila", "sonrisa", "pareidolia", "ojos", "cara", "objeto", "vida_cotidiana"],
  },

  lanza_caza_homonido_sabana: {
    id: "lanza_caza_homonido_sabana",
    name: "Lanza de Caza de Madera con Punta de Sílex",
    family: "historia_exploracion",
    defaultPlacement: "right",
    svg: `<line x1="0" y1="20" x2="0" y2="-20" stroke="#78350F" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const tipGlint = (0.7 + Math.sin(f * 0.3) * 0.3).toFixed(2);
      return `<g transform="scale(1.75)">
        <!-- Asta de madera rústica con nudos -->
        <line x1="0" y1="-32" x2="0" y2="34" stroke="#78350F" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="1" cy="5" r="1.5" fill="#451A03"/>
        <circle cx="-1" cy="-12" r="1.2" fill="#451A03"/>

        <!-- Correas de cuero vegetal atando la punta -->
        <rect x="-3" y="-34" width="6" height="8" rx="1.5" fill="#B45309" stroke="${S}" stroke-width="1.5"/>
        <line x1="-3" y1="-32" x2="3" y2="-30" stroke="#451A03" stroke-width="1.2"/>
        <line x1="-3" y1="-29" x2="3" y2="-27" stroke="#451A03" stroke-width="1.2"/>

        <!-- Punta triangular de piedra sílex / obsidiana afilada -->
        <polygon points="-6,-34 6,-34 0,-48" fill="#334155" stroke="${S}" stroke-width="2.5"/>
        <polygon points="-3,-34 3,-34 0,-46" fill="#64748B" opacity="${tipGlint}"/>

        <!-- Pluma prehistórica atada decorativa -->
        <path d="M 3,-28 C 8,-32 12,-24 4,-22 Z" fill="#F59E0B" stroke="${S}" stroke-width="1.2"/>

        <!-- Rótulo inferior SUPERVIVENCIA -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="#D97706" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">SABANA: 200,000 AÑOS</text>
      </g>`;
    },
    tags: ["lanza", "homonido", "sabana", "caza", "madera", "prehistoria", "supervivencia"],
  },

  balanza_evolutiva_errores: {
    id: "balanza_evolutiva_errores",
    name: "Balanza de la Asimetría del Error Evolutivo",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-18" width="44" height="36" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const tilt = (Math.sin(f * 0.15) * 4).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Pilar central de la balanza -->
        <line x1="0" y1="-20" x2="0" y2="24" stroke="${S}" stroke-width="4"/>
        <polygon points="-12,24 12,24 0,16" fill="#1E293B" stroke="${S}" stroke-width="3"/>
        <circle cx="0" cy="-20" r="3.5" fill="#F59E0B" stroke="${S}" stroke-width="1.5"/>

        <!-- Brazo inclinable: la muerte pesa más que un susto -->
        <g transform="rotate(${parseFloat(tilt) + 12})">
          <line x1="-28" y1="-20" x2="28" y2="-20" stroke="${S}" stroke-width="3.5"/>

          <!-- Platillo Izquierdo (Falso positivo = ligero / vida) -->
          <g transform="translate(-28, -20) rotate(-${parseFloat(tilt) + 12})">
            <line x1="0" y1="0" x2="-8" y2="14" stroke="#64748B" stroke-width="1.5"/>
            <line x1="0" y1="0" x2="8" y2="14" stroke="#64748B" stroke-width="1.5"/>
            <path d="M -12,14 Q 0,22 12,14 Z" fill="#22C55E" stroke="${S}" stroke-width="2"/>
            <text x="0" y="10" font-family="'Arial Black', sans-serif" font-size="4" font-weight="900" fill="#22C55E" text-anchor="middle">SUSTO = VIVO</text>
          </g>

          <!-- Platillo Derecho (Falso negativo = pesadísimo / depredador) -->
          <g transform="translate(28, -20) rotate(-${parseFloat(tilt) + 12})">
            <line x1="0" y1="0" x2="-8" y2="16" stroke="#64748B" stroke-width="1.5"/>
            <line x1="0" y1="0" x2="8" y2="16" stroke="#64748B" stroke-width="1.5"/>
            <path d="M -14,16 Q 0,26 14,16 Z" fill="#EF4444" stroke="${S}" stroke-width="2"/>
            <text x="0" y="12" font-family="'Arial Black', sans-serif" font-size="4" font-weight="900" fill="#EF4444" text-anchor="middle">ERROR = MUERTE</text>
          </g>
        </g>

        <!-- Rótulo inferior ASIMETRÍA DEL ERROR -->
        <rect x="-26" y="26" width="52" height="11" rx="3" fill="#7C3AED" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="34.5" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">ASIMETRÍA DEL ERROR</text>
      </g>`;
    },
    tags: ["balanza", "asimetria", "error", "falso_positivo", "falso_negativo", "evolucion", "supervivencia"],
  },

  chip_neuronal_area_fusiforme: {
    id: "chip_neuronal_area_fusiforme",
    name: "Chip del Área Fusiforme Facial a 150ms",
    family: "tecnologia",
    defaultPlacement: "right",
    svg: `<rect x="-18" y="-18" width="36" height="36" rx="4" fill="#0F172A" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const pulseGlow = (0.7 + Math.sin(f * 0.3) * 0.3).toFixed(2);
      const beamLine = ((f * 3) % 28).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Placa base de microcircuito bioeléctrico -->
        <rect x="-22" y="-22" width="44" height="44" rx="6" fill="#090D16" stroke="${S}" stroke-width="3.5"/>
        <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#1E1B4B" stroke="#818CF8" stroke-width="1.8"/>

        <!-- Pistas de cobre / neón cian -->
        <path d="M -18,-6 L -10,-6 L -6,-12 L 6,-12 L 10,-6 L 18,-6" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
        <path d="M -18,6 L -10,6 L -6,12 L 6,12 L 10,6 L 18,6" fill="none" stroke="#38BDF8" stroke-width="1.8"/>

        <!-- Microchip central rotulado FFA -->
        <rect x="-12" y="-12" width="24" height="24" rx="3" fill="#4F46E5" stroke="#FDE047" stroke-width="2"/>
        <text x="0" y="-3" font-family="'Impact', 'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FFF" text-anchor="middle">FFA</text>
        <text x="0" y="5" font-family="'Courier New', monospace" font-size="4" font-weight="900" fill="#A7F3D0" text-anchor="middle">&lt;150ms&gt;</text>

        <!-- Pulso de radar: escaneo de ojos y boca mínimos -->
        <g transform="translate(0, 10)">
          <circle cx="-4" cy="0" r="1" fill="#FDE047"/>
          <circle cx="4" cy="0" r="1" fill="#FDE047"/>
          <line x1="-3" y1="3" x2="3" y2="3" stroke="#FDE047" stroke-width="1"/>
        </g>

        <!-- Alerta verde ¡CARA DETECTADA! -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="#059669" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">¡ROSTRO EN 150 MS!</text>
      </g>`;
    },
    tags: ["chip", "neuronal", "ffa", "area_fusiforme", "milisegundos", "cerebro", "tecnologia"],
  },

  monitor_analisis_microexpresiones: {
    id: "monitor_analisis_microexpresiones",
    name: "Monitor de Lectura de Intenciones Amigo vs Enemigo",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-18" width="44" height="36" rx="4" fill="#1E293B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const isHostile = (Math.sin(f * 0.15) > 0);
      const faceCol = isHostile ? "#EF4444" : "#10B981";
      const mouthY = isHostile ? "6" : "-2";
      const mouthCurve = isHostile ? "M -10,10 Q 0,4 10,10" : "M -10,6 Q 0,14 10,6";
      const labelText = isHostile ? "¡AMENAZA!" : "AMISTOSO";
      return `<g transform="scale(1.75)">
        <!-- Carcasa del monitor futurista -->
        <rect x="-26" y="-22" width="52" height="44" rx="6" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
        <rect x="-22" y="-18" width="44" height="34" rx="4" fill="#020617"/>

        <!-- Esbozo de rostro paramétrico de prueba -->
        <circle cx="0" cy="-2" r="13" fill="none" stroke="${faceCol}" stroke-width="2"/>
        <!-- Ojos y cejas cambiantes -->
        {isHostile ? (
          <!-- Cejas hostiles diagonales -->
          <g stroke="${faceCol}" stroke-width="2" stroke-linecap="round">
            <line x1="-8" y1="-8" x2="-3" y2="-5"/>
            <line x1="8" y1="-8" x2="3" y2="-5"/>
            <circle cx="-5" cy="-3" r="1.5" fill="${faceCol}"/>
            <circle cx="5" cy="-3" r="1.5" fill="${faceCol}"/>
          </g>
        ) : (
          <!-- Cejas amigables relajadas -->
          <g stroke="${faceCol}" stroke-width="2" stroke-linecap="round">
            <circle cx="-5" cy="-4" r="1.8" fill="${faceCol}"/>
            <circle cx="5" cy="-4" r="1.8" fill="${faceCol}"/>
          </g>
        )}

        <!-- Boca reactiva -->
        <path d="${mouthCurve}" fill="none" stroke="${faceCol}" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Rótulo inferior reactivo -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="${faceCol}" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#FFF" text-anchor="middle">${labelText}</text>
      </g>`;
    },
    tags: ["monitor", "expresiones", "amigo", "enemigo", "intenciones", "amenaza", "ciencia"],
  },

  aspiradora_robot_ojitos_mascota: {
    id: "aspiradora_robot_ojitos_mascota",
    name: "Aspiradora Robot con Ojitos Móviles Pegados",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<ellipse cx="0" cy="0" rx="22" ry="16" fill="#18181B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const wiggleEye = (Math.sin(f * 0.4) * 2).toFixed(1);
      const blink = (f % 50 < 4) ? "#EF4444" : "#22C55E";
      return `<g transform="scale(1.75)">
        <!-- Cuerpo redondo de aspiradora robot inteligente -->
        <ellipse cx="0" cy="4" rx="26" ry="18" fill="#18181B" stroke="${S}" stroke-width="3.5"/>
        <ellipse cx="0" cy="2" rx="21" ry="14" fill="#27272A"/>

        <!-- Parachoques frontal de goma -->
        <path d="M -24,4 C -24,18 24,18 24,4" fill="none" stroke="#52525B" stroke-width="3"/>

        <!-- Dos ojitos móviles saltones (googly eyes) pegados con cariño -->
        <!-- Ojo izquierdo -->
        <g transform="translate(-10, -2)">
          <circle cx="0" cy="0" r="5.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <circle cx="${wiggleEye}" cy="0" r="2.4" fill="#000000"/>
        </g>
        <!-- Ojo derecho -->
        <g transform="translate(10, -2)">
          <circle cx="0" cy="0" r="5.5" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
          <circle cx="${-parseFloat(wiggleEye)}" cy="0" r="2.4" fill="#000000"/>
        </g>

        <!-- Luces LED de estado parpadeantes y botón encendido -->
        <circle cx="0" cy="8" r="3" fill="${blink}" stroke="${S}" stroke-width="1"/>

        <!-- Rótulo inferior INSTINTO SOCIAL -->
        <rect x="-26" y="24" width="52" height="11" rx="3" fill="#D97706" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">INSTINTO SOCIAL</text>
      </g>`;
    },
    tags: ["aspiradora", "robot", "ojitos", "mascota", "auto", "humanizacion", "vida_cotidiana"],
  },

  taza_cafe_espuma_sonriente: {
    id: "taza_cafe_espuma_sonriente",
    name: "Taza de Café con Sonrisa en la Espuma y Vapor",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<rect x="-16" y="-12" width="32" height="26" rx="6" fill="#F8FAFC" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const steamY = ((f * 1.5) % 25).toFixed(1);
      const twinkle = (0.7 + Math.sin(f * 0.25) * 0.3).toFixed(2);
      return `<g transform="scale(1.8)">
        <!-- Asa lateral de la taza -->
        <path d="M 16,-6 C 24,-6 24,10 16,10" fill="none" stroke="${S}" stroke-width="4" stroke-linecap="round"/>

        <!-- Taza blanca de cerámica -->
        <rect x="-18" y="-12" width="36" height="30" rx="6" fill="#F8FAFC" stroke="${S}" stroke-width="3.5"/>
        <!-- Plato base -->
        <ellipse cx="0" cy="20" rx="22" ry="5" fill="#E2E8F0" stroke="${S}" stroke-width="3"/>

        <!-- Café oscuro visto desde ángulo alto -->
        <ellipse cx="0" cy="-10" rx="16" ry="7" fill="#451A03" stroke="${S}" stroke-width="2"/>
        <!-- Espuma cremosa de leche -->
        <ellipse cx="0" cy="-10" rx="14" ry="5.5" fill="#FEF3C7"/>

        <!-- Latte art: Dos ojos de café y sonrisa de espuma perfecta -->
        <circle cx="-6" cy="-11" r="1.5" fill="#451A03"/>
        <circle cx="6" cy="-11" r="1.5" fill="#451A03"/>
        <path d="M -6,-9 Q 0,-6 6,-9" fill="none" stroke="#451A03" stroke-width="1.8" stroke-linecap="round"/>

        <!-- Vapor aromático ascendente animado -->
        <g transform="translate(0, -${steamY})" opacity="0.75">
          <path d="M -5,-14 Q -8,-22 -3,-28" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
          <path d="M 5,-14 Q 8,-22 3,-28" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
        </g>

        <!-- Destellos de café feliz -->
        <polygon points="12,-18 14,-15 16,-18 14,-21" fill="#FDE047" opacity="${twinkle}"/>

        <!-- Rótulo inferior EVOLUCIÓN EN TU CAFÉ -->
        <rect x="-26" y="26" width="52" height="11" rx="3" fill="#B45309" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="34.5" font-family="'Impact', 'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFF" text-anchor="middle">EVOLUCIÓN EN TU CAFÉ</text>
      </g>`;
    },
    tags: ["taza", "cafe", "espuma", "sonrisa", "latte", "brindis", "vida_cotidiana", "pareidolia"],
  },

  limon_bolsa_dinero_invisible: {
    id: "limon_bolsa_dinero_invisible",
    name: "Medio Limón Exprimiendo Jugo y Bolsa de Banco",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<circle cx="-10" cy="0" r="14" fill="#FDE047" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const dropY1 = ((f * 1.8) % 24).toFixed(1);
      const dropY2 = (((f + 12) * 1.8) % 24).toFixed(1);
      const squeeze = (1 + Math.sin(f * 0.25) * 0.08).toFixed(2);
      return `<g transform="scale(1.75)">
        <!-- Saco de dinero del banco a la derecha -->
        <g transform="translate(12, 4)">
          <path d="M -12,14 C -16,14 -16,-6 -8,-12 L 8,-12 C 16,-6 16,14 12,14 Z" fill="#D97706" stroke="${S}" stroke-width="3"/>
          <path d="M -6,-12 L -10,-18 L 0,-15 L 10,-18 L 6,-12 Z" fill="#B45309" stroke="${S}" stroke-width="2.5"/>
          <line x1="-7" y1="-12" x2="7" y2="-12" stroke="#EF4444" stroke-width="3"/>
          <text x="0" y="6" font-family="'Impact', 'Arial Black', sans-serif" font-size="12" font-weight="900" fill="#22C55E" stroke="${S}" stroke-width="0.8" text-anchor="middle">$</text>
        </g>

        <!-- Medio limón jugoso exprimiéndose a la izquierda -->
        <g transform="translate(-14, -6) scale(${squeeze}) rotate(-20)">
          <path d="M -14,0 A 14,14 0 0,1 14,0 Z" fill="#FACC15" stroke="${S}" stroke-width="3"/>
          <ellipse cx="0" cy="0" rx="14" ry="4" fill="#FEF08A" stroke="${S}" stroke-width="2.5"/>
          <!-- Gajos cítricos -->
          <line x1="-8" y1="0" x2="8" y2="0" stroke="#EAB308" stroke-width="1.5"/>
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#EAB308" stroke-width="1.5"/>
        </g>

        <!-- Gotas de zumo de limón cayendo -->
        <circle cx="-16" cy="${parseFloat(dropY1) - 2}" r="2.8" fill="#FEF08A" stroke="${S}" stroke-width="1.2"/>
        <circle cx="-10" cy="${parseFloat(dropY2) - 2}" r="2.2" fill="#FDE047" stroke="${S}" stroke-width="1.2"/>

        <!-- Rótulo inferior -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFF" text-anchor="middle">¡JUGO = 0% INVISIBLE!</text>
      </g>`;
    },
    tags: ["limon", "jugo", "banco", "robo", "invisible", "dunning_kruger", "dinero"],
  },

  esposas_papel_tinta_limon: {
    id: "esposas_papel_tinta_limon",
    name: "Esposas Policiales y Papel con Tinta Invisible de Limón",
    family: "historia_exploracion",
    defaultPlacement: "both",
    svg: `<rect x="-20" y="-16" width="40" height="32" rx="4" fill="#94A3B8" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const sway = (Math.sin(f * 0.22) * 4).toFixed(1);
      const flameScale = (0.9 + Math.sin(f * 0.35) * 0.15).toFixed(2);
      return `<g transform="scale(1.75)">
        <!-- Hoja de papel revelando tinta de limón al calor -->
        <g transform="translate(10, -2)">
          <rect x="-14" y="-18" width="28" height="34" rx="2" fill="#FEF3C7" stroke="${S}" stroke-width="3"/>
          <text x="0" y="-7" font-family="'Arial Black', sans-serif" font-size="4.2" font-weight="900" fill="#D97706" text-anchor="middle">TINTA DE</text>
          <text x="0" y="0" font-family="'Arial Black', sans-serif" font-size="4.5" font-weight="900" fill="#B45309" text-anchor="middle">LIMÓN</text>
          <!-- Vela pequeña calentando el papel -->
          <rect x="-3" y="10" width="6" height="8" fill="#F8FAFC" stroke="${S}" stroke-width="1.5"/>
          <path d="M 0,10 C -3,6 0,2 0,2 C 0,2 3,6 0,10 Z" fill="#F59E0B" transform="scale(${flameScale})"/>
        </g>

        <!-- Esposas metálicas cerradas a la izquierda -->
        <g transform="translate(-14, 2) rotate(${sway})">
          <!-- Cadena central -->
          <line x1="-6" y1="-8" x2="6" y2="-8" stroke="#475569" stroke-width="3" stroke-dasharray="2 2"/>
          <!-- Aro izquierdo -->
          <circle cx="-10" cy="2" r="8" fill="none" stroke="#94A3B8" stroke-width="4"/>
          <circle cx="-10" cy="2" r="8" fill="none" stroke="${S}" stroke-width="1.5"/>
          <!-- Aro derecho -->
          <circle cx="8" cy="2" r="8" fill="none" stroke="#94A3B8" stroke-width="4"/>
          <circle cx="8" cy="2" r="8" fill="none" stroke="${S}" stroke-width="1.5"/>
        </g>

        <!-- Rótulo inferior -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#1D4ED8" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="5.8" font-weight="900" fill="#FFF" text-anchor="middle">¡PERO SI USÉ EL JUGO!</text>
      </g>`;
    },
    tags: ["esposas", "policia", "arresto", "tinta", "invisible", "limon", "papel"],
  },

  pizarra_curva_dunning_kruger: {
    id: "pizarra_curva_dunning_kruger",
    name: "Pizarra con Gráfica del Efecto Dunning-Kruger",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-24" y="-18" width="48" height="36" rx="4" fill="#064E3B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const dotPulse = (1 + Math.sin(f * 0.28) * 0.2).toFixed(2);
      return `<g transform="scale(1.75)">
        <!-- Marco de madera y pizarra verde académica -->
        <rect x="-28" y="-22" width="56" height="42" rx="4" fill="#B45309" stroke="${S}" stroke-width="3.5"/>
        <rect x="-24" y="-18" width="48" height="34" rx="2" fill="#064E3B" stroke="${S}" stroke-width="2"/>

        <!-- Ejes cartesianos -->
        <line x1="-18" y1="10" x2="-18" y2="-14" stroke="#FFFFFF" stroke-width="2"/>
        <line x1="-18" y1="10" x2="20" y2="10" stroke="#FFFFFF" stroke-width="2"/>

        <!-- Curva clásica de Dunning-Kruger en rojo brillante y amarillo -->
        <path d="M -18,10 L -10,-12 Q -3,12 4,8 Q 12,4 19,-4" fill="none" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>

        <!-- Punto brillante en el pico de la ignorancia -->
        <g transform="translate(-10, -12) scale(${dotPulse})">
          <circle cx="0" cy="0" r="3.5" fill="#FDE047" stroke="${S}" stroke-width="1.2"/>
        </g>

        <!-- Etiquetas de ejes -->
        <text x="-4" y="-12" font-family="'Arial Black', sans-serif" font-size="3.8" font-weight="900" fill="#FDE047">PICO 100%</text>
        <text x="2" y="15" font-family="'Arial Black', sans-serif" font-size="3.5" font-weight="900" fill="#A7F3D0" text-anchor="middle">SABIDURÍA →</text>

        <!-- Rótulo inferior -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#047857" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFF" text-anchor="middle">CURVA DUNNING-KRUGER</text>
      </g>`;
    },
    tags: ["pizarra", "grafica", "curva", "dunning", "kruger", "confianza", "sabiduria"],
  },

  megafono_bandera_cima_ignorancia: {
    id: "megafono_bandera_cima_ignorancia",
    name: "Megáfono de Soberbia y Bandera de Cima de la Ignorancia",
    family: "reacciones_humor",
    defaultPlacement: "right",
    svg: `<polygon points="-16,-6 16,-16 16,16 -16,6" fill="#EF4444" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const waveScale = (1 + Math.sin(f * 0.3) * 0.15).toFixed(2);
      const flagSkew = (Math.sin(f * 0.25) * 3).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Asta y bandera de falso campeón detrás -->
        <line x1="-14" y1="-26" x2="-14" y2="20" stroke="#1E293B" stroke-width="3.5" stroke-linecap="round"/>
        <g transform="translate(-14, -24) skewY(${flagSkew})">
          <polygon points="0,0 28,6 0,14" fill="#FACC15" stroke="${S}" stroke-width="2.5"/>
          <text x="10" y="9" font-family="'Impact', 'Arial Black', sans-serif" font-size="4.5" font-weight="900" fill="#000" text-anchor="middle">GENIO</text>
        </g>

        <!-- Megáfono rojo y blanco gritando -->
        <g transform="translate(2, 2) rotate(-12)">
          <polygon points="-14,-4 12,-14 12,10 -14,4" fill="#EF4444" stroke="${S}" stroke-width="3"/>
          <rect x="-18" y="-4" width="5" height="8" rx="1" fill="#F8FAFC" stroke="${S}" stroke-width="2"/>
          <path d="M -10,4 L -8,13 L -3,13 L -4,4" fill="#1E293B" stroke="${S}" stroke-width="2"/>
          <!-- Ondas acústicas estridentes -->
          <g transform="scale(${waveScale})">
            <path d="M 16,-10 Q 22,-2 16,6" fill="none" stroke="#FDE047" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M 21,-14 Q 29,-2 21,10" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
          </g>
        </g>

        <!-- Rótulo inferior -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#DC2626" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="5.8" font-weight="900" fill="#FFF" text-anchor="middle">CIMA DE LA IGNORANCIA</text>
      </g>`;
    },
    tags: ["megafono", "bandera", "cima", "ignorancia", "soberbia", "experto", "grito"],
  },

  torre_libros_valle_desesperacion: {
    id: "torre_libros_valle_desesperacion",
    name: "Pila de Libros Complejos y Fórmulas en el Valle",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-20" y="-20" width="40" height="40" rx="3" fill="#3B82F6" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const wobble = (Math.sin(f * 0.22) * 2).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Torre tambaleante de libros pesados -->
        <g transform="rotate(${wobble})">
          <!-- Libro base 1 (Rojo) -->
          <rect x="-22" y="10" width="44" height="10" rx="2" fill="#EF4444" stroke="${S}" stroke-width="2.8"/>
          <rect x="-18" y="12" width="36" height="6" fill="#FEF3C7"/>
          <!-- Libro 2 (Azul) -->
          <rect x="-20" y="0" width="40" height="10" rx="2" fill="#2563EB" stroke="${S}" stroke-width="2.8"/>
          <rect x="-16" y="2" width="32" height="6" fill="#FFFFFF"/>
          <!-- Libro 3 (Verde) -->
          <rect x="-24" y="-10" width="42" height="10" rx="2" fill="#059669" stroke="${S}" stroke-width="2.8"/>
          <rect x="-20" y="-8" width="34" height="6" fill="#FEF3C7"/>
          <!-- Libro 4 superior inclinado (Morado) -->
          <g transform="translate(2, -16) rotate(8)">
            <rect x="-18" y="-4" width="36" height="9" rx="2" fill="#7C3AED" stroke="${S}" stroke-width="2.8"/>
            <text x="0" y="2.5" font-family="'Arial Black', sans-serif" font-size="4.2" font-weight="900" fill="#FDE047" text-anchor="middle">VOLUMEN I / M</text>
          </g>
        </g>

        <!-- Fórmulas complejas flotando alrededor -->
        <text x="-22" y="-18" font-family="'Courier New', monospace" font-size="6" font-weight="900" fill="#38BDF8">∫f(x)</text>
        <text x="14" y="-18" font-family="'Courier New', monospace" font-size="6" font-weight="900" fill="#F87171">∑∞</text>

        <!-- Rótulo inferior -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#475569" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">¡NO SÉ CASI NADA!</text>
      </g>`;
    },
    tags: ["libros", "torre", "valle", "desesperacion", "formulas", "complejidad", "estudio"],
  },

  libro_globo_depende_sabiduria: {
    id: "libro_globo_depende_sabiduria",
    name: "Libro Abierto y Bocadillo DEPENDE del Experto",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-16" width="44" height="32" rx="4" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const floatY = (Math.sin(f * 0.18) * 1.8).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Globo de diálogo prudente arriba: DEPENDE... -->
        <g transform="translate(0, ${parseFloat(floatY) - 12})">
          <rect x="-24" y="-14" width="48" height="18" rx="6" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
          <polygon points="-4,4 4,4 -2,10" fill="#FFFFFF" stroke="${S}" stroke-width="2.5"/>
          <text x="0" y="-2" font-family="'Impact', 'Arial Black', sans-serif" font-size="7.5" font-weight="900" fill="#0F172A" text-anchor="middle">«DEPENDE...»</text>
        </g>

        <!-- Libro abierto de sabiduría serena abajo -->
        <g transform="translate(0, 10)">
          <path d="M -22,8 L 0,12 L 22,8 L 22,-8 L 0,-4 L -22,-8 Z" fill="#0284C7" stroke="${S}" stroke-width="3"/>
          <path d="M -19,5 L 0,9 L 19,5 L 19,-6 L 0,-2 L -19,-6 Z" fill="#FEF3C7" stroke="${S}" stroke-width="1.8"/>
          <line x1="0" y1="-2" x2="0" y2="9" stroke="${S}" stroke-width="2"/>
          <line x1="-14" y1="-1" x2="-4" y2="1" stroke="#64748B" stroke-width="1.5"/>
          <line x1="4" y1="1" x2="14" y2="-1" stroke="#64748B" stroke-width="1.5"/>
        </g>

        <!-- Rótulo inferior -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#059669" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">PRUDENCIA Y HUMILDAD</text>
      </g>`;
    },
    tags: ["libro", "depende", "sabiduria", "experto", "prudencia", "humildad", "iluminacion"],
  },

  espejo_reflejo_limon_redes: {
    id: "espejo_reflejo_limon_redes",
    name: "Espejo de Mano con Reflejo de Limón y Móvil",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<circle cx="0" cy="-4" r="18" fill="#38BDF8" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const glint = (Math.sin(f * 0.25) * 3).toFixed(1);
      return `<g transform="scale(1.75)">
        <!-- Mango del espejo de mano -->
        <rect x="-3.5" y="10" width="7" height="16" rx="3" fill="#D97706" stroke="${S}" stroke-width="2.5"/>

        <!-- Marco ovalado del espejo -->
        <circle cx="0" cy="-4" r="19" fill="#F59E0B" stroke="${S}" stroke-width="3.5"/>
        <circle cx="0" cy="-4" r="15" fill="#E0F2FE" stroke="${S}" stroke-width="2"/>

        <!-- Reflejo cómico dentro del espejo: carita con medio limón en la cabeza -->
        <circle cx="0" cy="-2" r="7" fill="#FFFFFF" stroke="${S}" stroke-width="2"/>
        <circle cx="-2.5" cy="-3" r="1.2" fill="#000"/>
        <circle cx="2.5" cy="-3" r="1.2" fill="#000"/>
        <path d="M -3,1 Q 0,3.5 3,1" fill="none" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Medio limón amarillo sobre el reflejo -->
        <path d="M -6,-9 A 6,6 0 0,1 6,-9 Z" fill="#FACC15" stroke="${S}" stroke-width="1.8"/>
        <!-- Gotas amarillas en la cara reflejada -->
        <circle cx="4" cy="-5" r="1.3" fill="#FACC15"/>

        <!-- Brillo del cristal -->
        <line x1="${-8 + parseFloat(glint)}" y1="-13" x2="${-2 + parseFloat(glint)}" y2="-7" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>

        <!-- Rótulo inferior -->
        <rect x="-28" y="24" width="56" height="11" rx="3" fill="#7C3AED" stroke="${S}" stroke-width="2.5"/>
        <text x="0" y="32" font-family="'Impact', 'Arial Black', sans-serif" font-size="6.2" font-weight="900" fill="#FFF" text-anchor="middle">¡DUDA DE TI MISMO!</text>
      </g>`;
    },
    tags: ["espejo", "reflejo", "limon", "redes", "autcritica", "humildad", "duda"],
  },

  pala_zanja_erosion_lodo: {
    id: "pala_zanja_erosion_lodo",
    name: "Pala de Jardinería Cavando y Lanzando Terrones de Lodo",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-18" y="-22" width="36" height="44" rx="4" fill="#78350F" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const cycle = Math.sin(f * 0.24);
      const shovelRot = currentState === "alarma"
        ? (-10 + Math.sin(f * 0.3) * 6).toFixed(1)
        : (-28 + cycle * 24).toFixed(1);
      const shovelY = (Math.cos(f * 0.24) * 5).toFixed(1);
      const clodT = (f * 0.08) % 1;
      const clodX = (10 + clodT * 28).toFixed(1);
      const clodY = (-6 - Math.sin(clodT * Math.PI) * 22).toFixed(1);
      const splashT = ((f + 15) * 0.08) % 1;
      const splashX = (-8 - splashT * 24).toFixed(1);
      const splashY = (-4 - Math.sin(splashT * Math.PI) * 18).toFixed(1);
      return `<g transform="scale(1.85)">
        <!-- Terrones de lodo y gotas saliendo disparados por la pala -->
        <g opacity="${(1 - clodT * 0.7).toFixed(2)}">
          <path d="M ${clodX},${clodY} C ${parseFloat(clodX) + 5},${parseFloat(clodY) - 4} ${parseFloat(clodX) + 8},${parseFloat(clodY) + 3} ${parseFloat(clodX) + 2},${parseFloat(clodY) + 6} Z" fill="#5C2D0C" stroke="${S}" stroke-width="2"/>
          <circle cx="${parseFloat(clodX) + 6}" cy="${parseFloat(clodY) - 5}" r="2.5" fill="#38BDF8" stroke="${S}" stroke-width="1.4"/>
        </g>
        <g opacity="${(1 - splashT * 0.7).toFixed(2)}">
          <circle cx="${splashX}" cy="${splashY}" r="3.2" fill="#78350F" stroke="${S}" stroke-width="1.8"/>
          <circle cx="${parseFloat(splashX) - 5}" cy="${parseFloat(splashY) - 4}" r="2.2" fill="#0284C7" stroke="${S}" stroke-width="1.4"/>
        </g>

        <!-- Pala de acero y madera animada con pivote físico -->
        <g transform="translate(0, ${shovelY}) rotate(${shovelRot})">
          <path d="M -8,-30 L 8,-30 L 6,-23 L -6,-23 Z" fill="#EF4444" stroke="${S}" stroke-width="2.5" stroke-linejoin="round"/>
          <rect x="-4" y="-28" width="8" height="3" rx="1" fill="#F8FAFC" stroke="${S}" stroke-width="1.4"/>
          <rect x="-2.8" y="-23" width="5.6" height="25" rx="2" fill="#D97706" stroke="${S}" stroke-width="2.5"/>
          <line x1="-1" y1="-20" x2="-1" y2="-2" stroke="#F59E0B" stroke-width="1.2"/>
          <path d="M -11,0 L 11,0 L 9,15 Q 0,23 -9,15 Z" fill="#94A3B8" stroke="${S}" stroke-width="2.8" stroke-linejoin="round"/>
          <path d="M -7,2 L 7,2 L 5,13 Q 0,18 -5,13 Z" fill="#CBD5E1"/>
          <path d="M -9,8 Q 0,3 9,8 Q 6,18 0,19 Q -6,18 -9,8 Z" fill="#5C2D0C" stroke="${S}" stroke-width="2"/>
        </g>
      </g>`;
    },
    tags: ["pala", "zanja", "lodo", "erosion", "charco", "lluvia", "patio"],
  },

  tabla_madera_rota_vectores_presion: {
    id: "tabla_madera_rota_vectores_presion",
    name: "Tabla de Madera Pandeándose y Quebrándose en Dos",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-18" width="44" height="36" rx="4" fill="#B45309" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isBroken = currentState === "roto" || (currentState === undefined && f >= 42);
      const prog = stepProgress ?? Math.min(1, Math.max(0, (f - 42) / 25));
      if (!isBroken) {
        const bow = (3 + Math.sin(f * 0.35) * 2.5).toFixed(1);
        const shakeX = (Math.sin(f * 0.6) * 1.5).toFixed(1);
        return `<g transform="scale(1.85) translate(${shakeX}, 0)">
          <g>
            <line x1="-26" y1="-12" x2="-10" y2="-12" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
            <polygon points="-8,-12 -14,-16 -14,-8" fill="#EF4444" stroke="${S}" stroke-width="1.2"/>
            <line x1="-30" y1="0" x2="-8" y2="0" stroke="#EF4444" stroke-width="4.2" stroke-linecap="round"/>
            <polygon points="-6,0 -13,-4.5 -13,4.5" fill="#EF4444" stroke="${S}" stroke-width="1.2"/>
            <line x1="-34" y1="12" x2="-6" y2="12" stroke="#EF4444" stroke-width="5.5" stroke-linecap="round"/>
            <polygon points="-4,12 -12,7 -12,17" fill="#EF4444" stroke="${S}" stroke-width="1.2"/>
          </g>
          <path d="M -4,-22 Q ${bow},0 -4,22 L 8,22 Q ${parseFloat(bow) + 12},0 8,-22 Z" fill="#D97706" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
          <path d="M 8,0 L 1,-2 L 4,3 L -1,4" fill="none" stroke="${S}" stroke-width="2.2" stroke-linecap="round"/>
        </g>`;
      }
      const flyDist = (prog * 18).toFixed(1);
      const rotTop = (-18 - prog * 28).toFixed(1);
      const rotBot = (18 + prog * 28).toFixed(1);
      return `<g transform="scale(1.85)">
        <path d="M -24,-8 Q 0,-12 24,-16 L 26,16 Q 0,12 -24,8 Z" fill="#38BDF8" stroke="${S}" stroke-width="2.5"/>
        <path d="M -20,-3 L 18,-6 M -18,4 L 20,7" stroke="#E0F2FE" stroke-width="2.5" stroke-linecap="round"/>

        <g transform="translate(${flyDist}, -${(10 + prog * 12).toFixed(1)}) rotate(${rotTop})">
          <polygon points="-7,-14 7,-14 7,6 1,2 -3,7 -7,4" fill="#D97706" stroke="${S}" stroke-width="2.8" stroke-linejoin="round"/>
          <line x1="-2" y1="-12" x2="-2" y2="2" stroke="#92400E" stroke-width="1.4"/>
        </g>

        <g transform="translate(${flyDist}, ${(10 + prog * 12).toFixed(1)}) rotate(${rotBot})">
          <polygon points="-7,-5 -2,-2 2,-6 7,-3 7,14 -7,14" fill="#B45309" stroke="${S}" stroke-width="2.8" stroke-linejoin="round"/>
          <line x1="2" y1="-2" x2="2" y2="12" stroke="#78350F" stroke-width="1.4"/>
        </g>

        <polygon points="4,-5 12,-11 9,-2 17,1 8,4" fill="#FACC15" stroke="${S}" stroke-width="1.8"/>
        <rect x="${(10 + prog * 14).toFixed(1)}" y="-6" width="6" height="2.5" rx="1" transform="rotate(25)" fill="#F59E0B" stroke="${S}" stroke-width="1.2"/>
      </g>`;
    },
    tags: ["tabla", "madera", "rota", "presion", "hidrostatica", "vectores", "agua"],
  },

  plano_azul_rocas_escollera: {
    id: "plano_azul_rocas_escollera",
    name: "Rocas Pesadas de Escollera Anclándose en el Lodo",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-18" width="44" height="36" rx="4" fill="#64748B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      if (currentState === "plano") {
        const unroll = Math.min(1, (stepProgress ?? 0.8) * 1.3);
        const w = (16 + unroll * 28).toFixed(1);
        return `<g transform="scale(1.8)">
          <rect x="-22" y="-16" width="${w}" height="30" rx="2" fill="#1E40AF" stroke="${S}" stroke-width="2.8"/>
          <rect x="-19" y="-13" width="${Math.max(4, parseFloat(w) - 6).toFixed(1)}" height="24" fill="none" stroke="#60A5FA" stroke-width="1.2" stroke-dasharray="2 2"/>
          <polygon points="-14,7 -2,-8 10,7" fill="#38BDF8" fill-opacity="0.35" stroke="#FDE047" stroke-width="2.2" stroke-linejoin="round"/>
          <rect x="${(-22 + parseFloat(w) - 3).toFixed(1)}" y="-18" width="6" height="34" rx="3" fill="#93C5FD" stroke="${S}" stroke-width="2.5"/>
        </g>`;
      }
      const p = stepProgress ?? Math.min(1, f / 90);
      const r1Y = Math.min(0, -35 + p * 70).toFixed(1);
      const r2Y = Math.min(0, -45 + Math.max(0, p - 0.25) * 85).toFixed(1);
      const r3Y = Math.min(0, -50 + Math.max(0, p - 0.5) * 100).toFixed(1);
      return `<g transform="scale(1.85)">
        <g transform="translate(-12, ${r1Y})">
          <polygon points="-11,6 -8,-6 3,-8 11,-1 9,8 -6,9" fill="#475569" stroke="${S}" stroke-width="2.8" stroke-linejoin="round"/>
          <polygon points="-7,-4 2,-6 7,-1 -2,2" fill="#94A3B8"/>
        </g>
        <g transform="translate(11, ${r2Y})">
          <polygon points="-10,7 -7,-5 5,-7 12,1 9,8 -5,9" fill="#64748B" stroke="${S}" stroke-width="2.8" stroke-linejoin="round"/>
          <polygon points="-5,-3 4,-5 8,0 0,3" fill="#CBD5E1"/>
        </g>
        <g transform="translate(0, ${r3Y})">
          <polygon points="-10,-1 -6,-12 6,-12 11,-1 6,5 -6,5" fill="#334155" stroke="${S}" stroke-width="2.8" stroke-linejoin="round"/>
          <polygon points="-5,-10 5,-10 7,-3 -3,-2" fill="#64748B"/>
        </g>
      </g>`;
    },
    tags: ["plano", "azul", "rocas", "escollera", "gravedad", "ingenieria", "presa"],
  },

  cubetas_filtro_grava_arena: {
    id: "cubetas_filtro_grava_arena",
    name: "Cubeta Inclinándose y Vertiendo Lluvia de Grava y Arena Fina",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<circle cx="0" cy="0" r="20" fill="#F59E0B" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isSand = currentState === "arena" || (currentState === undefined && f > 95);
      const tiltAngle = (38 + Math.sin(f * 0.22) * 6).toFixed(1);
      const bucketColor = isSand ? "#F59E0B" : "#EF4444";
      const grainColor = isSand ? "#FDE047" : "#94A3B8";
      const grainColor2 = isSand ? "#F59E0B" : "#64748B";
      const fallOffset = ((f * 2.4) % 24).toFixed(1);
      return `<g transform="scale(1.85)">
        <g transform="translate(6, ${fallOffset})">
          <circle cx="-2" cy="-6" r="${isSand ? 2.0 : 3.6}" fill="${grainColor}" stroke="${S}" stroke-width="1.6"/>
          <circle cx="4" cy="0" r="${isSand ? 1.8 : 3.2}" fill="${grainColor2}" stroke="${S}" stroke-width="1.6"/>
          <circle cx="-4" cy="6" r="${isSand ? 2.1 : 3.8}" fill="${grainColor}" stroke="${S}" stroke-width="1.6"/>
          <circle cx="2" cy="11" r="${isSand ? 1.9 : 3.4}" fill="${grainColor2}" stroke="${S}" stroke-width="1.6"/>
          <circle cx="-1" cy="16" r="${isSand ? 2.0 : 3.5}" fill="${grainColor}" stroke="${S}" stroke-width="1.6"/>
        </g>

        <g transform="translate(-8, -10) rotate(${tiltAngle})">
          <path d="M -11,-8 A 11,11 0 0,1 11,-8" fill="none" stroke="#475569" stroke-width="2.5"/>
          <polygon points="-12,-8 12,-8 9,12 -9,12" fill="${bucketColor}" stroke="${S}" stroke-width="2.8" stroke-linejoin="round"/>
          <rect x="-13.5" y="-10" width="27" height="3.5" rx="1.5" fill="${bucketColor}" stroke="${S}" stroke-width="2.4"/>
          <ellipse cx="0" cy="-8" rx="10" ry="3.5" fill="${grainColor}" stroke="${S}" stroke-width="1.8"/>
        </g>
      </g>`;
    },
    tags: ["cubetas", "grava", "arena", "filtro", "graduado", "terzaghi", "presa"],
  },

  alerta_desborde_canal_vertedero: {
    id: "alerta_desborde_canal_vertedero",
    name: "Regla Limnimétrica de Nivel Crítico y Pico de Excavación",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-18" width="44" height="36" rx="4" fill="#EF4444" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const waterRise = Math.min(20, (f * 0.16)).toFixed(1);
      const blink = Math.sin(f * 0.3) > 0 ? "#EF4444" : "#FACC15";
      const pickSwing = (Math.sin(f * 0.28) * 22).toFixed(1);
      return `<g transform="scale(1.85)">
        <g transform="translate(-12, 0)">
          <rect x="-5" y="-22" width="10" height="42" rx="1.5" fill="#F8FAFC" stroke="${S}" stroke-width="2.6"/>
          <line x1="-5" y1="-14" x2="1" y2="-14" stroke="#EF4444" stroke-width="2"/>
          <line x1="-5" y1="-6" x2="0" y2="-6" stroke="${S}" stroke-width="1.6"/>
          <line x1="-5" y1="2" x2="0" y2="2" stroke="${S}" stroke-width="1.6"/>
          <line x1="-5" y1="10" x2="0" y2="10" stroke="${S}" stroke-width="1.6"/>
          <circle cx="0" cy="${14 - parseFloat(waterRise)}" r="5.5" fill="${blink}" stroke="${S}" stroke-width="2.2"/>
        </g>

        <g transform="translate(10, -2) rotate(${pickSwing})">
          <rect x="-2.2" y="-16" width="4.4" height="30" rx="1.8" fill="#D97706" stroke="${S}" stroke-width="2.2"/>
          <path d="M -16,-14 Q 0,-21 16,-12 L 13,-8 Q 0,-15 -13,-10 Z" fill="#64748B" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
        </g>
      </g>`;
    },
    tags: ["alerta", "desborde", "canal", "vertedero", "aliviadero", "spillway", "nivel"],
  },

  escalones_piedra_espuma_coladera: {
    id: "escalones_piedra_espuma_coladera",
    name: "Coladera Pluvial de Hierro Fundido Tragando el Caudal Limpio",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-22" y="-18" width="44" height="36" rx="4" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const swirlRot = (f * 4) % 360;
      const bubbleScale = (0.85 + Math.sin(f * 0.25) * 0.18).toFixed(2);
      return `<g transform="scale(1.85)">
        <ellipse cx="0" cy="6" rx="24" ry="11" fill="#475569" stroke="${S}" stroke-width="3"/>
        <ellipse cx="0" cy="6" rx="19" ry="8" fill="#0F172A" stroke="${S}" stroke-width="2.2"/>
        <line x1="-12" y1="0" x2="-12" y2="12" stroke="#64748B" stroke-width="2.8"/>
        <line x1="-4" y1="-2" x2="-4" y2="14" stroke="#64748B" stroke-width="2.8"/>
        <line x1="4" y1="-2" x2="4" y2="14" stroke="#64748B" stroke-width="2.8"/>
        <line x1="12" y1="0" x2="12" y2="12" stroke="#64748B" stroke-width="2.8"/>

        <g transform="translate(0, 4) scale(1, 0.55) rotate(${swirlRot})">
          <path d="M -14,0 A 14,14 0 0,1 0,-14" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
          <path d="M 14,0 A 14,14 0 0,1 0,14" fill="none" stroke="#E0F2FE" stroke-width="3.5" stroke-linecap="round"/>
        </g>
        <g transform="scale(${bubbleScale})">
          <circle cx="-8" cy="-2" r="3.5" fill="#FFFFFF" stroke="#38BDF8" stroke-width="1.5"/>
          <circle cx="7" cy="-3" r="3" fill="#FFFFFF" stroke="#38BDF8" stroke-width="1.5"/>
          <circle cx="0" cy="-6" r="4" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5"/>
        </g>
      </g>`;
    },
    tags: ["escalones", "piedra", "espuma", "coladera", "disipacion", "vertedero", "hidraulica"],
  },

  barquito_papel_lago_represa: {
    id: "barquito_papel_lago_represa",
    name: "Barquito de Papel Origami Navegando con Estela de Agua",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<polygon points="-20,4 20,4 12,16 -12,16" fill="#FFFFFF" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const bob = (Math.sin(f * 0.16) * 2.2).toFixed(1);
      const tilt = (Math.sin(f * 0.14) * 3.8).toFixed(1);
      const rippleRx = (18 + ((f * 0.35) % 10)).toFixed(1);
      const rippleOp = (1 - ((f * 0.35) % 10) / 10).toFixed(2);
      return `<g transform="scale(1.9)">
        <ellipse cx="0" cy="12" rx="${rippleRx}" ry="5" fill="none" stroke="#E0F2FE" stroke-width="2" opacity="${rippleOp}"/>
        <ellipse cx="0" cy="12" rx="16" ry="4" fill="#38BDF8" fill-opacity="0.45" stroke="#0284C7" stroke-width="1.8"/>

        <g transform="translate(0, ${bob}) rotate(${tilt})">
          <polygon points="0,-16 -10,3 10,3" fill="#E2E8F0" stroke="${S}" stroke-width="2.5" stroke-linejoin="round"/>
          <polygon points="0,-14 -8,3 8,3" fill="#FFFFFF" stroke="${S}" stroke-width="2.4" stroke-linejoin="round"/>
          <line x1="0" y1="-14" x2="0" y2="3" stroke="#94A3B8" stroke-width="1.5"/>
          <polygon points="-22,2 22,2 14,12 -14,12" fill="#FFFFFF" stroke="${S}" stroke-width="2.8" stroke-linejoin="round"/>
          <polygon points="-22,2 0,6 22,2 14,12 -14,12" fill="#F1F5F9" stroke="${S}" stroke-width="2.2" stroke-linejoin="round"/>
        </g>
      </g>`;
    },
    tags: ["barquito", "papel", "lago", "represa", "arcoiris", "victoria", "agua"],
  },

  foco_moribundo_cable_largo: {
    id: "foco_moribundo_cable_largo",
    name: "Foco Incandescente Moribundo con Cable Largo",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<circle cx="0" cy="-6" r="18" fill="#451A03" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const emberFlicker = (0.35 + Math.sin(f * 0.4) * 0.15 + (f % 5 === 0 ? 0.08 : 0)).toFixed(2);
      const emberRadius = (6 + Math.sin(f * 0.3) * 1.5).toFixed(1);
      return `<g transform="scale(1.85)">
        <!-- Cable negro largo serpenteante en la base -->
        <path d="M -32,24 Q -16,14 0,26 Q 16,36 32,24" fill="none" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
        <path d="M 0,26 L 0,16" stroke="#0F172A" stroke-width="5"/>

        <!-- Casquillo metálico roscado de latón -->
        <rect x="-8" y="8" width="16" height="8" rx="2" fill="#D97706" stroke="${S}" stroke-width="2.5"/>
        <line x1="-8" y1="11" x2="8" y2="11" stroke="#92400E" stroke-width="1.8"/>
        <line x1="-8" y1="14" x2="8" y2="14" stroke="#92400E" stroke-width="1.8"/>

        <!-- Bulbo de cristal oscuro y transparente -->
        <circle cx="0" cy="-4" r="18" fill="#1E293B" fill-opacity="0.5" stroke="${S}" stroke-width="3"/>
        <path d="M -8,8 L -6,0 C -6,-10 6,-10 6,0 L 8,8 Z" fill="#334155" fill-opacity="0.3"/>

        <!-- Filamento de tungsteno apenas encendido en rojo moribundo -->
        <g opacity="${emberFlicker}">
          <!-- Soporte del filamento -->
          <line x1="-4" y1="6" x2="-2" y2="-4" stroke="#78350F" stroke-width="1.6"/>
          <line x1="4" y1="6" x2="2" y2="-4" stroke="#78350F" stroke-width="1.6"/>
          <!-- Espiral débil -->
          <path d="M -2,-4 Q 0,-10 2,-4" fill="none" stroke="#EF4444" stroke-width="2.6" stroke-linecap="round"/>
          <circle cx="0" cy="-6" r="${emberRadius}" fill="#DC2626" fill-opacity="0.45"/>
          <circle cx="0" cy="-6" r="2.5" fill="#FEF08A"/>
        </g>
      </g>`;
    },
    tags: ["foco", "bombilla", "cable", "electricidad", "moribundo", "filamento", "energia"],
  },

  multimetro_caida_tension_humo: {
    id: "multimetro_caida_tension_humo",
    name: "Multímetro Digital Midiendo Caída de Voltaje con Cable Caliente",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-18" y="-24" width="36" height="48" rx="5" fill="#EAB308" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number, stepProgress?: number, currentState?: string) => {
      const isLow = currentState === "caida" || (currentState === undefined && f >= 45);
      const voltVal = isLow ? " 38 V" : "120 V";
      const lcdColor = isLow ? "#EF4444" : "#22C55E";
      const smokeY = ((f * 1.8) % 28).toFixed(1);
      const smokeOp = (0.8 - ((f * 1.8) % 28) / 28).toFixed(2);
      return `<g transform="scale(1.85)">
        <!-- Hilillo de humo blanco saliendo del cable recalentado -->
        <g transform="translate(18, ${-12 - parseFloat(smokeY)})" opacity="${smokeOp}">
          <circle cx="0" cy="0" r="3.5" fill="#F8FAFC"/>
          <circle cx="-3" cy="-6" r="4.5" fill="#E2E8F0"/>
          <circle cx="2" cy="-12" r="5.5" fill="#CBD5E1"/>
        </g>

        <!-- Trozo de cable negro ardiendo -->
        <path d="M 8,24 Q 18,18 24,6 Q 28,-4 26,-16" fill="none" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/>
        <path d="M 8,24 Q 18,18 24,6 Q 28,-4 26,-16" fill="none" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="6 4"/>

        <!-- Carcasa amarilla de multímetro industrial -->
        <rect x="-20" y="-24" width="38" height="48" rx="6" fill="#FACC15" stroke="${S}" stroke-width="3.5"/>
        <rect x="-16" y="-20" width="30" height="20" rx="3" fill="#0F172A" stroke="${S}" stroke-width="2"/>

        <!-- Pantalla LCD digital retroiluminada -->
        <rect x="-14" y="-18" width="26" height="16" rx="2" fill="#020617"/>
        <text x="-1" y="-6" fill="${lcdColor}" font-family="'Courier New', monospace" font-size="9" font-weight="900" text-anchor="middle">
          ${voltVal}
        </text>

        <!-- Selector giratorio central -->
        <circle cx="-1" cy="9" r="6.5" fill="#1E293B" stroke="${S}" stroke-width="2"/>
        <line x1="-1" y1="9" x2="-1" y2="4" stroke="#FDE047" stroke-width="2" stroke-linecap="round"/>

        <!-- Bornes y puntas de prueba roja y negra -->
        <circle cx="-8" cy="18" r="2.5" fill="#DC2626"/>
        <circle cx="6" cy="18" r="2.5" fill="#000000"/>
        <path d="M -8,20 Q -18,28 -24,20" fill="none" stroke="#DC2626" stroke-width="2.4" stroke-linecap="round"/>
        <polygon points="-26,18 -22,22 -26,24" fill="#94A3B8" stroke="${S}" stroke-width="1.2"/>
      </g>`;
    },
    tags: ["multimetro", "voltaje", "caida", "resistencia", "humo", "calor", "medicion"],
  },

  microcosmos_choque_electrones_joule: {
    id: "microcosmos_choque_electrones_joule",
    name: "Microcosmos del Cobre con Choques de Electrones y Calor Joule",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<circle cx="0" cy="0" r="20" fill="#B45309" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const eShift1 = ((f * 3.5) % 40) - 20;
      const eShift2 = (((f + 14) * 3.2) % 40) - 20;
      const sparkPulse = (Math.sin(f * 0.6) * 3).toFixed(1);
      return `<g transform="scale(1.85)">
        <!-- Tubo conductor de cobre transparente -->
        <rect x="-26" y="-18" width="52" height="36" rx="6" fill="#78350F" fill-opacity="0.3" stroke="${S}" stroke-width="3"/>
        <rect x="-26" y="-18" width="52" height="4" fill="#B45309"/>
        <rect x="-26" y="14" width="52" height="4" fill="#B45309"/>

        <!-- Átomos de cobre fijos en la red cristalina -->
        <circle cx="-14" cy="-5" r="7" fill="#EA580C" stroke="${S}" stroke-width="2.2"/>
        <text x="-14" y="-3" fill="#FEF08A" font-size="5" font-weight="900" text-anchor="middle">Cu</text>
        <circle cx="14" cy="-5" r="7" fill="#EA580C" stroke="${S}" stroke-width="2.2"/>
        <text x="14" y="-3" fill="#FEF08A" font-size="5" font-weight="900" text-anchor="middle">Cu</text>
        <circle cx="0" cy="6" r="7.5" fill="#D97706" stroke="${S}" stroke-width="2.2"/>
        <text x="0" y="8" fill="#FEF08A" font-size="5" font-weight="900" text-anchor="middle">Cu</text>

        <!-- Ondas de choque térmico rojas por colisión (Efecto Joule) -->
        <circle cx="-6" cy="-2" r="${8 + Math.abs(parseFloat(sparkPulse))}" fill="none" stroke="#EF4444" stroke-width="2.2" opacity="0.8"/>
        <polygon points="-6,-6 -3,-2 -6,2 -9,-2" fill="#FACC15"/>

        <!-- Electrones azules en tropel colisionando -->
        <g transform="translate(${eShift1}, -5)">
          <circle cx="0" cy="0" r="3.2" fill="#38BDF8" stroke="${S}" stroke-width="1.4"/>
          <text x="0" y="1.5" fill="#000" font-size="4" font-weight="900" text-anchor="middle">-</text>
        </g>
        <g transform="translate(${eShift2}, 4)">
          <circle cx="0" cy="0" r="3" fill="#60A5FA" stroke="${S}" stroke-width="1.4"/>
          <text x="0" y="1.5" fill="#000" font-size="4" font-weight="900" text-anchor="middle">-</text>
        </g>
      </g>`;
    },
    tags: ["microcosmos", "cobre", "electrones", "joule", "calor", "choques", "resistencia"],
  },

  transformador_bobinas_balanza_potencia: {
    id: "transformador_bobinas_balanza_potencia",
    name: "Transformador Elevador con Bobinas de Cobre y Balanza de Potencia",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-20" y="-18" width="40" height="36" rx="4" fill="#334155" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const humPulse = (Math.sin(f * 0.4) * 1.5).toFixed(1);
      return `<g transform="scale(1.85)">
        <!-- Núcleo de hierro laminado cuadrado (circuito magnético) -->
        <rect x="-22" y="-20" width="44" height="40" rx="4" fill="#334155" stroke="${S}" stroke-width="3"/>
        <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#0F172A" stroke="${S}" stroke-width="2"/>

        <!-- Bobinado primario de pocas vueltas (Izquierda, alambre grueso) -->
        <g transform="translate(-16, 0)">
          <rect x="-5" y="-14" width="10" height="5" rx="1.5" fill="#EA580C" stroke="${S}" stroke-width="1.4"/>
          <rect x="-5" y="-6" width="10" height="5" rx="1.5" fill="#C2410C" stroke="${S}" stroke-width="1.4"/>
          <rect x="-5" y="2" width="10" height="5" rx="1.5" fill="#EA580C" stroke="${S}" stroke-width="1.4"/>
          <rect x="-5" y="10" width="10" height="5" rx="1.5" fill="#C2410C" stroke="${S}" stroke-width="1.4"/>
        </g>

        <!-- Bobinado secundario de miles de vueltas (Derecha, alambre delgado dorado) -->
        <g transform="translate(16, 0)">
          {[ -14, -10, -6, -2, 2, 6, 10 ].map((by, idx) => (
            <rect key={idx} x="-4.5" y={by} width="9" height="3" rx="1" fill="#FACC15" stroke="${S}" stroke-width="1.2"/>
          ))}
        </g>

        <!-- Campo magnético oscilante en el núcleo (zumbido 60Hz) -->
        <g opacity="${0.6 + Math.abs(parseFloat(humPulse)) * 0.2}">
          <line x1="-10" y1="-14" x2="10" y2="-14" stroke="#38BDF8" stroke-width="2" stroke-dasharray="3 2"/>
          <line x1="-10" y1="14" x2="10" y2="14" stroke="#38BDF8" stroke-width="2" stroke-dasharray="3 2"/>
        </g>
      </g>`;
    },
    tags: ["transformador", "bobinas", "cobre", "hierro", "voltaje", "alta_tension", "potencia"],
  },

  poste_aislador_arco_voltaico: {
    id: "poste_aislador_arco_voltaico",
    name: "Poste Eléctrico con Aisladores Cerámicos y Arco Voltaico",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-18" y="-22" width="36" height="44" rx="4" fill="#78350F" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const sparkPoints = (f % 4 === 0)
        ? "-6,-12 -2,-8 4,-14 8,-6"
        : "-6,-12 0,-14 2,-8 8,-6";
      const sparkGlow = (0.7 + Math.sin(f * 0.7) * 0.3).toFixed(2);
      return `<g transform="scale(1.85)">
        <!-- Poste de madera con cruceta superior -->
        <rect x="-4" y="-24" width="8" height="48" rx="2" fill="#78350F" stroke="${S}" stroke-width="2.8"/>
        <rect x="-24" y="-18" width="48" height="6" rx="2" fill="#92400E" stroke="${S}" stroke-width="2.5"/>

        <!-- Aisladores cerámicos acampanados blancos en las puntas -->
        <g transform="translate(-18, -18)">
          <polygon points="-5,0 5,0 7,-8 -7,-8" fill="#F8FAFC" stroke="${S}" stroke-width="1.6"/>
          <polygon points="-4,-7 4,-7 6,-13 -6,-13" fill="#E2E8F0" stroke="${S}" stroke-width="1.6"/>
        </g>
        <g transform="translate(18, -18)">
          <polygon points="-5,0 5,0 7,-8 -7,-8" fill="#F8FAFC" stroke="${S}" stroke-width="1.6"/>
          <polygon points="-4,-7 4,-7 6,-13 -6,-13" fill="#E2E8F0" stroke="${S}" stroke-width="1.6"/>
        </g>

        <!-- Cables aéreos de alta tensión tensados -->
        <line x1="-30" y1="-31" x2="30" y2="-31" stroke="#38BDF8" stroke-width="2.5"/>

        <!-- Arco voltaico crepitando en el aire -->
        <polyline points="${sparkPoints}" fill="none" stroke="#C084FC" stroke-width="2.6" stroke-linecap="round" opacity="${sparkGlow}"/>
        <polyline points="${sparkPoints}" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round"/>
      </g>`;
    },
    tags: ["poste", "aislador", "arco_voltaico", "chispas", "alta_tension", "cables", "red"],
  },

  transformador_reductor_herramientas: {
    id: "transformador_reductor_herramientas",
    name: "Transformador Reductor Bajando a 120V con Destornillador",
    family: "tecnologia",
    defaultPlacement: "both",
    svg: `<rect x="-18" y="-18" width="36" height="36" rx="4" fill="#0284C7" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const toolAngle = (18 + Math.sin(f * 0.3) * 14).toFixed(1);
      return `<g transform="scale(1.85)">
        <!-- Transformador secundario de bajada -->
        <rect x="-20" y="-18" width="40" height="36" rx="4" fill="#1E293B" stroke="${S}" stroke-width="3"/>
        <rect x="-16" y="-14" width="32" height="18" rx="2" fill="#0F172A"/>

        <!-- Reloj indicador analógico estabilizándose en 120V -->
        <circle cx="0" cy="-5" r="7" fill="#F8FAFC" stroke="${S}" stroke-width="1.5"/>
        <line x1="0" y1="-5" x2="2" y2="-9" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round"/>

        <!-- Bornes de salida domésticos de 120V -->
        <circle cx="-10" cy="11" r="3" fill="#D97706" stroke="${S}" stroke-width="1.5"/>
        <circle cx="10" cy="11" r="3" fill="#D97706" stroke="${S}" stroke-width="1.5"/>

        <!-- Destornillador aislado de electricista ajustando el borne -->
        <g transform="translate(10, 11) rotate(${toolAngle})">
          <line x1="0" y1="0" x2="0" y2="-12" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round"/>
          <rect x="-3" y="-24" width="6" height="12" rx="2" fill="#DC2626" stroke="${S}" stroke-width="1.8"/>
        </g>
      </g>`;
    },
    tags: ["transformador", "reductor", "120v", "herramientas", "destornillador", "electricista", "seguridad"],
  },

  bombilla_estallido_luz_gafas: {
    id: "bombilla_estallido_luz_gafas",
    name: "Bombilla Estallando en Luz Blanca Radiante con Gafas Oscuras",
    family: "vida_cotidiana",
    defaultPlacement: "both",
    svg: `<circle cx="0" cy="0" r="20" fill="#FEF08A" stroke="${S}" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const rayScale = (1.0 + Math.sin(f * 0.2) * 0.08).toFixed(2);
      const glowPulse = (0.85 + Math.sin(f * 0.25) * 0.15).toFixed(2);
      return `<g transform="scale(1.9)">
        <!-- Rayos de luz envolventes poligonales de explosión luminosa -->
        <g transform="scale(${rayScale})" opacity="${glowPulse}">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos((deg * Math.PI) / 180) * 28}
              y2={Math.sin((deg * Math.PI) / 180) * 28}
              stroke="#FEF08A"
              stroke-width="3"
              stroke-linecap="round"
            />
          ))}
        </g>

        <!-- Foco incandescente irradiando luz blanca radiante -->
        <circle cx="0" cy="0" r="17" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
        <circle cx="0" cy="0" r="13" fill="#FEF08A" fill-opacity="0.75"/>
        <circle cx="0" cy="0" r="7" fill="#FFFFFF"/>

        <!-- Gafas de sol oscuras icónicas superpuestas -->
        <g transform="translate(0, 18)">
          <path d="M -15,0 L 15,0" stroke="#000000" stroke-width="2.5"/>
          <polygon points="-14,0 -5,0 -7,8 -12,8" fill="#0F172A" stroke="${S}" stroke-width="1.8"/>
          <polygon points="5,0 14,0 12,8 7,8" fill="#0F172A" stroke="${S}" stroke-width="1.8"/>
          <!-- Reflejo blanco en las gafas -->
          <line x1="-12" y1="2" x2="-8" y2="6" stroke="#FFFFFF" stroke-width="1.2"/>
          <line x1="7" y1="2" x2="11" y2="6" stroke="#FFFFFF" stroke-width="1.2"/>
        </g>
      </g>`;
    },
    tags: ["bombilla", "luz", "blanca", "estallido", "gafas", "sol", "victoria", "red_electrica"],
  },

  tabla_madera_quebrada_lodo: {
    id: "tabla_madera_quebrada_lodo",
    name: "Tabla de Madera Partida en Lodo",
    family: "herramientas_objetos",
    defaultPlacement: "both",
    svg: `<rect x="-35" y="-6" width="70" height="12" rx="2" fill="#92400E" stroke="${S}" stroke-width="3.5"/>`,
    animatedSvg: (f: number) => {
      const sagY = (Math.sin(f * 0.15) * 4).toFixed(1);
      const splashY = (-Math.abs(Math.sin(f * 0.25)) * 14).toFixed(1);
      return `<g transform="scale(1.35)">
        <!-- Mitades de tabla quebradas con astillas -->
        <g transform="translate(0, ${sagY})">
          <g transform="translate(-18, 0) rotate(14)">
            <polygon points="-26,-6 6,-6 3,6 -26,6" fill="#B45309" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
            <line x1="-20" y1="-1" x2="0" y2="-1" stroke="#78350F" stroke-width="2"/>
            <polygon points="6,-6 11,-2 7,2 10,6 3,6" fill="#FDE68A" stroke="${S}" stroke-width="1.5"/>
          </g>
          <g transform="translate(18, 0) rotate(-14)">
            <polygon points="-3,-6 26,-6 26,6 -6,6" fill="#B45309" stroke="${S}" stroke-width="3.5" stroke-linejoin="round"/>
            <line x1="0" y1="-1" x2="20" y2="-1" stroke="#78350F" stroke-width="2"/>
            <polygon points="-3,-6 -8,-2 -4,2 -9,6 -6,6" fill="#FDE68A" stroke="${S}" stroke-width="1.5"/>
          </g>
        </g>
        <!-- Salpicadura de fango líquido viva -->
        <g transform="translate(0, 16)">
          <ellipse cx="0" cy="4" rx="34" ry="7" fill="#713F12" stroke="${S}" stroke-width="2.5"/>
          <ellipse cx="0" cy="4" rx="24" ry="4" fill="#A16207"/>
          <circle cx="-16" cy="${splashY}" r="4" fill="#713F12" stroke="${S}" stroke-width="1.5"/>
          <circle cx="14" cy="${(Number(splashY) * 0.85).toFixed(1)}" r="4.5" fill="#713F12" stroke="${S}" stroke-width="1.5"/>
          <circle cx="0" cy="${(Number(splashY) * 1.15).toFixed(1)}" r="3" fill="#A16207" stroke="${S}" stroke-width="1.2"/>
        </g>
      </g>`;
    },
    tags: ["tabla", "madera", "quebrada", "lodo", "fango", "agua", "astillas"],
  },

  diagrama_flexion_viga_flechas: {
    id: "diagrama_flexion_viga_flechas",
    name: "Viga en Banco de Flexión con Vectores",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-35" y="-10" width="70" height="20" rx="3" fill="#B45309" stroke="${S}" stroke-width="3.5"/>`,
    animatedSvg: (f: number) => {
      const pressDown = Math.sin(f * 0.2) * 4;
      return `<g transform="scale(1.35)">
        <!-- Bloques de apoyo en los extremos (apoyo simple) -->
        <polygon points="-38,10 -30,-4 -22,10" fill="#64748B" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="22,10 30,-4 38,10" fill="#64748B" stroke="${S}" stroke-width="3" stroke-linejoin="round"/>

        <!-- Pistón hidráulico / Peso cilíndrico que baja empujando -->
        <g transform="translate(0, ${(-16 + pressDown).toFixed(1)})">
          <rect x="-10" y="-14" width="20" height="18" rx="2" fill="#334155" stroke="${S}" stroke-width="3"/>
          <path d="M 0 4 L 0 14 M -4 10 L 0 14 L 4 10" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>

        <!-- Viga de madera curvándose bajo la carga -->
        <path d="M -34 -2 Q 0 ${(-2 + pressDown * 1.8).toFixed(1)} 34 -2 L 34 8 Q 0 ${(8 + pressDown * 1.8).toFixed(1)} -34 8 Z" fill="#D97706" stroke="${S}" stroke-width="3.5"/>
        <line x1="-30" y1="3" x2="30" y2="3" stroke="#FEF08A" stroke-width="1.5" stroke-dasharray="3 3"/>

        <!-- FLECHAS DE COMPRESIÓN ARRIBA (rojo convergiendo) -->
        <g transform="translate(0, ${(-10 + pressDown * 0.9).toFixed(1)})">
          <path d="M -24 0 L -8 0 M -12 -3 L -8 0 L -12 3" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M 24 0 L 8 0 M 12 -3 L 8 0 L 12 3" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="0" y="-4" font-family="'Arial Black', sans-serif" font-weight="900" font-size="6" fill="#EF4444" text-anchor="middle">COMPRESIÓN</text>
        </g>

        <!-- FLECHAS DE TENSIÓN ABAJO (cyan divergiendo) -->
        <g transform="translate(0, ${(18 + pressDown * 1.2).toFixed(1)})">
          <path d="M -8 0 L -24 0 M -20 -3 L -24 0 L -20 3" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <path d="M 8 0 L 24 0 M 20 -3 L 24 0 L 20 3" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <text x="0" y="9" font-family="'Arial Black', sans-serif" font-weight="900" font-size="6" fill="#38BDF8" text-anchor="middle">TENSIÓN</text>
          <!-- Grieta que se abre en el centro inferior -->
          <polygon points="-2,-10 0,-1 2,-10" fill="#EF4444" stroke="${S}" stroke-width="1.5"/>
        </g>
      </g>`;
    },
    tags: ["diagrama", "flexion", "viga", "compresion", "tension", "piston", "ensayo"],
  },

  cuerda_canamo_prueba_tension: {
    id: "cuerda_canamo_prueba_tension",
    name: "Cuerda de Cáñamo Tensada Vibrante",
    family: "herramientas_objetos",
    defaultPlacement: "both",
    svg: `<path d="M -30 0 L 30 0" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>`,
    animatedSvg: (f: number) => {
      const twangVib = (Math.sin(f * 0.45) * 2).toFixed(1);
      const sparkRot = ((f * 10) % 360).toFixed(0);
      return `<g transform="scale(1.35)">
        <!-- Cuerda gruesa dorada estirada al máximo vibrando -->
        <g transform="translate(0, ${twangVib})">
          <line x1="-38" y1="0" x2="38" y2="0" stroke="${S}" stroke-width="11" stroke-linecap="round"/>
          <line x1="-38" y1="0" x2="38" y2="0" stroke="#F59E0B" stroke-width="7" stroke-linecap="round"/>
          {[-28, -18, -8, 2, 12, 22, 32].map((x, i) => (
            <line key={i} x1={x} y1="-3.5" x2={x + 4} y2="3.5" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"/>
          ))}
          <!-- Argollas de acero templado en los extremos -->
          <circle cx="-38" cy="0" r="6" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
          <circle cx="38" cy="0" r="6" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
        </g>
        <!-- Chispas doradas de tracción en el punto de máxima tensión -->
        <g transform="translate(0, 0) rotate(${sparkRot})">
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#FDE047" stroke-width="3" stroke-linecap="round"/>
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#FDE047" stroke-width="3" stroke-linecap="round"/>
        </g>
      </g>`;
    },
    tags: ["cuerda", "canamo", "cable", "tension", "traccion", "fuerza"],
  },

  torre_madera_mazo_compresion: {
    id: "torre_madera_mazo_compresion",
    name: "Gran Mazo de Construcción y Poste",
    family: "herramientas_objetos",
    defaultPlacement: "both",
    svg: `<line x1="0" y1="18" x2="0" y2="-110" stroke="#D97706" stroke-width="8" stroke-linecap="round"/><rect x="-24" y="-140" width="48" height="36" rx="5" fill="#334155" stroke="${S}" stroke-width="5"/>`,
    animatedSvg: (f: number) => {
      const hitCycle = f % 24;
      // Ciclo de golpe: 0-11 elevación atrás (-75° sobre hombro), 12-15 golpe masivo vertical (+22°), 16-23 recuperación
      let angle = -75;
      let isHit = false;
      if (hitCycle < 11) {
        angle = -75 + (hitCycle / 11) * 20;
      } else if (hitCycle >= 11 && hitCycle <= 15) {
        angle = 22;
        isHit = true;
      } else {
        angle = 22 - ((hitCycle - 15) / 8) * 97;
      }
      return `<g transform="translate(0, 0)">
        <!-- Gran mazo de obra de dos manos pivoteando en el agarre (0,0) -->
        <g transform="rotate(${angle.toFixed(1)})">
          <!-- Mango largo reforzado de nogal macizo -->
          <line x1="0" y1="20" x2="0" y2="-130" stroke="#000000" stroke-width="11" stroke-linecap="round"/>
          <line x1="0" y1="20" x2="0" y2="-130" stroke="#D97706" stroke-width="7" stroke-linecap="round"/>
          <circle cx="0" cy="20" r="7" fill="#78350F" stroke="#000000" stroke-width="3"/>
          <line x1="-5" y1="-30" x2="5" y2="-30" stroke="#000000" stroke-width="3"/>
          <line x1="-5" y1="-50" x2="5" y2="-50" stroke="#000000" stroke-width="3"/>

          <!-- Cabeza colosal de acero forjado -->
          <g transform="translate(0, -130)">
            <rect x="-27" y="-20" width="54" height="40" rx="5" fill="#334155" stroke="${S}" stroke-width="5"/>
            <polygon points="-27,-20 -20,-26 20,-26 27,-20" fill="#475569" stroke="${S}" stroke-width="3"/>
            <rect x="-22" y="-15" width="44" height="10" fill="#64748B"/>
            <line x1="-27" y1="0" x2="27" y2="0" stroke="#94A3B8" stroke-width="3.5"/>
            <!-- Ojo del mango con cuña metálica -->
            <ellipse cx="0" cy="0" rx="6" ry="12" fill="#0F172A" stroke="${S}" stroke-width="2"/>
          </g>
        </g>
        <!-- Estallido de impacto y chispas al golpear el poste -->
        ${isHit ? `
          <g transform="translate(55, 30)">
            <line x1="0" y1="0" x2="35" y2="-22" stroke="#FEF08A" stroke-width="6" stroke-linecap="round"/>
            <line x1="0" y1="0" x2="28" y2="28" stroke="#FEF08A" stroke-width="6" stroke-linecap="round"/>
            <line x1="0" y1="0" x2="-25" y2="30" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
            <line x1="0" y1="0" x2="42" y2="5" stroke="#FEF08A" stroke-width="5" stroke-linecap="round"/>
            <circle cx="0" cy="0" r="14" fill="#FDE047" stroke="${S}" stroke-width="3"/>
            <circle cx="0" cy="0" r="8" fill="#FFFFFF"/>
          </g>
        ` : ""}
      </g>`;
    },
    tags: ["mazo", "martillo", "construccion", "golpe", "fuerza", "impacto"],
  },

  catenaria_anclaje_rocas_tierra: {
    id: "catenaria_anclaje_rocas_tierra",
    name: "Roca de Anclaje y Tensor a 45 Grados",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<polygon points="-20,0 20,-10 15,20 -15,15" fill="#64748B" stroke="${S}" stroke-width="3"/>`,
    animatedSvg: (f: number) => {
      const cableTwang = (Math.sin(f * 0.4) * 1.5).toFixed(1);
      return `<g transform="scale(1.35)">
        <polygon points="-28,4 12,-16 32,8 18,28 -20,24" fill="#64748B" stroke="${S}" stroke-width="4" stroke-linejoin="round"/>
        <line x1="-10" y1="2" x2="16" y2="4" stroke="#334155" stroke-width="2.5"/>
        <line x1="4" y1="-8" x2="10" y2="16" stroke="#334155" stroke-width="2"/>
        <circle cx="0" cy="0" r="7" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
        <g transform="translate(0, ${cableTwang})">
          <line x1="0" y1="0" x2="-34" y2="-34" stroke="${S}" stroke-width="8" stroke-linecap="round"/>
          <line x1="0" y1="0" x2="-34" y2="-34" stroke="#F59E0B" stroke-width="5" stroke-linecap="round"/>
          <circle cx="0" cy="0" r="3.5" fill="#FDE047"/>
        </g>
      </g>`;
    },
    tags: ["roca", "anclaje", "deadman", "cable", "tensor", "45grados"],
  },

  pendolas_suspension_tabla_vuelo: {
    id: "pendolas_suspension_tabla_vuelo",
    name: "Tirantes Péndolas de Suspensión",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<path d="M -15 -20 L -15 20 M 15 -20 L 15 20" stroke="#38BDF8" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const flowY = ((f * 2) % 24) - 12;
      return `<g transform="scale(1.35)">
        <line x1="-30" y1="-20" x2="30" y2="-20" stroke="${S}" stroke-width="7" stroke-linecap="round"/>
        <line x1="-30" y1="-20" x2="30" y2="-20" stroke="#F59E0B" stroke-width="4.5" stroke-linecap="round"/>
        <line x1="-16" y1="-20" x2="-16" y2="16" stroke="${S}" stroke-width="4.5"/>
        <line x1="-16" y1="-20" x2="-16" y2="16" stroke="#38BDF8" stroke-width="3"/>
        <circle cx="-16" cy="16" r="3" fill="#0284C7" stroke="${S}" stroke-width="1.5"/>
        <line x1="16" y1="-20" x2="16" y2="16" stroke="${S}" stroke-width="4.5"/>
        <line x1="16" y1="-20" x2="16" y2="16" stroke="#38BDF8" stroke-width="3"/>
        <circle cx="16" cy="16" r="3" fill="#0284C7" stroke="${S}" stroke-width="1.5"/>
        <rect x="-30" y="16" width="60" height="8" rx="2" fill="#B45309" stroke="${S}" stroke-width="3"/>
        <polygon points="-16,${flowY} -19,${flowY + 6} -13,${flowY + 6}" fill="#FEF08A"/>
        <polygon points="16,${flowY} 13,${flowY + 6} 19,${flowY + 6}" fill="#FEF08A"/>
      </g>`;
    },
    tags: ["pendolas", "tirantes", "suspension", "calzada", "cable"],
  },

  carretilla_empujada_rocas: {
    id: "carretilla_empujada_rocas",
    name: "Carretilla de Obra Empujada con Rueda Giratoria",
    family: "herramientas_objetos",
    defaultPlacement: "both",
    svg: `<path d="M 0 0 L 80 50 L 140 120" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const bBounce = Math.sin(f * 0.45) * 2;
      const wheelRot = (f * 26) % 360;
      return `<g transform="translate(0, 0)">
        <!-- Manillares empuñados por las manos del Stickman (0,0) -->
        <line x1="-30" y1="-8" x2="30" y2="32" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
        <line x1="-30" y1="-8" x2="30" y2="32" stroke="#D97706" stroke-width="5" stroke-linecap="round"/>
        <rect x="-36" y="-13" width="14" height="9" rx="2.5" fill="#1E293B" stroke="${S}" stroke-width="2"/>

        <!-- Chasis inclinado que baja hasta la rueda rodando sobre la calzada (+175px) -->
        <g transform="translate(0, ${bBounce.toFixed(1)})">
          <line x1="30" y1="32" x2="125" y2="175" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
          <line x1="30" y1="32" x2="125" y2="175" stroke="#475569" stroke-width="5" stroke-linecap="round"/>

          <!-- Pata de apoyo trasera (elevada mientras se empuja) -->
          <line x1="38" y1="42" x2="34" y2="135" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
          <line x1="26" y1="135" x2="44" y2="135" stroke="#000000" strokeWidth="5" strokeLinecap="round"/>

          <!-- Rueda delantera con rayos rodando exactamente sobre la calzada (+175px con radio 22) -->
          <g transform="translate(125, 175)">
            <circle cx="0" cy="0" r="22" fill="#0F172A" stroke="${S}" stroke-width="5"/>
            <circle cx="0" cy="0" r="11" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
            <g transform="rotate(${wheelRot.toFixed(1)})">
              <line x1="-24" y1="0" x2="24" y2="0" stroke="#E2E8F0" stroke-width="4"/>
              <line x1="0" y1="-24" x2="0" y2="24" stroke="#E2E8F0" stroke-width="4"/>
              <line x1="-17" y1="-17" x2="17" y2="17" stroke="#CBD5E1" stroke-width="3"/>
              <line x1="-17" y1="17" x2="17" y2="-17" stroke="#CBD5E1" stroke-width="3"/>
            </g>
          </g>

          <!-- Tolva de acero rojo neo-brutalista cargada de rocas pesadas -->
          <polygon points="20,40 128,40 152,-18 10,-18" fill="#DC2626" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
          <polygon points="26,35 122,35 144,-12 18,-12" fill="#EF4444"/>

          <!-- Montaña de rocas de prueba pesadas apiladas -->
          <polygon points="15,-18 62,-18 38,-56" fill="#64748B" stroke="${S}" stroke-width="4"/>
          <polygon points="56,-18 116,-18 88,-62" fill="#94A3B8" stroke="${S}" stroke-width="4"/>
          <polygon points="106,-18 152,-18 128,-50" fill="#475569" stroke="${S}" stroke-width="4"/>
          <polygon points="34,-42 98,-42 66,-72" fill="#CBD5E1" stroke="${S}" stroke-width="4"/>
          <circle cx="66" cy="-58" r="3.5" fill="#FEF08A"/>
        </g>
      </g>`;
    },
    tags: ["carretilla", "rocas", "empujar", "obra", "rueda", "giro"],
  },

  carretilla_estacionada_rocas: {
    id: "carretilla_estacionada_rocas",
    name: "Carretilla Estacionada en la Hierba",
    family: "herramientas_objetos",
    defaultPlacement: "both",
    svg: `<path d="M 0 0 L 80 50 L 140 120" stroke="#000" stroke-width="6"/>`,
    animatedSvg: () => {
      return `<g transform="translate(0, 0)">
        <!-- Manillares en reposo -->
        <line x1="-25" y1="-5" x2="35" y2="40" stroke="#000000" stroke-width="9" stroke-linecap="round"/>
        <line x1="-25" y1="-5" x2="35" y2="40" stroke="#D97706" stroke-width="5.5" stroke-linecap="round"/>
        <rect x="-32" y="-10" width="16" height="10" rx="3" fill="#1E293B" stroke="${S}" stroke-width="2.5"/>

        <!-- Chasis apoyado firmemente -->
        <line x1="35" y1="40" x2="160" y2="150" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
        <line x1="35" y1="40" x2="160" y2="150" stroke="#475569" stroke-width="5" stroke-linecap="round"/>

        <!-- Patas de apoyo traseras firmemente plantadas en el suelo (y=150) -->
        <line x1="45" y1="50" x2="40" y2="150" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
        <line x1="32" y1="150" x2="52" y2="150" stroke="#000000" stroke-width="7" stroke-linecap="round"/>

        <!-- Rueda delantera inmóvil tocando el pasto (y=150) -->
        <g transform="translate(160, 150)">
          <circle cx="0" cy="0" r="28" fill="#0F172A" stroke="${S}" stroke-width="5"/>
          <circle cx="0" cy="0" r="14" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
          <line x1="-24" y1="0" x2="24" y2="0" stroke="#E2E8F0" stroke-width="4"/>
          <line x1="0" y1="-24" x2="0" y2="24" stroke="#E2E8F0" stroke-width="4"/>
        </g>

        <!-- Tolva roja -->
        <polygon points="25,50 145,50 175,-10 15,-10" fill="#DC2626" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="32,45 140,45 166,-3 22,-3" fill="#EF4444"/>

        <!-- Rocas pesadas apiladas -->
        <polygon points="20,-10 70,-10 45,-50" fill="#64748B" stroke="${S}" stroke-width="4.5"/>
        <polygon points="65,-10 130,-10 100,-55" fill="#94A3B8" stroke="${S}" stroke-width="4.5"/>
        <polygon points="120,-10 170,-10 145,-45" fill="#475569" stroke="${S}" stroke-width="4.5"/>
        <polygon points="40,-35 110,-35 75,-70" fill="#CBD5E1" stroke="${S}" stroke-width="4.5"/>
      </g>`;
    },
    tags: ["carretilla", "estacionada", "parada", "rocas", "hierba", "descanso"],
  },



  llave_abrazadera_escape: {
    id: "llave_abrazadera_escape",
    name: "Llave Ajustando Abrazadera de Escape",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<path d="M 0 0 L 40 40" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const wiggle = Math.sin(f * 0.4) * 8;
      const sparkOpacity = Math.sin(f * 0.8) > 0.4 ? 1 : 0;
      return `<g transform="translate(0, 0)">
        <!-- Tubo de escape de acero pulido -->
        <rect x="15" y="-60" width="38" height="120" rx="6" fill="#94A3B8" stroke="${S}" stroke-width="5"/>
        <line x1="28" y1="-50" x2="28" y2="50" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
        <!-- Abrazadera metálica con perno -->
        <rect x="10" y="-14" width="48" height="28" rx="4" fill="#D97706" stroke="${S}" stroke-width="5"/>
        <circle cx="50" cy="0" r="7" fill="#FEF08A" stroke="${S}" stroke-width="3.5"/>
        <!-- Llave inglesa ajustando el perno con inclinación oscilante -->
        <g transform="translate(50, 0) rotate(${wiggle.toFixed(1)})">
          <line x1="0" y1="0" x2="85" y2="45" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
          <line x1="0" y1="0" x2="85" y2="45" stroke="#38BDF8" stroke-width="7" stroke-linecap="round"/>
          <!-- Boca de la llave -->
          <circle cx="0" cy="0" r="14" fill="#0284C7" stroke="${S}" stroke-width="4.5"/>
          <circle cx="0" cy="0" r="6" fill="#0F172A"/>
        </g>
        <!-- Destello de torque mecánico -->
        <g transform="translate(62, -10)" opacity="${sparkOpacity}">
          <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" fill="#FEF08A" stroke="${S}" stroke-width="2"/>
        </g>
      </g>`;
    },
    tags: ["llave", "escape", "abrazadera", "kart", "taller", "mecanica"],
  },

  sonometro_digital_alarma: {
    id: "sonometro_digital_alarma",
    name: "Sonómetro Digital de Alarma Sónica 115 dB",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<path d="M 0 0 L 30 50" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const shake = Math.sin(f * 0.6) * 3;
      const flash = (f % 10) < 5;
      return `<g transform="translate(${shake.toFixed(1)}, 0)">
        <!-- Cuerpo ergonómico del sonómetro amarillo industrial -->
        <rect x="-24" y="-30" width="48" height="95" rx="10" fill="#FACC15" stroke="${S}" stroke-width="5.5"/>
        <!-- Micrófono de medición con capuchón de espuma negra -->
        <rect x="-10" y="-62" width="20" height="32" rx="7" fill="#0F172A" stroke="${S}" stroke-width="4"/>
        <circle cx="0" cy="-62" r="10" fill="#334155" stroke="${S}" stroke-width="3"/>
        <!-- Pantalla LCD retroiluminada roja de advertencia -->
        <rect x="-18" y="-18" width="36" height="32" rx="4" fill="${flash ? "#DC2626" : "#7F1D1D"}" stroke="${S}" stroke-width="3.5"/>
        <text x="0" y="-3" fill="#FFFFFF" font-size="11" font-weight="900" font-family="sans-serif" text-anchor="middle">115</text>
        <text x="0" y="8" fill="#FEF08A" font-size="8" font-weight="900" font-family="sans-serif" text-anchor="middle">dB</text>
        <!-- Vúmetro de barras LED sónico -->
        <g transform="translate(-16, 20)">
          <rect x="0" y="0" width="6" height="6" rx="1" fill="#22C55E" stroke="${S}" stroke-width="1.5"/>
          <rect x="8" y="0" width="6" height="6" rx="1" fill="#F59E0B" stroke="${S}" stroke-width="1.5"/>
          <rect x="16" y="0" width="6" height="6" rx="1" fill="#EF4444" stroke="${S}" stroke-width="1.5"/>
          <rect x="24" y="0" width="6" height="6" rx="1" fill="#DC2626" stroke="${S}" stroke-width="1.5"/>
        </g>
        <!-- Ondas acústicas violentas en el aire -->
        <path d="M 18 -62 Q 32 -55 36 -40" stroke="#EF4444" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 24 -72 Q 44 -60 48 -35" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>`;
    },
    tags: ["sonometro", "decibelios", "ruido", "db", "medidor", "alarma"],
  },

  antorcha_soldadura_tig_chispas: {
    id: "antorcha_soldadura_tig_chispas",
    name: "Antorcha de Soldadura TIG con Chispas",
    family: "herramientas_objetos",
    defaultPlacement: "right",
    svg: `<path d="M 0 0 L 50 20" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const spark1 = Math.sin(f * 0.7) * 14;
      const spark2 = Math.cos(f * 0.9) * 18;
      const arcGlow = 0.7 + Math.sin(f * 0.5) * 0.3;
      return `<g transform="translate(0, 0)">
        <!-- Mango azul y cable flexible de soldadora -->
        <line x1="-35" y1="45" x2="10" y2="10" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
        <line x1="-35" y1="45" x2="10" y2="10" stroke="#2563EB" stroke-width="7" stroke-linecap="round"/>
        <!-- Boquilla cerámica de tungsteno -->
        <polygon points="10,10 32,-8 40,-2 18,16" fill="#F43F5E" stroke="${S}" stroke-width="4"/>
        <line x1="36" y1="-5" x2="48" y2="-15" stroke="#FEF08A" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Destello de plasma / arco eléctrico brillante -->
        <circle cx="50" cy="-17" r="${(8 * arcGlow).toFixed(1)}" fill="#FFFFFF" stroke="#38BDF8" stroke-width="3"/>
        <circle cx="50" cy="-17" r="${(4 * arcGlow).toFixed(1)}" fill="#FEF08A"/>
        <!-- Lluvia de micro-chispas incandescentes -->
        <circle cx="${55 + spark1}" cy="${-12 + Math.abs(spark2)}" r="2.5" fill="#FDE047"/>
        <circle cx="${62 + spark2}" cy="${-20 + Math.abs(spark1)}" r="2" fill="#F97316"/>
        <circle cx="${46 - spark2 * 0.5}" cy="${-5 + Math.abs(spark1)}" r="2.2" fill="#FEF08A"/>
      </g>`;
    },
    tags: ["soldadura", "antorcha", "tig", "chispas", "fabricacion", "taller"],
  },

  tubo_perforado_fibra_acustica: {
    id: "tubo_perforado_fibra_acustica",
    name: "Tubo Perforado envuelto en Fibra de Vidrio",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<path d="M 0 0 L 80 0" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const waveOffset = (f * 4) % 36;
      return `<g transform="translate(-10, 0)">
        <!-- Manta externa gruesa de lana de roca / fibra de vidrio acolchada -->
        <rect x="-40" y="-38" width="120" height="76" rx="14" fill="#FEF9C3" stroke="${S}" stroke-width="5.5"/>
        <line x1="-30" y1="-22" x2="70" y2="-22" stroke="#FDE047" stroke-width="3" stroke-dasharray="8 6"/>
        <line x1="-30" y1="22" x2="70" y2="22" stroke="#FDE047" stroke-width="3" stroke-dasharray="8 6"/>
        <!-- Tubo central perforado de acero inoxidable -->
        <rect x="-55" y="-16" width="150" height="32" rx="4" fill="#94A3B8" stroke="${S}" stroke-width="5"/>
        <rect x="-45" y="-12" width="130" height="24" rx="2" fill="#CBD5E1"/>
        <!-- Agujeros de coladera por donde escapan las ondas sonoras -->
        {[-30, -10, 10, 30, 50, 70].map(gx => (
          <g key={gx}>
            <circle cx={gx} cy="-6" r="3.5" fill="#0F172A"/>
            <circle cx={gx + 10} cy="6" r="3.5" fill="#0F172A"/>
          </g>
        ))}
        <!-- Ondas agudas que se transforman en calor al entrar en los pelitos -->
        <path d="M -50 0 Q -35 -10 -20 0 T 10 0 T 40 0" fill="none" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Destellos térmicos de fricción disipada en la fibra -->
        <circle cx="15" cy="-28" r="3" fill="#EF4444" opacity="0.8"/>
        <circle cx="45" cy="28" r="3.5" fill="#F97316" opacity="0.8"/>
      </g>`;
    },
    tags: ["fibra_vidrio", "tubo_perforado", "absorcion", "acustica", "calor", "silenciador"],
  },

  regla_marcador_longitud_onda: {
    id: "regla_marcador_longitud_onda",
    name: "Regla y Marcador de Desfase Lambda sobre Dos",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<path d="M 0 0 L 60 40" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const pulse = 1 + Math.sin(f * 0.2) * 0.05;
      return `<g transform="translate(0, 0)">
        <!-- Tablero de diseño técnico milimetrado -->
        <rect x="-50" y="-45" width="105" height="90" rx="8" fill="#1E293B" stroke="${S}" stroke-width="5"/>
        <line x1="-40" y1="-20" x2="45" y2="-20" stroke="#475569" stroke-width="2" stroke-dasharray="6 4"/>
        <line x1="-40" y1="10" x2="45" y2="10" stroke="#475569" stroke-width="2" stroke-dasharray="6 4"/>
        <!-- Esquema de dos rutas: Ruta Corta (azul) vs Ruta Larga (naranja) -->
        <path d="M -40 -10 L 10 -10" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
        <path d="M -40 18 Q -10 38 20 38 Q 45 38 45 10" stroke="#F59E0B" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Rótulo de la física: Δx = λ / 2 -->
        <g transform="translate(2, -28) scale(${pulse.toFixed(2)})">
          <rect x="-24" y="-12" width="48" height="18" rx="4" fill="#0284C7" stroke="${S}" stroke-width="2.5"/>
          <text x="0" y="1" fill="#FFFFFF" font-size="10" font-weight="900" font-family="sans-serif" text-anchor="middle">Δx = λ/2</text>
        </g>
        <!-- Regla metálica graduada sostenida -->
        <g transform="translate(-25, 42) rotate(-15)">
          <rect x="0" y="-8" width="75" height="16" rx="2" fill="#E2E8F0" stroke="${S}" stroke-width="3"/>
          {[10, 20, 30, 40, 50, 60].map(rx => (
            <line key={rx} x1={rx} y1="-8" x2={rx} y2="-2" stroke="#0F172A" stroke-width="2"/>
          ))}
        </g>
      </g>`;
    },
    tags: ["regla", "longitud_onda", "lambda", "deflectores", "diseno", "acustica"],
  },

  holograma_cancelacion_fases: {
    id: "holograma_cancelacion_fases",
    name: "Panel Holográfico de Cancelación Destructiva 1 + (-1) = 0",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<path d="M 0 0 L 80 0" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const waveShift = Math.sin(f * 0.15) * 12;
      return `<g transform="translate(0, 0)">
        <!-- Pantalla holográfica translúcida con bisel oscuro -->
        <rect x="-65" y="-55" width="130" height="105" rx="10" fill="#0F172A" stroke="${S}" stroke-width="5.5"/>
        <rect x="-58" y="-48" width="116" height="60" rx="6" fill="#022C22" stroke="#10B981" stroke-width="2"/>
        <!-- Línea horizontal de cancelación perfecta: ruido cero -->
        <line x1="-50" y1="-18" x2="50" y2="-18" stroke="#22C55E" stroke-width="5.5" stroke-linecap="round"/>
        <circle cx="0" cy="-18" r="4.5" fill="#FEF08A"/>
        <!-- Ecuación maestra iluminada: 1 + (-1) = 0 -->
        <g transform="translate(0, 32)">
          <rect x="-52" y="-14" width="104" height="24" rx="5" fill="#FFE600" stroke="${S}" stroke-width="3"/>
          <text x="0" y="3" fill="#000000" font-size="12" font-weight="900" font-family="sans-serif" text-anchor="middle">1 + (-1) = 0</text>
        </g>
        <!-- Flechitas opuestas de anulación de cresta y valle -->
        <path d="M -30 -38 Q -20 -48 -10 -38" stroke="#38BDF8" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 10 -38 Q 20 -28 30 -38" stroke="#F97316" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>`;
    },
    tags: ["cancelacion", "fase", "interferencia", "destructiva", "onda", "acustica"],
  },


  test_dummy_aplastado: {
    id: "test_dummy_aplastado",
    name: "Muñeco de Prueba Aplastado por Fuerzas G",
    family: "educacion_ciencia",
    defaultPlacement: "overhead",
    svg: `<path d="M 0 0 L 20 20" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const wobble = Math.sin(f * 0.4) * 4;
      const tagPulse = 1 + Math.sin(f * 0.6) * 0.1;
      return `<g transform="translate(0, 0) rotate(${wobble})">
        <!-- Cabeza de maniquí de madera con costuras y ojos en cruz -->
        <circle cx="0" cy="-35" r="22" fill="#E2E8F0" stroke="${S}" stroke-width="4"/>
        <line x1="-12" y1="-40" x2="-4" y2="-32" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
        <line x1="-4" y1="-40" x2="-12" y2="-32" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
        <line x1="4" y1="-40" x2="12" y2="-32" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
        <line x1="12" y1="-40" x2="4" y2="-32" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
        <!-- Boca mareada zigzag -->
        <path d="M -8 -22 Q -4 -26 0 -22 Q 4 -18 8 -22" fill="none" stroke="${S}" stroke-width="3"/>
        <!-- Torso de acordeón completamente comprimido -->
        <path d="M -26 -12 L 26 -12 L -22 -2 L 22 -2 L -20 8 L 20 8 L -18 18 L 18 18 L -16 28 L 16 28 Z" fill="#CBD5E1" stroke="${S}" stroke-width="4"/>
        <!-- Brazos caídos y doblados -->
        <path d="M -26 -10 Q -36 5 -30 25" fill="none" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
        <path d="M 26 -10 Q 36 5 30 25" fill="none" stroke="${S}" stroke-width="5" stroke-linecap="round"/>
        <!-- Etiqueta de advertencia 12G colgando -->
        <g transform="translate(0, 36) scale(${tagPulse})">
          <rect x="-30" y="-10" width="60" height="22" rx="4" fill="#EF4444" stroke="${S}" stroke-width="3"/>
          <text x="0" y="6" text-anchor="middle" font-family="'Arial Black', sans-serif" font-size="11" font-weight="900" fill="#FFFFFF">¡12G!</text>
        </g>
      </g>`;
    },
    tags: ["dummy", "maniqui", "aplastado", "prueba", "fuerza_g", "colapso"],
  },

  carrito_montana_rusa_vintage: {
    id: "carrito_montana_rusa_vintage",
    name: "Carrito de Montaña Rusa Vintage 1895",
    family: "educacion_ciencia",
    defaultPlacement: "both",
    svg: `<rect x="-30" y="-15" width="60" height="30" fill="#B45309" stroke="#000" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const wheelSpin = (f * 24) % 360;
      const sparkJitter = Math.sin(f * 0.8) * 2;
      return `<g transform="translate(0, 0)">
        <!-- Chasis de madera con remaches de latón -->
        <rect x="-42" y="-16" width="84" height="36" rx="6" fill="#B45309" stroke="${S}" stroke-width="4.5"/>
        <rect x="-38" y="-12" width="76" height="12" rx="2" fill="#78350F"/>
        <!-- Barra de seguridad frontal de hierro -->
        <path d="M -30 -16 L -20 -28 L 20 -28 L 30 -16" fill="none" stroke="#64748B" stroke-width="4"/>
        <!-- Ruedas dobles de hierro acanaladas -->
        <g transform="translate(-24, 22) rotate(${wheelSpin})">
          <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
          <circle cx="0" cy="0" r="5" fill="#94A3B8"/>
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#94A3B8" stroke-width="2.5"/>
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#94A3B8" stroke-width="2.5"/>
        </g>
        <g transform="translate(24, 22) rotate(${wheelSpin})">
          <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="${S}" stroke-width="3.5"/>
          <circle cx="0" cy="0" r="5" fill="#94A3B8"/>
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#94A3B8" stroke-width="2.5"/>
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#94A3B8" stroke-width="2.5"/>
        </g>
        <!-- Chispas debajo de las ruedas por velocidad -->
        <polygon points="26,34 32,30 30,38 38,32 32,42" fill="#FACC15" opacity="0.9" transform="translate(${sparkJitter}, 0)"/>
      </g>`;
    },
    tags: ["carrito", "montana_rusa", "vintage", "madera", "riel", "velocidad"],
  },

  planos_blueprint_feria: {
    id: "planos_blueprint_feria",
    name: "Planos Blueprint de Montaña Rusa",
    family: "educacion_ciencia",
    defaultPlacement: "right",
    svg: `<rect x="-25" y="-18" width="50" height="36" fill="#0284C7" stroke="#000" stroke-width="4"/>`,
    animatedSvg: (f: number) => {
      const pulse = 1 + Math.sin(f * 0.15) * 0.03;
      return `<g transform="translate(0, 0) scale(${pulse})">
        <!-- Hoja de plano azul cian desplegada -->
        <rect x="-35" y="-25" width="70" height="50" rx="3" fill="#0284C7" stroke="${S}" stroke-width="4"/>
        <!-- Cuadrícula técnica blanca -->
        <line x1="-35" y1="-10" x2="35" y2="-10" stroke="#FFFFFF" stroke-width="1" opacity="0.4"/>
        <line x1="-35" y1="5" x2="35" y2="5" stroke="#FFFFFF" stroke-width="1" opacity="0.4"/>
        <line x1="-35" y1="20" x2="35" y2="20" stroke="#FFFFFF" stroke-width="1" opacity="0.4"/>
        <line x1="-15" y1="-25" x2="-15" y2="25" stroke="#FFFFFF" stroke-width="1" opacity="0.4"/>
        <line x1="10" y1="-25" x2="10" y2="25" stroke="#FFFFFF" stroke-width="1" opacity="0.4"/>
        <!-- Dibujo técnico del bucle en blanco -->
        <circle cx="5" cy="0" r="14" fill="none" stroke="#FFFFFF" stroke-width="2.5"/>
        <!-- Sello de advertencia en rojo -->
        <rect x="-28" y="-18" width="22" height="12" rx="2" fill="#EF4444" stroke="#FFFFFF" stroke-width="1.5"/>
        <text x="-17" y="-9" text-anchor="middle" font-family="'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FFFFFF">12G</text>
      </g>`;
    },
    tags: ["planos", "blueprint", "ingenieria", "diseno", "feria", "calculo"],
  },

  llave_inglesa_sabotaje: {
    id: "llave_inglesa_sabotaje",
    name: "Llave Inglesa Pesada de Sabotaje",
    family: "vida_cotidiana",
    defaultPlacement: "right",
    svg: `<path d="M 0 0 L 25 25" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const angle = Math.sin(f * 0.2) * 12;
      return `<g transform="translate(0, 0) rotate(${angle})">
        <!-- Mango largo de acero forjado -->
        <rect x="-6" y="-8" width="12" height="55" rx="3" fill="#475569" stroke="${S}" stroke-width="4"/>
        <rect x="-3" y="10" width="6" height="30" fill="#334155"/>
        <!-- Cabeza con mordaza ajustable -->
        <rect x="-14" y="-24" width="28" height="18" rx="4" fill="#64748B" stroke="${S}" stroke-width="4"/>
        <rect x="-8" y="-28" width="16" height="8" rx="2" fill="#94A3B8" stroke="${S}" stroke-width="3"/>
        <!-- Hueco de la mordaza -->
        <rect x="-4" y="-24" width="8" height="12" fill="#0F172A"/>
      </g>`;
    },
    tags: ["llave_inglesa", "herramienta", "sabotaje", "hierro", "tuerca", "mecanica"],
  },

    gafas_sol_llave_kart_victoria: {
    id: "gafas_sol_llave_kart_victoria",
    name: "Gafas de Sol y Llave de Kart Triunfal",
    family: "reacciones_humor",
    defaultPlacement: "both",
    svg: `<path d="M 0 0 L 30 20" stroke="#000" stroke-width="6"/>`,
    animatedSvg: (f: number) => {
      const shine = (f * 3) % 40;
      return `<g transform="translate(0, 0)">
        <!-- Llavero de carreras a cuadros -->
        <rect x="-35" y="10" width="30" height="20" rx="3" fill="#0F172A" stroke="${S}" stroke-width="3"/>
        <rect x="-35" y="10" width="15" height="10" fill="#FFFFFF"/>
        <rect x="-20" y="20" width="15" height="10" fill="#FFFFFF"/>
        <!-- Llave dorada de contacto del kart -->
        <circle cx="-5" cy="20" r="8" fill="#FACC15" stroke="${S}" stroke-width="3.5"/>
        <rect x="0" y="17" width="28" height="6" fill="#F59E0B" stroke="${S}" stroke-width="2.5"/>
        <rect x="18" y="23" width="5" height="5" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
        <rect x="24" y="23" width="4" height="4" fill="#F59E0B" stroke="${S}" stroke-width="2"/>
        <!-- Gafas de sol oscuras de piloto estilo aviador -->
        <g transform="translate(15, -25)">
          <rect x="-24" y="-12" width="22" height="16" rx="5" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
          <rect x="2" y="-12" width="22" height="16" rx="5" fill="#0F172A" stroke="${S}" stroke-width="3.5"/>
          <line x1="-2" y1="-6" x2="2" y2="-6" stroke="${S}" stroke-width="4"/>
          <!-- Reflejo blanco en los cristales -->
          <line x1="-18" y1="-9" x2="-8" y2="-3" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="8" y1="-9" x2="18" y2="-3" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </g>`;
    },
    tags: ["gafas_sol", "llave", "kart", "victoria", "carreras", "triunfo"],
  },

};
