import type { AsciiWordHeroConfig } from "./config";

export type AsciiGridField = {
  count: number;
  cellSize: number;
  cellStepX: number;
  cellStepY: number;
  fontSize: number;
  originsX: Float32Array;
  originsY: Float32Array;
  brightness: Float32Array;
  stability: Float32Array;
  seeds: Float32Array;
  glyphIndices: Uint16Array;
  glyphIntervals: Float32Array;
  wordLeft: number;
  wordRight: number;
  wordTop: number;
  wordBottom: number;
  centerX: number;
  centerY: number;
  wordWidth: number;
  wordHeight: number;
};

type MaskImage = {
  image: ImageData;
  maskWidth: number;
  maskHeight: number;
  maskScale: number;
};

type CreateAsciiGridFieldOptions = {
  text: string;
  width: number;
  height: number;
  characters: string[];
  config: AsciiWordHeroConfig;
  maskFontFamily?: string;
  maskFontWeight?: number;
};

type TrackedMetrics = {
  charWidths: number[];
  spacing: number;
  totalWidth: number;
};

type ParticleCandidate = {
  x: number;
  y: number;
  brightness: number;
  stability: number;
  seed: number;
  glyphIndex: number;
  glyphInterval: number;
  importance: number;
};

const DEFAULT_MASK_FONT_STACK =
  `"Bahnschrift SemiCondensed", "Avenir Next Condensed", "Arial Narrow Bold", "Franklin Gothic Demi Cond", "Arial Black", sans-serif`;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createSeed(value: number) {
  const seed = Math.sin(value * 12.9898) * 43758.5453;

  return seed - Math.floor(seed);
}

function readAlpha(image: ImageData, width: number, height: number, x: number, y: number) {
  const sampleX = clamp(Math.round(x), 0, width - 1);
  const sampleY = clamp(Math.round(y), 0, height - 1);

  return image.data[(sampleY * width + sampleX) * 4 + 3];
}

function measureTrackedText(
  context: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  letterSpacing: number,
  fontFamily: string,
  fontWeight: number,
) {
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  const charWidths = [...text].map((char) => context.measureText(char).width);
  const spacing = fontSize * letterSpacing;
  const totalWidth =
    charWidths.reduce((sum, width) => sum + width, 0) +
    Math.max(text.length - 1, 0) * spacing;

  return {
    charWidths,
    spacing,
    totalWidth,
  } satisfies TrackedMetrics;
}

function drawTrackedText(
  context: CanvasRenderingContext2D,
  text: string,
  metrics: TrackedMetrics,
  x: number,
  baselineY: number,
) {
  let cursor = x;

  [...text].forEach((char, index) => {
    context.fillText(char, cursor, baselineY);
    cursor += metrics.charWidths[index] + metrics.spacing;
  });
}

function createEmptyField(cellSize: number) {
  return {
    count: 0,
    cellSize,
    cellStepX: cellSize,
    cellStepY: cellSize,
    fontSize: cellSize,
    originsX: new Float32Array(),
    originsY: new Float32Array(),
    brightness: new Float32Array(),
    stability: new Float32Array(),
    seeds: new Float32Array(),
    glyphIndices: new Uint16Array(),
    glyphIntervals: new Float32Array(),
    wordLeft: 0,
    wordRight: 0,
    wordTop: 0,
    wordBottom: 0,
    centerX: 0,
    centerY: 0,
    wordWidth: 0,
    wordHeight: 0,
  } satisfies AsciiGridField;
}

function thinCandidates(
  candidates: ParticleCandidate[],
  maxParticles: number,
) {
  if (candidates.length <= maxParticles) {
    return candidates;
  }

  const sorted = [...candidates].sort((left, right) => {
    if (right.importance !== left.importance) {
      return right.importance - left.importance;
    }

    return left.seed - right.seed;
  });

  const trimmed = sorted.slice(0, maxParticles);

  trimmed.sort((left, right) => {
    if (left.y !== right.y) {
      return left.y - right.y;
    }

    return left.x - right.x;
  });

  return trimmed;
}

