export const TAU = Math.PI * 2;

export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeVector(v) {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

export function vectorFromAngles(theta, phi) {
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  };
}

export function anglesFromVector(v) {
  const n = normalizeVector(v);
  const theta = Math.acos(clamp(n.z, -1, 1));
  const phi = Math.atan2(n.y, n.x);
  return { theta, phi };
}

export function normalizeAngles(theta, phi) {
  let t = clamp(theta, 0, Math.PI);
  let p = phi;
  while (p <= -Math.PI) p += TAU;
  while (p > Math.PI) p -= TAU;
  return { theta: t, phi: p };
}

export function rotateX(v, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: v.x,
    y: v.y * c - v.z * s,
    z: v.y * s + v.z * c,
  };
}

export function rotateY(v, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: v.x * c + v.z * s,
    y: v.y,
    z: -v.x * s + v.z * c,
  };
}

export function rotateZ(v, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: v.x * c - v.y * s,
    y: v.x * s + v.y * c,
    z: v.z,
  };
}

export const PRESETS = [
  { label: '|0>', theta: 0, phi: 0 },
  { label: '|1>', theta: Math.PI, phi: 0 },
  { label: '|+>', theta: Math.PI / 2, phi: 0 },
  { label: '|->', theta: Math.PI / 2, phi: Math.PI },
  { label: '|+i>', theta: Math.PI / 2, phi: Math.PI / 2 },
  { label: '|-i>', theta: Math.PI / 2, phi: -Math.PI / 2 },
];

export const GATES = {
  X: (v) => rotateX(v, Math.PI),
  Y: (v) => rotateY(v, Math.PI),
  Z: (v) => rotateZ(v, Math.PI),
};
