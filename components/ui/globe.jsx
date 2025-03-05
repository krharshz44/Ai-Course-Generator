"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;

export function GlobeComponent({ globeConfig, data }) {
  const globeRef = useRef(null);
  const [globeData, setGlobeData] = useState(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    console.log("GlobeComponent mounted");

    // Initialize Globe
    if (!globeRef.current) {
      globeRef.current = new ThreeGlobe()
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => defaultProps.polygonColor);

      _buildMaterial();
    }

    _buildData();
  }, []);

  const _buildMaterial = () => {
    if (!globeRef.current) return;
    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
  };

  const _buildData = () => {
    const arcs = data || [];
    const points = arcs.flatMap((arc) => {
      const rgb = hexToRgb(arc.color);
      return [
        { size: defaultProps.pointSize, lat: arc.startLat, lng: arc.startLng, color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})` },
        { size: defaultProps.pointSize, lat: arc.endLat, lng: arc.endLng, color: (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})` },
      ];
    });

    const filteredPoints = points.filter((v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i);
    setGlobeData(filteredPoints);
  };

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => d.startLat)
      .arcStartLng((d) => d.startLng)
      .arcEndLat((d) => d.endLat)
      .arcEndLng((d) => d.endLng)
      .arcColor((d) => d.color)
      .arcAltitude((d) => d.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((d) => d.order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(globeData)
      .pointColor((d) => d.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((d) => (t) => d.color(t))
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);
  }, [globeData]);

  return globeRef.current ? <primitive object={globeRef.current} /> : null;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, []);

  return null;
}

export function World(props) {
  const { globeConfig } = props;

  return (
    <Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={[-400, 100, 400]} />
      <directionalLight color={globeConfig.directionalTopLight} position={[-200, 500, 200]} />
      <pointLight color={globeConfig.pointLight} position={[-200, 500, 200]} intensity={0.8} />
      <GlobeComponent {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotate
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}
