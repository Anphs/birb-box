import {
  Application,
  Container,
  Graphics,
  ParticleContainer,
  Rectangle,
  Texture,
  TextureStyle,
} from "pixi.js";
import { Stats } from "pixi-stats";

import "./style.css";

import { config } from "./config";

import { Birb, createBirbTexture } from "./birb";
import { Grid } from "./grid";

import { InputHandler } from "./input";
import { CameraHandler } from "./camera";

async function createApp(): Promise<Application> {
  TextureStyle.defaultOptions.scaleMode = "nearest";
  const app: Application = new Application();
  return app
    .init({ resizeTo: window, backgroundColor: config.backgroundColor })
    .then(() => app);
}

function createBirbScene(app: Application): Container {
  const birbScene: Container = new Container();
  birbScene.x = app.canvas.width / 2 - config.worldWidth / 2;
  birbScene.y = app.canvas.height / 2 - config.worldHeight / 2;

  const worldBackground = new Graphics()
    .rect(0, 0, config.worldWidth, config.worldHeight)
    .fill(config.worldColor);
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
  });
}

function createBirbs(birbTexture: Texture): Birb[] {
  const birbs: Birb[] = [];
  for (let i = 0; i < config.birbCount; i++) {
    const birb = new Birb(i, {
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

function createGrid(): Grid {
  return new Grid(config.visualDistance, config.worldWidth, config.worldHeight);
}

function updateBirbs(
  grid: Grid,
  birbs: Birb[],
  deltaTime: number,
  useGrid: boolean
): void {
  // Use squared distances for comparison
  const visualDistSq = config.visualDistance * config.visualDistance;
  const minDistSq = config.minDistance * config.minDistance;

  // Turn rate limit
  const maxTurn = config.turnSpeed * deltaTime;

  // Update sin and cos cache
  for (let i = 0; i < birbs.length; i++) {
    const birb: Birb = birbs[i];

    if (birb.rotation !== birb.cachedRotation) {
      birb.cachedCos = Math.cos(birb.rotation);
      birb.cachedSin = Math.sin(birb.rotation);
      birb.cachedRotation = birb.rotation;
    }
  }

  // Distance each birb will travel in this frame
  const distance: number = config.birbSpeed * deltaTime;

  for (let i = 0; i < birbs.length; i++) {
    const birb: Birb = birbs[i];

    let avgVX = 0;
    let avgVY = 0;
    let centerX = 0;
    let centerY = 0;
    let avoidX = 0;
    let avoidY = 0;
    let neighborCount = 0;

    // Update birb's potential neighbors using the grid
    if (useGrid) grid.updatePotentialNeighbors(birb);

    const nearbyCount = useGrid ? birb.potentialNeighborCount : birbs.length;

    for (let j = 0; j < nearbyCount; j++) {
      const other = useGrid ? birbs[birb.potentialNeighbors[j]] : birbs[j];
      if (birb.id === other.id) continue;

      const dx = other.x - birb.x;
      const dy = other.y - birb.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < visualDistSq) {
        neighborCount++;

        // Alignment
        avgVX += other.cachedCos;
        avgVY += other.cachedSin;

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

    // Wrap on the x-axis
    if (birb.x < 0) birb.x += config.worldWidth;
    else if (birb.x >= config.worldWidth) birb.x -= config.worldWidth;

    // Wrap on the y-axis
    if (birb.y < 0) birb.y += config.worldHeight;
    else if (birb.y >= config.worldHeight) birb.y -= config.worldHeight;

    // Update grid
    if (useGrid) grid.update(birb);
  }
}

function createGridLines(grid: Grid): Graphics {
  const gridGraphics = new Graphics();
  const cellSize = grid.getCellSize();

  for (let x = 0; x <= grid.getCols(); x++) {
    const posX = x * cellSize;
    gridGraphics.moveTo(posX, 0).lineTo(posX, config.worldHeight);
  }

  for (let y = 0; y <= grid.getRows(); y++) {
    const posY = y * cellSize;
    gridGraphics.moveTo(0, posY).lineTo(config.worldWidth, posY);
  }

  gridGraphics.stroke({ color: config.gridColor, pixelLine: true, alpha: 0.2 });
  gridGraphics.visible = false;

  return gridGraphics;
}

async function init(): Promise<void> {
  const app: Application = await createApp();
  document.body.appendChild(app.canvas);

  const birbScene: Container = createBirbScene(app);
  app.stage.addChild(birbScene);

  const grid: Grid = createGrid();
  const gridLines = createGridLines(grid);
  birbScene.addChild(gridLines);

  const birbTexture: Texture = createBirbTexture(
    app.renderer,
    config.birbColor
  );

  const birbContainer = createBirbContainer();
  birbScene.addChild(birbContainer);

  const birbs: Birb[] = createBirbs(birbTexture);
  for (const birb of birbs) {
    birbContainer.addParticle(birb);
    grid.insert(birb);
  }

  const stats = new Stats(app.renderer);
  stats.showPanel(-1);
  function changeStatsPanel(id: number): void {
    stats.showPanel(id);
  }

  const camera: CameraHandler = new CameraHandler({
    application: app,
    container: birbScene,
  });

  function followRandomBirb() {
    const randomIndex = Math.floor(Math.random() * birbs.length);
    camera.follow(birbs[randomIndex]);
  }

  const input = new InputHandler({
    gridLines: gridLines,
    onFollow: followRandomBirb,
    onStatistics: changeStatsPanel,
  });

  app.ticker.add(({ deltaTime }) => {
    if (input.isPaused()) return;

    updateBirbs(grid, birbs, deltaTime, input.useGrid());
    camera.update();
  });
}

init();
