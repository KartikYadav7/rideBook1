import React from "react";
import { Link } from "react-router-dom";
const Download = () => {
  return (
    <>
      <section className="bg-[#f9f9f9] py-12 px-6 text-center">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-bold mb-4">It’s easier in the app</h2>
          <p className=" leading-relaxed">
            Download our app from your favorite store to book rides on the go.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="flex flex-col items-center justify-center p-4 rounded text-black "
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                className="w-28 "
              />
              Google Play
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center justify-center p-4 rounded text-black "
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                className="w-28"
              />
              APP Store
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Download;
