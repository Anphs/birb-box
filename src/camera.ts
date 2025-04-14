import { Application, Container, Point } from "pixi.js";

import { camera as config } from "./config";

export function setupCamera(app: Application, container: Container): void {
  let dragging: boolean = false;
  let lastMouse: { x: number; y: number } | null = null;

  app.canvas.addEventListener("mousedown", (e: MouseEvent) => {
    dragging = true;
    lastMouse = { x: e.clientX, y: e.clientY };
  });

  app.canvas.addEventListener("mousemove", (e: MouseEvent) => {
    if (dragging && lastMouse) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;

      container.x += dx;
      container.y += dy;

      lastMouse = { x: e.clientX, y: e.clientY };
    }
  });

  app.canvas.addEventListener("mouseup", () => {
    dragging = false;
  });

  app.canvas.addEventListener("mouseleave", () => {
    dragging = false;
  });

  app.canvas.addEventListener("wheel", (e: WheelEvent) => {
    function clampScale(scale: number): number {
      return Math.max(config.minScale, Math.min(config.maxScale, scale));
    }

    const direction: number =
      e.deltaY > 0 ? 1 / config.scaleAmount : config.scaleAmount;

    const mousePos: Point = new Point(e.clientX, e.clientY);
    const localMousePos: Point = container.toLocal(mousePos);

    container.scale.x = clampScale(container.scale.x * direction);
    container.scale.y = clampScale(container.scale.y * direction);

    // Mouse position after the zoom
    const newLocalMousePos: Point = container.toLocal(mousePos);

    container.x += (newLocalMousePos.x - localMousePos.x) * container.scale.x;
    container.y += (newLocalMousePos.y - localMousePos.y) * container.scale.y;
  });
}
