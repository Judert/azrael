import * as THREE from 'three'
import {
  Billboard,
  Edges,
  Shadow,
  Sparkles,
  useDepthBuffer,
  useGLTF,
} from '@react-three/drei'
import { LayerMaterial, Depth, Fresnel } from 'lamina'
import { useContext, useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PlayContext } from '@/lib/context'
import { useRouter } from 'next/router'
import Spotlight from './Spotlight'
import { setCookie } from 'cookies-next'

const gradient = 0.7
const near = 5
const far = 6

export default function Beacon(props) {
  const mat = useRef()
  const ref = useRef({ won: false })
  const [play, setPlay] = useContext(PlayContext)
  const router = useRouter()
  const depthBuffer = useDepthBuffer()

  // Animate gradient
  useFrame((state) => {
    // if the player is in the same block as the beacon: disappear and add to score
    const distance = [
      state.camera.position.x - props.position[0],
      state.camera.position.z - props.position[2],
    ]
    if (
      distance[0] < 1 &&
      distance[1] < 1 &&
      play.fragments === 4 &&
      !ref.current.won
    ) {
      router.push('/')
      const completed = play.completed + 1
      setPlay((state) => ({ ...state, completed: completed }))
      setCookie('completed', completed, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      ref.current.won = true
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
        position={[props.position[0], 24, props.position[2]]}
      />
    </>
  )
}
