"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

type Side = "left" | "right";

type OptionWheelProps = {
  items: string[];
  defaultSelected?: number;
  onChange?: (index: number, item: string) => void;
  textColor?: string;
  activeColor?: string;
  side?: Side;
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  ariaLabel?: string;
  className?: string;
};

type WheelConfig = {
  count: number;
  items: string[];
  rowHeight: number;
  curve: number;
  tilt: number;
  blur: number;
  fade: number;
  minOpacity: number;
  side: Side;
  loop: boolean;
  smoothing: number;
  draggable: boolean;
};

export default function OptionWheel({
  items,
  defaultSelected = 0,
  onChange,
  textColor = "#686868",
  activeColor = "#f3eee5",
  side = "left",
  fontSize = 0.9,
  spacing = 4.5,
  curve = 1,
  tilt = 8,
  blur = 1.35,
  fade = 0.22,
  minOpacity = 0.08,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  ariaLabel = "Choose portfolio service",
  className = "",
}: OptionWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const positionRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const animationFrameRef = useRef<number | null>(null);
  const frameRunnerRef = useRef<(now: number) => void>(() => undefined);
  const lastFrameRef = useRef(0);
  const configRef = useRef<WheelConfig>({
    count: items.length,
    items,
    rowHeight: Math.max(fontSize * spacing * 16, 1),
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
  });
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(null);
  const dragMovedRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const runFrame = useCallback((now: number) => {
    const deltaTime = Math.min((now - lastFrameRef.current) / 1000, 0.05);
    lastFrameRef.current = now;
    const config = configRef.current;
    const smoothingSeconds = Math.max(config.smoothing, 1) / 1000;
    const easing = 1 - Math.exp(-deltaTime / smoothingSeconds);
    const target = targetRef.current;
    let next = positionRef.current + (target - positionRef.current) * easing;
    const settled = Math.abs(target - next) < 0.001;

    if (settled) next = target;
    positionRef.current = next;

    const mirror = config.side === "right" ? -1 : 1;
    const tiltRadians = (config.tilt * Math.PI) / 180;
    const radius = tiltRadians > 0.0005 ? config.rowHeight / tiltRadians : 0;

    for (let index = 0; index < config.count; index += 1) {
      const element = itemRefs.current[index];
      if (!element) continue;

      let distance = index - next;
      if (config.loop && config.count > 1) {
        distance = ((distance % config.count) + config.count) % config.count;
        if (distance > config.count / 2) distance -= config.count;
      }

      const magnitude = Math.abs(distance);
      let x = 0;
      let y = distance * config.rowHeight;
      let rotation = 0;

      if (radius > 0) {
        const angle = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, distance * tiltRadians),
        );
        y = radius * Math.sin(angle);
        x = -mirror * radius * (1 - Math.cos(angle)) * config.curve;
        rotation = (mirror * angle * 180) / Math.PI;
      }

      element.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rotation.toFixed(3)}deg)`;
      element.style.opacity = String(Math.max(config.minOpacity, 1 - magnitude * config.fade));
      element.style.filter = config.blur > 0
        ? `blur(${(magnitude * config.blur).toFixed(2)}px)`
        : "none";
      element.style.setProperty(
        "--option-wheel-progress",
        Math.max(0, 1 - Math.min(magnitude, 1)).toFixed(4),
      );
    }

    animationFrameRef.current = settled
      ? null
      : requestAnimationFrame((nextNow) => frameRunnerRef.current(nextNow));
  }, []);

  useEffect(() => {
    frameRunnerRef.current = runFrame;
  }, [runFrame]);

  const startAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    lastFrameRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const applyTarget = useCallback((value: number, snap: boolean) => {
    const config = configRef.current;
    if (config.count === 0) return;

    let nextValue = value;
    if (!config.loop) {
      nextValue = Math.min(Math.max(nextValue, 0), config.count - 1);
    }
    if (snap) nextValue = Math.round(nextValue);
    targetRef.current = nextValue;

    const nextIndex = ((Math.round(nextValue) % config.count) + config.count) % config.count;
    if (nextIndex !== selectedRef.current) {
      selectedRef.current = nextIndex;
      setSelectedIndex(nextIndex);
      onChangeRef.current?.(nextIndex, config.items[nextIndex]);
    }
    startAnimation();
  }, [startAnimation]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const config = configRef.current;
      const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
      const step = Math.max(-1, Math.min(1, delta / config.rowHeight));
      applyTarget(targetRef.current + step, false);

      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => {
        applyTarget(targetRef.current, true);
      }, 140);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!configRef.current.draggable) return;
    dragRef.current = {
      y: event.clientY,
      start: targetRef.current,
      id: event.pointerId,
    };
    dragMovedRef.current = false;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const deltaY = event.clientY - drag.y;

    if (!dragMovedRef.current && Math.abs(deltaY) > 4) {
      dragMovedRef.current = true;
      rootRef.current?.setPointerCapture(drag.id);
    }
    if (dragMovedRef.current) {
      applyTarget(drag.start - deltaY / configRef.current.rowHeight, false);
    }
  }, [applyTarget]);

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);

  const handleItemClick = useCallback((index: number) => {
    if (dragMovedRef.current) return;
    const config = configRef.current;
    const current = targetRef.current;
    let distance = index - (((current % config.count) + config.count) % config.count);

    if (config.loop && config.count > 1) {
      if (distance > config.count / 2) distance -= config.count;
      else if (distance < -config.count / 2) distance += config.count;
    }
    applyTarget(current + distance, true);
  }, [applyTarget]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    let delta: number | null = null;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") delta = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") delta = 1;

    if (event.key === "Home") {
      event.preventDefault();
      applyTarget(0, true);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      applyTarget(configRef.current.count - 1, true);
      return;
    }
    if (delta === null) return;
    event.preventDefault();
    applyTarget(Math.round(targetRef.current) + delta, true);
  }, [applyTarget]);

  useEffect(() => {
    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    ) || 16;
    configRef.current = {
      count: items.length,
      items,
      rowHeight: Math.max(fontSize * spacing * rootFontSize, 1),
      curve,
      tilt,
      blur,
      fade,
      minOpacity,
      side,
      loop,
      smoothing,
      draggable,
    };
    applyTarget(targetRef.current, false);
  }, [
    items,
    fontSize,
    spacing,
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    applyTarget,
  ]);

  useEffect(() => () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      aria-label={ariaLabel}
      aria-activedescendant={`portfolio-wheel-option-${selectedIndex}`}
      className={`portfolio-option-wheel relative h-full w-full select-none overflow-hidden overscroll-contain outline-none [touch-action:none] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-white/55 ${isDragging ? "cursor-grabbing" : "cursor-grab"}${className ? ` ${className}` : ""}`}
      style={{
        "--option-wheel-text": textColor,
        "--option-wheel-active": activeColor,
        "--option-wheel-font-size": `clamp(0.47rem,0.72vw,${fontSize}rem)`,
        "--option-wheel-inset": `min(${inset}px,5vw)`,
      } as CSSProperties}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      <div className="pointer-events-none absolute left-0 top-1/2 h-px w-8 -translate-y-1/2 bg-white/65 sm:w-12" />
      {items.map((label, index) => (
        <div
          key={label}
          id={`portfolio-wheel-option-${index}`}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          role="option"
          aria-selected={selectedIndex === index}
          className={`absolute top-1/2 cursor-pointer whitespace-nowrap font-semibold uppercase leading-none tracking-[0.08em] will-change-[transform,opacity,filter] [font-size:var(--option-wheel-font-size)] [color:color-mix(in_srgb,var(--option-wheel-active)_calc(var(--option-wheel-progress,0)*100%),var(--option-wheel-text))] sm:tracking-[0.16em] ${
            side === "right"
              ? "right-[var(--option-wheel-inset)] origin-right"
              : "left-[var(--option-wheel-inset)] origin-left"
          }`}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
