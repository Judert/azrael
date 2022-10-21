import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Preload, softShadows } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'
import AsciiRenderer from '@/lib/AsciiRenderer'

softShadows({
  frustum: 3.75,
  size: 0.3,
  near: 9.5,
  samples: 17,
  rings: 11, // Rings (default: 11) must be a int
})

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
      gl={{
        antialias: true,
      }}
      shadows
    >
      <PointerLockControls />
      <AsciiRenderer invert />
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
