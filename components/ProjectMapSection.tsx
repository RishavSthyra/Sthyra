"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Open_Sans } from "next/font/google";
import { FiMinus, FiPlus } from "react-icons/fi";
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

type ProjectLocation = {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  imageSrc: string;
  websiteUrl: string;
};

const DEFAULT_CITY_CENTER: Coordinates = [77.6245, 12.9637];
const DEFAULT_PROJECT_LABEL = "Project Site";
const DEFAULT_CITY_LABEL = "Bangalore, India";
const TERRAIN_SOURCE_ID = "project-terrain";
const BUILDING_LAYER_ID = "project-3d-buildings";
const TAB_IMAGE_TRIFECTA = "/images_last_frame.jpg";
const TAB_IMAGE_AADHYA = "/aadhya_serene_2.webp";

function getFirstSymbolLayerId(map: mapboxgl.Map) {
  return map
    .getStyle()
    .layers?.find((layer) => layer.type === "symbol" && layer.layout?.["text-field"])?.id;
}

export default function ProjectMapSection({
  projectCoordinates,
  projectLabel: _projectLabel = DEFAULT_PROJECT_LABEL,
  cityLabel = DEFAULT_CITY_LABEL,
  sectionId,
}: ProjectMapSectionProps) {
  void _projectLabel;

  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const activePopupRef = useRef<mapboxgl.Popup | null>(null);
  const openPopupByIdRef = useRef<(projectId: string) => void>(() => {});
  const orbitTimerRef = useRef<number | null>(null);
  const orbitActiveRef = useRef(false);
  const lenisUnlockTimerRef = useRef<number | null>(null);
  const snapLockRef = useRef(false);
  const activeProjectIdRef = useRef("");
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim() ?? "";
  const projectLng = projectCoordinates[0];
  const projectLat = projectCoordinates[1];
  const projectLocations = useMemo<ProjectLocation[]>(
    () => [
      {
        id: "trifecta-veranza",
        name: "Trifecta Veranza",
        address: "Kada Agrahara Rd, Kommasandra, Bengaluru, Yamare, Karnataka 560099",
        coordinates: [77.75129535163592, 12.863615161912074],
        imageSrc: TAB_IMAGE_TRIFECTA,
        websiteUrl: "https://trifecta-veranza.vercel.app/",
      },
      {
        id: "aadhya-serene",
        name: "Aadhya Serene",
        address:
          "Aadhya Serene, Thanisandra Main Rd, near Railwaymen Layout, Railwaymen Layout, Sri Balaji Krupa Layout, Thanisandra, Bengaluru, Karnataka 560077",
        coordinates: [77.63288010691248, 13.062295674093026],
        imageSrc: TAB_IMAGE_AADHYA,
        websiteUrl: "https://www.aadhyaserene.com/",
      },
    ],
    [],
  );
  const [activeProjectId, setActiveProjectId] = useState(projectLocations[0]?.id ?? "");
  activeProjectIdRef.current = activeProjectId;

  const setActiveProject = useCallback((projectId: string) => {
    if (activeProjectIdRef.current === projectId) {
      return;
    }

    activeProjectIdRef.current = projectId;
    setActiveProjectId(projectId);
  }, []);

  const flyToProject = useCallback((project: ProjectLocation, duration = 1500) => {
    mapRef.current?.easeTo({
      center: project.coordinates,
      zoom: 15.35,
      pitch: 79,
      bearing: -22,
      duration,
      essential: true,
    });
  }, []);

  const stopProjectOrbit = useCallback(() => {
    orbitActiveRef.current = false;

    if (orbitTimerRef.current !== null) {
      window.clearTimeout(orbitTimerRef.current);
      orbitTimerRef.current = null;
    }

  }, []);

  const startProjectOrbit = useCallback(
    (project: ProjectLocation) => {
      const map = mapRef.current;

      if (!map) {
        return;
      }

      stopProjectOrbit();
      orbitActiveRef.current = true;

      const runOrbit = () => {
        if (!orbitActiveRef.current) {
          return;
        }

        orbitTimerRef.current = null;
        map.easeTo({
          center: project.coordinates,
          pitch: 80,
          bearing: map.getBearing() + 90,
          duration: 22500,
          easing: (value) => value,
          essential: true,
        });

        orbitTimerRef.current = window.setTimeout(runOrbit, 22600);
      };

      orbitTimerRef.current = window.setTimeout(runOrbit, 1250);
    },
    [stopProjectOrbit],
  );

  const snapToMap = useCallback(() => {
    if (snapLockRef.current) {
      return;
    }

    snapLockRef.current = true;
    const sectionTop = sectionRef.current?.offsetTop ?? 0;

    window.dispatchEvent(
      new CustomEvent("sthyra:lenis-lock", { detail: { locked: false } }),
    );
    window.dispatchEvent(
      new CustomEvent("sthyra:lenis-scroll-to", {
        detail: { target: sectionTop, immediate: false },
      }),
    );
    window.setTimeout(() => {
      snapLockRef.current = false;
    }, 1050);
  }, []);

  const goToBottomSection = useCallback(() => {
    const reasonsSection = document.getElementById("reasons");

    if (!reasonsSection) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("sthyra:lenis-lock", { detail: { locked: false } }),
    );
    window.dispatchEvent(
      new CustomEvent("sthyra:lenis-scroll-to", {
        detail: { target: reasonsSection.offsetTop, immediate: false },
      }),
    );
  }, []);

  const recenterMap = useCallback(() => {
    const activeProject =
      projectLocations.find((project) => project.id === activeProjectId) ?? projectLocations[0];

    snapToMap();
    if (activeProject) {
      flyToProject(activeProject, 1300);
    }
  }, [activeProjectId, flyToProject, projectLocations, snapToMap]);

  const zoomMap = useCallback((direction: "in" | "out") => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const zoomDelta = direction === "in" ? 0.82 : -0.82;
    const nextZoom = Math.min(18.4, Math.max(10.6, map.getZoom() + zoomDelta));

    map.easeTo({
      zoom: nextZoom,
      duration: 420,
      essential: true,
    });
  }, []);

  const selectProject = useCallback(
    (project: ProjectLocation) => {
      setActiveProject(project.id);
      snapToMap();
      flyToProject(project);
      openPopupByIdRef.current(project.id);
      startProjectOrbit(project);
    },
    [flyToProject, setActiveProject, snapToMap, startProjectOrbit],
  );

  useEffect(() => {
    setActiveProjectId((current) =>
      projectLocations.some((project) => project.id === current)
        ? current
        : projectLocations[0]?.id ?? "",
    );
  }, [projectLocations]);

  useEffect(() => {
    const section = sectionRef.current;
    const reasonsSection = document.getElementById("reasons");

    if (!section) {
      return;
    }

    const handlePageWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.deltaY <= 0 || snapLockRef.current) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (target?.closest(".project-map-section")) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      if (rect.top > -viewportHeight * 0.15 && rect.top < viewportHeight * 0.86) {
        event.preventDefault();
        event.stopPropagation();
        snapToMap();
      }
    };

    const handleReasonsWheel = (event: WheelEvent) => {
      if (event.deltaY >= 0 || snapLockRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      snapToMap();
    };

    window.addEventListener("wheel", handlePageWheel, { passive: false });
    reasonsSection?.addEventListener("wheel", handleReasonsWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handlePageWheel);
      reasonsSection?.removeEventListener("wheel", handleReasonsWheel);
    };
  }, [snapToMap]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !accessToken || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = accessToken;
    const isCompactDevice =
      window.matchMedia("(max-width: 767px)").matches ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;

    const initialProject = projectLocations[0];
    const computedCenter: [number, number] = initialProject
      ? [initialProject.coordinates[0] + 0.006, initialProject.coordinates[1] - 0.003]
      : [projectLng + 0.012, projectLat - 0.004];
    const initialCenter: [number, number] = [
      DEFAULT_CITY_CENTER[0],
      DEFAULT_CITY_CENTER[1],
    ];

    const map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/standard",
      config: {
        basemap: {
          lightPreset: "dusk",
          theme: "monochrome",
          showPointOfInterestLabels: false,
          showTransitLabels: false,
          showRoadLabels: true,
          show3dObjects: !isCompactDevice,
        },
      },
      center: initialCenter,
      zoom: isCompactDevice ? 12.9 : 13.8,
      pitch: isCompactDevice ? 64 : 76,
      bearing: -24,
      projection: "mercator",
      antialias: !isCompactDevice,
      attributionControl: false,
      cooperativeGestures: false,
      maxPitch: 85,
      minZoom: 10.6,
      maxZoom: 18.4,
      collectResourceTiming: false,
      refreshExpiredTiles: false,
      maxTileCacheSize: isCompactDevice ? 80 : 160,
    });

    mapRef.current = map;
    map.scrollZoom.disable();
    map.dragRotate.enable();
    map.touchZoomRotate.enableRotation();
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

    const lockPageScroll = () => {
      if (lenisUnlockTimerRef.current !== null) {
        window.clearTimeout(lenisUnlockTimerRef.current);
      }

      window.dispatchEvent(
        new CustomEvent("sthyra:lenis-lock", { detail: { locked: true } }),
      );
    };

    const unlockPageScroll = (delay = 260) => {
      if (lenisUnlockTimerRef.current !== null) {
        window.clearTimeout(lenisUnlockTimerRef.current);
      }

      lenisUnlockTimerRef.current = window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("sthyra:lenis-lock", { detail: { locked: false } }),
        );
        lenisUnlockTimerRef.current = null;
      }, delay);
    };

    const handleInteractionStart = () => {
      stopProjectOrbit();
      lockPageScroll();
    };

    const handleInteractionEnd = () => {
      unlockPageScroll(220);

      const activeProject = projectLocations.find(
        (project) => project.id === activeProjectIdRef.current,
      );

      if (activeProject) {
        startProjectOrbit(activeProject);
      }
    };

    container.addEventListener("pointerdown", handleInteractionStart);
    window.addEventListener("pointerup", handleInteractionEnd);
    window.addEventListener("blur", handleInteractionEnd);

    let lastPopupUpdate = 0;
    const handleMapMousemove = () => {
      const now = performance.now();
      if (now - lastPopupUpdate < 120) return;
      lastPopupUpdate = now;

      const activeProject =
        projectLocations.find((project) => project.id === activeProjectIdRef.current) ??
        initialProject;

      if (!activeProject || !activePopup.isOpen()) return;

      activePopup.setLngLat(activeProject.coordinates);
    };

    container.addEventListener("mousemove", handleMapMousemove);

    map.once("style.load", () => {
      if (!map.getSource(TERRAIN_SOURCE_ID)) {
        map.addSource(TERRAIN_SOURCE_ID, {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
      }

      map.setFog({
        range: [-1, 2.2],
        color: "#d6d9dc",
        "high-color": "#f3f4f5",
        "space-color": "#050506",
        "horizon-blend": 0.2,
        "star-intensity": 0,
      });
      map.setTerrain({
        source: TERRAIN_SOURCE_ID,
        exaggeration: isCompactDevice ? 1.22 : 1.65,
      });

      if (!isCompactDevice && !map.getLayer(BUILDING_LAYER_ID)) {
        const labelLayerId = getFirstSymbolLayerId(map);

        map.addLayer(
          {
            id: BUILDING_LAYER_ID,
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 12.5,
            paint: {
              "fill-extrusion-color": [
                "interpolate",
                ["linear"],
                ["get", "height"],
                0,
                "#d5d7d9",
                60,
                "#f1f2f3",
                160,
                "#ffffff",
              ],
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12.5,
                0,
                13.6,
                ["coalesce", ["get", "height"], 36],
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                12.5,
                0,
                13.6,
                ["coalesce", ["get", "min_height"], 0],
              ],
              "fill-extrusion-opacity": 0.9,
            },
          },
          labelLayerId,
        );
      }

      map.easeTo({
        center: computedCenter,
        zoom: isCompactDevice ? 14.35 : 15.15,
        pitch: isCompactDevice ? 66 : 79,
        bearing: -22,
        duration: isCompactDevice ? 1200 : 2600,
        essential: true,
      });
    });

    const createPopupContent = (project: ProjectLocation) => {
      const popupShell = document.createElement("div");
      popupShell.className = "project-map-popup-shell";

      const popupImage = document.createElement("img");
      popupImage.className = "project-map-popup-image";
      popupImage.src = project.imageSrc;
      popupImage.alt = project.name;
      popupImage.loading = "lazy";
      popupImage.decoding = "async";

      const popupEyebrow = document.createElement("span");
      popupEyebrow.className = "project-map-popup-eyebrow";
      popupEyebrow.textContent = cityLabel;

      const popupTitle = document.createElement("strong");
      popupTitle.className = "project-map-popup-title";
      popupTitle.textContent = project.name;

      const popupMeta = document.createElement("span");
      popupMeta.className = "project-map-popup-meta";
      popupMeta.textContent = project.address;

      const popupLink = document.createElement("a");
      popupLink.className = "project-map-popup-link";
      popupLink.href = project.websiteUrl;
      popupLink.target = project.websiteUrl.startsWith("http") ? "_blank" : "_self";
      popupLink.rel = project.websiteUrl.startsWith("http") ? "noreferrer" : "";
      popupLink.textContent = "Visit website";

      popupShell.append(popupImage, popupEyebrow, popupTitle, popupMeta, popupLink);

      return popupShell;
    };

    const activePopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      closeOnMove: false,
      offset: 24,
      className: "project-map-popup",
      maxWidth: isCompactDevice ? "248px" : "286px",
      focusAfterOpen: false,
    });
    activePopupRef.current = activePopup;

    const openProjectPopup = (project: ProjectLocation) => {
      setActiveProject(project.id);
      activePopup
        .setDOMContent(createPopupContent(project))
        .setLngLat(project.coordinates)
        .addTo(map);
    };

    openPopupByIdRef.current = (projectId: string) => {
      const project = projectLocations.find((item) => item.id === projectId);

      if (project) {
        openProjectPopup(project);
      }
    };

    const markerHandles = projectLocations.map((project) => {
      const markerElement = document.createElement("div");
      markerElement.className = "project-map-marker";
      markerElement.setAttribute("aria-label", project.name);
      markerElement.title = project.name;

      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: "bottom",
      })
        .setLngLat(project.coordinates)
        .addTo(map);

      const openPopup = () => {
        openProjectPopup(project);
      };

      const openPopupAndOrbit = () => {
        openProjectPopup(project);
        map.easeTo({
          center: project.coordinates,
          zoom: 15.35,
          pitch: 79,
          bearing: -22,
          duration: 1500,
          essential: true,
        });
        startProjectOrbit(project);
      };

      markerElement.addEventListener("mouseenter", openPopup);
      markerElement.addEventListener("focus", openPopup);
      markerElement.addEventListener("click", openPopupAndOrbit);

      if (project.id === initialProject?.id) {
        openPopup();
      }

      return { marker, markerElement, openPopup, openPopupAndOrbit };
    });

    const keepActivePopupOpen = () => {
      const activeProject =
        projectLocations.find((project) => project.id === activeProjectIdRef.current) ??
        initialProject;

      if (!activeProject || activePopup.isOpen()) {
        return;
      }

      activePopup.setDOMContent(createPopupContent(activeProject));
      activePopup.addTo(map).setLngLat(activeProject.coordinates);
    };
 
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          map.resize();
          return;
        }

        stopProjectOrbit();
        map.stop();
      },
      { threshold: 0.05 },
    );

    visibilityObserver.observe(container);
    map.on("zoomend", keepActivePopupOpen);
    map.on("moveend", keepActivePopupOpen);

    return () => {
      container.removeEventListener("pointerdown", handleInteractionStart);
      window.removeEventListener("pointerup", handleInteractionEnd);
      window.removeEventListener("blur", handleInteractionEnd);
      container.removeEventListener("mousemove", handleMapMousemove);
      map.off("zoomend", keepActivePopupOpen);
      map.off("moveend", keepActivePopupOpen);
      visibilityObserver.disconnect();

      if (lenisUnlockTimerRef.current !== null) {
        window.clearTimeout(lenisUnlockTimerRef.current);
        lenisUnlockTimerRef.current = null;
      }

      stopProjectOrbit();

      window.dispatchEvent(
        new CustomEvent("sthyra:lenis-lock", { detail: { locked: false } }),
      );
      markerHandles.forEach(({ marker, markerElement, openPopup, openPopupAndOrbit }) => {
        markerElement.removeEventListener("mouseenter", openPopup);
        markerElement.removeEventListener("focus", openPopup);
        markerElement.removeEventListener("click", openPopupAndOrbit);
        marker.remove();
      });
      activePopup.remove();
      activePopupRef.current = null;
      openPopupByIdRef.current = () => {};
      map.remove();
      mapRef.current = null;
    };
  }, [
    accessToken,
    cityLabel,
    projectLat,
    projectLng,
    projectLocations,
    setActiveProject,
    startProjectOrbit,
    stopProjectOrbit,
  ]);

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={`${openSans.className} project-map-section relative z-[7] h-[100svh] overflow-hidden bg-black text-[#f5efe4]`}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 5%, black 94%, transparent 100%)",
        }}
      >
        <div
          ref={containerRef}
          className="project-map-container absolute inset-0 z-[1]"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.05),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.16)_18%,rgba(0,0,0,0)_46%,rgba(0,0,0,0)_70%,rgba(0,0,0,0.38)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[34vh] bg-[linear-gradient(180deg,#000_0%,rgba(0,0,0,0.72)_24%,rgba(0,0,0,0.24)_68%,rgba(0,0,0,0)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[22vh] bg-[linear-gradient(0deg,#000_0%,rgba(0,0,0,0.5)_44%,rgba(0,0,0,0)_100%)]"
        aria-hidden="true"
      />

      {accessToken ? (
        <>
          <div className="absolute right-4 top-[42%] z-[80] flex w-[27rem] -translate-y-1/2 flex-col items-end gap-3.5 overflow-visible md:right-8">
            {projectLocations.map((project, index) => {
              const isActive = activeProjectId === project.id;

              return (
                <div key={project.id} className="relative h-[9.2rem] w-full overflow-visible">
                  <div
                    className={[
                      "group/project-tab absolute right-0 top-0 h-full w-[8.4rem] overflow-hidden rounded-[1.35rem] border bg-black shadow-[0_26px_90px_rgba(0,0,0,0.5)] transition-[width,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:w-full focus-within:w-full",
                      isActive
                        ? "border-white/24 bg-black/92 text-white"
                        : "border-white/10 bg-black/88 text-white/72 hover:border-white/22 hover:bg-black/94 hover:text-white",
                    ].join(" ")}
                  >
                    <div className="grid h-full w-[27rem] grid-cols-[11.2rem_minmax(0,1fr)]">
                      <button
                        type="button"
                        onClick={() => selectProject(project)}
                        className="relative h-full overflow-hidden text-left"
                        aria-label={`Go to ${project.name}`}
                      >
                        <span
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/project-tab:-translate-x-4 group-focus-within/project-tab:-translate-x-4"
                          style={{ backgroundImage: `url(${project.imageSrc})` }}
                          aria-hidden="true"
                        />
                        <span
                          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18))]"
                          aria-hidden="true"
                        />
                    </button>
                      <div className="pointer-events-none grid h-full content-between gap-2.5 bg-[linear-gradient(145deg,rgba(9,10,12,0.94),rgba(0,0,0,0.86))] px-4 py-3 opacity-0 backdrop-blur-xl transition-opacity duration-300 group-hover/project-tab:pointer-events-auto group-hover/project-tab:opacity-100 group-focus-within/project-tab:pointer-events-auto group-focus-within/project-tab:opacity-100">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-white/36">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {/* <span className="h-px flex-1 bg-white/10" /> */}
                          </div>
                          <div className="grid gap-1.5">
                            <p className="m-0 text-[0.82rem] font-semibold uppercase leading-[0.98] tracking-[-0.035em]">
                              {project.name}
                            </p>
                            <p className="m-0 line-clamp-2 text-[0.61rem] leading-[1.32] tracking-[-0.01em] text-white/48">
                              {project.address}
                            </p>
                          </div>
                        </div>
                        <div className="grid w-fit gap-1.5">
                          <button
                            type="button"
                            onClick={() => selectProject(project)}
                            className="w-fit text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
                          >
                            Go to point
                          </button>
                          <a
                            href={project.websiteUrl}
                            target={project.websiteUrl.startsWith("http") ? "_blank" : "_self"}
                            rel={project.websiteUrl.startsWith("http") ? "noreferrer" : undefined}
                            className="w-fit rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/64 transition-colors hover:border-white/24 hover:bg-white/[0.11] hover:text-white"
                          >
                            Website
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-x-4 bottom-7 z-[30] flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={goToBottomSection}
              className="rounded-full border border-white/18 bg-black/58 px-5 py-3 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-white/84 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-2xl transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.12] hover:text-white"
            >
              View reasons
            </button>
            <button
              type="button"
              onClick={recenterMap}
              className="rounded-full border border-white/14 bg-black/48 px-4 py-3 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-white/72 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-colors duration-300 hover:border-white/28 hover:bg-white/[0.11] hover:text-white"
            >
              Re-center
            </button>
            <div className="flex overflow-hidden rounded-full border border-white/14 bg-black/46 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <button
                type="button"
                onClick={() => zoomMap("out")}
                aria-label="Zoom out"
                className="grid h-11 w-11 place-items-center border-r border-white/10 text-white/72 transition-colors duration-300 hover:bg-white/[0.11] hover:text-white"
              >
                <FiMinus aria-hidden="true" className="h-4 w-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={() => zoomMap("in")}
                aria-label="Zoom in"
                className="grid h-11 w-11 place-items-center text-white/78 transition-colors duration-300 hover:bg-white/[0.11] hover:text-white"
              >
                <FiPlus aria-hidden="true" className="h-4 w-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </>
      ) : null}

      {!accessToken ? (
        <div className="pointer-events-none absolute inset-x-4 bottom-8 z-[4] mx-auto max-w-md border border-white/10 bg-black/82 px-4 py-3 text-center text-[0.74rem] leading-[1.55] tracking-[-0.01em] text-white/70 backdrop-blur-xl">
          Add <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to enable the live Mapbox scene.
        </div>
      ) : null}
    </section>
  );
}
