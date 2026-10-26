export type PropFamily =
  | "educacion_ciencia"
  | "tecnologia"
  | "vida_cotidiana"
  | "naturaleza_alimentos"
  | "historia_exploracion"
  | "reacciones_humor";

export type PropPlacement = "right" | "left" | "overhead" | "both";

export interface PropDef {
  id: string;
  name: string;
  family: PropFamily;
  defaultPlacement: PropPlacement;
  svg: string;
  /** Versión animada determinista (partes que laten, giran o vibran) usada por SceneObject según el frame. */
  animatedSvg?: (frame: number) => string;
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

const bionicAnt = (f: number) => {
  const antBob = Math.sin(f / 6) * 3;
  const antWiggle = Math.sin(f / 4) * 4;
  return `<g transform="translate(0, ${n(antBob)}) scale(1.15)">
    <path d="M -10 6 L -28 14 L -38 32" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M -6 6 L -32 0 L -42 16" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M -2 6 L -26 -12 L -34 4" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 6 6 L 24 14 L 34 32" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 10 6 L 30 0 L 40 16" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 12 6 L 26 -12 L 34 4" stroke="${S}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <ellipse cx="-26" cy="-2" rx="18" ry="14" fill="#B91C1C" stroke="${S}" stroke-width="5"/>
    <path d="M -36 -2 A 8 10 0 0 1 -20 -10" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="-28" cy="-5" rx="5" ry="3" fill="#F87171" opacity="0.8"/>
    <ellipse cx="-8" cy="2" rx="4" ry="5" fill="#7F1D1D" stroke="${S}" stroke-width="4"/>
    <ellipse cx="4" cy="0" rx="12" ry="10" fill="#DC2626" stroke="${S}" stroke-width="5"/>
    <path d="M 0 -6 A 8 6 0 0 1 10 -6" stroke="#FCA5A5" stroke-width="3" fill="none"/>
    <circle cx="22" cy="-4" r="11" fill="#B91C1C" stroke="${S}" stroke-width="5"/>
    <ellipse cx="24" cy="-8" rx="5" ry="4" fill="#FFFFFF" stroke="${S}" stroke-width="3"/>
    <circle cx="25" cy="-8" r="2.5" fill="${S}"/>
    <path d="M 31 -2 L 38 1 L 33 6" stroke="${S}" stroke-width="4" fill="#F59E0B" stroke-linejoin="round"/>
    <path d="M 24 -14 Q 28 -24 ${n(32 + antWiggle)} -28" stroke="${S}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="${n(32 + antWiggle)}" cy="-28" r="2.5" fill="#F59E0B"/>
    <path d="M 20 -14 Q 20 -25 ${n(18 - antWiggle)} -30" stroke="${S}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <circle cx="${n(18 - antWiggle)}" cy="-30" r="2.5" fill="#F59E0B"/>
  </g>`;
};

const cubePhysics = (f: number) => {
  const rot = Math.sin(f / 10) * 3;
  return `<g transform="rotate(${n(rot)}) scale(1.15)">
    <polygon points="0,-36 34,-18 0,0 -34,-18" fill="#38BDF8" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <line x1="-17" y1="-9" x2="17" y2="-27" stroke="#BAE6FD" stroke-width="2.5"/>
    <line x1="17" y1="-9" x2="-17" y2="-27" stroke="#BAE6FD" stroke-width="2.5"/>
    <polygon points="-34,-18 0,0 0,38 -34,20" fill="#0284C7" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="0,0 34,-18 34,20 0,38" fill="#0369A1" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="-26" y="-38" width="52" height="16" rx="4" fill="#FFE600" stroke="${S}" stroke-width="3"/>
    <text x="0" y="-26" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="${S}" text-anchor="middle">ÁREA = L²</text>
    <rect x="-30" y="10" width="60" height="16" rx="4" fill="#F43F5E" stroke="${S}" stroke-width="3"/>
    <text x="0" y="22" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#FFFFFF" text-anchor="middle">MASA = L³</text>
  </g>`;
};

const terminalVelocityShield = (f: number) => {
  const windY = (f * 5) % 30;
  const airDrag = 1 + Math.sin(f / 5) * 0.04;
  return `<g transform="scale(${n(airDrag)})">
    <path d="M -44 12 C -44 -36 44 -36 44 12 C 20 6 0 9 -44 12 Z" fill="#FACC15" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M -32 2 C -32 -24 32 -24 32 2" stroke="#FFFFFF" stroke-width="4" fill="none"/>
    <path d="M -24 24 L -24 ${n(10 - (windY % 16))}" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M 0 32 L 0 ${n(12 - (windY % 20))}" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
    <path d="M 24 24 L 24 ${n(10 - (windY % 16))}" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round"/>
    <rect x="-40" y="24" width="80" height="24" rx="6" fill="#0F172A" stroke="${S}" stroke-width="4"/>
    <text x="0" y="41" font-family="system-ui, sans-serif" font-weight="900" font-size="12" fill="#38BDF8" text-anchor="middle">6.4 KM/H</text>
  </g>`;
};

const honeyPot = (f: number) => {
  const drip = (f * 1.5) % 35;
  return `<g transform="scale(1.15)">
    <path d="M -24 -24 L 24 -24 L 32 18 C 32 30 18 36 0 36 C -18 36 -32 30 -32 18 Z" fill="#D97706" stroke="${S}" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="0" cy="-24" rx="24" ry="8" fill="#F59E0B" stroke="${S}" stroke-width="4"/>
    <path d="M -22 -22 Q -12 -12 0 -18 Q 12 -12 22 -22 Q 18 4 0 4 Q -18 4 -22 -22 Z" fill="#FBBF24" stroke="${S}" stroke-width="3"/>
    <ellipse cx="-4" cy="-8" rx="10" ry="4" fill="#FEF08A"/>
    <circle cx="6" cy="${n(-4 + drip)}" r="3" fill="#F59E0B" stroke="${S}" stroke-width="1.5"/>
    <rect x="-16" y="10" width="32" height="16" rx="4" fill="#B45309" stroke="${S}" stroke-width="2"/>
    <text x="0" y="22" font-family="system-ui, sans-serif" font-weight="900" font-size="9" fill="#FEF08A" text-anchor="middle">MIEL</text>
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
};
