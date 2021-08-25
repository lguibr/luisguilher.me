import Calculator from 'src/components/Core/Loading/Engine/Calculator'
import Body from 'src/components/Core/Loading/Engine/Body'
import P5 from 'p5'

const sketch =
  (setCanvas: (p5: P5 | null) => void) =>
  (p5: P5): void => {
    const calculator = new Calculator()
    const maxBodies = 200
    const bodies: Body[] = []
    const forceField = { x: 1, y: 1 }
    const addNewRandomBody = () => {
      const newBody = new Body(
        calculator.createRandomVector([
          [-p5.width, p5.width],
          [-p5.height, p5.height]
        ]),
        { x: 0, y: 0 },
        calculator.createRandomVector([
          [-10, 10],
          [-10, 10]
        ]),
        calculator.randomInteger(1, 4)
      )
      bodies.push(newBody)
    }

    p5.setup = (w = p5.width, h = p5.height) => {
      p5.createCanvas(w, h)
      setCanvas(p5)
    }

    p5.draw = () => {
      p5.frameRate(10)
      p5.clear()
      if (bodies.length <= maxBodies) {
        ;[...Array(20).keys()].forEach(() => {
          addNewRandomBody()
        })
      }

      bodies.forEach(body => {
        body.color = [220, 220, 220]
        body.UpdateCoordinates()
        body.update(forceField)
        body.draw(p5)
      })
      if (bodies.length >= maxBodies) {
        ;[...Array(40).keys()].forEach(() => {
          bodies.pop()
        })
      }
    }
  }

export default sketch
