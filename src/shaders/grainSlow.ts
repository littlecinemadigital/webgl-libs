import {ortho} from './lib';

/**
 * Slowly changing grain with soft light blending and darkeness threshold
 * (grain appears more in darker areas)
 * requires time (seconds) and resolution passed in
 * ported from https://www.shadertoy.com/view/4t2fRz
 */
export const grainSlow = {
  name: 'GrainSlow',
  uniforms: {
    tDiffuse: { value: null },
    amount: { type: 'f', value: 0.33, min: 0, max: 1, step: 0.01, gui: true },
    threshold: { type: 'f', value: 0.56, min: 0.05, max: 1, step: 0.01, gui: true },
    speed: { type: 'f', value: 1, min: 0, max: 4, step: 0.01, gui: true },
    time: { value: 0 },
  },
  vertexShader: ortho,
  fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float time;
    uniform float threshold;
    uniform float speed;

    varying vec2 vUv;

    // What gray level noise should tend to.
    #define MEAN 0.0

    // Controls the contrast/variance of noise.
    #define VARIANCE 0.5


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

    float random2d(vec2 n) {
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float gaussian(float z, float u, float o) {
      return (1.0 / (o * sqrt(2.0 * 3.1415))) * exp(-(((z - u) * (z - u)) / (2.0 * (o * o))));
    }

    void main() {
      vec2 fc = gl_FragCoord.xy;

      vec3 inCol = texture2D(tDiffuse, vUv).rgb;

      float sTime = time * speed ;

      float seed = dot(vUv, vec2(12.9898, 78.233));
      float grain = fract(sin(seed) * 43758.5453 + sTime);
      grain = gaussian(grain, float(MEAN), float(VARIANCE) * float(VARIANCE));
      grain *= amount;

      //now blend the noise over top the backround
      //in our case soft-light looks pretty good
      vec3 color = blendSoftLight(inCol, vec3(grain));

      //and further reduce the noise strength based on some
      //threshold of the background luminance
      float luminance = luma(inCol);
      float response = smoothstep(0.05, threshold, luminance);
      color = mix(color, inCol, pow(response,2.0));

      gl_FragColor = vec4(color, 1.0);
    }`,
};
