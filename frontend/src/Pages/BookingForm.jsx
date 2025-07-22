import { useState,} from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import {InputField, PlaceAutocompleteInput} from '../Components/InputFields'
import axios from "axios";
import { useSelector } from "react-redux";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formType = location?.state?.formType || "";
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting},
    watch,
    setValue,
  } = useForm();

  const titleMap = {
    package: "Send Package",
    ride: "Book Now",
    reservation: "Reserve Ride",
  };

  const [priceInfo, setPriceInfo] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");
  
  // Use React Hook Form's watch to observe field values
  const pickup = watch("pickupLocation");
  const drop = watch("dropLocation");
  const weight = watch("weight");
  const people = watch("people");

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");

  // Helper to check if all required fields are filled
  const isReady = () => {
    if (formType === "ride") {
      return pickup && drop && watch("dropLocation");
    } else if (formType === "reservation") {
      return pickup && drop && watch("people") && watch("date") && watch("dropLocation");
    } else if (formType === "package") {
      return pickup && drop && weight && watch('weight') && watch("dropLocation");
    }
    return false;
  };

  // Handler to fetch price info on blur
  const fetchPriceInfo = async () => {
    if (!isReady()) {
      setPriceInfo(null);
      return;
    }
    setLoadingPrice(true);
    setPriceError("");
    try {
      const payload = {
        bookingType: formType,
        pickupLocation: pickup,
        dropLocation: drop,
        weight: formType === "package" ? weight : 0,
        people: formType === "reservation" ? people : 1,
      };
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/calculate-booking-price`, payload,  {headers:{Authorization:user.token}});
      setPriceInfo(res.data);
    
    } catch (err) {
      setPriceInfo(null);
      setPriceError("Could not fetch price info");
    } finally {
      setLoadingPrice(false);
    }
  };

   const onSubmit = async(data) => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }
      let payload = {
        ...data,
        user: user.userId,
        bookingType: formType,
        weight: formType === "package" ? data.weight : 0,
        people: formType === "reservation" ? data.people : 1,
      };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-checkout-session`, 
      payload,{headers:{Authorization:`${user.token}`}});
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: response.data.id });
    } catch (error) {
      console.error('Stripe checkout error:', error);
      // alert('Something went wrong. Please try again.');
    }
    finally{
        reset();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-10 ">

        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 text-center">
          {titleMap[formType]}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          

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
              
              <PlaceAutocompleteInput
                label="Pickup Location"
                name="pickupLocation"
                value={pickupLocation}
                onChange={val => { setPickupLocation(val); setValue("pickupLocation", val, { shouldValidate: true }); }}
                error={errors.pickupLocation?.message}
                required
              />
              <PlaceAutocompleteInput
                label="Drop Location"
                name="dropLocation"
                value={dropLocation}
                onChange={val => { setDropLocation(val); setValue("dropLocation", val, { shouldValidate: true }); }}
                error={errors.dropLocation?.message}
                required
              />
             
              <InputField
                label="Weight (kg)"
                name="weight"
                type="number"
                step="0.1"
                register={register}
                error={errors.weight}
                 onBlur={fetchPriceInfo}
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
              <PlaceAutocompleteInput
                label="Pickup Location"
                name="pickupLocation"
                value={pickupLocation}
                onChange={val => { setPickupLocation(val); setValue("pickupLocation", val, { shouldValidate: true }); }}
                error={errors.pickupLocation?.message}
                required
              />
              <PlaceAutocompleteInput
                label="Drop Location"
                name="dropLocation"
                value={dropLocation}
                onChange={val => { setDropLocation(val); setValue("dropLocation", val, { shouldValidate: true }); }}
                error={errors.dropLocation?.message}
          required
                onBlur={fetchPriceInfo}
              />
             
              {formType === "reservation" && (
                <>
                  <InputField
                    label="Date"
                    name="date"
                    type="date"
                    register={register}
                    error={errors.date}
                    required
                  />
                  <InputField
                    label="No. of People"
                    name="people"
                    type="number"
                    register={register}
                    error={errors.people}
                    onBlur={fetchPriceInfo}
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
          {/* Show price, distance, and time info */}
          <div className="my-4">
            {loadingPrice && <div className="text-primary">Loading price info...</div>}
            {priceError && <div className="text-red-500">{priceError}</div>}
            {priceInfo && (
              <div className="bg-blue-50 rounded p-3 text-center">
                <p className="text-primary font-medium">Price: ₹{priceInfo.price}</p>
                <p className="text-primary font-medium">Distance: {priceInfo.distance} km</p>
                <p className="text-primary font-medium">Estimated Time:{priceInfo.duration}</p>
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            text={isSubmitting ? "Submitting..." : titleMap[formType]}
            disabled={isSubmitting}
            className="w-full"
          />

        </form>

      </div>
    </section>
  );
};

export default BookingForm;
