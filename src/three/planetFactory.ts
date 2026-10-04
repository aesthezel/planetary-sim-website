/**
 * planetFactory.ts — Builds the procedural planet scene.
 *
 * Components (from plan):
 * - Planet core: smooth sphere with softly banded toon material
 * - Water: sphere r=1.02 with custom shader
 * - Islands: 5-7 thin organic coastline and land patches
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
  Vector4,
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

/* ---- Four-band gradient map for soft toon shading ---- */
function createGradientMap(): DataTexture {
  const colors = new Uint8Array([
    48, 48, 48, 255,
    112, 112, 112, 255,
    190, 190, 190, 255,
    255, 255, 255, 255,
  ]);
  const texture = new DataTexture(colors, 4, 1);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

function createIslandPatchGeometry(radius: number, rand: () => number): BufferGeometry {
  const segments = 32;
  const rings = [0.34, 0.68, 1];
  const phaseA = rand() * Math.PI * 2;
  const phaseB = rand() * Math.PI * 2;
  const phaseC = rand() * Math.PI * 2;
  const contour = Array.from({ length: segments }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2;
    return 1 + Math.sin(angle * 3 + phaseA) * 0.1 + Math.sin(angle * 5 + phaseB) * 0.055 + Math.sin(angle * 8 + phaseC) * 0.025;
  });

  const vertices = [0, 0, 0];
  for (const ring of rings) {
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = radius * ring * contour[i];
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      vertices.push(x, -(x * x + z * z) * 0.5, z);
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    indices.push(0, 1 + next, 1 + i);
  }
  for (let ring = 1; ring < rings.length; ring++) {
    const inner = 1 + (ring - 1) * segments;
    const outer = 1 + ring * segments;
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      indices.push(inner + i, inner + next, outer + next, inner + i, outer + next, outer + i);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/* ---- Island data ---- */
export interface IslandData {
  mesh: Group;
  basePosition: Vector3;
  coastRadius: number;
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
  const coreGeo = new SphereGeometry(1, 64, 48);
  const coreMat = new MeshToonMaterial({
    color: new Color(0x8b7355),
    gradientMap,
  });

  // A tiny smooth displacement keeps the silhouette organic without visible mesh facets.
  const positions = coreGeo.attributes.position;
  const phase = rand() * Math.PI * 2;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z);
    const variation = 1 + Math.sin(x * 5.5 + phase) * Math.sin(y * 4.5 - phase) * Math.sin(z * 6 + phase * 0.7) * 0.006;
    positions.setXYZ(i, (x / len) * variation, (y / len) * variation, (z / len) * variation);
  }
  positions.needsUpdate = true;
  coreGeo.computeVertexNormals();

  const planetCore = new Mesh(coreGeo, coreMat);
  group.add(planetCore);

  /* ---- Water ---- */
  const waterGeo = new SphereGeometry(1.02, 72, 48);
  const waterMat = createWaterMaterial();
  const waterMesh = new Mesh(waterGeo, waterMat);
  group.add(waterMesh);

  /* ---- Islands (5-7) ---- */
  const islandCount = 5 + Math.floor(rand() * 3);
  const islands: IslandData[] = [];
  const islandColors = [0x5c8a4c, 0x73945b, 0x68854d, 0x708f53, 0x61864d, 0x7a9654, 0x5f874b];

  for (let i = 0; i < islandCount; i++) {
    const islandGroup = new Group();

    // Position on sphere surface
    const r = 1.007;
    const pos = i === 0
      ? new Vector3(0.28, 0.58, 0.76).normalize().multiplyScalar(r)
      : (() => {
          const phi = Math.acos(2 * rand() - 1);
          const theta = rand() * Math.PI * 2;
          return new Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi),
          );
        })();

    // Two thin, curved layers read as a coastline and a flat organic land patch.
    const coastRadius = i === 0 ? 0.22 + rand() * 0.03 : 0.18 + rand() * 0.06;
    const coast = new Mesh(
      createIslandPatchGeometry(coastRadius * 1.18, rand),
      new MeshToonMaterial({ color: new Color(0xa18b69), gradientMap }),
    );
    coast.position.y = 0.022;
    islandGroup.add(coast);

    const land = new Mesh(
      createIslandPatchGeometry(coastRadius * 0.92, rand),
      new MeshToonMaterial({ color: new Color(islandColors[i % islandColors.length]), gradientMap }),
    );
    land.position.y = 0.029;
    islandGroup.add(land);

    islandGroup.position.copy(pos);
    islandGroup.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), pos.clone().normalize());

    // Only first island visible initially
    const initiallyVisible = i === 0;
    if (!initiallyVisible) {
      islandGroup.scale.set(0, 0, 0);
    }

    group.add(islandGroup);
    islands.push({ mesh: islandGroup, basePosition: pos, coastRadius, initiallyVisible });
  }

  const islandInfo = waterMat.uniforms.uIslands.value as Vector4[];
  islands.slice(0, islandInfo.length).forEach((island, index) => {
    const direction = island.basePosition.clone().normalize();
    islandInfo[index].set(direction.x, direction.y, direction.z, island.coastRadius * 1.18 + 0.025);
  });
  waterMat.uniforms.uIslandCount.value = Math.min(islands.length, islandInfo.length);

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
  const starCount = 320 + Math.floor(rand() * 120);
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
    size: 0.014,
    transparent: true,
    opacity: 0.32,
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
