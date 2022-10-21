import * as THREE from 'three'
import { useContext, useEffect, useRef, useState } from 'react'
import { useCylinder, useSphere, useBox } from '@react-three/cannon'
import { useThree, useFrame, useLoader } from '@react-three/fiber'
import { MapContext } from '@/lib/context'
import {
  astar,
  getNodesInShortestPathOrderAstar,
  getInitialGrid,
  getNewGridWithMaze,
} from '@/lib/astar'
import { PositionalAudio } from '@react-three/drei'

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
    time: 0,
    sound: false,
  })

  useEffect(() => {
    state.current.sound = true
    ref.current.visible = false
    resetGrid()
    api.position.subscribe((p) => state.current.position.set(p[0], p[1], p[2]))
    api.rotation.subscribe((r) => state.current.rotation.set(r[0], r[1], r[2]))
  }, [])

  const resetGrid = () => {
    state.current.grid = getInitialGrid(16, 16)
    let walls = []
    map.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cell === 'black') {
          walls.push([x, y])
        }
      })
    })
    state.current.grid = getNewGridWithMaze(state.current.grid, walls)
  }

  const getPath = (index) => {
    resetGrid()
    const startNode =
      state.current.grid[state.current.position.x / 2 - 1][
        state.current.position.z / 2 - 1
      ]
    const finishNode = state.current.grid[index[0]][index[1]]
    if (startNode !== finishNode) {
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
      // state.current.path.pop()
    }
  }

  const getPlayerBlock = (player) => {
    for (let i = 1; i <= 16; i++) {
      for (let j = 1; j <= 16; j++) {
        if (player.x >= i * 2 - 1 && player.x < i * 2 + 1) {
          if (player.z >= j * 2 - 1 && player.z < j * 2 + 1) {
            state.current.player = [i - 1, j - 1]
            return
          }
        }
      }
    }
  }

  useFrame((world, delta, frame) => {
    // only start if the useEffect has triggered
    if (state.current.position.x !== 0 && state.current.position.z !== 0) {
      // look at player
      const player = world.camera.position
      const enemy = state.current.position
      let seen = false
      if (player.distanceTo(enemy) < 1) {
        console.log('player is dead')
      } else {
        direction.subVectors(player, enemy).normalize()
        raycaster.set(enemy, direction)
        const intersects = raycaster.intersectObjects(world.scene.children)
        if (intersects.length > 0) {
          if (intersects[0].object.name === 'player') {
            // api.rotation.set(
            //   state.current.rotation.x,
            //   Math.atan2(direction.x, direction.z),
            //   state.current.rotation.z
            // )
            seen = true
          }
        }
        state.current.time += delta
        if (state.current.time > 0.5) {
          state.current.time = 0
          // get block player is in
          if (seen) {
            getPlayerBlock(player)
            getPath(state.current.player)
          } else if (!(state.current.path && state.current.path[0])) {
            // generate random x and y that arent walls or keys or exits
            let x = Math.floor(Math.random() * 16)
            let y = Math.floor(Math.random() * 16)
            while (
              map[x][y] === 'black' ||
              map[x][y] === 'green' ||
              map[x][y] === 'hotpink'
            ) {
              x = Math.floor(Math.random() * 16)
              y = Math.floor(Math.random() * 16)
            }
            getPath([x, y])
          }
          // move towards the next block
          if (state.current.path && state.current.path[0]) {
            const nextPos = [
              (state.current.path[0][0] + 1) * 2,
              (state.current.path[0][1] + 1) * 2,
            ]
            const enemyPos = [enemy.x, enemy.z]
            const deltaPos = [
              nextPos[0] - enemyPos[0],
              nextPos[1] - enemyPos[1],
            ]
            api.position.set(
              enemy.x + deltaPos[0],
              enemy.y,
              enemy.z + deltaPos[1]
            )
            state.current.path.shift()
          }
          getPlayerBlock(player)
          console.log(state.current.player, [
            state.current.position.x / 2 - 1,
            state.current.position.z / 2 - 1,
          ])
        }
      }
    }
  })
  return (
    <group ref={ref} name='enemy'>
      <mesh receiveShadow castShadow>
        <boxGeometry />
        <meshStandardMaterial color='red' roughness={0.2} />
        {/* <Sound url='/assets/violin.ogg' /> */}
      </mesh>
      <PositionalAudio
        url='/assets/violin.ogg'
        distance={4}
        loop
        autoplay
        setDistanceModel='linear'
      />
    </group>
  )
}

// function Sound({ url }) {
//   const sound = useRef()
//   const { camera } = useThree()
//   const [listener] = useState(() => new THREE.AudioListener())
//   const buffer = useLoader(THREE.AudioLoader, url)
//   useEffect(() => {
//     sound.current.setBuffer(buffer)
//     sound.current.setRefDistance(4)
//     sound.current.setLoop(true)
//     sound.current.play()
//     sound.current.setDistanceModel('linear')
//     camera.add(listener)
//     return () => camera.remove(listener)
//   }, [])
//   return <positionalAudio ref={sound} args={[listener]} />
// }
