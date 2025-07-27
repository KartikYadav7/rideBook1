import React from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
const rideOptions = [
  {
    name: "Standard Ride",
    description: "Comfortable and affordable ride.",
    price: "$10",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Premium Ride",
    description: "Luxury vehicle with extra comfort.",
    price: "$20",
    image: "https://images.unsplash.com/photo-1709774378962-171db2614a30?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "SUV Ride",
    description: "Spacious vehicle for larger groups.",
    price: "$30",
    image: "https://images.unsplash.com/photo-1694059812161-a36a20c14c5b?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
]

const SelectRide = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="bg-[#f9f9f9] py-8 text-center">
        <h2 className="heading">Select Your Ride</h2>
        <div className="flex flex-wrap justify-around gap-8">
          {rideOptions.map((ride, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-[#f0f4f8] rounded-xl shadow-lg p-8 w-88 transition-transform hover:-translate-y-1 hover:shadow-2xl">


              <img src={ride.image} className="w-full h-[200px] object-cover rounded-2xl" />
              <h3 className="text-xl text-primary font-medium my-3">{ride.name}</h3>
              <p className="text-black/70">{ride.description}</p>
              <div className="font-bold text-lg my-2">Price:{ride.price}</div>
              <Button text="Book Now" onClick={() => {
                navigate("/bookingForm", { state: { formType: "ride" } });
              }} />
            </div>
          ))}
        </div>

      </section>
    </>
  )
}

export default SelectRide
