declare module "three/webgpu" {
  export class Vector3 {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class QuadraticBezierCurve3 {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Scene {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Color {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class PerspectiveCamera {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class AmbientLight {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class DirectionalLight {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class MeshStandardMaterial {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class MeshBasicMaterial {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class LineBasicMaterial {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Mesh {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class SphereGeometry {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class CanvasTexture {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Group {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Sprite {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class SpriteMaterial {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Line {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class BufferGeometry {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class BufferAttribute {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class PointsMaterial {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Points {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Plane {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Raycaster {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Vector2 {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class PostProcessing {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class Clock {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export class WebGPURenderer {
    [key: string]: any;
    constructor(...args: any[]);
  }

  export const BackSide: any;
  export const ACESFilmicToneMapping: any;
  export const EquirectangularReflectionMapping: any;
  export const LinearFilter: any;
}

declare module "three/tsl" {
  export const pass: any;
  export const mrt: any;
  export const output: any;
  export const emissive: any;
}

declare module "three/addons/controls/OrbitControls.js" {
  export class OrbitControls {
    [key: string]: any;
    constructor(...args: any[]);
  }
}

declare module "three/addons/loaders/RGBELoader.js" {
  export class RGBELoader {
    [key: string]: any;
    load(
      url: string,
      onLoad?: (texture: any) => void,
      onProgress?: ((event: ProgressEvent<EventTarget>) => void) | undefined,
      onError?: (() => void) | undefined,
    ): any;
  }
}

declare module "three/addons/tsl/display/BloomNode.js" {
  export const bloom: any;
}
