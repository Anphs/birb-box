import "./style.css";

import { Application } from "pixi.js";

(async () => {
  const app: Application = new Application();

  await app.init({
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);
})();
