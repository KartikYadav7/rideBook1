import { Link } from 'react-router-dom'
const Error = () => {
  return (
    <>
      <section className ="h-svh bg-black/80 space-y-4
      flex flex-col items-center justify-center text-white">
      <p className='text-7xl font-medium text-primary'>Error 404</p>
      <p className="text-xl">The Page you're looking for either not exixts or shifted to  a new url</p>
        <Link to="/" className="text-white underline text-xl">Back to Home</Link>
      </section>
    </>
  )
}

export default Error
