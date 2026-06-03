import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const navigate = useNavigate();

  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/results", {
      state: {
        specialty,
        city,
        budget: Number(budget),
      },
    });
  };

  const handleEmergencySearch = () => {
    navigate("/results", {
      state: {
        emergencyOnly: true,
      },
    });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        Find Hospitals
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full border rounded p-3"
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border rounded p-3"
        />

        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border rounded p-3"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Search Hospitals
        </button>

        <button
          type="button"
          onClick={handleEmergencySearch}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
        >
          🚨 Emergency Search
        </button>
      </form>
    </div>
  );
}

export default SearchForm;