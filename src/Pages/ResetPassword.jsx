import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import { PasswordInput, InputField } from "../Components/InputFields";

const ResetPasswordModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();
  return (
    <>
      <section className="py-8  rounded-xl shadow-lg bg-[#e9f5ff] max-w-md mx-auto space-y-4 translate-y-20">
        <h2 className=" text-center text-4xl font-medium text-primary mb-6">
          Reset Password
        </h2>
        <form
          onSubmit={handleSubmit((data) => console.log(data))}
          className="space-y-2 px-16"
        >
          <InputField
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            placeholder="Enter Your Email"
            required
          />

          <Button
            type="submit"
            className={`w-full`}
            text={isSubmitting ? "Submitting..." : "Reset Password"}
            disabled={isSubmitting}
          />
          {isSubmitSuccessful && (
            <p className="text-green-600 text-center mt-2">
              Please Check Your Email
            </p>
          )}
        </form>
      </section>
    </>
  );
};

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const newPassword = watch("password");

  const onSubmit = (data) => {
    console.log("Reset Password Data:", data);
  };
  return (
    <section className="py-8 rounded-xl shadow-lg bg-[#e9f5ff] max-w-lg mx-auto  translate-y-20">
      <h2 className="text-center text-4xl font-medium text-primary mb-6">
        Reset Your Password
      </h2>

      <form className="space-y-2 px-16">

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
                v.length <= 20 || "Password must be at most 20 characters",
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
              value === passwordValue || "Passwords do not match",
          }}
        />
        {errors?.confirmPassword && (
          <p className="text-sm text-red-500 mb-2 h-2.5">{errors.confirmPassword.message}</p>
        )}
        <Button
          type="submit"
          text={isSubmitting ? "Submitting..." : "Reset Password"}
          disabled={isSubmitting}
          className="w-full"
        />
      </form>
    </section>
  );
};

export { ResetPasswordModal, ResetPasswordPage };
