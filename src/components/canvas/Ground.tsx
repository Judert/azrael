import { usePlane } from '@react-three/cannon'

export const Ground = (props) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <planeGeometry args={[36, 36]} />
      <meshPhysicalMaterial roughness={1} color='grey' />
    </mesh>
  )
}
