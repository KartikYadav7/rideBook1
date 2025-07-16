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

}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex flex-col space-y-1">
      <label  htmlFor={name} className="text-primary mb-1">
        {label}
      </label>
      <input
      required={required}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full bg-white rounded-lg px-4 py-2 border-none"
        {...register(name, validation)}
      />
      <div className="absolute right-6 top-[40px] text-gray-600 cursor-pointer">
        {showPassword ? (
          <FaRegEye onClick={() => setShowPassword(false)} />
        ) : (
          <FaRegEyeSlash onClick={() => setShowPassword(true)} />
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
};


export default PasswordInput;