import * as THREE from 'three';
import { IUniform } from 'three';

/**
 * Minimal custom ShaderPass based off of thespite's wagner
 *
 * WARNING:
 *   this will capture the renderer if not called with render(true) at some point
 *   to fix call this in render loop
 *   renderer.setRenderTarget(null);
*/
export class ShaderPass {
  renderer: THREE.WebGLRenderer;
  shader: THREE.ShaderMaterialParameters;
  name: string | undefined;
  shaderMat: THREE.ShaderMaterial;
  orthoScene: THREE.Scene;
  fbo: THREE.WebGLRenderTarget;
  orthoCamera: THREE.OrthographicCamera;
  orthoQuad: THREE.Mesh;
  usesTime: boolean| undefined;
  usesResolution: boolean | undefined;
  uniforms: {[uniform: string]: IUniform} | undefined;
  texture: THREE.Texture;

  constructor(renderer: THREE.WebGLRenderer, shader: THREE.ShaderMaterialParameters, width = 1024, height = 1024, format: THREE.PixelFormat, {
    type,
    minFilter,
    magFilter,
    wrapS,
    wrapT,
  }: ShaderPassConfig) {
    this.renderer = renderer;
    this.shader = shader;
    this.name = shader.name;
    this.shaderMat = new THREE.RawShaderMaterial(shader);

    this.orthoScene = new THREE.Scene();
    this.fbo = new THREE.WebGLRenderTarget(width, height, {
      wrapS: wrapS || THREE.ClampToEdgeWrapping,
      wrapT: wrapT || THREE.ClampToEdgeWrapping,
      minFilter: minFilter || THREE.LinearFilter,
      magFilter: magFilter || THREE.LinearFilter,
      format: format || THREE.RGBAFormat,
      type: type || THREE.UnsignedByteType,
      stencilBuffer: false,
      depthBuffer: false,
    });
    this.orthoCamera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.00001, 1000);
    this.orthoQuad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.shaderMat);
    this.orthoQuad.scale.set(width, height, 1);
    this.orthoScene.add(this.orthoQuad);

    //convenience
    this.texture = this.fbo.texture;
    this.uniforms = this.shader.uniforms;

    if (this.uniforms) {
      this.usesTime = 'time' in this.uniforms;
      this.usesResolution = 'resolution' in this.uniforms;
    }
  }

  render(final = false, renderFBO = this.fbo) {
    this.renderer.setRenderTarget(final ? null : renderFBO);
    this.renderer.render(this.orthoScene, this.orthoCamera);
  }

  setSize(width: number, height: number) {
    this.fbo.setSize(width, height);
    this.orthoQuad.scale.set(width, height, 1);
    this.orthoCamera.left = -width / 2;
    this.orthoCamera.right = width / 2;
    this.orthoCamera.top = height / 2;
    this.orthoCamera.bottom = -height / 2;
    this.orthoCamera.updateProjectionMatrix();
  }
}

type ShaderPassConfig = {
  type?: THREE.TextureDataType;
  minFilter?: THREE.TextureFilter;
  magFilter?: THREE.TextureFilter;
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
}
