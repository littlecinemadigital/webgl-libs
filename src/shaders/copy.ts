import {ortho} from './lib';

/**
 * copier
 */
export const copy = {
  name: 'Copy',
  uniforms: {
    tDiffuse: { value: null },
  },
  vertexShader: ortho,
  fragmentShader: `
    precision highp float;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;

    void main() {
      gl_FragColor = texture2D( tDiffuse, vUv );
    }
  `,
};
