import type P5 from 'p5' // Use type import
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

const GOOGLE_BLUE = '#4285F4'

interface Complex {
  re: number
  im: number
}

interface FourierTerm {
  freq: number
  amp: number
  phase: number
}

function dft(p5: P5, x: Complex[]): FourierTerm[] {
  const X: FourierTerm[] = []
  const N = x.length
  for (let k = 0; k < N; k++) {
    let sumRe = 0
    let sumIm = 0
    for (let n = 0; n < N; n++) {
      const phi = (p5.TWO_PI * k * n) / N
      sumRe += x[n].re * p5.cos(phi) + x[n].im * p5.sin(phi)
      sumIm += -x[n].re * p5.sin(phi) + x[n].im * p5.cos(phi)
    }
    sumRe = sumRe / N
    sumIm = sumIm / N

    const freq = k
    const amp = p5.sqrt(sumRe * sumRe + sumIm * sumIm)
    const phase = p5.atan2(sumIm, sumRe)
    X[k] = { freq, amp, phase }
  }
  return X
}

const sketch =
  (appTheme: Theme) =>
  (p5: P5): void => {
    let time = 0
    let path: P5.Vector[] = []
    let drawing: Complex[] = []
    let fourierX: FourierTerm[] = []
    let state: 'USER_DRAWING' | 'FOURIER_DRAWING' = 'USER_DRAWING'
    // Removed unused drawingComplete

    function loadSquare() {
      drawing = []
      const size = 100
      const steps = 50
      for (let i = 0; i < steps; i++)
        drawing.push({ re: -size + (size * 2 * i) / steps, im: -size })
      for (let i = 0; i < steps; i++)
        drawing.push({ re: size, im: -size + (size * 2 * i) / steps })
      for (let i = 0; i < steps; i++)
        drawing.push({ re: size - (size * 2 * i) / steps, im: size })
      for (let i = 0; i < steps; i++)
        drawing.push({ re: -size, im: size - (size * 2 * i) / steps })
      // Removed drawingComplete assignment
      startFourier()
    }

    function startFourier() {
      if (drawing.length === 0) return
      state = 'FOURIER_DRAWING'
      fourierX = dft(p5, drawing)
      fourierX.sort((a, b) => b.amp - a.amp)
      time = 0
      path = []
    }

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight)
      loadSquare()
    }

    function epicycles(
      x: number,
      y: number,
      rotation: number,
      fourier: FourierTerm[]
    ): P5.Vector {
      // Removed unused center variable
      for (let i = 0; i < fourier.length; i++) {
        const prevx = x
        const prevy = y
        const freq = fourier[i].freq
        const radius = fourier[i].amp
        const phase = fourier[i].phase
        x += radius * p5.cos(freq * time + phase + rotation)
        y += radius * p5.sin(freq * time + phase + rotation)

        p5.stroke(appTheme.colors.text + '50')
        p5.noFill()
        p5.ellipse(prevx, prevy, radius * 2)
        p5.stroke(appTheme.colors.text + '90')
        p5.line(prevx, prevy, x, y)
      }
      return p5.createVector(x, y)
    }

    p5.draw = () => {
      p5.clear() // Use clear() for transparency

      if (state === 'USER_DRAWING') {
        p5.stroke(appTheme.colors.text)
        p5.noFill()
        p5.beginShape()
        for (const v of drawing) {
          p5.vertex(v.re + p5.width / 2, v.im + p5.height / 2)
        }
        p5.endShape()
      } else if (state === 'FOURIER_DRAWING') {
        const v = epicycles(p5.width / 2, p5.height / 2, 0, fourierX)
        path.unshift(v)

        p5.beginShape()
        p5.noFill()
        p5.strokeWeight(2)
        p5.stroke(GOOGLE_BLUE)
        for (let i = 0; i < path.length; i++) {
          p5.vertex(path[i].x, path[i].y)
        }
        p5.endShape()

        const dt = p5.TWO_PI / fourierX.length
        time += dt

        if (time > p5.TWO_PI) {
          time = 0
          path = []
        }

        if (path.length > 500) {
          path.pop()
        }
      }
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      // Reload the default drawing on resize
      loadSquare()
    }
  }

export default sketch
