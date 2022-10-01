import { Ground } from '@/components/canvas/Ground'
import { Player } from '@/components/canvas/Player'
import { Wall } from '@/components/canvas/Wall'
import { Physics } from '@react-three/cannon'
import { Sky } from '@react-three/drei'
import dynamic from 'next/dynamic'

// Dynamic import is used to prevent a payload when the website start that will include threejs r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
// const Shader = dynamic(() => import('@/components/canvas/Shader/Shader'), {
//   ssr: false,
// })

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
Page.r3f = (props) => (
  <>
    <Sky sunPosition={[100, 20, 100]} />
    <ambientLight intensity={0.3} />
    <Physics>
      <Player />
      <Wall position={[0, 0, -2]} />
      <Ground />
    </Physics>
  </>
)

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}
