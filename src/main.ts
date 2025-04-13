import { Application, Container, Graphics } from "pixi.js";
import { setupCamera } from "./camera";

import "./style.css";

(async function () {
  const app: Application = new Application();

  await app.init({
    resizeTo: window,
  });

  document.body.appendChild(app.canvas);

  const birbContainer = new Container();
  app.stage.addChild(birbContainer);

  setupCamera(app, birbContainer);

  const rectangle = new Graphics()
    .rect(0, 0, 100, 150)
    .fill({
      color: 0xff0000,
    })
    .stroke({
      width: 8,
      color: 0x00ff00,
    });

  rectangle.scale.set(1, 1);
  rectangle.pivot.set(50, 75);
  rectangle.position.set(app.canvas.width / 2, app.canvas.height / 2);
  rectangle.rotation = Math.PI / 8;

  birbContainer.addChild(rectangle);
})();
