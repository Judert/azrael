export default function ButtonColor({ name, color }) {
  return (
    <button
      className={`text-white bg-gradient-to-r from-${color}-500 via-${color}-600 to-${color}-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-${color}-300 dark:focus:ring-${color}-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
    >
      {name}
    </button>
  )
}
