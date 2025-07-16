import React from "react";
import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import { Link } from "react-router-dom";
import PasswordInput from "../Components/PasswordInput";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <>
      <section className="py-8 rounded-xl shadow-lg bg-[#e9f5ff] max-w-md mx-auto gap-y-4 translate-y-50 md:translate-y-20">
        <h2 className=" text-center text-5xl font-medium text-primary mb-6">
          Login
        </h2>

        <form
          onSubmit={handleSubmit((data) => console.log(data))}
          className="space-y-4 px-16"
        >
          <div className="space-y-1 flex flex-col text">
            <label htmlFor="email" className="text-primary">
              Email
            </label>
            <input
              className=" bg-white w-full border-none rounded-lg px-4 py-2"
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              {...register("email")}
            />
            {/* <p className="text-xs text-red-500 min-h-2.5">
              {errors?.email?.message}
            </p> */}
          </div>

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            register={register}
            error={errors?.password}
            required
            // validation={{
            //   required: "Password is required",
            // }}
          />

          <Button
            type="submit"
            text={isSubmitting ? "logging In" : "Login"}
            disabled={isSubmitting}
            className={`w-full`}
          />
        </form>
            <p className="text-center"><Link to="/resetPassword" className="text-primary hover:underline">Forgot Password?</Link></p>
        <p className="text-center text-xl text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </section>
    </>
  );
};

export default Login;
