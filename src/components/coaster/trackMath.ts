export interface TrackPoint {
  x: number;
  y: number;
  angleDeg: number;
  curvature: number;
}

export interface CubicSegment {
  p0: [number, number];
  p1: [number, number];
  p2: [number, number];
  p3: [number, number];
}

function evalCubic(seg: CubicSegment, t: number): [number, number] {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const a = mt2 * mt;
  const b = 3 * mt2 * t;
  const c = 3 * mt * t2;
  const d = t2 * t;
  return [
    a * seg.p0[0] + b * seg.p1[0] + c * seg.p2[0] + d * seg.p3[0],
    a * seg.p0[1] + b * seg.p1[1] + c * seg.p2[1] + d * seg.p3[1],
  ];
}

/**
 * Samples a sequence of cubic Bezier segments into arc-length uniform TrackPoints.
 */
export function buildSampledTrack(
  segments: CubicSegment[],
  samplesPerSeg = 60
): TrackPoint[] {
  const raw: Array<[number, number]> = [];
  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    const startIdx = s === 0 ? 0 : 1;
    for (let i = startIdx; i <= samplesPerSeg; i++) {
      raw.push(evalCubic(seg, i / samplesPerSeg));
    }
  }

  // Compute cumulative arc length
  const cumLen: number[] = [0];
  for (let i = 1; i < raw.length; i++) {
    const dx = raw[i][0] - raw[i - 1][0];
    const dy = raw[i][1] - raw[i - 1][1];
    cumLen.push(cumLen[i - 1] + Math.hypot(dx, dy));
  }
  const totalLen = cumLen[cumLen.length - 1] || 1;

  // Resample uniformly by arc length (240 points)
  const outCount = 240;
  const uniform: Array<[number, number]> = [];
  let cursor = 0;
  for (let k = 0; k < outCount; k++) {
    const target = (k / (outCount - 1)) * totalLen;
    while (cursor < cumLen.length - 2 && cumLen[cursor + 1] < target) {
      cursor++;
    }
    const span = Math.max(1e-5, cumLen[cursor + 1] - cumLen[cursor]);
    const frac = Math.max(0, Math.min(1, (target - cumLen[cursor]) / span));
    uniform.push([
      raw[cursor][0] + (raw[cursor + 1][0] - raw[cursor][0]) * frac,
      raw[cursor][1] + (raw[cursor + 1][1] - raw[cursor][1]) * frac,
    ]);
  }

  // Compute tangent angles and discrete curvature
  return uniform.map((pt, idx) => {
    const prev = uniform[Math.max(0, idx - 2)];
    const next = uniform[Math.min(uniform.length - 1, idx + 2)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

    const pA = uniform[Math.max(0, idx - 3)];
    const pB = pt;
    const pC = uniform[Math.min(uniform.length - 1, idx + 3)];
    const ang1 = Math.atan2(pB[1] - pA[1], pB[0] - pA[0]);
    const ang2 = Math.atan2(pC[1] - pB[1], pC[0] - pB[0]);
    let dAng = ang2 - ang1;
    while (dAng > Math.PI) dAng -= 2 * Math.PI;
    while (dAng < -Math.PI) dAng += 2 * Math.PI;
    const ds = Math.max(1, Math.hypot(pC[0] - pA[0], pC[1] - pA[1]));
    const curvature = Math.abs(dAng) / ds;

    return {
      x: pt[0],
      y: pt[1],
      angleDeg,
      curvature,
    };
  });
}

