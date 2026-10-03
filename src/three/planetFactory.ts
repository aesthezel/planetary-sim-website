/**
 * planetFactory.ts — Builds the procedural planet scene.
 *
 * Components (from plan):
 * - Planet core: IcosahedronGeometry with toon material
 * - Water: sphere r=1.02 with custom shader
 * - Islands: 5-7 blobs (flattened sphere + cone)
 * - Boat: ultra-low-poly box + prism orbiting
 * - Aura: BackSide sphere r=1.08
 * - Atmosphere: sphere r=1.15 (grows during zoom)
 * - Orbital ring: RingGeometry + sprite labels
 * - Motas: Points 40-60 + 1 clickable spark
 * - Stars: Points 800-1200
 *
 * Seed: 'Mundo'
 */

import {
  Group,
  Mesh,
  IcosahedronGeometry,
  SphereGeometry,
  ConeGeometry,
  BoxGeometry,
  RingGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  MeshToonMaterial,
  MeshBasicMaterial,
  DoubleSide,
  Color,
  DataTexture,
  NearestFilter,
  Vector3,
  Object3D,
} from 'three';
import { createWaterMaterial, createAuraMaterial, createAtmosphereMaterial } from './waterShader';

/* ---- Seeded random (simple mulberry32) ---- */
function seedHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- 3-step gradient map for toon shading ---- */
function createGradientMap(): DataTexture {
  const colors = new Uint8Array([60, 100, 180, 255]);
  const texture = new DataTexture(colors, 4, 1);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

/* ---- Island data ---- */
export interface IslandData {
  mesh: Group;
  basePosition: Vector3;
  initiallyVisible: boolean;
}

/* ---- Factory result ---- */
export interface PlanetFactoryResult {
  group: Group;
  planetCore: Mesh;
  waterMesh: Mesh;
  islands: IslandData[];
  boat: Object3D;
  aura: Mesh;
  atmosphere: Mesh;
  orbitalRing: Mesh;
  motas: Points;
  sparkPosition: Vector3;
  stars: Points;
  /** Materials that need time updates */
  animatedMaterials: {
    water: ReturnType<typeof createWaterMaterial>;
    aura: ReturnType<typeof createAuraMaterial>;
    atmosphere: ReturnType<typeof createAtmosphereMaterial>;
  };
}

export function createPlanet(seed = 'Mundo'): PlanetFactoryResult {
  const rand = mulberry32(seedHash(seed));
  const group = new Group();
  const gradientMap = createGradientMap();

  /* ---- Planet core ---- */
  const coreGeo = new IcosahedronGeometry(1, 5);
  const coreMat = new MeshToonMaterial({
    color: new Color(0x8b7355),
    gradientMap,
  });

  // Vertex-color-like: perturb positions slightly for organic feel
  const positions = coreGeo.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z);
    const variation = 0.97 + rand() * 0.06;
    positions.setXYZ(i, (x / len) * variation, (y / len) * variation, (z / len) * variation);
  }
  positions.needsUpdate = true;
  coreGeo.computeVertexNormals();

  const planetCore = new Mesh(coreGeo, coreMat);
  group.add(planetCore);

  /* ---- Water ---- */
  const waterGeo = new SphereGeometry(1.02, 48, 48);
  const waterMat = createWaterMaterial();
  const waterMesh = new Mesh(waterGeo, waterMat);
  group.add(waterMesh);

  /* ---- Islands (5-7) ---- */
  const islandCount = 5 + Math.floor(rand() * 3);
  const islands: IslandData[] = [];
  const islandColors = [0x7eab6e, 0x5c8a4c, 0xd4c49a, 0x7eab6e, 0xe5d5a8, 0x7eab6e, 0x5c8a4c];

  for (let i = 0; i < islandCount; i++) {
    const islandGroup = new Group();

    // Position on sphere surface
    const phi = Math.acos(2 * rand() - 1);
    const theta = rand() * Math.PI * 2;
    const r = 1.01;
    const pos = new Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    );

    // Flattened sphere (island base)
    const baseGeo = new SphereGeometry(0.08 + rand() * 0.06, 8, 6);
    const baseMat = new MeshToonMaterial({
      color: new Color(islandColors[i % islandColors.length]),
      gradientMap,
    });
    const baseMesh = new Mesh(baseGeo, baseMat);
    baseMesh.scale.set(1, 0.35, 1);
    islandGroup.add(baseMesh);

    // Small peak (cone)
    if (rand() > 0.4) {
      const peakGeo = new ConeGeometry(0.03 + rand() * 0.02, 0.06 + rand() * 0.04, 5);
      const peakMat = new MeshToonMaterial({
        color: new Color(islandColors[(i + 2) % islandColors.length]),
        gradientMap,
      });
      const peak = new Mesh(peakGeo, peakMat);
      peak.position.y = 0.03;
      islandGroup.add(peak);
    }

    islandGroup.position.copy(pos);
    islandGroup.lookAt(0, 0, 0);
    islandGroup.rotateX(Math.PI);

    // Only first island visible initially
    const initiallyVisible = i === 0;
    if (!initiallyVisible) {
      islandGroup.scale.set(0, 0, 0);
    }

    group.add(islandGroup);
    islands.push({ mesh: islandGroup, basePosition: pos, initiallyVisible });
  }

  /* ---- Boat ---- */
  const boatGroup = new Group();
  const hullGeo = new BoxGeometry(0.04, 0.015, 0.02);
  const hullMat = new MeshToonMaterial({ color: new Color(0x8b6240), gradientMap });
  const hull = new Mesh(hullGeo, hullMat);
  boatGroup.add(hull);

  const sailGeo = new ConeGeometry(0.012, 0.035, 3);
  const sailMat = new MeshToonMaterial({ color: new Color(0xfff8e7), gradientMap });
  const sail = new Mesh(sailGeo, sailMat);
  sail.position.set(0, 0.02, 0);
  boatGroup.add(sail);

  // Start position on orbit
  boatGroup.position.set(1.12, 0, 0);
  group.add(boatGroup);

  /* ---- Aura ---- */
  const auraGeo = new SphereGeometry(1.08, 32, 32);
  const auraMat = createAuraMaterial();
  const aura = new Mesh(auraGeo, auraMat);
  group.add(aura);

  /* ---- Atmosphere ---- */
  const atmoGeo = new SphereGeometry(1.15, 32, 32);
  const atmoMat = createAtmosphereMaterial();
  const atmosphere = new Mesh(atmoGeo, atmoMat);
  group.add(atmosphere);

  /* ---- Orbital ring ---- */
  const ringGeo = new RingGeometry(1.25, 1.26, 64);
  const ringMat = new MeshBasicMaterial({
    color: new Color(0xc8cbdf),
    transparent: true,
    opacity: 0.15,
    side: DoubleSide,
    depthWrite: false,
  });
  const orbitalRing = new Mesh(ringGeo, ringMat);
  orbitalRing.rotation.x = Math.PI * 0.5;
  group.add(orbitalRing);

  /* ---- Motas (particles) ---- */
  const motaCount = 40 + Math.floor(rand() * 20);
  const motaPositions = new Float32Array(motaCount * 3);
  const motaSizes = new Float32Array(motaCount);
  let sparkIdx = 0;

  for (let i = 0; i < motaCount; i++) {
    const phi = Math.acos(2 * rand() - 1);
    const theta = rand() * Math.PI * 2;
    const r = 1.15 + rand() * 0.3;
    motaPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    motaPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    motaPositions[i * 3 + 2] = r * Math.cos(phi);
    motaSizes[i] = 1.5 + rand() * 2;

    // Track the brightest one for the clickable spark
    if (motaSizes[i] > motaSizes[sparkIdx]) sparkIdx = i;
  }

  const motaGeo = new BufferGeometry();
  motaGeo.setAttribute('position', new Float32BufferAttribute(motaPositions, 3));
  motaGeo.setAttribute('size', new Float32BufferAttribute(motaSizes, 1));

  const motaMat = new PointsMaterial({
    color: new Color(0xfff4cc),
    size: 0.015,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const motas = new Points(motaGeo, motaMat);
  group.add(motas);

  const sparkPosition = new Vector3(
    motaPositions[sparkIdx * 3],
    motaPositions[sparkIdx * 3 + 1],
    motaPositions[sparkIdx * 3 + 2],
  );

  /* ---- Stars ---- */
  const starCount = 800 + Math.floor(rand() * 400);
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const phi = Math.acos(2 * rand() - 1);
    const theta = rand() * Math.PI * 2;
    const r = 8 + rand() * 12;
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }

  const starGeo = new BufferGeometry();
  starGeo.setAttribute('position', new Float32BufferAttribute(starPositions, 3));
  const starMat = new PointsMaterial({
    color: new Color(0xffffff),
    size: 0.02,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const stars = new Points(starGeo, starMat);
  group.add(stars);

  return {
    group,
    planetCore,
    waterMesh,
    islands,
    boat: boatGroup,
    aura,
    atmosphere,
    orbitalRing,
    motas,
    sparkPosition,
    stars,
    animatedMaterials: {
      water: waterMat,
      aura: auraMat,
      atmosphere: atmoMat,
    },
  };
}
