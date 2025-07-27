import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { FaLocationArrow } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Main = () => {
  const [data, setData] = useState();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((state) => state.user);

  // Autocomplete states
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);
  const pickupTimeoutRef = useRef();
  const dropTimeoutRef = useRef();

  const fetchSuggestions = async (query, setSuggestions) => {
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

  const handlePickupChange = (e) => {
    const val = e.target.value;
    setPickup(val);
    setShowPickupDropdown(true);
    clearTimeout(pickupTimeoutRef.current);
    pickupTimeoutRef.current = setTimeout(() => fetchSuggestions(val, setPickupSuggestions), 300);
  };

  const handleDropChange = (e) => {
    const val = e.target.value;
    setDrop(val);
    setShowDropDropdown(true);
    clearTimeout(dropTimeoutRef.current);
    dropTimeoutRef.current = setTimeout(() => fetchSuggestions(val, setDropSuggestions), 300);
  };

  const handlePickupSelect = (suggestion) => {
    setPickup(suggestion.description || suggestion);
    setShowPickupDropdown(false);
    setPickupSuggestions([]);
  };

  const handleDropSelect = (suggestion) => {
    setDrop(suggestion.description || suggestion);
    setShowDropDropdown(false);
    setDropSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    if (!pickup || !drop) {
      setError("Please Enter Location")
      return
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/calculate-booking-price`,
        {
          pickupLocation: pickup,
          dropLocation: drop,
          bookingType: "ride",
        },
        {
          headers: {
            Authorization: `${user.token}`,
          },
        }
      );

      setData(response.data);
      setSuccess(true);
    } catch (err) {
      setError("Failed to fetch prices. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <section className="bg-black/90 h-svh text-white  space-y-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold">Your ride, on demand</h1>
        <p className=" md:text-xl font-semibold">
          Get a reliable ride in minutes, anytime, anywhere.
        </p>

        <form
          className="mt-4 space-y-4 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="relative">
            <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded">
              <FaLocationDot />
              <input
                type="text"
                name="pickup"
                placeholder="Enter pickup location"
                id="pick-up"
                value={pickup}
                required
                className="border-none outline-none bg-transparent"
                onChange={handlePickupChange}
                onFocus={() => pickup && setShowPickupDropdown(true)}
                onBlur={() => setTimeout(() => setShowPickupDropdown(false), 200)}
                autoComplete="off"
              />
            </div>
            {showPickupDropdown && pickupSuggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded shadow mt-1 max-h-48 overflow-y-auto text-black">
                {pickupSuggestions.map((s, idx) => (
                  <li
                    key={s.place_id || idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handlePickupSelect(s)}
                  >
                    {s.description || s.structured_formatting?.main_text || s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded">
              <FaLocationArrow />
              <input
                type="text"
                name="drop"
                placeholder="Enter destination"
                id="drop"
                value={drop}
                required
                className="border-none outline-none bg-transparent"
                onChange={handleDropChange}
                onFocus={() => drop && setShowDropDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropDropdown(false), 200)}
                autoComplete="off"
              />
            </div>
            {showDropDropdown && dropSuggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded shadow mt-1 max-h-48 overflow-y-auto text-black">
                {dropSuggestions.map((s, idx) => (
                  <li
                    key={s.place_id || idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleDropSelect(s)}
                  >
                    {s.description || s.structured_formatting?.main_text || s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {success ? (
            <>
              {" "}
              {data && (
                <span className="text-primary">
                  Price: ₹{data.price} | Distance: {data.distance} | Time:{" "}
                  {data.duration}
                </span>
              )}
            </>
          ) : (
            <Button
              text={loading ? "Calculating" : "See Prices"}
              className={`w-1/2 mt-2`}
              type="submit"
              disabled={loading}
            />
          )}
        </form>
        {<span className="text-red-500 h-2.5 text-xs">{error}</span>}
      </section>
    </>
  );
};

export default Main;