export function sampleTrackAt(track: TrackPoint[], progress: number): TrackPoint {
  const clamped = Math.max(0, Math.min(1, progress));
  const fIdx = clamped * (track.length - 1);
  const i0 = Math.floor(fIdx);
  const i1 = Math.min(track.length - 1, i0 + 1);
  const alpha = fIdx - i0;
  const a = track[i0];
  const b = track[i1];

  // Shortest angular interpolation
  let dAng = b.angleDeg - a.angleDeg;
  while (dAng > 180) dAng -= 360;
  while (dAng < -180) dAng += 360;

  return {
    x: a.x + (b.x - a.x) * alpha,
    y: a.y + (b.y - a.y) * alpha,
    angleDeg: a.angleDeg + dAng * alpha,
    curvature: a.curvature + (b.curvature - a.curvature) * alpha,
  };
}

export function segmentsToSvgPath(segments: CubicSegment[]): string {
  if (segments.length === 0) return "";
  const parts = [`M ${segments[0].p0[0].toFixed(1)} ${segments[0].p0[1].toFixed(1)}`];
  for (const s of segments) {
    parts.push(
      `C ${s.p1[0].toFixed(1)} ${s.p1[1].toFixed(1)}, ${s.p2[0].toFixed(1)} ${s.p2[1].toFixed(1)}, ${s.p3[0].toFixed(1)} ${s.p3[1].toFixed(1)}`
    );
  }
  return parts.join(" ");
}

/**
 * Generates an entry ramp + loop + exit ramp with parametric control over:
 * - bottomFlare (0 = circular base, 1 = wide hammered base)
 * - sideSqueeze (0 = round sides, 1 = squeezed tall skinny teardrop)
 */
export function buildMorphableLoopSegments(
  cx: number,
  groundY: number,
  radius: number,
  bottomFlare = 0,
  sideSqueeze = 0,
  includeApproachRamp = true
): CubicSegment[] {
  const k = 0.55228;
  const topY = groundY - radius * (2.0 + sideSqueeze * 0.58);
  const midY = groundY - radius * (1.0 + sideSqueeze * 0.34);
  const loopHalfW = radius * (1.0 - sideSqueeze * 0.34 + bottomFlare * 0.12);
  const bottomH = groundY - midY;
  const topH = midY - topY;
  const bottomHandleX = loopHalfW * k * (1 + bottomFlare * 0.55);
  const bottomSideHandleY = bottomH * k * (1 - bottomFlare * 0.25);
  const topHandleX = loopHalfW * k * (1 - sideSqueeze * 0.42);
  const topSideHandleY = topH * k * (1 + sideSqueeze * 0.12);

  const segments: CubicSegment[] = [];

  if (includeApproachRamp) {
    segments.push({
      p0: [cx - radius * 2.4, groundY - radius * 1.45],
      p1: [cx - radius * 1.85, groundY - radius * 0.2],
      p2: [cx - radius * 1.15, groundY],
      p3: [cx, groundY],
    });
  }

  // Bottom -> Right
  segments.push({
    p0: [cx, groundY],
    p1: [cx + bottomHandleX, groundY],
    p2: [cx + loopHalfW, midY + bottomSideHandleY],
    p3: [cx + loopHalfW, midY],
  });

  // Right -> Apex
  segments.push({
    p0: [cx + loopHalfW, midY],
    p1: [cx + loopHalfW, midY - topSideHandleY],
    p2: [cx + topHandleX, topY],
    p3: [cx, topY],
  });

  // Apex -> Left
  segments.push({
    p0: [cx, topY],
    p1: [cx - topHandleX, topY],
    p2: [cx - loopHalfW, midY - topSideHandleY],
    p3: [cx - loopHalfW, midY],
  });

  // Left -> Bottom
  segments.push({
    p0: [cx - loopHalfW, midY],
    p1: [cx - loopHalfW, midY + bottomSideHandleY],
    p2: [cx - bottomHandleX, groundY],
    p3: [cx, groundY],
  });

  if (includeApproachRamp) {
    segments.push({
      p0: [cx, groundY],
      p1: [cx + radius * 1.2, groundY],
      p2: [cx + radius * 1.9, groundY - 8],
      p3: [cx + radius * 2.5, groundY - 22],
    });
  }

  return segments;
}
