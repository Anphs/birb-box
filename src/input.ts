export class InputHandler {
  /** The state of the world. */
  private paused: boolean = false;

  constructor() {
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "p") {
        this.paused = !this.paused;
      }
    });
  }

  isPaused(): boolean {
    return this.paused;
  }
}
