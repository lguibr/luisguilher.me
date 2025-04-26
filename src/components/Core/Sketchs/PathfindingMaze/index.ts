import type P5 from 'p5' // Use type import
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'

class Spot {
  p5: P5
  i: number
  j: number
  f = 0
  g = 0
  h = 0
  neighbors: Spot[] = []
  previous: Spot | undefined = undefined
  wall = false
  cols: number
  rows: number
  w: number // Add width/height for drawing
  h: number

  constructor(
    p5: P5,
    i: number,
    j: number,
    cols: number,
    rows: number,
    w: number,
    h: number
  ) {
    this.p5 = p5
    this.i = i
    this.j = j
    this.cols = cols
    this.rows = rows
    this.w = w
    this.h = h
  }

  show(color: string | P5.Color) {
    if (this.wall) {
      // Don't draw walls explicitly, let maze walls handle it
    } else if (color) {
      this.p5.fill(color)
      this.p5.noStroke()
      // Draw slightly smaller to not overlap maze lines
      this.p5.rect(
        this.i * this.w + 1,
        this.j * this.h + 1,
        this.w - 2,
        this.h - 2
      )
    }
  }

  addNeighbors(grid: Spot[][]) {
    this.neighbors = [] // Clear previous neighbors
    const i = this.i
    const j = this.j
    if (i < this.cols - 1) this.neighbors.push(grid[i + 1][j])
    if (i > 0) this.neighbors.push(grid[i - 1][j])
    if (j < this.rows - 1) this.neighbors.push(grid[i][j + 1])
    if (j > 0) this.neighbors.push(grid[i][j - 1])
  }
}

function heuristic(a: Spot, b: Spot): number {
  return a.p5.dist(a.i, a.j, b.i, b.j)
}

class Cell {
  p5: P5
  i: number
  j: number
  walls = [true, true, true, true]
  visited = false
  cols: number
  rows: number
  w: number

  constructor(
    p5: P5,
    i: number,
    j: number,
    cols: number,
    rows: number,
    w: number
  ) {
    this.p5 = p5
    this.i = i
    this.j = j
    this.cols = cols
    this.rows = rows
    this.w = w
  }

  checkNeighbors(grid: Cell[][]): Cell | undefined {
    const neighbors: Cell[] = []
    const top = grid[this.i]?.[this.j - 1]
    const right = grid[this.i + 1]?.[this.j]
    const bottom = grid[this.i]?.[this.j + 1]
    const left = grid[this.i - 1]?.[this.j]

    if (top && !top.visited) neighbors.push(top)
    if (right && !right.visited) neighbors.push(right)
    if (bottom && !bottom.visited) neighbors.push(bottom)
    if (left && !left.visited) neighbors.push(left)

    if (neighbors.length > 0) {
      const r = this.p5.floor(this.p5.random(0, neighbors.length))
      return neighbors[r]
    } else {
      return undefined
    }
  }

  highlight() {
    const x = this.i * this.w
    const y = this.j * this.w
    this.p5.noStroke()
    this.p5.fill(GOOGLE_YELLOW + '80')
    this.p5.rect(x, y, this.w, this.w)
  }

  show(wallColor: string | P5.Color) {
    const x = this.i * this.w
    const y = this.j * this.w
    this.p5.stroke(wallColor)
    this.p5.strokeWeight(1)

    if (this.walls[0]) this.p5.line(x, y, x + this.w, y) // Top
    if (this.walls[1]) this.p5.line(x + this.w, y, x + this.w, y + this.w) // Right
    if (this.walls[2]) this.p5.line(x + this.w, y + this.w, x, y + this.w) // Bottom
    if (this.walls[3]) this.p5.line(x, y + this.w, x, y) // Left
  }
}

function removeWalls(a: Cell, b: Cell) {
  const x = a.i - b.i
  if (x === 1) {
    a.walls[3] = false // a's left wall removed
    b.walls[1] = false // b's right wall removed
  } else if (x === -1) {
    a.walls[1] = false // a's right wall removed
    b.walls[3] = false // b's left wall removed
  }
  const y = a.j - b.j
  if (y === 1) {
    a.walls[0] = false // a's top wall removed
    b.walls[2] = false // b's bottom wall removed
  } else if (y === -1) {
    a.walls[2] = false // a's bottom wall removed
    b.walls[0] = false // b's top wall removed
  }
}

