import Header from '@/config'
import Dom from '@/components/layout/dom'
import '@/styles/index.css'
import dynamic from 'next/dynamic'
import { MapContext } from '@/lib/context'
import { useState } from 'react'
import level from '@/data/level.json'

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: true,
})

function App({ Component, pageProps = { title: 'index' } }) {
  const [map, setMap] = useState(level)
  return (
    <MapContext.Provider value={[map, setMap]}>
      <Header title={pageProps.title} />
      <Dom>
        <Component {...pageProps} />
      </Dom>
      {Component?.r3f && <LCanvas>{Component.r3f(pageProps)}</LCanvas>}
    </MapContext.Provider>
  )
}

export default App
