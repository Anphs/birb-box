import { Application, Container, Point } from "pixi.js";

export function setupCamera(app: Application, birbContainer: Container): void {
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

      birbContainer.x += dx;
      birbContainer.y += dy;

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
    const scaleAmount: number = 1.1;
    const minScale: number = 0.1;
    const maxScale: number = 5;

    function clampScale(scale: number): number {
      return Math.max(minScale, Math.min(maxScale, scale));
    }

    const direction: number = e.deltaY > 0 ? 1 / scaleAmount : scaleAmount;

    const mousePos: Point = new Point(e.clientX, e.clientY);
    const localMousePos: Point = birbContainer.toLocal(mousePos);

    birbContainer.scale.x = clampScale(birbContainer.scale.x * direction);
    birbContainer.scale.y = clampScale(birbContainer.scale.y * direction);

    // Mouse position after the zoom
    const newLocalMousePos: Point = birbContainer.toLocal(mousePos);

    birbContainer.x +=
      (newLocalMousePos.x - localMousePos.x) * birbContainer.scale.x;
    birbContainer.y +=
      (newLocalMousePos.y - localMousePos.y) * birbContainer.scale.y;
  });
}