function buildFieldFromMaskImage(
  width: number,
  height: number,
  characters: string[],
  config: AsciiWordHeroConfig,
  mask: MaskImage,
  cellSize: number,
  cellStepX: number,
  cellStepY: number,
): AsciiGridField {
  const { image, maskWidth, maskHeight, maskScale } = mask;
  const columns = Math.max(Math.floor(width / cellStepX), 1);
  const rows = Math.max(Math.floor(height / cellStepY), 1);
  const startX = (width - (columns - 1) * cellStepX) / 2;
  const startY = (height - (rows - 1) * cellStepY) / 2;
  const sampleStepX = cellStepX * maskScale;
  const sampleStepY = cellStepY * maskScale;
  const fontSizeForCells = Math.max(Math.round(cellSize * 0.94), 8);

  const candidates: ParticleCandidate[] = [];

  let wordLeft = Number.POSITIVE_INFINITY;
  let wordRight = Number.NEGATIVE_INFINITY;
  let wordTop = Number.POSITIVE_INFINITY;
  let wordBottom = Number.NEGATIVE_INFINITY;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = startX + column * cellStepX;
      const y = startY + row * cellStepY;
      const sampleX = x * maskScale;
      const sampleY = y * maskScale;
      const centerAlpha = readAlpha(image, maskWidth, maskHeight, sampleX, sampleY);

      if (centerAlpha <= config.maskThreshold) {
        continue;
      }

      const left = readAlpha(image, maskWidth, maskHeight, sampleX - sampleStepX, sampleY);
      const right = readAlpha(image, maskWidth, maskHeight, sampleX + sampleStepX, sampleY);
      const up = readAlpha(image, maskWidth, maskHeight, sampleX, sampleY - sampleStepY);
      const down = readAlpha(image, maskWidth, maskHeight, sampleX, sampleY + sampleStepY);
      const diagA = readAlpha(
        image,
        maskWidth,
        maskHeight,
        sampleX - sampleStepX,
        sampleY - sampleStepY,
      );
      const diagB = readAlpha(
        image,
        maskWidth,
        maskHeight,
        sampleX + sampleStepX,
        sampleY - sampleStepY,
      );
      const diagC = readAlpha(
        image,
        maskWidth,
        maskHeight,
        sampleX - sampleStepX,
        sampleY + sampleStepY,
      );
      const diagD = readAlpha(
        image,
        maskWidth,
        maskHeight,
        sampleX + sampleStepX,
        sampleY + sampleStepY,
      );

      const localAverage =
        (centerAlpha + left + right + up + down + diagA + diagB + diagC + diagD) / 9;
      const edgeFactor = 1 - clamp((left + right + up + down) / 4 / 255, 0, 1);
      const coreFactor = clamp(localAverage / 255, 0, 1);
      const seed = createSeed(x * 0.081 + y * 0.053 + row * 0.19 + column * 0.31);

      const brightness = clamp(
        0.82 + coreFactor * 0.16 - edgeFactor * 0.06 + seed * 0.03,
        0.74,
        1,
      );
      const stability = clamp(coreFactor * 0.9 + (1 - edgeFactor) * 0.1, 0, 1);

      candidates.push({
        x,
        y,
        brightness,
        stability,
        seed,
        glyphIndex: Math.floor(seed * characters.length) % characters.length,
        glyphInterval:
          config.glyphSwapInterval[0] +
          seed * (config.glyphSwapInterval[1] - config.glyphSwapInterval[0]),
        importance:
          stability * 0.72 +
          brightness * 0.18 +
          (1 - Math.abs((x - width * 0.5) / Math.max(width * 0.5, 1))) * 0.06 +
          (1 - Math.abs((y - height * 0.5) / Math.max(height * 0.5, 1))) * 0.04,
      });

      wordLeft = Math.min(wordLeft, x);
      wordRight = Math.max(wordRight, x);
      wordTop = Math.min(wordTop, y);
      wordBottom = Math.max(wordBottom, y);
    }
  }

  if (candidates.length === 0) {
    return createEmptyField(cellSize);
  }

  const trimmedCandidates = thinCandidates(candidates, config.maxParticles);
  const positionsX = new Float32Array(trimmedCandidates.length);
  const positionsY = new Float32Array(trimmedCandidates.length);
  const brightnessValues = new Float32Array(trimmedCandidates.length);
  const stabilityValues = new Float32Array(trimmedCandidates.length);
  const seedValues = new Float32Array(trimmedCandidates.length);
  const glyphValues = new Uint16Array(trimmedCandidates.length);
  const intervalValues = new Float32Array(trimmedCandidates.length);
  const targetCenterX = width * 0.5;
  const targetCenterY = height * 0.5;
  const sourceCenterX = (wordLeft + wordRight) * 0.5;
  const sourceCenterY = (wordTop + wordBottom) * 0.5;
  const offsetX = targetCenterX - sourceCenterX;
  const offsetY = targetCenterY - sourceCenterY;

  for (let index = 0; index < trimmedCandidates.length; index += 1) {
    const candidate = trimmedCandidates[index];
    positionsX[index] = candidate.x + offsetX;
    positionsY[index] = candidate.y + offsetY;
    brightnessValues[index] = candidate.brightness;
    stabilityValues[index] = candidate.stability;
    seedValues[index] = candidate.seed;
    glyphValues[index] = candidate.glyphIndex;
    intervalValues[index] = candidate.glyphInterval;
  }

  wordLeft += offsetX;
  wordRight += offsetX;
  wordTop += offsetY;
  wordBottom += offsetY;

  return {
    count: trimmedCandidates.length,
    cellSize,
    cellStepX,
    cellStepY,
    fontSize: fontSizeForCells,
    originsX: positionsX,
    originsY: positionsY,
    brightness: brightnessValues,
    stability: stabilityValues,
    seeds: seedValues,
    glyphIndices: glyphValues,
    glyphIntervals: intervalValues,
    wordLeft,
    wordRight,
    wordTop,
    wordBottom,
    centerX: targetCenterX,
    centerY: targetCenterY,
    wordWidth: Math.max(wordRight - wordLeft, cellStepX),
    wordHeight: Math.max(wordBottom - wordTop, cellStepY),
  } satisfies AsciiGridField;
}

