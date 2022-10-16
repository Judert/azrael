import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { MapContext } from '@/lib/context'
import { Physics } from '@react-three/cannon'
import { Sky, useDepthBuffer } from '@react-three/drei'
import { useContext, useEffect, useRef, useState } from 'react'
import { Box } from './Box'
import { Enemy } from './Enemy'
import Spotlight from './Spotlight'

export default function Level() {
  const [map, setMap] = useContext(MapContext)
  const depthBuffer = useDepthBuffer()
  const [player, setPlayer] = useState(false)
  const [physical, setPhysical] = useState([])
  const [intangible, setIntangible] = useState([])

  useEffect(() => {
    let physical = []
    let intangible = []
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < 18; j++) {
        if (i === 0 || i === 17 || j === 0 || j === 17) {
          physical.push(
            <Wall key={`${i}${j}`} position={[i * 2, 1.5, j * 2]} />
          )
        } else {
          const color = map[i - 1][j - 1]
          if (color === 'black') {
            physical.push(
              <Wall key={`${i}-${j}`} position={[i * 2, 1.5, j * 2]} />
            )
          } else if (color === 'cyan' && !player) {
            setPlayer(true)
            physical.push(
              <Player key={`${i}-${j}`} position={[i * 2, 2, j * 2]} />
            )
          } else if (color === 'red') {
            physical.push(
              <Enemy key={`${i}-${j}`} position={[i * 2, 1, j * 2]} />
            )
          }
        }
      }
    }
    setPhysical(physical)
    setIntangible(intangible)
  }, [])

  return (
    <>
      <color attach='background' args={['black']} />
      <fog attach='fog' args={['black', 0, 100]} />
      <Spotlight
        depthBuffer={depthBuffer}
        color='white'
        position={[17, 25, 17]}
      />
      {intangible}
      <Physics gravity={[0, -30, 0]}>
        {physical}
        <Ground position={[17, 0, 17]} />
      </Physics>
    </>
  )
}
