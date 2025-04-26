// src/components/Core/Sketchs/PathfindingMaze/index.ts
import type P5 from 'p5'
import type { Theme } from 'src/styles/styled'
import { Cell } from './Cell'
import { Spot } from './Spot'
import { stepCarveMaze, drawCarvingHead } from './discovery'
import { stepFinding, drawSearchProgress, drawSearchingHead } from './finding'
import { drawFoundPath, reconstructPath } from './found'

// --- Constants ---
const GOOGLE_COLORS = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58']
const TARGET_CELLS_ON_SHORTER_AXIS = 15
const PADDING = 1
const FRAME_RATE = 30
const CARVING_STEPS_PER_FRAME = 3
const SEARCH_STEPS_PER_FRAME = 2
const COLOR_CHANGE_SPEED = 0.01
const VISITED_ALPHA = 40
const WALL_WEIGHT_FACTOR = 0.1
const WALL_ALPHA = 200

// --- Sketch Factory ---
const sketch =
  (theme: Theme) =>
  (p5: P5): void => {
    // --- State Variables ---
    let cols: number
    let rows: number
    let cellSize: number
    let mazeGrid: Cell[][]
    let currentCarvingCell: Cell | undefined
    const carvingStack: Cell[] = []
    let spotGrid: Spot[][]
    let openSet: Spot[]
    let closedSet: Spot[]
    let startSpot: Spot
    let endSpot: Spot
    let currentSearchingSpot: Spot | undefined
    let path: Spot[] = []
    let isCarvingMaze = true
    let isSearchingPath = false
    let isFinished = false
    let googleP5Colors: P5.Color[] = []
    let wallColor: P5.Color // Ensure this is P5.Color
    // let discoveryColor: P5.Color; // Still unused
    let smoothColor: P5.Color
    let colorIndex = 0
    let lerpAmount = 0

    // --- Initialization ---
    function initialize(): void {
      const availableWidth = p5.windowWidth
      const availableHeight = p5.windowHeight
      cellSize = p5.floor(
        p5.min(availableWidth, availableHeight) / TARGET_CELLS_ON_SHORTER_AXIS
      )
      cellSize = p5.max(1, cellSize)
      cols = p5.floor(availableWidth / cellSize)
      rows = p5.floor(availableHeight / cellSize)
      cols = p5.max(1, cols)
      rows = p5.max(1, rows)
      isCarvingMaze = true
      isSearchingPath = false
      isFinished = false
      path = []
      carvingStack.length = 0
      mazeGrid = Array.from({ length: cols }, (_, i) =>
        Array.from(
          { length: rows },
          (_, j) => new Cell(p5, i, j, cellSize, PADDING)
        )
      )
      currentCarvingCell = mazeGrid[0][0]
      currentCarvingCell.visited = true
      carvingStack.push(currentCarvingCell)
      spotGrid = []
      openSet = []
      closedSet = []
      currentSearchingSpot = undefined
      googleP5Colors = GOOGLE_COLORS.map(c => p5.color(c))
      wallColor = p5.color(theme.colors.text) // Create P5.Color object
      wallColor.setAlpha(WALL_ALPHA)
      // discoveryColor = p5.color(theme.colors.editorBackground); // Still unused
      // discoveryColor.setAlpha(200); // Still unused
      colorIndex = 0
      lerpAmount = 0
      smoothColor =
        googleP5Colors.length > 0 ? googleP5Colors[colorIndex] : p5.color(255)
      console.log(`Maze Initialized: ${cols}x${rows}, Cell Size: ${cellSize}`)
    }

    // --- Pathfinding Setup ---
    function initializePathfinding(): void {
      console.log('Initializing Pathfinding...')
      spotGrid = Array.from({ length: cols }, (_, i) =>
        Array.from(
          { length: rows },
          (_, j) => new Spot(p5, i, j, cellSize, PADDING)
        )
      )
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          spotGrid[i][j].addNeighbors(spotGrid, mazeGrid)
        }
      }
      startSpot = spotGrid[0][0]
      endSpot = spotGrid[cols - 1][rows - 1]
      startSpot.isWall = false
      endSpot.isWall = false
      openSet = [startSpot]
      closedSet = []
      isSearchingPath = true
      console.log('Pathfinding Initialized.')
    }

    // --- P5 Lifecycle Functions ---
    p5.setup = (): void => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      p5.frameRate(FRAME_RATE)
      initialize()
    }

    p5.draw = (): void => {
      p5.clear()
      let offsetX = 0
      let offsetY = 0
      if (cols > 0 && rows > 0 && cellSize > 0) {
        const totalGridWidth = cols * cellSize
        const totalGridHeight = rows * cellSize
        offsetX = (p5.width - totalGridWidth) / 2
        offsetY = (p5.height - totalGridHeight) / 2
      }
      p5.translate(offsetX, offsetY)

      try {
        lerpAmount += COLOR_CHANGE_SPEED
        if (lerpAmount >= 1.0) {
          lerpAmount = 0
          colorIndex = (colorIndex + 1) % googleP5Colors.length
        }
        const currentColorIndex = colorIndex
        const nextColorIndex = (colorIndex + 1) % googleP5Colors.length
        if (googleP5Colors.length > 0) {
          smoothColor = p5.lerpColor(
            googleP5Colors[currentColorIndex],
            googleP5Colors[nextColorIndex],
            lerpAmount
          )
        } else {
          smoothColor = p5.color(255)
        }
      } catch (e) {
        console.error('Error during color calculation:', e)
        smoothColor = p5.color(255, 0, 0)
      }

      if (mazeGrid && wallColor) {
        p5.strokeCap(p5.ROUND)
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            if (mazeGrid[i]?.[j]) {
              mazeGrid[i][j].drawBorders(wallColor, WALL_WEIGHT_FACTOR) // Pass P5.Color
            }
          }
        }
      }

      if (isCarvingMaze) {
        let carvingDone = false
        for (let i = 0; i < CARVING_STEPS_PER_FRAME && !carvingDone; i++) {
          currentCarvingCell = carvingStack[carvingStack.length - 1]
          if (!currentCarvingCell) {
            carvingDone = true
            break
          }
          carvingDone = stepCarveMaze(
            currentCarvingCell,
            mazeGrid,
            carvingStack
          )
        }
        currentCarvingCell = carvingStack[carvingStack.length - 1]
        if (currentCarvingCell && smoothColor) {
          drawCarvingHead(
            p5,
            currentCarvingCell,
            smoothColor,
            cellSize,
            PADDING
          )
        }
        if (carvingDone) {
          isCarvingMaze = false
          initializePathfinding()
        }
      } else if (isSearchingPath) {
        let searchResult: 'searching' | 'found' | 'stuck' = 'searching'
        let lastProcessedSpot: Spot | undefined
        for (
          let i = 0;
          i < SEARCH_STEPS_PER_FRAME && searchResult === 'searching';
          i++
        ) {
          const stepResult = stepFinding(openSet, closedSet, endSpot)
          searchResult = stepResult.status
          lastProcessedSpot = stepResult.processedNode
          if (searchResult !== 'searching') break
        }
        if (lastProcessedSpot) {
          currentSearchingSpot = lastProcessedSpot
        }
        p5.push()
        p5.blendMode(p5.ADD)
        if (googleP5Colors.length > 0) {
          // Corrected call: Removed openSet argument
          drawSearchProgress(p5, closedSet, googleP5Colors, VISITED_ALPHA)
        }
        p5.blendMode(p5.BLEND)
        p5.pop()
        if (currentSearchingSpot && smoothColor) {
          drawSearchingHead(
            p5,
            currentSearchingSpot,
            smoothColor,
            cellSize,
            PADDING
          )
        }
        if (searchResult === 'found') {
          console.log('Path Found!')
          isSearchingPath = false
          isFinished = true
          const finalNode = closedSet[closedSet.length - 1]
          path = finalNode ? reconstructPath(finalNode) : []
        } else if (searchResult === 'stuck') {
          console.log('No Solution Found!')
          isSearchingPath = false
          isFinished = true
          path = []
        }
      } else if (isFinished) {
        if (googleP5Colors.length > 0) {
          // Corrected call: Removed openSet argument
          drawSearchProgress(p5, closedSet, googleP5Colors, VISITED_ALPHA)
          drawFoundPath(p5, path, googleP5Colors, cellSize)
        }
      }
    }

    p5.windowResized = (): void => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      initialize()
    }
  }

export default sketch
