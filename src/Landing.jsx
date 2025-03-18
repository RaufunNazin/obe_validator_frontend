import React, { useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Landing = () => {
  const nav = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state === "login") {
      toast.success("Logged in successfully");
    }
  }, [state]);

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable={true}
        pauseOnHover={false}
        theme="colored"
      />
      {/* Navbar */}
      <div className="flex justify-center w-full py-5 pl-10 md:pl-0">
        <div className="text-3xl text-main cursor-pointer font-sourGummy">
          OBE Validator
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col-reverse md:flex-row justify-around items-center h-full">
        <div className="flex flex-col justify-center items-center py-10 w-full">
          <div className="flex flex-col gap-5 items-center md:items-start">
            <div className="text-4xl md:text-7xl text-main -mt-3">Analyze,</div>
            <div className="text-4xl md:text-7xl text-main -mt-3">Validate,</div>
            <div className="text-xl md:text-2xl text-gray-800 ">
              and Ensure OBE Alignment with AI!
            </div>
            <button
              onClick={() => nav("/validator")}
              className="bg-main text-white px-10 py-5 rounded-md text-xl duration-200 transition-all cursor-pointer"
            >
              Try OBE Validator Now
            </button>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <DotLottieReact
            src="https://lottie.host/437af140-d06e-4de9-8e56-d20a2ad94c7b/RuZg79uH4y.lottie"
            loop
            autoplay
            className="w-[500px] md:w-[700px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
