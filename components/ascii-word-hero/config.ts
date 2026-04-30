export type AsciiWordHeroConfig = {
  background: string;
  glyphColor: string;
  glowColor: string;
  glitterColor: string;
  characterSet: string;
  density: number;
  hoverRadius: number;
  hoverRepulsion: number;
  hoverActiveRadiusMultiplier: number;
  hoverActiveRepulsionMultiplier: number;
  hoverDistortion: number;
  glyphSwapInterval: [number, number];
  glowStrength: number;
  textScale: number;
  shimmerStrength: number;
  settleEase: number;
  maxCells: number;
  maskPadding: number;
  letterSpacing: number;
  maskThreshold: number;
  maxParticles: number;
  entryDuration: number;
  entryStagger: number;
  sweepStrength: number;
  scrollBreakupStrength: number;
  scrollBreakStart: number;
  scrollBreakEnd: number;
  scrollClearThreshold: number;
  glitterDensity: number;
  glitterOpacity: number;
  glitterSize: number;
  ambientTwinkleStrength: number;
  devicePixelRatioCap: number;
  trailStride: number;
};

export const DEFAULT_ASCII_WORD_HERO_CONFIG: AsciiWordHeroConfig = {
  background: "#010101",
  glyphColor: "rgba(247, 247, 247, 0.96)",
  glowColor: "rgba(255, 255, 255, 0.34)",
  glitterColor: "rgba(255, 255, 255, 0.98)",
  characterSet:
    "STHYRA#@%*+=:/<>[]{}()|\\-_^~ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  density: 1.34,
  hoverRadius: 98,
  hoverRepulsion: 8.4,
  hoverActiveRadiusMultiplier: 2.9,
  hoverActiveRepulsionMultiplier: 3.55,
  hoverDistortion: 18,
  glyphSwapInterval: [0.32, 0.78],
  glowStrength: 0.34,
  textScale: 0.84,
  shimmerStrength: 0.018,
  settleEase: 3.4,
  maxCells: 56000,
  maskPadding: 0.02,
  letterSpacing: 0.18,
  maskThreshold: 24,
  maxParticles: 9200,
  entryDuration: 1.8,
  entryStagger: 0.82,
  sweepStrength: 340,
  scrollBreakupStrength: 1.95,
  scrollBreakStart: 0.015,
  scrollBreakEnd: 0.94,
  scrollClearThreshold: 0.985,
  glitterDensity: 0.16,
  glitterOpacity: 0.88,
  glitterSize: 2.2,
  ambientTwinkleStrength: 0.22,
  devicePixelRatioCap: 1.5,
  trailStride: 3,
};
