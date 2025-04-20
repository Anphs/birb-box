import { Container } from "pixi.js";

interface InputHandlerOptions {
  /** The lines outlining each grid cell. */
  gridLines: Container;
  /** The callback to execute follow a birb. */
  onFollow: () => void;
  /** The callback to change statistic panels. */
  onStatistics: (id: number) => void;
}

export class InputHandler {
  /** The pause state of the world. */
  private paused: boolean = false;
  /** Whether uniform grid spatial subdivision is used. */
  private gridOptimization: boolean = true;

  private gridLines: Container;
  private onFollow: () => void;
  private onStatistics: (id: number) => void;

  constructor({ gridLines, onFollow, onStatistics }: InputHandlerOptions) {
    this.gridLines = gridLines;
    this.onFollow = onFollow;
    this.onStatistics = onStatistics;

    window.addEventListener("keydown", (e) => {
      switch (e.key.toLowerCase()) {
        case "p":
          this.togglePause();
          break;
        case "o":
          this.toggleGridOptimization();
          break;
        case "g":
          this.toggleGridLines();
          break;
        case "f":
          this.onFollow();
          break;
        case "0":
          this.onStatistics(-1);
          break;
        case "1":
          this.onStatistics(0);
          break;
        case "2":
          this.onStatistics(1);
          break;
        case "3":
          this.onStatistics(2);
          break;
      }
    });
  }

  private togglePause(): void {
    this.paused = !this.paused;
  }

  private toggleGridOptimization(): void {
    this.gridOptimization = !this.gridOptimization;
  }

  private toggleGridLines(): void {
    this.gridLines.visible = !this.gridLines.visible;
  }

  isPaused(): boolean {
    return this.paused;
  }

  useGrid(): boolean {
    return this.gridOptimization;
  }
}
