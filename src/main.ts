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
  TextureStyle.defaultOptions.scaleMode = "nearest";
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
      rotation: true,
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
  // Use squared distances for comparison
  const visualDistSq = config.visualDistance ** 2;
  const minDistSq = config.minDistance ** 2;

  // Turn rate limit
  const maxTurn = config.turnSpeed * deltaTime;

  // Distance each birb will travel in this frame
  const distance: number = config.birbSpeed * deltaTime;

  for (let i = 0; i < birbs.length; i++) {
    const birb: Particle = birbs[i];

    let avgVX = 0;
    let avgVY = 0;
    let centerX = 0;
    let centerY = 0;
    let avoidX = 0;
    let avoidY = 0;
    let neighborCount = 0;

    for (let j = 0; j < birbs.length; j++) {
      if (i === j) continue;

      const other = birbs[j];
      const dx = other.x - birb.x;
      const dy = other.y - birb.y;
      const distSq = dx ** 2 + dy ** 2;

      if (distSq < visualDistSq) {
        neighborCount++;

        // Alignment
        avgVX += Math.cos(other.rotation);
        avgVY += Math.sin(other.rotation);

        // Cohesion
        centerX += other.x;
        centerY += other.y;

        // Separation
        if (distSq < minDistSq) {
          avoidX -= dx;
          avoidY -= dy;
        }
      }
    }

    if (neighborCount > 0) {
      // Alignment
      avgVX /= neighborCount;
      avgVY /= neighborCount;

      // Cohesion
      centerX /= neighborCount;
      centerY /= neighborCount;

      const targetVX =
        config.alignmentFactor * avgVX +
        config.cohesionFactor * (centerX - birb.x) +
        config.separationFactor * avoidX;
      const targetVY =
        config.alignmentFactor * avgVY +
        config.cohesionFactor * (centerY - birb.y) +
        config.separationFactor * avoidY;

      // Angle from the target vector
      const targetRotation = Math.atan2(targetVY, targetVX);

      // Smallest angle difference (wraps from -PI to PI)
      let angleDiff = targetRotation - birb.rotation;
      angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

      // Turn rate limit
      angleDiff = Math.max(-maxTurn, Math.min(maxTurn, angleDiff));

      birb.rotation += angleDiff;
    }

    const dx: number = distance * Math.cos(birb.rotation);
    const dy: number = distance * Math.sin(birb.rotation);

    birb.x += dx;
    birb.y += dy;

    if (birb.x < 0) birb.x += config.worldWidth;
    else if (birb.x >= config.worldWidth) birb.x -= config.worldWidth;

    if (birb.y < 0) birb.y += config.worldHeight;
    else if (birb.y >= config.worldHeight) birb.y -= config.worldHeight;
  }
}

async function init(): Promise<void> {
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
