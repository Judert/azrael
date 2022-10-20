import { levelGenerate } from '@/components/dom/Map'
import { MapContext, PlayContext } from '@/lib/context'
import { getCookie, hasCookie, setCookie } from 'cookies-next'
import dynamic from 'next/dynamic'
import { useContext, useEffect } from 'react'

const Level = dynamic(() => import('@/components/canvas/Level'), {
  ssr: false,
})

export default function Page(props) {
  // const [play, setPlay] = useContext(PlayContext)
  // // create a hud component to display the play state
  // return (
  //   <>
  //     <div className='absolute text-white bottom-6 left-6'>
  //       <div className='text-2xl font-bold'>
  //         {play.fragments < 4 ? (
  //           <>Fragments {play.fragments}/4</>
  //         ) : (
  //           <>Go to the Beacon</>
  //         )}
  //       </div>
  //     </div>
  //   </>
  // )
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
