import { Link } from 'react-router-dom'
const Error = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-12 flex flex-col items-center space-y-6">
        <p className='text-5xl md:text-7xl font-bold text-primary'>Error 404</p>
        <p className="text-lg md:text-xl text-center text-gray-700">The page you're looking for either does not exist or has shifted to a new URL.</p>
        <Link to="/" className="text-primary underline text-lg md:text-xl font-semibold">Back to Home</Link>
      </div>
    </section>
  )
}

export default Error
