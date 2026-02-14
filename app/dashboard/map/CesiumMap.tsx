"use client";

import { useEffect, useRef } from "react";

const tuboranCoords = { lat: 7.5065, lng: 125.8948 };

export default function CesiumMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let mounted = true;

    (async () => {
      try {
        // Dynamically import Cesium
        const Cesium = await import("cesium");

        // Tell Cesium where static files are located
        (window as any).CESIUM_BASE_URL = "/cesium";

        const { Ion, Viewer, Cartesian3, Color } = Cesium;
        const createWorldTerrain = (Cesium as any).createWorldTerrain;

        // Load Cesium Ion token
        Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN ?? "";

        if (!mounted) return;

        // Initialize viewer with performance optimizations
        viewerRef.current = new Viewer(mapRef.current, {
          terrainProvider: createWorldTerrain ? createWorldTerrain() : undefined,
          baseLayerPicker: true,
          timeline: false,
          animation: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          // Performance optimizations
          requestRenderMode: true,
          maximumRenderTimeChange: Infinity,
        });

        const viewer = viewerRef.current;

        // Set camera position IMMEDIATELY without animation
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(
            tuboranCoords.lng,
            tuboranCoords.lat,
            2500
          ),
        });

        // Add a marker
        viewer.entities.add({
          name: "Tuboran, Mawab, Davao de Oro",
          position: Cartesian3.fromDegrees(tuboranCoords.lng, tuboranCoords.lat),
          point: {
            pixelSize: 12,
            color: Color.RED,
          },
          label: {
            text: "Tuboran",
            fillColor: Color.WHITE,
            showBackground: true,
          },
        });

        // Optional: enable lighting and shadows
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.depthTestAgainstTerrain = true;

        // Force initial render
        viewer.scene.requestRender();
      } catch (err) {
        console.error("Failed to initialize Cesium:", err);
      }
    })();

    // Cleanup on unmount
    return () => {
      mounted = false;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying Cesium viewer:", e);
        }
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}