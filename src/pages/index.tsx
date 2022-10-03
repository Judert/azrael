import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  getCookies,
  getCookie,
  setCookie,
  deleteCookie,
  hasCookie,
} from 'cookies-next'
import Map from '@/components/dom/Map'
import { MapContext, PlayContext } from '@/lib/context'
import level from '@/data/level.json'
import { useKeyPress } from '@/lib/hooks'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
// const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
//   ssr: false,
// })

export const getStaticProps = () => {
  return {
    props: {
      title: 'Index',
    },
  }
}

export default function Page(props) {
  const [edit, setEdit] = useState(false)
  const [map, setMap] = useContext(MapContext)
  const [play, setPlay] = useContext(PlayContext)
  const escape = useKeyPress('Escape')

  useEffect(() => {
    if (!hasCookie('1')) {
      setCookie('1', level)
    }
    setMap(JSON.parse(String(getCookie('1'))))
  }, [])

  useEffect(() => {
    if (play && escape) {
      setPlay(false)
    }
  }, [escape])

  return (
    <>
      {!play && (
        <main className='container flex flex-col items-center justify-center p-4 mx-auto'>
          <h1 className='text-4xl font-bold'>Horror Game</h1>
          <div className='flex flex-col justify-center max-w-xl p-4 items-left gap-4'>
            <h2 className='text-2xl font-bold'>Level 1 {edit && 'Edit'}</h2>
            <Map edit={edit} setEdit={setEdit} />
          </div>
        </main>
      )}
    </>
  )
}

Page.r3f = (props) => <Scene {...props} />

const Scene = (props) => {
  const router = useRouter()
  const [map, setMap] = useContext(MapContext)
  const [play, setPlay] = useContext(PlayContext)

  return (
    <>
      {play && (
        <>
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.1} />
          <Physics>
            <Roof position={[0, 3, 0]} />
            <Player />
            {map.map((row, i) =>
              row.map((color, j) => {
                if (color === 'black') {
                  return <Wall key={`${i}-${j}`} position={[i, 1.5, j]} />
                }
              })
            )}
            <Ground />
          </Physics>
        </>
      )}
    </>
  )
}
