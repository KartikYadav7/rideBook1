import React from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import Button from "../Components/Button";
import {InputField} from '../Components/InputFields'

const BookingForm = () => {
  const location = useLocation();
  const formType = location?.state?.formType || "";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting,isSubmitSuccessful },
  } = useForm();

  const onSubmit = (data) => {
    console.log(`${formType} Data:`, data);
    reset();
  };

  const titleMap = {
    package: "Send Package",
    ride: "Book Now",
    reservation: "Reserve Ride",
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
          {titleMap[formType]}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          

          {formType === "package" && (
            <>
              <InputField
                label="Sender Name"
                name="senderName"
                register={register}
                error={errors.senderName}
                required
              />

              <InputField
                label="Receiver Name"
                name="receiverName"
                register={register}
                error={errors.receiverName}
                required
              />
               <InputField
                label="Contact No."
                name="contact"
                placeholder="Enter Contact Details"
                register={register}
                error={errors.contact}
                required
              />
              
              <InputField
                label="Pickup Location"
                name="pickupLocation"
                register={register}
                error={errors.pickupLocation}
                required
              />
              <InputField
                label="Drop Location"
                name="dropLocation"
                register={register}
                error={errors.dropLocation}
          required
              />
             
              <InputField
                label="Weight (kg)"
                name="weight"
                type="number"
                step="0.1"
                register={register}
                error={errors.weight}
                required
              />
            </>
          )}
          {/* Hire Specific */}
          {(formType === "reservation" || formType === "ride") && (
            <>
              <InputField
                label="Full Name"
                name="fullName"
                register={register}
                error={errors.fullName}
                required
              />
              <InputField
                label="Pickup Location"
                name="pickupLocation"
                register={register}
                error={errors.pickupLocation}
                required
              />
              <InputField
                label="Drop Location"
                name="dropLocation"
                register={register}
                error={errors.dropLocation}
          required
              />
             
              {formType === "reserve" && (
                <>
                  <InputField
                    label="Date"
                    name="Date"
                    type="date"
                    register={register}
                    error={errors.Date}
                    required
                  />
                  <InputField
                    label="No. of Peoples"
                    name="peoples"
                    type="number"
                    register={register}
                    error={errors.peoples}
                    required
                  />
                </>
              )}
            </>
          )}
          <InputField
            label="Additional Note "
            name="note"
            type="textarea"
            register={register}
            error={errors.note}
          />
          <Button
            type="submit"
            text={isSubmitting ? "Submitting..." : titleMap[formType]}
            disabled={isSubmitting}
            className="w-full"
          />
           {/* {isSubmitSuccessful && (
          <p className="text-green-600 text-center mt-2">
           { `Thank You for booking a ${titleMap[formType]}.Please Check Your Email for further details.`}
          </p>
        )} */}
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
