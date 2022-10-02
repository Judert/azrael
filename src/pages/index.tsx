import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Objects } from '@/data/enums'
import { useCookies } from 'react-cookie'
import * as fs from 'fs'

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
  const [level, setLevel] = useState(1)
  const [edit, setEdit] = useState(false)
  const [cookies, setCookie] = useCookies(['level1', 'level2', 'level3'])

  useEffect(() => {
    if (!cookies.level1) {
      console.log('cookie not found')
      setCookie(
        'level1',
        Array.from({ length: 16 }, (y, i) =>
          Array.from({ length: 16 }, (x, j) => 'white')
        ),
        { path: '/' }
      )
    }
  }, [])

  return (
    <main className='container flex flex-col items-center justify-center p-4 mx-auto'>
      <h1 className='text-4xl font-bold'>Horror Game</h1>
      <div className='flex flex-col justify-center max-w-xl p-4 items-left'>
        <h2 className='text-2xl font-bold'>
          Level {level} {edit && 'Edit'}
        </h2>
        <div className='flex flex-row p-4 gap-4'>
          {!edit && level > 1 && (
            <button onClick={() => setLevel(level - 1)}>Previous</button>
          )}
          <Map edit={edit} setEdit={setEdit} level={level} />
          {!edit && level < 3 && (
            <button onClick={() => setLevel(level + 1)}>Next</button>
          )}
        </div>
      </div>
    </main>
  )
}

function Map({ edit, setEdit, level }) {
  const sizes = [8, 16]
  const [penColor, setPenColor] = useState('black')
  const [width, setWidth] = useState(sizes[1])
  const [height, setHeight] = useState(sizes[1])
  const [cookies, setCookie] = useCookies(['level' + level])
  const [colors, setColors] = useState(cookies['level' + level])

  const levelExport = () => {
    fs.writeFile('./level' + level + '.json', JSON.stringify(colors), (err) => {
      if (err) alert('Error writing file:' + JSON.stringify(err))
    })
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-4'>
        {edit && (
          <div className='flex flex-col justify-center gap-4'>
            Height
            <div className='flex flex-row gap-4'>
              {sizes.map((size, index) => (
                <input
                  key={index}
                  type='radio'
                  value={size}
                  name='height'
                  checked={height === size}
                  onChange={(e) => {
                    setHeight(parseInt(e.target.value))
                  }}
                />
              ))}
            </div>
            Width
            <div className='flex flex-row gap-4'>
              {sizes.map((size, index) => (
                <input
                  key={index}
                  type='radio'
                  value={size}
                  name='width'
                  checked={width === size}
                  onChange={(e) => {
                    setWidth(parseInt(e.target.value))
                  }}
                />
              ))}
            </div>
            <button onClick={() => setEdit(false)}>Reset</button>
            <button onClick={() => setEdit(false)}>Import</button>
            <button onClick={() => levelExport()}>Export</button>
          </div>
        )}
        <div className='flex flex-col'>
          {colors.map((row, index) => {
            return (
              <ol className='flex flex-row' key={index}>
                {row.map((color, index) => {
                  return (
                    <Pixel
                      key={index}
                      color={color}
                      penColor={penColor}
                      edit={edit}
                    />
                  )
                })}
              </ol>
            )
          })}
        </div>
        {edit && (
          <div className='flex flex-col justify-center gap-4'>
            {Object.entries(Objects).map(([key, value]) => {
              return (
                <button
                  key={key}
                  onClick={() => setPenColor(value.description)}
                >
                  {key}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <div className='flex flex-row justify-center p-4 gap-4'>
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
  )
}

function Pixel({ color, penColor, edit }) {
  const [pixelColor, setPixelColor] = useState(color)
  const [oldColor, setOldColor] = useState(pixelColor)
  const [canChangeColor, setCanChangeColor] = useState(true)

  function applyColor() {
    setPixelColor(penColor)
    setCanChangeColor(false)
  }

  function changeColorOnHover() {
    setOldColor(pixelColor)
    setPixelColor(penColor)
  }

  function resetColor() {
    if (canChangeColor) {
      setPixelColor(oldColor)
    }
    setCanChangeColor(true)
  }

  return (
    <div
      className='w-6 h-6 border-2 border-black'
      onClick={edit ? applyColor : () => {}}
      onMouseEnter={edit ? changeColorOnHover : () => {}}
      onMouseLeave={edit ? resetColor : () => {}}
      style={{ backgroundColor: pixelColor }}
    ></div>
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
