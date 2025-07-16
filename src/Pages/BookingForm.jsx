import React from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import Button from "../Components/Button";

const InputField = ({
  label,
  type = "text",
  name,
  register,
  error,
  required,
  validation,
  ...rest
}) => (
  <div className="space-y-1">
    <label className="block text-sm text-gray-700">{label}</label>
    <input
      type={type}
      className="w-full border rounded p-2"
      {...register(name, {
        required: required && `${label} is required`,
        ...validation,
      })}
      {...rest}
    />
    {error && <p className="text-red-500 text-xs">{error.message}</p>}
  </div>
);

const BookingForm = () => {
  const location = useLocation();
  console.log(location);
  const formType = location?.state?.formType || "";
  console.log(formType);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log(`${formType} Data:`, data);
    reset();
  };

  const titleMap = {
    package: "Send Package",
    ride: "Book Now",
    reserve: "Reserve Ride",
  };

  return (
    <section className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-5xl font-medium text-primary mb-6 text-center">
        {titleMap[formType]}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Common Fields */}
        {formType === "package" && (
          <>
            <InputField
              label="Sender Name"
              name="senderName"
              register={register}
              error={errors.name}
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
        {(formType === "reserve" || formType === "ride") && (
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
              name="pickupAddress"
              register={register}
              error={errors.pickupAddress}
              required
            />
            <InputField
              label="Drop Location"
              name="destinationAddress"
              register={register}
              error={errors.destinationAddress}
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
      </form>
    </section>
  );
};

export default BookingForm;
