import React from "react";
import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import { InputField } from "../Components/InputFields";
const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = (data) => {
    // Here you would send data to your backend or email service
    console.log("Contact Form Data:", data);
    reset();
  };

  return (
    <section className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-10 my-12">
      <h2 className="text-4xl font-bold text-primary mb-6 text-center">
        Contact Us
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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

        <Button
          type="submit"
          text={isSubmitting ? "Sending..." : "Send Message"}
          disabled={isSubmitting}
          className="w-full mt-2"
        />
        {isSubmitSuccessful && (
          <p className="text-green-600 text-center mt-2">
            Thank you for contacting us! We will get back to you soon.
          </p>
        )}
      </form>
    </section>
  );
};

export default ContactForm;
