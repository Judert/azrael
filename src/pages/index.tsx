import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Roof } from '@/components/canvas/Roof'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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
const Page = (props) => {
  return (
    <>
      <></>
    </>
  )
}

// canvas components goes here
// It will receive same props as Page component (from getStaticProps, etc.)
Page.r3f = (props) => <Scene {...props} />

export default Page

const Scene = (props) => {
  const router = useRouter()
  const { level } = router.query

  useEffect(() => {
    if (level) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target.result
        console.log(text)
        alert(text)
      }
      reader.readAsText(e.target.files[0])
    }
  }, [level])

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
