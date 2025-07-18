import React, { useState } from 'react';
import Button from './Button';
import { FaLocationDot } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa6";

const Main = () => {
  const [prices, setPrices] = useState()
  return (
    <div className="bg-black/90 h-svh text-white  space-y-4 flex flex-col items-center justify-center">
      <h1 className='text-3xl md:text-5xl font-bold'>Your ride, on demand</h1>
      <p className='text-lg md:text-xl font-semibold'>Get a reliable ride in minutes, anytime, anywhere.</p>

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
     
      <Button text="See Prices" className={`mt-2`}/>
       {prices && (
        <span className="mt-4 ">  
          Estimated Price: ${prices}
        </span>
      )}
    </div>
  );
};

export default Main;