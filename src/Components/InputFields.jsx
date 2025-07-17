import { useState } from "react";
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({
  label,
  name,
  placeholder,
  register,
  error,
  validation,
  required,
  ...rest

}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex flex-col space-y-1">
      <label  htmlFor={name} className="text-primary font-medium">
        {label}
      </label>
      <input
      required={required}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="bg-blue-50 w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        {...register(name, validation)}
        {...rest}
      />
      <div className="absolute right-6 top-[40px] text-gray-600 cursor-pointer">
        {showPassword ? (
          <FaRegEye onClick={() => setShowPassword(false)} />
        ) : (
          <FaRegEyeSlash onClick={() => setShowPassword(true)} />
        )}
      </div>
      <p className="text-xs text-red-500 mb-2 h-2.5">{error?.message}</p>
    </div>
  );
};



const InputField = ({
  label,
  type = "text",
  name,
  register,
  error,
  required,
  validation,
  ...rest
}) => (
  <div className="space-y-1">
    <label className="block text-sm text-primary font-medium">{label}</label>
    {type === "textarea" ? (
      <textarea
      placeholder={`Write something`}
        className="w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y text-base "
        {...register(name, {
          required: required && `${label} is required`,
          ...validation,
        })}
        {...rest}
      />
    ) : (
      <input
        type={type}
        placeholder={`Enter ${label} `}
        className="w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary"
        {...register(name, {
          required: required && `${label} is required`,
          ...validation,
        })}
        {...rest}
      />
    )}
    <p className="text-xs mb-2 text-red-500 h-2.5">{error?.message}</p>
  </div>
);

export {PasswordInput, InputField};