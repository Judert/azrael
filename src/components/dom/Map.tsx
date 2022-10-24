import { Objects } from '@/data/enums'
import { getCookie, setCookie } from 'cookies-next'
import { useContext, useRef, useState } from 'react'
import Pixel from './Pixel'
import { MapContext } from '@/lib/context'
import { useRouter } from 'next/router'
import ButtonColor from './ButtonColor'
import { getInitialGrid, getNewGridWithMaze } from '@/lib/astar'
import { recursiveDivisionMaze } from '@/lib/maze'

export default function Map() {
  const [edit, setEdit] = useState(false)
  const [penColor, setPenColor] = useState('black')
  const [map, setMap] = useContext(MapContext)
  const router = useRouter()
  const [error, setError] = useState([])

  const editCommit = () => {
    setError([])
    // check that the map contains only 4 fragments, 1 player, 1 enemy and 1 beacon
    let counts = {
      hotpink: 0,
      cyan: 0,
      green: 0,
      red: 0,
    }
    map.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== 'white' && cell !== 'black') {
          counts[cell]++
        }
      })
    })
    let error = false
    if (counts['hotpink'] !== 4) {
      setError((prev) => [...prev, 'Level must contain 4 fragments'])
      error = true
    }
    if (counts['cyan'] !== 1) {
      setError((prev) => [...prev, 'Level must contain 1 player'])
      error = true
    }
    if (counts['green'] !== 1) {
      setError((prev) => [...prev, 'Level must contain 1 beacon'])
      error = true
    }
    if (counts['red'] !== 1) {
      setError((prev) => [...prev, 'Level must contain Azrael'])
      error = true
    }

    if (!error) {
      setEdit(false)
      setCookie('level', map, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
    }
  }

  const editCancel = () => {
    setEdit(false)
    setMap(JSON.parse(String(getCookie('level'))))
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
    if (file === undefined) return
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

  return (
    <div className='flex flex-col gap-4'>
      {edit && (
        <div className='flex flex-row gap-1'>
          <button
            className='btn-outline'
            onClick={() => setMap(levelGenerate())}
          >
            Generate
          </button>
          <button className='btn-outline' onClick={() => levelClear()}>
            Clear
          </button>
          {/* <button className='btn-outline' onClick={() => levelReset()}>
            Reset
          </button> */}
          <>
            <button className='btn-outline' onClick={handleClick}>
              Import
            </button>
            <input
              type='file'
              ref={hiddenFileInput}
              style={{ display: 'none' }}
              onChange={levelImport}
              accept='.json'
            />
          </>
          <button className='btn-outline' onClick={() => levelExport()}>
            Export
          </button>
        </div>
      )}
      <div className='flex flex-row gap-4'>
        <div className='flex flex-col border-8 border-black rounded-lg shadow-md shadow-black'>
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
          <div className='flex flex-col justify-center gap-1'>
            {Object.entries(Objects).map(([key, value]) => {
              return (
                <ButtonColor
                  key={key}
                  name={key}
                  color={value.description}
                  onClick={() => setPenColor(value.description)}
                />
              )
            })}
          </div>
        )}
      </div>
      {error.map((err, i) => {
        return (
          <p key={i} className='text-red-500'>
            {err}
          </p>
        )
      })}
      <div className='flex flex-row gap-1'>
        {edit ? (
          <>
            <button className='btn-primary' onClick={() => editCommit()}>
              Save
            </button>
            <button className='btn-outline' onClick={() => editCancel()}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className='btn-primary'
              onClick={() => router.push('/play')}
            >
              Play
            </button>
            <button className='btn-outline' onClick={() => setEdit(true)}>
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export const levelGenerate = () => {
  let grid = getInitialGrid(16, 16)
  const walls = recursiveDivisionMaze(grid, grid[0][0], grid[15][15])
  grid = getNewGridWithMaze(grid, walls)
  let map = Array.from({ length: 16 }, () =>
    Array.from({ length: 16 }, () => 'white')
  )
  map[0][0] = 'cyan'
  map[15][15] = 'red'
  let beacon = []
  let topleft = []
  let topright = []
  let bottomleft = []
  let bottomright = []
  for (let i = grid.length - 1; i >= 0; i--) {
    for (let j = grid[i].length - 1; j >= 0; j--) {
      if (i === 0 && j === 0) {
        continue
      } else if (i === 15 && j === 15) {
        continue
      } else if (grid[i][j].isWall) {
        map[i][j] = 'black'
      }
      // if index is in the center quadrant, make it green
      else if (i > 5 && i < 10 && j > 5 && j < 10) {
        beacon.push([i, j])
      } else if (i < 5 && j < 5) {
        topleft.push([i, j])
      } else if (i < 5 && j > 10) {
        topright.push([i, j])
      } else if (i > 10 && j < 5) {
        bottomleft.push([i, j])
      } else if (i > 10 && j > 10) {
        bottomright.push([i, j])
      }
    }
  }
  // pick a random index of each list and make it green
  let random = beacon[Math.floor(Math.random() * beacon.length)]
  map[random[0]][random[1]] = 'green'
  random = topleft[Math.floor(Math.random() * topleft.length)]
  map[random[0]][random[1]] = 'hotpink'
  random = topright[Math.floor(Math.random() * topright.length)]
  map[random[0]][random[1]] = 'hotpink'
  random = bottomleft[Math.floor(Math.random() * bottomleft.length)]
  map[random[0]][random[1]] = 'hotpink'
  random = bottomright[Math.floor(Math.random() * bottomright.length)]
  map[random[0]][random[1]] = 'hotpink'
  return map
}
