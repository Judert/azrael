import { Objects } from '@/data/enums'
import { getCookie } from 'cookies-next'
import { useState } from 'react'
import * as fs from 'fs'
import Pixel from './Pixel'

export default function Map({ edit, setEdit, mapOriginal }) {
  const [penColor, setPenColor] = useState('black')
  const [map, setMap] = useState(mapOriginal)

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
          {map.map((row, index) => {
            return (
              <ol className='flex flex-row' key={index}>
                {row.map((color, index) => {
                  return (
                    <Pixel
                      key={index}
                      color={color}
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
