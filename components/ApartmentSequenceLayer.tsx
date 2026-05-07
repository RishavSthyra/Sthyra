"use client";

import type { CSSProperties } from "react";
import Image from "next/image";

type ApartmentSequenceLayerProps = {
  rows: number;
  columns: number;
  tileWidth: number;
  tileHeight: number;
  imageFrameStyle?: CSSProperties;
  contentFrameStyle?: CSSProperties;
};

type ApartmentBox = {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  variant: "light" | "dark";
  lines: string[];
  showPlus?: boolean;
};

const APARTMENT_BOXES: ApartmentBox[] = [
  {
    row: 0,
    col: 0,
    rowSpan: 1,
    colSpan: 2,
    variant: "dark",
    lines: [],
  },
  {
    row: 0,
    col: 2,
    rowSpan: 1,
    colSpan: 3,
    variant: "light",
    lines: ["ART", "DIRECTION"],
    showPlus: true,
  },
  {
    row: 1,
    col: 0,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    lines: ["BRIEFING", "+ STRATEGY"],
    showPlus: true,
  },
  {
    row: 1,
    col: 3,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    lines: ["DESIGN", "EXPLORATION"],
    showPlus: true,
  },
  {
    row: 1,
    col: 6,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    lines: ["FINAL", "PRESENTATION", "+ FOLLOW-UP"],
    showPlus: true,
  },
  {
    row: 3,
    col: 5,
    rowSpan: 1,
    colSpan: 2,
    variant: "light",
    lines: ["PRODUCTION"],
    showPlus: true,
  },
  {
    row: 3,
    col: 7,
    rowSpan: 1,
    colSpan: 1,
    variant: "dark",
    lines: ["LETS WORK ++"],
  },
];

function getApartmentTileDelay(row: number, col: number, rows: number, columns: number) {
  const bottomBias = (rows - 1 - row) * 0.08;
  const centerDrift = Math.abs(col - (columns - 1) / 2) * 0.018;
  const variance = ((((row + 2) * 17 + (col + 3) * 11) % 5) + 1) * 0.018;

  return bottomBias + centerDrift + variance;
}

function getBoxTextClass(box: ApartmentBox) {
  if (box.variant === "dark") {
    return "text-[clamp(0.82rem,0.95vw,1.05rem)]";
  }

  if (box.colSpan >= 3) {
    return "text-[clamp(1rem,1.55vw,1.9rem)]";
  }

  return "text-[clamp(0.92rem,1.35vw,1.5rem)]";
}

export default function ApartmentSequenceLayer({
  rows,
  columns,
  tileWidth,
  tileHeight,
  imageFrameStyle,
  contentFrameStyle,
}: ApartmentSequenceLayerProps) {
  const boxPadding = "max(12px, calc(20px * var(--sthyra-compact-scale)))";
  const plusOffset = "max(10px, calc(16px * var(--sthyra-compact-scale)))";
  const edgePadding =
    "max(var(--sthyra-safe-gutter), 12px, calc(20px * var(--sthyra-compact-scale)))";
  const edgePlusOffset =
    "max(var(--sthyra-safe-gutter), 10px, calc(16px * var(--sthyra-compact-scale)))";
  const frameStyle = { inset: 0 };

  return (
    <div className="apartment-sequence pointer-events-none absolute inset-0 z-[6]">
      <div className="absolute" style={imageFrameStyle ?? frameStyle}>
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: columns }).map((_, col) => (
            <div
              key={`apartment-sequence-${row}-${col}`}
              className="absolute overflow-hidden"
              style={{
                left: `${(col / columns) * 100}%`,
                top: `${(row / rows) * 100}%`,
                width: `${100 / columns}%`,
                height: `${100 / rows}%`,
              }}
            >
              <Image
                src={`/apartmentno2/tile_${row}_${col}.jpg`}
                alt=""
                width={tileWidth}
                height={tileHeight}
                unoptimized
                data-apartment-delay={getApartmentTileDelay(row, col, rows, columns).toFixed(3)}
                className="apartment-sequence-tile absolute inset-0 h-full w-full object-fill"
              />
            </div>
          )),
        )}
      </div>

      <div className="absolute" style={contentFrameStyle ?? frameStyle}>
        {APARTMENT_BOXES.map((box, index) => (
          <div
            key={`${box.lines.join("-")}-${index}`}
            className={[
              "apartment-sequence-box absolute overflow-hidden",
              box.variant === "light" ? "bg-white text-black" : "bg-black text-white",
            ].join(" ")}
            style={{
              left: `${(box.col / columns) * 100}%`,
              top: `${(box.row / rows) * 100}%`,
              width: `${(box.colSpan / columns) * 100}%`,
              height: `${(box.rowSpan / rows) * 100}%`,
            }}
          >
            <div
              className="apartment-sequence-box-copy absolute inset-0 flex flex-col justify-between text-left"
              style={{
                paddingTop: boxPadding,
                paddingBottom: boxPadding,
                paddingLeft: box.col === 0 ? edgePadding : boxPadding,
                paddingRight:
                  box.col + box.colSpan === columns ? edgePadding : boxPadding,
              }}
            >
              {box.lines.length > 0 ? (
                <div className="grid max-w-[88%] gap-[0.04em]">
                  {box.lines.map((line) => (
                    <h3
                      key={line}
                      className={[
                        "m-0 font-semibold uppercase leading-[0.9] tracking-[-0.07em]",
                        getBoxTextClass(box),
                      ].join(" ")}
                    >
                      {line}
                    </h3>
                  ))}
                </div>
              ) : (
                <span aria-hidden="true" />
              )}

              {box.showPlus ? (
                <div
                  className="absolute h-8 w-8 text-black/55 md:h-10 md:w-10"
                  style={{
                    right:
                      box.col + box.colSpan === columns ? edgePlusOffset : plusOffset,
                    bottom: plusOffset,
                  }}
                >
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
