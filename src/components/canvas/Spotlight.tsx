import { SpotLight } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'

export default function Spotlight({ vec = new Vector3(), ...props }) {
  const light = useRef()
  useFrame((state) => {
    light.current.target.position.lerp(
      vec.set(light.current.position.x, 0, light.current.position.z),
      0.1
    )
    light.current.target.updateMatrixWorld()
  })
  return (
    <SpotLight
      castShadow
      ref={light}
      penumbra={1}
      angle={1}
      attenuation={5}
      anglePower={5}
      intensity={1}
      decay={2}
      {...props}
    />
  )
}
