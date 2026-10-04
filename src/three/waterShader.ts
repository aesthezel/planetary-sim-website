import { AdditiveBlending, BackSide, Color, FrontSide, ShaderMaterial, Vector4 } from 'three';

const waterVertexShader = /* glsl */ `
  varying vec3 vLocalPosition;
  varying vec3 vNormalView;
  varying vec3 vViewDir;
  uniform float uTime;

  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash31(i), hash31(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
  }

  void main() {
    float t = floor(uTime * 12.0) / 12.0;
    vec3 radial = normalize(position);
    float a = noise3(position * 10.0 + vec3(0.0, t * 0.52, 0.0));
    float b = noise3(position * 27.0 - vec3(t * 0.4, 0.0, t * 0.31));
    float wave = (floor((a * 0.7 + b * 0.3) * 4.0 + 0.5) / 4.0 - 0.5) * 0.04;
    vec3 displaced = position + radial * wave;
    vLocalPosition = displaced;
    vNormalView = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const waterFragmentShader = /* glsl */ `
  varying vec3 vLocalPosition;
  varying vec3 vNormalView;
  varying vec3 vViewDir;
  uniform float uTime;
  uniform vec4 uIslands[8];
  uniform float uIslandCount;

  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = mix(hash31(i), hash31(i + vec3(1.0,0.0,0.0)), f.x);
    float b = mix(hash31(i + vec3(0.0,1.0,0.0)), hash31(i + vec3(1.0,1.0,0.0)), f.x);
    float c = mix(hash31(i + vec3(0.0,0.0,1.0)), hash31(i + vec3(1.0,0.0,1.0)), f.x);
    float d = mix(hash31(i + vec3(0.0,1.0,1.0)), hash31(i + vec3(1.0,1.0,1.0)), f.x);
    return mix(mix(a,b,f.y),mix(c,d,f.y),f.z);
  }

  void shoreline(vec3 radial, vec4 island, float enabled, float breakup, inout float coast, inout float foam) {
    if (enabled < 0.5) return;
    float angle = acos(clamp(dot(radial, normalize(island.xyz)), -1.0, 1.0));
    coast = min(coast, max(angle - island.w, 0.0));
    float shore = 1.0 - smoothstep(island.w + 0.012, island.w + 0.095, angle);
    float band = floor(clamp(shore * (0.66 + breakup * 0.42), 0.0, 1.0) * 3.0 + 0.5) / 3.0;
    foam = max(foam, band);
  }

  void main() {
    float t = floor(uTime * 12.0) / 12.0;
    vec3 radial = normalize(vLocalPosition);
    float coast = 1.0;
    float foam = 0.0;
    float breakup = noise3(vLocalPosition * 8.0 + vec3(t * 0.5, 0.0, t * 0.3));
    shoreline(radial, uIslands[0], step(0.5, uIslandCount), breakup, coast, foam);
    shoreline(radial, uIslands[1], step(1.5, uIslandCount), breakup, coast, foam);
    shoreline(radial, uIslands[2], step(2.5, uIslandCount), breakup, coast, foam);
    shoreline(radial, uIslands[3], step(3.5, uIslandCount), breakup, coast, foam);
    shoreline(radial, uIslands[4], step(4.5, uIslandCount), breakup, coast, foam);
    shoreline(radial, uIslands[5], step(5.5, uIslandCount), breakup, coast, foam);
    shoreline(radial, uIslands[6], step(6.5, uIslandCount), breakup, coast, foam);
    shoreline(radial, uIslands[7], step(7.5, uIslandCount), breakup, coast, foam);

    float shallow = 1.0 - smoothstep(0.10, 0.75, coast);
    float basinNoise = noise3(radial * 3.2);
    float basinBands = floor(basinNoise * 3.0 + 0.5) / 3.0;
    float basin = mix(basinNoise, basinBands, 0.28);
    float clayNoise = noise3(vLocalPosition * 2.0 + vec3(0.0, t * 0.25, 0.0));
    float claySteps = floor(clayNoise * 4.0 + 0.5) / 4.0;
    float clay = mix(clayNoise, claySteps, 0.32);
    vec3 deep = mix(vec3(0.045, 0.19, 0.39), vec3(0.09, 0.32, 0.58), basin);
    vec3 edge = vec3(0.18, 0.47, 0.58);
    vec3 water = mix(deep, edge, shallow);

    float ndl = max(dot(normalize(vNormalView), normalize(vec3(-0.35, 0.72, 0.6))), 0.0);
    float toon = floor((0.45 + ndl * 0.55) * 5.0 + 0.5) / 5.0;
    water *= mix(0.72, 1.06, toon);
    water *= mix(0.96, 1.035, clay);

    float fresnel = pow(1.0 - max(dot(normalize(vNormalView), normalize(vViewDir)), 0.0), 2.0);
    float rippleNoise = noise3(vLocalPosition * 10.0 + vec3(t * 0.17, 0.0, 0.0));
    float ripple = step(0.76, fract(coast * 15.0 - t * 0.17)) * exp(-coast * 4.0) * 0.16;
    water = mix(water, vec3(0.75, 0.94, 1.0), fresnel * 0.28 + ripple + rippleNoise * 0.025);
    water = mix(water, vec3(0.81, 0.84, 0.78), foam * 0.9);
    gl_FragColor = vec4(water, 0.96);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createWaterMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uIslandCount: { value: 0 },
      uIslands: { value: Array.from({ length: 8 }, () => new Vector4(0, 1, 0, 0.12)) },
    },
    transparent: true,
    depthWrite: false,
    side: FrontSide,
  });
}

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
    float rim = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
    vec3 color = mix(uColorCool, uColorWarm, uWarmth);
    gl_FragColor = vec4(color, rim * uOpacity * 0.7);
  }
`;

export function createAuraMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: auraVertexShader,
    fragmentShader: auraFragmentShader,
    uniforms: {
      uColorCool: { value: new Color(0x78a9dc) },
      uColorWarm: { value: new Color(0xd4a06e) },
      uWarmth: { value: 0.25 },
      uOpacity: { value: 0.55 },
    },
    transparent: true,
    side: BackSide,
    blending: AdditiveBlending,
    depthWrite: false,
  });
}

const atmosphereVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmosphereFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    float rim = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.0);
    gl_FragColor = vec4(uColor, rim * uOpacity);
  }
`;

export function createAtmosphereMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms: {
      uColor: { value: new Color(0x9bd9f6) },
      uOpacity: { value: 0.08 },
    },
    transparent: true,
    side: BackSide,
    depthWrite: false,
  });
}
