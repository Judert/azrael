import { useTexture } from '@react-three/drei'
import { useBox } from '@react-three/cannon'

export const Box = (props) => {
  const [ref] = useBox(() => ({ mass: 5, type: 'Dynamic', ...props }))
  // const texture = useTexture({
  //   map: './assets/ground/diff.jpg',
  //   normalMap: './assets/ground/norm.jpeg',
  //   roughnessMap: './assets/ground/rough.jpg',
  //   displacementMap: './assets/ground/disp.png',
  // })
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color='white' />
    </mesh>
  )
}
