"use client";

import { useEffect, useRef } from "react";
import { Open_Sans } from "next/font/google";
import mapboxgl from "mapbox-gl";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type Coordinates = readonly [number, number];

type ProjectMapSectionProps = {
  projectCoordinates: Coordinates;
  projectLabel?: string;
  cityLabel?: string;
  sectionId?: string;
};

const DEFAULT_CITY_CENTER: Coordinates = [77.6245, 12.9637];
const DEFAULT_PROJECT_LABEL = "Project Site";
const DEFAULT_CITY_LABEL = "Bangalore, India";

function formatCoordinate(value: number, positiveLabel: string, negativeLabel: string) {
  const direction = value >= 0 ? positiveLabel : negativeLabel;

  return `${Math.abs(value).toFixed(4)}${direction}`;
}

export default function ProjectMapSection({
  projectCoordinates,
  projectLabel = DEFAULT_PROJECT_LABEL,
  cityLabel = DEFAULT_CITY_LABEL,
  sectionId,
}: ProjectMapSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim() ?? "";

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !accessToken || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = accessToken;

    const computedCenter: [number, number] = [
      projectCoordinates[0] + 0.03,
      projectCoordinates[1] - 0.008,
    ];
    const initialCenter: [number, number] = [
      DEFAULT_CITY_CENTER[0],
      DEFAULT_CITY_CENTER[1],
    ];
    const projectLngLat: [number, number] = [
      projectCoordinates[0],
      projectCoordinates[1],
    ];

    const map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/standard",
      config: {
        basemap: {
          lightPreset: "night",
          theme: "monochrome",
          showPointOfInterestLabels: false,
          showTransitLabels: false,
          showRoadLabels: false,
          show3dObjects: true,
        },
      },
      center: initialCenter,
      zoom: 10.8,
      pitch: 62,
      bearing: -32,
      projection: "mercator",
      antialias: true,
      attributionControl: false,
      cooperativeGestures: true,
    });

    mapRef.current = map;
    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    map.once("style.load", () => {
      if (!map.getSource("project-terrain")) {
        map.addSource("project-terrain", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
      }

      map.setFog({
        range: [-1, 2.2],
        color: "#06080d",
        "high-color": "#111827",
        "space-color": "#010204",
        "horizon-blend": 0.12,
        "star-intensity": 0.14,
      });
      map.setTerrain({ source: "project-terrain", exaggeration: 1.32 });
      map.easeTo({
        center: computedCenter,
        zoom: 11.8,
        pitch: 68,
        bearing: -26,
        duration: 2600,
        essential: true,
      });
    });

    const markerElement = document.createElement("div");
    markerElement.className = "project-map-marker";
    markerElement.setAttribute("aria-label", projectLabel);
    markerElement.title = projectLabel;

    const popupShell = document.createElement("div");
    popupShell.className = "project-map-popup-shell";

    const popupEyebrow = document.createElement("span");
    popupEyebrow.className = "project-map-popup-eyebrow";
    popupEyebrow.textContent = cityLabel;

    const popupTitle = document.createElement("strong");
    popupTitle.className = "project-map-popup-title";
    popupTitle.textContent = projectLabel;

    popupShell.append(popupEyebrow, popupTitle);

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 24,
      className: "project-map-popup",
      maxWidth: "220px",
    }).setDOMContent(popupShell);

    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: "bottom",
    })
      .setLngLat(projectLngLat)
      .setPopup(popup)
      .addTo(map);

    popup.addTo(map);
    popup.setLngLat(projectLngLat);

    return () => {
      marker.remove();
      popup.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [accessToken, cityLabel, projectCoordinates, projectLabel]);

  const latitudeLabel = formatCoordinate(projectCoordinates[1], "N", "S");
  const longitudeLabel = formatCoordinate(projectCoordinates[0], "E", "W");

  return (
    <section
      id={sectionId}
      className={`${openSans.className} project-map-section relative z-[7] h-[100svh] overflow-hidden bg-black text-[#f5efe4]`}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div ref={containerRef} className="project-map-container absolute inset-0" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.14),transparent_0%,transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.54)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.1)_62%,rgba(0,0,0,0.82)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-28 bg-gradient-to-b from-black via-black/94 to-transparent md:h-36"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-36 bg-gradient-to-t from-black via-black/94 to-transparent md:h-44"
        aria-hidden="true"
      />

      <div className="relative z-[4] flex h-full items-end px-4 pb-6 pt-20 sm:px-6 md:px-8 md:pb-8 xl:px-10">
        <div className="grid w-full gap-4 md:max-w-[30rem]">
          <div className="inline-flex w-fit items-center gap-2 border border-white/12 bg-black/38 px-3 py-2 text-[0.68rem] uppercase tracking-[0.34em] text-white/60 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#f2eee7]" />
            Project Context
          </div>

          <div className="border border-white/12 bg-black/34 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl md:p-6">
            <p className="m-0 text-[0.72rem] uppercase tracking-[0.3em] text-white/46">
              {cityLabel}
            </p>
            <h2 className="mt-3 max-w-[11ch] text-[clamp(2.2rem,5.2vw,5rem)] font-semibold leading-[0.9] tracking-[-0.075em] text-[#f7f1e7]">
              A 3D map resets the scroll before the reasons take over.
            </h2>
            <p className="mt-4 max-w-[36ch] text-[0.94rem] leading-[1.62] tracking-[-0.014em] text-white/62 md:text-[1rem]">
              Dark, cinematic, and anchored to Bangalore, this section gives the project a
              spatial presence before the sales narrative begins.
            </p>

            <div className="mt-6 grid gap-[1px] bg-white/10 md:grid-cols-[1.15fr_0.85fr]">
              <div className="bg-black/54 px-4 py-4">
                <p className="m-0 text-[0.66rem] uppercase tracking-[0.28em] text-white/42">
                  Pinned
                </p>
                <p className="mt-3 text-[1.05rem] font-semibold tracking-[-0.03em] text-[#f7f1e7]">
                  {projectLabel}
                </p>
              </div>
              <div className="bg-black/54 px-4 py-4">
                <p className="m-0 text-[0.66rem] uppercase tracking-[0.28em] text-white/42">
                  Coordinates
                </p>
                <p className="mt-3 text-[0.92rem] tracking-[-0.02em] text-white/72">
                  {latitudeLabel}
                  <br />
                  {longitudeLabel}
                </p>
              </div>
            </div>

            {!accessToken ? (
              <p className="mt-4 border border-white/10 bg-black/44 px-4 py-3 text-[0.82rem] leading-[1.55] tracking-[-0.01em] text-white/62">
                Add <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to enable the live Mapbox
                scene.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
