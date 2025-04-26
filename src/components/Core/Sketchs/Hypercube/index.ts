import type P5 from 'p5' // Use type import
import theme from 'src/styles/theme'

type Theme = typeof theme['vs-dark']

const GOOGLE_BLUE = '#4285F4'

const sketch =
  (
    appTheme: Theme // Renamed theme variable
  ) =>
  (p5: P5): void => {
    let angle = 0
    const points: P5.Vector[] = []
    let projected3d: P5.Vector[] = []

    function rotateXY(v: P5.Vector, angle: number): P5.Vector {
      const r = p5.createVector()
      r.x = p5.cos(angle) * v.x - p5.sin(angle) * v.y
      r.y = p5.sin(angle) * v.x + p5.cos(angle) * v.y
      r.z = v.z
      // @ts-expect-error Adding w property dynamically
      r.w = v.w
      return r
    }

    function rotateZW(v: P5.Vector, angle: number): P5.Vector {
      const r = p5.createVector()
      // @ts-expect-error Accessing w property
      const z = v.z
      // @ts-expect-error Accessing w property
      const w = v.w
      r.x = v.x
      r.y = v.y
      r.z = p5.cos(angle) * z - p5.sin(angle) * w
      // @ts-expect-error Adding w property dynamically
      r.w = p5.sin(angle) * z + p5.cos(angle) * w
      return r
    }
    function rotateXW(v: P5.Vector, angle: number): P5.Vector {
      const r = p5.createVector()
      const x = v.x
      // @ts-expect-error Accessing w property
      const w = v.w
      r.x = p5.cos(angle) * x - p5.sin(angle) * w
      r.y = v.y
      r.z = v.z
      // @ts-expect-error Adding w property dynamically
      r.w = p5.sin(angle) * x + p5.cos(angle) * w
      return r
    }

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL)
      points.length = 0 // Clear points on setup
      for (let i = 0; i < 16; i++) {
        const x = i & 1 ? 1 : -1
        const y = i & 2 ? 1 : -1
        const z = i & 4 ? 1 : -1
        const w = i & 8 ? 1 : -1
        const vec = p5.createVector(x, y, z)
        // @ts-expect-error Adding w property dynamically
        vec.w = w
        points[i] = vec
      }
    }

    p5.draw = () => {
      p5.clear() // Use clear() for transparency in WEBGL
      p5.orbitControl() // Allow user interaction
      // p5.rotateX(-p5.PI / 6) // Remove fixed rotation if using orbitControl
      // p5.rotateY(p5.PI / 4)

      projected3d = []

      for (let i = 0; i < points.length; i++) {
        let v = points[i]

        v = rotateXY(v, angle * 0.5)
        v = rotateZW(v, angle)
        v = rotateXW(v, angle * 1.5)

        // @ts-expect-error Accessing w property
        const w = v.w
        const distance = 2
        const perspectiveFactor = 1 / (distance - w)

        const projected = p5.createVector(
          v.x * perspectiveFactor,
          v.y * perspectiveFactor,
          v.z * perspectiveFactor
        )
        projected3d[i] = projected.mult(100)
      }

      p5.stroke(appTheme.colors.text)
      p5.strokeWeight(8)
      p5.noFill()
      for (let i = 0; i < projected3d.length; i++) {
        p5.point(projected3d[i].x, projected3d[i].y, projected3d[i].z)
      }

      p5.stroke(GOOGLE_BLUE)
      p5.strokeWeight(1)
      for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
          const diff = i ^ j
          if ((diff & (diff - 1)) === 0) {
            p5.line(
              projected3d[i].x,
              projected3d[i].y,
              projected3d[i].z,
              projected3d[j].x,
              projected3d[j].y,
              projected3d[j].z
            )
          }
        }
      }

      angle += 0.01
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      // No need to call setup usually for WEBGL resize unless camera perspective needs reset
    }
  }

export default sketch
