import * as THREE from 'three'
import { useContext, useEffect, useRef, useState } from 'react'
import { useCylinder, useSphere, useBox } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { MapContext } from '@/lib/context'

const SPEED = 5

const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const rotation = new THREE.Vector3()
const speed = new THREE.Vector3()

export const Enemy = (props) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    ...props,
  }))
  const [map, setMap] = useContext(MapContext)
  const velocity = useRef([0, 0, 0])
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [])
  useFrame((state) => {
    // set rotation to face the player
    const player = state.scene.getObjectByName('player')
    api.rotation.set(
      0,
      Math.atan2(
        player.position.x - ref.current.position.x,
        player.position.z - ref.current.position.z
      ),
      0
    )
    // if (player) {
    //   api.rotation.
    // }

    // setMap(
    //   map.map((row, r) =>
    //     row.map((color, c) => (r === i && c === j ? newColor : color))
    //   )
    // )
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
