import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { Sky, useDepthBuffer } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Box } from './Box'
import Spotlight from './Spotlight'

export default function Level({ map }) {
  const depthBuffer = useDepthBuffer()
  const [player, setPlayer] = useState(false)
  const [boundary, setBoundary] = useState([])
  const [physical, setPhysical] = useState([])
  const [intangible, setIntangible] = useState([])

  useEffect(() => {
    let boundary = []
    let physical = []
    let intangible = []
    for (let i = 0; i < 18; i++) {
      for (let j = 0; j < 18; j++) {
        if (i === 0 || i === 17 || j === 0 || j === 17) {
          boundary.push(
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
              <Player key={`${i}-${j}`} position={[i * 2, 1, j * 2]} />
            )
          } else if (color === 'yellow') {
            // intangible.push(
            //   // <pointLight
            //   //   color='white'
            //   //   castShadow
            //   //   decay={2}
            //   //   intensity={1}
            //   //   position={[i * 2, 3, j * 2]}
            //   // />
            //   <Spotlight
            //     key={`${i}-${j}`}
            //     depthBuffer={depthBuffer}
            //     color='white'
            //     position={[i * 2, 3, j * 2]}
            //   />
            // )
          }
        }
      }
    }
    setBoundary(boundary)
    setPhysical(physical)
    setIntangible(intangible)
  }, [])

  return (
    <>
      <color attach='background' args={['black']} />
      <fog attach='fog' args={['black', 0, 100]} />
      {/* <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={0.2}
        turbidity={10}
      /> */}
      {/* <pointLight
        castShadow
        intensity={0.8}
        decay={2}
        color='white'
        position={[17, 50, 17]}
      /> */}
      <Spotlight
        depthBuffer={depthBuffer}
        color='white'
        position={[17, 17, 17]}
      />
      {/* <ambientLight intensity={0.5} /> */}
      {intangible}
      <Physics gravity={[0, -30, 0]}>
        {/* <Roof position={[16, 3.5, 16]} /> */}
        <group>{boundary}</group>
        {physical}
        <Ground position={[17, 0, 17]} />
      </Physics>
    </>
  )
}
