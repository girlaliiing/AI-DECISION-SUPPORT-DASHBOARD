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
        // ✅ Load Cesium dynamically
        const Cesium = await import("cesium");

        // ✅ Tell Cesium where required static files are found
        (window as any).CESIUM_BASE_URL = "/cesium";

        const { Ion, Viewer, Cartesian3, Color } = Cesium;
        const createWorldTerrain = (Cesium as any).createWorldTerrain;

        // ✅ Load token
        Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN ?? "";

        if (!mounted) return;

        // ✅ Create map viewer
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
        });

        const viewer = viewerRef.current;

        // ✅ Fly camera to Tuboran
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(
            tuboranCoords.lng,
            tuboranCoords.lat,
            2500
          ),
        });

        // ✅ Add Marker
        viewer.entities.add({
          name: "Tuboran, Mawab, Davao de Oro",
          position: Cartesian3.fromDegrees(
            tuboranCoords.lng,
            tuboranCoords.lat
          ),
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
      } catch (err) {
        console.error("Failed to initialize Cesium:", err);
      }
    })();

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
