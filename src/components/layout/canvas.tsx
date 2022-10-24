import { Canvas } from '@react-three/fiber'
import {
  Html,
  PointerLockControls,
  Preload,
  softShadows,
  useProgress,
} from '@react-three/drei'
import useStore from '@/helpers/store'
import { Suspense } from 'react'
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
    <>
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
        <Suspense fallback={<Loader />}>
          <PointerLockControls />
          <AsciiRenderer invert />
          <Preload all />
          {children}
        </Suspense>
      </Canvas>
    </>
  )
}

function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress()
  return (
    <Html fullscreen>
      <div className='absolute top-0 left-0 z-10 w-screen h-screen overflow-hidden dom dark'>
        <div className='flex flex-col items-center justify-center w-full h-full text-white bg-neutral-900 gap-4'>
          <h1 className='text-5xl font-extrabold'>{progress} % loaded</h1>
        </div>
      </div>
    </Html>
  )
}

export default LCanvas