export function createAsciiGridFieldFromMaskImage({
  width,
  height,
  characters,
  config,
  mask,
}: {
  width: number;
  height: number;
  characters: string[];
  config: AsciiWordHeroConfig;
  mask: MaskImage;
}): AsciiGridField {
  const cellSize = clamp(Math.round(8 / config.density), 6, 11);
  const cellStepX = cellSize * 0.92;
  const cellStepY = cellSize * 1.02;

  if (width < cellStepX || height < cellStepY || characters.length === 0) {
    return createEmptyField(cellSize);
  }

  const sampleGridCount =
    Math.max(Math.floor(width / cellStepX), 1) *
    Math.max(Math.floor(height / cellStepY), 1);

  if (sampleGridCount > config.maxCells * 1.25) {
    const scaledCellSize = Math.ceil(Math.sqrt((width * height) / config.maxCells));
    const nextDensity = 8 / clamp(scaledCellSize, 6, 11);

    return createAsciiGridFieldFromMaskImage({
      width,
      height,
      characters,
      config: {
        ...config,
        density: nextDensity,
      },
      mask,
    });
  }

  return buildFieldFromMaskImage(
    width,
    height,
    characters,
    config,
    mask,
    cellSize,
    cellStepX,
    cellStepY,
  );
}

export function createAsciiGridField({
  text,
  width,
  height,
  characters,
  config,
  maskFontFamily,
  maskFontWeight = 900,
}: CreateAsciiGridFieldOptions): AsciiGridField {
  const fontFamily = maskFontFamily ?? DEFAULT_MASK_FONT_STACK;
  const cellSize = clamp(Math.round(8 / config.density), 6, 11);
  const cellStepX = cellSize * 0.92;
  const cellStepY = cellSize * 1.02;

  if (width < cellStepX || height < cellStepY || characters.length === 0) {
    return createEmptyField(cellSize);
  }

  const columns = Math.max(Math.floor(width / cellStepX), 1);
  const rows = Math.max(Math.floor(height / cellStepY), 1);
  const sampleGridCount = columns * rows;

  if (sampleGridCount > config.maxCells * 1.25) {
    const scaledCellSize = Math.ceil(Math.sqrt((width * height) / config.maxCells));
    const nextDensity = 8 / clamp(scaledCellSize, 6, 11);

    return createAsciiGridField({
      text,
      width,
      height,
      characters,
      config: {
        ...config,
        density: nextDensity,
      },
    });
  }

  const maskScale = 2;
  const maskCanvas = document.createElement("canvas");
  const maskWidth = Math.max(Math.round(width * maskScale), 1);
  const maskHeight = Math.max(Math.round(height * maskScale), 1);
  const context = maskCanvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return createEmptyField(cellSize);
  }

  maskCanvas.width = maskWidth;
  maskCanvas.height = maskHeight;

  context.setTransform(maskScale, 0, 0, maskScale, 0, 0);
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  const safeWidth = width * (1 - config.maskPadding * 2) * config.textScale;
  const safeHeight = height * 0.34;
  let fontSize = Math.min(
    height * 0.7,
    safeWidth / Math.max(text.length * 0.46, 1),
  );
  let metrics = measureTrackedText(
    context,
    text,
    fontSize,
    config.letterSpacing,
    fontFamily,
    maskFontWeight,
  );

  for (let step = 0; step < 8; step += 1) {
    const fitScale = Math.min(
      safeWidth / Math.max(metrics.totalWidth, 1),
      safeHeight / Math.max(fontSize, 1),
      1,
    );

    if (fitScale > 0.997) {
      break;
    }

    fontSize *= fitScale;
    metrics = measureTrackedText(
      context,
      text,
      fontSize,
      config.letterSpacing,
      fontFamily,
      maskFontWeight,
    );
  }

  context.font = `${maskFontWeight} ${fontSize}px ${fontFamily}`;
  const textX = (width - metrics.totalWidth) / 2;
  const baselineY = height / 2 + fontSize * 0.25;
  drawTrackedText(context, text, metrics, textX, baselineY);

  return buildFieldFromMaskImage(
    width,
    height,
    characters,
    config,
    {
      image: context.getImageData(0, 0, maskWidth, maskHeight),
      maskWidth,
      maskHeight,
      maskScale,
    },
    cellSize,
    cellStepX,
    cellStepY,
  );
}
