import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { useDepthBuffer } from '@react-three/drei'
import { Box } from './Box'
import Spotlight from './Spotlight'

export default function Level({ map }) {
  const Surround = () => {
    let walls = []
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < 18; j++) {
        if (i === 0 || i === 17 || j === 0 || j === 17) {
          walls.push(
            <Wall key={`${i}${j}`} position={[i * 2 - 2, 1.5, j * 2 - 2]} />
          )
        }
      }
    }
    return walls
  }
  const depthBuffer = useDepthBuffer()

  return (
    <>
      <color attach='background' args={['black']} />
      {/* <ambientLight intensity={0.1} /> */}
      {/* <pointLight
        color='white'
        castShadow
        decay={2}
        distance={4}
        intensity={1}
        position={[1, 2, 1]}
      /> */}
      <Spotlight depthBuffer={depthBuffer} color='white' position={[3, 3, 3]} />
      <fog attach='fog' args={['black', 0, 100]} />
      <Physics gravity={[0, -30, 0]}>
        <Roof position={[15, 3.5, 15]} />
        <Player position={[1, 1, 1]} />
        {/* <Box position={[3, 2, 3]} /> */}
        <Surround />
        {map.map((row, i) =>
          row.map((color, j) => {
            switch (color) {
              case 'black':
                return <Wall key={`${i}-${j}`} position={[i * 2, 1.5, j * 2]} />
            }
          })
        )}
        <Ground position={[15, 0, 15]} />
      </Physics>
    </>
  )
}
