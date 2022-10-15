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
  const state = useRef({
    position: new THREE.Vector3(),
    rotation: new THREE.Vector3(),
    player: null,
    grid: null,
    path: null,
    playerLast: null,
    time: 0,
  })

  useEffect(() => {
    state.current.grid = getInitialGrid(16, 16)
    let walls = []
    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 'black') {
          walls.push([x, y])
        }
      })
    })
    state.current.grid = getNewGridWithMaze(state.current.grid, walls)
    api.position.subscribe((p) => state.current.position.set(p[0], p[1], p[2]))
    api.rotation.subscribe((r) => state.current.rotation.set(r[0], r[1], r[2]))
  }, [])

  useFrame((world, delta, frame) => {
    // only start if the useEffect has triggered
    if (state.current.position.x !== 0 && state.current.position.z !== 0) {
      // look at player
      const player = world.camera.position
      const enemy = state.current.position
      if (player.distanceTo(enemy) < 1) {
        console.log('player is dead')
      } else {
        direction.subVectors(player, enemy).normalize()
        raycaster.set(enemy, direction)
        const intersects = raycaster.intersectObjects(world.scene.children)
        if (intersects.length > 0) {
          if (intersects[0].object.name === 'player') {
            api.rotation.set(
              state.current.rotation.x,
              Math.atan2(direction.x, direction.z),
              state.current.rotation.z
            )
          }
        }
        // get block player is in
        for (let i = 0; i < 16; i++) {
          for (let j = 0; j < 16; j++) {
            if (player.x > i * 2 - 1 && player.x < i * 2 + 1) {
              if (player.z > j * 2 - 1 && player.z < j * 2 + 1) {
                state.current.playerLast = state.current.player
                state.current.player = [i, j]
              }
            }
          }
        }
        // if the player is in a new block, find a new path
        if (
          state.current.playerLast !== null
            ? state.current.playerLast[0] !== state.current.player[0] ||
              state.current.playerLast[1] !== state.current.player[1]
            : true
        ) {
          const startNode = state.current.grid[enemy.x / 2][enemy.z / 2]
          const finishNode =
            state.current.grid[state.current.player[0]][state.current.player[1]]
          const visitedNodesInOrder = astar(
            state.current.grid,
            startNode,
            finishNode
          )
          const nodesInShortestPathOrder =
            getNodesInShortestPathOrderAstar(finishNode)
          state.current.path = nodesInShortestPathOrder.map((node) => {
            return [node.row, node.col]
          })
          state.current.path.shift()
          state.current.path.pop()
          console.log(state.current.path[0])
        }
      }
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
