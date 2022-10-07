import { Canvas, useThree } from '@react-three/fiber'
import { PointerLockControls, Preload, softShadows } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'
import AsciiRenderer from '../canvas/AsciiRenderer'

softShadows()

const LCanvas = ({ children }) => {
  const dom = useStore((state) => state.dom)
  return (
    <Canvas
      mode='concurrent'
      style={{
        position: 'absolute',
        top: 0,
      }}
      onCreated={(state) => state.events.connect(dom.current)}
      shadows
    >
      <PointerLockControls />
      {/* <FrameLimiter /> */}
      {/* <AsciiRenderer invert /> */}
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas

function FrameLimiter({ limit = 60 }) {
  const { invalidate, clock, advance } = useThree()
  useEffect(() => {
    let delta = 0
    const interval = 1 / limit
    const update = () => {
      requestAnimationFrame(update)
      delta += clock.getDelta()

      if (delta > interval) {
        invalidate()
        delta = delta % interval
      }
    }

    update()
  }, [])

  return null
}
