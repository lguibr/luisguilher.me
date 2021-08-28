import Bouncing from './Bouncing'
import LinearConservation from './LinearConservation'
import RandomWalker from './RandomWalker'
import SnowFlakes from './SnowFlakes'

export default [Bouncing, LinearConservation, RandomWalker, SnowFlakes]

export const sketchs = [
  {
    name: 'Bouncing',
    component: Bouncing,
    description:
      'Bouncing is a animation of free particles bouncing in the walls of your browser.',
    icon: '/icons/bouncing.png'
  },
  {
    name: 'LinearConservation',
    component: LinearConservation,
    description: 'A single body bouncing with linear momentum conservation',
    icon: '/icons/linear.png'
  },
  {
    name: 'RandomWalker',
    component: RandomWalker,
    description: 'A single particle in random walk.',
    icon: '/icons/random.png'
  },
  {
    name: 'SnowFlakes',
    component: SnowFlakes,
    description: 'Cute snowflakes falling from sky',
    icon: '/icons/snow.png'
  }
]
