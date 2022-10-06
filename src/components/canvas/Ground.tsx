import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { usePlane } from '@react-three/cannon'

export const Ground = (props) => {
  const texture = useTexture({
    map: './assets/ground/diff.jpg',
    normalMap: './assets/ground/norm.jpeg',
    roughnessMap: './assets/ground/rough.jpg',
    displacementMap: './assets/ground/disp.png',
  })
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <planeGeometry args={[36, 36]} />
      <meshStandardMaterial
        roughness={1}
        // {...texture}
        color='grey'
      />
    </mesh>
  )
}
