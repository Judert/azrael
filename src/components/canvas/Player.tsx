import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useCylinder, useSphere } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'

const SPEED = 5
const keys = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'jump',
}
const moveFieldByKey = (key) => keys[key]
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()
const rotation = new THREE.Vector3()
const speed = new THREE.Vector3()

const usePlayerControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })
  useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  return movement
}

export const Player = (props) => {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [1, 1, 1],
    ...props,
  }))
  const { forward, backward, left, right } = usePlayerControls()
  const { camera } = useThree()
  const velocity = useRef([0, 0, 0])
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [])
  useFrame((state) => {
    ref.current.getWorldPosition(camera.position)
    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)
    speed.fromArray(velocity.current)
    api.velocity.set(direction.x, velocity.current[1], direction.z)
  })
  return (
    <>
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color='pink' />
      </mesh>
    </>
  )
}
