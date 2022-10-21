import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { AsciiEffect } from 'three-stdlib'

// const characters = ' .:-+*=%@#'

export default function AsciiRenderer({
  renderIndex = 1,
  characters = ' .:-+*=%@#',
  ...options
}) {
  // Reactive state
  const { size, gl, scene, camera } = useThree()

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, options)
    effect.domElement.style.position = 'absolute'
    effect.domElement.style.top = '0px'
    effect.domElement.style.left = '0px'
    effect.domElement.style.color = 'white'
    effect.domElement.style.backgroundColor = 'black'
    effect.domElement.style.pointerEvents = 'none'
    return effect
  }, [characters, options.invert])

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.parentNode.appendChild(effect.domElement)
    return () => gl.domElement.parentNode.removeChild(effect.domElement)
  }, [effect])

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height)
  }, [effect, size])

    // const shuffle = (str) => [...str].sort(() => Math.random() - 0.5).join('')

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    // raycast 360 degrees around the player to find the object named enemy then calculate the distance
    // const raycaster = new THREE.Raycaster()
    // const player = state.camera.position


    // const intersects = raycaster.intersectObjects(scene.children, true)
    // const enemy = intersects.find((i) => i.object.name === 'enemy')
    // const distance = enemy ? enemy.distance : 0


    // distance between camera and enemy
    // const distance = camera.position.distanceTo(enemy.position)
    // // change the order of ref.characters based on distance
    // if (distance < 5) {
    //   const start = shuffle(characters.slice(0, 10 - distance * 2))
    //   const end = characters.slice(10 - distance * 2)
    //   console.log(start, end, distance)
    // }
    effect.render(scene, camera)
  }, renderIndex)

  // This component returns nothing, it has no view, it is a purely logical
}