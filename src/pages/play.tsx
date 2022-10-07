import { MapContext } from '@/lib/context'
import { useKeyPress } from '@/lib/hooks'
import { getCookie, hasCookie, setCookie } from 'cookies-next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import level from '@/data/level.json'

const Level = dynamic(() => import('@/components/canvas/Level'), {
  ssr: false,
})

export default function Page(props) {
  return <></>
}

Page.r3f = (props) => <Scene {...props} />

const Scene = (props) => {
  const router = useRouter()
  const [map, setMap] = useContext(MapContext)
  //   const escape = useKeyPress('Escape')

  //   useEffect(() => {
  //     if (escape) {
  //       router.push('/')
  //     }
  //   }, [escape])

  useEffect(() => {
    if (!hasCookie('1')) {
      setCookie('1', level)
    }
    setMap(JSON.parse(String(getCookie('1'))))
  }, [])

  return <Level />
}
