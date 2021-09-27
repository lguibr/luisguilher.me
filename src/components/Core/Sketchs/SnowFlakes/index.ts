import Calculator from 'src/components/Core/Engine/Calculator'
import Body from 'src/components/Core/Engine/Body'
import P5 from 'p5'
import theme from 'src/styles/theme'
type Theme = typeof theme['vs-dark']
const sketch =
  (theme: Theme) =>
  (p5: P5): void => {
    console.log({ theme })

    const calculator = Calculator()
    const maxBodies = 200
    const bodies: Body[] = []
    const forceField = p5.createVector(1, 1)

    const addNewRandomBody = () => {
      const newBody = new Body(
        calculator.createRandomVector([
          [-p5.width / 2, p5.width],
          [-p5.height / 2, p5.height]
        ]),
        p5.createVector(0, 0),
        p5.createVector(0, 0),

        calculator.randomInteger(1, 2)
      )
      bodies.push(newBody)
    }

    p5.setup = (w = p5.width, h = p5.height) => {
      p5.createCanvas(w, h)
    }

    p5.draw = () => {
      p5.clear()
      ;[...Array(20).keys()].forEach(() => {
        addNewRandomBody()
      })
      p5.frameRate(20)
      bodies.forEach(body => {
        body.color = [220, 220, 220]
        body.update(forceField)
        body.draw(p5)
      })
      if (bodies.length >= maxBodies) {
        ;[...Array(15).keys()].forEach(() => {
          bodies.pop()
        })
      }
    }
  }

export default sketch
