import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { createRef, forwardRef, memo, useEffect, useRef, useState } from 'react'
import { useDistanceConstraint, useParticle } from '@react-three/cannon'

// eslint-disable-next-line react/display-name
const Stitch = memo(({ p1, p2, distance = 0.1 }) => {
  useDistanceConstraint(p1.current.particle, p2.current.particle, {
    distance,
  })

  return null
})

const Particle = memo(
  forwardRef(({ mass, position }, ref) => {
    let [particle, api] = useParticle(() => ({
      mass,
      position,
      // args: [0.3],
      linearDamping: 0.2,
    }))

    if (ref && particle.current) ref.current = { particle, api }

    return null
  })
)

export const Cloth = memo(
  forwardRef(({ width, height, resolutionX, resolutionY, position }, ref) => {
    const box = useRef()
    const [readyForStitches, setReadyForStitches] = useState(false)

    const particles = useRef(
      Array.from({ length: resolutionY }, () =>
        Array.from({ length: resolutionX }, createRef)
      )
    )

    useEffect(() => {
      setReadyForStitches(true)
      // setPosition(position[0], position[1], position[2])
    }, [])

    useFrame(() => {
      const now = performance.now()

      if (particles.current[0][0]) {
        const geom = box.current.geometry
        geom.vertices.forEach((v, vi) => {
          let x = vi % resolutionX
          let y = Math.floor(vi / resolutionX)
          v.copy(particles.current[y][x].current.particle.current.position)
        })
        geom.verticesNeedUpdate = true
        geom.computeVertexNormals()
      }
    })

    const distanceX = width / resolutionX
    const distanceY = height / resolutionY
    const distanceDiagonal = Math.sqrt(
      distanceX * distanceX + distanceY * distanceY
    )

    function setPosition(x = 0, y = 0, z = 0) {
      particles.current[0].forEach((p, i) => {
        if (i < 2 || i > particles.current[0].length - 3)
          p.current.api.position.set(
            (-distanceX * resolutionX) / 2 + x + distanceX * i,
            y,
            z
          )
      })
    }

    if (ref) {
      ref.current = {
        setPosition,
      }
    }

    return (
      <group>
        <mesh ref={box}>
          <planeGeometry
            args={[width, height, resolutionX - 1, resolutionY - 1]}
          />
          <meshStandardMaterial color={'red'} side={THREE.DoubleSide} />
        </mesh>
        {particles.current.map((y, yi) =>
          y.map((x, xi) => (
            <Particle
              ref={x}
              mass={
                yi === 0 && (xi < 2 || xi > resolutionX - 3)
                  ? 0
                  : (1 / width) * height
              }
              key={yi + '-' + xi}
              position={[
                (xi * width) / resolutionX,
                (yi * -height) / resolutionX + 2,
                0,
              ]}
            />
          ))
        )}
        {readyForStitches &&
          particles.current.map((y, yi) =>
            y.map((x, xi) => {
              return (
                <>
                  {/* neighbor */}
                  {xi < resolutionX - 1 && (
                    <Stitch
                      key={yi + '-' + xi + 'x'}
                      p1={x}
                      p2={particles.current[yi][xi + 1]}
                      distance={distanceX}
                    />
                  )}
                  {yi < resolutionY - 1 && (
                    <Stitch
                      key={yi + '-' + xi + 'y'}
                      p1={x}
                      p2={particles.current[yi + 1][xi]}
                      distance={distanceY}
                    />
                  )}
                  {/* shear */}
                  {yi < resolutionY - 1 && xi < resolutionX - 1 && (
                    <Stitch
                      key={yi + '-' + xi + 's1'}
                      p1={x}
                      p2={particles.current[yi + 1][xi + 1]}
                      distance={distanceDiagonal}
                    />
                  )}
                  {yi > 0 && xi < resolutionX - 1 && (
                    <Stitch
                      key={yi + '-' + xi + 's2'}
                      p1={x}
                      p2={particles.current[yi - 1][xi + 1]}
                      distance={distanceDiagonal}
                    />
                  )}
                </>
              )
            })
          )}
      </group>
    )
  })
)
