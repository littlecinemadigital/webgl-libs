import {ortho} from './lib';

/**
 * black grain
 */
export const Grain = {
  name: 'Grain',
  uniforms: {
    tDiffuse: { value: null },
    amount: { type: 'f', value: 0.15, min: 0, max: 0.2, step: 0.01, gui: true },
    time: { value: 0 },
  },
  vertexShader: ortho,
  fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float time;

    varying vec2 vUv;

    float random2d(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    void main() {
      float t = mod(time, 9999.99);

      vec2 fc = gl_FragCoord.xy;

      vec4 color = texture2D(tDiffuse, vUv);
      float darkness = random2d(fc + t) * amount;
      color.rgb -= darkness;
      gl_FragColor = color;
    }
  `,
};
