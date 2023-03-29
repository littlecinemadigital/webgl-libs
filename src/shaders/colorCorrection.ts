import {ortho} from './lib';

/**
 * @author tapio / http://tapio.github.com/
 *
 * Brightness and contrast adjustment
 * https://github.com/evanw/glfx.js
 * brightness: -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
 * contrast: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 * saturation: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */
export const colorCorrection = {
  name: 'Color Correction',
  uniforms: {
    tDiffuse: { value: null },
    brightness: {
      name: 'brightness',
      type: 'f',
      value: 0.0,
      min: -0.5,
      max: 0.5,
      step: 0.01,
      gui: true,
      randRange: 'none',
    },
    contrast: {
      name: 'contrast',
      type: 'f',
      value: 0,
      min: -1,
      max: 0.9,
      step: 0.01,
      randRange: 'low',
      gui: true,
    },
    saturation: {
      name: 'saturation',
      type: 'f',
      value: 0,
      min: -1,
      max: 1,
      step: 0.01,
      gui: true,
    },
  },
  vertexShader: ortho,
  fragmentShader: `
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform float brightness;
    uniform float contrast;
    uniform float saturation;

    varying vec2 vUv;

    void main() {
      gl_FragColor = texture2D( tDiffuse, vUv );

      gl_FragColor.rgb += brightness;

      gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - contrast) + 0.5;

      // saturation
      float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
      if (saturation > 0.0) {
        gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));
      } else {
        gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-saturation);
      }
    }
  `,
};
