import Calculator from 'src/components/Core/Engine/Calculator'
import Body from 'src/components/Core/Engine/Body'
import P5 from 'p5'
import theme from 'src/styles/theme'
type Theme = typeof theme['vs-dark']
const sketch =
  (theme: Theme) =>
  (p5: P5): void => {
    const calculator = new Calculator()
    console.log({ theme })
    const bodies: Body[] = []

    const maxBodies = 1
    const addNewRandomBody = () => {
      const smallerDimension = p5.width < p5.height ? p5.width : p5.height
      const newBody = new Body(
        {
          x: p5.width / 2,
          y: p5.height / 2
        },
        { x: 0, y: 0 },
        calculator.createRandomVector([
          [-10, 10],
          [-10, 10]
        ]),
        smallerDimension / 300,
        theme.colors.text
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
      p5.frameRate(25)
      if (bodies.length < maxBodies) {
        addNewRandomBody()
      }
      const smallerDimension = p5.width < p5.height ? p5.width : p5.height

      bodies.forEach(body => {
        applyConstrains(body)

        body.UpdateCoordinates(
          calculator.createRandomVector([
            [-smallerDimension / 25, smallerDimension / 25],
            [-smallerDimension / 25, smallerDimension / 25]
          ])
        )
        body.update({ x: 0, y: 0 })
        body.draw(p5)
      })
    }
  }

export default sketch
