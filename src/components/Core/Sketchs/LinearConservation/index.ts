import Calculator from 'src/components/Core/Engine/Calculator'
import Body from 'src/components/Core/Engine/Body'
import P5 from 'p5'
import theme from 'src/styles/theme'
type Theme = typeof theme['vs-dark']
const sketch =
  (_theme: Theme) =>
  (p5: P5): void => {
    const calculator = new Calculator()
    const bodies: Body[] = []

    const maxBodies = 1

    const forceField = { x: 0, y: 1 }

    const addNewRandomBody = () => {
      const newBody = new Body(
        { x: p5.width, y: 20 },
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

    p5.setup = (w = p5.width, h = p5.height) => {
      p5.createCanvas(w, h)
    }

    p5.draw = () => {
      p5.clear()
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
  }

export default sketch
