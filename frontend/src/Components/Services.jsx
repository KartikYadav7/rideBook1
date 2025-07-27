import React from 'react'
import { BsCalendar2CheckFill } from "react-icons/bs";
import { BsBox2Fill } from "react-icons/bs";
import Button from './Button'
import { useNavigate } from 'react-router-dom';

const Component = ({ icon, text, description, button, form }) => {
  const navigate = useNavigate()

  return (
    <>
      <div className="bg-white text-black rounded-xl shadow-lg p-8 transition-transform  relative overflow-hidden text-center flex flex-col items-center">
        <div className="text-5xl text-primary mb-4">{icon}</div>
        <h3 className=" font-semibold text-xl mb-3">{text}</h3>
        <p className="text-[#666] text-base mb-4">{description}</p>
        <Button text={button} onClick={() => {
          navigate("/bookingForm", { state: { formType: `${form}` } });
        }} />
      </div>
    </>
  )
}
const Services = () => {
  return (
    <>
      <section className="bg-[#f9f9f9] py-12 text-center">
        <h2 className="heading ml-4 text-left">Suggestions</h2>
        <div className="flex flex-col gap-4   ">

          <Component button="Send Package"
            text="Package"
            description="Send and receive packages with ease and reliability."
            icon={<BsBox2Fill />}
            form="package" />

          <Component button="Reserve Now"
            text="Reserve"
            description="Reserve a ride for your special events or appointments."
            icon={<BsCalendar2CheckFill />}
            form="reservation" />

        </div>
      </section>

    </>
  )
}

export default Services
