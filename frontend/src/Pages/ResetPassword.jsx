import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import { PasswordInput, InputField } from "../Components/InputFields";
import axios from "axios";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

const ResetPasswordModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const onSubmit = async (data) => {
    setError("");
    setSuccess(false);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/resetPasswordLink`,
        { email: data.email }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send reset link.");
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl sm:p-10 space-y-2">
          <h2 className=" text-center text-4xl font-bold text-primary mb-6">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!success ? (
              <>
                <InputField
                  label="Email"
                  name="email"
                  register={register}
                  error={errors.email}
                  placeholder="Enter Your Email"
                  className={`mb-0`}
                  required
                />
                <p className="text-red-500 text-xs absolute h-2.5">{error}</p>
                <Button
                  type="submit"
                  className={`w-full`}
                  text={isSubmitting ? "Submitting..." : "Reset Password"}
                  disabled={isSubmitting}
                />
              </>
            ) : (
              <p className="text-green-600 text-center mt-2">
                Please Check Your Email for Reset Link
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const newPassword = watch("password");
  const { token } = useParams();

  const onSubmit = async (data) => {
    setError("");
    setSuccess(false);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/resetPassword/${token}`,
        { newPassword: data.password }
      );

      reset();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-10 space-y-2">
        <h2 className="text-center text-4xl font-bold text-primary mb-2">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!success ? (
            <>
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter new password"
                required
                register={register}
                error={errors?.password}
                validation={{
                  validate: {
                    minLength: (v) =>
                      v.length >= 6 || "Password must be at least 6 characters",
                    maxLength: (v) =>
                      v.length <= 20 ||
                      "Password must be at most 20 characters",
                    hasUpperCase: (v) =>
                      /[A-Z]/.test(v) || "Must include an uppercase letter",
                    hasLowerCase: (v) =>
                      /[a-z]/.test(v) || "Must include a lowercase letter",
                    hasNumber: (v) => /\d/.test(v) || "Must include a number",
                    hasSpecialChar: (v) =>
                      /[@$!%*?&]/.test(v) ||
                      "Must include a special character (@$!%*?&)",
                  },
                }}
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                register={register}
                error={errors?.confirmPassword}
                validation={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                }}
              />

              <p className="text-red-500 text-sm h-2.5  mb-2">{error}</p>

              <Button
                type="submit"
                text={isSubmitting ? "Submitting..." : "Reset Password"}
                disabled={isSubmitting}
                className="w-full"
              />
            </>
          ) : (
            <>
              <p className="text-green-600 text-center mt-2">
                Password Reset Successfull !!
              </p>
              <p className="text-2xl text-center text-primary hover:underline mt-4 font-bold">
                <Link to="/login">Login</Link>
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export { ResetPasswordModal, ResetPasswordPage };
