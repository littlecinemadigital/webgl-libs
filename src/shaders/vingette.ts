import {ortho} from './lib';

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Vignette shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 */
export const vignette = {
	name: 'Vignette',
	uniforms: {
		tDiffuse: { value: null },
		offset: { type: 'f', value: 1, min: 0, max: 2, step: 0.01, gui: true },
		darkness: { type: 'f', value: 1, min: 0, max: 2, step: 0.01, gui: true },
	},
	vertexShader: ortho,
	fragmentShader: `
    precision highp float;
    uniform float offset;
    uniform float darkness;

    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    void main() {

      // Eskil's vignette
      vec4 texel = texture2D( tDiffuse, vUv );
      vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );
      gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );
    }
  `,
};
