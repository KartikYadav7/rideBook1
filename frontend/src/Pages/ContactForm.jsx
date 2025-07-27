import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import { useSelector } from "react-redux";
import { InputField } from "../Components/InputFields";
import axios from "axios";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = async (data) => {
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/contact`,
        data,
        { headers: { Authorization: `${user.token}` } }
      );
      if (response) setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <section className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-10 my-12">
      <h2 className="text-4xl font-bold text-primary mb-6 text-center">
        Contact Us
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {!success ? (
          <>
            <InputField
              label="Name"
              name="name"
              register={register}
              error={errors.name}
              placeholder={`Enter Your Name`}
              required
            />
            <InputField
              label="Email"
              name="email"
              register={register}
              error={errors.email}
              placeholder="Enter Your Email"
              required
            />

            <InputField
              label="Subject"
              name="subject"
              register={register}
              error={errors.subject}
              required
            />

            <InputField
              label="Message"
              name="message"
              type="textarea"
              register={register}
              error={errors.message}
              placeholder="Write Your Queries"
              required
            />
            <p className="text-xs text-red-500 h-2.5 mb-0">{error}</p>
            <Button
              type="submit"
              text={isSubmitting ? "Sending..." : "Send Message"}
              disabled={isSubmitting}
              className="w-full mt-2"
            />
          </>
        ) : (
          <>
            <p className="text-green-500">
              ThankYou for Contacting Us. We'll reach out to you shortly.
            </p>
          </>
        )}
      </form>
    </section>
  );
};

export default ContactForm;
