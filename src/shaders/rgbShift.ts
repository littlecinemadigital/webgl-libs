import {ortho} from './lib';

/**
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * amount: shift distance (1 is width of input)
 * angle: shift angle in radians
 * @author felixturner / http://airtight.cc/
 */
export const rgbShift = {
	name: 'RGBShift',
	uniforms: {
		tDiffuse: { type: 't' },
		amount: { type: 'f', value: 0.0025, min: 0, max: 0.006, step: 0.001, gui: true },
		angle: { type: 'f', value: 0.0, min: 0, max: Math.PI * 2, step: 0.1, gui: true },
	},
	vertexShader: ortho,
	fragmentShader: `
		precision highp float;

		uniform sampler2D tDiffuse;
		uniform float amount;
		uniform float angle;

		varying vec2 vUv;

		void main() {

			vec2 offset = amount * vec2( cos(angle), sin(angle));
			float r = texture2D(tDiffuse, vUv + offset).r;
			float g = texture2D(tDiffuse, vUv).g;
			float b = texture2D(tDiffuse, vUv - offset).b;
			gl_FragColor = vec4(r, g, b, 1.0);

		}
  `,
};
