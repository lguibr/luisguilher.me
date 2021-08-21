import Calculator from 'src/components/Core/Loading/Engine/Calculator'
import Body from 'src/components/Core/Loading/Engine/Body'

const sketch = setCanvas => p5 => {
  const calculator = new Calculator()
  const bodies = []

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

  const applyConstrains = body => {
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
    const newcanvas = p5.createCanvas(w, h)
    setCanvas(newcanvas)
  }

  p5.draw = () => {
    p5.clear()
    if (bodies.length < maxBodies) {
      addNewRandomBody(p5)
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
