import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { getCookie, setCookie, hasCookie } from 'cookies-next'
import Map, { levelGenerate } from '@/components/dom/Map'
import { MapContext, PlayContext } from '@/lib/context'
import Container from '@/components/dom/Container'

export default function Page(props) {
  const [play, setPlay] = useContext(PlayContext)
  const [map, setMap] = useContext(MapContext)

  useEffect(() => {
    if (hasCookie('completed')) {
      setPlay({ ...play, completed: getCookie('completed') })
    }
    if (hasCookie('level')) {
      setMap(JSON.parse(String(getCookie('level'))))
    } else {
      const map = levelGenerate()
      setMap(map)
      setCookie('level', map, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
    }
  }, [])

  return (
    <Container>
      <div className='flex flex-row items-center justify-center gap-4'>
        <Logo />
        <h1 className='text-5xl font-extrabold'>AZRAEL</h1>
        <InfoButton />
      </div>
      <div className='flex flex-col mt-4 gap-4'>
        <h2 className='text-3xl font-bold'>Completed {play.completed}/3</h2>
        {map && <Map />}
      </div>
      <p className='mt-4 font-light text-gray-400'>
        {'Copyright © '}{' '}
        <a className='hover:underline' href='https://veselcode.com'>
          veselcode.
        </a>{' '}
        {new Date().getFullYear()}
      </p>
    </Container>
  )
}

function Logo() {
  return (
    <div className='flex w-10 h-10 fill-white'>
      <svg version='1.1' id='svg5' xmlns='http://www.w3.org/2000/svg'>
        <path
          id='path327'
          transform='matrix(0.11477094,0,0,0.13252607,11.81424,-6.730097)'
          d='M 114.88762,50.783193 71.322586,126.24005 27.757551,50.783194 Z m 0,75.456847 L 71.322586,201.6969 27.757551,126.24005 Z M 5.9750309,239.42532 -37.590003,163.96847 -81.155038,239.42532 Z m 217.8251791,0 -43.56504,-75.45685 -43.56503,75.45685 z M -102.93756,50.783193 71.320955,352.61169 245.58397,50.783193 H 158.45468 L 71.320955,201.69548 -15.808334,50.783193 Z'
        />
      </svg>
    </div>
  )
}

function InfoButton() {
  const router = useRouter()

  return (
    <button
      type='button'
      className='btn-icon'
      onClick={() => router.push('/story')}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-6 h-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
        />
      </svg>
      <span className='sr-only'>Icon description</span>
    </button>
  )
}
