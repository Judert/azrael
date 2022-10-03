import { Objects } from '@/data/enums'
import { getCookie } from 'cookies-next'
import { useContext, useReducer, useState } from 'react'
import * as fs from 'fs'
import Pixel from './Pixel'
import { v4 as uuidv4 } from 'uuid'
import { MapContext } from '@/lib/context'

export default function Map({ edit, setEdit }) {
  const [penColor, setPenColor] = useState('black')
  const [map, setMap] = useContext(MapContext)

  const editCancel = () => {
    setEdit(false)
    setMap(JSON.parse(String(getCookie('1'))))
  }

  const levelExport = () => {
    fs.writeFile('./1.json', JSON.stringify(map), (err) => {
      if (err) alert('Error writing file:' + JSON.stringify(err))
    })
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row gap-4'>
        {edit && (
          <div className='flex flex-col justify-center gap-4'>
            <button onClick={() => setEdit(false)}>Clear</button>
            <button onClick={() => setEdit(false)}>Reset</button>
            <button onClick={() => setEdit(false)}>Import</button>
            <button onClick={() => levelExport()}>Export</button>
          </div>
        )}
        <div className='flex flex-col'>
          {map.map((row, i) => {
            return (
              <ol className='flex flex-row' key={i}>
                {row.map((color, j) => {
                  return (
                    <Pixel
                      key={j}
                      //   color={color}
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
            <button onClick={() => {}}>Save</button>
            <button onClick={() => editCancel()}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => {}}>Play</button>
            <button onClick={() => setEdit(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  )
}
