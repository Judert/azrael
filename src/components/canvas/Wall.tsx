import { useBox } from '@react-three/cannon'

export const Walls = ({ positions }) => {
  return positions.map((position, index) => (
    <Wall key={index} position={position} />
  ))
}

export const Wall = (props) => {
  const [ref] = useBox(() => ({ type: 'Static', ...props }))
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[2, 3, 2]} />
      <meshPhysicalMaterial color='grey' roughness={1} />
    </mesh>
  )
}
