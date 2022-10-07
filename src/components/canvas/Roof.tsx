import { useBox } from '@react-three/cannon'

export const Roof = (props) => {
  const [ref] = useBox(() => ({ type: 'Static', ...props }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[36, 1, 36]} />
      <meshPhysicalMaterial color='grey' roughness={1} />
    </mesh>
  )
}
