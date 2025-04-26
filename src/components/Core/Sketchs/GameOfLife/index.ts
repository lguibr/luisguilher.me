import type P5 from 'p5' // Use type import
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

const GOOGLE_BLUE = '#4285F4'
const GOOGLE_RED = '#DB4437'
const GOOGLE_YELLOW = '#F4B400'
const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_COLORS = [GOOGLE_BLUE, GOOGLE_RED, GOOGLE_YELLOW, GOOGLE_GREEN]

const sketch =
  (appTheme: Theme) =>
  (p5: P5): void => {
    let w: number // Width of cell
    let columns: number
    let rows: number
    let board: number[][]
    let next: number[][]
    let generation = 0
    const cellColorMap: { [key: number]: string } = {}

    function initBoard() {
      board = new Array(columns)
      for (let i = 0; i < columns; i++) {
        board[i] = new Array(rows)
      }
      next = new Array(columns)
      for (let i = 0; i < columns; i++) {
        next[i] = new Array(rows)
      }
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (i === 0 || j === 0 || i === columns - 1 || j === rows - 1) {
            board[i][j] = 0
          } else {
            board[i][j] = p5.floor(p5.random(2))
          }
          next[i][j] = 0
        }
      }
      generation = 0
      cellColorMap[0] = p5.random(GOOGLE_COLORS)
    }

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      w = 10
      columns = p5.floor(p5.width / w)
      rows = p5.floor(p5.height / w)
      initBoard()
      p5.frameRate(10)
    }

    p5.draw = () => {
      p5.clear() // Use clear() for transparency
      generate()
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (board[i][j] === 1) {
            const colorIndex = generation % GOOGLE_COLORS.length
            p5.fill(GOOGLE_COLORS[colorIndex])
          } else {
            p5.noFill() // Make dead cells transparent
          }
          p5.stroke(appTheme.colors.sideHighlight + '30')
          p5.rect(i * w, j * w, w - 1, w - 1)
        }
      }
    }

    function generate() {
      for (let x = 1; x < columns - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
          let neighbors = 0
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              neighbors += board[x + i][y + j]
            }
          }
          neighbors -= board[x][y]

          if (board[x][y] === 1 && neighbors < 2) {
            next[x][y] = 0
          } else if (board[x][y] === 1 && neighbors > 3) {
            next[x][y] = 0
          } else if (board[x][y] === 0 && neighbors === 3) {
            next[x][y] = 1
          } else {
            next[x][y] = board[x][y]
          }
        }
      }

      const temp = board
      board = next
      next = temp
      generation++
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      columns = p5.floor(p5.width / w)
      rows = p5.floor(p5.height / w)
      initBoard()
    }
  }

export default sketch
