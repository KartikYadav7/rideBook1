import React, { useState } from 'react'
import { Link} from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/userSlice';

const Navbar = () => {
  const [toggle, setToggle] = useState(false)
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
 

  const handleLogout = async () => {
   dispatch(logoutUser());
  };

  return (
    <nav className='top-0 left-0 w-full z-50 bg-primary shadow-md'>
      <div className='flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto'>
        <div className='flex items-center'>
          <img src="/ridebook.svg" alt="logo" className='h-12 w-12 rounded-full mr-2'/>
          <span className='text-2xl md:text-3xl font-bold text-white'>RideBook</span>
        </div>
        <ul className='hidden md:flex gap-2 items-center'>
          <li><Link to ="/" className='text-white hover:bg-white/20 px-3 py-2 rounded transition'>Home</Link></li>
          <li><Link to ="/myRides" className='text-white hover:bg-white/20 px-3 py-2 rounded transition'>My Rides</Link></li>
          <li><Link to ="/" className='text-white hover:bg-white/20 px-3 py-2 rounded transition'>Help</Link></li>
          {user ? (
            <>
              <li className='text-white hover:bg-white/30 px-3 py-2 border rounded transition'>Hi,{user.userName}</li>
              <li><button onClick={handleLogout} className='text-white hover:bg-white/30 px-3 py-2 border rounded transition cursor-pointer'>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to ="/login" className='text-white hover:bg-white/30 px-3 py-2 border rounded transition'>Login</Link></li>
              <li><Link to ="/signup" className='text-primary bg-amber-300 px-3 py-2 border rounded font-semibold hover:bg-amber-200 transition'>SignUp</Link></li>
            </>
          )}
        </ul>
        <div className='md:hidden text-2xl text-white cursor-pointer' onClick={() => setToggle(!toggle)}>
          {toggle ? <FaTimes /> : <FaBars />}
        </div>

      </div>
      {/* Mobile Menu */}
      {toggle && (
        <div className='fixed inset-0 bg-black/40 z-40' onClick={() => setToggle(false)}></div>
      )}
      <ul className={`fixed top-0 right-0 h-full w-64 bg-primary text-white flex flex-col gap-y-4 p-8 md:hidden z-50 shadow-lg transform transition-transform duration-300 ${toggle ? 'translate-x-0' : 'translate-x-full'}`} style={{transitionProperty: 'transform'}}>
        <li><Link to ="/" className='text-white hover:bg-white/20 px-3 py-2 rounded transition' onClick={() => setToggle(false)}>Home</Link></li>
        <li><Link to ="/myRides" className='text-white hover:bg-white/20 px-3 py-2 rounded transition' onClick={() => setToggle(false)}>My Rides</Link></li>
        <li><Link to ="/" className='text-white hover:bg-white/20 px-3 py-2 rounded transition' onClick={() => setToggle(false)}>Help</Link></li>
        {user ? (
          <>
            <li className='text-white px-3 py-2 rounded transition'>Hi, {user.userName}</li>
            <li><button onClick={() => { setToggle(false); handleLogout(); }} className='text-white hover:bg-white/30 px-3 py-2 border rounded transition'>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to ="/login" className='text-white hover:bg-white/30 px-3 py-2 border rounded transition' onClick={() => setToggle(false)}>Login</Link></li>
            <li><Link to ="/signup" className='text-primary bg-amber-300 px-3 py-2 border rounded font-semibold hover:bg-amber-200 transition' onClick={() => setToggle(false)}>SignUp</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
