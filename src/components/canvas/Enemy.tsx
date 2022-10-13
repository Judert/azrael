import * as THREE from 'three'
import { useContext, useEffect, useRef, useState } from 'react'
import { useCylinder, useSphere, useBox } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { MapContext } from '@/lib/context'

const SPEED = 0.02

const direction = new THREE.Vector3()
// const frontVector = new THREE.Vector3()
// const sideVector = new THREE.Vector3()
// const rotation = new THREE.Vector3()
// const speed = new THREE.Vector3()
const raycaster = new THREE.Raycaster()

export const Enemy = (props) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    ...props,
  }))
  // const [map, setMap] = useContext(MapContext)
  // const position = useRef([0, 0, 0])
  // useEffect(() => api.position.subscribe((p) => (position.current = p)), [])
  // const velocity = useRef([0, 0, 0])
  // useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [])
  // const rotation = useRef([0, 0, 0])
  // useEffect(() => api.rotation.subscribe((r) => (rotation.current = r)), [])
  useFrame((state, delta, frame) => {
    const player = state.camera.position
    const enemy = ref.current.position
    const distance = player.distanceTo(enemy)
    if (distance < 1) {
      console.log('player is dead')
    }
    const direction = new THREE.Vector3()
    direction.subVectors(player, enemy).normalize()
    raycaster.set(enemy, direction)
    const intersects = raycaster.intersectObjects(state.scene.children)
    if (intersects.length > 0) {
      if (intersects[0].object.name === 'player') {
        api.rotation.set(
          ref.current.rotation.x,
          Math.atan2(direction.x, direction.z),
          ref.current.rotation.z
        )
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
