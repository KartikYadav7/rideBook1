import { useState, useRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({
  label,
  name,
  className,
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
      <label htmlFor={name} className="text-primary font-medium">
        {label}
      </label>
      <input
        required={required}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`bg-blue-50 w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...register(name, {
          required: required && `${label} is required`,
          ...validation,
        })}
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
  className,
  validation,
  options = [],
  ...rest
}) => (
  <div className="space-y-1">
    <label className="block text-sm text-primary font-medium">{label}</label>
    {type === "textarea" ? (
      <textarea
        placeholder={`Write something`}
        className={`w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-y text-base`}
        {...register(name, {
          required: required && `${label} is required`,
          ...validation,
        })}
        {...rest}
      />
    ) : type === "select" ? (
      <select
        {...register(name, {
          required: required && `${label} is required`,
          ...validation
        })}
        {...rest}
        className="w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-primary">
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        placeholder={`Enter ${label} `}
        className={`w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary  ${className}`}
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


const PlaceAutocompleteInput = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  className,
  placeholder
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef();

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/places-autocomplete?input=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setSuggestions(data.predictions || []);
    } catch (e) {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setShowDropdown(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.description || suggestion);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <>
      <div className="relative space-y-1">
        <label className="block text-sm text-primary font-medium">{label}</label>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          required={required}
          placeholder={placeholder || `Enter ${label}`}
          className={`w-full border border-blue-200 rounded-lg px-4 py-2 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
          autoComplete="off"
          onFocus={() => value && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 bg-white border border-blue-200 rounded shadow mt-1 max-h-48 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <li
                key={s.place_id || idx}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                onClick={() => handleSelect(s)}
              >
                {s.description || s.structured_formatting?.main_text || s}
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs mb-2 text-red-500 h-2.5">{error?.message}</p>

      </div>

    </>
  );
};

export { PasswordInput, InputField, PlaceAutocompleteInput, };