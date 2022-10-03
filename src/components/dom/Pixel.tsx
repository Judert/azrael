import { MapContext } from '@/lib/context'
import { useContext, useState } from 'react'

export default function Pixel({ i, j, penColor, edit }) {
  const [map, setMap] = useContext(MapContext)
  // const [pixelColor, setPixelColor] = useState()
  const [oldColor, setOldColor] = useState(map[i][j])
  const [canChangeColor, setCanChangeColor] = useState(true)

  function applyColor() {
    setColor(penColor)
    setCanChangeColor(false)
  }

  function changeColorOnHover() {
    setOldColor(map[i][j])
    setColor(penColor)
  }

  function resetColor() {
    if (canChangeColor) {
      setColor(oldColor)
    }
    setCanChangeColor(true)
  }

  function setColor(newColor) {
    setMap(
      map.map((row, r) =>
        row.map((color, c) => (r === i && c === j ? newColor : color))
      )
    )
  }

  return (
    <div
      className='w-6 h-6 border-2 border-black'
      onClick={edit ? applyColor : () => {}}
      onMouseEnter={edit ? changeColorOnHover : () => {}}
      onMouseLeave={edit ? resetColor : () => {}}
      style={{ backgroundColor: map[i][j] }}
    ></div>
  )
}
