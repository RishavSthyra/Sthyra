"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  DEFAULT_ASCII_WORD_HERO_CONFIG,
  type AsciiWordHeroConfig,
} from "@/components/ascii-word-hero/config";
import {
  createAsciiGridFieldFromMaskImage,
  createAsciiGridField,
  type AsciiGridField,
} from "@/components/ascii-word-hero/particle-mask";
import { createModelMask } from "@/components/ascii-word-hero/model-mask";

type AsciiWordHeroProps = {
  word?: string;
  className?: string;
  config?: Partial<AsciiWordHeroConfig>;
  nextSection?: ReactNode;
  modelUrl?: string;
  onReady?: () => void;
};

type Size = {
  width: number;
  height: number;
};

type PointerState = {
  x: number;
  y: number;
  active: boolean;
};

type RuntimeFieldState = {
  glyphIndices: Uint16Array;
  glyphCountdowns: Float32Array;
  hoverX: Float32Array;
  hoverY: Float32Array;
  entryDelay: Float32Array;
  entryDuration: Float32Array;
  entryStartX: Float32Array;
  entryStartY: Float32Array;
  entryControlAX: Float32Array;
  entryControlAY: Float32Array;
  entryControlBX: Float32Array;
  entryControlBY: Float32Array;
  entryWaveX: Float32Array;
  entryWaveY: Float32Array;
  entryWaveFreq: Float32Array;
  breakDelay: Float32Array;
  breakExitX: Float32Array;
  breakExitY: Float32Array;
  breakControlAX: Float32Array;
  breakControlAY: Float32Array;
  breakControlBX: Float32Array;
  breakControlBY: Float32Array;
};

type SceneMetrics = {
  start: number;
  travel: number;
  lastBreak: number;
  lastReveal: number;
  lastOverlay: number;
};

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const HERO_UI_FONT_STACK =
  `"Avenir Next Condensed", "Bahnschrift SemiCondensed", "Arial Narrow", "Segoe UI", sans-serif`;

const HERO_MASK_FONT_STACK =
  `"Surgena", "Orbitron", "Bank Gothic", "Eurostile", sans-serif`;

const HERO_ASCII_FONT_STACK =
  `"IBM Plex Mono", "SFMono-Regular", Consolas, "Lucida Console", monospace`;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function damp(current: number, target: number, smoothing: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-smoothing * delta));
}

function cubicBezier(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number,
) {
  const inverse = 1 - t;

  return (
    inverse * inverse * inverse * p0 +
    3 * inverse * inverse * t * p1 +
    3 * inverse * t * t * p2 +
    t * t * t * p3
  );
}

function easeInOutCubic(value: number) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutPower(value: number, power: number) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return 1 - Math.pow(1 - value, power);
}

function easeSoftScatter(value: number) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return Math.pow(value, 1.28);
}

function mergeConfig(config?: Partial<AsciiWordHeroConfig>) {
  if (!config) {
    return DEFAULT_ASCII_WORD_HERO_CONFIG;
  }

  return {
    ...DEFAULT_ASCII_WORD_HERO_CONFIG,
    ...config,
    glyphSwapInterval:
      config.glyphSwapInterval ??
      DEFAULT_ASCII_WORD_HERO_CONFIG.glyphSwapInterval,
  } satisfies AsciiWordHeroConfig;
}

function nextGlyphIndex(
  index: number,
  time: number,
  seed: number,
  characterCount: number,
) {
  return Math.floor(
    (seed * 131 + time * (13 + seed * 9) + index * 1.9) % characterCount,
  );
}

function createRuntimeFieldState(
  field: AsciiGridField,
  size: Size,
  config: AsciiWordHeroConfig,
): RuntimeFieldState {
  const entryDelay = new Float32Array(field.count);
  const entryDuration = new Float32Array(field.count);
  const entryStartX = new Float32Array(field.count);
  const entryStartY = new Float32Array(field.count);
  const entryControlAX = new Float32Array(field.count);
  const entryControlAY = new Float32Array(field.count);
  const entryControlBX = new Float32Array(field.count);
  const entryControlBY = new Float32Array(field.count);
  const entryWaveX = new Float32Array(field.count);
  const entryWaveY = new Float32Array(field.count);
  const entryWaveFreq = new Float32Array(field.count);
  const breakDelay = new Float32Array(field.count);
  const breakExitX = new Float32Array(field.count);
  const breakExitY = new Float32Array(field.count);
  const breakControlAX = new Float32Array(field.count);
  const breakControlAY = new Float32Array(field.count);
  const breakControlBX = new Float32Array(field.count);
  const breakControlBY = new Float32Array(field.count);
  const width = Math.max(field.wordWidth, 1);
  const height = Math.max(field.wordHeight, 1);

  for (let index = 0; index < field.count; index += 1) {
    const seed = field.seeds[index];
    const normX = (field.originsX[index] - field.wordLeft) / width;
    const normY = (field.originsY[index] - field.wordTop) / height;
    const order = clamp(
      1 - normX * 0.78 + normY * 0.22 + (seed - 0.5) * 0.18,
      0,
      1,
    );
    const ribbonAngle =
      -0.14 + order * Math.PI * 1.08 + (normY - 0.5) * 0.22 + (seed - 0.5) * 0.32;
    const startRadiusX =
      width * 0.84 + config.sweepStrength * (0.72 + seed * 0.52) + size.width * 0.22;
    const startRadiusY =
      height * 1.42 + config.sweepStrength * (0.38 + seed * 0.24) + size.height * 0.08;
    const radialX = (field.originsX[index] - field.centerX) / Math.max(width * 0.5, 1);
    const radialY = (field.originsY[index] - field.centerY) / Math.max(height * 0.5, 1);
    const radialLength = Math.hypot(radialX, radialY) || 1;
    const radialUnitX = radialX / radialLength;
    const radialUnitY = radialY / radialLength;
    const normalX = -radialUnitY;
    const normalY = radialUnitX;
    const releaseDistance =
      (320 + seed * 360 + Math.abs(normX - 0.5) * 220) *
      config.scrollBreakupStrength;
    const sideBias = (order - 0.5) * 1.18;
    const exitVectorX =
      (radialUnitX * 1.08 + sideBias * 0.8 + (seed - 0.5) * 0.36) * releaseDistance;
    const exitVectorY =
      (radialUnitY * 1.08 - 0.24 + (seed - 0.5) * 0.2) * releaseDistance;

    entryStartX[index] =
      field.centerX +
      Math.cos(ribbonAngle) * startRadiusX +
      size.width * 0.3 +
      (normY - 0.5) * 80;
    entryStartY[index] =
      field.centerY -
      height * 0.26 +
      Math.sin(ribbonAngle) * startRadiusY +
      (normX - 0.5) * 26;
    entryControlAX[index] =
      field.centerX +
      width * 0.9 -
      order * width * 0.22 +
      (seed - 0.5) * 90;
    entryControlAY[index] =
      field.centerY -
      height * 1.5 -
      config.sweepStrength * 0.18 +
      normY * height * 0.14;
    entryControlBX[index] =
      field.centerX -
      width * 0.54 +
      normX * width * 0.8 +
      (seed - 0.5) * 48;
    entryControlBY[index] =
      field.centerY +
      height * 0.72 -
      normY * height * 0.56 +
      Math.sin(order * Math.PI * 1.4 + seed * 6) * config.sweepStrength * 0.05;
    entryDelay[index] = order * config.entryStagger + seed * 0.08;
    entryDuration[index] = config.entryDuration * (0.76 + seed * 0.34);
    entryWaveX[index] = 10 + seed * 16 + Math.abs(normY - 0.5) * 12;
    entryWaveY[index] = 6 + seed * 12 + Math.abs(normX - 0.5) * 8;
    entryWaveFreq[index] = 0.72 + seed * 0.92;
    breakDelay[index] = clamp(order * 0.2 + Math.abs(normY - 0.5) * 0.08, 0, 0.32);
    breakControlAX[index] =
      field.originsX[index] + normalX * 48 + exitVectorX * 0.22 + (seed - 0.5) * 28;
    breakControlAY[index] =
      field.originsY[index] + normalY * 48 + exitVectorY * 0.22 - 28;
    breakControlBX[index] = field.originsX[index] + exitVectorX * 0.68 + normalX * 54;
    breakControlBY[index] =
      field.originsY[index] + exitVectorY * 0.68 + normalY * 54 - height * 0.18;
    breakExitX[index] = field.originsX[index] + exitVectorX;
    breakExitY[index] = field.originsY[index] + exitVectorY;
  }

  return {
    glyphIndices: new Uint16Array(field.glyphIndices),
    glyphCountdowns: new Float32Array(field.glyphIntervals),
    hoverX: new Float32Array(field.count),
    hoverY: new Float32Array(field.count),
    entryDelay,
    entryDuration,
    entryStartX,
    entryStartY,
    entryControlAX,
    entryControlAY,
    entryControlBX,
    entryControlBY,
    entryWaveX,
    entryWaveY,
    entryWaveFreq,
    breakDelay,
    breakExitX,
    breakExitY,
    breakControlAX,
    breakControlAY,
    breakControlBX,
    breakControlBY,
  };
}

function renderDefaultNextSection() {
  return (
    <div
      className="mx-auto grid w-full max-w-[1120px] grid-cols-1 gap-6 border border-white/10 bg-[linear-gradient(180deg,rgba(10,10,10,0.88)_0%,rgba(2,2,2,0.97)_100%),radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.08),transparent_28%)] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_40px_120px_rgba(0,0,0,0.58)] backdrop-blur-[18px] motion-reduce:transform-none motion-reduce:transition-none md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] md:gap-10 md:p-12"
      style={{
        opacity: "calc(0.22 + var(--hero-reveal) * 0.78)",
        transform: "translateY(calc(72px * (1 - var(--hero-reveal))))",
        fontFamily: HERO_UI_FONT_STACK,
      }}
    >
      <div className="grid content-start gap-4">
        <p className="m-0 text-[0.78rem] uppercase tracking-[0.28em] text-white/58">
          Precision in motion
        </p>
        <h2 className="m-0 max-w-[14ch] text-[clamp(1.65rem,9vw,2.9rem)] font-semibold leading-[0.9] tracking-[0.04em] text-white uppercase md:max-w-[12ch] md:text-[clamp(1.9rem,4.25vw,4rem)]">
          A quiet mark, assembled from controlled energy.
        </h2>
        <p className="m-0 max-w-[58ch] text-[clamp(0.84rem,1.05vw,0.96rem)] leading-[1.7] text-white/68">
          The hero resolves into a legible monogram, then releases that same energy
          on scroll so the page opens without a hard cut. The motion stays flat,
          typographic, and deliberate from first frame to reveal.
        </p>
      </div>
      <div className="grid content-start gap-4">
        <article className="grid gap-2 border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-[1.15rem] py-[1.1rem]">
          <span className="text-[0.74rem] uppercase tracking-[0.22em] text-white/50">
            Entry
          </span>
          <p className="m-0 text-[clamp(0.86rem,1.28vw,1.05rem)] leading-[1.35] uppercase tracking-[0.08em] text-white">
            Swept ribbon
          </p>
        </article>
        <article className="grid gap-2 border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-[1.15rem] py-[1.1rem]">
          <span className="text-[0.74rem] uppercase tracking-[0.22em] text-white/50">
            Formation
          </span>
          <p className="m-0 text-[clamp(0.86rem,1.28vw,1.05rem)] leading-[1.35] uppercase tracking-[0.08em] text-white">
            Grid-sampled type mask
          </p>
        </article>
        <article className="grid gap-2 border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-[1.15rem] py-[1.1rem]">
          <span className="text-[0.74rem] uppercase tracking-[0.22em] text-white/50">
            Reveal
          </span>
          <p className="m-0 text-[clamp(0.86rem,1.28vw,1.05rem)] leading-[1.35] uppercase tracking-[0.08em] text-white">
            Scroll-driven breakup
          </p>
        </article>
      </div>
    </div>
  );
}

