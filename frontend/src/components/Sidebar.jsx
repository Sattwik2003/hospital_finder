import { Link, NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
      <Link to="/" className="flex items-center space-x-3 mb-8 hover:opacity-90 transition">
        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">HA</div>
        <div>
          <div className="text-sm font-semibold">St. Marina AI</div>
          <div className="text-xs text-slate-400">Precision Care Unit</div>
        </div>
      </Link>

      <nav className="space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-700 hover:bg-slate-100"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/ai-search"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-700 hover:bg-slate-100"
            }`
          }
        >
          AI Checker
        </NavLink>
        <a className="flex items-center px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100">Patient Records</a>
        <a className="flex items-center px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100">Analytics</a>
        <a className="flex items-center px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100">Consultations</a>
      </nav>

      <div className="mt-8">
        <button className="w-full bg-red-600 text-white px-4 py-2 rounded">Emergency</button>
      </div>
    </div>
  );
}
