import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import PasswordInput from "../Components/PasswordInput";

const ResetPasswordModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  return (
    <>
      <section className="py-8  rounded-xl shadow-lg bg-[#e9f5ff] max-w-md mx-auto space-y-4 translate-y-20">
        <h2 className=" text-center text-5xl font-medium text-primary mb-6">
          Reset Password
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
           
          </div>
          <Button
            type="submit"
            className={`w-full`}
            text={isSubmitting ? "Submitting..." : "Reset Password"}
            disabled={isSubmitting}
          />
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
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch("password");

  const onSubmit = (data) => {
    console.log("Reset Password Data:", data);
  }
    return (
      <section className="py-8 rounded-xl shadow-lg bg-[#e9f5ff] max-w-lg mx-auto space-y-4 translate-y-20">
        <h2 className="text-center text-5xl font-medium text-primary mb-6">
          Reset Your Password
        </h2>

        <form  className="space-y-4 px-16">
          <PasswordInput
            label="Password"
            name="password"
            required
            placeholder="Enter New password"
            register={register}
            error={errors?.password}
            validation={{
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
          />

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
                value === newPassword || "Passwords do not match",
            }}
          />
          {console.log(errors?.confirmPassword?.message)}
          <p>{errors?.confirmPassword?.message}</p>
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
