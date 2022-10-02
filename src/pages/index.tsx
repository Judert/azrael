import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
// const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
//   ssr: false,
// })

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}

// dom components goes here
export default function Page(props) {
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lineWidth, setLineWidth] = useState(1)
  const [lineColor, setLineColor] = useState('black')
  const [level, setLevel] = useState(1)
  const [edit, setEdit] = useState(false)
  const [width, setWidth] = useState(16)
  const [height, setHeight] = useState(16)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = lineColor
    ctx.lineWidth = lineWidth
    ctx.scale(1, 2)
    ctxRef.current = ctx
  }, [lineColor, lineWidth])

  const startDrawing = (e) => {
    ctxRef.current.beginPath()
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setIsDrawing(true)
  }

  const endDrawing = () => {
    ctxRef.current.closePath()
    setIsDrawing(false)
  }

  const draw = (e) => {
    if (!isDrawing) {
      return
    }
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)

    ctxRef.current.stroke()
  }

  return (
    <main className='container flex flex-col items-center justify-center p-4 mx-auto'>
      <h1 className='text-4xl font-bold'>Horror Game</h1>
      <div className='flex flex-col justify-center max-w-xl p-4 items-left'>
        <h2 className='text-2xl font-bold'>Level {level}</h2>
        <div className='flex flex-row p-4'>
          {!edit && level > 1 && (
            <button onClick={() => setLevel(level - 1)}>Previous</button>
          )}
          <div className='flex flex-col'>
            <canvas
              onMouseDown={startDrawing}
              onMouseUp={endDrawing}
              onMouseMove={draw}
              ref={canvasRef}
              width={`30px`}
              height={`30px`}
            />
            <div className='flex flex-row p-4 gap-4'>
              {edit ? (
                <>
                  <button onClick={() => {}}>Save</button>
                  <button onClick={() => setEdit(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => {}}>Play</button>
                  <button onClick={() => setEdit(true)}>Edit</button>
                </>
              )}
            </div>
          </div>
          {!edit && level < 3 && (
            <button onClick={() => setLevel(level + 1)}>Next</button>
          )}
        </div>
      </div>
    </main>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
// Page.r3f = (props) => <Scene {...props} />

const Scene = (props) => {
  const router = useRouter()
  const { level } = router.query

  // useEffect(() => {
  //   if (level) {
  //     const reader = new FileReader()
  //     reader.onload = async (e) => {
  //       const text = e.target.result
  //       console.log(text)
  //       alert(text)
  //     }
  //     reader.readAsText(e.target.files[0])
  //   }
  // }, [level])

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.1} />
      <Physics>
        <Roof position={[0, 3, 0]} />
        <Player />
        <Wall position={[0, 1.5, -2]} />
        <Wall position={[1, 1.5, -2]} />
        <Ground />
      </Physics>
    </>
  )
}
