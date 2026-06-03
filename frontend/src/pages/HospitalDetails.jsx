import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import Sidebar from "../components/Sidebar";

function HospitalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    const loadHospital = async () => {
      try {
        const docRef = doc(db, "hospitals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHospital({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadHospital();
  }, [id]);

  if (!hospital) {
    return (
      <div className="p-10 text-xl">Loading...</div>
    );
  }

  const emergencyPhone = hospital.emergencyPhone || hospital.phone || "";
  const mapsQuery = encodeURIComponent(hospital.address || `${hospital.name} ${hospital.city}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="sticky top-8">
            <Sidebar />
          </div>
        </aside>

        <div className="col-span-12 md:col-span-9 lg:col-span-6">
          <button onClick={() => navigate(-1)} className="mb-6 px-3 py-2 bg-slate-100 rounded hover:bg-slate-200">← Back</button>

          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm text-slate-500">VERIFIED FACILITY</div>
                <h1 className="text-3xl font-extrabold text-slate-900">{hospital.name}</h1>
                <div className="text-sm text-slate-500 mt-2">A leading tertiary care center providing advanced surgical, medical, and emergency services.</div>
                <div className="mt-4 flex items-center gap-3">
                  <a href={`tel:${emergencyPhone}`} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">Call Emergency</a>
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border px-4 py-2 rounded text-slate-700">Directions</a>
                </div>
              </div>

              <div className="w-56 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-slate-400">Map</div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">ADDRESS</div>
                <div className="text-sm font-medium mt-1">{hospital.address}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded">
                <div className="text-xs text-slate-500">HOURS</div>
                <div className="text-sm font-medium mt-1">Emergency: 24/7</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white rounded-xl p-6 shadow">
              <h3 className="font-semibold mb-3">AI Facility Insights</h3>
              <div className="text-sm text-slate-500 mb-4">Current wait time (ER)</div>
              <div className="text-2xl font-bold text-green-600">~45 min</div>
              <div className="mt-4 text-sm text-slate-500">ICU Capacity • {hospital.icu ? 'Occupied' : 'Available'}</div>
            </div>

            <aside className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold">Facility Details</h4>
              <div className="mt-3 text-sm text-slate-600">
                <div>Total Beds: {hospital.totalBeds ?? '—'}</div>
                <div>Trauma Center: {hospital.traumaLevel ?? '—'}</div>
                <div>Helipad: {hospital.helipad ? 'Yes' : 'No'}</div>
                <div>Teaching Hospital: {hospital.teaching ? 'Yes' : 'No'}</div>
              </div>
            </aside>
          </div>

          <div className="mt-6 bg-white rounded-xl p-6 shadow">
            <h4 className="font-semibold mb-4">Top Specialties</h4>
            <div>
              {/* Normalize specialty input (string or array) and render as bulleted list */}
              {(() => {
                const raw = hospital.topSpecialties && Array.isArray(hospital.topSpecialties)
                  ? hospital.topSpecialties
                  : (hospital.topSpecialties || hospital.specialty || "");

                const items = (Array.isArray(raw) ? raw : String(raw))
                  .split(/,|\\n|\n/)
                  .map((s) => s.replace(/\\n/g, " ").trim())
                  .filter(Boolean);

                if (items.length === 0) {
                  return <div className="text-sm text-slate-600">General Medicine</div>;
                }

                return (
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                    {items.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-xl p-4 shadow sticky top-8">
            <div className="w-full h-48 bg-gray-100 rounded mb-4 flex items-center justify-center text-slate-400">Map Preview</div>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="block w-full text-center bg-white border rounded py-2">Open in Maps</a>

            <div className="mt-4 bg-slate-50 p-4 rounded">
              <div className="text-sm text-slate-500">Avg Cost Index</div>
              <div className="mt-2 font-semibold">₹{hospital.avgCost ?? '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalDetails;