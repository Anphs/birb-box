const params = new URLSearchParams(window.location.search);

const parseParam = {
  int: function (name: string, fallback: number): number {
    const intParam = parseInt(params.get(name) ?? "");
    return isNaN(intParam) ? fallback : intParam;
  },
  float: function (name: string, fallback: number): number {
    const floatParam = parseFloat(params.get(name) ?? "");
    return isNaN(floatParam) ? fallback : floatParam;
  },
};

/** Simulation behavior constants */
export const config = {
  /** Width of the simulation world (in pixels). */
  worldWidth: parseParam.int("worldWidth", 10240),

  /** Height of the simulation world (in pixels). */
  worldHeight: parseParam.int("worldHeight", 10240),

  /** Number of birbs to simulate. */
  birbCount: parseParam.int("birbCount", 1000),

  /** Speed at which birbs move (pixels per ms). */
  birbSpeed: parseParam.float("birbSpeed", 4),

  /** Maximum rate a birb can turn (radians per ms). */
  turnSpeed: parseParam.float("turnSpeed", 0.05),

  /** Radius where a birb perceives other birbs. */
  visualDistance: parseParam.int("visualDistance", 128),

  /** Radius where the separation rule applies. */
  minDistance: parseParam.int("minDistance", 64),

  /** Weight of the alignment rule (steering towards average heading). */
  alignmentFactor: parseParam.float("alignmentFactor", 0.5),

  /** Weight of the cohesion rule (steering towards group center). */
  cohesionFactor: parseParam.float("cohesionFactor", 0.1),

  /** Weight of the separation rule (avoiding crowding). */
  separationFactor: parseParam.float("separationFactor", 0.2),

  /** Simulation world color. */
  worldColor: 0x000000,

  /** Background world color */
  backgroundColor: 0x222222,

  /** Fill color to draw birbs. */
  birbColor: 0xffffff,

  /** Grid line colors. */
  gridColor: 0xffffff,
};

/** Camera behavior constants */
export const camera = {
  /** Zoom multipler for zooming in and out. */
  zoomFactor: parseParam.float("zoomFactor", 1.1),

  /** Minimum zoom level. */
  minZoom: parseParam.float("minZoom", 0.1),

  /** Maximum zoom level. */
  maxZoom: parseParam.float("maxZoom", 1),
};
