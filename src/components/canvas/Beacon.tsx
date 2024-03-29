import { Edges, useDepthBuffer } from '@react-three/drei'
import { LayerMaterial, Depth, Fresnel } from 'lamina'
import { useContext, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MapContext, PlayContext } from '@/lib/context'
import { useRouter } from 'next/router'
import Spotlight from './Spotlight'
import { setCookie } from 'cookies-next'
import { levelGenerate } from '../dom/Map'

const gradient = 0.7
const near = 5
const far = 6

export default function Beacon(props) {
  const mat = useRef()
  const ref = useRef()
  const [play, setPlay] = useContext(PlayContext)
  const [map, setMap] = useContext(MapContext)
  const router = useRouter()
  const depthBuffer = useDepthBuffer()

  // Animate gradient
  useFrame((state) => {
    // get the players block
    const player = state.camera.position
    let block = [0, 0]
    main: for (let i = 1; i <= 16; i++) {
      for (let j = 1; j <= 16; j++) {
        if (player.x >= i * 2 - 1 && player.x < i * 2 + 1) {
          if (player.z >= j * 2 - 1 && player.z < j * 2 + 1) {
            block = [i - 1, j - 1]
            break main
          }
        }
      }
    }
    const sameBlock =
      block[0] === props.position[0] / 2 - 1 &&
      block[1] === props.position[2] / 2 - 1
    if (sameBlock && play.fragments === 4 && !play.won) {
      const completed = Number(play.completed) + 1
      setPlay((state) => ({
        ...state,
        completed: completed,
        won: true,
        lost: false,
        fragments: 0,
      }))
      setCookie('completed', completed, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      const map = levelGenerate()
      setMap(map)
      setCookie('level', map, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
    }
    const sin = Math.sin(state.clock.elapsedTime / 2)
    const cos = Math.cos(state.clock.elapsedTime / 2)
    mat.current.layers[0].origin.set(cos / 2, 0, 0)
    mat.current.layers[1].origin.set(cos, sin, cos)
    mat.current.layers[2].origin.set(sin, cos, sin)
    mat.current.layers[3].origin.set(cos, sin, cos)
    // rotate ref
    ref.current.rotation.y += 0.0025
    // make the fragment go up and down
    //   ref.current.position.y = sin + 2
  })

  return (
    <>
      <mesh ref={ref} {...props}>
        <cylinderGeometry args={[1, 1, 24, 32]} />
        <LayerMaterial ref={mat} toneMapped={false}>
          <Depth
            colorA='#ff0080'
            colorB='black'
            alpha={1}
            mode='normal'
            near={near * 0.5 * gradient}
            far={far * 0.5}
            origin={[0, 0, 0]}
          />
          <Depth
            colorA='blue'
            colorB='#f7b955'
            alpha={1}
            mode='add'
            near={near * 2 * gradient}
            far={far * 2}
            origin={[0, 1, 1]}
          />
          <Depth
            colorA='green'
            colorB='#f7b955'
            alpha={1}
            mode='add'
            near={near * 3 * gradient}
            far={far * 3}
            origin={[0, 1, -1]}
          />
          <Depth
            colorA='white'
            colorB='red'
            alpha={1}
            mode='overlay'
            near={near * 1.5 * gradient}
            far={far * 1.5}
            origin={[1, -1, -1]}
          />
          <Fresnel
            mode='add'
            color='white'
            intensity={0.5}
            power={1.5}
            bias={0.05}
          />
        </LayerMaterial>
        <Edges color='white' />
      </mesh>
      <Spotlight
        depthBuffer={depthBuffer}
        color='white'
        position={[props.position[0], 20, props.position[2]]}
      />
    </>
  )
}
