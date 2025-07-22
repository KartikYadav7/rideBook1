import React from "react";
import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput, InputField } from "../Components/InputFields";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/userSlice";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error,} = useSelector((state) => state.user);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
    // error is handled by Redux state
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-10 space-y-2">
        <h2 className="text-center text-4xl font-bold text-primary mb-2">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            placeholder="Enter Your Email"
            required
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            register={register}
            error={errors?.password}
            required
          />

         <p className="text-red-500 h-2.5 text-sm mb-2">{error}</p>

          <Button
            type="submit"
            text={status === "loading" || isSubmitting ? "Logging In..." : "Login"}
            disabled={status === "loading" || isSubmitting}
            className="w-full"
          />
        </form>
        <p className="text-center">
          <Link to="/resetPassword" className="text-primary hover:underline">
            Forgot Password?
          </Link>
        </p>
        <p className="text-center text-base text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
