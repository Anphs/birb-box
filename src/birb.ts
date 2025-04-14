import { Graphics, Renderer, Texture } from "pixi.js";

export function createBirbTexture(renderer: Renderer): Texture {
  const birb = new Graphics();

  birb.moveTo(0, -8);
  birb.lineTo(8, 8);
  birb.lineTo(0, 4);
  birb.lineTo(-8, 8);
  birb.closePath();

  birb.fill({ color: 0xffffff });

  return renderer.generateTexture(birb);
}
