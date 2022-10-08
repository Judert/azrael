import * as THREE from 'three'
import { useContext, useEffect, useRef, useState } from 'react'
import { useCylinder, useSphere, useBox } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { MapContext } from '@/lib/context'

const SPEED = 0.02

const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const rotation = new THREE.Vector3()
const speed = new THREE.Vector3()
const raycaster = new THREE.Raycaster()

export const Enemy = (props) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    ...props,
  }))
  const [map, setMap] = useContext(MapContext)
  const position = useRef([0, 0, 0])
  useEffect(() => api.position.subscribe((p) => (position.current = p)), [])
  const velocity = useRef([0, 0, 0])
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [])
  const rotation = useRef([0, 0, 0])
  useEffect(() => api.rotation.subscribe((r) => (rotation.current = r)), [])
  useFrame((state, delta, frame) => {
    for (let i = 0; i < 360; i += 3) {
      const angle = (i * Math.PI) / 180
      const x = Math.cos(angle)
      const z = Math.sin(angle)
      direction.set(x, 0, z)
      raycaster.set(ref.current.position, direction)
      const intersects = raycaster.intersectObjects(state.scene.children)
      if (intersects.length > 0) {
        if (intersects[0].object.name === 'player') {
          // api.rotation.set(rotation.current[0], angle, rotation.current[2])
          // api.velocity.set(x * SPEED, velocity.current[1], z * SPEED)
          // break
          api.position.set(
            direction.x * SPEED,
            position.current[1],
            direction.z * SPEED
          )
        }
      }
    }
  })
  return (
    <>
      <mesh ref={ref} receiveShadow castShadow>
        <boxGeometry />
        <meshStandardMaterial color='grey' roughness={0.2} />
      </mesh>
    </>
  )
}
