import * as THREE from 'three'
import { useContext, useEffect, useRef, useState } from 'react'
import { useCylinder, useSphere, useBox } from '@react-three/cannon'
import { useThree, useFrame } from '@react-three/fiber'
import { MapContext } from '@/lib/context'
import {
  astar,
  getNodesInShortestPathOrderAstar,
  getInitialGrid,
  getNewGridWithMaze,
} from '@/lib/astar'

const SPEED = 0.02

const direction = new THREE.Vector3()
// const frontVector = new THREE.Vector3()
// const sideVector = new THREE.Vector3()
// const rotation = new THREE.Vector3()
// const speed = new THREE.Vector3()
const raycaster = new THREE.Raycaster()
let player
let playerLast
let enemy
let enemyLast
let grid

export const Enemy = (props) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: 'Dynamic',
    ...props,
  }))
  const [map, setMap] = useContext(MapContext)

  useEffect(() => {
    grid = getInitialGrid(16, 16)
    let walls = []
    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 'black') {
          walls.push([x, y])
        }
      })
    })
    grid = getNewGridWithMaze(grid, walls)
  }, [])

  useFrame((state, delta, frame) => {
    // look at player
    const playerPos = state.camera.position
    const enemyPos = ref.current.position
    if (playerPos.distanceTo(enemyPos) < 1) {
      console.log('playerPos is dead')
    }
    direction.subVectors(playerPos, enemyPos).normalize()
    raycaster.set(enemyPos, direction)
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
    // enemyLast = enemy
    enemy = [ref.current.position.x / 2, ref.current.position.z / 2]
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        if (
          state.camera.position.x > i * 2 - 1 &&
          state.camera.position.x < i * 2 + 1
        ) {
          if (
            state.camera.position.z > j * 2 - 1 &&
            state.camera.position.z < j * 2 + 1
          ) {
            playerLast = player
            player = [i, j]
          }
        }
      }
    }
    if (
      (playerLast !== undefined
        ? !playerLast.every((e, i) => e === player[i])
        : true) &&
      grid
    ) {
      // console.log(grid)
      const startNode = grid[enemy[0]][enemy[1]]
      const finishNode = grid[player[0]][player[1]]
      const visitedNodesInOrder = astar(grid, startNode, finishNode)
      const nodesInShortestPathOrder =
        getNodesInShortestPathOrderAstar(finishNode)
      const path = nodesInShortestPathOrder.map((node) => {
        console.log(node.row, node.col)
        return [node.row, node.col]
      })
      // if (path.length > 1) {
      //   const next = path[1]
      //   const x = next[0] - enemy[0]
      //   const z = next[1] - enemy[1]
      //   api.velocity.set(x * SPEED, ref.current.velocity.y, z * SPEED)
      // }
    }
    // const startNode = grid[enemy[0]][enemy[1]]
    // const finishNode = grid[player[0]][player[1]]
    // const visitedNodesInOrder = astar(grid, startNode, finishNode)
    // const nodesInShortestPathOrder =
    //   getNodesInShortestPathOrderAstar(finishNode)
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