export default function AsciiWordHero({
  word = "STHYRA",
  className,
  config,
  nextSection,
  modelUrl = "/models/sTHYRALOGO2.glb",
  onReady,
}: AsciiWordHeroProps) {
  const mergedConfig = useMemo(() => mergeConfig(config), [config]);
  const characters = useMemo(
    () => [...new Set(mergedConfig.characterSet.split(""))],
    [mergedConfig.characterSet],
  );
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyReportedRef = useRef(false);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });
  const scrollProgressRef = useRef(0);
  const sceneMetricsRef = useRef<SceneMetrics>({
    start: 0,
    travel: 1,
    lastBreak: -1,
    lastReveal: -1,
    lastOverlay: -1,
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [maskFontReady, setMaskFontReady] = useState(false);
  const [modelMask, setModelMask] = useState<Awaited<
    ReturnType<typeof createModelMask>
  > | null>(null);
  const isMobileHero = size.width > 0 && size.width < 768;
  const isTabletHero = size.width >= 768 && size.width < 1100;
  const responsiveConfig = useMemo(() => {
    if (isMobileHero) {
      return {
        ...mergedConfig,
        density: Math.max(mergedConfig.density, 1.52),
        textScale: Math.max(mergedConfig.textScale, 1.03),
        maxCells: Math.min(mergedConfig.maxCells, 24000),
        maxParticles: Math.min(mergedConfig.maxParticles, 3000),
        maskPadding: Math.min(mergedConfig.maskPadding, 0.006),
        glitterSize: Math.min(mergedConfig.glitterSize, 1.7),
        glitterDensity: Math.min(mergedConfig.glitterDensity, 0.12),
        hoverRadius: mergedConfig.hoverRadius * 0.8,
        hoverRepulsion: mergedConfig.hoverRepulsion * 0.82,
        sweepStrength: mergedConfig.sweepStrength * 0.8,
        ambientTwinkleStrength: mergedConfig.ambientTwinkleStrength * 0.82,
        devicePixelRatioCap: Math.min(mergedConfig.devicePixelRatioCap, 1.1),
      } satisfies AsciiWordHeroConfig;
    }

    if (isTabletHero) {
      return {
        ...mergedConfig,
        density: Math.max(mergedConfig.density, 1.42),
        textScale: Math.max(mergedConfig.textScale, 0.97),
        maxCells: Math.min(mergedConfig.maxCells, 32000),
        maxParticles: Math.min(mergedConfig.maxParticles, 4400),
        maskPadding: Math.min(mergedConfig.maskPadding, 0.012),
        glitterSize: Math.min(mergedConfig.glitterSize, 1.9),
        glitterDensity: Math.min(mergedConfig.glitterDensity, 0.14),
        hoverRadius: mergedConfig.hoverRadius * 0.88,
        hoverRepulsion: mergedConfig.hoverRepulsion * 0.9,
        sweepStrength: mergedConfig.sweepStrength * 0.88,
        ambientTwinkleStrength: mergedConfig.ambientTwinkleStrength * 0.9,
        devicePixelRatioCap: Math.min(mergedConfig.devicePixelRatioCap, 1.2),
      } satisfies AsciiWordHeroConfig;
    }

    return mergedConfig;
  }, [isMobileHero, isTabletHero, mergedConfig]);

  useEffect(() => {
    if (typeof document === "undefined" || !("fonts" in document)) {
      return;
    }

    let cancelled = false;

    document.fonts.load('600 32px "Surgena"').then(() => {
      if (!cancelled) {
        setMaskFontReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  useEffect(() => {
    const element = stickyRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const nextWidth = Math.round(entry.contentRect.width);
      const nextHeight = Math.round(entry.contentRect.height);

      setSize((current) => {
        if (
          Math.abs(current.width - nextWidth) < 2 &&
          Math.abs(current.height - nextHeight) < 2
        ) {
          return current;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (size.width === 0 || size.height === 0) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;
    let idleId: number | null = null;
    const idleWindow = window as IdleWindow;

    const buildMask = () => {
      createModelMask({
        url: modelUrl,
        width: size.width,
        height: size.height,
        padding: 0.18,
      })
        .then((mask) => {
          if (!cancelled) {
            setModelMask(mask);
          }
        })
        .catch((error) => {
          console.error("Failed to build GLB mask for ASCII hero:", error);

          if (!cancelled) {
            setModelMask(null);
          }
        });
    };

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(buildMask, { timeout: 900 });
    } else {
      timeoutId = window.setTimeout(buildMask, 220);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [modelUrl, size.height, size.width]);

  const field = useMemo(
    () => {
      if (modelMask) {
        return createAsciiGridFieldFromMaskImage({
          width: size.width,
          height: size.height,
          characters,
          config: responsiveConfig,
          mask: modelMask,
        });
      }

      return createAsciiGridField({
        text: word,
        width: size.width,
        height: size.height,
        characters,
        config: responsiveConfig,
        maskFontFamily: maskFontReady ? HERO_MASK_FONT_STACK : undefined,
        maskFontWeight: 600,
      });
    },
    [characters, maskFontReady, modelMask, responsiveConfig, size.height, size.width, word],
  );

  const updatePointerPosition = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = stickyRef.current?.getBoundingClientRect();

    if (!bounds) {
      return;
    }

    pointerRef.current.x = event.clientX - bounds.left;
    pointerRef.current.y = event.clientY - bounds.top;
    pointerRef.current.active = true;
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  useEffect(() => {
    const scene = sectionRef.current;

    if (!scene) {
      return;
    }

    let scheduledFrame = 0;

    const updateProgress = () => {
      const sceneMetrics = sceneMetricsRef.current;
      const sceneProgress = clamp(
        (window.scrollY - sceneMetrics.start) / Math.max(sceneMetrics.travel, 1),
        0,
        1,
      );
      const rawBreakProgress = reducedMotion
        ? sceneProgress
        : clamp(
            (sceneProgress - responsiveConfig.scrollBreakStart) /
              Math.max(
                responsiveConfig.scrollBreakEnd - responsiveConfig.scrollBreakStart,
                0.001,
              ),
            0,
            1,
          );
      const breakProgress = easeSoftScatter(rawBreakProgress);
      const revealProgress = clamp(Math.pow(breakProgress, 0.88), 0, 1);
      const overlayOpacity = clamp(1 - revealProgress * 0.9, 0.08, 1);

      scrollProgressRef.current = sceneProgress;

      if (Math.abs(sceneMetrics.lastBreak - breakProgress) > 0.002) {
        scene.style.setProperty("--hero-break", breakProgress.toFixed(4));
        sceneMetrics.lastBreak = breakProgress;
      }

      if (Math.abs(sceneMetrics.lastReveal - revealProgress) > 0.002) {
        scene.style.setProperty("--hero-reveal", revealProgress.toFixed(4));
        sceneMetrics.lastReveal = revealProgress;
      }

      if (Math.abs(sceneMetrics.lastOverlay - overlayOpacity) > 0.01) {
        scene.style.setProperty("--hero-overlay", overlayOpacity.toFixed(4));
        sceneMetrics.lastOverlay = overlayOpacity;
      }
    };

    const refreshMetrics = () => {
      const rect = scene.getBoundingClientRect();
      sceneMetricsRef.current.start = window.scrollY + rect.top;
      sceneMetricsRef.current.travel = Math.max(rect.height - window.innerHeight, 1);
      updateProgress();
    };

    const scheduleUpdate = () => {
      if (scheduledFrame !== 0) {
        return;
      }

      scheduledFrame = window.requestAnimationFrame(() => {
        scheduledFrame = 0;
        updateProgress();
      });
    };

    refreshMetrics();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", refreshMetrics);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", refreshMetrics);

      if (scheduledFrame !== 0) {
        window.cancelAnimationFrame(scheduledFrame);
      }
    };
  }, [reducedMotion, responsiveConfig.scrollBreakEnd, responsiveConfig.scrollBreakStart]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || size.width === 0 || size.height === 0 || field.count === 0) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      responsiveConfig.devicePixelRatioCap,
    );
    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;

    const runtime = createRuntimeFieldState(field, size, responsiveConfig);
    const baseHoverRadius = reducedMotion
      ? responsiveConfig.hoverRadius * 0.72
      : responsiveConfig.hoverRadius;
    const baseHoverRepulsion = reducedMotion
      ? responsiveConfig.hoverRepulsion * 0.68
      : responsiveConfig.hoverRepulsion;
    const logoWidth = Math.max(field.wordWidth, 1);
    const animationStart = performance.now();
    const font = `700 ${field.fontSize}px ${HERO_ASCII_FONT_STACK}`;
    const glitterSeedThreshold = 1 - clamp(responsiveConfig.glitterDensity, 0.01, 0.35);
    let animationFrame = 0;
    let previousTime = animationStart;
    let previousDrawTime = animationStart;
    let previousPointerActive = false;
    let previousBreakProgress = -1;

    const draw = (timestamp: number) => {
      const delta = Math.min((timestamp - previousTime) / 1000, 0.05);
      const elapsed = reducedMotion
        ? responsiveConfig.entryDuration + responsiveConfig.entryStagger + 0.25
        : (timestamp - animationStart) / 1000;
      const time = timestamp / 1000;
      const sceneProgress = scrollProgressRef.current;
      const rawBreakProgress = reducedMotion
        ? sceneProgress
        : clamp(
            (sceneProgress - responsiveConfig.scrollBreakStart) /
              Math.max(
                responsiveConfig.scrollBreakEnd - responsiveConfig.scrollBreakStart,
                0.001,
              ),
            0,
            1,
          );
      const breakProgress = easeSoftScatter(rawBreakProgress);
      const pointerActive = pointerRef.current.active;
      const entrySettled =
        elapsed > responsiveConfig.entryDuration + responsiveConfig.entryStagger + 0.38;
      const scrollIsMoving = Math.abs(breakProgress - previousBreakProgress) > 0.0015;
      const pointerStateChanged = pointerActive !== previousPointerActive;
      const canThrottle =
        !reducedMotion &&
        entrySettled &&
        !pointerActive &&
        !pointerStateChanged &&
        !scrollIsMoving &&
        breakProgress < 0.001;

      previousTime = timestamp;

      if (document.visibilityState === "hidden") {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      if (canThrottle && timestamp - previousDrawTime < 66) {
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      previousDrawTime = timestamp;
      previousPointerActive = pointerActive;
      previousBreakProgress = breakProgress;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size.width, size.height);
      context.font = font;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = responsiveConfig.glyphColor;
      context.shadowBlur = 0;

      if (breakProgress >= responsiveConfig.scrollClearThreshold) {
        if (!readyReportedRef.current) {
          readyReportedRef.current = true;
          onReady?.();
        }

        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      for (let index = 0; index < field.count; index += 1) {
        let hoverTargetX = 0;
        let hoverTargetY = 0;
        const hoverRadius = pointerActive
          ? baseHoverRadius * responsiveConfig.hoverActiveRadiusMultiplier
          : baseHoverRadius;
        const hoverRepulsion = pointerActive
          ? baseHoverRepulsion * responsiveConfig.hoverActiveRepulsionMultiplier
          : baseHoverRepulsion;
        const radiusSquared = hoverRadius * hoverRadius;
        const localEntryProgress = reducedMotion
          ? 1
          : clamp(
              (elapsed - runtime.entryDelay[index]) /
                Math.max(runtime.entryDuration[index], 0.01),
              0,
              1,
            );
        const settle = easeOutPower(localEntryProgress, responsiveConfig.settleEase);

        if (pointerActive && breakProgress < 0.52 && settle > 0.82) {
          const dx = field.originsX[index] - pointerRef.current.x;
          const dy = field.originsY[index] - pointerRef.current.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < radiusSquared) {
            const distance = Math.sqrt(distanceSquared) || 0.0001;
            const falloff = 1 - distance / hoverRadius;
            const spread =
              falloff * falloff * hoverRepulsion * (1 - breakProgress) * settle;
            const tangentX = -dy / distance;
            const tangentY = dx / distance;
            const distortion =
              Math.sin(time * 7.2 + field.seeds[index] * 29) *
              responsiveConfig.hoverDistortion *
              Math.pow(falloff, 1.35) *
              settle;

            hoverTargetX = (dx / distance) * spread + tangentX * distortion;
            hoverTargetY = (dy / distance) * spread + tangentY * distortion;
          }

          if (distanceSquared < radiusSquared * 2.1) {
            const distance = Math.sqrt(distanceSquared) || 0.0001;
            const falloff = 1 - distance / (hoverRadius * 1.45);
            const centerDx = field.originsX[index] - field.centerX;
            const lateralDirection = centerDx >= 0 ? 1 : -1;
            const blast =
              Math.max(falloff, 0) *
              Math.max(falloff, 0) *
              hoverRepulsion *
              1.85 *
              settle *
              (1 - breakProgress * 0.65);

            hoverTargetX +=
              lateralDirection *
              blast *
              (0.95 + Math.abs(centerDx / logoWidth) * 0.7);
            hoverTargetY +=
              (dy / distance) * blast * 0.34 +
              Math.sin(time * 10.5 + field.seeds[index] * 35) * blast * 0.08;
          }
        }

        runtime.hoverX[index] = damp(runtime.hoverX[index], hoverTargetX, 14, delta);
        runtime.hoverY[index] = damp(runtime.hoverY[index], hoverTargetY, 14, delta);

        const formedX = field.originsX[index] + runtime.hoverX[index] * (1 - breakProgress);
        const formedY = field.originsY[index] + runtime.hoverY[index] * (1 - breakProgress);
        const localBreak = reducedMotion
          ? breakProgress
          : clamp(
              (breakProgress - runtime.breakDelay[index]) /
                Math.max(1 - runtime.breakDelay[index], 0.001),
              0,
              1,
            );
        const release = easeInOutCubic(localBreak);
        const travel = 1 - settle;
        let restedX = formedX;
        let restedY = formedY;

        if (settle < 0.995) {
          const entryWave = travel * travel * (0.7 + field.stability[index] * 0.3);
          const entryX =
            cubicBezier(
              runtime.entryStartX[index],
              runtime.entryControlAX[index],
              runtime.entryControlBX[index],
              field.originsX[index],
              settle,
            ) +
            Math.sin(
              time * (3.4 + runtime.entryWaveFreq[index]) + field.seeds[index] * 27,
            ) *
              runtime.entryWaveX[index] *
              entryWave;
          const entryY =
            cubicBezier(
              runtime.entryStartY[index],
              runtime.entryControlAY[index],
              runtime.entryControlBY[index],
              field.originsY[index],
              settle,
            ) +
            Math.cos(
              time * (3.9 + runtime.entryWaveFreq[index]) + field.seeds[index] * 23,
            ) *
              runtime.entryWaveY[index] *
              entryWave;
          const settleBlend = clamp((settle - 0.78) / 0.22, 0, 1);
          restedX = mix(entryX, formedX, settleBlend);
          restedY = mix(entryY, formedY, settleBlend);
        }

        let drawX = restedX;
        let drawY = restedY;

        if (release > 0.001) {
          const breakX = cubicBezier(
            formedX,
            runtime.breakControlAX[index],
            runtime.breakControlBX[index],
            runtime.breakExitX[index],
            release,
          );
          const breakY = cubicBezier(
            formedY,
            runtime.breakControlAY[index],
            runtime.breakControlBY[index],
            runtime.breakExitY[index],
            release,
          );
          drawX = mix(restedX, breakX, release);
          drawY = mix(restedY, breakY, release);
        }

        const moveDistance = Math.hypot(drawX - formedX, drawY - formedY);
        const glyphShouldAnimate = field.stability[index] < 0.92 || index % 3 === 0;
        runtime.glyphCountdowns[index] -= delta;

        if (
          glyphShouldAnimate &&
          runtime.glyphCountdowns[index] <= 0 &&
          characters.length > 0
        ) {
          runtime.glyphIndices[index] = nextGlyphIndex(
            index,
            time,
            field.seeds[index],
            characters.length,
          );
          runtime.glyphCountdowns[index] =
            field.glyphIntervals[index] *
            (0.84 + (Math.sin(time + field.seeds[index] * 19) + 1) * 0.18);
        }

        let alpha = field.brightness[index];
        alpha *= 0.06 + settle * 0.94;
        alpha *= 1 - easeOutPower(release, 1.45);
        alpha *=
          1 -
          easeInOutCubic(
            clamp(breakProgress / responsiveConfig.scrollClearThreshold, 0, 1),
          ) *
            0.12;
        alpha *=
          1 +
          Math.sin(time * 2.2 + field.seeds[index] * 18 + index * 0.035) *
            responsiveConfig.ambientTwinkleStrength;

        if (alpha <= 0.015) {
          continue;
        }

        const glyph = characters[runtime.glyphIndices[index]] ?? characters[0] ?? "#";

        if (
          settle > 0.28 &&
          release < 0.78 &&
          field.stability[index] > 0.32 &&
          index % 2 === 0
        ) {
          context.globalAlpha =
            alpha *
            responsiveConfig.glowStrength *
            (0.34 + settle * 0.44) *
            (1 - release * 0.55);
          context.fillStyle = responsiveConfig.glowColor;
          context.fillText(glyph, drawX, drawY);
        }

        if (!reducedMotion && release > 0.08 && release < 0.92 && index % 3 === 0) {
          context.globalAlpha =
            alpha * (0.12 + release * 0.22) * (1 - breakProgress * 0.18);
          context.fillStyle = responsiveConfig.glowColor;
          context.fillText(
            glyph,
            mix(drawX, formedX, 0.7),
            mix(drawY, formedY, 0.7),
          );
          context.fillText(
            glyph,
            mix(drawX, formedX, 0.5),
            mix(drawY, formedY, 0.5),
          );
        }

        if (
          !reducedMotion &&
          index % responsiveConfig.trailStride === 0 &&
          moveDistance > field.cellSize * 0.9
        ) {
          context.globalAlpha = alpha * (0.16 + release * 0.2);
          context.fillStyle = responsiveConfig.glowColor;
          context.fillText(
            glyph,
            mix(drawX, formedX, 0.42),
            mix(drawY, formedY, 0.42),
          );
          context.fillText(
            glyph,
            mix(drawX, formedX, 0.62),
            mix(drawY, formedY, 0.62),
          );
        }

        if (!reducedMotion && release > 0.12 && index % 5 === 0) {
          const lateralSpread =
            (field.originsX[index] >= field.centerX ? 1 : -1) *
            field.cellSize *
            (1.2 + release * 3.2);
          context.globalAlpha = alpha * (0.08 + release * 0.16);
          context.fillStyle = responsiveConfig.glowColor;
          context.fillText(
            glyph,
            drawX + lateralSpread,
            drawY - field.cellSize * 0.12,
          );
          context.fillText(
            glyph,
            drawX - lateralSpread * 0.42,
            drawY + field.cellSize * 0.08,
          );
        }

        context.globalAlpha = alpha;
        context.fillStyle = responsiveConfig.glyphColor;
        context.fillText(glyph, drawX, drawY);

        if (
          !reducedMotion &&
          breakProgress < 0.42 &&
          settle > 0.82 &&
          release < 0.18 &&
          field.seeds[index] >= glitterSeedThreshold
        ) {
          const sparklePulse = Math.max(
            0,
            Math.sin(time * (3.6 + field.seeds[index] * 4.8) + field.seeds[index] * 40),
          );

          if (sparklePulse > 0.72) {
            const sparkleSize =
              responsiveConfig.glitterSize *
              (0.8 + field.seeds[index] * 0.9 + sparklePulse * 0.65);
            const sparkleAlpha =
              alpha *
              responsiveConfig.glitterOpacity *
              Math.pow((sparklePulse - 0.72) / 0.28, 1.1);

            context.globalAlpha = sparkleAlpha;
            context.fillStyle = responsiveConfig.glitterColor;
            context.fillRect(drawX - sparkleSize, drawY - 0.45, sparkleSize * 2, 0.9);
            context.fillRect(drawX - 0.45, drawY - sparkleSize, 0.9, sparkleSize * 2);
            context.fillRect(drawX - 0.65, drawY - 0.65, 1.3, 1.3);
          }
        }
      }

      context.globalAlpha = 1;

      if (!readyReportedRef.current) {
        readyReportedRef.current = true;
        onReady?.();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [characters, field, onReady, reducedMotion, responsiveConfig, size, word]);

  return (
    <section
      ref={sectionRef}
      className={[
        "relative isolate min-h-screen min-h-[100svh] bg-black [--hero-break:0] [--hero-overlay:1] [--hero-reveal:0]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: "#000000",
        fontFamily: HERO_UI_FONT_STACK,
      }}
    >
      <div
        ref={stickyRef}
        className={[
          "sticky top-0 z-[3] h-screen min-h-[100svh] overflow-hidden",
        ].join(" ")}
        onPointerMove={updatePointerPosition}
        onPointerEnter={updatePointerPosition}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[var(--hero-overlay)]"
          style={{
            background: "#000000",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-0"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3] opacity-0"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3] opacity-0"
          style={{
            background: "transparent",
          }}
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="absolute inset-0 z-[4] block" />
        <div
          className="pointer-events-none absolute inset-0 z-[6] opacity-0"
          style={{
            background: "transparent",
          }}
          aria-hidden="true"
        />
      </div>
      <div
        className={[
          "relative z-[1] flex items-end px-4 pb-0",
          isMobileHero
            ? "mt-[48svh] min-h-[10svh] px-4"
            : isTabletHero
              ? "mt-[56svh] min-h-[10svh] px-6"
              : "mt-[84vh] min-h-[12vh] md:mt-[88vh] md:min-h-[10vh] md:px-[clamp(1.25rem,4vw,4rem)]",
        ].join(" ")}
      >
        {nextSection ?? renderDefaultNextSection()}
      </div>
    </section>
  );
}
