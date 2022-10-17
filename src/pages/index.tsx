import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

  useLayoutEffect(() => {
    if (!hasCookie('1')) {
      setCookie('1', level)
    }
    setMap(JSON.parse(String(getCookie('1'))))
  }, [])

  return (
    <main className='container flex flex-col items-center justify-center p-4 mx-auto'>
      <h1 className='text-4xl font-bold'>Horror Game</h1>
      <div className='flex flex-col justify-center max-w-xl p-4 items-left gap-4'>
        <h2 className='text-2xl font-bold'>Completed {play.completed}/3</h2>
        <Map edit={edit} setEdit={setEdit} />
      </div>
    </main>
  )
}
