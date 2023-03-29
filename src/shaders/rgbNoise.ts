import {ortho} from './lib';

/**
 * RGB Noise Shader
 * Add randomn rgb pixels on top
 * @author felixturner / http://airtight.cc/
 */
export const rgbNoise = {
  name: 'RGBNoise',
  uniforms: {
    tDiffuse: { value: null },
    amount: { type: 'f', value: 0.15, min: 0, max: 1, step: 0.01, gui: true },
    time: { value: 0 },
  },
  vertexShader: ortho,
  fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float speed;
    uniform float time;

    varying vec2 vUv;

    float random2d(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    void main() {
      float t = mod(time, 9999.99);
      vec2 fc = gl_FragCoord.xy;
      vec4 color = texture2D(tDiffuse, vUv);
      float r = random2d(fc + t + 100.) - 0.5;
      float g = random2d(fc + t + 200.) - 0.5;
      float b = random2d(fc + t + 300.) - 0.5;
      color += vec4(r,g,b,0.) * amount;
      gl_FragColor = color;
    }`,
};
