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

async function createApp(): Promise<Application> {
  const app: Application = new Application();
  return app
    .init({ resizeTo: window, backgroundColor: 0x222222 })
    .then(() => app);
}

function createBirbScene(app: Application): Container {
  const birbScene: Container = new Container();
  birbScene.x = app.canvas.width / 2 - config.worldWidth / 2;
  birbScene.y = app.canvas.height / 2 - config.worldHeight / 2;
  setupCamera(app, birbScene);

  const worldBackground = new Graphics()
    .rect(0, 0, config.worldWidth, config.worldHeight)
    .fill("black");
  birbScene.addChild(worldBackground);

  return birbScene;
}

function createBirbContainer(): ParticleContainer {
  return new ParticleContainer({
    dynamicProperties: {
      position: true,
      scale: false,
      rotation: false,
      color: false,
    },
    boundsArea: new Rectangle(0, 0, config.worldWidth, config.worldHeight),
    cullArea: new Rectangle(0, 0, config.worldWidth, config.worldHeight),
  });
}

function createBirbs(birbTexture: Texture): Particle[] {
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
  return birbs;
}

function updateBirbs(birbs: Particle[], deltaTime: number): void {
  const distance: number = config.birbSpeed * deltaTime;
  const angleOffset: number = -Math.PI / 2;

  for (const birb of birbs) {
    const rotation: number = birb.rotation + angleOffset;

    const dx: number = distance * Math.cos(rotation);
    const dy: number = distance * Math.sin(rotation);

    let x: number = birb.x + dx;
    let y: number = birb.y + dy;

    if (x < 0) x += config.worldWidth;
    else if (x >= config.worldWidth) x -= config.worldWidth;

    if (y < 0) y += config.worldHeight;
    else if (y >= config.worldHeight) y -= config.worldHeight;

    birb.x = x;
    birb.y = y;
  }
}

async function init(): Promise<void> {
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const app: Application = await createApp();
  document.body.appendChild(app.canvas);

  const birbScene: Container = createBirbScene(app);
  app.stage.addChild(birbScene);

  const birbTexture: Texture = createBirbTexture(app.renderer);

  const birbs: Particle[] = createBirbs(birbTexture);

  const birbContainer = createBirbContainer();
  birbs.forEach((birb) => birbContainer.addParticle(birb));
  birbScene.addChild(birbContainer);

  app.ticker.add(({ deltaTime }) => {
    updateBirbs(birbs, deltaTime);
  });
}

init();
