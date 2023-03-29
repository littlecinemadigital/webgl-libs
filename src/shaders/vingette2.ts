import {ortho} from './lib';

/**
  squircle vignette
 */
export const vinette2 = {
  name: 'Vignette2',
  uniforms: {
    tDiffuse: { value: null },
    feather: {
      type: 'f',
      value: 0.5,
      name: 'feather',
      min: 0.01,
      max: 1,
      step: 0.01,
      gui: true,
    },
    roundness: {
      type: 'f',
      value: 0.5,
      name: 'roundness',
      min: 0,
      max: 1,
      step: 0.01,
      gui: true,
    },
    inset: {
      type: 'f',
      value: 0.5,
      name: 'inset',
      min: 0,
      max: 1,
      step: 0.01,
      gui: true,
    },
    brightness: {
      type: 'f',
      value: 0.0,
      name: 'brightness',
      min: 0,
      max: 1,
      step: 0.01,
      gui: true,
      randRange: 'none',
    },
  },
  vertexShader: ortho,
  fragmentShader: `
    precision highp float;

    uniform float feather;
    uniform float roundness;
    uniform float brightness;
    uniform float inset;
    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    float sdRoundBox( in vec2 p, in vec2 b, float r ){
      vec2 q = abs(p)-b+r;
      return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
    }

    void main() {
      vec4 texel = texture2D( tDiffuse, vUv );

      float size = 0.5 - feather/2. - inset * 0.2;
      float d = sdRoundBox( vUv - vec2(0.5), vec2(size),size * roundness );
      float vig = smoothstep(0.,feather,d);
      gl_FragColor = vec4( mix( texel.rgb, vec3( brightness ), vig ), texel.a );
    }
  `,
};
