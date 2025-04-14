import {
  Application,
  Container,
  Graphics,
  Particle,
  ParticleContainer,
  Rectangle,
  Texture,
  TextureStyle,
} from "pixi.js";

import { config } from "./config";
import { setupCamera } from "./camera";
import { createBirbTexture } from "./birb";

import "./style.css";

async function init(): Promise<void> {
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const app: Application = new Application();
  await app.init({ resizeTo: window, backgroundColor: 0x222222 });
  document.body.appendChild(app.canvas);

  const birbScene = new Container();

  const worldBackground = new Graphics()
    .rect(0, 0, config.worldWidth, config.worldHeight)
    .fill("black");
  birbScene.addChild(worldBackground);
  setupCamera(app, birbScene);
  birbScene.x = app.canvas.width / 2 - config.worldWidth / 2;
  birbScene.y = app.canvas.height / 2 - config.worldHeight / 2;
  app.stage.addChild(birbScene);

  const birbContainer = new ParticleContainer({
    dynamicProperties: {
      position: true,
      scale: false,
      rotation: false,
      color: false,
    },
    boundsArea: new Rectangle(0, 0, config.worldWidth, config.worldHeight),
  });
  birbScene.addChild(birbContainer);

  const birbTexture: Texture = createBirbTexture(app.renderer);

  const birbs: Particle[] = [];

  for (let i = 0; i < config.maxBirbs; i++) {
    const birb = new Particle({
      texture: birbTexture,
      x: Math.random() * config.worldWidth,
      y: Math.random() * config.worldHeight,
      anchorX: 0.5,
      anchorY: 0.5,
      rotation: Math.random() * 2 * Math.PI,
    });
    birbs.push(birb);
  }
  birbContainer.addParticle(...birbs);

  app.ticker.add((delta) => {
    // console.log("Delta", delta);
    for (const birb of birbs) {
      const dx = Math.cos(birb.rotation - Math.PI / 2);
      const dy = Math.sin(birb.rotation - Math.PI / 2);

      birb.x = wrapCoord(birb.x + dx, config.worldWidth);
      birb.y = wrapCoord(birb.y + dy, config.worldHeight);
    }
  });
}

function wrapCoord(coord: number, bound: number): number {
  return ((coord % bound) + bound) % bound;
}

init();
