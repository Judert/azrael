import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { Box } from './Box'

export default function Level({ map }) {
  const Surround = () => {
    let walls = []
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < 18; j++) {
        if (i === 0 || i === 17 || j === 0 || j === 17) {
          walls.push(<Wall key={`${i}${j}`} position={[i - 1, 1.5, j - 1]} />)
        }
      }
    }
    return walls
  }
  return (
    <>
      <color attach='background' args={['black']} />
      <ambientLight intensity={0.05} />
      <Physics>
        <Roof position={[7.5, 3, 7.5]} />
        <Player />
        <Box position={[3, 2, 3]} />
        <Surround />
        {map.map((row, i) =>
          row.map((color, j) => {
            if (color === 'black') {
              return <Wall key={`${i}-${j}`} position={[i, 1.5, j]} />
            }
          })
        )}
        <Ground position={[7.5, 0, 7.5]} />
      </Physics>
    </>
  )
}
