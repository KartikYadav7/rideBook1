
import { Link } from 'react-router-dom'
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
const Footer = () => {
  return (
    <>
     <footer className="bg-black text-white md:px-32 flex-wrap py-8 px-6 ">
<div className='grid grid-cols-2  md:flex justify-around '>
        <div className="space-y-4 ">
          <h1 className='font-bold'>Company</h1>
          <ul className='space-y-4'>
            <li><Link to="">About Us</Link></li>
            <li><Link to="">Careers</Link></li>
            <li><Link to="">Blog</Link></li>
            <li><Link to="">Press</Link></li>
            <li><Link to="">Investors</Link></li>
            <li><Link to="">Gift Cards</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h1 className='font-bold'>Products</h1>
          <ul className='space-y-4'>
            <li><Link to="">Ride</Link></li>
            <li><Link to="">Eat</Link></li>
            <li><Link to="">Business</Link></li>
            <li><Link to="">Freight</Link></li>
            <li><Link to="">Bike & Scooter</Link></li>
          </ul>
        </div>

        <div className="space-y-4 mt-4">
          <h1 className='font-bold'>Support</h1>
          <ul className='space-y-4'>
            <li><Link to="">Help Center</Link></li>
            <li><Link to="">Safety</Link></li>
            <li><Link to="">Accessibility</Link></li>
            <li><Link to="">Community Guidelines</Link></li>
          </ul>
        </div>

        <div className="space-y-4 mt-4">
          <h1 className='font-bold'>Follow Us</h1>
          <ul className=" flex space-x-4">
            <li>
              <Link to=""><FaInstagram/></Link>
            </li>
            <li>
              <Link to=""><FaXTwitter/></Link>
            </li>
            <li>
              <Link to=""><FaLinkedin/></Link>
            </li>
            
          </ul>
        </div>
</div>
    
       <hr className='w-full text-gray-300 my-4'/>

      <div className=" text-center py-2 space-y-2">
       
          <p>&copy; 2024 RideBook. All rights reserved.</p>
          <p>
            <Link to="">Privacy Policy</Link> | <Link to="">Terms of Service</Link>
          </p>
       
      </div>

    </footer> 
    </>
  )
}

export default Footer