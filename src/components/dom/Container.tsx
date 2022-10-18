export default function Container(props) {
  return (
    <main className='w-full h-full text-white bg-gray-900'>
      <div className='container flex flex-col items-center justify-center p-4 mx-auto'>
        {props.children}
      </div>
    </main>
  )
}
