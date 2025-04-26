// src/components/Core/Sketchs/GameOfLife/index.ts
import type P5 from 'p5' // Use type import
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_COLORS_STR = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]

const sketch =
  (appTheme: Theme) =>
  (p5: P5): void => {
    let w: number // Width of cell
    let columns: number
    let rows: number
    let board: number[][]
    let next: number[][]
    // let generation = 0; // Variable is assigned but never used - removing
    let googleColors: P5.Color[] = [] // Store p5.Color objects
    let colorIndex = 0
    let lerpAmount = 0
    const colorChangeSpeed = 0.01 // Controls how fast colors transition per generation

    function initBoard(): void {
      board = new Array(columns)
      for (let i = 0; i < columns; i++) {
        board[i] = new Array(rows)
      }
      next = new Array(columns)
      for (let i = 0; i < columns; i++) {
        next[i] = new Array(rows)
      }
      // Initialize board with random 0s and 1s
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          // Make edges dead zones (optional, but simplifies neighbor check)
          // if (i === 0 || j === 0 || i === columns - 1 || j === rows - 1) {
          //   board[i][j] = 0;
          // } else {
          board[i][j] = p5.floor(p5.random(2))
          // }
          next[i][j] = 0
        }
      }
      // generation = 0; // Variable is assigned but never used - removing
      colorIndex = 0 // Reset color index
      lerpAmount = 0 // Reset lerp amount
    }

    p5.setup = (): void => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      googleColors = GOOGLE_COLORS_STR.map(c => p5.color(c)) // Convert hex to p5.Color
      w = 10 // Cell size
      // Calculate columns and rows based on canvas size and cell size
      columns = p5.floor(p5.width / w)
      rows = p5.floor(p5.height / w)
      initBoard()
      p5.frameRate(10) // Control simulation speed
    }

    p5.draw = (): void => {
      p5.clear() // Use clear() for transparency
      generate() // Calculate next generation

      // --- Color Transition Logic ---
      lerpAmount += colorChangeSpeed
      if (lerpAmount >= 1.0) {
        lerpAmount = 0
        colorIndex = (colorIndex + 1) % googleColors.length
      }
      const currentColorIndex = colorIndex
      const nextColorIndex = (colorIndex + 1) % googleColors.length
      const currentCellColor = p5.lerpColor(
        googleColors[currentColorIndex],
        googleColors[nextColorIndex],
        lerpAmount
      )
      // --- End Color Transition Logic ---

      // Draw the board
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (board[i][j] === 1) {
            p5.fill(currentCellColor) // Use the smoothly transitioning color
          } else {
            p5.noFill() // Make dead cells transparent
          }
          // Subtle stroke for grid lines
          p5.stroke(appTheme.colors.sideHighlight + '30') // Use theme color for grid
          p5.strokeWeight(0.5)
          p5.rect(i * w, j * w, w, w) // Draw full cell size
        }
      }
    }

    // Calculate the next generation state
    function generate(): void {
      // Loop through every spot in our 2D array
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          // Count all live neighbors for the current cell
          let neighbors = 0
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              // Use modulo to wrap around edges
              const col = (x + i + columns) % columns
              const row = (y + j + rows) % rows
              neighbors += board[col][row]
            }
          }

          // Subtract the current cell's state since we counted it in the loop
          neighbors -= board[x][y]

          // Apply Conway's rules
          // Loneliness
          if (board[x][y] === 1 && neighbors < 2) {
            next[x][y] = 0
            // Overpopulation
          } else if (board[x][y] === 1 && neighbors > 3) {
            next[x][y] = 0
            // Reproduction
          } else if (board[x][y] === 0 && neighbors === 3) {
            next[x][y] = 1
            // Stasis
          } else {
            next[x][y] = board[x][y]
          }
        }
      }

      // Swap the boards
      const temp = board
      board = next
      next = temp
      // generation++; // Variable is assigned but never used - removing
    }

    p5.windowResized = (): void => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      // Recalculate grid size and reinitialize
      columns = p5.floor(p5.width / w)
      rows = p5.floor(p5.height / w)
      initBoard()
    }
  }

export default sketch
