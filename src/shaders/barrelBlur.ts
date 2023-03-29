import {ortho} from './lib';

/**
 * Invertible Barrel Blur Chroma Distortion
 *
 * ported from https://www.shadertoy.com/view/td2XDz
 *
 * @author felixturner / http://airtight.cc/
 */
export const barrelBlur = {
  name: 'Barrel Blur',
  uniforms: {
    tDiffuse: { type: 't', value: null },
    amount: {
      type: 'f',
      name: 'amount',
      value: 0.5,
      min: 0,
      max: 3,
      step: 0.01,
      randRange: 'low',
      gui: true,
    },
    invert: { type: 'b', name: 'invert', value: false, gui: true },
    time: { type: 'f', value: 0.0 },
    resolution: { type: 'v2', value: [800.0, 600] },
  },
  vertexShader: ortho,
  fragmentShader: `
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float time;
    uniform vec2 resolution;
    uniform bool invert;

    varying vec2 vUv;

    ////////////////////////////////////////////

    #define barrel
    float amountZoom = .5;

    vec2 remap( vec2 t, vec2 a, vec2 b ) {
        return clamp( (t - a) / (b - a), 0.0, 1.0 );
    }

    vec3 spectrum_offset_rgb(float t) {
        float t0 = 3.0 * t - 1.5;
        vec3 ret = clamp( vec3( -t0, 1.0-abs(t0), t0), 0.0, 1.0);
        return ret;
    }

    vec2 barrelDistortion(vec2 p, vec2 amt) {
      p = 2.0 * p - 1.0;
      const float maxBarrelPower = 5.0;
      float theta  = atan(p.y, p.x);
      vec2 radius = vec2( length(p) );
      radius = pow(radius, 1.0 + maxBarrelPower * amt);
      p.x = radius.x * cos(theta);
      p.y = radius.y * sin(theta);

      return p * 0.5 + 0.5;
    }

    vec2 brownConradyDistortion(vec2 uv, float dist) {
      uv = uv * 2.0 - 1.0;
      float barrelDistortion1 = 0.1 * dist; // K1 in text books
      float barrelDistortion2 = -0.025 * dist; // K2 in text books

      float r2 = dot(uv,uv);
      uv *= 1.0 + barrelDistortion1 * r2 + barrelDistortion2 * r2 * r2;

      return uv * 0.5 + 0.5;
    }

    vec2 distort(vec2 uv, float t, vec2 min_distort, vec2 max_distort) {
      vec2 dist = mix(min_distort, max_distort, t);

      if(invert) {
        return barrelDistortion(uv,1.75*dist);
      } else {
        return brownConradyDistortion(uv, 75.0 * dist.x);
      }
    }

    float nrand(vec2 n) {
      return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
    }

    vec4 render(vec2 uv) {
      return texture2D( tDiffuse, uv );
    }

    void main() {
      vec2 uv = vUv;

      const float MAX_DIST_PX = 50.0;
      float max_distort_px = MAX_DIST_PX * amount;
      vec2 max_distort = vec2(max_distort_px) / resolution;
      vec2 min_distort = 0.5 * max_distort;

      vec2 oversiz = distort( vec2(1.0), 1.0, min_distort, max_distort );
      uv = mix(uv,remap( uv, 1.0-oversiz, oversiz ),amountZoom);

      const int num_iter = 7;
      const float stepsiz = 1.0 / (float(num_iter)-1.0);
      float rnd = nrand( uv + fract(time) );
      float t = rnd*stepsiz;

      vec4 sumcol = vec4(0.0);
      vec3 sumw = vec3(0.0);
      for (int i = 0; i < num_iter; ++i) {
        vec3 w = spectrum_offset_rgb(t);
        sumw += w;
        vec2 uvd = distort(uv, t, min_distort, max_distort);
        vec4 col = render(uvd);
        col.rgb *= w;
        sumcol += col;
        t += stepsiz;
      }

      sumcol.rgb /= sumw;
      sumcol += rnd/255.0;

      gl_FragColor = sumcol;
    }
  `,
};
