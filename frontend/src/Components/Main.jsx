import React, { useState } from 'react';
import Button from './Button';
import axios from 'axios';
import { FaLocationDot } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa6";
import {useSelector} from 'react-redux';
const Main = () => {
  const [prices, setPrices] = useState()
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [error, setError] = useState('')
  const user = useSelector((state) => state.user);

  const calculatePrice = async () => {
    if (!pickup || !drop) { 
      setError("Please enter both locations.");
      return;
    }
    try {
      const response = await axios(`${import.meta.env.VITE_BACKEND_URL}/calculate-booking-price`,{pickupLo},{
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ pickup, drop }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPrices(data.price);
    } catch (error) {
      console.error('Error fetching prices:', error); 
      alert('Failed to fetch prices. Please try again later.');
    }
  };

  return (
    <div className="bg-black/90 h-svh text-white  space-y-4 flex flex-col items-center justify-center">
      <h1 className='text-3xl md:text-5xl font-bold'>Your ride, on demand</h1>
      <p className=' md:text-xl font-semibold'>Get a reliable ride in minutes, anytime, anywhere.</p>

      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded">
         <FaLocationDot/>

          <input
            type="text"
            placeholder="Enter pickup location"
            id="pick-up"
            required
            className='border-none outline-none bg-transparent '
           
          />
        </div>

        <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded">
          <FaLocationArrow/>

          <input
          className='border-none outline-none bg-transparent'
            type="text"
            placeholder="Enter destination"
            id="drop"
            required
            
          />
        </div>
      </div>
     
      <Button text="See Prices" className={`mt-2`}
      onClick={calculatePrice}/>
       {prices && (
        <span className="mt-4 ">  
          Estimated Price: ${prices}
        </span>
      )}
    </div>
  );
};

export default Main;