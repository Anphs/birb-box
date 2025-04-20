# Birb Box

A high-performance boid (birb) simulation built with [PixiJS](https://pixijs.com/). Simulates flocking behavior of up to 100,000 birbs using particle containers and uniform grid bucketing.

## About Boids Algorithm

This project simulates flocking behavior using **Boids**, a classic algorithm developed by Craig Reynolds in 1986 to model the movement of birds, fish, or other swarming entities.

Each boid follows three simple rules:

1. **Alignment** – Steer toward the average heading of nearby boids.
2. **Cohesion** – Move toward the average position of nearby boids.
3. **Separation** – Avoid crowding nearby boids.

Despite their simplicity, these rules produce complex and lifelike group behavior.

## Features

- Responsive and performant rendering via [PixiJS](https://pixijs.com/).
- ParticleContainer rendering for efficient batched drawing.
- Uniform grid bucketing for spatial partitioning.
- Grid visualization toggle.
- Camera panning, zooming, and birb-follow mode.
- Statistics panels: FPS, Render Time, Memory Usage.
- Runtime configuration via URL query parameters.

## Getting Started

### Prerequisites

- Node.js (version 18+)
- npm

### Installation

```bash
npm install
```

### Running the Project

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Configuration

You can configure `config.ts` to adjust simulation constants for world size, birb behavior (speed, turn rate, perception distance), and flocking dynamics (alignment, cohesion, separation). Camera controls such as zoom scaling and limits are also configurable.

Additionally, these parameters can be overridden at runtime using URL query parameters. This makes it easy to experiment with different simulation setups directly from the browser.

### Available Query Parameters

| Parameter          | Description                                                     | Default Value |
| ------------------ | --------------------------------------------------------------- | ------------- |
| `worldWidth`       | Width of the simulation world (in pixels)                       | `10240`       |
| `worldHeight`      | Height of the simulation world (in pixels)                      | `10240`       |
| `birbCount`        | Number of birbs to simulate                                     | `1000`        |
| `birbSpeed`        | Speed of birbs in pixels per millisecond                        | `4`           |
| `turnSpeed`        | Maximum rotation speed in radians per millisecond               | `0.05`        |
| `visualDistance`   | Radius within which birbs detect other birbs                    | `128`         |
| `minDistance`      | Radius where the separation rule applies                        | `64`          |
| `alignmentFactor`  | Weight of the alignment rule (steering towards average heading) | `0.5`         |
| `cohesionFactor`   | Weight of the cohesion rule (steering towards group center)     | `0.1`         |
| `separationFactor` | Weight of the separation rule (avoiding crowding)               | `0.2`         |
| `zoomFactor`       | Zoom multipler for zooming in and out                           | `1.1`         |
| `minZoom`          | Minimum zoom level                                              | `0.1`         |
| `maxZoom`          | Maximum zoom level                                              | `1`           |

You can apply these parameters in the URL like so:

```
?birbCount=100000&worldWidth=102400&worldHeight=102400
```

---

## Controls

| Key             | Action                     |
| --------------- | -------------------------- |
| `P`             | Toggle pause/resume        |
| `G`             | Toggle visual grid overlay |
| `O`             | Toggle grid optimization   |
| `F`             | Follow a random birb       |
| `0`/`1`/`2`/`3` | Switch stat panels         |
| Mouse Drag      | Pan camera                 |
| Mouse Wheel     | Zoom camera                |

---

## Project Structure

```
src/
├── birb.ts # Birb class and texture generation
├── camera.ts # Camera pan/zoom/follow functionality
├── config.ts # Simulation constants
├── grid.ts # Uniform grid bucketing logic
├── input.ts # Keyboard input handling
├── main.ts # Entry point
└── style.css # Styling
```

---

## License

This project is licensed under the [MIT License](https://opensource.org/license/MIT).
