import { MapContext } from '@/lib/context'
import { useContext, useEffect, useState } from 'react'

export default function Pixel({ i, j, penColor, edit }) {
  const [map, setMap] = useContext(MapContext)

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
      onClick={edit ? () => setColor(penColor) : () => {}}
      style={{ backgroundColor: map[i][j] }}
    ></div>
  )
}
