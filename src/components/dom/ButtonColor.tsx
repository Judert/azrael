const colors = {
  white:
    'text-white bg-gradient-to-r from-neutral-500 via-neutral-600 to-neutral-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-neutral-300 dark:focus:ring-neutral-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2',
  black:
    'text-white bg-gradient-to-r from-neutral-700 via-neutral-800 to-neutral-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-neutral-400 dark:focus:ring-neutral-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2',
  hotpink:
    'text-white bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2',
  green:
    'text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2',
  cyan: 'text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2',
  red: 'text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2',
}

export default function ButtonColor({ name, color, onClick }) {
  return (
    <button onClick={onClick} className={colors[color]}>
      {name}
    </button>
  )
}
