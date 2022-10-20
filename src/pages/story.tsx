import Container from '@/components/dom/Container'
import { useRouter } from 'next/router'

export const getStaticProps = () => {
  return {
    props: {
      title: 'Story',
    },
  }
}

export default function Page(props) {
  return (
    <Container>
      <div className='flex flex-row items-center justify-center gap-4'>
        <InfoButton />
        <h1 className='text-5xl font-extrabold'>Backstory</h1>
      </div>
      <p className='max-w-lg text-xl font-normal text-center text-neutral-400'>
        Azrael is tasked with transporting souls of the deceased to the
        afterlife. Escape death by collecting all the fragments and use the
        beacon to go back to Earth.
      </p>
    </Container>
  )
}

function InfoButton() {
  const router = useRouter()
  return (
    <button type='button' className='btn-icon' onClick={() => router.push('/')}>
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
          d='M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3'
        />
      </svg>
      <span className='sr-only'>Icon description</span>
    </button>
  )
}
