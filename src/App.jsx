import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [candidateName, setCandidateName] = useState("");
  const [testNumber, setTestNumber] = useState(""); // Test number field
  const [testDate, setTestDate] = useState("");
  const [answers, setAnswers] = useState(Array(40).fill("")); // Array for 40 answers

  // Handle answer input change
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Reset the form
  const resetForm = () => {
    setCandidateName("");
    setTestNumber("");
    setTestDate("");
    setAnswers(Array(40).fill(""));
  };

  // Download PDF
  const downloadPDF = async () => {
    try {
      const response = await axios.post(
        "https://ielts-practice-backend.onrender.com/generate-pdf", // Updated URL
        { candidateName, testNumber, testDate, answers },
        { responseType: "blob" }
      );

      // Dynamic file name
      const fileName = `${candidateName || "Candidate"}_${
        testNumber || "Test"
      }.pdf`;
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  // Download Excel
  const downloadExcel = async () => {
    try {
      const response = await axios.post(
        "https://ielts-practice-backend.onrender.com/generate-excel", // Updated URL
        { candidateName, testNumber, testDate, answers },
        { responseType: "blob" }
      );

      // Dynamic file name
      const fileName = `${candidateName || "Candidate"}_${
        testNumber || "Test"
      }.xlsx`;
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading Excel:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        IELTS Listening Practice
      </h1>

      {/* Candidate Details */}
      <div className="bg-white p-2 shadow-md rounded-lg mb-4">
        <h2 className="text-lg font-bold mb-4">Candidate Details</h2>
        <div>
          <label className="block ">Candidate Name:</label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block ">Test Number:</label>
          <input
            type="text"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block ">Test Date:</label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Answer Section */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-bold mb-2">Answer Sheet</h2>

        {/* Two-Column Layout for Answers */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column: 1-20 */}
          <div>
            {answers.slice(0, 20).map((answer, index) => (
              <div key={index} className="flex items-center mb-1">
                <label className="w-8 text-right mr-2">{index + 1}:</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}
          </div>

          {/* Right Column: 21-40 */}
          <div>
            {answers.slice(20).map((answer, index) => (
              <div key={index} className="flex items-center mb-1">
                <label className="w-8 text-right mr-2">{index + 21}:</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) =>
                    handleAnswerChange(index + 20, e.target.value)
                  }
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 text-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600"
          onClick={downloadExcel}
        >
          Download Excel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
