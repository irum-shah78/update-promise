import { useState } from "react";
import Loader from "../components/loader";

const ComplaintPage = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    mileage: "",
    complaint: "",
  });
  const [recommendations, setRecommendations] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    const { make, model, mileage, complaint } = formData;

    if (make && model && mileage && complaint) {
      setLoading(true);

      try {
        const response = await fetch("http://127.0.0.1:8000/recommend/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ make, model, mileage, complaint }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setRecommendations(data.recommendation);
        console.log("Recommendations:", data.recommendation);
      } catch (error) {
        console.error("Error in search API:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("All fields must be filled");
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedOptions((prev) => [...prev, value]);
    } else {
      setSelectedOptions((prev) => prev.filter((option) => option !== value));
    }
  };

  const handleSubmit = () => {
    console.log({ ...formData, selectedOptions });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 6000);
  };

  return (
    <section className="max-w-4xl mx-auto my-10 p-6 border-2 border-gray-400 rounded-md">
      <h1 className="text-2xl font-extrabold mb-4 text-center">
        Please Register Your Complaint Here
      </h1>
      <div className="space-y-4">
        {["make", "model", "mileage", "complaint"].map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="font-medium mb-1">
              Your Car's {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <input
              type="text"
              name={field}
              placeholder={`Enter car's ${field}`}
              value={formData[field]}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E61A4]"
            />
          </div>
        ))}

        <button
          onClick={handleSearch}
          className="mt-2 px-6 py-2 bg-[#0E61A4] text-white rounded-md hover:bg-[#09487d]"
        >
          Get Recommendation
        </button>

        {loading && (
          <>
            <Loader />
          </>
        )}

        {recommendations && !loading && (
          <div className="output">
            <h2 className="font-extrabold mb-2">Recommendations:</h2>
            <ul className="space-y-2">
              {Array.isArray(recommendations)
                ? recommendations.map((recommendation, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-3 text-gray-700"
                    >
                      <input
                        type="checkbox"
                        value={recommendation}
                        checked={selectedOptions.includes(recommendation)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#0E61A4] rounded-md accent-[#0E61A4]"
                      />
                      <span>{recommendation}</span>
                    </li>
                  ))
                : recommendations.split("\n").map((recommendation, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-3 text-gray-700"
                    >
                      <input
                        type="checkbox"
                        value={recommendation}
                        checked={selectedOptions.includes(recommendation)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-[#0E61A4] rounded-md accent-[#0E61A4]"
                      />
                      <span>{recommendation.trim()}</span>
                    </li>
                  ))}
            </ul>
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h2 className="font-extrabold mb-2">Complaint Summary</h2>
          <ul className="list-none space-y-1">
            <li>
              <span className="font-semibold">Complaint:</span>{" "}
              {formData.complaint || "None"}
            </li>
            <li>
              <span className="font-semibold">Selected Options:</span>{" "}
              {selectedOptions.length > 0 ? selectedOptions.join(", ") : "None"}
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="mt-2 px-6 py-2 bg-[#0E61A4] text-white rounded-md hover:bg-[#09487d]"
          >
            Submit
          </button>
        </div>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowPopup(false)}
        >
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="font-bold text-lg">Data Submitted Successfully!</h2>
            <p>Your complaints have been submitted.</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ComplaintPage;