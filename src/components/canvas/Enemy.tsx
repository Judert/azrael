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
const raycaster = new THREE.Raycaster()

export const Enemy = (props) => {
  const [ref, api] = useBox(() => ({
    // mass: 1,
    type: 'Kinematic',
    ...props,
  }))
  const [map, setMap] = useContext(MapContext)
  const position = useRef([0, 0, 0])
  const rotation = useRef([0, 0, 0])
  const player = useRef(null)
  const playerLast = useRef(null)
  const grid = useRef(null)
  const path = useRef(null)
  const time = useRef(0)

  useEffect(() => {
    grid.current = getInitialGrid(16, 16)
    let walls = []
    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 'black') {
          walls.push([x, y])
        }
      })
    })
    grid.current = getNewGridWithMaze(grid.current, walls)
    api.position.subscribe((p) => (position.current = p))
    api.rotation.subscribe((p) => (rotation.current = p))
  }, [])

  useFrame((state, delta, frame) => {
    // look at player
    const playerPos = state.camera.position
    const enemyPos = position.current
    if (playerPos.distanceTo(enemyPos) < 1) {
      console.log('playerPos is dead')
      return
    }
    direction.subVectors(playerPos, enemyPos).normalize()
    raycaster.set(enemyPos, direction)
    const intersects = raycaster.intersectObjects(state.scene.children)
    if (intersects.length > 0) {
      if (intersects[0].object.name === 'player') {
        api.rotation.set(
          rotation.current[0],
          Math.atan2(direction.x, direction.z),
          rotation.current[2]
        )
      }
    }
    // get block player is in
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
            playerLast.current = player.current
            player.current = [i, j]
          }
        }
      }
    }
    // if the player is in a new block, find a new path
    if (
      (playerLast !== null
        ? playerLast.current[0] !== player.current[0] ||
          playerLast.current[1] !== player.current[1]
        : true) &&
      grid.current
    ) {
      const startNode =
        grid.current[position.current[0] / 2][position.current[2] / 2]
      const finishNode = grid.current[player.current[0]][player.current[1]]
      const visitedNodesInOrder = astar(grid.current, startNode, finishNode)
      const nodesInShortestPathOrder =
        getNodesInShortestPathOrderAstar(finishNode)
      path.current = nodesInShortestPathOrder.map((node) => {
        return [node.row, node.col]
      })
      path.current.shift()
      path.current.pop()
      console.log(path[0])
    }

    // if (path.current && path.current[0]) {
    //   const nextPos = [path.current[0][0] * 2, path.current[0][1] * 2]
    //   const enemyPos = [position.current[0], position.current[2]]
    //   const deltaPos = [nextPos[0] - enemyPos[0], nextPos[1] - enemyPos[1]]
    //   if (!(deltaPos[0] === 0 && deltaPos[1] === 0)) {
    //     // const unitDeltaPos = [
    //     //   deltaPos[0] / Math.sqrt(deltaPos[0] ** 2 + deltaPos[1] ** 2),
    //     //   deltaPos[1] / Math.sqrt(deltaPos[0] ** 2 + deltaPos[1] ** 2),
    //     // ]
    //     // const moveNextX = deltaPos[0] <= unitDeltaPos[0] * delta
    //     // const moveNextZ = deltaPos[1] <= unitDeltaPos[1] * delta
    //     // console.log(
    //     //   enemyPos,
    //     //   nextPos,
    //     //   deltaPos,
    //     //   unitDeltaPos,
    //     //   moveNextX,
    //     //   moveNextZ
    //     // )
    //     // api.position.set(
    //     //   position.current[0] + moveNextX
    //     //     ? deltaPos[0]
    //     //     : unitDeltaPos[0] * delta,
    //     //   position.current[1],
    //     //   position.current[2] + moveNextZ
    //     //     ? deltaPos[1]
    //     //     : unitDeltaPos[1] * delta
    //     // )
    //     // if (moveNextX && moveNextZ) {
    //     //   path.current.shift()
    //     // }
    //     // console.log(deltaPos)
    //     api.position.set(
    //       position.current[0] + deltaPos[0],
    //       position.current[1],
    //       position.current[2] + deltaPos[1]
    //     )
    //     time.current += delta
    //     if (time.current > 0.5) {
    //       path.current.shift()
    //       time.current = 0
    //     }
    //   }
    // }
  })
  return (
    <>
      <mesh ref={ref} receiveShadow castShadow>
        <boxGeometry />
        <meshStandardMaterial color='red' roughness={0.2} />
      </mesh>
    </>
  )
}
