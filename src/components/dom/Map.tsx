import { Objects } from '@/data/enums'
import { getCookie, setCookie } from 'cookies-next'
import { useContext, useReducer, useRef, useState } from 'react'
import Pixel from './Pixel'
import { MapContext, PlayContext } from '@/lib/context'
import level from '@/data/level.json'
import { useRouter } from 'next/router'

export default function Map({ edit, setEdit }) {
  const [penColor, setPenColor] = useState('black')
  const [map, setMap] = useContext(MapContext)
  const [play, setPlay] = useContext(PlayContext)
  const router = useRouter()

  const editCommit = () => {
    setEdit(false)
    setCookie('1', map)
  }

  const editCancel = () => {
    setEdit(false)
    setMap(JSON.parse(String(getCookie('1'))))
  }

  const levelExport = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(map)
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = 'data.json'
    link.click()
  }

  const levelImport = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = async (e) => {
      setMap(JSON.parse(String(e.target.result)))
    }
    reader.readAsText(file)
  }
  const hiddenFileInput = useRef(null)
  const handleClick = (event) => {
    hiddenFileInput.current.click()
  }

  const levelClear = () => {
    setMap(
      Array.from({ length: 16 }, () =>
        Array.from({ length: 16 }, () => 'white')
      )
    )
  }

  const levelReset = () => {
    setMap(level)
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-4'>
        {edit && (
          <div className='flex flex-col justify-center gap-4'>
            <button onClick={() => levelClear()}>Clear</button>
            <button onClick={() => levelReset()}>Reset</button>
            <>
              <button onClick={handleClick}>Import</button>
              <input
                type='file'
                ref={hiddenFileInput}
                style={{ display: 'none' }}
                onChange={levelImport}
                accept='.json'
              />
            </>
            <button onClick={() => levelExport()}>Export</button>
          </div>
        )}
        <div className='flex flex-col border-8 border-black'>
          {map.map((row, i) => {
            return (
              <ol className='flex flex-row' key={i}>
                {row.map((color, j) => {
                  return (
                    <Pixel
                      key={j}
                      i={i}
                      j={j}
                      penColor={penColor}
                      edit={edit}
                    />
                  )
                })}
              </ol>
            )
          })}
        </div>
        {edit && (
          <div className='flex flex-col justify-center gap-4'>
            {Object.entries(Objects).map(([key, value]) => {
              return (
                <button
                  key={key}
                  onClick={() => setPenColor(value.description)}
                >
                  {key}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <div className='flex flex-row justify-center p-4 gap-4'>
        {edit ? (
          <>
            <button onClick={() => editCommit()}>Save</button>
            <button onClick={() => editCancel()}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => router.push('/play')}>Play</button>
            <button onClick={() => setEdit(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  )
}