const sketch =
  (appTheme: Theme) =>
  (p5: P5): void => {
    const cols = 25
    const rows = 25
    let grid: Spot[][] = []
    let mazeGrid: Cell[][] = []

    let openSet: Spot[] = []
    let closedSet: Spot[] = []
    let start: Spot
    let end: Spot
    let w: number, h: number
    let path: Spot[] = []
    let generatingMaze = true
    let currentMazeCell: Cell | undefined
    const mazeStack: Cell[] = []
    let aStarRunning = false // Flag to control A* execution

    function setupMaze() {
      mazeGrid = new Array(cols)
      for (let i = 0; i < cols; i++) {
        mazeGrid[i] = new Array(rows)
      }
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          mazeGrid[i][j] = new Cell(p5, i, j, cols, rows, w)
        }
      }
      currentMazeCell = mazeGrid[0][0]
      currentMazeCell.visited = true
      mazeStack.push(currentMazeCell)
      generatingMaze = true
      aStarRunning = false // Reset A* flag
      path = [] // Clear previous path
      openSet = []
      closedSet = []
    }

    function generateMazeStep() {
      if (!currentMazeCell) return

      currentMazeCell.visited = true
      const next = currentMazeCell.checkNeighbors(mazeGrid)
      if (next) {
        next.visited = true
        mazeStack.push(currentMazeCell)
        removeWalls(currentMazeCell, next)
        currentMazeCell = next
      } else if (mazeStack.length > 0) {
        currentMazeCell = mazeStack.pop()
      } else {
        generatingMaze = false
        console.log('Maze generated!')
        initializeAStar()
      }
    }

    function initializeAStar() {
      grid = new Array(cols)
      for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows)
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Pass w and h to Spot constructor
          grid[i][j] = new Spot(p5, i, j, cols, rows, w, h)
        }
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j].addNeighbors(grid)
        }
      }

      start = grid[0][0]
      end = grid[cols - 1][rows - 1]
      start.wall = false
      end.wall = false

      openSet = []
      closedSet = []
      path = []
      openSet.push(start)
      aStarRunning = true // Start A*
    }

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      w = p5.width / cols
      h = p5.height / rows
      setupMaze()
    }

    function runAStarStep() {
      if (!aStarRunning || openSet.length === 0) {
        if (openSet.length === 0 && aStarRunning) {
          console.log('No solution')
          aStarRunning = false // Stop trying if no solution
        }
        return // Stop if not running or no nodes left
      }

      let winner = 0
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i
        }
      }
      const current = openSet[winner]

      if (current === end) {
        path = []
        let temp: Spot | undefined = current
        while (temp) {
          // Reconstruct path correctly
          path.push(temp)
          temp = temp.previous
        }
        console.log('DONE!')
        aStarRunning = false // Stop A* once path is found
        return // Path found, stop processing A* for this frame
      }

      openSet.splice(winner, 1)
      closedSet.push(current)

      const neighbors = current.neighbors
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i]

        if (!closedSet.includes(neighbor)) {
          // Check only closedSet
          const cellCurrent = mazeGrid[current.i][current.j]
          // Removed unused cellNeighbor variable
          let wallBetween = false
          const x = current.i - neighbor.i
          const y = current.j - neighbor.j

          if (x === 1 && cellCurrent.walls[3]) wallBetween = true
          else if (x === -1 && cellCurrent.walls[1]) wallBetween = true
          else if (y === 1 && cellCurrent.walls[0]) wallBetween = true
          else if (y === -1 && cellCurrent.walls[2]) wallBetween = true

          if (wallBetween) continue

          const tempG = current.g + heuristic(neighbor, current)

          let newPath = false
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG
              newPath = true
            }
          } else {
            neighbor.g = tempG
            newPath = true
            openSet.push(neighbor)
          }

          if (newPath) {
            neighbor.h = heuristic(neighbor, end)
            neighbor.f = neighbor.g + neighbor.h
            neighbor.previous = current
          }
        }
      }
    }

    p5.draw = () => {
      p5.clear() // Use clear() for transparency

      // Draw maze grid first
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          mazeGrid[i][j].show(appTheme.colors.subString + '80') // Subtle maze walls
        }
      }

      if (generatingMaze) {
        currentMazeCell?.highlight()
        generateMazeStep()
      } else {
        // Run A* step
        runAStarStep()

        // Draw A* sets
        for (let i = 0; i < closedSet.length; i++) {
          closedSet[i].show(GOOGLE_RED + '50')
        }
        for (let i = 0; i < openSet.length; i++) {
          openSet[i].show(GOOGLE_GREEN + '50')
        }

        // Draw the path
        p5.noFill()
        p5.stroke(GOOGLE_BLUE)
        p5.strokeWeight(w / 3) // Thinner path
        p5.beginShape()
        // Draw path from start to end
        for (let i = path.length - 1; i >= 0; i--) {
          p5.vertex(path[i].i * w + w / 2, path[i].j * h + h / 2)
        }
        p5.endShape()

        // Draw start and end points distinctly on top
        start?.show(GOOGLE_GREEN)
        end?.show(GOOGLE_RED)
      }
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      w = p5.width / cols
      h = p5.height / rows
      setupMaze() // Reinitialize everything
    }
  }

export default sketch
