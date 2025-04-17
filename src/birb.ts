import { Graphics, Particle, Renderer, Texture } from "pixi.js";

export class Birb extends Particle {
  /** The ID of this birb. */
  id: number;
  /** The previous rotation. */
  cachedRotation: number;
  /** The previous cos of the previous rotation. */
  cachedCos: number;
  /** The previous sin of the previous rotation. */
  cachedSin: number;
  /** The potential neighbors of a birb. */
  potentialNeighbors: Birb[];

  constructor(id: number, ...args: ConstructorParameters<typeof Particle>) {
    super(...args);

    this.id = id;
    this.cachedRotation = this.rotation;
    this.cachedCos = Math.cos(this.rotation);
    this.cachedSin = Math.sin(this.rotation);
    this.potentialNeighbors = [];
  }

  clearPotentialNeighbors(): void {
    this.potentialNeighbors.length = 0;
  }
}

export function createBirbTexture(renderer: Renderer): Texture {
  const birb = new Graphics();

  birb.moveTo(8, 0);
  birb.lineTo(-8, -8);
  birb.lineTo(-4, 0);
  birb.lineTo(-8, 8);
  birb.closePath();

  birb.fill({ color: 0xffffff });

  return renderer.generateTexture(birb);
}
