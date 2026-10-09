/**
 * planetFactory.ts — Builds the procedural planet scene.
 *
 * Components (from plan):
 * - Planet core: smooth sphere with softly banded toon material
 * - Water: sphere r=1.02 with custom shader
 * - Islands: 5-7 smooth clay mounds (grass + beach baked as vertex colors)
 * - Landmarks: rounded clay hills and tiny towers that emerge over time
 * - Aura: BackSide sphere r=1.08
 * - Atmosphere: sphere r=1.15 (grows during zoom)
 * - Motas: Points 40-60 + 1 clickable spark
 * - Stars: Points 800-1200
 *
 * Seed: 'Mundo'
 */

import {
  Group,
  Mesh,
  SphereGeometry,
  LatheGeometry,
  CapsuleGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  MeshToonMaterial,
  Color,
  DataTexture,
  NearestFilter,
  Vector2,
  Vector3,
  Vector4,
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

/* ---- Island proportions (shared by geometry + landmarks) ---- */
const ISLAND_BASE_RADIUS = 1.008;
const ISLAND_DOME_HEIGHT = 0.055;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* ---- Soft toon gradient map (gentle cel bands, clay-friendly) ---- */
function createGradientMap(): DataTexture {
  const colors = new Uint8Array([
    44, 44, 44, 255,
    96, 96, 96, 255,
    150, 150, 150, 255,
    205, 205, 205, 255,
    255, 255, 255, 255,
  ]);
  const texture = new DataTexture(colors, 5, 1);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * A single smooth clay mound per island.
 *
 * The patch gently domes above the waterline and sinks under it at the rim, so
 * the coastline is a soft intersection instead of a hard floating edge. Grass
 * and sand are baked as vertex colors, which removes the overlapping coast/land
 * layers that produced z-fighting and dark facets.
 */
function createIslandGeometry(
  radius: number,
  rand: () => number,
  grass: Color,
  grassDark: Color,
  sand: Color,
): BufferGeometry {
  const segments = 64;
  const rings = 10;
  const phaseA = rand() * Math.PI * 2;
  const phaseB = rand() * Math.PI * 2;
  const phaseC = rand() * Math.PI * 2;

  // Only low-frequency harmonics: an organic silhouette with no aliased jaggies.
  const contour = (angle: number) =>
    1
    + Math.sin(angle * 2 + phaseA) * 0.09
    + Math.sin(angle * 3 + phaseB) * 0.06
    + Math.sin(angle * 5 + phaseC) * 0.03;

  const domeAt = (u: number) => ISLAND_DOME_HEIGHT * (1 - Math.pow(u, 2.4));

  const positions: number[] = [];
  const colors: number[] = [];
  const tmp = new Color();

  positions.push(0, domeAt(0), 0);
  colors.push(grass.r, grass.g, grass.b);

  for (let ri = 1; ri <= rings; ri++) {
    const u = ri / rings;
    const dome = domeAt(u);
    const beach = smoothstep(0.72, 0.96, u);
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = radius * u * contour(angle);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      // `-0.5 r²` makes the patch hug the globe; the dome rides on top.
      positions.push(x, dome - 0.5 * (x * x + z * z), z);

      const shade = 0.5 + 0.5 * Math.sin(angle * 3 + phaseA);
      tmp.copy(grass).lerp(grassDark, shade * 0.4);
      tmp.lerp(sand, beach);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    indices.push(0, 1 + next, 1 + i);
  }
  for (let ri = 1; ri < rings; ri++) {
    const inner = 1 + (ri - 1) * segments;
    const outer = 1 + ri * segments;
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      indices.push(inner + i, inner + next, outer + next, inner + i, outer + next, outer + i);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Smooth rounded hill profile (a soft quarter-ellipse of revolution). */
function createClayHill(radius: number, height: number, segments = 18): LatheGeometry {
  const points: Vector2[] = [];
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push(new Vector2(
      Math.max(radius * Math.cos((t * Math.PI) / 2), 0.0001),
      height * Math.sin((t * Math.PI) / 2),
    ));
  }
  const geometry = new LatheGeometry(points, segments);
  geometry.computeVertexNormals();
  return geometry;
}

/* ---- Clay landmarks: smooth hills and rounded little towers ---- */
function createIslandDetails(rand: () => number, coastRadius: number, gradientMap: DataTexture): Group {
  const details = new Group();
  details.position.y = ISLAND_DOME_HEIGHT - 0.004;

  const mountains = new Group();
  const mountainCount = 1 + Math.floor(rand() * 2);
  for (let m = 0; m < mountainCount; m++) {
    const height = coastRadius * (0.22 + rand() * 0.18);
    const baseRadius = height * (0.85 + rand() * 0.35);
    const mountain = new Mesh(
      createClayHill(baseRadius, height),
      new MeshToonMaterial({ color: new Color(m === 0 ? 0x93a06b : 0x7fa05f), gradientMap }),
    );
    const angle = rand() * Math.PI * 2;
    const dist = coastRadius * 0.28 * rand();
    mountain.position.set(Math.cos(angle) * dist, -0.5 * dist * dist, Math.sin(angle) * dist);
    mountain.rotation.y = rand() * Math.PI;
    mountains.add(mountain);
  }
  mountains.scale.setScalar(0);
  mountains.visible = false;
  details.add(mountains);

  // Tiny rounded clay towers (no hard-edged boxes) that appear once land matures.
  const structures = new Group();
  const structureCount = 2 + Math.floor(rand() * 3);
  for (let s = 0; s < structureCount; s++) {
    const radius = coastRadius * (0.045 + rand() * 0.03);
    const length = radius * (0.7 + rand() * 0.7);
    const structure = new Mesh(
      new CapsuleGeometry(radius, length, 4, 12),
      new MeshToonMaterial({ color: new Color(0xd39a78), gradientMap }),
    );
    const angle = rand() * Math.PI * 2;
    const dist = coastRadius * 0.42 * rand();
    structure.position.set(Math.cos(angle) * dist, length / 2 + radius - 0.5 * dist * dist, Math.sin(angle) * dist);
    structure.rotation.y = rand() * Math.PI;
    structures.add(structure);
  }
  structures.scale.setScalar(0);
  structures.visible = false;
  details.add(structures);

  details.userData.mountains = mountains;
  details.userData.structures = structures;

  return details;
}

/* ---- Island data ---- */
export interface IslandData {
  mesh: Group;
  details: Group;
  mountains: Group;
  structures: Group;
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
  aura: Mesh;
  atmosphere: Mesh;
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
  const waterGeo = new SphereGeometry(1.02, 96, 64);
  const waterMat = createWaterMaterial();
  const waterMesh = new Mesh(waterGeo, waterMat);
  group.add(waterMesh);

  /* ---- Islands (5-7) ---- */
  const islandCount = 5 + Math.floor(rand() * 3);
  const islands: IslandData[] = [];
  const grassPalette = [0x6f9a56, 0x7ba45f, 0x67914f, 0x759c58, 0x6a9351, 0x7ea862, 0x6d9753];
  const sand = new Color(0xd9c49a);

  for (let i = 0; i < islandCount; i++) {
    const islandGroup = new Group();

    // Position on sphere surface, resting just above the core.
    const r = ISLAND_BASE_RADIUS;
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

    // One smooth clay mound: grass and beach baked as vertex colors.
    const coastRadius = i === 0 ? 0.22 + rand() * 0.03 : 0.18 + rand() * 0.06;
    const grass = new Color(grassPalette[i % grassPalette.length]);
    const land = new Mesh(
      createIslandGeometry(coastRadius, rand, grass, grass.clone().multiplyScalar(0.8), sand),
      new MeshToonMaterial({ vertexColors: true, gradientMap }),
    );
    islandGroup.add(land);

    islandGroup.position.copy(pos);
    islandGroup.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), pos.clone().normalize());

    // Clay hills and small rounded towers grow on the land over time.
    const details = createIslandDetails(rand, coastRadius, gradientMap);
    islandGroup.add(details);

    // Only first island visible initially
    const initiallyVisible = i === 0;
    if (!initiallyVisible) {
      islandGroup.scale.set(0, 0, 0);
    }

    group.add(islandGroup);
    islands.push({
      mesh: islandGroup,
      details,
      mountains: details.userData.mountains as Group,
      structures: details.userData.structures as Group,
      basePosition: pos,
      coastRadius,
      initiallyVisible,
    });
  }

  const islandInfo = waterMat.uniforms.uIslands.value as Vector4[];
  islands.slice(0, islandInfo.length).forEach((island, index) => {
    const direction = island.basePosition.clone().normalize();
    // The visible waterline sits at ~90% of the geometry radius.
    islandInfo[index].set(direction.x, direction.y, direction.z, island.coastRadius * 0.9);
  });
  waterMat.uniforms.uIslandCount.value = Math.min(islands.length, islandInfo.length);

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
    aura,
    atmosphere,
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
