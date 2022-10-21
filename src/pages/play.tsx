import Container from '@/components/dom/Container'
import { levelGenerate } from '@/components/dom/Map'
import { MapContext, PlayContext } from '@/lib/context'
import { getCookie, hasCookie, setCookie } from 'cookies-next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

const Level = dynamic(() => import('@/components/canvas/Level'), {
  ssr: false,
})

export default function Page(props) {
  const [play, setPlay] = useContext(PlayContext)
  const router = useRouter()

  // set play context to default values
  useEffect(() => {
    setPlay((state) => ({
      ...state,
      won: false,
      lost: false,
      fragments: 0,
    }))
  }, [])

  const menu = () => {
    router.push('/')
    setPlay((state) => ({
      ...state,
      won: false,
      lost: false,
      fragments: 0,
    }))
  }

  return (
    <>
      {play.won ? (
        <div className='flex flex-col items-center justify-center w-full h-full text-white bg-neutral-900 gap-4'>
          <h1 className='text-5xl font-extrabold'>YOU SURVIVED</h1>
          <p>Press ESC to exit fullscreen</p>
          <div className='flex flex-row'>
            <button className='btn-primary' onClick={() => menu()}>
              Main menu
            </button>
          </div>
        </div>
      ) : play.lost ? (
        <div className='flex flex-col items-center justify-center w-full h-full text-white bg-neutral-900 gap-4'>
          <h1 className='text-5xl font-extrabold'>YOU ARE DEAD</h1>
          <div className='flex flex-row'>
            <button className='btn-primary' onClick={() => router.reload()}>
              Retry
            </button>
            <button className='btn-outline' onClick={() => menu()}>
              Main menu
            </button>
          </div>
        </div>
      ) : (
        <div className='absolute text-white bottom-6 left-6'>
          <div className='text-3xl font-bold'>
            {play.fragments < 4 ? (
              <div className='bg-black'>Fragments {play.fragments}/4</div>
            ) : (
              <div className='bg-black'>Go to the Beacon</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

Page.r3f = (props) => <Scene {...props} />

const Scene = (props) => {
  const [map, setMap] = useContext(MapContext)

  useEffect(() => {
    if (hasCookie('level')) {
      setMap(JSON.parse(String(getCookie('level'))))
    } else {
      const map = levelGenerate()
      setMap(map)
      setCookie('level', map, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
    }
  }, [])

  return <Level />
}
