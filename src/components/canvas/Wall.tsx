import { useTexture } from '@react-three/drei'
import { useBox } from '@react-three/cannon'

export const Walls = ({ positions }) => {
  return positions.map((position, index) => (
    <Wall key={index} position={position} />
  ))
}

export const Wall = (props) => {
  const [ref] = useBox(() => ({ type: 'Static', ...props }))
  // const texture = useTexture({
  //   map: './assets/ground/diff.jpg',
  //   normalMap: './assets/ground/norm.jpeg',
  //   roughnessMap: './assets/ground/rough.jpg',
  //   displacementMap: './assets/ground/disp.png',
  // })
  return (
    // <mesh ref={ref} receiveShadow castShadow>
    //   {[...Array(6)].map((side, index) => (
    //     <meshStandardMaterial
    //       //   attach={`material-${index}`}
    //       key={index}
    //       // {...texture}
    //       color='grey'
    //       displacementScale={0}
    //     />
    //   ))}
    //   <boxGeometry args={[1, 1, 1]} />
    // </mesh>
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[2, 3, 2]} />
      <meshPhysicalMaterial color='grey' roughness={1} />
    </mesh>
  )
}
