import { useState } from "react";

const ComplaintPage = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    mileage: "",
    complaint: "",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [sessionId, setSessionId] = useState("");

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "make" || name === "model" || name === "mileage") {
      const { make, model, mileage } = { ...formData, [name]: value };
      if (make && model && mileage) {
        await fetchSearchApi(make, model, mileage);
      }
    }
  };

  const fetchSearchApi = async (make, model, mileage) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ make, model, mileage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch search data");
      }

      const data = await response.json();
      setSessionId(data.session_id || "");
      if (data.session_id && formData.complaint) {
        await fetchRecommendApi(data.session_id, formData.complaint);
      }
    } catch (error) {
      console.error("Error in search API:", error);
    }
  };

  const fetchRecommendApi = async (session_id, complaint) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/recommend/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id, complaint }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendation || []);
    } catch (error) {
      console.error("Error in recommend API:", error);
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
    console.log({ ...formData, selectedOptions, sessionId });
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

        {recommendations.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h2 className="font-bold mb-2">Here are some common issues:</h2>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    value={rec}
                    onChange={handleCheckboxChange}
                    className="mr-2 accent-[#0E61A4]"
                  />
                  <label>{rec}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h2 className="font-extrabold mb-2">Complaint Box</h2>
          <ul className="list-none space-y-1">
            <li>
              <span className="font-semibold">Complaint:</span>{" "}
              {formData.complaint || ""}
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
    </section>
  );
};

export default ComplaintPage;

// import { useState } from "react";

// const ComplaintPage = () => {
//   const [formData, setFormData] = useState({
//     make: "",
//     model: "",
//     mileage: "",
//     complaint: "",
//   });
//   const [recommendations, setRecommendations] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (
//       name === "make" ||
//       name === "model" ||
//       name === "mileage" ||
//       name === "complaint"
//     ) {
//       updateRecommendations(
//         formData.make,
//         formData.model,
//         formData.mileage,
//         formData.complaint
//       );
//     }
//   };

//   const updateRecommendations = (make, model, mileage, complaint) => {
//     if (make && model && mileage && complaint) {
//       setRecommendations([
//         "Check Engine Light On",
//         "Strange Noises",
//         "Fuel Efficiency Issues",
//         "Battery Problem",
//         "Oil Problem",
//       ]);
//     } else {
//       setRecommendations([]);
//     }
//   };

//   const handleCheckboxChange = (e) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setSelectedOptions([...selectedOptions, value]);
//     } else {
//       setSelectedOptions(selectedOptions.filter((option) => option !== value));
//     }
//   };

//   const handleSubmit = () => {
//     console.log({ ...formData, selectedOptions });
//   };

//   return (
//     <section className="max-w-4xl mx-auto my-10 p-6 border-2 border-gray-400 rounded-md">
//       <h1 className="text-2xl font-extrabold mb-4 text-center">
//         Please Register Your Complaint Here
//       </h1>
//       <div className="space-y-4">
//         {["make", "model", "mileage", "complaint"].map((field, idx) => (
//           <div key={idx} className="flex flex-col">
//             <label className="font-medium mb-1">
//               Your Car's {field.charAt(0).toUpperCase() + field.slice(1)}:
//             </label>
//             <input
//               type="text"
//               name={field}
//               placeholder={`Enter car's ${field}`}
//               value={formData[field]}
//               onChange={handleInputChange}
//               className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E61A4]"
//             />
//           </div>
//         ))}

//         {recommendations.length > 0 && (
//           <div className="mt-4 border-t pt-4">
//             <h2 className="font-bold mb-2">Here are some common issues:</h2>
//             <div className="space-y-2">
//               {recommendations.map((rec, idx) => (
//                 <div key={idx} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     value={rec}
//                     onChange={handleCheckboxChange}
//                     className="mr-2 accent-[#0E61A4]"
//                   />
//                   <label>{rec}</label>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="mt-6 border-t pt-4">
//           <h2 className="font-extrabold mb-2">Complaint Box</h2>
//           <ul className="list-none space-y-1">
//             <li>
//               <span className="font-semibold">Complaint:</span>{" "}
//               {formData.complaint || ""}
//             </li>
//             <li>
//               <span className="font-semibold">Selected Options:</span>{" "}
//               {selectedOptions.length > 0 ? selectedOptions.join(", ") : "None"}
//             </li>
//           </ul>
//         </div>

//         <div className="flex justify-end">
//           <button
//             onClick={handleSubmit}
//             className="mt-2 px-6 py-2 bg-[#0E61A4] text-white rounded-md hover:bg-[#09487d]"
//           >
//             Submit
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ComplaintPage;
