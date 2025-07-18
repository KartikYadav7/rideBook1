import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput, InputField } from "../Components/InputFields";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/userSlice";
import { useState } from "react";

const SignUp = () => {

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");
  const role = watch("role");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        data
      );

       {console.log("Navigating to /verification1");}
      const { userId, email: registeredEmail, isVerified } = res.data;
 { console.log("Navigating to /verification2");
}
      // Redux: Save user state (only userId, email, isVerified)
      dispatch(setUser({ userId, email: registeredEmail, isVerified }));
   {console.log("Navigating to /verification3");}
      navigate("/verification");
      reset();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Something went wrong";
      setError(msg);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-10 space-y-2">
        <h2 className="text-center text-4xl font-bold text-primary mb-2">
          SignUp
        </h2>

     
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Name"
            name="name"
            register={register}
            required
            error={errors.name}
            placeholder="Enter Your Name"
            validation={{
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            }}
          />

          <InputField
            label="Email"
            name="email"
            register={register}
            required
            error={errors.email}
            placeholder="Enter Your Email"
            validation={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
          />

          <PasswordInput
            label="Password"
            name="password"
            register={register}
            required
            placeholder="Enter your password"
            error={errors?.password}
            validation={{
              validate: {
                minLength: (v) =>
                  v.length >= 6 || "Minimum 6 characters required",
                maxLength: (v) =>
                  v.length <= 20 || "Maximum 20 characters allowed",
                hasUpperCase: (v) =>
                  /[A-Z]/.test(v) || "At least one uppercase letter",
                hasLowerCase: (v) =>
                  /[a-z]/.test(v) || "At least one lowercase letter",
                hasNumber: (v) =>
                  /\d/.test(v) || "At least one number",
                hasSpecialChar: (v) =>
                  /[@$!%*?&]/.test(v) ||
                  "Include a special character (@$!%*?&)",
              },
            }}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            register={register}
            required
            placeholder="Confirm your password"
            error={errors?.confirmPassword}
            validation={{
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
          />

          <InputField
            label="Select Your Role"
            type="select"
            name="role"
            register={register}
            error={errors?.role}
            required
            options={[
              { value: "", label: "Select a role" },
              { value: "user", label: "User" },
              { value: "drivingPartner", label: "Driving Partner" },
            ]}
          />

          {role === "drivingPartner" && (
            <InputField
              label="License Number"
              name="licenseNumber"
              register={register}
              required
              error={errors.licenseNumber}
              placeholder="Enter Your License Number"
              validation={{
                pattern: {
                  value: /^[A-Z]{2}\d{2}\d{4}\d{7}$/,
                  message: "Invalid license number format",
                },
              }}
            />
          )}
    
      <p className="text-red-500 h-2.5 mb-2 text-sm ">{error}</p>
        
          <Button
            type="submit"
            text={isSubmitting ? "Registering..." : "Sign Up"}
            disabled={isSubmitting}
            className="w-full"
          />
        </form>

        <p className="text-center text-gray-500 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );

};

export default SignUp;
