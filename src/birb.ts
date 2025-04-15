import { Graphics, Renderer, Texture } from "pixi.js";

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
