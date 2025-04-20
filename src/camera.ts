import { Application, Container, Point } from "pixi.js";

import { camera as config } from "./config";
import { Birb } from "./birb";

interface CameraHandlerOptions {
  /** Application to attach the camera to. */
  application: Application;
  /** Container to apply camera transformations to. */
  container: Container;
}

export class CameraHandler {
  private dragging = false;
  private lastMouse: { x: number; y: number } | null = null;
  private followBirb: Birb | null = null;

  private app: Application;
  private container: Container;

  constructor({ application: app, container }: CameraHandlerOptions) {
    this.app = app;
    this.container = container;
    this.attachMouseEvents();
  }

  follow(birb: Birb | null): void {
    this.followBirb = birb;
  }

  update(): void {
    if (this.followBirb) {
      const scale = this.container.scale.x;
      const centerX = this.app.canvas.width / 2;
      const centerY = this.app.canvas.height / 2;

      this.container.x = centerX - this.followBirb.x * scale;
      this.container.y = centerY - this.followBirb.y * scale;
    }
  }

  private attachMouseEvents(): void {
    this.app.canvas.addEventListener("mousedown", (e: MouseEvent) => {
      this.dragging = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
      this.follow(null);
    });

    this.app.canvas.addEventListener("mousemove", (e: MouseEvent) => {
      if (this.dragging && this.lastMouse) {
        const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;

        this.container.x += dx;
        this.container.y += dy;

        this.lastMouse = { x: e.clientX, y: e.clientY };
      }
    });

    this.app.canvas.addEventListener("mouseup", () => {
      this.dragging = false;
    });

    this.app.canvas.addEventListener("mouseleave", () => {
      this.dragging = false;
    });

    this.app.canvas.addEventListener("wheel", (e: WheelEvent) => {
      function clampScale(scale: number): number {
        return Math.max(config.minZoom, Math.min(config.maxZoom, scale));
      }

      const direction: number =
        e.deltaY > 0 ? 1 / config.zoomFactor : config.zoomFactor;

      const mousePos: Point = new Point(e.clientX, e.clientY);
      const localMousePos: Point = this.container.toLocal(mousePos);

      this.container.scale.x = clampScale(this.container.scale.x * direction);
      this.container.scale.y = clampScale(this.container.scale.y * direction);

      // Mouse position after the zoom
      const newLocalMousePos: Point = this.container.toLocal(mousePos);

      this.container.x +=
        (newLocalMousePos.x - localMousePos.x) * this.container.scale.x;
      this.container.y +=
        (newLocalMousePos.y - localMousePos.y) * this.container.scale.y;
    });
  }
}
