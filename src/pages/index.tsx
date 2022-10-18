import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { getCookie, setCookie, hasCookie } from 'cookies-next'
import Map from '@/components/dom/Map'
import { MapContext, PlayContext } from '@/lib/context'
import level from '@/data/level.json'
import Container from '@/components/dom/Container'

export const getStaticProps = () => {
  return {
    props: {
      title: 'Index',
    },
  }
}

export default function Page(props) {
  const [edit, setEdit] = useState(false)
  const [map, setMap] = useContext(MapContext)
  const [play, setPlay] = useContext(PlayContext)

  useEffect(() => {
    if (!hasCookie('1')) {
      setCookie('1', level)
    }
    setMap(JSON.parse(String(getCookie('1'))))
  }, [])

  return (
    <Container>
      <div className='flex flex-row mb-4 gap-4'>
        <h1 className='text-5xl font-extrabold'>AZRAEL</h1>
        <InfoButton />
      </div>
      <div className='flex flex-col justify-center max-w-xl p-4 items-left gap-4'>
        <h2 className='text-3xl font-bold'>Completed {play.completed}/3</h2>
        <Map edit={edit} setEdit={setEdit} />
      </div>
    </Container>
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
        stroke-width='1.5'
        stroke='currentColor'
        className='w-6 h-6'
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
        />
      </svg>

      <span className='sr-only'>Icon description</span>
    </button>
  )
}
