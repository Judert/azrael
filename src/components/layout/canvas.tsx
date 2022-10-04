import { Canvas } from '@react-three/fiber'
import { PointerLockControls, Preload } from '@react-three/drei'
import useStore from '@/helpers/store'
import { useEffect, useRef } from 'react'
import AsciiRenderer from '../canvas/AsciiRenderer'

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
    >
      <PointerLockControls />
      {/* <AsciiRenderer invert /> */}
      <Preload all />
      {children}
    </Canvas>
  )
}

export default LCanvas
