import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
const Navbar = () => {
  const [toggle, setToggle] = useState(false)
  return (
    <>
      <nav className='flex items-center justify-between px-8 md:px-0 md:justify-around text-white bg-primary'>
        <div className='flex items-center'><img src="/ridebook.svg" alt="logo" className='h-18 w-18 rounded-full mx-2'/><span className='text-3xl font-bold'>RideBook</span></div>

       <ul className='hidden md:flex gap-4'>
          <li><Link to ="/" className='hover:bg-white/40 p-2 rounded'>Home</Link></li>
          <li><Link to ="/" className='hover:bg-white/40 p-2 rounded'>My Rides</Link></li>
          <li><Link to ="/" className='hover:bg-white/40 p-2 rounded'>Help</Link></li>
          <li><Link to ="/login" className='hover:bg-white/40 p-2 px-4 border rounded'>Login</Link></li>
          <li className=''><Link to ="/signup" className='p-2 px-4 border rounded bg-amber-300'>SignUp</Link></li>
        </ul>

          <div className='md:hidden text-2xl cursor-pointer' onClick={() => setToggle(!toggle)}>
          {toggle ? <FaTimes /> : <FaBars />}
        </div>
        {toggle && (
       <ul className='space-y-2 absolute top-18 right-0 w-full bg-primary text-white flex flex-col gap-y-2 p-4 md:hidden z-10 shadow-lg'>
          <li><Link to ="/" className='hover:bg-white/40 p-2 rounded'>Home</Link></li>
          <li><Link to ="/" className='hover:bg-white/40 p-2 rounded'>My Rides</Link></li>
          <li><Link to ="/" className='hover:bg-white/40 p-2 rounded'>Help</Link></li>
          <li><Link to ="/login" className=' hover:bg-white/40 p-2 px-4 border rounded'>Login</Link></li>
          <li className=''><Link to ="/signup" className='p-2 px-4 border rounded bg-amber-300'>SignUp</Link></li>
        </ul>
        )}
      </nav>
    </>
  )
}

export default Navbar
