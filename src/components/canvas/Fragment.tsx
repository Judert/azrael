import * as THREE from 'three'
import { Billboard, Edges, Shadow, Sparkles, useGLTF } from '@react-three/drei'
import { LayerMaterial, Depth, Fresnel } from 'lamina'
import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const gradient = 0.7

export default function Fragment(props) {
  const mat = useRef()
  const ref = useRef()

  useLayoutEffect(() => {
    // flip the fragment upside down
    ref.current.rotation.x = Math.PI
  }, [])

  // Animate gradient
  useFrame((state) => {
    const sin = Math.sin(state.clock.elapsedTime / 2)
    const cos = Math.cos(state.clock.elapsedTime / 2)
    mat.current.layers[0].origin.set(cos / 2, 0, 0)
    mat.current.layers[1].origin.set(cos, sin, cos)
    mat.current.layers[2].origin.set(sin, cos, sin)
    mat.current.layers[3].origin.set(cos, sin, cos)
    // rotate ref
    ref.current.rotation.y += 0.0025
    // make the fragment go up and down
    ref.current.position.y = sin + 2
  })

  return (
    <>
      <mesh ref={ref} {...props} receiveShadow castShadow>
        <coneGeometry args={[1, 2, 3]} />
        <LayerMaterial ref={mat} toneMapped={false}>
          <Depth
            colorA='#ff0080'
            colorB='black'
            alpha={1}
            mode='normal'
            near={0.5 * gradient}
            far={0.5}
            origin={[0, 0, 0]}
          />
          <Depth
            colorA='blue'
            colorB='#f7b955'
            alpha={1}
            mode='add'
            near={2 * gradient}
            far={2}
            origin={[0, 1, 1]}
          />
          <Depth
            colorA='green'
            colorB='#f7b955'
            alpha={1}
            mode='add'
            near={3 * gradient}
            far={3}
            origin={[0, 1, -1]}
          />
          <Depth
            colorA='white'
            colorB='red'
            alpha={1}
            mode='overlay'
            near={1.5 * gradient}
            far={1.5}
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
      <Sparkles
        position={[props.position[0], props.position[1], props.position[2]]}
        size={5}
        scale={3}
        count={100}
      />
    </>
  )
}
