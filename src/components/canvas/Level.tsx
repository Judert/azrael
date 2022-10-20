import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { MapContext } from '@/lib/context'
import { Physics } from '@react-three/cannon'
import { Sky, Text, useDepthBuffer } from '@react-three/drei'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Beacon from './Beacon'
import { Enemy } from './Enemy'
import Fragment from './Fragment'
import Spotlight from './Spotlight'

export default function Level() {
  const [map, setMap] = useContext(MapContext)
  const [physical, setPhysical] = useState([])
  const [intangible, setIntangible] = useState([])
  const [rotation, setRotation] = useState([0, 0, 0, 0])
  const [opts, setOpts] = useState({
    font: 'Philosopher',
    fontSize: 12,
    color: '#99ccff',
    maxWidth: 300,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: 'justify',
    materialType: 'MeshPhongMaterial',
  })

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
          } else if (color === 'cyan') {
            physical.push(
              <Player key={`${i}-${j}`} position={[i * 2, 2, j * 2]} />
            )
          } else if (color === 'red') {
            physical.push(
              <Enemy key={`${i}-${j}`} position={[i * 2, 1, j * 2]} />
            )
          } else if (color === 'hotpink') {
            intangible.push(
              <Fragment
                key={`${i}-${j}`}
                position={[i * 2, 1.5, j * 2]}
                color='white'
                scale={[0.75, 0.75, 0.75]}
              />
            )
          } else if (color === 'green') {
            intangible.push(
              <Beacon
                key={`${i}-${j}`}
                position={[i * 2, 12, j * 2]}
                color='white'
              />
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
      {intangible}
      <Text
        position-z={2}
        rotation={rotation}
        {...opts}
        text='sauce'
        font='https://fonts.gstatic.com/s/philosopher/v9/vEFV2_5QCwIS4_Dhez5jcWBuT0s.woff'
        anchorX='center'
        anchorY='middle'
      >
        {opts.materialType === 'MeshPhongMaterial' ? (
          <meshPhongMaterial attach='material' color={opts.color} />
        ) : null}
      </Text>
      <Physics gravity={[0, -30, 0]}>
        {physical}
        <Ground position={[17, 0, 17]} />
      </Physics>
    </>
  )
}
