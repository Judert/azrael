import Header from '@/config'
import Dom from '@/components/layout/dom'
import '@/styles/index.css'
import dynamic from 'next/dynamic'
import { MapContext, PlayContext } from '@/lib/context'
import { useState } from 'react'

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: true,
})

function App({ Component, pageProps = { title: 'Azrael' } }) {
  const [map, setMap] = useState(null)
  const [play, setPlay] = useState({
    completed: 0,
    fragments: 0,
    won: false,
    lost: false,
  })

  return (
    <PlayContext.Provider value={[play, setPlay]}>
      <MapContext.Provider value={[map, setMap]}>
        <Header title='Azrael' />
        <Dom>
          <Component {...pageProps} />
        </Dom>
        {Component?.r3f && <LCanvas>{Component.r3f(pageProps)}</LCanvas>}
      </MapContext.Provider>
    </PlayContext.Provider>
  )
}

export default App
