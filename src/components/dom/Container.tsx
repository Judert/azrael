export default function Container(props) {
  return (
    <main className='w-full h-full text-white bg-neutral-900'>
      <div className='container flex flex-col items-center justify-center p-4 mx-auto gap-4'>
        {props.children}
      </div>
    </main>
  )
}
