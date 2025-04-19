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
  /** The state of the world. */
  private paused: boolean = false;

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
        case "g":
          this.toggleGridLines();
          break;
        case "f":
          this.onFollow();
          break;
        case "0":
          this.onStatistics(0);
          break;
        case "1":
          this.onStatistics(1);
          break;
        case "2":
          this.onStatistics(2);
          break;
        case "3":
          this.onStatistics(-1);
          break;
      }
    });
  }

  private togglePause(): void {
    this.paused = !this.paused;
  }

  private toggleGridLines(): void {
    this.gridLines.visible = !this.gridLines.visible;
  }

  isPaused(): boolean {
    return this.paused;
  }
}
