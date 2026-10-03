/**
 * waterShader.ts — Procedural water, atmosphere & aura shaders.
 *
 * Follows plan: esfera 1.02 with fresnel rim + foam procedural.
 * Aura: BackSide esfera 1.08 additive.
 * Atmosphere: rim glow that grows during zoom.
 */

import {
  ShaderMaterial,
  Color,
  BackSide,
  AdditiveBlending,
  FrontSide,
} from 'three';

/* ================================================
   WATER MATERIAL
   ================================================ */

const waterVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  // Simple noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    // Quantize time to ~10fps for stop-motion feel
    float qt = floor(uTime * 10.0) / 10.0;

    // Subtle wave displacement
    float wave = noise(position.xy * 3.0 + qt * 0.4) * 0.008;
    wave += noise(position.yz * 2.5 + qt * 0.3) * 0.005;
    vElevation = wave;

    vec3 displaced = position + normal * wave;
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const waterFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  varying float vElevation;
  uniform vec3 uShallowColor;
  uniform vec3 uDeepColor;
  uniform vec3 uFoamColor;
  uniform float uTime;
  uniform float uFoamThreshold;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    // Fresnel
    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    fresnel = pow(fresnel, 2.5);

    // Water color: deep → shallow based on fresnel
    vec3 waterColor = mix(uDeepColor, uShallowColor, fresnel * 0.6 + 0.3);

    // Quantized time for stop-motion
    float qt = floor(uTime * 10.0) / 10.0;

    // Foam — procedural, near island approximation via angular distance
    float foamNoise = noise(vUv * 16.0 + qt * 0.3);
    foamNoise *= noise(vUv * 8.0 - qt * 0.15);
    float foam = smoothstep(uFoamThreshold, uFoamThreshold + 0.08, foamNoise);

    // Quantize foam to 2 steps (toon feel)
    foam = floor(foam * 2.0) / 2.0;

    vec3 finalColor = mix(waterColor, uFoamColor, foam * 0.6);

    // Rim highlight
    finalColor += vec3(0.15, 0.22, 0.28) * fresnel;

    gl_FragColor = vec4(finalColor, 0.92 - fresnel * 0.1);
  }
`;

export function createWaterMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uShallowColor: { value: new Color(0x6ec8d4) },
      uDeepColor: { value: new Color(0x2a7a8a) },
      uFoamColor: { value: new Color(0xe0f4f4) },
      uFoamThreshold: { value: 0.38 },
    },
    transparent: true,
    side: FrontSide,
  });
}

/* ================================================
   AURA MATERIAL (BackSide, additive)
   ================================================ */

const auraVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const auraFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform vec3 uColorCool;
  uniform vec3 uColorWarm;
  uniform float uWarmth;
  uniform float uOpacity;

  void main() {
    float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    rim = pow(rim, 3.0);

    vec3 auraColor = mix(uColorCool, uColorWarm, uWarmth);
    float alpha = rim * uOpacity * 0.7;

    gl_FragColor = vec4(auraColor, alpha);
  }
`;

export function createAuraMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: auraVertexShader,
    fragmentShader: auraFragmentShader,
    uniforms: {
      uColorCool: { value: new Color(0x6e8fab) },
      uColorWarm: { value: new Color(0xd4a06e) },
      uWarmth: { value: 0.3 },
      uOpacity: { value: 0.5 },
    },
    transparent: true,
    side: BackSide,
    blending: AdditiveBlending,
    depthWrite: false,
  });
}

/* ================================================
   ATMOSPHERE MATERIAL (grows during zoom)
   ================================================ */

const atmoVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmoFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    rim = pow(rim, 2.0);
    float alpha = rim * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function createAtmosphereMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: atmoVertexShader,
    fragmentShader: atmoFragmentShader,
    uniforms: {
      uColor: { value: new Color(0xfff8e7) },
      uOpacity: { value: 0.0 },
    },
    transparent: true,
    side: BackSide,
    depthWrite: false,
  });
}
