import Calculator from 'src/components/Core/Engine/Calculator'
import Body from 'src/components/Core/Engine/Body'
import P5 from 'p5'
// Removed theme import
// Removed Theme type definition

const sketch =
  () =>
  // Removed _theme parameter
  (p5: P5): void => {
    const calculator = new Calculator()
    const bodies: Body[] = []

    const maxBodies = 100

    const forceField = { x: 0, y: 0 }

    const addNewRandomBody = () => {
      const newBody = new Body(
        calculator.createRandomVector([
          [0, p5.width],
          [0, p5.height]
        ]),
        calculator.createRandomVector([
          [-10, 10],
          [-10, 10]
        ]),
        calculator.createRandomVector([
          [-10, 10],
          [-10, 10]
        ]),
        calculator.randomInteger(10, 80) / 10
      )
      bodies.push(newBody)
    }

    const applyConstrains = (body: Body) => {
      const { x: xCoordinate, y: yCoordinate } = body.coordinates
      const { x: xVelocity, y: yVelocity } = body.velocity
      const bodySize = body.mass * 5

      if (xCoordinate > p5.width - bodySize) {
        body.coordinates.x = p5.width - bodySize
        if (xVelocity >= 0) {
          body.velocity.x = -body.velocity.x
        }
      }

      if (yCoordinate >= p5.height - bodySize) {
        body.coordinates.y = p5.height - bodySize
        if (yVelocity >= 0) {
          body.velocity.y = -body.velocity.y
        }
      }

      if (xCoordinate <= 0 + bodySize) {
        body.coordinates.x = 0 + bodySize
        if (xVelocity <= 0) {
          body.velocity.x = -body.velocity.x
        }
      }

      if (yCoordinate <= 0 + bodySize) {
        body.coordinates.y = 0 + bodySize
        if (yVelocity <= 0) {
          body.velocity.y = -body.velocity.y
        }
      }
    }

    p5.setup = (w = p5.windowWidth, h = p5.windowHeight) => {
      // Use windowWidth/Height
      p5.createCanvas(w, h)
      bodies.length = 0 // Clear bodies on setup
    }

    p5.draw = () => {
      p5.clear() // Use clear() for transparency
      if (bodies.length < maxBodies) {
        addNewRandomBody()
      }

      bodies.forEach(body => {
        applyConstrains(body)
        body.UpdateCoordinates()
        body.update(forceField)
        body.draw(p5)
      })
    }

    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
      p5.setup(p5.windowWidth, p5.windowHeight) // Re-run setup
    }
  }

export default sketch
