import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Validator = () => {
  const nav = useNavigate();
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [questionFile, setQuestionFile] = useState(null);
  const [threshold, setThreshold] = useState(0.7);
  const [loading, setLoading] = useState(false);
  const [segmentGenerated, setSegmentGenerated] = useState(false);
  const [data, setData] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  // Handle file input change
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".txt")) {
      type === "syllabus" ? setSyllabusFile(file) : setQuestionFile(file);
    } else {
      toast.error("Please select a valid .txt file.");
    }
  };

  // Handle API call
  const validateOBE = () => {
    if (!syllabusFile || !questionFile) {
      toast.error("Please select both syllabus and question files.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("syllabus", syllabusFile);
    formData.append("questions", questionFile);
    formData.append("threshold", threshold);

    axios
      .post("obevalidatorbackend-production.up.railway.app/validate_obe/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setSegmentGenerated(true);
        setLoading(false);

        // Decode Base64 image
        if (response.data.confusion_matrix_image) {
          setImageSrc(
            `data:image/png;base64,${response.data.confusion_matrix_image}`
          );
        }

        toast.success("Validation successful!");
      })
      .catch((error) => {
        console.error("Error validating:", error);
        toast.error("Validation failed.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Navbar */}
      <div className="flex justify-center w-full py-5">
        <button
          className="text-3xl text-main cursor-pointer font-sourGummy"
          onClick={() => nav("/")}
        >
          OBE Validator
        </button>
      </div>

      <div className="flex flex-col justify-center items-center flex-1">
        {/* Main Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full gap-3 pb-20">
            <div className="text-2xl md:text-3xl text-main">Validating...</div>
            <DotLottieReact
              src="https://lottie.host/87e38207-ad14-49b1-9250-72055fe2b676/4PtGVH9oi0.lottie"
              loop
              autoplay
              className="w-[300px] md:w-[500px]"
            />
            <div className="text-sm md:text-lg text-gray-600">
              Please wait, this might take a few moments.
            </div>
          </div>
        ) : !segmentGenerated ? (
          <div className="flex flex-col justify-center items-center h-full gap-3 pb-20">
            <DotLottieReact
              src="https://lottie.host/20cccb68-feac-4dad-867e-152975b2c651/7PMHizDD3S.lottie"
              loop
              autoplay
              className="w-[300px] md:w-[500px]"
            />
            <div className="text-xl md:text-2xl text-main">
              Upload Syllabus & Questions
            </div>
            <div className="text-sm md:text-lg text-gray-600">
              Supported format: .txt
            </div>

            {/* File Inputs */}
            <div className="flex flex-col gap-4 mt-5 justify-center">
              <label className="border-2 border-main text-main px-5 py-1 rounded-lg cursor-pointer hover:bg-opacity-80 text-center">
                {syllabusFile ? syllabusFile.name : "Select Syllabus File"}
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "syllabus")}
                />
              </label>

              <label className="border-2 border-main text-main px-5 py-1 rounded-lg cursor-pointer hover:bg-opacity-80 text-center">
                {questionFile ? questionFile.name : "Select Question File"}
                <input
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "question")}
                />
              </label>

              <label className="text-main text-center">
                Alignment Threshold
              </label>
              <input
                type="number"
                className="border-2 border-main text-main px-5 py-1 rounded-lg text-center -mt-3"
                placeholder="Threshold (default: 0.7)"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />

              <button
                onClick={validateOBE}
                className="bg-main text-white px-10 py-3 rounded-md text-xl duration-200 transition-all cursor-pointer mt-5"
              >
                Validate OBE
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full gap-3 pb-20 px-1 md:px-0">
            <div className="text-lg md:text-xl text-main text-center -mb-5">
              Validation Results
            </div>

            {/* Question Results */}
            {data?.results && (
              <div className="mt-5 w-full md:w-3/4 overflow-auto">
                <table className="border w-full">
                  <thead>
                    <tr className="bg-main text-white">
                      <th className="border p-2">Question</th>
                      <th className="border p-2">Best Match</th>
                      <th className="border p-2">Similarity</th>
                      <th className="border p-2">Coherent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map((item, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{item.question}</td>
                        <td className="border p-2">
                          {item.best_matching_syllabus}
                        </td>
                        <td className="border p-2">{item.similarity_score}</td>
                        <td
                          className={`border p-2 ${
                            item.coherent === "Yes"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.coherent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Metrics */}
            {data && (
              <div className="text-lg md:text-xl text-white mt-5 py-2 text-center flex justify-around w-full md:w-3/4 bg-main">
                <div>
                  <strong>Accuracy:</strong> {data.accuracy}
                </div>
                <div>
                  <strong>Precision:</strong> {data.precision}
                </div>
                <div>
                  <strong>Recall:</strong> {data.recall}
                </div>
                <div>
                  <strong>F1 Score:</strong> {data.f1_score}
                </div>
              </div>
            )}

            {/* Displaying Image */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Confusion Matrix"
                className="w-full md:w-1/2 rounded-lg mt-5 border-2 border-main"
              />
            )}
            <button
              onClick={() => nav("/")}
              className="bg-main text-white px-10 py-5 rounded-md text-xl mt-5"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Validator;
