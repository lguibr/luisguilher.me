import type P5 from 'p5' // Use type import
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

const GOOGLE_GREEN = '#0F9D58'
const GOOGLE_YELLOW = '#F4B400'

interface Cell {
  a: number
  b: number
}

const sketch =
  (appTheme: Theme) =>
  (p5: P5): void => {
    let grid: Cell[][]
    let next: Cell[][]
    const dA = 1.0
    const dB = 0.5
    const feed = 0.055
    const k = 0.062
    const dt = 1.0

    function initGrid() {
      const w = p5.width
      const h = p5.height
      grid = new Array(w)
      for (let i = 0; i < w; i++) {
        grid[i] = new Array(h)
      }
      next = new Array(w)
      for (let i = 0; i < w; i++) {
        next[i] = new Array(h)
      }

      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          grid[x][y] = { a: 1, b: 0 }
          next[x][y] = { a: 1, b: 0 }
        }
      }

      const centerSize = 10
      const startX = p5.floor(w / 2 - centerSize / 2)
      const startY = p5.floor(h / 2 - centerSize / 2)
      for (let i = startX; i < startX + centerSize; i++) {
        for (let j = startY; j < startY + centerSize; j++) {
          if (i >= 0 && i < w && j >= 0 && j < h) {
            grid[i][j].b = 1
          }
        }
      }
    }

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      p5.pixelDensity(1)
      initGrid()
    }

    function laplaceA(x: number, y: number): number {
      let sumA = 0
      sumA += grid[x][y].a * -1
      sumA += (grid[x - 1]?.[y]?.a ?? grid[x][y].a) * 0.2 // Edge handling: use center value
      sumA += (grid[x + 1]?.[y]?.a ?? grid[x][y].a) * 0.2
      sumA += (grid[x]?.[y + 1]?.a ?? grid[x][y].a) * 0.2
      sumA += (grid[x]?.[y - 1]?.a ?? grid[x][y].a) * 0.2
      sumA += (grid[x - 1]?.[y - 1]?.a ?? grid[x][y].a) * 0.05
      sumA += (grid[x + 1]?.[y - 1]?.a ?? grid[x][y].a) * 0.05
      sumA += (grid[x + 1]?.[y + 1]?.a ?? grid[x][y].a) * 0.05
      sumA += (grid[x - 1]?.[y + 1]?.a ?? grid[x][y].a) * 0.05
      return sumA
    }

    function laplaceB(x: number, y: number): number {
      let sumB = 0
      sumB += grid[x][y].b * -1
      sumB += (grid[x - 1]?.[y]?.b ?? grid[x][y].b) * 0.2 // Edge handling
      sumB += (grid[x + 1]?.[y]?.b ?? grid[x][y].b) * 0.2
      sumB += (grid[x]?.[y + 1]?.b ?? grid[x][y].b) * 0.2
      sumB += (grid[x]?.[y - 1]?.b ?? grid[x][y].b) * 0.2
      sumB += (grid[x - 1]?.[y - 1]?.b ?? grid[x][y].b) * 0.05
      sumB += (grid[x + 1]?.[y - 1]?.b ?? grid[x][y].b) * 0.05
      sumB += (grid[x + 1]?.[y + 1]?.b ?? grid[x][y].b) * 0.05
      sumB += (grid[x - 1]?.[y + 1]?.b ?? grid[x][y].b) * 0.05
      return sumB
    }

    p5.draw = () => {
      // No clear() or background() needed as we write every pixel

      // Calculate next state for each cell (handle edges better)
      for (let x = 0; x < p5.width; x++) {
        for (let y = 0; y < p5.height; y++) {
          const a = grid[x][y].a
          const b = grid[x][y].b

          next[x][y].a =
            a + (dA * laplaceA(x, y) - a * b * b + feed * (1 - a)) * dt
          next[x][y].b =
            b + (dB * laplaceB(x, y) + a * b * b - (k + feed) * b) * dt

          next[x][y].a = p5.constrain(next[x][y].a, 0, 1)
          next[x][y].b = p5.constrain(next[x][y].b, 0, 1)
        }
      }

      p5.loadPixels()
      for (let x = 0; x < p5.width; x++) {
        for (let y = 0; y < p5.height; y++) {
          const pix = (x + y * p5.width) * 4
          const a = next[x][y].a
          const b = next[x][y].b

          // Use a slightly different color mapping for better visibility
          const yellow = p5.color(GOOGLE_YELLOW)
          const green = p5.color(GOOGLE_GREEN)
          const bgColor = p5.color(appTheme.colors.editorBackground) // Get theme background

          // Interpolate between background and chemical color based on concentration
          let finalColor: P5.Color
          if (a > b) {
            finalColor = p5.lerpColor(bgColor, yellow, a)
          } else {
            finalColor = p5.lerpColor(bgColor, green, b)
          }

          p5.pixels[pix + 0] = p5.red(finalColor)
          p5.pixels[pix + 1] = p5.green(finalColor)
          p5.pixels[pix + 2] = p5.blue(finalColor)
          p5.pixels[pix + 3] = 255
        }
      }
      p5.updatePixels()

      const temp = grid
      grid = next
      next = temp
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      initGrid()
    }
  }

export default sketch
