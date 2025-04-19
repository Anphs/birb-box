import { Container } from "pixi.js";

export class InputHandler {
  /** The state of the world. */
  private paused: boolean = false;

  constructor(
    /** The lines outlining each grid cell. */
    private gridLines: Container,
    /** The callback to execute follow a birb. */
    private onFollow: () => void
  ) {
    this.gridLines = gridLines;

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
