import {ortho, noise3d, pnoise3d} from './lib';

/**
 * WIP -  has banding
 *
 * higher quality, more expensive grain using 3d noise
 * port of https://github.com/mattdesl/glsl-film-grain
 *
 * requires time (seconds) and resolution passed in
 *
 */
export const grainExp = {
  name: 'GrainExp',
  uniforms: {
    tDiffuse: { value: null },
    amount: { type: 'f', value: 0.15, min: 0, max: 1, step: 0.01, gui: true },
    scale: { type: 'f', value: 0.15, min: 0.1, max: 1, step: 0.01, gui: true },
    threshold: { type: 'f', value: 0.5, min: 0.05, max: 1, step: 0.01, gui: true },
    speed: { type: 'f', value: 0.5, min: 0, max: 1, step: 0.01, gui: true },
    time: { value: 0 },
  },
  vertexShader: ortho,
  fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float time;
    uniform float scale;
    uniform float threshold;
    uniform float speed;

    varying vec2 vUv;

    ${noise3d}
    ${pnoise3d}

    vec3 blendSoftLight(vec3 base, vec3 blend) {
      return mix(
          sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
          2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
          step(base, vec3(0.5))
        );
    }

    float luma(vec3 color) {
        return dot(color, vec3(0.299, 0.587, 0.114));
    }

    void main() {
      vec2 fc = gl_FragCoord.xy;

      vec3 inCol = texture2D(tDiffuse, vUv).rgb;

      float sTime = floor(time * speed * 6.0 * 24.0);
      float grain = noise3d(vec3(fc * scale, sTime))/ 2.0 + 0.5;

      grain *= amount;

      //now blend the noise over top the backround
      //in our case soft-light looks pretty good
      vec3 color = blendSoftLight(inCol, vec3(grain));

      //and further reduce the noise strength based on some
      //threshold of the background luminance
      float luminance = luma(inCol);
      float response = smoothstep(0.05, threshold, luminance);
      color = mix(color, inCol, pow(response,2.0));

      color = vec3(grain);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};
