import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getHospitals } from "../services/hospitalService";
import Sidebar from "../components/Sidebar";

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const specialtyMatches = (hospitalSpecialty, selectedSpecialty) => {
  const hospitalValue = normalizeText(hospitalSpecialty);
  const selectedValue = normalizeText(selectedSpecialty);

  if (!hospitalValue || !selectedValue) {
    return false;
  }

  return hospitalValue
    .split(",")
    .map((item) => item.trim())
    .some((item) => normalizeText(item) === selectedValue || normalizeText(item).includes(selectedValue));
};

const getDisplayedSpecialty = (hospitalSpecialty, selectedSpecialty) => {
  const selectedValue = normalizeText(selectedSpecialty);
  const specialties = String(hospitalSpecialty || "")
    .split(",")
    .map((item) => item.replace(/\\n/g, " ").trim())
    .filter(Boolean);

  if (!selectedValue) {
    return specialties[0] || "General Medicine";
  }

  const exactMatch = specialties.find(
    (item) => normalizeText(item) === selectedValue
  );

  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = specialties.find((item) =>
    normalizeText(item).includes(selectedValue)
  );

  return partialMatch || specialties[0] || "General Medicine";
};



function Results() {
  const [hospitals, setHospitals] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [distance, setDistance] = useState(20);
  const [selectedSpecialties, setSelectedSpecialties] = useState(new Set());
  const [sortBy, setSortBy] = useState("score");

  const location = useLocation();

  const {
    specialty = "",
    city = "",
    budget = 0,
    emergencyOnly = false,
  } = location.state || {};

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);

      const allHospitals = await getHospitals();

      let hospitalsToProcess = allHospitals;

      if (emergencyOnly) {
        hospitalsToProcess = allHospitals.filter(
          (hospital) => hospital.emergency === true
        );
      }

      const rankedHospitals = hospitalsToProcess
        .map((hospital) => {
          let score = 0;
          let reasons = [];
          const displayedSpecialty = getDisplayedSpecialty(hospital.specialty, specialty);

          if (specialty && specialtyMatches(hospital.specialty, specialty)) {
            score += 60;
            reasons.push("Specialty Match");
          }

          if (
            city &&
            hospital.city?.toLowerCase() === city.toLowerCase()
          ) {
            score += 20;
            reasons.push("City Match");
          }

          if (
            budget > 0 &&
            hospital.avgCost <= budget
          ) {
            score += 10;
            reasons.push("Within Budget");
          }

          if (emergencyOnly) {
            score += 50;
            reasons.push("Emergency Available");
          }

          score += hospital.rating * 2;

          return {
            ...hospital,
            score,
            reasons,
            displayedSpecialty,
          };
        })
        .filter((hospital) => hospital.score > 0)
        .sort((a, b) => b.score - a.score);

      setHospitals(rankedHospitals);
      setAllHospitals(rankedHospitals);
      setFilteredHospitals(rankedHospitals);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [specialty, city, budget, emergencyOnly]);

if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="text-center">

        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>

        <p className="mt-4 text-lg font-semibold text-gray-700">
          Finding the best hospitals...
        </p>

      </div>
    </div>
  );
}

if (!loading && hospitals.length === 0) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow-lg text-center">

        <h2 className="text-2xl font-bold text-red-600">
          No Hospitals Found
        </h2>

        <p className="text-gray-600 mt-3">
          Try changing your search criteria.
        </p>

      </div>

    </div>
  );
}

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">

        {/* Filters / left column */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-8 space-y-6">
            <Sidebar />

            <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>

            <div className="mb-4">
              <label className="text-sm text-slate-600">Distance</label>
              <input type="range" min="0" max="50" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full" />
              <div className="text-xs text-slate-500 mt-1">Within {distance} miles</div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-slate-600">Specialty</label>
              <div className="mt-2 space-y-2">
                <div>
                  <input type="checkbox" id="cardio" checked={selectedSpecialties.has("Cardiology")} onChange={(e) => {
                    const s = new Set(selectedSpecialties);
                    if (e.target.checked) s.add("Cardiology"); else s.delete("Cardiology");
                    setSelectedSpecialties(s);
                  }} /> <label className="ml-2">Cardiology</label>
                </div>
                <div>
                  <input type="checkbox" id="neuro" checked={selectedSpecialties.has("Neurology")} onChange={(e) => {
                    const s = new Set(selectedSpecialties);
                    if (e.target.checked) s.add("Neurology"); else s.delete("Neurology");
                    setSelectedSpecialties(s);
                  }} /> <label className="ml-2">Neurology</label>
                </div>
                <div>
                  <input type="checkbox" id="ortho" checked={selectedSpecialties.has("Orthopedics")} onChange={(e) => {
                    const s = new Set(selectedSpecialties);
                    if (e.target.checked) s.add("Orthopedics"); else s.delete("Orthopedics");
                    setSelectedSpecialties(s);
                  }} /> <label className="ml-2">Orthopedics</label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => {
                // apply filters
                let list = allHospitals.slice();
                if (selectedSpecialties.size > 0) {
                  list = list.filter((hospital) =>
                    [...selectedSpecialties].some((selectedSpecialty) =>
                      specialtyMatches(hospital.specialty, selectedSpecialty)
                    )
                  );
                }
                // distance filter placeholder: if h.distance exists
                list = list.filter(h => !h.distance || h.distance <= distance);

                // sort
                if (sortBy === 'rating') list.sort((a,b) => b.rating - a.rating);
                else if (sortBy === 'cost') list.sort((a,b) => a.avgCost - b.avgCost);
                else list.sort((a,b) => b.score - a.score);

                setFilteredHospitals(list);
              }}>Apply</button>
            </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold">AI Recommendation</h4>
              <p className="text-sm text-slate-500 mt-2">Based on your query, Metro General has the highest success rate...</p>
              <div className="mt-3">
                <button className="text-sm text-blue-600">View Data Sources →</button>
              </div>
            </div>
          </div>
        </aside>

        {/* Results list */}
        <main className="col-span-12 lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Search Results</h1>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-slate-500">Sort by</div>
              <select className="border rounded p-2" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="score">Match Score</option>
                <option value="rating">Rating</option>
                <option value="cost">Est. Cost</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredHospitals.map((h) => (
              <div key={h.id} className="bg-white rounded-xl shadow p-4 flex items-start gap-4">
                <div className="w-28 h-20 bg-gray-100 rounded flex items-center justify-center text-slate-400">Img</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{h.name}</h3>
                      <div className="text-sm text-slate-500">{h.city} • {h.distance ?? '—'} miles</div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-500 font-semibold">⭐ {h.rating}</div>
                      <div className="text-sm text-slate-500">Est. cost ₹{h.avgCost}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    {h.emergency && <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Emergency</div>}
                    {h.icu && <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">ICU</div>}
                    <div className="text-sm text-slate-600">{h.displayedSpecialty}</div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => navigate(`/hospital/${h.id}`)} className="bg-blue-600 text-white px-4 py-2 rounded">View Details</button>
                    <a href={`tel:${h.phone}`} className="px-4 py-2 border rounded text-slate-700">Call</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Results;