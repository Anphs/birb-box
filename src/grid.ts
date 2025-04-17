import { Birb } from "./birb";

interface GridCell {
  id: number;
  birbs: Birb[];
}

export class Grid {
  /** The 2D array of grid cells. */
  private cells: GridCell[][];
  /** The height and width of each individual grid cell. */
  private cellSize: number;
  /** The width of the entire grid. */
  private gridWidth: number;
  /** The height of the entire grid. */
  private gridHeight: number;
  /** The number of rows in the grid. */
  private rows: number;
  /** The number of columns in the grid. */
  private cols: number;
  /** The cell offsets for cells containing potential neighbors. */
  private neighborOffsets: { dx: number; dy: number }[];

  constructor(cellSize: number, gridWidth: number, gridHeight: number) {
    this.cellSize = cellSize;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.rows = Math.ceil(this.gridWidth / this.cellSize);
    this.cols = Math.ceil(this.gridHeight / this.cellSize);
    this.cells = this.createEmptyGrid();
    this.neighborOffsets = [
      { dx: -1, dy: -1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
    ];
  }

  private createEmptyGrid(): GridCell[][] {
    const grid: GridCell[][] = [];
    for (let y = 0; y < this.rows; y++) {
      grid[y] = [];
      for (let x = 0; x < this.cols; x++) {
        grid[y][x] = { id: y * this.cols + x, birbs: [] };
      }
    }
    return grid;
  }

  /** Returns cell coordinates given grid coordinates. */
  getCellCoordinates(x: number, y: number): { cellX: number; cellY: number } {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return { cellX, cellY };
  }

  /** Inserts a birb into a corresponding grid cell based upon location. */
  insert(birb: Birb): void {
    const { cellX, cellY } = this.getCellCoordinates(birb.x, birb.y);
    this.cells[cellY][cellX].birbs.push(birb);

    birb.cachedCellX = cellX;
    birb.cachedCellY = cellY;
  }

  /** Removes a birb from it's previous containing grid cell. */
  remove(birb: Birb): void {
    const cell = this.cells[birb.cachedCellY][birb.cachedCellX];
    const index = cell.birbs.indexOf(birb);
    cell.birbs.splice(index, 1);
  }

  /** Updates a birb's grid cell if it crossed into a new one. */
  update(birb: Birb): void {
    const cellX = Math.floor(birb.x / this.cellSize);
    const cellY = Math.floor(birb.y / this.cellSize);
    if (cellX !== birb.cachedCellX || cellY !== birb.cachedCellY) {
      const cell = this.cells[birb.cachedCellY][birb.cachedCellX];
      const index = cell.birbs.indexOf(birb);
      cell.birbs.splice(index, 1);

      this.cells[cellY][cellX].birbs.push(birb);

      birb.cachedCellX = cellX;
      birb.cachedCellY = cellY;
    }
  }

  /** Updates a birb's potential neighbors */
  updatePotentialNeighbors(birb: Birb): void {
    const cols = this.cols;
    const rows = this.rows;

    birb.potentialNeighborCount = 0;

    for (const { dx, dy } of this.neighborOffsets) {
      let cellX = birb.cachedCellX + dx;
      let cellY = birb.cachedCellY + dy;

      if (cellX < 0) cellX += cols;
      else if (cellX >= cols) cellX -= cols;

      if (cellY < 0) cellY += rows;
      else if (cellY >= rows) cellY -= rows;

      const cellBirbs = this.cells[cellY][cellX].birbs;
      for (let i = 0; i < cellBirbs.length; i++) {
        birb.potentialNeighbors[birb.potentialNeighborCount++] = cellBirbs[i];
      }
    }
  }
}
