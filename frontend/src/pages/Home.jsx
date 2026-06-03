import { Link, useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

function SpecialtyCard({ title, subtitle, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-start space-x-4">
      <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">{icon}</div>
      <div>
        <div className="text-lg font-semibold text-slate-800">{title}</div>
        <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  function HeroSearch() {
    const doSearch = () => {
      navigate("/results", { state: { specialty: query, city: location } });
    };

    return (
      <div className="bg-white rounded-2xl shadow p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            placeholder="Condition, specialty, or doctor name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border rounded-lg p-4 shadow-sm focus:ring-2 focus:ring-blue-200"
          />
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-48 border rounded-lg p-3">
            <option value="">Current Location</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Howrah">Howrah</option>
          </select>
          <button onClick={doSearch} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Find Care →</button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-12 gap-8">

        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="sticky top-8">
            <Sidebar />
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Precision care begins with intelligent insights.</h1>
            <p className="text-slate-500 mt-3">Search top specialists, analyze symptoms instantly, or access emergency protocols with clinical accuracy.</p>
          </header>

          {/* Hero search */}
          <HeroSearch />

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="col-span-1 md:col-span-1">
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 h-full">
                <div className="text-red-700 font-semibold">Emergency Care</div>
                <div className="text-sm text-red-600 mt-2">Immediate life threatening conditions or severe injuries.</div>
                <div className="mt-6">
                  <a href="tel:911" className="inline-block bg-red-600 text-white px-4 py-2 rounded">Call 911 / ER Directions</a>
                </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 h-full flex items-center justify-between">
                <div>
                  <div className="text-slate-800 font-semibold">AI Symptom Checker</div>
                  <div className="text-sm text-slate-600 mt-2">Input your symptoms for a preliminary, clinically-informed analysis powered by our model.</div>
                </div>
                <div>
                  <Link to="/ai-search" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg shadow">Start Assessment →</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Featured specialties */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Featured Specialties</h2>
              <a className="text-sm text-blue-600">View Full Directory →</a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <SpecialtyCard title="Cardiology" subtitle="Heart & Vascular" icon="❤" />
              <SpecialtyCard title="Neurology" subtitle="Brain & Nerves" icon="🧠" />
              <SpecialtyCard title="Pediatrics" subtitle="Child Healthcare" icon="👶" />
              <SpecialtyCard title="Orthopedics" subtitle="Bones & Joints" icon="🦴" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Home;