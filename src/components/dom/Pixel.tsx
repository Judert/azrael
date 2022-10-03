import { useState } from 'react'

export default function Pixel({ color, penColor, edit }) {
  const [pixelColor, setPixelColor] = useState(color)
  const [oldColor, setOldColor] = useState(pixelColor)
  const [canChangeColor, setCanChangeColor] = useState(true)

  function applyColor() {
    setPixelColor(penColor)
    setCanChangeColor(false)
  }

  function changeColorOnHover() {
    setOldColor(pixelColor)
    setPixelColor(penColor)
  }

  function resetColor() {
    if (canChangeColor) {
      setPixelColor(oldColor)
    }
    setCanChangeColor(true)
  }

  return (
    <div
      className='w-6 h-6 border-2 border-black'
      onClick={edit ? applyColor : () => {}}
      onMouseEnter={edit ? changeColorOnHover : () => {}}
      onMouseLeave={edit ? resetColor : () => {}}
      style={{ backgroundColor: pixelColor }}
    ></div>
  )
}
