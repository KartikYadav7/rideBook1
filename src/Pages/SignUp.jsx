import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import { Link } from "react-router-dom";
import {PasswordInput, InputField} from "../Components/InputFields";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = watch("password");
  const role = watch("role");
  
  return (
    <>
      <section className="py-8  rounded-xl shadow-lg bg-[#e9f5ff] max-w-md mx-auto space-y-2 translate-y-32 md:translate-y-16">

        <h2 className=" text-center text-5xl font-medium text-primary mb-6">
          SignUp
        </h2>

        <form
          onSubmit={handleSubmit((data) => console.log(data))}
          className="space-y-1 px-16"
        >
          <div className="space-y-1 flex flex-col text">
            <label htmlFor="name" className="text-primary">
              Name
            </label>
            <input
              className=" bg-white w-full border-none rounded-lg px-4 py-2"
              type="text"
              placeholder="Enter your name"
              id="name"
              required
              {...register("name", {
                required: 'Name is Required', minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                }
              })}
            />
            <p className="text-xs text-red-500 min-h-2.5">
              {errors?.name?.message}
            </p>
          </div>

          <div className="space-y-1 flex flex-col">
            <label htmlFor="email" className="text-primary">
              Email
            </label>
            <input
            required
              className=" bg-white w-full border-none rounded-lg px-4 py-2"
              type="email"
              name="email"
              placeholder="Enter your email"
              {...register("email")}
    //           validation={{
    // pattern: {
    //   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    //   message: "Invalid email address"
    // }
            />
            <p className="text-xs text-red-500 min-h-2.5">
              {errors?.email?.message}
            </p>
          </div>

<div className="space-y-1">
          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            register={register}
            required
            error={errors?.password}
            validation={{
            required: "Password is required",
            validate: {
    minLength: (v) => v.length >= 6 || "Password must be at least 6 characters",
    maxLength: (v) => v.length <= 20 || "Password must be at most 20 characters",
    hasUpperCase: (v) => /[A-Z]/.test(v) || "Must include an uppercase letter",
    hasLowerCase: (v) => /[a-z]/.test(v) || "Must include a lowercase letter",
    hasNumber: (v) => /\d/.test(v) || "Must include a number",
    hasSpecialChar: (v) => /[@$!%*?&]/.test(v) || "Must include a special character (@$!%*?&)",
  }
            }}
          />
          </div>
<div className="space-y-1">
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            register={register}
            required
            error={errors?.confirmPassword}
            validation={{
              required: "Please confirm your password",
              validate: (value) =>
                value ===password || "Passwords do not match",
            }}
          /></div>


          <div className="space-y-1 flex flex-col text">
            <label htmlFor="role" className="text-primary">
              Role
            </label>
            <select
            required
              id="role"
              {...register("role")}
              className="bg-white w-full border-none rounded-lg px-4 py-2"
            >
              <option value="">Select a role</option>
              <option value="user">User</option>
              <option value="drivingPartner">Driving Partner</option>
            </select>

            {/* <p className="text-xs text-red-500 min-h-2.5">
              {errors?.role?.message}
            </p> */}
          </div>

          {role === "drivingPartner" && (
            <div className="space-y-1 flex flex-col text">
              <label htmlFor="licenseNumber" className="text-primary">
                License Number
              </label>
              <input
                className="bg-white w-full border rounded-lg px-4 py-2 border-none"
                required
                type="text"
                id="licenseNumber"
                placeholder="Enter your license number"
                {...register("licenseNumber", {
                  minLength: {
                    value: 6,
                    message: "License number must be at least 6 characters",
                  },
                })}
              />
              <p className="text-xs text-red-500 min-h-[1.25rem]">
                {errors.licenseNumber?.message}
              </p>
            </div>
          )}

          <Button type="submit" text={isSubmitting ? "Registering..." : "Sign Up"}
          disabled={isSubmitting} className={`w-full`} />
        </form>

        <p className="text-center  text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>

      </section>
    </>
  );
};

export default SignUp;
