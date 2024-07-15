export function lerp(a: number, b: number, t: number) {
  return a + t * (b - a)
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(max, Math.max(min, num));
}